const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Booking = require("../models/Booking");
const Earning = require("../models/Earning");
const ServiceRequest = require("../models/serviceRequest");

router.get("/mybookings/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const objectUserId = new mongoose.Types.ObjectId(userId);

    const serviceRequests = await ServiceRequest.find({
      customer: objectUserId
    })
      .populate("provider", "name")
      .populate("service.id", "title basePrice");

    const result = [];
    console.log(serviceRequests);
    for (const request of serviceRequests) {
      const responseObj = {
        serviceRequest: null,
        booking: null,
        earning: null
      };

      // Add serviceRequest details always
      responseObj.serviceRequest = {
        _id: request._id,
        provider: request.provider,
        service: request.service,
        requestedDate: request.requestedDate,
        requestedTime: request.requestedTime,
        contactNumber: request.contactNumber,
        email: request.email,
        address: request.address,
        status: request.status,
        message: request.message,
        handledAt: request.handledAt,
        createdAt: request.createdAt
      };

      // Case 1: pending, rejected, or cancelled — only push serviceRequest
      if (["pending", "rejected", "cancelled"].includes(request.status)) {
        result.push(responseObj);
        continue;
      }
      console.log(result)
      // Case 2: accepted — try to find booking
      if (request.status === "accepted") {
        const booking = await Booking.findOne({
          customer: objectUserId,
          provider: request.provider._id,
          serviceId: request.service.id,
          bookingDate: request.requestedDate,
          timeSlot: request.requestedTime
        })
          .populate("provider", "name")
          .populate("serviceId", "title");

        // Skip if booking is cancelled to avoid duplication
        if (booking && booking.status === "cancelled") {
          result.push(responseObj); // only push serviceRequest
          continue;
        }

        if (booking) {
          responseObj.booking = {
            _id: booking._id,
            provider: booking.provider,
            service: {
              id: booking.serviceId._id,
              name: booking.serviceName,
              basePrice: booking.finalCharge - booking.additionalCharge
            },
            bookingDate: booking.bookingDate,
            timeSlot: booking.timeSlot,
            contactNumber: booking.contactNumber,
            email: booking.email,
            address: booking.address,
            status: booking.status,
            additionalCharge: booking.additionalCharge,
            finalCharge: booking.finalCharge,
            feedback: booking.feedback,
            createdAt: booking.createdAt
          };

          if (booking.status === "completed") {
            const earning = await Earning.findOne({ bookingId: booking._id });

            if (earning) {
              responseObj.earning = {
                _id: earning._id,
                basePrice: earning.basePrice,
                additionalCharge: earning.additionalCharge,
                totalAmount: earning.totalAmount,
                paymentStatus: earning.paymentStatus,
                completedAt: earning.completedAt,
                createdAt: earning.createdAt
              };
            }
          }
        }

        result.push(responseObj);
      }
    }

    // Handle standalone bookings not linked to serviceRequest
    // const standaloneBookings = await Booking.find({
    //   customer: objectUserId,
    //   $or: [
    //     { status: { $nin: ["pending", "accepted", "rejected"] } },
    //     {
    //       status: { $in: ["pending", "accepted", "rejected"] },
    //       $nor: [
    //         {
    //           provider: { $in: serviceRequests.map(r => r.provider._id) },
    //           serviceId: { $in: serviceRequests.map(r => r.service.id) },
    //           bookingDate: { $in: serviceRequests.map(r => r.requestedDate) },
    //           timeSlot: { $in: serviceRequests.map(r => r.requestedTime) }
    //         }
    //       ]
    //     }
    //   ]
    // })
    //   .populate("provider", "name")
    //   .populate("serviceId", "title");
      

    // for (const booking of standaloneBookings) {
    //   const responseObj = {
    //     serviceRequest: null,
    //     booking: {
    //       _id: booking._id,
    //       provider: booking.provider,
    //       service: {
    //         id: booking.serviceId._id,
    //         name: booking.serviceName
    //       },
    //       bookingDate: booking.bookingDate,
    //       timeSlot: booking.timeSlot,
    //       contactNumber: booking.contactNumber,
    //       email: booking.email,
    //       address: booking.address,
    //       status: booking.status,
    //       additionalCharge: booking.additionalCharge,
    //       finalCharge: booking.finalCharge,
    //       feedback: booking.feedback,
    //       createdAt: booking.createdAt
    //     },
    //     earning: null
    //   };

    //   if (booking.status === "completed") {
    //     const earning = await Earning.findOne({ bookingId: booking._id });

    //     if (earning) {
    //       responseObj.earning = {
    //         _id: earning._id,
    //         basePrice: earning.basePrice,
    //         additionalCharge: earning.additionalCharge,
    //         totalAmount: earning.totalAmount,
    //         paymentStatus: earning.paymentStatus,
    //         completedAt: earning.completedAt,
    //         createdAt: earning.createdAt
    //       };
    //     }
    //   }

    //   result.push(responseObj);
    // }

    // Sort: newest first
    result.sort((a, b) => {
      const dateA = a.serviceRequest?.createdAt || a.booking?.createdAt;
      const dateB = b.serviceRequest?.createdAt || b.booking?.createdAt;
      return new Date(dateB) - new Date(dateA);
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching booking data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// Get /cancel-booking/:bookingId
router.get("/cancel-booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  console.log("id",bookingId)
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // if (booking.status !== "accepted") {
    //   return res.status(400).json({ message: "Cannot cancel this booking" });
    // }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get cancle-request
router.get("/cancel-request/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  // console.log("yes")
  try {
    const booking = await ServiceRequest.findById(bookingId);
    console.log(booking)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // if (booking.status !== "accepted") {
    //   return res.status(400).json({ message: "Cannot cancel this booking" });
    // }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// POST /make-payment/:bookingId
router.get("/make-payment/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

  try {
    const earning = await Earning.findOne({ bookingId });
    if (!earning) {
      return res.status(404).json({ message: "Earning record not found" });
    }

    if (earning.paymentStatus === "completed") {
      return res.status(400).json({ message: "Payment already completed" });
    }

    earning.paymentStatus = "completed";
    await earning.save();

    res.status(200).json({ success:true,message: "Payment marked as completed" });
  } catch (error) {
    console.error("Error completing payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Submit feedback for a booking
router.post("/submit-feedback", async (req, res) => {
  try {
    const { bookingId, rating, feedback, userId } = req.body;
    console.log(req.body)
    // 1. Booking fetch karo
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 2. Verify if feedback already given (optional safety)
    if (booking.feedback && booking.feedback.givenAt) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    // 3. Booking customer check karo (optional auth layer)
    if (booking.customer.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized to give feedback on this booking" });
    }

    // 4. Feedback set karo
    booking.feedback = {
      rating: rating,
      comment: feedback,
      givenAt: new Date()
    };

    await booking.save();

    res.status(200).json({
      success:true,
      message: "Feedback submitted successfully", feedback: booking.feedback });

  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

module.exports = router;
