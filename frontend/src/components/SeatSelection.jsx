import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { useContext } from "react";

const SeatSelection = ({ selectedSeats, onSeatSelect, showtimeId }) => {
  const { backendUrl } = useContext(ShopContext);
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch seats data when component mounts or showtimeId changes
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendUrl}/api/seat/showtime/${showtimeId}`
        );
        setSeats(response.data.seats);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Failed to load seat information");
        setLoading(false);
        toast.error("Failed to load seat information");
      }
    };

    if (showtimeId) {
      fetchSeats();
    }
  }, [showtimeId, backendUrl]);

  // Group seats by row for better visualization
  const groupSeatsByRow = () => {
    const rows = {};
    seats.forEach((seat) => {
      const row = seat.seat.match(/^[A-Za-z]+/)[0]; // Extract row letter
      if (!rows[row]) {
        rows[row] = [];
      }
      rows[row].push(seat);
    });
    return rows;
  };

  const handleSeatClick = (seat) => {
    if (seat.isBooked) return; // Don't allow selection of booked seats
    onSeatSelect(seat.seat);
  };

  const getSeatStatus = (seat) => {
    if (seat.isBooked) return "booked";
    if (selectedSeats.includes(seat.seat)) return "selected";
    return "available";
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  const seatRows = groupSeatsByRow();

  return (
    <div className="seat-selection-container">
      {/* Screen representation */}
      <div className="mb-8 text-center">
        <div className="mx-auto w-3/4 h-4 bg-gray-300 rounded-md shadow-lg mb-2"></div>
        <p className="text-sm text-gray-400">SCREEN</p>
      </div>

      {/* Seat legend */}
      <div className="flex justify-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-gray-300"></div>
          <span className="text-xs">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-purple-600"></div>
          <span className="text-xs">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-gray-600"></div>
          <span className="text-xs">Booked</span>
        </div>
      </div>

      {/* Seat layout */}
      <div className="flex flex-col items-center gap-2">
        {Object.entries(seatRows).map(([row, rowSeats]) => (
          <div key={row} className="flex gap-2">
            <div className="w-6 flex items-center justify-center text-sm font-medium">
              {row}
            </div>
            <div className="flex gap-2">
              {rowSeats.map((seat) => {
                const status = getSeatStatus(seat);
                return (
                  <button
                    key={seat.seat}
                    type="button"
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.isBooked}
                    className={`w-8 h-8 flex items-center justify-center text-xs rounded-sm transition-all ${
                      status === "available"
                        ? "bg-gray-300 hover:bg-gray-400"
                        : status === "selected"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    aria-label={`Seat ${seat.seat} - ${
                      seat.isBooked ? "Booked" : "Available"
                    }`}
                  >
                    {seat.seat.match(/\d+/)[0]} {/* Seat number */}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatSelection;
