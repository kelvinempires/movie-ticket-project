import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { FaTicketAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSwipeable } from "react-swipeable";
import PropTypes from "prop-types";
import { ShopContext } from "../context/ShopContext";
import BookingModal from "./BookingModal";

const TrendingSlider = ({ movies }) => {
  const { backendUrl } = useContext(ShopContext);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showtimes, setShowtimes] = useState({});
  const [loadingShowtimes, setLoadingShowtimes] = useState(false);
  const [error, setError] = useState(null);

  const formatTime = useCallback((timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  }, []);

  const fetchShowtimes = useCallback(
    async (movieId) => {
      if (!movieId) return;

      setLoadingShowtimes(true);
      setError(null);
      try {
        const response = await axios.get(
          `${backendUrl}/api/showtime/movie/${movieId}`
        );

        const groupedByDate = response.data.reduce((acc, showtime) => {
          if (!showtime.showDate || !showtime.startTime) return acc;

          const dateStr = new Date(showtime.showDate)
            .toISOString()
            .split("T")[0];
          if (!acc[dateStr]) acc[dateStr] = [];

          const seatLayout = showtime.screen?.seatLayout || [];
          const totalSeats = seatLayout.reduce(
            (sum, row) => sum + (row.seats?.length || 0),
            0
          );
          const bookedSeats = showtime.bookedSeats?.length || 0;
          const seatsAvailable = Math.max(0, totalSeats - bookedSeats);

          acc[dateStr].push({
            time: formatTime(showtime.startTime),
            seatsAvailable,
            showtimeId: showtime._id,
            originalData: showtime,
          });

          return acc;
        }, {});

        setShowtimes(groupedByDate);
      } catch (err) {
        console.error("Failed to fetch showtimes:", err);
        if (err.response) {
          setError(err.response.data.message || "Failed to load showtimes");
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An unexpected error occurred");
        }
        setShowtimes({});
      } finally {
        setLoadingShowtimes(false);
      }
    },
    [backendUrl, formatTime]
  );

  const goToSlide = useCallback(
    (index) => {
      const newIndex = (index + movies.length) % movies.length;
      setCurrentSlide(newIndex);
      setShowBooking(false);

      if (movies[newIndex]?.id) {
        fetchShowtimes(movies[newIndex].id);
      }
    },
    [movies, fetchShowtimes]
  );

  const handlers = useSwipeable({
    onSwipedLeft: () => goToSlide(currentSlide + 1),
    onSwipedRight: () => goToSlide(currentSlide - 1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  useEffect(() => {
    if (isPaused || movies.length === 0) return;
    const interval = setInterval(() => goToSlide(currentSlide + 1), 6000);
    return () => clearInterval(interval);
  }, [currentSlide, isPaused, goToSlide, movies.length]);

  useEffect(() => {
    if (movies.length > 0) {
      fetchShowtimes(movies[0].id);
    }
  }, [movies, fetchShowtimes]);

  if (movies.length === 0) {
    return (
      <div className="relative w-full min-h-[32rem] flex items-center justify-center bg-gray-900 text-white">
        <p>No trending movies available at the moment.</p>
      </div>
    );
  }

  const currentMovie = movies[currentSlide];

  return (
    <div
      {...handlers}
      className="relative w-full min-h-[32rem] overflow-hidden shadow-2xl mt-15 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Trending movies carousel"
      aria-live="polite"
    >
      {movies.map((movie, index) => (
        <div
          key={`${movie.id}-${index}`}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={index !== currentSlide}
        >
          {index === currentSlide && (
            <>
              <div className="absolute top-4 left-5 z-20 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold flex items-center gap-1">
                  <FaTicketAlt className="text-xs" />
                  NOW SHOWING
                </span>
                <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                  {movie.vote_average.toFixed(1)} ★
                </span>
              </div>

              <img
                src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                    : "/placeholder-backdrop.jpg"
                }
                alt={movie.title}
                className="w-full h-full object-cover"
                loading={index === currentSlide ? "eager" : "lazy"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

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

                {!showBooking && (
                  <button
                    onClick={() => setShowBooking(true)}
                    className="mt-5 flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-yellow-400/30"
                    aria-label={`Book tickets for ${movie.title}`}
                  >
                    <FaTicketAlt className="text-lg" />
                    Book Tickets
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ))}

      <BookingModal
        show={showBooking}
        onClose={() => setShowBooking(false)}
        movie={currentMovie}
        showtimes={showtimes}
        loadingShowtimes={loadingShowtimes}
        error={error}
        onRetry={() => fetchShowtimes(currentMovie?.id)}
      />

      <button
        onClick={() => goToSlide(currentSlide - 1)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-30 hidden md:group-hover:block"
        aria-label="Previous movie"
      >
        <FaChevronLeft />
      </button>
      <button
        onClick={() => goToSlide(currentSlide + 1)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-30 hidden md:group-hover:block"
        aria-label="Next movie"
      >
        <FaChevronRight />
      </button>

      <div className="hidden sm:flex sm:absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
        {movies.map((_, index) => (
          <button
            key={`indicator-${index}`}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white w-6 scale-110"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
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
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      overview: PropTypes.string.isRequired,
      backdrop_path: PropTypes.string,
      vote_average: PropTypes.number.isRequired,
      release_date: PropTypes.string.isRequired,
      original_language: PropTypes.string.isRequired,
      genre_ids: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
};

export default TrendingSlider;
