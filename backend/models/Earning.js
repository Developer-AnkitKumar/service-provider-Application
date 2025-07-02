const mongoose = require("mongoose");

const EarningSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },

  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  serviceName: { type: String, required: true },

  basePrice: { type: Number, required: true },
  additionalCharge: { type: Number, default: 0 },

  totalAmount: { type: Number, required: true }, // basePrice + additionalCharge

  paymentStatus: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending"
  },

  completedAt: { type: Date, required: true }, // Date when contractor marked job completed

}, { timestamps: true });

module.exports = mongoose.model("Earning", EarningSchema);
