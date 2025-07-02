"use client"
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('booked');  
  const router = useRouter();
  const [bookings, setBookings] = useState({
    booked: [],
    completed: [],
    cancelled: [],
    rejected: [] 
  });
  const [loading, setLoading] = useState(true);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [bookingToRate, setBookingToRate] = useState(null);
  const session = { user: JSON.parse(localStorage.getItem("user")) };

  useEffect(() => {
    if (session?.user?._id) {
      fetchBookings();
    }
  }, []);

  async function handleCancelBooking(data) {
    try {
      if (data.status === "Confirmed") {
        await axios.get(`http://localhost:5000/userbooking/cancel-request/${data.backendData.serviceRequest._id}`);
        await axios.get(`http://localhost:5000/userbooking/cancel-booking/${data.backendData.booking._id}`);
      } else {
        await axios.get(`http://localhost:5000/userbooking/cancel-request/${data.backendData.serviceRequest._id}`);
      }
      await fetchBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.message||'Failed to cancel booking')
    }
  }

  const handleRateClick = (booking) => {
    setBookingToRate(booking);
    setShowRatingModal(true);
    setCurrentRating(0);
    setRatingFeedback('');
  };

  const handleRatingSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:5000/userbooking/submit-feedback', {
        bookingId: bookingToRate.id,
        rating: currentRating,
        feedback: ratingFeedback,
        userId: session.user._id
      });
      
      if (response.data.success) {
        await fetchBookings();
        setShowRatingModal(false);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.message||'Failed to submit feedback')
    }
  };
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
  
      script.onload = () => {
        resolve(true);
      };
  
      script.onerror = () => {
        resolve(false);
      };
  
      document.body.appendChild(script);
    });
  };
  
  const handlePayment = async (booking, session, fetchBookings) => {
    const res = await loadRazorpayScript();
  
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }
  
    try {
      const fakeAmount = parseInt(booking.price.replace('₹', '')) * 100;
  
      const options = {
        key: "rzp_test_1DP5mmOlF5G5ag", // Your Razorpay Test Key
        amount: fakeAmount,
        currency: 'INR',
        name: "WorkForce Network",
        image: "/logo.png",
        handler: async function (response) {
          // Razorpay will only call this after successful payment (test or live)
          try {
            const res = await axios.get(
              `http://localhost:5000/userbooking/make-payment/${booking.id}`
            );
  
            if (res.data.success) {
              toast.success("Payment Success!");
              await fetchBookings();
            } else {
              toast.error("Failed to mark payment.");
            }
          } catch (err) {
            console.error("Error in backend call:", err);
            toast.error("Error updating payment status.");
          }
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
          contact: session.user.phone || ''
        },
        theme: {
          color: "#3399cc"
        }
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
  
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment initiation failed");
    }
  };
  

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/userbooking/mybookings/${session.user._id}`);
      
      console.log("Raw API Data:", response.data);

      const transformedData = {
        booked: [],
        completed: [],
        cancelled: [],
        rejected: []
      };

      response.data.forEach(item => {
        // Extract all necessary data with proper null checks
        const booking = item.booking || {};
        const serviceRequest = item.serviceRequest || {};
        const earning = item.earning || {};
        
        // Common properties
        const baseObj = {
          id: booking._id || serviceRequest._id,
          service: booking.service?.name || serviceRequest.service?.name || "Unknown Service",
          provider: booking.provider?.name || serviceRequest.provider?.name || "Unknown Provider",
          price: `₹${booking.finalCharge || serviceRequest.service?.basePrice || 0}`,
          backendData: item,
          address: booking.address || serviceRequest.address || "N/A",
          time: booking.timeSlot || serviceRequest.requestedTime || "N/A"
        };

        // Date formatting helper
        const formatDate = (dateString) => 
          dateString ? new Date(dateString).toLocaleDateString('en-IN') : 'N/A';

        // CASE 1: COMPLETED BOOKINGS
        if (booking.status?.toLowerCase() === 'completed') {
          transformedData.completed.push({
            ...baseObj,
            date: formatDate(booking.bookingDate || serviceRequest.requestedDate),
            status: "Completed",
            paymentStatus: earning.paymentStatus?.toLowerCase() || 'pending',
            paidOn: earning.completedAt ? formatDate(earning.completedAt) : undefined,
            rating: booking.feedback?.rating,
            cancelledBy: null
          });
          return; // Skip further processing for completed bookings
        }

        // CASE 2: SERVICE REQUEST BASED BOOKINGS
        if (serviceRequest._id) {
          const srStatus = serviceRequest.status?.toLowerCase();
          const bookingStatus = booking.status?.toLowerCase();

          const bookingObj = {
            ...baseObj,
            date: formatDate(serviceRequest.requestedDate),
            status: srStatus === 'accepted' 
              ? (bookingStatus ? bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1) : 'Confirmed')
              : srStatus.charAt(0).toUpperCase() + srStatus.slice(1),
            cancelledBy: bookingStatus === 'cancelled' ? 'user' : 
                      srStatus === 'rejected' ? 'provider' : null
          };

          if (srStatus === 'rejected') {
            transformedData.rejected.push(bookingObj);
          } 
          else if (srStatus === 'cancelled' || bookingStatus === 'cancelled') {
            transformedData.cancelled.push(bookingObj);
          }
          else if (srStatus === 'pending') {
            transformedData.booked.push(bookingObj);
          }
          else {
            transformedData.booked.push(bookingObj);
          }
        }

        // CASE 3: STANDALONE BOOKINGS (without serviceRequest)
        if (booking._id && !serviceRequest._id) {
          const bookingObj = {
            ...baseObj,
            date: formatDate(booking.bookingDate),
            status: booking.status.charAt(0).toUpperCase() + booking.status.slice(1),
            paymentStatus: earning.paymentStatus?.toLowerCase() || 'pending',
            paidOn: earning.completedAt ? formatDate(earning.completedAt) : undefined,
            rating: booking.feedback?.rating,
            cancelledBy: booking.status === 'cancelled' ? 'user' : null
          };

          if (booking.status?.toLowerCase() === 'cancelled') {
            transformedData.cancelled.push(bookingObj);
          } else {
            transformedData.booked.push(bookingObj);
          }
        }
      });

      console.log("Transformed Data:", transformedData);
      setBookings(transformedData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <AnimatePresence>
        {showRatingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowRatingModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4">Rate your experience</h3>
              <div className="flex justify-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setCurrentRating(star)}
                    className="text-3xl mx-1 focus:outline-none"
                  >
                    {star <= currentRating ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              <textarea
                value={ratingFeedback}
                onChange={(e) => setRatingFeedback(e.target.value)}
                placeholder="Write your feedback here..."
                className="w-full border border-gray-300 rounded-lg p-3 mb-4 h-24"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRatingSubmit}
                  disabled={currentRating === 0}
                  className={`px-4 py-2 rounded-lg ${currentRating === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                >
                  Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>
        
        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          {['booked', 'completed', 'cancelled', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg mr-2 transition-all ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {!loading && (
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {bookings[activeTab].length > 0 ? (
                  bookings[activeTab].map((booking) => (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      key={booking.id}
                      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold text-gray-800">{booking.service}</h3>
                          <p className="text-gray-600 text-sm">{booking.provider}</p>
                          <div className="flex items-center mt-2 space-x-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'Cancelled' || booking.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {booking.status}
                              {activeTab === 'rejected' && ' by Provider'}
                            </span>
                            
                            {activeTab === 'completed' && (
                              <span className={`px-2 py-1 text-xs rounded-full ${booking.paymentStatus === 'completed' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'}`}>
                                Payment: {booking.paymentStatus || 'pending'}
                              </span>
                            )}
                            
                            {activeTab === 'completed' && booking.status === 'Completed' && (
                              <div className="flex items-center">
                                {typeof booking.rating === 'number' ? (
                                  [...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${i < booking.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))
                                ) : (
                                  <button 
                                    onClick={() => handleRateClick(booking)}
                                    className="text-xs text-blue-600 hover:underline"
                                  >
                                    Rate this service
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-gray-700 font-medium">{booking.price}</p>
                          <p className="text-gray-500 text-sm">{booking.date}</p>
                          <p className="text-gray-500 text-sm">{booking.time}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center">
                        <div>
                          <p className="text-gray-600 text-sm flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {booking.address}
                          </p>
                          
                          {activeTab === 'rejected' && booking.backendData?.serviceRequest?.message && (
                            <p className="text-red-500 text-xs mt-1">
                              Reason: {booking.backendData.serviceRequest.message}
                            </p>
                          )}
                          
                          {activeTab === 'completed' && booking.paymentStatus && (
                            <p className="text-gray-500 text-xs mt-1">
                              {booking.paymentStatus === 'completed' 
                                ? `Paid on: ${booking.paidOn}`
                                : 'Payment pending'}
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-3 md:mt-0 flex space-x-2">
                          {activeTab === 'booked' && booking.status !== 'Cancelled' && booking.status !== 'Rejected' && (
                            <button
                              onClick={() => handleCancelBooking(booking)}
                              className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-md hover:bg-red-100 transition-colors"
                            >
                              Cancel
                            </button>
                          )}
                          
                          {activeTab === 'completed' && booking.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handlePayment(booking,session,fetchBookings)}
                              className="px-4 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No {activeTab} bookings</h3>
                    <p className="mt-1 text-gray-500">You don't have any {activeTab} bookings yet.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyBookings;