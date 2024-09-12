import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
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

    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setPatientId(decodedToken.id || decodedToken.sub); 
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    // Fetch doctors or existing chat conversations
    const fetchChats = useCallback(async () => {
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

    // Fetch messages for the selected doctor
    const fetchMessages = async (doctorId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8000/api/messages', {
                params: {
                    receiver_type: 'doctor',
                    receiver_id: doctorId,
                    sender_id: patientId,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const fetchedMessages = response.data.messages.reverse(); // Show newest at the bottom
            setMessages(fetchedMessages);

            setCurrentChat({
                id: doctorId,
                name: fetchedMessages[0]?.sender_name || 'Unknown Doctor',
                profile_picture: fetchedMessages[0]?.sender_profile_picture || '/default-avatar.png',
                type: 'doctor',
            });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const addNewMessage = (newMessage) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    const sendMessage = async (messageText) => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.post(
                'http://localhost:8000/api/messages',
                {
                    sender_id: patientId,
                    receiver_id: currentChat.id,
                    message_text: messageText,
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
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    
    useEffect(() => {
        socket.on('message', (newMessage) => {
            if (currentChat && newMessage.sender_id === currentChat.id) {
                addNewMessage(newMessage);
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
            <div className="chat-container">
                <div className="chat-list">
                    <input
                        type="text"
                        placeholder="Search for a doctor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-bar"
                    />
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
                            addNewMessage={addNewMessage}
                            patientId={patientId}
                            sendMessage={sendMessage}
                        />
                    ) : (
                        <div className="no-chat-selected">Select a doctor to start chatting</div>
                    )}
                </div>
            </div>
            <Footer /> 
        </div>
    );
};

export default ChatPatient;
