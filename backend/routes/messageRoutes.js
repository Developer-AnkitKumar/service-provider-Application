const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");

// ---------------------
// 1. Send a Message
// ---------------------
router.post("/send", async (req, res) => {
  try {
    const { senderId, receiverId, message, bookingId } = req.body;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      message,
      booking: bookingId || null
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent!",
      data: newMessage
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: err.message
    });
  }
});

// -----------------------------------------------------
// 2. Get all users this user has chatted with (chat list)
// -----------------------------------------------------
router.get("/chats/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    });
    // console.log(messages.length)

    const userIds = new Set();

    messages.forEach(msg => {
      if (msg.sender.toString() !== userId) userIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId) userIds.add(msg.receiver.toString());
    });
    // console.log(userIds)
    const users = await User.find({ _id: { $in: [...userIds] } }).select("name email role");
    console.log(users)
    res.status(200).json({
      success: true,
      users
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat users",
      error: err.message
    });
  }
});

// ---------------------------------------------
// 3. Get conversation between two users
// ---------------------------------------------
router.get("/conversation/:user1Id/:user2Id", async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: user1Id, receiver: user2Id },
        { sender: user2Id, receiver: user1Id }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation",
      error: err.message
    });
  }
});

module.exports = router;
