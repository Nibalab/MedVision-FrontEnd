import React, { useState } from 'react';

const ChatWindow = ({ messages, currentChat, socket }) => {
  const [newMessage, setNewMessage] = useState('');

  // Handle sending a message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        sender_id: currentChat.sender_id,
        receiver_id: currentChat.receiver_id,
        message_text: newMessage,
      };

      // Emit the message to Socket.IO server
      socket.emit('message', messageData);

      // Optionally, save the message to the backend using axios

      setNewMessage('');  // Clear input field
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <img src={currentChat.profile_picture || '/path/to/default-profile.jpg'} alt={currentChat.name} className="chat-avatar" />
        <h4>{currentChat.name}</h4>
      </div>

      <div className="message-history">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender_id === currentChat.sender_id ? 'sent' : 'received'}`}>
            <p>{msg.message_text}</p>
          </div>
        ))}
      </div>

      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
