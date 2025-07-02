const express = require("express");
const ServiceRequest = require("../models/serviceRequest");
const router = express.Router();
const Booking = require("../models/Booking");
// 🔹 Create a new service request
router.post("/request", async (req, res) => {
  try {
    const {
      provider,
      customer,
      service,         // { id, name, basePrice }
      contactNumber,
      email,
      address,
      requestedDate,
      requestedTime,
      message
    } = req.body;

    // Validation
    if (
      !provider ||
      !customer ||
      !service ||
      !service.id ||
      !service.name ||
      !service.basePrice ||
      !requestedDate ||
      !requestedTime ||
      !contactNumber
    ) {
      return res.status(400).json({ message: "All required fields must be filled properly" });
    }

    const newRequest = new ServiceRequest({
      provider,
      customer,
      service: {
        id: service.id,
        name: service.name,
        basePrice: service.basePrice,
      },
      contactNumber,
      email,
      address,
      requestedDate,
      requestedTime,
      message,
    });

    await newRequest.save();

    res.status(201).json({ message: "Service request created", request: newRequest });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(500).json({ message: "Error creating service request", error });
  }
});


// 🔹 Accept or Reject a service request

router.patch("/request/:requestId/status", async (req, res) => {
    try {
        const requestId = req.params.requestId;
        const { status } = req.body; // status can be 'accepted', 'rejected'

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        // If the status is 'accepted', create a booking entry
        if (status === "accepted") {
            // Fetch the ServiceRequest data
            const serviceRequest = await ServiceRequest.findById(requestId);
            
            if (!serviceRequest) {
                return res.status(404).json({ message: "Service Request not found" });
            }

            // Create a new Booking entry from the ServiceRequest data
            const newBooking = new Booking({
                customer: serviceRequest.customer,
                provider: serviceRequest.provider,
                serviceId: serviceRequest.service.id,
                serviceName: serviceRequest.service.name,
                bookingDate: serviceRequest.requestedDate,
                timeSlot: serviceRequest.requestedTime,
                contactNumber: serviceRequest.contactNumber,
                email: serviceRequest.email,
                address: serviceRequest.address,
                status: "pending", // Booking status starts as 'pending'
            });

            // Save the new booking to the database
            await newBooking.save();
        }

        // Update the ServiceRequest status
        const updatedRequest = await ServiceRequest.findByIdAndUpdate(requestId, {
            status,
            handledAt: new Date(),
        }, { new: true });

        res.status(200).json({ message: `Service request ${status}`, request: updatedRequest });
    } catch (error) {
        console.error("Error updating service request status:", error);
        res.status(500).json({ message: "Error updating service request status", error });
    }
});


// 🔹 Get all service requests for a provider
router.get("/provider/:providerId/requests", async (req, res) => {
    try {
        const providerId = req.params.providerId;
        const requests = await ServiceRequest.find({ provider: providerId }).populate("customer", "name email");

        res.status(200).json({ requests });
    } catch (error) {
        console.error("Error fetching service requests:", error);
        res.status(500).json({ message: "Error fetching service requests", error });
    }
});

// routes/serviceRequest.js


// Utility: Get next 10 dates starting today
const getNext10Dates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    nextDate.setHours(0, 0, 0, 0); // Remove time part
    dates.push(nextDate);
  }
  return dates;
};
const businessHours = [
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM"
];

// GET: /availability/:providerId

router.get("/availability/:providerId", async (req, res) => {
  const { providerId } = req.params;

  try {
    const dates = getNext10Dates();

    // Fetch all requests: pending or accepted
    const requests = await ServiceRequest.find({
      provider: providerId,
      status: { $in: ["pending", "accepted"] }
    });

    const filteredRequests = [];

    for (const request of requests) {
      if (request.status === "pending") {
        filteredRequests.push(request);
      } else if (request.status === "accepted") {
        const booking = await Booking.findOne({
          provider: providerId,
          bookingDate: request.requestedDate,
          timeSlot: request.requestedTime
        });

        if (booking && booking.status !== "cancelled") {
          filteredRequests.push(request);
        }
      }
    }

    // Structure for available slots
    const availability = [];

    for (const date of dates) {
      const formattedDate = date.toISOString().split("T")[0]; // yyyy-mm-dd

      const dayBookings = filteredRequests.filter(req =>
        new Date(req.requestedDate).toISOString().split("T")[0] === formattedDate
      );

      const bookedTimeSlots = dayBookings.map(req => req.requestedTime);

      const freeSlots = businessHours.filter(time => !bookedTimeSlots.includes(time));

      availability.push({
        date: formattedDate,
        availableSlots: freeSlots
      });
    }

    res.status(200).json({ availability });

  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});





module.exports = router;
