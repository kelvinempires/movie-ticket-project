// src/context/MovieContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState({
    nowPlaying: [],
    comingSoon: [],
    featured: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      if (import.meta.env.MODE === "development") {
        // Use mock data in development
        const { mockMovies } = await import("../mocks/movies");
        setMovies({
          nowPlaying: mockMovies.nowPlaying,
          comingSoon: mockMovies.comingSoon,
          featured: mockMovies.nowPlaying.slice(0, 5),
        });
      } else {
        // Real API calls in production
        const [nowPlayingRes, comingSoonRes] = await Promise.all([
          axios.get("/api/movies/now-playing"),
          axios.get("/api/movies/coming-soon"),
        ]);
        setMovies({
          nowPlaying: nowPlayingRes.data,
          comingSoon: comingSoonRes.data,
          featured: nowPlayingRes.data.slice(0, 5),
        });
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error(`Failed to fetch movies: ${error.message}`);
      setLoading(false);
    }
  };

  const reserveSeats = async (movieId, showtimeId, seats) => {
    try {
      const res = await axios.post(
        `/api/movies/${movieId}/showtimes/${showtimeId}/reserve`,
        { seats }
      );

      toast.success("Seats successfully reserved!");
      return res.data;
    } catch (error) {
      console.error(
        "Error reserving seats:",
        error?.response?.data || error.message
      );
      toast.error("Failed to reserve seats. Please try again.");
      return false;
    }
  };

  const getMovieById = async (id) => {
    try {
      if (import.meta.env.MODE === "development") {
        const { getMovieById: mockGetMovieById } = await import(
          "../mocks/movies"
        );
        return mockGetMovieById(id);
      }
      const res = await axios.get(`/api/movies/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching movie details (ID: ${id}):`, error);
      toast.error(`Failed to fetch movie details: ${error.message}`);
      return null;
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <MovieContext.Provider
      value={{
        ...movies,
        loading,
        getMovieById,
        refreshMovies: fetchMovies,
        reserveSeats,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
