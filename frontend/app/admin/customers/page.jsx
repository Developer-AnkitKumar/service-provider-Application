"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../_components/SideBar";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("Customers");

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState({ _id: "", name: "", email: "" });

  // ✅ Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    }
  };

  // ✅ Delete customer
  const handleDelete = async (id) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this customer?");
      if (!confirmed) return;

      await axios.delete(`http://localhost:5000/admin/deletecustomer/${id}`);
      setCustomers(customers.filter((c) => c._id !== id));
      alert("Customer deleted successfully.");
    } catch (err) {
      console.error("Failed to delete customer:", err);
      alert("Error deleting customer.");
    }
  };

  // ✅ Open Edit Modal
  const handleEdit = (customer) => {
    setEditCustomer({ ...customer }); // Fill modal with current data
    setIsEditModalOpen(true);
  };

  // ✅ Save updated customer
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/admin/updatecustomer/${editCustomer._id}`,
        {
          name: editCustomer.name,
          email: editCustomer.email,
          contactNumber: editCustomer.contactNumber || "", // optional
        }
      );

      // Update local state
      const updatedList = customers.map((c) =>
        c._id === res.data._id ? res.data : c
      );
      setCustomers(updatedList);
      setIsEditModalOpen(false);
      alert("Customer updated successfully.");
    } catch (err) {
      console.error("Failed to update customer:", err);
      alert("Error updating customer.");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className={`ml-[${sidebarOpen ? "180px" : "0px"}] p-8 transition-all duration-300`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Customer Management</h2>
        <div className={`overflow-x-auto shadow-md rounded-lg`} style={{ transition: "0.5s" }}>
          <table className="bg-white w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Contact Number</th>
                <th className="text-left py-3 px-6 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{customer.name}</td>
                  <td className="py-4 px-6">{customer.email}</td>
                  <td className="py-4 px-6">{customer.contactNumber}</td>
                  <td className="py-4 px-6 flex space-x-4">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(customer._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">Edit Customer</h3>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded"
                value={editCustomer.name}
                onChange={(e) => setEditCustomer({ ...editCustomer, name: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 p-2 rounded"
                value={editCustomer.email}
                onChange={(e) => setEditCustomer({ ...editCustomer, email: e.target.value })}
              />
            </div>
            {/* Optional: Contact Number */}
            <div className="mb-4">
              <label className="block mb-1 font-medium">Contact Number</label>
              <input
                type="text"
                className="w-full border border-gray-300 p-2 rounded"
                value={editCustomer.contactNumber || ""}
                onChange={(e) => setEditCustomer({ ...editCustomer, contactNumber: e.target.value })}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminCustomers;
