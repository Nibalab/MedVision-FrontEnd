import React from 'react';
import './ChatWindow.css'; // Use the scoped CSS

const ChatWindow = ({ messages, currentChat }) => {
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

      {/* Message container, where messages from the receiver appear on the left and sender on the right */}
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.sender_id === currentChat.id ? 'receiver' : 'sender'
            }`}
          >
            <div className="message-bubble">
              <p>{message.message_text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input area for sending messages */}
      <div className="message-input-container">
        <input type="text" className="message-input" placeholder="Type here ..." />
        <button className="send-button">Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
