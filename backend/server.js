const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// MongoDB Connection
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// 🔹 Serve Static Uploads Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Routes
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const manageServicesRoutes=require("./routes/manageServicesRoutes");
const earningRoutes = require("./routes/earningRoutes");
const messagesRoutes=require("./routes/messageRoutes");
const servicesRoutes=require("./routes/servicesRoutes");
const userBookingRoutes=require("./routes/userBookingRoutes");
const categoryRoutes=require("./routes/categoryRoutes");
const adminRoutes=require("./routes/adminRoutes");

//All Routes
app.use("/earnings", earningRoutes);
app.use("/auth", authRoutes); // 🆕 Signup/Login API
app.use("/business", businessRoutes);
app.use("/booking", bookingRoutes);
app.use("/manageservices",manageServicesRoutes);
app.use("/messages",messagesRoutes);
app.use("/services",servicesRoutes);
app.use("/userbooking",userBookingRoutes);
app.use("/category",categoryRoutes);
app.use("/admin",adminRoutes);

// 🔹 Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));