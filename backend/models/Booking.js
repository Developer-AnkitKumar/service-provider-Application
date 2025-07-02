const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  serviceName: { type: String, required: true }, // quick access

  bookingDate: { type: Date, required: true }, // when user wants service
  timeSlot: { type: String, required: true }, // example: "10:00 AM - 12:00 PM"

  contactNumber: { type: String, required: true },
  email: { type: String, required: true },

  address: { type: String }, 
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending"
  },

  markedCompletedByProvider: { type: Boolean, default: false },
  markedCompletedAt: { type: Date }, // optional for completion timestamp

  additionalCharge: { type: Number, default: 0 }, // entered by provider when marking completed
  finalCharge: { type: Number }, // base + additional (optional, for quick access)

  // Feedback
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String },
    givenAt: { type: Date }
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
