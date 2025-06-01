import Movie from "../models/MovieModel.js";
import express from "express";
import axios from "axios";

// CREATE a new movie
export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    const saved = await movie.save();
    res.status(201).json({ message: "Movie created", movie: saved });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating movie", error: err.message });
  }
};

// GET all movies (optionally filter by genre, language, etc.)
export const getAllMovies = async (req, res) => {
  const { genre, language, search } = req.query;

  let filter = {};
  if (genre) filter.genre = genre;
  if (language) filter.language = language;
  if (search) filter.title = { $regex: search, $options: "i" };

  try {
    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.status(200).json(movies);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching movies", error: err.message });
  }
};

// GET single movie by ID
export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching movie", error: err.message });
  }
};

// UPDATE movie by ID
export const updateMovie = async (req, res) => {
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie updated", movie: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating movie", error: err.message });
  }
};

// DELETE movie by ID
export const deleteMovie = async (req, res) => {
  try {
    const deleted = await Movie.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json({ message: "Movie deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting movie", error: err.message });
  }
};

export const getTrendingMovies = async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.themoviedb.org/3/trending/all/week",
      {
        params: {
          language: "en-US",
        },
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`, // store your key in `.env`
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("TMDB error:", error.message);
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
}