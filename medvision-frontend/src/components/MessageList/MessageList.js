import React from 'react';
import './MessageList.css'; // Import the CSS file for styles

const MessageList = ({ chats, fetchMessages }) => {
  if (!chats.length) {
    return <div>No messages found.</div>;
  }

  return (
    <div className="message-list">
      {chats.map((chat, index) => (
        <div
          key={index}
          className="chat-item"
          onClick={() => {
            console.log('Clicked chat:', chat);  // Log to ensure id is present
            if (chat.id) {  // Check if id is defined before calling fetchMessages
              fetchMessages(chat.id, chat.type);
            } else {
              console.error('Sender ID is missing in chat object:', chat);
            }
          }}
        >
          <div className="chat-avatar">
            <img src={chat.profile_picture || '/path/to/default-profile.jpg'} alt={chat.name} />
          </div>
          <div className="chat-info">
            <p className="chat-name">{chat.name}</p>
            <p className="chat-message">{chat.last_message || 'No messages yet'}</p>
          </div>
          {chat.unread_count > 0 && (
            <div className="chat-notification-dot">
              <span>{chat.unread_count}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


export default MessageList;