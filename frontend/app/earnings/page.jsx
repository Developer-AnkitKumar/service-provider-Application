"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import Sidebar from '../_provider_components/Sidebar';
import Navbar from '../_provider_components/Navbar';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

export default function ContractorDashboard() {
  const [summary, setSummary] = useState({});
  const [dailyEarnings, setDailyEarnings] = useState([]);
  const [earningsByService, setEarningsByService] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) return;

        const contractorId = storedUser._id;
        const res = await axios.get(`http://localhost:5000/earnings/provider/${contractorId}/overview`);
        console.log(res.data.data)

        setSummary(res.data.data.summary);
        setDailyEarnings(res.data.data.dailyEarnings);
        setEarningsByService(res.data.data.earningsByService);
        setMonthlyEarnings(res.data.data.monthlyEarnings);
        setTransactions(res.data.data.recentTransactions
        );
      } catch (err) {
        console.error('Error fetching contractor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <>
      <Navbar />
      <div className="flex w-[103%]">
        <Sidebar />

        {/* Scrollable Content Area */}
        <div className="ml-[200px] w-screen h-[92vh] overflow-y-auto p-10 bg-gray-50 ">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Earnings & Analytics</h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h4 className="text-sm text-gray-500 mb-1">Total Earnings</h4>
              <p className="text-xl font-bold text-blue-600">₹{summary.total?.toLocaleString()}</p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h4 className="text-sm text-gray-500 mb-1">This Month</h4>
              <p className="text-xl font-bold text-green-600">₹{summary.monthly?.toLocaleString()}</p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h4 className="text-sm text-gray-500 mb-1">Pending Payments</h4>
              <p className="text-xl font-bold text-yellow-600">₹{summary.pending?.toLocaleString()}</p>
            </div>
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h4 className="text-sm text-gray-500 mb-1">Completed Jobs</h4>
              <p className="text-xl font-bold text-indigo-600">{summary.jobs}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            {/* Line Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6 col-span-2">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">Daily Earnings (Last 7 Days)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#4F46E5" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white shadow-lg rounded-xl p-6">
              <h4 className="text-lg font-semibold mb-4 text-gray-700">Earnings by Service</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={earningsByService} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value">
                    {earningsByService.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Earnings Bar Chart */}
          <div className="bg-white shadow-lg rounded-xl p-6 mb-10">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Monthly Earnings</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyEarnings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Transactions Table */}
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">Recent Transactions</h4>
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Booking ID</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{txn.id}</td>
                    <td className="px-4 py-2">{txn.date}</td>
                    <td className="px-4 py-2">{txn.service}</td>
                    <td className="px-4 py-2">₹{txn.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          txn.status === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </>
  );
}
