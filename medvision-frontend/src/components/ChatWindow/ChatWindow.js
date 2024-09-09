import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import io from 'socket.io-client';

// Initialize the socket outside of the component to avoid multiple connections
const socket = io('http://localhost:3001'); // Adjust this URL to match your server's configuration

const ChatWindow = ({ messages, currentChat, addNewMessage, doctorId }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null); // Reference for scrolling to the bottom

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

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      message_text: newMessage,
      sender_id: doctorId,  // The sender is the logged-in doctor
      receiver_id: currentChat.id,  // The receiver is the current chat's ID
      created_at: new Date().toISOString(),
      is_read: false,
    };

    // Emit the new message via Socket.IO to the server
    socket.emit('message', messageData);

    // Append the new message to the chat (locally)
    addNewMessage(messageData);

    // Clear the input field after sending
    setNewMessage('');
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
