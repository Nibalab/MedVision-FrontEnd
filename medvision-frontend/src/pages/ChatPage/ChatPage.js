import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar/Sidebar';  // Import Sidebar component
import MessageList from '../../components/MessageList/MessageList';
import ChatWindow from '../../components/ChatWindow/ChatWindow';
import './ChatPage.css'; // Import the CSS file for styles

const ChatPage = () => {
  const [currentChat, setCurrentChat] = useState(null);  // Currently selected chat
  const [chatType, setChatType] = useState('patient');   // 'patient' or 'doctor'
  const [messages, setMessages] = useState([]);          // Current chat messages
  const [chats, setChats] = useState([]);                // List of chats (users)
  const [loading, setLoading] = useState(false);         // Loading state
  const [doctorId, setDoctorId] = useState(null);        // Store the doctor ID from the API response
  const [searchQuery, setSearchQuery] = useState('');    // Store the search query

  // Fetch the doctor info using the token
  const fetchDoctorInfo = async () => {
    const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage
  
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.user && response.data.user.id) {
        setDoctorId(response.data.user.id);  // Store the doctor ID in state
        console.log('Doctor ID:', response.data.user.id);  // Check if Doctor ID is set properly
      } else {
        console.error('No doctor ID in the response');
      }
    } catch (error) {
      console.error('Error fetching doctor information:', error);
    }
  };
  

  // Fetch all chats for the logged-in doctor
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
      const senderId = message.sender_id;  // Use the sender_id from the response

      if (!senderId) {
        console.error('Sender ID is missing in message:', message);
        return;
      }

      // Determine sender type based on whether chatType is 'patient' or 'doctor'
      const senderType = (chatType === 'patient' && message.sender_type.includes('User'))
        ? 'patient'
        : (chatType === 'doctor' && message.sender_type.includes('Doctor'))
        ? 'doctor'
        : null;

      // Only process the messages that match the current chatType
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
          receiver_type: 'doctor',  // The receiver is the doctor
          receiver_id: doctorId,    // The logged-in doctor's ID
          sender_id: senderId,      // The sender's ID (user or doctor)
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessages(response.data.messages);  // Set the messages for the selected chat
      setCurrentChat({ id: senderId, type: senderType });  // Set the current chat info
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
};

  
  

  useEffect(() => {
    fetchDoctorInfo();  // Fetch the doctor's info on component mount
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchChats();  // Fetch chats once the doctorId is available
    }
  }, [doctorId, chatType, fetchChats]);  // Include chatType and fetchChats in the dependency array
  

  const handleChatTypeSwitch = (type) => {
    setChatType(type);  // Update the chat type (patient or doctor)
    setCurrentChat(null);  // Reset the current chat when switching
    fetchChats();  // Fetch chats for the updated type
  };

  return (
    <div className="chat-page">
      <Sidebar />
      <div className="chat-content">
        <div className="chat-list">
          {/* Search Bar */}
          <input 
            type="text" 
            placeholder="Search by name..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value.trim())} 
            className="search-bar"
          />

          {/* Tabs for switching between patients and doctors */}
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

          {/* Loading Spinner */}
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
