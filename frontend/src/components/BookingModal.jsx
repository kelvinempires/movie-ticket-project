import { useState, useMemo, useContext } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaArrowLeft,
  FaTimes,
  FaChevronDown,
  FaSpinner,
  FaTicketAlt,
} from "react-icons/fa";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const BookingModal = ({
  show,
  onClose,
  movie,
  showtimes,
  loadingShowtimes,
  error,
  onRetry,
}) => {
  const { token, backendUrl } = useContext(ShopContext);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingError, setBookingError] = useState(null);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
    setBookingError(null);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setBookingError(null);
  };

  const dateOptions = useMemo(() => {
    return Object.keys(showtimes).map((date) => ({
      value: date,
      label: new Date(date).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      isWeekend: [0, 6].includes(new Date(date).getDay()),
    }));
  }, [showtimes]);

  const getSelectedShowtime = () => {
    if (!selectedDate || !selectedTime) return null;
    return showtimes[selectedDate]?.find((st) => st.time === selectedTime);
  };

  const handleBookNow = async () => {
    const showtime = getSelectedShowtime();
    if (!showtime) return;

    try {
      // Check seat availability first
      const availabilityResponse = await axios.post(
        `${backendUrl}/api/showtime/${showtime.showtimeId}/check-availability`,
        { seatsRequested: 1 }, // Assuming booking 1 seat for simplicity
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!availabilityResponse.data.available) {
        setBookingError("Selected seats are no longer available");
        return;
      }

      // If available, proceed to booking page
      // The Link component will handle the navigation
    } catch (err) {
      console.error("Booking error:", err);
      setBookingError(
        err.response?.data?.message || "Failed to check seat availability"
      );
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex top-12 justify-center p-4">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Booking Form */}
      <div className="relative z-50 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaCalendarAlt className="text-blue-400 text-xl" />
              <h3 className="text-white text-xl font-bold">Select Showtime</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-1"
              aria-label="Close booking modal"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {loadingShowtimes ? (
            <div className="py-8 flex flex-col items-center justify-center gap-3">
              <FaSpinner className="animate-spin text-2xl text-blue-400" />
              <p className="text-gray-400">Loading showtimes...</p>
            </div>
          ) : error ? (
            <div className="py-4 text-center text-red-400">
              {error}
              <button
                onClick={onRetry}
                className="mt-2 text-sm text-blue-400 hover:text-blue-300 transition flex items-center justify-center gap-1 mx-auto"
              >
                <FaArrowLeft className="text-xs" /> Retry
              </button>
            </div>
          ) : !selectedDate ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block font-medium">
                  Choose Date
                </label>
                <div className="relative">
                  <select
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition appearance-none"
                    disabled={Object.keys(showtimes).length === 0}
                    aria-label="Select show date"
                  >
                    <option value="">Select a date</option>
                    {dateOptions.map((date) => (
                      <option key={date.value} value={date.value}>
                        {date.label} {date.isWeekend && "🎉"}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              {Object.keys(showtimes).length === 0 && (
                <div className="py-4 text-center text-gray-400">
                  No showtimes available for this movie
                </div>
              )}
            </div>
          ) : !selectedTime ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block font-medium">
                  Available Times for{" "}
                  {new Date(selectedDate).toLocaleDateString()}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {showtimes[selectedDate]?.map((showtime) => (
                    <button
                      key={`${selectedDate}-${showtime.time}`}
                      onClick={() => handleTimeSelect(showtime.time)}
                      className={`px-4 py-3 rounded-lg border transition-all flex flex-col items-center ${
                        showtime.seatsAvailable < 10
                          ? "border-red-400/50 bg-red-900/20 hover:bg-red-900/30"
                          : "border-gray-600 hover:border-blue-400 bg-gray-700/80 hover:bg-gray-700"
                      }`}
                      aria-label={`Select showtime at ${showtime.time}`}
                    >
                      <span className="font-medium">{showtime.time}</span>
                      <span
                        className={`text-xs mt-1 ${
                          showtime.seatsAvailable < 10
                            ? "text-red-300"
                            : "text-gray-400"
                        }`}
                      >
                        {showtime.seatsAvailable} seats left
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedDate("")}
                className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
                aria-label="Go back to date selection"
              >
                <FaArrowLeft className="text-xs" /> Change date
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">Selected Showtime</p>
                    <p className="text-white font-medium">
                      {new Date(selectedDate).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Time</p>
                    <p className="text-white font-medium">{selectedTime}</p>
                  </div>
                </div>
              </div>

              {bookingError && (
                <div className="text-red-400 text-sm text-center">
                  {bookingError}
                </div>
              )}

              <Link
                to={`/book-ticket/${getSelectedShowtime()?.showtimeId}`}
                state={{
                  movie,
                  showtime: {
                    date: selectedDate,
                    time: selectedTime,
                    seatsAvailable: getSelectedShowtime()?.seatsAvailable,
                    screenId: getSelectedShowtime()?.originalData.screen?._id,
                  },
                }}
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-4 py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                onClick={(e) => {
                  if (bookingError) {
                    e.preventDefault();
                  } else {
                    handleBookNow();
                  }
                }}
                aria-label="Proceed to seat selection"
              >
                <FaTicketAlt /> Select Seats
              </Link>

              <button
                onClick={() => setSelectedTime("")}
                className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1 mx-auto"
                aria-label="Go back to time selection"
              >
                <FaArrowLeft className="text-xs" /> Change time
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

BookingModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    // Add other movie properties you use
  }).isRequired,
  showtimes: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string.isRequired,
        seatsAvailable: PropTypes.number.isRequired,
        showtimeId: PropTypes.string.isRequired,
        originalData: PropTypes.object.isRequired,
      })
    )
  ).isRequired,
  loadingShowtimes: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
};

export default BookingModal;
