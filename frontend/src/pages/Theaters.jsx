import { useEffect, useState } from "react";
import axios from "axios";
import { options } from "../services/omdbApi";
import Newsletter from "../components/NewLatter";

const Theaters = () => {
  const [movies, setMovies] = useState([]);
  const [region, setRegion] = useState("NG");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?region=${region}&page=${page}`,
          options
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching now playing movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNowPlaying();
  }, [region, page]);

  return (
    <div className="bg-black min-h-screen text-white py-15 px-4sm:px-20">
      <h2 className="font-playfair font-bold text-3xl p-4">
        Now Playing in Theaters ({region})
      </h2>

      {/* Region selector */}
      <div className="p-4">
        <label htmlFor="region" className="mr-2">
          Select Region:
        </label>
        <select
          id="region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="bg-gray-800 text-white p-2 rounded"
        >
          <option value="NG">Nigeria</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="FR">France</option>
        </select>
      </div>

      {loading ? (
        <p className="p-4">Loading movies...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-4">
          {movies.map((movie) => (
            <div key={movie.id} className="bg-gray-900 rounded p-3">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="rounded"
              />
              <h3 className="mt-2 font-semibold">{movie.title}</h3>
              <p className="text-sm text-gray-400">{movie.release_date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination buttons */}
      <div className="flex justify-center gap-4 my-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-blue-600 rounded disabled:bg-gray-600"
        >
          Prev
        </button>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Next
        </button>
      </div>
      <Newsletter/>
    </div>
  );
};

export default Theaters;
