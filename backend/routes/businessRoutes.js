const express = require("express");
const User = require("../models/User");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/services");



// GET all providers with rating info
router.get("/", async (req, res) => {
  try {
    // Get all providers
    const providers = await User.find({ role: "provider" }).lean(); // use .lean() for plain JS objects

    // For each provider, calculate rating info
    const providersWithRating = await Promise.all(
      providers.map(async (provider) => {
        const bookings = await Booking.find({
          provider: provider._id,
          "feedback.rating": { $exists: true },
        });

        const totalRatings = bookings.reduce((sum, booking) => sum + (booking.feedback?.rating || 0), 0);
        const reviewCount = bookings.length;
        const averageRating = reviewCount > 0 ? totalRatings / reviewCount : 0;

        return {
          ...provider,
          rating: parseFloat(averageRating.toFixed(1)), // limit to 1 decimal
          reviewCount: reviewCount,
        };
      })
    );

    if (!providersWithRating.length) {
      return res.status(404).json({ message: "No providers found" });
    }

    res.json(providersWithRating);
  } catch (error) {
    console.error("Error fetching providers:", error);
    res.status(500).json({ message: "Error fetching providers", error });
  }
});


// 🆕 Get provider (business) by ID

router.get("/:id", async (req, res) => {
  const providerId = req.params.id;

  try {
    // 1. Find the provider
    const provider = await User.findOne({ _id: providerId, role: "provider" }).lean();
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // 2. Get all feedback from bookings for this provider
    const bookingsWithFeedback = await Booking.find({
      provider: providerId,
      "feedback.rating": { $exists: true }
    }, {
      "feedback.rating": 1,
      "feedback.comment": 1,
      "feedback.givenAt": 1,
      customer: 1
    })
    .populate("customer", "name") // Just get customer name for review
    .lean();

    const reviews = bookingsWithFeedback.map(booking => ({
      rating: booking.feedback.rating,
      comment: booking.feedback.comment,
      givenAt: booking.feedback.givenAt,
      customerName: booking.customer?.name || "Anonymous"
    }));

    // 3. Get all services offered by this provider
    const services = await Service.find({ provider: providerId }).lean();

    // 4. Combine and send response
    res.json({
      user: provider,
      reviews: reviews,
      services: services
    });

  } catch (error) {
    console.error(`Error fetching provider details for ID ${providerId}:`, error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;

// 🟡 Get all providers by service category
router.get("/category/:category", async (req, res) => {
    try {
        const providers = await User.find({
            role: "provider",
            serviceCategory: req.params.category
        });

        if (!providers.length) {
            return res.status(404).json({ message: "No providers found for this category" });
        }

        res.json(providers);
    } catch (error) {
        console.error("Error fetching providers by category:", error);
        res.status(500).json({ message: "Error fetching providers by category", error });
    }
});

// 🟣 Get all unique service categories
router.get("/categories", async (req, res) => {
    try {
        const categories = await User.distinct("serviceCategory", { role: "provider" });
        if (!categories.length) {
            return res.status(404).json({ message: "No categories found" });
        }
        res.json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Error fetching categories", error });
    }
});

module.exports = router;
