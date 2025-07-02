const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["customer", "provider"], required: true },
  profilePicture: { type: String },

  businessName: {
    type: String,
    required: function () {
      return this.role === "provider";
    },
  },

  serviceCategory: {
    type: [String], // ⬅️ Array of strings
    default:[]
  },

  businessAddress: {
    type: String,
    required: function () {
      return this.role === "provider";
    },
  },

  contactNumber: {
    type: String,
    required: function () {
      return this.role === "provider";
    },
  },

  businessAbout: { type: String },
},
{ timestamps: true });

module.exports = mongoose.model("User", UserSchema);
