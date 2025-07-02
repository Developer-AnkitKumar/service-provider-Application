"use client";
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Sidebar from '../_components/SideBar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const StatCard = ({ title, value, change, trend }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      <p className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'} mt-1`}>
        {change} <span className={`${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{trend === 'up' ? '↑' : '↓'}</span>
      </p>
    </div>
  );
};

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    pendingRequests: 0,
    totalRevenue: 0,
  });

  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('http://localhost:5000/admin/summary');
        const data = await res.json();
        setStats({
          totalServices: data.totalServices,
          activeBookings: data.activeBookings,
          pendingRequests: data.pendingRequests,
          totalRevenue: data.totalRevenue,
        });
        console.log(data.recentBookings)
        setRecentBookings(data.recentBookings);
      } catch (error) {
        console.error('Failed to load summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  const statsArray = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Active Bookings',
      value: stats.activeBookings,
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Pending Requests',
      value: stats.pendingRequests,
      change: '-3%',
      trend: 'down',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue}`,
      change: '+18%',
      trend: 'up',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Head>
        <title>Admin Dashboard | Home Service Provider</title>
      </Head>

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-[200px]' : 'ml-0'}`}
      >
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-200">
                <span className="text-gray-600">🔔</span>
              </button>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                  AD
                </div>
                {sidebarOpen && <span className="text-gray-700">Admin</span>}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {statsArray.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Service Data Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentBookings}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="serviceId.name" /> {/* Fix this */}
  <YAxis />
  <Tooltip />
  <Bar dataKey="finalCharge" fill="#8884d8" /> {/* Fix this */}
</BarChart>

              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Booking Trends Over Time</h3>
              <ResponsiveContainer width="100%" height={300}>
              <LineChart data={recentBookings}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="createdAt" />
  <YAxis />
  <Tooltip />
  <Line type="monotone" dataKey="finalCharge" stroke="#82ca9d" /> {/* Fix this */}
</LineChart>

              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
              <button className="text-blue-600 hover:text-blue-800">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.serviceId?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.customer?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${booking.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'accepted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'pending'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 hover:text-blue-800">
                        View Details
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
