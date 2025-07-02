"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../_provider_components/Sidebar";
import Navbar from "../_provider_components/Navbar";

const providerId = JSON.parse(localStorage.getItem("user"))._id; // Replace this with actual logged-in provider ID

export default function Messages() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 1. Fetch chat list on load
  useEffect(() => {
    fetch(`http://localhost:5000/messages/chats/${providerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.users);
          if (data.users.length > 0) {
            setSelectedUser(data.users[0]); // Auto-select first user
          }
        }
      });
  }, []);

  // 2. Fetch conversation with selected user
  useEffect(() => {
    if (!selectedUser) return;
    fetch(`http://localhost:5000/messages/conversation/${providerId}/${selectedUser._id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages);
        }
      });
  }, [selectedUser]);

  // 3. Send new message
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const response = await fetch("http://localhost:5000/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senderId: providerId,
        receiverId: selectedUser._id,
        message: newMessage
      })
    });

    const data = await response.json();
    if (data.success) {
      setMessages((prev) => [...prev, data.data]);
      setNewMessage("");
    }
  };

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="h-[84vh] bg-gray-100 p-6 ml-[190px] w-[90%]">
        <div className="text-3xl font-semibold text-gray-800 mb-6">Messages</div>

        <div className="flex bg-white shadow-md rounded-xl overflow-hidden border border-gray-200 h-[80vh]">
          {/* Users Sidebar */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 rounded-lg cursor-pointer mb-2 transition hover:bg-blue-100 ${
                  selectedUser && selectedUser._id === user._id ? "bg-blue-100 font-medium" : ""
                }`}
              >
                <div className="text-gray-800">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            ))}
          </div>

          {/* Chat Area */}
          <div className="w-2/3 p-6 flex flex-col justify-between">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="pb-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedUser.name}
                  </h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-2">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === providerId ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-xl text-sm shadow ${
                          msg.sender === providerId
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <div>{msg.message}</div>
                        <div className="text-[10px] mt-1 text-right opacity-70">
                          {new Date(msg.sentAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex border-t border-gray-200 pt-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-r-lg"
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500 mt-10">Select a user to start chatting.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
