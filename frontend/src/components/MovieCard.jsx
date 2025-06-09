import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css"; // Don't forget this import for proper styling

const MovieCard = ({ movie, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 bg-slate-100/10 p-1 md:p-5 rounded-lg">
        <Skeleton height={256} borderRadius={12} /> {/* Image skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton height={20} width={`80%`} /> {/* Title skeleton */}
          <Skeleton height={14} width={`60%`} /> {/* Meta info skeleton */}
        </div>
      </div>
    );
  }

  return (
    <Link
      to={
        movie?.media_type === "movie" ? `/movie/${movie.id}` : `/tv/${movie.id}`
      }
      className="flex flex-col gap-4 hover:cursor-pointer bg-slate-100/10 p-1 md:p-5 rounded-lg"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        className="h-64 rounded-xl"
        alt=""
      />
      <div className="flex flex-col text-sm items-center">
        <h2 className="font-bold">{movie.title || movie.name}</h2>
        <p className="text-xs text-gray-300">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"} |{" "}
          {movie.release_date || movie.first_air_date || "N/A"}
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
