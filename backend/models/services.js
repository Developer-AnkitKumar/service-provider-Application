const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // The provider offering the service
  name: { type: String, required: true }, // Name of the service
  description: { type: String, required: true }, // Detailed description of the service
  basePrice: { type: Number, required: true }, // Base price for the service
  category: { type: String }, // Optional: category of the service (e.g., "home services", "education")
}, { timestamps: true });

module.exports = mongoose.model("Service", ServiceSchema);
