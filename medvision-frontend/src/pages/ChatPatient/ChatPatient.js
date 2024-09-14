import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import MessageList from '../../components/MessageList/MessageList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import './ChatPatient.css';

const socket = io('http://localhost:3001');

const ChatPatient = () => {
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  
  const fetchPatientInfo = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user && response.data.user.id) {
          console.log('Fetched patient ID:', response.data.user.id);
          setPatientId(response.data.user.id); 
        } else {
          console.error('Error: No valid patient ID found in the response.');
        }
      } catch (error) {
        console.error('Error fetching patient info:', error);
      }
    } else {
      console.error('Token not found in localStorage');
    }
  };

  const fetchChats = useCallback(async () => {
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/doctors/search', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          name: searchQuery,
        },
      });

      const doctors = response.data;
      const chatList = doctors.map((doctor) => ({
        id: doctor.id,
        type: 'doctor',
        name: doctor.name,
        profile_picture: doctor.profile_picture || '/default-avatar.png',
        last_message: 'Start chatting...',
        unread_count: 0,
      }));

      setChats(chatList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);
    }
  }, [searchQuery]);


  

  const fetchMessages = async (doctorId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/messages', {
        params: {
          sender_id: patientId,  
          receiver_id: doctorId, 
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const fetchedMessages = response.data.messages.reverse(); 
      const selectedDoctor = chats.find(chat => chat.id === doctorId); 

      setCurrentChat({
        id: selectedDoctor.id,
        name: selectedDoctor.name,
        profile_picture: selectedDoctor.profile_picture || '/default-avatar.png',
        type: 'doctor',
      });
  
      setMessages(fetchedMessages);
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
    if (!currentChat || !currentChat.id || !messageText.trim() || isNaN(patientId)) {
      console.error('Missing required fields or invalid patientId:', { currentChat, messageText, patientId });
      return;
    }
  
    const token = localStorage.getItem('token');
  
    try {
      // Send the message to the backend
      const response = await axios.post(
        'http://127.0.0.1:8000/api/patient/messages',
        {
          sender_id: Number(patientId),
          receiver_id: Number(currentChat.id),
          message_text: messageText.trim(),
          sender_type: 'user',
          receiver_type: 'doctor',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
  
      const newMessage = response.data;
      addNewMessage(newMessage);

      const chatExists = chats.some((chat) => chat.id === currentChat.id);
      if (!chatExists) {
        const newChat = {
          id: currentChat.id,
          name: currentChat.name,
          profile_picture: currentChat.profile_picture,
          last_message: newMessage.message_text,
          unread_count: 0, // No unread messages since we are the sender
        };
  
        setChats((prevChats) => [...prevChats, newChat]);
      } else {
        // Update the last message for the existing chat
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChat.id
              ? { ...chat, last_message: newMessage.message_text }
              : chat
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  


  

 useEffect(() => {
  fetchPatientInfo();  // Fetch the patient info when the component mounts
  fetchChats();        // Fetch the chats when the component mounts
}, [fetchChats]);  // Add fetchChats to the dependency array

  

useEffect(() => {
  socket.on('message', (newMessage) => {
    if (currentChat && newMessage.sender_id === currentChat.id) {
      addNewMessage(newMessage);
    } else {
      // Increment the unread count for the chat if it's not the current chat
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === newMessage.sender_id || chat.id === newMessage.receiver_id
            ? { ...chat, unread_count: (chat.unread_count || 0) + 1 }
            : chat
        )
      );
    }
  });

  return () => {
    socket.off('message');
  };
}, [currentChat]);


  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return (
    <div className="chat-patient-page">
      <Navbar />
      <div className="chat-patient-container">
        <div className="chat-patient-list">
          <input
            type="text"
            placeholder="Search for a doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="chat-patient-search-bar"
          />
          {loading ? (
            <div>Loading...</div>
          ) : (
            <MessageList chats={chats} fetchMessages={fetchMessages} />
          )}
        </div>
        <div className="chat-patient-window">
          {currentChat ? (
            <ChatWindow
            messages={messages}
            currentChat={currentChat}
            addNewMessage={addNewMessage}
            senderId={patientId}       
            senderType="user"          
            receiverType="doctor"      
            sendMessage={sendMessage}   
          />
          
          ) : (
            <div className="chat-patient-no-chat-selected">Select a doctor to start chatting</div>
          )}
        </div>
      </div>
      <Footer className="chat-patient-footer" />
    </div>
  );
};

export default ChatPatient;
