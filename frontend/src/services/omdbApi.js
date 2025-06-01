import axios from "axios";

// Base URL for the OMDB (Open Movie Database) API
const BASE_URL = `http://www.omdbapi.com/`;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const fetchAllMovies = async (page = 1) => {
  const response = await axios.get(
    `${BASE_URL}?apikey=${API_KEY}&s=man&page=${page}`
  );
  return response.data;
};

// export const fetchMovieDetailsById = async (id) => {
//   try {
//     const response = await axios.get(`${BASE_URL}?apikey=${API_KEY}&i=${id}`);
//     return response.data;
//   } catch (error) {
//     console.log({ Error: error.message });
//     return null;
//   }
// };
export const fetchMovieDetailsById = async (id) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        apikey: API_KEY, // Note: "apikey" (lowercase) is correct for OMDb
        i: id, // IMDb ID
        plot: "full", // Get full plot details
      },
    });

    // OMDb returns {Response: "False"} when there's an error
    if (response.data.Response === "False") {
      throw new Error(response.data.Error || "OMDb API error");
    }

    return response.data;
  } catch (error) {
    console.error("OMDb API Error:", error);
    throw error;
  }
};
export const fetchMovieByTitle = async (title) => {
  try {
    const response = await axios.get(
      `${BASE_URL}?apikey=${API_KEY}&t=${title}`
    );
    return response.data;
  } catch (error) {
    console.log({ Error: error.message });
    return null;
  }
};

 export const options = {
   method: "GET",
   headers: {
     accept: "application/json",
     Authorization: import.meta.env.VITE_TMDB_API_KEY,
   },
 };
