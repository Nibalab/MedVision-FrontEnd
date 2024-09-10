import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client'; 
import Sidebar from '../../components/Sidebar/Sidebar';
import MessageList from '../../components/MessageList/MessageList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import './ChatPage.css';

const socket = io('http://localhost:3001');

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null); // Track the selected chat
  const [chatType, setChatType] = useState('patient');   
  const [messages, setMessages] = useState([]);          
  const [chats, setChats] = useState([]);                
  const [loading, setLoading] = useState(false);         
  const [doctorId, setDoctorId] = useState(null);        
  const [searchQuery, setSearchQuery] = useState('');    

  const fetchDoctorInfo = async () => {
    const token = localStorage.getItem('token');  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.user && response.data.user.id) {
        setDoctorId(response.data.user.id); 
      } else {
        console.error('No doctor ID in the response');
      }
    } catch (error) {
      console.error('Error fetching doctor information:', error);
    }
  };

  const markMessageAsRead = async (messageId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://127.0.0.1:8000/api/messages/${messageId}/read`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const fetchChats = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const messages = response.data.messages;
      const chatMap = {};
  
      messages.forEach((message) => {
        const senderId = message.sender_id; 
        if (!senderId) {
          console.error('Sender ID is missing in message:', message);
          return;
        }
        const senderType = (chatType === 'patient' && message.sender_type && message.sender_type.includes('User'))
          ? 'patient'
          : (chatType === 'doctor' && message.sender_type && message.sender_type.includes('Doctor'))
          ? 'doctor'
          : null;

        if (senderType) {
          if (!chatMap[senderId]) {
            chatMap[senderId] = {
              id: senderId,
              type: senderType,
              name: message.sender_name || 'Unknown Sender',
              profile_picture: message.sender_profile_picture || "/path/to/default-profile.jpg",
              last_message: message.message_text,
              unread_count: message.is_read === 0 ? 1 : 0,
            };
          } else {
            chatMap[senderId].last_message = message.message_text;
            if (message.is_read === 0) {
              chatMap[senderId].unread_count += 1;
            }
          }
        }
      });
  
      const chatList = Object.values(chatMap);
      setChats(chatList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  }, [chatType]);

  const fetchMessages = async (senderId, senderType) => {
    const token = localStorage.getItem('token');
    
    if (!doctorId || !senderId) {  // Ensure doctorId and senderId are not null
      console.error('Doctor ID or Sender ID is missing');
      return;
    }
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/messages', {
        params: {
          receiver_type: 'doctor',  // Correct receiver type
          receiver_id: doctorId,    // Receiver ID is the doctor
          sender_id: senderId,      // Sender ID must be passed
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const fetchedMessages = response.data.messages.reverse(); // Newest at the bottom
      setMessages(fetchedMessages);
  
      fetchedMessages.forEach((message) => {
        if (!message.is_read) {
          markMessageAsRead(message.id);
        }
      });
  
      setCurrentChat({
        id: senderId,
        name: fetchedMessages[0]?.sender_name || 'Unknown Sender',
        profile_picture: fetchedMessages[0]?.sender_profile_picture || '/path/to/default-profile.jpg',
        type: senderType,
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  
  
  

  const addNewMessage = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === newMessage.sender_id || chat.id === newMessage.receiver_id
          ? { ...chat, last_message: newMessage.message_text }
          : chat
      )
    );
  };

  const sendMessage = async (messageText) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/messages', {
        sender_id: doctorId,
        receiver_id: currentChat.id,
        message_text: messageText,
        sender_type: 'doctor',
        receiver_type: currentChat.type,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const newMessage = response.data;
      addNewMessage(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchDoctorInfo();  
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchChats();  
    }
  }, [doctorId, chatType, fetchChats]);

  useEffect(() => {
    socket.on('message', (newMessage) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === newMessage.sender_id || chat.id === newMessage.receiver_id
            ? { ...chat, last_message: newMessage.message_text }
            : chat
        )
      );
      if (currentChat && newMessage.sender_id === currentChat.id) {
        addNewMessage(newMessage);
      }
    });
    return () => {
      socket.off('message');
    };
  }, [currentChat]);

  return (
    <div className="chat-page">
      <Sidebar />
      <div className="chat-content">
        <div className="chat-list">
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value.trim())} 
            className="search-bar"
          />
          <div className="chat-tabs">
            <button
              className={`tab-button ${chatType === 'patient' ? 'active' : ''}`}
              onClick={() => setChatType('patient')}
            >
              Patients
            </button>
            <button
              className={`tab-button ${chatType === 'doctor' ? 'active' : ''}`}
              onClick={() => setChatType('doctor')}
            >
              Doctors
            </button>
          </div>
          {loading ? <div>Loading...</div> : <MessageList chats={chats} fetchMessages={fetchMessages} />}
        </div>
        <div className="chat-window">
          {currentChat ? (
            <ChatWindow
              messages={messages}
              currentChat={currentChat} // Pass currentChat to ChatWindow
              addNewMessage={addNewMessage}
              doctorId={doctorId}
              sendMessage={sendMessage}
              reverseMessages={true}
            />
          ) : (
            <div className="no-chat-selected">Select a conversation to start</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
