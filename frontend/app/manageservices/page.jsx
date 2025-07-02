"use client";
import React, { useState,useEffect } from "react";
import Navbar from "../_provider_components/Navbar";
import Sidebar from "../_provider_components/Sidebar";
import GlobalApi from "../_services/GlobalApi";



export default function ManageServices() {
  const [categories,setCategorise]=useState([])
  const [services, setServices] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditingId, setIsEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // Added category in form data
  });
  async function getAllCategory(){
    const data=await GlobalApi.getCategory();
    console.log(data)
    setCategorise(data.map((d)=>d.name));
  }
  // Common handler for form fields
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //Get all services
  const fetchProviderServices = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const providerId = user?._id;
  
    if (!providerId) {
      console.error("Provider ID not found");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/manageservices/provider/${providerId}/services`);
      const data = await response.json();
  
      if (response.ok) {
        setServices(
          data.services.map((service) => ({
            id: service._id,
            name: service.name,
            description: service.description,
            price: service.basePrice,
            category: service.category || "Uncategorized",
          }))
        );
      } else {
        console.error("Failed to fetch services:", data.message);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };
  
//Get all service at first reload
useEffect(() => {
  fetchProviderServices();
}, []);



  // Add new service
  const handleAddService = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category) return;
  
    // Get providerId from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const providerId = user?._id;
  
    if (!providerId) {
      alert("Provider ID not found. Please login again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/manageservices/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerId,
          name: formData.name,
          description: formData.description,
          basePrice: formData.price,
          category: formData.category, // Optional
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Add the new service to local state too (if you want to show it instantly)
        const newService = {
          id: Date.now(),
          ...formData,
          price: parseFloat(formData.price),
        };
        setServices([...services, newService]);
  
        // Reset form
        setFormData({ name: "", description: "", price: "", category: "" });
        setIsAdding(false);
        alert("Service added successfully!");
      } else {
        console.error("Failed to add service:", data.message);
        alert(data.message || "Failed to add service");
      }
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Something went wrong while adding the service");
    }
  };
  

  // Edit service
  const handleEditService = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/manageservices/service/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          basePrice: parseFloat(formData.price),
          category: formData.category,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Update the local state with edited data
        setServices((prev) =>
          prev.map((s) =>
            s.id === id
              ? {
                  ...s,
                  name: data.service.name,
                  description: data.service.description,
                  price: data.service.basePrice,
                  category: data.service.category,
                }
              : s
          )
        );
        setFormData({ name: "", description: "", price: "", category: "" });
        setIsEditingId(null);
      } else {
        console.error("Failed to update service:", data.message);
      }
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };
  
//Delete Service
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/manageservices/service/${id}`, {
        method: "DELETE",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setServices((prev) => prev.filter((s) => s.id !== id));
      } else {
        console.error("Failed to delete service:", data.message);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };
  

  return (
    <>
      <Navbar />
      <Sidebar />

      <div className="h-[92vh] bg-gray-100 px-6 py-10 ml-[190px] w-[calc(104%-190px)] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Manage Services</h1>
          <button
            onClick={() => {
              getAllCategory();
              setIsAdding(!isAdding);
              setFormData({ name: "", description: "", price: "", category: "" });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md font-medium transition"
          >
            + Add New Service
          </button>
        </div>

        {/* Add Form Dropdown */}
        {isAdding && (
          <div className="bg-white rounded-lg shadow p-6 mb-6 border border-gray-200 max-w-xl">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Add Service</h2>
            <div className="space-y-4">
              <input
                name="name"
                placeholder="Service Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              />
              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              />
              <input
                name="price"
                placeholder="Price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              />

              {/* Category Dropdown */}
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
              >
                <option value="">Select Category</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <button
                onClick={handleAddService}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                Add Service
              </button>
            </div>
          </div>
        )}

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition"
            >
              {isEditingId === service.id ? (
                // Edit Form
                <div className="space-y-4">
                  <input
                    name="name"
                    placeholder="Service Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <input
                    name="price"
                    placeholder="Price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md"
                  />

                  {/* Category Dropdown */}
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditService(service.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditingId(null)}
                      className="bg-gray-400 text-white px-4 py-2 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{service.name}</h2>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                    <p className="text-green-600 font-medium">₹{service.price}</p>
                    <p className="text-gray-600 text-sm">Category: {service.category}</p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setIsEditingId(service.id);
                        setFormData({
                          name: service.name,
                          description: service.description,
                          price: service.price,
                          category: service.category,
                        });
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
