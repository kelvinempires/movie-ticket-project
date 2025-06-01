import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "en-US",
  },
});

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("TMDB API Error:", error);
    throw error;
  }
};

export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get("/movie/popular", {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("TMDB API Error:", error);
    throw error;
  }
};
