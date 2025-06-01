import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { options } from "../services/omdbApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Movie2Card from "../components/Movie2card";
import MovieDetailsCard from "../components/MovieDetailsCard";
// import Header from "../components/NavBarr";

const MovieDetails = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommendLoading, setRecommendLoading] = useState(false);

  const { pathname } = useLocation();
  const tvPath = pathname.includes("tv");
  const { id } = useParams();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const url = `https://api.themoviedb.org/3/${
          tvPath ? "tv" : "movie"
        }/${id}?language=en-US`;
        const response = await axios.get(url, options);
        setMovie(response.data);
        setRecommendLoading(true);

        // Fetching recommendations
        try {
          const recUrl = `https://api.themoviedb.org/3/${
            tvPath ? "tv" : "movie"
          }/${id}/recommendations?language=en-US`;
          const recResponse = await axios.get(recUrl, options);
          setRecommendations(recResponse.data.results);
        } catch (error) {
          console.error("Error fetching recommendations:", error);
        } finally {
          setRecommendLoading(false);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id, tvPath]);
if (loading) {
  return (
    <div className="flex flex-col w-full items-center justify-center h-screen">
      <div className="p-4 max-w-7xl mx-auto">
        <div className="md:flex md:space-x-6">
          <Skeleton height={500} width={400} className="rounded-lg shadow-lg" />
          <div className="mt-4 md:mt-0 flex-1 space-y-4">
            <Skeleton height={30} width="100%" />
            <Skeleton height={20} width="100%" />
            <Skeleton count={5} />
            <Skeleton height={30} width="80%" />
            <Skeleton height={30} width="50%" />
            <Skeleton height={30} width="70%" />
            <Skeleton height={40} width={150} />
          </div>
        </div>
      </div>
      <div className="flex space-x-4">
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
        <Skeleton height={40} width={120} />
      </div>
    </div>
  );
}


  const { backdrop_path } = movie;

  return (
    <div className="relative flex flex-col items-center w-full h-full">
      {/* <Header /> */}

      {/* Background Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-center bg-cover bg-fixed bg-opacity-50"
        style={{
          backgroundImage: backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${backdrop_path})`
            : "none",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50"></div>
      </div>

      <MovieDetailsCard movie={movie} />

      <div className="relative w-full lg:w-11/12 z-10">
        <h2 className="font-playfair text-2xl lg:text-3xl font-semibold mb-4 text-white">
          Recommended for You
        </h2>

        {recommendLoading ? (
          <div className="flex overflow-x-scroll pb-6 gap-4">
            {[...Array(6)].map((_, index) => (
              <Movie2Card key={index} loading={true} />
            ))}
          </div>
        ) : (
          <div className="flex overflow-x-scroll scroll-smooth pb-6 min-h-0">
            <div className="flex flex-nowrap space-x-0">
              {recommendations.map((rec) => (
                <Movie2Card key={rec.id} movie={rec} loading={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
