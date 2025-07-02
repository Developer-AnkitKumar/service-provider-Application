"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import img from "../../default_provider.png";
import BookingForm from "../_components/BookingForm";
import GlobalApi from "@/app/_services/GlobalApi";
import { useParams, useRouter } from "next/navigation";

const ProvidersPage = () => {
  const { category } = useParams();  
  const categoryFromURL = decodeURIComponent(category || "All");
  const router=useRouter();
  const [providers, setProviders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(categoryFromURL);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("http://localhost:5000/business");
        const data = await response.json();
        console.log(data)
        setProviders(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching providers:", error);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await GlobalApi.getCategory();
        setCategoryList(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProviders();
    fetchCategories();
  }, []);
  useEffect(() => {
    if (categoryList.length > 0) {
      const categoryNames = categoryList.map((cat) => cat.name);
      if (!categoryNames.includes(categoryFromURL) && categoryFromURL !== "All") {
        // Invalid category, redirect to All
        router.push("/services/All");
      } else {
        setSelectedService(categoryFromURL);
      }
    }
  }, [categoryList]);

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.service?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesService =
      selectedService === "All" ||
      provider.serviceCategory.includes(selectedService);

    return matchesSearch && matchesService;
  });

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Service Providers</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, service, or location"
          className="p-2 border rounded w-full md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

<select
  className="p-2 border rounded w-full md:w-1/3"
  value={selectedService}
  onChange={(e) => {
    const newCategory = e.target.value;
    setSelectedService(newCategory);
    router.push(`/services/${newCategory}`);
  }}
>
  <option value="All">All Services</option>
  {categoryList.map((category, index) => (
    <option key={index} value={category.name}>
      {category.name}
    </option>
  ))}
</select>

      </div>

      {loading ? (
        <p>Loading providers...</p>
      ) : filteredProviders.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map((provider) => (
            <div key={provider._id} className="border rounded p-4 shadow-md">
              <img
                src={`http://localhost:5000${provider?.profilePicture || "/uploads/default-avatar.png"}`}
                alt={provider.name}
                className="w-full h-40 object-cover rounded mb-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = img.src;
                }}
              />
              <h2 className="text-xl font-semibold">{provider.name}</h2>
              <p className="text-gray-600">{provider.service}</p>
              <p className="text-gray-500">{provider.location}</p>
              <p className="text-sm text-gray-500">
                {provider.experience} experience
              </p>
              <div className="flex items-center mt-2">
                <span className="text-yellow-500">
                  ⭐ {provider.rating || "N/A"}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  ({provider.reviewCount || 0} reviews)
                </span>
              </div>
              <div className="mt-4 flex justify-between">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    const isLogin =
                      JSON.parse(localStorage.getItem("user"))?.role == "customer";
                    if (!isLogin) {
                      window.location.href = "/login";
                    } else {
                      setSelectedProvider(provider);
                      setShowBookingForm(true);
                    }
                  }}
                >
                  Book Now
                </button>

                <Link href={`/provider/${provider._id}`}>
                  <button className="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400">
                    View Profile
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {showBookingForm && selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">
              Book a Service with {selectedProvider.name}
            </h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowBookingForm(false)}
            >
              ✕
            </button>
            <BookingForm
              provider={selectedProvider}
              customerId={JSON.parse(localStorage.getItem("user"))._id}
              onBookingSuccess={() => {
                setSelectedProvider(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProvidersPage;
