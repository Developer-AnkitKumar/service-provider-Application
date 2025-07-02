const express = require("express");
const Feedback = require("../models/Feedback");
const router = express.Router();

// 🔹 Submit Feedback for a completed booking
router.post("/feedback", async (req, res) => {
    try {
        const { bookingId, customerId, providerId, rating, message } = req.body;

        if (!rating || !message) {
            return res.status(400).json({ message: "Rating and message are required" });
        }

        const newFeedback = new Feedback({
            bookingId,
            customerId,
            providerId,
            rating,
            message,
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback submitted successfully", feedback: newFeedback });
    } catch (error) {
        console.error("Error submitting feedback:", error);
        res.status(500).json({ message: "Error submitting feedback", error });
    }
});

// 🔹 Get feedback for a provider
router.get("/provider/:providerId/feedback", async (req, res) => {
    try {
        const providerId = req.params.providerId;
        const feedbacks = await Feedback.find({ providerId }).populate("customerId", "name email");

        res.status(200).json({ feedbacks });
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        res.status(500).json({ message: "Error fetching feedbacks", error });
    }
});

module.exports = router;
