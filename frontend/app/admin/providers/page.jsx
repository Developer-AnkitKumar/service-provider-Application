"use client"
import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Sidebar from "../_components/SideBar";
import axios from "axios";

const BASE_URL = "http://localhost:5000";

const getCategory = async () => {
    try {
        const response = await fetch(`${BASE_URL}/category`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        return data || []; // Return categories or empty array
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []; // Return empty array on error
    }
};

export default function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [editingProvider, setEditingProvider] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categories, setCategories] = useState([]); // Store categories
  const [currentPage, setCurrentPage] = useState("Providers");

  // Fetch providers and categories
  const fetchProviders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/providers");
      setProviders(res.data);
    } catch (err) {
      console.error("Failed to fetch providers", err);
    }
  };

  useEffect(() => {
    fetchProviders();
    // Fetch categories when modal opens
    if (editingProvider) {
      const fetchCategories = async () => {
        const categoryData = await getCategory();
        setCategories(categoryData);
      };
      fetchCategories();
    }
  }, [editingProvider]);

  // 🗑️ Delete a provider
  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete this provider?")) {
      try {
        await axios.delete(`http://localhost:5000/admin/providers/${id}`);
        fetchProviders(); // Refresh after delete
      } catch (err) {
        console.error("Failed to delete provider", err);
      }
    }
  };

  // ✏️ Show edit modal
  const handleEditClick = (provider) => {
    setEditingProvider({ ...provider }); // clone so we can edit
  };

  // ✏️ Save updated provider
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/admin/providers/${editingProvider._id}`, editingProvider);
      setEditingProvider(null);
      fetchProviders(); // Refresh after update
    } catch (err) {
      console.error("Failed to update provider", err);
    }
  };

  // ✂️ Remove a service
  const handleRemoveService = (service) => {
    setEditingProvider({
      ...editingProvider,
      serviceCategory: editingProvider.serviceCategory.filter((item) => item !== service)
    });
  };

  // ➕ Add a service
  const handleAddService = (service) => {
    if (!editingProvider.serviceCategory.includes(service)) {
      setEditingProvider({
        ...editingProvider,
        serviceCategory: [...editingProvider.serviceCategory, service]
      });
    }
  };

  return (
    <>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      <div className={`ml-[${sidebarOpen ? "190px" : "0px"}] p-6 bg-gray-100 min-h-screen transition-all duration-300`}>
        <h1 className="text-3xl font-bold mb-6 text-center">All Providers</h1>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div key={provider._id} className="bg-white shadow rounded-xl p-4 border border-gray-200">
              <h2 className="text-xl font-semibold">{provider.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{provider.email}</p>
              <p><strong>Business:</strong> {provider.businessName}</p>
              <p><strong>Services:</strong> {provider.serviceCategory?.join(", ")}</p>
              <p><strong>Address:</strong> {provider.businessAddress}</p>
              <p><strong>Contact:</strong> {provider.contactNumber}</p>
              <p className="text-sm text-gray-700 mt-2">{provider.businessAbout}</p>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(provider)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(provider._id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ✏️ Edit Modal */}
        {editingProvider && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Edit Provider</h2>

              <form className="space-y-3">
                <input
                  type="text"
                  placeholder="Name"
                  value={editingProvider.name}
                  onChange={(e) => setEditingProvider({ ...editingProvider, name: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingProvider.email}
                  onChange={(e) => setEditingProvider({ ...editingProvider, email: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Business Name"
                  value={editingProvider.businessName}
                  onChange={(e) => setEditingProvider({ ...editingProvider, businessName: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Business Address"
                  value={editingProvider.businessAddress}
                  onChange={(e) => setEditingProvider({ ...editingProvider, businessAddress: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Contact Number"
                  value={editingProvider.contactNumber}
                  onChange={(e) => setEditingProvider({ ...editingProvider, contactNumber: e.target.value })}
                  className="w-full p-2 border rounded"
                />
                <textarea
                  placeholder="Business About"
                  value={editingProvider.businessAbout}
                  onChange={(e) => setEditingProvider({ ...editingProvider, businessAbout: e.target.value })}
                  className="w-full p-2 border rounded"
                />

                <div>
                  <p><strong>Service Categories:</strong></p>
                  <div>
                    {editingProvider.serviceCategory.map((service, index) => (
                      <div key={index} className="flex items-center justify-between mt-2">
                        <span>{service}</span>
                        <button
                          onClick={() => handleRemoveService(service)}
                          className="text-red-500"
                        >
                          ✂️
                        </button>
                      </div>
                    ))}
                  </div>

                  <select
                    onChange={(e) => handleAddService(e.target.value)}
                    className="w-full p-2 border rounded mt-2"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </form>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingProvider(null)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
