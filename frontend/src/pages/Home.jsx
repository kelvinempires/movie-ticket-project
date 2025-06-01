import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import axios from "axios";
import { options } from "../services/omdbApi";
import TrendingSlider from "../components/TrendingSlider"; // <-- import only once!

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingResponse, moviesResponse] = await Promise.all([
          axios.get(
            "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
            options
          ),
          axios.get(
            "https://api.themoviedb.org/3/trending/all/week?language=en-US",
            options
          ),
        ]);

        setTrendingMovies(trendingResponse.data.results);
        setMovies(moviesResponse.data.results);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

 if (isLoading) {
   return (
     <div className="px-4 md:px-8 mt-8 w-full">
       <h2 className="text-lg md:text-2xl font-bold text-white">Loading...</h2>
       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center my-8 gap-4">
         {[...Array(10)].map((_, index) => (
           <MovieCard key={index} loading={true} />
         ))}
       </div>
     </div>
   );
 }



  if (error) {
    return (
      <div className="error-state">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="text relative overflow-hidden bg-black">

      {/* ✅ Trending Slider Replaces Horizontal Scroll */}
      <TrendingSlider movies={trendingMovies} />

      <div className="px-4 md:px-8 mt-8">
        <h2 className="font-prata text-lg md:text-2xl font-bold">Trending</h2>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center my-8 gap-4"
          aria-label="All Movies"
          aria-live="polite"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} loading={false} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
