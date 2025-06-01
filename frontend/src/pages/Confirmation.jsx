// src/pages/Confirmation.jsx
import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle, FaPrint, FaEnvelope, FaHome } from "react-icons/fa";

const Confirmation = () => {
  const { state } = useLocation();
  const { booking, movie } = state || {};

  if (!booking || !movie) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          No booking information found
        </h1>
        <Link
          to="/"
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <FaCheckCircle className="text-5xl text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-purple-100">
            Your tickets have been successfully booked
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-32 h-48 object-cover rounded-md"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {movie.title}
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">
                    {new Date(booking.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Time</p>
                  <p className="font-medium">{booking.time}</p>
                </div>
                <div>
                  <p className="text-gray-600">Theater</p>
                  <p className="font-medium">CineBook Premium (Screen 3)</p>
                </div>
                <div>
                  <p className="text-gray-600">Seats</p>
                  <p className="font-medium">{booking.seats.join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Booking Summary
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  Tickets ({booking.seats.length})
                </span>
                <span className="font-medium">
                  ${booking.seats.length * 12}.00
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Convenience Fee</span>
                <span className="font-medium">$2.50</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-800 font-semibold">Total</span>
                <span className="text-purple-600 font-bold">
                  ${(booking.seats.length * 12 + 2.5).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Booking Reference
            </h3>
            <div className="bg-gray-900 text-white p-4 rounded-md font-mono mb-4">
              CINE-{Math.random().toString(36).substring(2, 10).toUpperCase()}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300">
                <FaPrint /> Print Tickets
              </button>
              <button className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition duration-300">
                <FaEnvelope /> Email Receipt
              </button>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
              >
                <FaHome /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
