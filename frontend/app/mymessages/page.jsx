"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const ChatUI = () => {
  const currentUserId = JSON.parse(localStorage.getItem("user"))._id; // Replace with auth user ID

  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const messageEndRef = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch(`http://localhost:5000/messages/chats/${currentUserId}`);
        const data = await res.json();
        if (data.success) {
          setContacts(data.users);
        }
      } catch (err) {
        console.error('Failed to fetch contacts:', err);
      }
    };
    fetchContacts();
  }, []);
  
  // ✅ Naya effect: pehla contact default select ho
  useEffect(() => {
    if (contacts.length > 0 && !activeContact) {
      handleContactClick(contacts[0]);
    }
  }, [contacts]);
  

  const handleContactClick = async (contact) => {
    setActiveContact(contact);

    try {
      const res = await fetch(
        `http://localhost:5000/messages/conversation/${currentUserId}/${contact._id}`
      );
      const data = await res.json();
      if (data.success) {
        const formattedMessages = data.messages.map((msg) => ({
          id: msg._id,
          sender: msg.sender === currentUserId ? 'user' : 'provider',
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          read: true,
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !activeContact) return;

    const newMsg = {
      senderId: currentUserId,
      receiverId: activeContact._id,
      message: newMessage,
    };

    try {
      const res = await fetch('http://localhost:5000/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMsg),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.data._id,
            sender: 'user',
            text: data.data.message,
            time: new Date(data.data.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
            read: false,
          },
        ]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <div className="flex h-[82vh] bg-gray-100">
      <div className="w-1/4 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        {contacts.map((contact) => (
          <motion.div
            key={contact._id}
            onClick={() => handleContactClick(contact)}
            className={`flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 mb-2 ${
              activeContact?._id === contact._id ? 'bg-blue-50' : 'hover:bg-gray-200'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl mr-3">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{contact.name}</h3>
              <p className="text-sm text-gray-500 truncate">{contact.email}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {activeContact ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 max-w-xs p-2 rounded-lg ${
                  msg.sender === 'user' ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-gray-300 text-black self-start'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs text-gray-700 block text-right">{msg.time}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10">Select a contact to start chatting.</p>
          )}
          <div ref={messageEndRef} />
        </div>

        <div className="p-4 border-t border-gray-300 flex items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
