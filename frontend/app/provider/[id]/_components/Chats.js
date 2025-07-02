"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Chats({ senderId, receiverId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch conversation when component mounts or IDs change
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/messages/conversation/${senderId}/${receiverId}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (senderId && receiverId) fetchMessages();
  }, [senderId, receiverId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const newMsgData = {
      senderId,
      receiverId,
      message: newMessage
    };

    try {
      const res = await axios.post("http://localhost:5000/messages/send", newMsgData);
      setMessages((prev) => [...prev, res.data.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-[500px]">
  {/* Messages list */}
  <div className="flex-1 overflow-y-auto pr-3 space-y-4 mb-4">
    {messages.length === 0 ? (
      <div className="text-center text-gray-500 text-lg mt-6">No messages yet</div> // If no messages, show this
    ) : (
      messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.sender === senderId ? "justify-end" : "justify-start"}`}>
          <div
            className={`max-w-sm px-4 py-2 rounded-2xl text-sm shadow-md ${
              msg.sender === senderId ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            <div>{msg.message}</div>
            <div className="text-[10px] mt-1 text-right opacity-60">
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </div>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Input area */}
  <div className="flex items-center border-t pt-4">
    <input
      type="text"
      value={newMessage}
      onChange={(e) => setNewMessage(e.target.value)}
      placeholder="Type your message..."
      className="flex-1 px-4 py-2 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button
      onClick={handleSend}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-xl"
    >
      Send
    </button>
  </div>
</div>

  );
}
