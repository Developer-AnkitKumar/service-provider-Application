const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking"
  }
}, { timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
