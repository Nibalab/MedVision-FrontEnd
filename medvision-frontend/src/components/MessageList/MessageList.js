import React, { useState } from 'react';
import './MessageList.css';

const getProfilePicture = (chat) => {
  if (chat.profile_picture && !chat.profile_picture.startsWith('http')) {
    return `http://localhost:8000/storage/${chat.profile_picture.replace('public/', '')}`;
  }
  return chat.profile_picture || '/default-avatar.png';
};

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
            setActiveChatId(chat.id); // Set active chat
            fetchMessages(chat.id, chat.type); // Fetch messages and update currentChat
          }}
        >
          <div className="chat-avatar">
            <img src={getProfilePicture(chat)} alt={chat.name || 'Unknown'} />
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
