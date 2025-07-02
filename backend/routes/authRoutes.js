const express = require("express");
const User = require("../models/User");
const upload = require("../middlewares/upload"); // Multer middleware for file uploads
const router = express.Router();

// 🔹 Signup Route (Without Password Hashing)
router.post("/signup", upload.single("image"), async (req, res) => {
    try {
        const { name, email, password, role, businessName, serviceCategory, businessAddress, contactNumber } = req.body;

        // Validate required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // Handle profile picture upload
        const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

        // Create new user
        const newUser = new User({
            name,
            email,
            password,  // Store password as plain text
            role,
            profilePicture,
            businessName: role === "provider" ? businessName : null,
            serviceCategory: role === "provider" ? [] : null,
            businessAddress: role === "provider" ? businessAddress : null,
            contactNumber: role === "provider" ? contactNumber : null,
        });

        // Save the user to the database
        await newUser.save();
        res.status(201).json({ message: "Signup successful!", user: newUser });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error registering user", error });
    }
});

// 🔹 Login Route (Without Password Hashing)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate the required fields
        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare the entered password with the stored plain text password
        if (user.password !== password) return res.status(401).json({ message: "Invalid credentials" });

        // Send the user data back
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Login error", error });
    }
});

module.exports = router;
