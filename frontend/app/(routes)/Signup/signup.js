"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message
    try {
      const response = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);
      
      alert("Signup successful! Redirecting to login...");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} className="border p-2 mb-2 w-full"/>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 mb-2 w-full"/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 mb-2 w-full"/>
        <button type="submit" className="bg-primary text-white p-2 w-full">Sign Up</button>
      </form>
    </div>
  );
}