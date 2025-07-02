const express = require("express");
const Booking = require("../models/Booking");
const router = express.Router();
const Service=require("../models/services");
const Earning = require("../models/Earning");
const User = require("../models/User");
const ServiceRequest=require("../models/serviceRequest");

// GET all bookings of a provider with customer data
router.get("/provider/:providerId/bookings-with-customer", async (req, res) => {
  try {
    const providerId = req.params.providerId;

    // Step 1: Get bookings of the provider
    const bookings = await Booking.find({ provider: providerId });

    // Step 2: For each booking, get full customer data
    const bookingsWithCustomer = await Promise.all(
      bookings.map(async (booking) => {
        const customerData = await User.findById(booking.customer).select("-password"); // optional: remove password
        return {
          ...booking.toObject(), // convert mongoose doc to plain object
          customerData,
        };
      })
    );

    res.status(200).json({ bookings: bookingsWithCustomer });
  } catch (error) {
    console.error("Error fetching bookings with customer data:", error);
    res.status(500).json({ message: "Error fetching bookings with customer data", error });
  }
});


// 🔹 Create a new booking
router.post("/book", async (req, res) => {
    try {
        const { provider, customer, service, bookingDate, bookingTime, contactEmail, contactPhone } = req.body;

        if (!provider || !customer || !service || !bookingDate || !bookingTime) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const newBooking = new Booking({
            provider,
            customer,
            service,
            bookingDate,
            bookingTime,
            contactEmail,
            contactPhone,
            totalCharge: service.basePrice, // Initial total charge
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Error creating booking", error });
    }
});

// 🔹 Get all bookings for a provider (Filter by status: pending, completed, etc.)
router.get("/provider/:providerId/bookings", async (req, res) => {
  try {
    const providerId = req.params.providerId;

    // Fetch bookings for the provider and populate customer details
    const bookings = await Booking.find({ provider: providerId })
      .populate("customer", "name email") // populate only needed fields
      .sort({ createdAt: -1 }); // optional: show latest first

    // Fetch service requests for the provider
    const requests = await ServiceRequest.find({ provider: providerId })
      .populate("customer", "name email") // populate customer info
      .sort({ createdAt: -1 });

    // Respond with both bookings and requests
    res.status(200).json({
      booking: bookings,
      request: requests,
    });
  } catch (error) {
    console.error("Error fetching bookings and requests:", error);
    res.status(500).json({ message: "Error fetching data", error });
  }
});


// 🔹 Update booking status (Mark as completed or cancelled)
router.patch("/booking/:bookingId/status", async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const { status, extraCharge = 0 } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Step 1: Get existing booking
    const existingBooking = await Booking.findById(bookingId);
    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Step 2: If status is 'cancelled', just update and return
    if (status === "cancelled") {
      existingBooking.status = "cancelled";
      const service1=await Service.findById(existingBooking.serviceId);
      existingBooking.finalCharge=service1.basePrice;
      const updatedBooking = await existingBooking.save();
      return res.status(200).json({
        message: "Booking cancelled successfully",
        booking: updatedBooking,
      });
    }

    // Step 3: If status is 'completed', calculate final charge
    if (status === "completed") {
      const service = await Service.findById(existingBooking.serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const finalCharge = service.basePrice + Number(extraCharge);

      existingBooking.status = "completed";
      existingBooking.additionalCharge = extraCharge;
      existingBooking.finalCharge = finalCharge;
      existingBooking.markedCompletedByProvider = true;
      existingBooking.markedCompletedAt = new Date();

      const updatedBooking = await existingBooking.save();

      // Create Earning entry
      const newEarning = new Earning({
        provider: existingBooking.provider,
        customer: existingBooking.customer,
        bookingId: existingBooking._id,
        serviceName: existingBooking.serviceName,
        basePrice: service.basePrice,
        additionalCharge: Number(extraCharge),
        totalAmount: finalCharge,
        completedAt: existingBooking.markedCompletedAt,
      });

      await newEarning.save();

      return res.status(200).json({
        message: "Booking marked as completed and earning recorded",
        booking: updatedBooking,
      });
    }

    // Step 4: Default case - just update status
    existingBooking.status = status;
    const updatedBooking = await existingBooking.save();

    res.status(200).json({
      message: `Booking status updated to ${status}`,
      booking: updatedBooking,
    });

  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Error updating booking status", error });
  }
});

  

module.exports = router;
