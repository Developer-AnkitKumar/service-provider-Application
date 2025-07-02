"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaPhoneAlt, FaMapMarkerAlt, FaEnvelope, FaStar } from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";
import BookingForm from "@/app/services/_components/BookingForm";
import img from "../../default_provider.png";
import Image from "next/image";
import Chats from "./_components/Chats";

const ProviderDetails = () => {
  const params = useParams();
  const id = params?.id;
  //const [showBookingForm, setShowBookingForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false); // NEW

  const [providerData, setProviderData] = useState(null);
  const [newReview, setNewReview] = useState({ name: "", rating: 0, comment: "" });
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/business/${id}`)
        .then((res) => res.json())
        .then((data) => setProviderData(data))
        .catch((err) => console.error("Error fetching provider details:", err));
    }
  }, [id]);

  const handleReviewSubmit = () => {
    alert("Your review has been submitted!");
    // You can add POST logic here later
  };

  if (!providerData) return <div className="p-10 text-center">Loading...</div>;

  const { user, services, reviews } = providerData;

  const averageRating =
    reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length || 0;

  const getImageSource = (profilePicture) => {
    if (!profilePicture) {
      return img;
    }
    
    try {
      // Check if it's already a full URL
      if (profilePicture.startsWith('http')) {
        return profilePicture;
      }
      
      // Handle local paths
      if (profilePicture.startsWith('/uploads/')) {
        return `http://localhost:5000${profilePicture}`;
      }
      
      return img;
    } catch (error) {
      console.error('Error processing image URL:', error);
      return img;
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Left Section */}
        <div className="md:col-span-2 space-y-6">
          {/* Banner */}
          <div className="relative rounded-xl overflow-hidden shadow-xl h-72 md:h-[400px]">
            <Image
              src={getImageSource(user.profilePicture)}
              alt={user.businessName}
              fill
              className="object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = img.src;
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{user.businessName}</h1>
              <p className="text-sm font-light">{user.serviceCategory}</p>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2 text-primary">About the Provider</h2>
              <p className="text-gray-600">
                {services[0]?.description || "No description available"}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-white p-6 rounded-xl shadow-md space-y-3">
              <h2 className="text-xl font-semibold text-primary mb-2">Contact Info</h2>
              <p className="flex items-center gap-2 text-gray-700">
                <FaPhoneAlt /> {user.contactNumber}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaEnvelope /> {user.email}
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt /> {user.businessAddress}
              </p>
            </div>
          </div>

          {/* Services */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-primary mb-4">
              <MdHomeRepairService className="inline mr-2 text-xl" />
              Services Offered
            </h2>
            <div className="flex flex-wrap gap-3">
              {services.map((service) => (
                <span
                  key={service._id}
                  className="bg-purple-100 text-purple-800 px-4 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  {service.name}
                </span>
              ))}
            </div>
          </div>

          {/* Ratings & Reviews */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-semibold text-primary">Customer Reviews</h2>
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {reviews.map((review, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold">{review.customerName}</span>
                    <span className="text-sm text-gray-500"> - {review.rating} Stars</span>
                  </div>
                  <p className="text-gray-600 mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Review */}
          <div className="bg-white p-6 rounded-xl shadow-md space-y-4 mt-6">
            <h2 className="text-xl font-semibold text-primary">Submit Your Review</h2>
            <div className="space-y-3">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg"
                rows="4"
                placeholder="Write your review here..."
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
              ></textarea>
              <div className="flex gap-3 items-center">
                <label className="text-sm">Rating:</label>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`cursor-pointer ${
                      newReview.rating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                  />
                ))}
              </div>
              <Button onClick={handleReviewSubmit} className="w-full text-white text-base font-semibold">
                Submit Review
              </Button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="md:col-span-1">
          <div className="sticky top-20 bg-white p-6 rounded-xl shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Ready to book?</h2>
            <p className="text-sm text-gray-600">
              Reach out directly or make a quick booking.
            </p>
            <Button
              className="w-full text-white text-base font-semibold"
              onClick={() => {
                const isLogin=JSON.parse(localStorage.getItem("user"))?.role=="customer";
                if(!isLogin){window.location.href="/login";
                  return 
                }
                setShowBookingForm(true)}}
            >
              Book Now
            </Button>
            <Button variant="outline" className="w-full text-base font-medium" onClick={() => {
              const isLogin=JSON.parse(localStorage.getItem("user"))?.role=="customer";
              if(!isLogin){window.location.href="/login";
                return }
              setShowContactForm(true)}}>
              Contact Provider
            </Button>

          </div>
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && providerData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">
              Book a Service with {providerData.user.businessName}
            </h2>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowBookingForm(false)}
            >
              ✕
            </button>
            <BookingForm
              provider={providerData.user}
              customerId={JSON.parse(localStorage.getItem("user"))._id}
              onBookingSuccess={() => setShowBookingForm(false)}
            />
          </div>
        </div>
      )}
      {showContactForm && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-5xl relative border border-gray-200">

      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Send a Message to <span className="text-blue-600">{providerData.user.businessName}</span>
        </h2>
        <button
          className="text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={() => setShowContactForm(false)}
        >
          ✕
        </button>
      </div>

      {/* Chat Component */}
      <div className="text-gray-800 text-base h-[500px] overflow-hidden">
        <Chats senderId={JSON.parse(localStorage.getItem("user"))._id} receiverId={id}/>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default ProviderDetails;