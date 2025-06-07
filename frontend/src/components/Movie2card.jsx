import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";

const Movie2Card = ({ movie, loading }) => {
  if (loading) {
    return (
      <div className="w-36 sm:w-40 mr-4">
        <Skeleton height={192} borderRadius={12} />
        <Skeleton height={20} className="mt-2" />
        <Skeleton height={14} width={80} className="mt-1" />
      </div>
    );
  }

  const imageUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/200x300?text=No+Image";

  return (
    <Link
      to={movie?.media_type === "tv" ? `/tv/${movie.id}` : `/movie/${movie.id}`}
      className="w-36 sm:w-40 mr-4 transform transition-transform hover:scale-105"
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-2 shadow-lg hover:shadow-xl transition">
        <img
          src={imageUrl}
          alt={movie.title || movie.name}
          className="w-full h-48 object-cover rounded-lg hover:opacity-90 hover:scale-105 transition duration-300"
          loading="lazy"
        />
        <div className="mt-2 text-white">
          <h2
            className="text-sm font-semibold truncate"
            title={movie.title || movie.name}
          >
            {movie.title || movie.name}
          </h2>
          <p className="text-xs text-gray-300">
            ⭐ {movie.vote_average?.toFixed(1) || "N/A"} |{" "}
            {movie.release_date || movie.first_air_date || "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Movie2Card;
