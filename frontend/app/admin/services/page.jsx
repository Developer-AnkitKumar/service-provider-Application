"use client";
import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Sidebar from "../_components/SideBar";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("Services");
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: 0,
    category: "",
  });

  // Fetch services from backend
  const fetchServices = async () => {
    try {
      const res = await fetch("http://localhost:5000/admin/services"); // Replace with your actual backend URL
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/category");
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories(); // Fetch categories on load
  }, []);
  
  

  // Delete service
  const handleDelete = async (id) => {
    if (confirm("Are you sure to delete this service?")) {
      try {
        const res = await fetch(`http://localhost:5000/admin/services/${id}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (res.ok) {
          setServices((prev) => prev.filter((s) => s._id !== id));
          alert("Service deleted successfully.");
        } else {
          alert(data.message || "Failed to delete service.");
        }
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  // Edit click
  const handleEditClick = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      basePrice: service.basePrice,
      category: service.category || "",
    });
  };

  // Update service
  const handleUpdate = async () => {
    if (!editingService) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/services/${editingService._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const updated = await res.json();

      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s._id === editingService._id ? updated : s))
        );
        setEditingService(null);
        alert("Service updated successfully.");
      } else {
        alert(updated.message || "Failed to update service.");
      }
    } catch (error) {
      console.error("Update error:", error);
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

      <div
        className={`ml-[${sidebarOpen ? "190px" : "0px"}] p-6 bg-gray-100 min-h-screen transition-all duration-300`}
      >
        <h1 className="text-3xl font-bold mb-6 text-center">All Services</h1>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white shadow rounded-xl p-4 border border-gray-200"
            >
              <h2 className="text-xl font-semibold">{service.name}</h2>
              <p className="text-gray-700 text-sm mt-1">{service.description}</p>
              <div className="mt-2">
                <p className="text-sm">
                  <strong>Price:</strong> ₹{service.basePrice}
                </p>
                <p className="text-sm">
                  <strong>Category:</strong> {service.category || "N/A"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Provider:</strong>{" "}
                  {typeof service.provider === "object"
                    ? `${service.provider.businessName} (${service.provider.email})`
                    : service.provider}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEditClick(service)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Pencil size={16} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editingService && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg">
              <h2 className="text-xl font-bold mb-4">Edit Service</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Service Name"
                  className="w-full border p-2 rounded"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description"
                  className="w-full border p-2 rounded"
                />
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: +e.target.value })
                  }
                  placeholder="Base Price"
                  className="w-full border p-2 rounded"
                />
                <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>

              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setEditingService(null)}
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
