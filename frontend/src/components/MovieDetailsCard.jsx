import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt } from "react-icons/fa";
import { options } from "../services/omdbApi";

const MovieDetailsCard = ({ title, name, movie, vote_average }) => {
  const [cast, setCast] = useState([]);
  const [hover, setHover] = useState({ index: null, show: false });
  const [showBooking, setShowBooking] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const showtimesByDate = {
    "2025-05-27": ["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM"],
    "2025-05-28": ["11:00 AM", "2:00 PM", "5:00 PM"],
    "2025-05-29": ["12:00 PM", "3:00 PM", "6:00 PM", "9:00 PM"],
  };

  useEffect(() => {
    const fetchCast = async () => {
      const url = `https://api.themoviedb.org/3/movie/${movie?.id}/credits`;
      try {
        const response = await axios.get(url, options);
        setCast(response.data.cast.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCast();
  }, [movie?.id]);

  const isNowShowing = new Date(movie?.release_date) <= new Date();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime("");
  };

  const getStars = (vote) => {
    const stars = [];
    const full = Math.floor(vote / 2);
    const half = vote % 2 >= 1 ? 1 : 0;
    const empty = 5 - full - half;
    for (let i = 0; i < full; i++) stars.push("★");
    if (half) stars.push("☆");
    for (let j = 0; j < empty; j++) stars.push("✩");
    return stars.join("");
  };

  return (
    <div className="relative top-10 w-full lg:w-11/12 p-12 z-10">
      <div className="md:flex md:space-x-6">
        <img
          className="rounded-lg shadow-lg w-auto md:w-48"
          src={`https://image.tmdb.org/t/p/w500/${movie?.poster_path}`}
          alt={title || name}
        />
        <div className="mt-4 md:mt-0 text-zinc-400 flex flex-col justify-center">
          <h1 className="text-3xl lg:text-4xl font-bold">{title || name}</h1>
          <div className="flex gap-2 items-center mt-4 flex-wrap">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isNowShowing
                  ? "bg-green-600 text-white"
                  : "bg-yellow-500 text-black"
              }`}
            >
              {isNowShowing ? "Now Showing" : "Coming Soon"}
            </span>
            {movie?.release_date &&
              new Date(movie.release_date) <= new Date() && (
                <span className="text-gray-300">Release Date:</span>
              )}{" "}
            <span className="text-sm">{movie?.release_date}</span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-3xl">
                {getStars(movie?.vote_average)}
              </span>
              <span className="text-gray-300 ml-1">{vote_average}</span>
            </div>
          </div>

          <h2 className="font-playfair text-3xl lg:text-4xl font-semibold mt-4 text-white">
            {movie?.title || movie?.name}
          </h2>
          <p className="text-lg leading-relaxed flex-wrap">{movie?.overview}</p>
          <div className="flex flex-col sm:flex-row sm:gap-10 gap-4 mt-4">
            <div>
              <h1 className="text-white">Genres:</h1>
              <div className="flex flex-wrap">
                {movie?.genres?.map((genre) => (
                  <span key={genre.id} className="text-zinc-400 text-sm mr-2">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-white">Country:</h2>
              <div className="flex flex-wrap">
                {movie?.production_countries?.map((country) => (
                  <span
                    key={country.iso_3166_1}
                    className="text-zinc-400 text-sm mr-2"
                  >
                    {country.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 relative">
              <span className="text-white font-semibold font-oswald">
                Casts:
              </span>
              <span>
                {cast?.map((actor, index) => (
                  <div key={actor.id} className="inline space-x-6">
                    <span
                      className="cursor-pointer hover:underline text-blue-200 text-sm inline-flex mr-1"
                      onMouseEnter={() => setHover({ index, show: true })}
                      onMouseLeave={() =>
                        setHover({ index: null, show: false })
                      }
                    >
                      {actor.name}
                      {index !== cast.length - 1 ? ", " : ""}
                      {hover.index === index && hover.show && (
                        <span className="backdrop-blur-sm bg-white/30 text-white flex flex-col items-center justify-center rounded-2xl min-w-24 min-h-24 w-fit font-semibold absolute top-[-6.5rem]">
                          <img
                            className="h-16 w-16 object-cover rounded-full animate-bounce"
                            src={`https://image.tmdb.org/t/p/w500/${actor?.profile_path}`}
                            alt={actor.name}
                          />
                          <p className="text-xs text-center">
                            {actor.character}
                          </p>
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </span>
            </div>
          </div>

          {/* Showtime Booking Section */}
          {!showBooking ? (
            <button
              onClick={() => setShowBooking(true)}
              className="mt-5 flex items-center gap-2 bg-yellow-400 text-black font-semibold px-5 py-2 rounded-xl hover:bg-yellow-300 transition"
            >
              <FaTicketAlt />
              Book Ticket
            </button>
          ) : (
            <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-white text-lg font-semibold mb-4">
                🎬 Select Showtime
              </h3>

              {!selectedDate ? (
                <div>
                  <label className="text-sm text-gray-300 mb-2 block">
                    Choose a Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">-- Select Date --</option>
                    {Object.keys(showtimesByDate).map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </option>
                    ))}
                  </select>
                </div>
              ) : !selectedTime ? (
                <div>
                  <label className="text-sm text-gray-300 mb-2 block mt-4">
                    Choose a Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">-- Select Time --</option>
                    {showtimesByDate[selectedDate].map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setSelectedDate("")}
                    className="mt-3 text-xs text-gray-400 hover:text-white transition"
                  >
                    ⬅️ Change Date
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <Link
                    to={`/book-ticket/${movie.id}?date=${selectedDate}&time=${selectedTime}`}
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-md transition-all transform hover:scale-105"
                  >
                    🎟️ Proceed to Booking
                  </Link>
                  <button
                    onClick={() => setSelectedTime("")}
                    className="mt-2 text-xs text-gray-400 hover:text-white transition"
                  >
                    ⬅️ Change Time
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsCard;
