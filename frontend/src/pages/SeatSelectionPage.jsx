// SeatSelectionPage.js
import { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import SeatSelection from "./SeatSelection";
import { toast } from "react-toastify";

const SeatSelectionPage = () => {
  const { showtimeId } = useParams();
  const { state } = useLocation();
  const { backendUrl, userToken } = useContext(ShopContext);
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch showtime details
  useEffect(() => {
    const fetchShowtimeDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/showtime/${showtimeId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setShowtime(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load showtime");
        toast.error("Failed to load showtime details");
      } finally {
        setLoading(false);
      }
    };

    if (showtimeId) {
      fetchShowtimeDetails();
    }
  }, [showtimeId, backendUrl, userToken]);

  // Handle seat selection
  const handleSeatSelect = (seatNumber) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  // Handle booking submission
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      toast.warning("Please select at least one seat");
      return;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/booking/create`,
        {
          showtime: showtimeId,
          seats: selectedSeats,
          totalPrice: selectedSeats.length * 10, // Example pricing
          user: state.userId, // Assuming you pass userId in location state
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      toast.success("Booking created successfully!");
      navigate("/booking-confirmation", {
        state: {
          booking: response.data.booking,
          movie: state.movie,
        },
      });
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Failed to create booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {state?.movie?.title}
          </h1>
          <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
            <div>
              <span className="font-medium">Date:</span>{" "}
              {new Date(showtime?.showDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Time:</span> {showtime?.startTime}
            </div>
            <div>
              <span className="font-medium">Theater:</span>{" "}
              {showtime?.theatre?.name}
            </div>
          </div>
        </div>

        <SeatSelection
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
          showtimeId={showtimeId}
        />

        <div className="mt-8 flex justify-between items-center">
          <div>
            <p className="text-gray-700">
              Selected seats:{" "}
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </p>
            <p className="text-lg font-semibold mt-2">
              Total: ${selectedSeats.length * 10}.00
            </p>
          </div>
          <button
            onClick={handleBooking}
            disabled={selectedSeats.length === 0}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              selectedSeats.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
