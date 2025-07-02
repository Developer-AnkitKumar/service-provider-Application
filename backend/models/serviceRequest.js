const mongoose = require("mongoose");

const ServiceRequestSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  service: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Service" }, // Add serviceId for booking
    name: String,
    basePrice: Number,
  },

  // Customer Details (so booking me directly use ho jaye)
  contactNumber: { type: String, required: true },
  email: { type: String},
  address: { type: String }, // Optional address for service location

  requestedDate: { type: Date, required: true },   // When customer wants the service
  requestedTime: { type: String, required: true }, // e.g., "10:30 AM - 11:30 AM"

  message: { type: String }, // Optional note

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected","cancelled"],
    default: "pending"
  },

  handledAt: { type: Date }, // When the provider accepted/rejected it

}, { timestamps: true });

module.exports = mongoose.model("ServiceRequest", ServiceRequestSchema);
