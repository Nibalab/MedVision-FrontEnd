import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import axios from 'axios';
import io from 'socket.io-client';
import { AiOutlinePaperClip } from 'react-icons/ai'; 

// Initialize the socket outside of the component to avoid multiple connections
const socket = io('http://localhost:3001'); 

const ChatWindow = ({ messages, currentChat, addNewMessage, doctorId }) => {
  const [newMessage, setNewMessage] = useState(''); // State for message input
  const [attachment, setAttachment] = useState(null); // State for file attachment
  const messagesEndRef = useRef(null); // Reference for scrolling to the bottom

  // Scroll to the bottom of the chat window when new messages are added or the chat changes
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Scroll to the bottom when messages or chat changes
    scrollToBottom();
  }, [messages, currentChat]);

  // Listen for new messages via socket
  useEffect(() => {
    // Ensure that messages from the correct chat are added
    socket.on('message', (message) => {
      if (message.sender_id !== doctorId && message.sender_id === currentChat.id) {
        addNewMessage(message); // Only add if the message is for the current chat
      }
    });

    // Cleanup socket event on unmount or when currentChat changes
    return () => {
      socket.off('message');
    };
  }, [addNewMessage, doctorId, currentChat]);

  // Send a message function (backend integration)
  const sendMessage = async (messageText, senderId, receiverId, senderType = 'doctor', receiverType = 'user', attachment = null) => {
    const token = localStorage.getItem('token'); 

    // Ensure senderId and receiverId are integers
    const senderIdInt = parseInt(senderId, 10);
    const receiverIdInt = parseInt(receiverId, 10);

    const formData = new FormData();
    formData.append('message_text', messageText);
    formData.append('sender_id', senderIdInt); 
    formData.append('receiver_id', receiverIdInt); 
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

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (newMessage.trim() === '' && !attachment) return;

    const messageData = {
      message_text: newMessage,
      sender_id: doctorId,  
      receiver_id: currentChat.id,  
      created_at: new Date().toISOString(),
      is_read: false,
    };

    // Send the message to the backend
    await sendMessage(newMessage, doctorId, currentChat.id, 'doctor', currentChat.type, attachment);

    // Emit the new message via Socket.IO
    socket.emit('message', messageData);

    // Append the new message to the chat (locally)
    addNewMessage(messageData);

    // Clear the input field and attachment after sending
    setNewMessage('');
    setAttachment(null);
  };

  // Handle file attachment change
  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file); 
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
        <h3 className="chat-participant-name">
          {currentChat.name || 'Unknown Sender'}
        </h3>
      </div>

      {/* Message container */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${message.sender_id === doctorId ? 'sender' : 'receiver'}`}
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
        <label className="attachment-label">
          <AiOutlinePaperClip size={24} />
          <input type="file" onChange={handleAttachmentChange} className="attachment-input" />
        </label>
        
        <input
          type="text"
          className="message-input"
          placeholder="Type here ..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
