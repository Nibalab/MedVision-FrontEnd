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
          onClick={() => fetchMessages(chat.id, chat.type)} // Fetch messages when the chat is clicked
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
