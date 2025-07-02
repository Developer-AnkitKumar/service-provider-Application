"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlobalApi from "../_services/GlobalApi";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
  });

  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [businessData, setBusinessData] = useState({
    businessName: "",
    serviceCategory: "",
    businessAddress: "",
    contactNumber: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Toggle business form when role changes
  useEffect(() => {
    setShowBusinessForm(formData.role === "provider");
  }, [formData.role]);

  // Fetch categories when provider form appears
  useEffect(() => {
    if (showBusinessForm && categories.length === 0) {
      fetchCategories();
    }
  }, [showBusinessForm]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const data=await GlobalApi.getCategory();
      setCategories(data.map((d)=>d.name))
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBusinessChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setBusinessData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setBusinessData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
    Object.entries(businessData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert("Signup successful! Redirecting to login...");
      router.push("/login");
    } catch (error) {
      alert(error.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[88vh] px-4 relative bg-gray-50">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: showBusinessForm ? -280 : 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md z-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-gray-800">
          Create Your Account
        </h2>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              minLength={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registering as:
            </label>
            <select
              name="role"
              onChange={handleChange}
              value={formData.role}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
            >
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
            </select>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition duration-200"
          >
            Sign Up
          </button>
          
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-purple-600 font-medium hover:underline focus:outline-none"
            >
              Login here
            </button>
          </p>
        </form>
      </motion.div>

      {showBusinessForm && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: -180, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute right-0 bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm z-10 border border-gray-200"
        >
          <h3 className="text-xl sm:text-2xl font-bold mb-6 text-center text-gray-800">
            Business Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="businessName"
                placeholder="Business Name"
                required
                onChange={handleBusinessChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            
            
            <div>
              <input
                type="text"
                name="businessAddress"
                placeholder="Business Address"
                required
                onChange={handleBusinessChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <input
                type="tel"
                name="contactNumber"
                placeholder="Contact Number"
                required
                onChange={handleBusinessChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Image
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                onChange={handleBusinessChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}