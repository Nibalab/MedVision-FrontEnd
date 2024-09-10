import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import axios from 'axios';
import io from 'socket.io-client';

// Initialize the socket outside of the component to avoid multiple connections
const socket = io('http://localhost:3001'); // Adjust this URL to match your server's configuration

const ChatWindow = ({ messages, currentChat, addNewMessage, doctorId }) => {
  const [newMessage, setNewMessage] = useState(''); // State for message input
  const messagesEndRef = useRef(null); // Reference for scrolling to the bottom

  // Debugging doctorId
  useEffect(() => {
    console.log('Doctor ID:', doctorId); // Check if doctorId is passed correctly
  }, [doctorId]);

  // Scroll to the bottom of the chat window when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Scroll to the bottom when the chat is opened or when new messages are added
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for incoming messages from the server
    socket.on('message', (message) => {
      if (message.sender_id !== doctorId) {
        addNewMessage(message); // Add the incoming message to the chat window if it's not from the current user
      }
    });

    // Cleanup the socket event on component unmount
    return () => {
      socket.off('message');
    };
  }, [addNewMessage, doctorId]);

  // Send message function (backend integration)
  const sendMessage = async (messageText, senderId, receiverId, senderType = 'doctor', receiverType = 'user', attachment = null) => {
    const token = localStorage.getItem('token'); // Ensure you're sending the token for authentication
  
    // Log the senderId and receiverId to debug
    console.log('Sender ID (before conversion):', senderId);
    console.log('Receiver ID (before conversion):', receiverId);
  
    // Ensure senderId and receiverId are integers
    const senderIdInt = parseInt(senderId, 10);
    const receiverIdInt = parseInt(receiverId, 10);
  
    // Log after conversion
    console.log('Sender ID (after conversion):', senderIdInt);
    console.log('Receiver ID (after conversion):', receiverIdInt);

    if (isNaN(senderIdInt) || isNaN(receiverIdInt)) {
      console.error('Sender or receiver ID is NaN');
      return null; // Don't attempt to send the message if IDs are invalid
    }
  
    const formData = new FormData();
    formData.append('message_text', messageText);
    formData.append('sender_id', senderIdInt);  // Send sender_id as an integer
    formData.append('receiver_id', receiverIdInt);  // Send receiver_id as an integer
    formData.append('sender_type', senderType);
    formData.append('receiver_type', receiverType);
  
    if (attachment) {
      formData.append('attachment', attachment); // Add attachment if present
    }
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/messages', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Message sent:', response.data);
      return response.data; // Handle response as needed
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error sending message:', error);
      }
      return null;
    }
  };
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      message_text: newMessage,
      sender_id: parseInt(doctorId, 10),  // Ensure sender_id is an integer
      receiver_id: parseInt(currentChat.id, 10),  // Ensure receiver_id is an integer
      created_at: new Date().toISOString(),
      is_read: false,
    };

    console.log('Attempting to send message:', messageData);

    // Send the message to the backend (using the sendMessage function)
    const sentMessage = await sendMessage(newMessage, doctorId, currentChat.id, 'doctor', 'user');

    // Check if the message was successfully sent before proceeding
    if (sentMessage) {
      // Emit the new message via Socket.IO to the server
      socket.emit('message', messageData);

      // Append the new message to the chat (locally)
      addNewMessage({
        ...messageData,
        id: sentMessage.id, // Use the message ID returned from the backend
      });

      // Clear the input field after sending
      setNewMessage(''); // Make sure input is cleared after sending
    } else {
      console.error('Failed to send message');
    }
  };

  return (
    <div className="chat-window-container">
      {/* Header with the chat participant's name and profile picture */}
      <div className="chat-header">
        <img
          src={currentChat.profile_picture || '/path/to/default-profile.jpg'}
          alt={currentChat.name}
          className="profile-picture"
        />
        <h3 className="chat-participant-name">{currentChat.name}</h3>
      </div>

      {/* Message container */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender_id === doctorId ? 'sender' : 'receiver'
            }`}
          >
            <div className="message-bubble">
              <p>{message.message_text}</p>
            </div>
          </div>
        ))}
        {/* Reference div to ensure we always scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area for sending messages */}
      <div className="message-input-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type here ..."
          value={newMessage} // Bind input value to newMessage state
          onChange={(e) => setNewMessage(e.target.value)} // Update newMessage state when input changes
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
