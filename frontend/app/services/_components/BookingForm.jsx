import { useEffect, useState } from "react";
import { toast } from "sonner";


const BookingForm = ({ provider, customerId, onBookingSuccess }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");

  const [availability, setAvailability] = useState({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const getNext10Days = () => {
    const dates = [];
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const timeSlots = [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/manageservices/provider/${provider._id}/services`
        );
        const data = await res.json();
        setServices(data.services);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      }
    };

    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const res = await fetch(
          `http://localhost:5000/services/availability/${provider._id}`
        );
        const data = await res.json();
        const formatted = {};
        data.availability.forEach((entry) => {
          formatted[entry.date] = entry.availableSlots;
        });
        setAvailability(formatted);
      } catch (err) {
        console.error("Failed to fetch availability:", err);
      } finally {
        setLoadingAvailability(false);
      }
    };

    if (provider?._id) {
      fetchServices();
      fetchAvailability();
    }
  }, [provider]);

  const handleServiceChange = (e) => {
    const serviceName = e.target.value;
    const matched = services.find((s) => s.name === serviceName);
    setSelectedService(matched);
    setPrice(matched?.basePrice || "");
  };

  const getAvailableSlots = (date) => {
    return availability[date] || [];
  };

  const handleTimeChange = (e) => {
    const selected = e.target.value;
    const available = getAvailableSlots(requestedDate);

    if (!available.includes(selected)) {
      toast.error("This slot is already booked. Please choose another.");
      return;
    }

    setRequestedTime(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedService || !requestedDate || !requestedTime || !phone || !address) {
      return toast.warn("Please fill in all required fields.");
    }

    const payload = {
      provider: provider._id,
      customer: customerId,
      service: {
        id: selectedService._id,
        name: selectedService.name,
        basePrice: selectedService.basePrice,
      },
      contactNumber: phone,
      email,
      address,
      requestedDate,
      requestedTime,
      message,
    };

    try {
      const res = await fetch("http://localhost:5000/services/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("Booking successful!");
        onBookingSuccess();
      } else {
        toast.error(result.message || "Booking failed");
      }
    } catch (err) {
      console.error("Error submitting booking:", err);
      toast.error("Something went wrong. Try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Service Selection */}
      <select
        value={selectedService?.name || ""}
        onChange={handleServiceChange}
        className="w-full border p-2 mb-3 rounded"
        required
      >
        <option value="">Select a service</option>
        {services.map((s) => (
          <option key={s._id} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      {price && (
        <p className="mb-3 text-green-600 font-medium">Price: ₹{price}</p>
      )}

      {/* Date Picker */}
      <select
        value={requestedDate}
        onChange={(e) => {
          setRequestedDate(e.target.value);
          setRequestedTime(""); // reset time when date changes
        }}
        className="w-full border p-2 mb-3 rounded"
        required
      >
        <option value="">Select a date</option>
        {getNext10Days().map((date) => (
          <option key={date} value={date}>
            {date}
          </option>
        ))}
      </select>

      {/* Time Slot */}
      <select
        value={requestedTime}
        onChange={handleTimeChange}
        className="w-full border p-2 mb-3 rounded"
        required
        disabled={!requestedDate}
      >
        <option value="">Select a time slot</option>
        {timeSlots.map((slot, index) => {
          const isAvailable = getAvailableSlots(requestedDate).includes(slot);
          return (
            <option
              key={index}
              value={slot}
              disabled={!isAvailable}
              style={{
                backgroundColor: !isAvailable ? "#f87171" : "",
                color: !isAvailable ? "#fff" : "",
              }}
            >
              {slot} {!isAvailable ? "(Booked)" : ""}
            </option>
          );
        })}
      </select>

      {/* Contact Details */}
      <input
        type="tel"
        placeholder="Your Phone Number"
        className="w-full border p-2 mb-3 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Your Email"
        className="w-full border p-2 mb-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="text"
        placeholder="Your Address"
        className="w-full border p-2 mb-3 rounded"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />

      <textarea
        placeholder="Message (Optional)"
        className="w-full border p-2 mb-3 rounded"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        disabled={loadingAvailability}
      >
        {loadingAvailability ? "Loading..." : "Confirm Booking"}
      </button>
    </form>
  );
};

export default BookingForm;
