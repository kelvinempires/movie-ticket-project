import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaTicketAlt, FaSpinner } from "react-icons/fa";
import { fetchMovieDetailsById } from "../services/omdbApi";
// import { fetchMovieDetails } from "../services/tmdbApi";

const BookTicketPage = () => {
  const { movieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract date and time from query params
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const time = queryParams.get("time");

  useEffect(() => {
     if (!movieId) {
       setError(new Error("Invalid movie URL - no ID provided"));
       setLoading(false);
       return;
     }
  const loadMovieDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const details = await fetchMovieDetailsById(movieId);

      if (!details || details.Response === "False") {
        throw new Error(details?.Error || "Movie not found");
      }

      setMovieDetails(details);
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
      setError(err);

      if (err.message.includes("Invalid API")) {
        navigate("/error?message=Invalid+API+Key");
      } else {
        navigate("/error?message=Failed+to+load+movie");
      }
    } finally {
      setLoading(false);
    }
  };
    
    loadMovieDetails();
  }, [movieId, navigate]);

  if (!movieId) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-red-100 border-l-4 border-red-500 p-4">
          <h3 className="text-sm font-medium text-red-800">
            Invalid Movie URL
          </h3>
          <p className="mt-2 text-sm text-red-700">
            The URL doesn't contain a valid movie ID.
          </p>
          <button
            onClick={() => navigate("/movies")}
            className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
          >
            <FaArrowLeft className="mr-2" /> Browse Movies
          </button>
        </div>
      </div>
    );
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="max-w-md mx-auto bg-red-100 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading movie details
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error.message || "Unknown error occurred"}
              </div>
              <button
                onClick={() => navigate(-1)}
                className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
              >
                <FaArrowLeft className="mr-2" /> Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="p-8 text-center">
        <p>No movie data available</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Browse Movies
        </button>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h1 className="text-2xl leading-6 font-bold text-gray-900">
            {movieDetails.Title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">{movieDetails.Tagline}</p>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <div className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Showtime Details
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="font-medium">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-blue-600 font-bold">{time}</p>
                </div>
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Movie Overview
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {movieDetails.Overview}
              </dd>
            </div>

            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Runtime</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {movieDetails.Runtime} minutes
              </dd>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            onClick={() => {
              // Here you would typically proceed to payment
              // For now, we'll just show a confirmation
              alert(
                `Booking confirmed for ${movieDetails.Title} at ${time} on ${date}`
              );
              navigate("/");
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FaTicketAlt className="mr-2" /> Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookTicketPage;
