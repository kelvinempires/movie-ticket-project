import { useEffect, useState } from "react";
import axios from "axios";
import { options } from "../services/omdbApi";
import Movie2Card from "../components/Movie2card";
import TrendingSlider from "../components/TrendingSlider";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Newsletter from "../components/NewLatter";

const MoviesPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch trending movies
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/week",
          options
        );
        setMovies(response.data.results);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white ">
      {/* Hero Slider */}
      {loading ? (
        <div className="w-full h-[500px] flex items-center justify-center">
          <Skeleton height={500} width="100%" />
        </div>
      ) : (
        <TrendingSlider movies={movies.slice(0, 5)} />
      )}

      {/* Movie Grid */}
      <div className="flex flex-col items-center mx-auto p-4 mt-10">
        <h2 className=" font-playfair text-2xl md:text-3xl font-bold mb-6">
          🎥 Top Movies
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array(10)
              .fill()
              .map((_, index) => (
                <Movie2Card key={index} loading={true} />
              ))}
          </div>
        ) : (
          <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {movies.map((movie) => (
              <Movie2Card key={movie.id} movie={movie} />
            ))}
          </div>
        )}
        <Newsletter />
      </div>
    </div>
  );
};

export default MoviesPage;
