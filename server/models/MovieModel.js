import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    genre: [String],
    language: String,
    duration: Number, // in minutes
    releaseDate: Date,
    posterUrl: String,
    trailerUrl: String,
    rating: Number, // e.g. 7.5
  },
  { timestamps: true }
);

const Movie =
  mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;
