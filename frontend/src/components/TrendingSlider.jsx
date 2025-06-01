import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaTicketAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaArrowLeft,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import PropTypes from "prop-types";

const TrendingSlider = ({ movies }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const showtimesByDate = {
    "2025-05-28": [
      { time: "1:00 PM", seatsAvailable: 45 },
      { time: "4:00 PM", seatsAvailable: 32 },
      { time: "8:00 PM", seatsAvailable: 12 },
    ],
    "2025-05-29": [
      { time: "2:00 PM", seatsAvailable: 56 },
      { time: "6:00 PM", seatsAvailable: 23 },
    ],
    "2025-05-30": [
      { time: "12:00 PM", seatsAvailable: 67 },
      { time: "3:00 PM", seatsAvailable: 41 },
      { time: "7:00 PM", seatsAvailable: 8 },
    ],
  };

  const goToSlide = (index) => {
    setCurrentSlide((index + movies.length) % movies.length);
    setShowBooking(false);
    setSelectedDate("");
    setSelectedTime("");
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => goToSlide(currentSlide + 1),
    onSwipedRight: () => goToSlide(currentSlide - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => goToSlide(currentSlide + 1), 6000);
    return () => clearInterval(interval);
  }, [currentSlide, isPaused]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };

  const getDateOptions = () => {
    return Object.keys(showtimesByDate).map((date) => ({
      value: date,
      label: new Date(date).toLocaleDateString(undefined, {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
      isWeekend: [0, 6].includes(new Date(date).getDay()),
    }));
  };

  return (
    <div
      {...handlers}
      className="relative w-full min-h-[32rem] overflow-hidden shadow-2xl mt-15 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Now Showing Badge */}
          {index === currentSlide && (
            <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center gap-1">
                <FaTicketAlt className="text-xs" />
                NOW SHOWING
              </span>
              <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                {movie.vote_average.toFixed(1)} ★
              </span>
            </div>
          )}

          {/* Movie Backdrop */}
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          {/* Movie Info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-16 text-white z-20">
            <div className="mb-4">
              <span className="text-yellow-400 text-sm font-semibold">
                {movie.release_date.split("-")[0]} •{" "}
                {movie.original_language.toUpperCase()}
              </span>
              <h2 className="font-playfair text-3xl md:text-5xl font-bold mt-1">
                {movie.title}
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {movie.genre_ids.slice(0, 3).map((genreId) => (
                  <span
                    key={genreId}
                    className="px-2 py-1 bg-white/10 rounded-full text-xs"
                  >
                    {getGenreName(genreId)}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-md md:text-lg text-gray-200 line-clamp-2 md:line-clamp-3">
              {movie.overview}
            </p>

            {/* Book Ticket Button */}
            {!showBooking && (
              <button
                onClick={() => setShowBooking(true)}
                className="mt-5 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-400/30"
              >
                <FaTicketAlt className="text-lg" />
                Book Tickets
              </button>
            )}
          </div>
        </div>
      ))}

      {/* Booking Modal Overlay */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex top-12  justify-center p-4">
          {/* Blurred Background */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowBooking(false)}
          />

          {/* Booking Form */}
          <div className="relative z-50 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-blue-400 text-xl" />
                  <h3 className="text-white text-xl font-bold">
                    Select Showtime
                  </h3>
                </div>
                <button
                  onClick={() => setShowBooking(false)}
                  className="text-gray-400 hover:text-white transition p-1"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              {!selectedDate ? (
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
                      >
                        <option value="">Select a date</option>
                        {getDateOptions().map((date) => (
                          <option key={date.value} value={date.value}>
                            {date.label} {date.isWeekend && "🎉"}
                          </option>
                        ))}
                      </select>
                      <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              ) : !selectedTime ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-300 mb-2 block font-medium">
                      Available Times for{" "}
                      {new Date(selectedDate).toLocaleDateString()}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {showtimesByDate[selectedDate].map((showtime) => (
                        <button
                          key={showtime.time}
                          onClick={() => setSelectedTime(showtime.time)}
                          className={`px-4 py-3 rounded-lg border transition-all flex flex-col items-center ${
                            showtime.seatsAvailable < 10
                              ? "border-red-400/50 bg-red-900/20 hover:bg-red-900/30"
                              : "border-gray-600 hover:border-blue-400 bg-gray-700/80 hover:bg-gray-700"
                          }`}
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
                  >
                    <FaArrowLeft className="text-xs" /> Change date
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-400 text-sm">
                          Selected Showtime
                        </p>
                        <p className="text-white font-medium">
                          {new Date(selectedDate).toLocaleDateString(
                            undefined,
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Time</p>
                        <p className="text-white font-medium">{selectedTime}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/book-ticket/${movies[currentSlide].id}?date=${selectedDate}&time=${selectedTime}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-4 py-3 rounded-lg transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    <FaTicketAlt /> Select Seats
                  </Link>

                  <button
                    onClick={() => setSelectedTime("")}
                    className="text-sm text-gray-400 hover:text-white transition flex items-center gap-1 mx-auto"
                  >
                    <FaArrowLeft className="text-xs" /> Change time
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <button
        onClick={() => goToSlide(currentSlide - 1)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-30 hidden md:group-hover:block"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => goToSlide(currentSlide + 1)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-30 hidden md:group-hover:block"
      >
        <FaChevronRight />
      </button>

      {/* Slide Indicators */}
      <div className="hidden sm:flex sm:absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-6 scale-110"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const getGenreName = (genreId) => {
  const genres = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Sci-Fi",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  return genres[genreId] || "Genre";
};

TrendingSlider.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      title: PropTypes.string,
      overview: PropTypes.string,
      backdrop_path: PropTypes.string,
      vote_average: PropTypes.number,
      release_date: PropTypes.string,
      original_language: PropTypes.string,
      genre_ids: PropTypes.arrayOf(PropTypes.number),
    })
  ).isRequired,
};

export default TrendingSlider;
