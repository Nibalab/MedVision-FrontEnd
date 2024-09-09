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
      setDoctorId(response.data.user.id);  // Store the doctor ID in state
    } catch (error) {
      console.error('Error fetching doctor information:', error);
    }
  };

  // Fetch the list of chats based on the search query (searching both patients and doctors)
  const fetchChats = useCallback(async () => {
    // Don't make a request if the search query is empty
    if (!searchQuery.trim()) {
      console.warn('Search query is empty');
      return;
    }
  
    setLoading(true);  // Set loading to true before fetching
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/search', {
        params: { query: searchQuery },  // Pass the search query to the search API
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Combine the search results for doctors and users (patients)
      const combinedResults = [
        ...response.data.doctors.map(doctor => ({ ...doctor, name: doctor.doctor_name, type: 'doctor' })),  // Use doctor_name
        ...response.data.patients.map(patient => ({ ...patient, type: 'patient' }))
      ];
  
      setChats(combinedResults);  // Set the combined results as chats
      setLoading(false);  // Set loading to false after fetching
    } catch (error) {
      console.error('Error fetching chats:', error);
      setLoading(false);  // Set loading to false even if there's an error
    }
  }, [searchQuery]);
  

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
          sender_type: senderType,  // The type of the sender (user or doctor)
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
    if (searchQuery) {
      fetchChats();  // Fetch chats once a search query is entered
    }
  }, [searchQuery, fetchChats]);

  const handleChatTypeSwitch = (type) => {
    setChatType(type);  // Update the chat type (patient or doctor)
    setCurrentChat(null);  // Reset the current chat when switching
    fetchChats();  // Fetch chats for the updated type
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim();  // Trim spaces from the input
    setSearchQuery(query);  // Update the search query based on input
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
            onChange={handleSearch} 
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
