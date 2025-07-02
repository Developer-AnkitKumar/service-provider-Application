const express = require("express");
const Service = require("../models/services");
const User = require("../models/User"); // ⬅️ Import User model
const router = express.Router();

// 🔹 Add a new service
router.post("/service", async (req, res) => {
    try {
        const { providerId, name, description, basePrice, category } = req.body;

        if (!name || !description || !basePrice || !category) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        const newService = new Service({
            provider: providerId,
            name,
            description,
            basePrice,
            category
        });

        await newService.save();
          

        // 🔁 Add category to provider's serviceCategory array if not present
        await User.findByIdAndUpdate(providerId, {
            $addToSet: { serviceCategory: category } // add only if not exists
        });

        res.status(201).json({ message: "Service added successfully", service: newService });
    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({ message: "Error adding service", error });
    }
});

// 🔹 Get all services for a provider
router.get("/provider/:providerId/services", async (req, res) => {
    try {
        const providerId = req.params.providerId;
        const services = await Service.find({ provider: providerId });
        res.status(200).json({ services });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({ message: "Error fetching services", error });
    }
});

// 🔹 Update a service
router.patch("/service/:serviceId", async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const { name, description, basePrice, category } = req.body;

        const existingService = await Service.findById(serviceId);
        if (!existingService) return res.status(404).json({ message: "Service not found" });

        const oldCategory = existingService.category;
        const providerId = existingService.provider;

        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            { name, description, basePrice, category },
            { new: true }
        );

        if (category !== oldCategory) {
            // 🔁 Add new category if not present
            await User.findByIdAndUpdate(providerId, {
                $addToSet: { serviceCategory: category }
            });

            // 🔁 Remove old category if no other service uses it
            const otherServices = await Service.find({
                provider: providerId,
                category: oldCategory,
                _id: { $ne: serviceId }
            });

            if (otherServices.length === 0) {
                await User.findByIdAndUpdate(providerId, {
                    $pull: { serviceCategory: oldCategory }
                });
            }
        }

        res.status(200).json({ message: "Service updated successfully", service: updatedService });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({ message: "Error updating service", error });
    }
});

// 🔹 Delete a service
router.delete("/service/:serviceId", async (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const service = await Service.findById(serviceId);
        if (!service) return res.status(404).json({ message: "Service not found" });

        const providerId = service.provider;
        const category = service.category;

        await Service.findByIdAndDelete(serviceId);

        // 🔁 Remove category from user only if no other service uses it
        const remaining = await Service.find({ provider: providerId, category });

        if (remaining.length === 0) {
            await User.findByIdAndUpdate(providerId, {
                $pull: { serviceCategory: category }
            });
        }

        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "Error deleting service", error });
    }
});

module.exports = router;
