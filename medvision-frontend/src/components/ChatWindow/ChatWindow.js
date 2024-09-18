import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import axios from 'axios';
import io from 'socket.io-client';
import { AiOutlinePaperClip } from 'react-icons/ai';

const socket = io('http://localhost:3001');

const ChatWindow = ({ messages, currentChat, addNewMessage, senderId, senderType, receiverType }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState(null);
  const messagesEndRef = useRef(null);

  const getProfilePicture = (profilePicture) => {
    if (profilePicture && !profilePicture.startsWith('http')) {
      return `http://localhost:8000/storage/${profilePicture.replace('public/', '')}`;
    }
    return profilePicture || '/default-avatar.png';
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentChat]);

  useEffect(() => {
    socket.on('message', (message) => {
      // Ensure message is for the current chat and is either sent to or from the patient
      if (message.receiver_id === senderId || message.sender_id === senderId) {
        addNewMessage(message);
      }
    });
  
    return () => {
      socket.off('message');
    };
  }, [addNewMessage, senderId, currentChat]);
  

  const sendMessage = async (messageText, senderId, receiverId, senderType, receiverType, attachment = null) => {
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('message_text', messageText);
    formData.append('sender_id', parseInt(senderId, 10));
    formData.append('receiver_id', parseInt(receiverId, 10));
    formData.append('sender_type', senderType);
    formData.append('receiver_type', receiverType);

    if (attachment) {
      formData.append('attachment', attachment);
    }

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/${senderType === 'doctor' ? 'messages' : 'patient/messages'}`, // Dynamic endpoint
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' && !attachment) return;
  
    // Optimistically add the message to the chat window
    const messageData = {
      message_text: newMessage,
      sender_id: senderId,
      receiver_id: currentChat.id,
      created_at: new Date().toISOString(),
      is_read: false,
    };
  
    // Optimistically update the UI
    addNewMessage(messageData);
  
    try {
      // Send the message to the server
      const response = await sendMessage(newMessage, senderId, currentChat.id, senderType, receiverType, attachment);
  
      // Emit the message via the socket once successfully saved on the server
      socket.emit('message', response);
  
      // Clear the input fields
      setNewMessage('');
      setAttachment(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  const handleAttachmentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };



  return (
    <div className="chat-window-container">
      <div className="chat-header">
        <img
          src={getProfilePicture(currentChat.profile_picture)}
          alt={currentChat.name}
          className="profile-picture"
        />
        <h3 className="chat-participant-name">{currentChat.name || 'Unknown Sender'}</h3>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.sender_id === senderId ? 'sender' : 'receiver'}`}>
            <div className="message-bubble">
              <p>{message.message_text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

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
