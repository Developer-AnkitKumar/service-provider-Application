const express = require("express");
const router = express.Router();
const Earning = require("../models/Earning");
const mongoose = require("mongoose");

const getStartOfDay = (date) => new Date(new Date(date).setHours(0, 0, 0, 0));

router.get("/provider/:providerId/overview", async (req, res) => {
    try {
      const { providerId } = req.params;
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);
  
      // Fetch all earnings for the provider
      const allEarnings = await Earning.find({ provider: providerId });
      
      // Summary (Total, Pending, Jobs Count)
      const total = allEarnings.reduce((acc, e) => acc + e.totalAmount, 0);
      const pending = allEarnings
        .filter(e => e.paymentStatus === 'pending')
        .reduce((acc, e) => acc + e.totalAmount, 0);
      const jobs = allEarnings.length;
  
      // This Month's Earnings
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const monthlyEarnings = allEarnings.filter(e => new Date(e.completedAt) >= startOfMonth);
      const monthly = monthlyEarnings.reduce((acc, e) => acc + e.totalAmount, 0);
  
      // Daily Earnings for Last 7 Days
      const dailyEarnings = await Earning.aggregate([
        {
          $match: {
            provider: new mongoose.Types.ObjectId(providerId),
            completedAt: { $gte: getStartOfDay(sevenDaysAgo) },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$completedAt" }
            },
            amount: { $sum: "$totalAmount" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);
  
      const dailyData = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        const found = dailyEarnings.find(e => e._id === dateStr);
        const monthName = d.toLocaleString('default', { month: 'short' });
        dailyData.push({ date: `${monthName} ${d.getDate()}`, amount: found ? found.amount : 0 });
      }
  
      // Earnings by Service
      const serviceEarnings = await Earning.aggregate([
        { $match: { provider: new mongoose.Types.ObjectId(providerId) } },
        {
          $group: {
            _id: "$serviceName",
            value: { $sum: "$totalAmount" }
          }
        },
        {
          $project: {
            name: "$_id",
            value: 1,
            _id: 0
          }
        }
      ]);
  
      // Monthly Earnings (Bar Chart)
      const monthlyEarningsData = await Earning.aggregate([
        {
          $match: {
            provider: new mongoose.Types.ObjectId(providerId),
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$completedAt" },
              month: { $month: "$completedAt" }
            },
            amount: { $sum: "$totalAmount" }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ]);
  
      const monthlyData = monthlyEarningsData.map(entry => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {
          month: monthNames[entry._id.month - 1],
          amount: entry.amount
        };
      });
  
      // Recent Transactions
      const recentTransactions = await Earning.find({ provider: providerId })
        .sort({ completedAt: -1 })
        .limit(10)
        .select("bookingId completedAt serviceName totalAmount paymentStatus");
  
      const formattedTransactions = recentTransactions.map(txn => ({
        id: txn.bookingId.toString().slice(-4).toUpperCase(), // just for UI
        date: txn.completedAt.toISOString().split("T")[0],
        service: txn.serviceName,
        amount: txn.totalAmount,
        status: txn.paymentStatus === "completed" ? "Paid" : "Pending",
      }));
  
      res.json({
        status: "success",
        data: {
          summary: { total, pending, monthly, jobs },
          dailyEarnings: dailyData,
          earningsByService: serviceEarnings,
          monthlyEarnings: monthlyData,
          recentTransactions: formattedTransactions
        }
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: "error", message: "Failed to fetch overview", error: err.message });
    }
  });
module.exports=router;  