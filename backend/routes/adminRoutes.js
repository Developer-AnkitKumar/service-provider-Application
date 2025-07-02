// routes/admin.js

const express = require("express");
const router = express.Router();
const Service = require("../models/services");
const Booking = require("../models/Booking");
const ServiceRequest = require("../models/serviceRequest");
const Earning = require("../models/Earning");
const User = require("../models/User");


router.get("/summary", async (req, res) => {
  try {
    const [totalServices, activeBookings, pendingRequests, completedBookings, recentBookings, bookingTrends] = await Promise.all([
      Service.countDocuments(),
      Booking.countDocuments({ status: "accepted" }),
      ServiceRequest.countDocuments({ status: "pending" }),
      Booking.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$finalCharge" } } },
      ]),
      Booking.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("customer", "name")
        .populate("serviceId", "name")
        .lean(),
      Booking.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            totalRevenue: { $sum: "$finalCharge" },
            activeBookings: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 }, // Show data for the last 12 months
      ])
    ]);

    res.json({
      totalServices,
      activeBookings,
      pendingRequests,
      totalRevenue: completedBookings[0]?.total || 0,
      recentBookings,
      bookingTrends: bookingTrends.reverse(), // Reverse to show most recent first
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin summary" });
  }
});



// GET /bookings - Fetch all bookings with related info
router.get("/bookings", async (req, res) => {
  try {
    // Step 1: Fetch all bookings and populate customer and provider names
    const bookings = await Booking.find()
      .populate("customer", "name")
      .populate("provider", "name")
      .sort({ createdAt: -1 });

    const enrichedBookings = [];

    for (const booking of bookings) {
      // Step 2: Try to get matching earning record
      const earning = await Earning.findOne({ bookingId: booking._id });

      enrichedBookings.push({
        id: booking._id,
        customerName: booking.customer?.name || "N/A",
        providerName: booking.provider?.name || "N/A",
        serviceName: booking.serviceName,
        status: capitalize(booking.status), // pending → Pending
        paymentStatus: earning ? (earning.paymentStatus === "completed" ? "Paid" : "Pending") : "Pending",
        paymentAmount: earning ? earning.totalAmount : 0,
        rating: booking.feedback?.rating || null,
      });
    }

    res.status(200).json({ bookings: enrichedBookings });
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Utility function
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// GET all customers
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// PUT (edit) a customer
router.put("/updatecustomer/:id", async (req, res) => {
  try {
    const { name, email, contactNumber } = req.body;
    const updatedCustomer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "customer" },
      { name, email, contactNumber },
      { new: true }
    );
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// DELETE a customer
router.delete("deletecustomer/:id", async (req, res) => {
  try {
    const deletedCustomer = await User.findOneAndDelete({
      _id: req.params.id,
      role: "customer",
    });
    if (!deletedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
});



// GET all services (for admin dashboard)
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().populate({
      path: "provider",
      select: "businessName email role", // only get businessName & email
    });

    // Optionally filter providers by role === 'provider' (if needed)
    const filteredServices = services.filter(service =>
      service.provider?.role === "provider"
    );

    res.status(200).json(filteredServices);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services", error });
  }
});


// PUT update a specific service
router.put("/services/:id", async (req, res) => {
  try {
    const { name, description, basePrice, category } = req.body;
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description, basePrice, category },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: "Failed to update service", error });
  }
});

// DELETE a specific service
router.delete("/services/:id", async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service", error });
  }
});


// 📦 GET all providers
router.get("/providers", async (req, res) => {
  try {
    const providers = await User.find({ role: "provider" });
    res.status(200).json(providers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch providers" });
  }
});

// 🗑️ DELETE a provider by ID
router.delete("/providers/:id", async (req, res) => {
  try {
    const deletedProvider = await User.findByIdAndDelete(req.params.id);
    if (!deletedProvider) {
      return res.status(404).json({ error: "Provider not found" });
    }
    res.status(200).json({ message: "Provider deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete provider" });
  }
});

// ✏️ PUT (Update) a provider by ID
router.put("/providers/:id", async (req, res) => {
  try {
    const updatedProvider = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          businessName: req.body.businessName,
          serviceCategory: req.body.serviceCategory,
          businessAddress: req.body.businessAddress,
          contactNumber: req.body.contactNumber,
          businessAbout: req.body.businessAbout,
        },
      },
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    res.status(200).json(updatedProvider);
  } catch (err) {
    res.status(500).json({ error: "Failed to update provider" });
  }
});



module.exports = router;
