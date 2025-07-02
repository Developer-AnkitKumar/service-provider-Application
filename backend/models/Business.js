const mongoose = require("mongoose");

const BusinessSchema = new mongoose.Schema({
    name: String,
    address: String,
    category: String,
    contactPerson: String,
    email: String,
    images: [{ url: String }], // Changed to Array of Objects
}, { timestamps: true }); // Added timestamps

module.exports = mongoose.model("Business", BusinessSchema);