import React, { useState } from 'react';
import './MessageList.css';

const MessageList = ({ chats, fetchMessages }) => {
  const [activeChatId, setActiveChatId] = useState(null);

  if (!chats.length) {
    return <div>No messages found.</div>;
  }

  return (
    <div className="message-list">
      {chats.map((chat, index) => (
        <div
          key={index}
          className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
          onClick={() => {
            if (chat.id) {
              setActiveChatId(chat.id);
              fetchMessages(chat.id, chat.type);
            }
          }}
        >
          <div className="chat-avatar">
            <img src={chat.profile_picture || '/path/to/default-profile.jpg'} alt={chat.name || 'Unknown'} />
          </div>
          <div className="chat-info">
            <p className="chat-name">{chat.name || 'Unknown Sender'}</p>
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
