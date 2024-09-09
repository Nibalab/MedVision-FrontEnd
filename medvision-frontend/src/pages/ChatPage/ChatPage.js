import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';
import MessageList from '../../components/MessageList/MessageList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import './ChatPage.css'; 

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null);  // Currently selected chat
  const [chatType, setChatType] = useState('patient');   
  const [messages, setMessages] = useState([]);          
  const [chats, setChats] = useState([]);                
  const [loading, setLoading] = useState(false);         
  const [doctorId, setDoctorId] = useState(null);        
  const [searchQuery, setSearchQuery] = useState('');    

  // Fetch the doctor info using the token
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
  

  // Fetch all chats for the logged-in doctor
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

        const senderType = (chatType === 'patient' && message.sender_type.includes('User'))
          ? 'patient'
          : (chatType === 'doctor' && message.sender_type.includes('Doctor'))
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
  
  // Fetch messages for the selected chat
  const fetchMessages = async (senderId, senderType) => {
    const token = localStorage.getItem('token');

    if (!doctorId || !senderId) {
      console.error('Doctor ID or Sender ID is missing');
      return;
    }

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/messages', {
        params: {
          receiver_type: 'doctor',
          receiver_id: doctorId,
          sender_id: senderId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(response.data.messages);  
      setCurrentChat({ id: senderId, name: response.data.messages[0].sender_name, profile_picture: response.data.messages[0].sender_profile_picture, type: senderType });  // Set the current chat info with profile
    } catch (error) {
      console.error('Error fetching messages:', error);
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
  

  const handleChatTypeSwitch = (type) => {
    setChatType(type);  
    setCurrentChat(null);  
    fetchChats();  
  };

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
              onClick={() => handleChatTypeSwitch('patient')}
            >
              Patients
            </button>
            <button
              className={`tab-button ${chatType === 'doctor' ? 'active' : ''}`}
              onClick={() => handleChatTypeSwitch('doctor')}
            >
              Doctors
            </button>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : (
            <MessageList chats={chats} fetchMessages={fetchMessages} />
          )}
        </div>

        <div className="chat-window">
          {currentChat ? (
            <ChatWindow
              messages={messages}
              currentChat={currentChat}
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
