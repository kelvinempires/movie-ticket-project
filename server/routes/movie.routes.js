import express from "express";
import {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getTrendingMovies,
} from "../controllers/movie.controller.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const movieRouter = express.Router();

movieRouter.post("/create",adminAuth, createMovie);
movieRouter.get("/get-all",authUser, getAllMovies);
movieRouter.get("/get/:movieId",authUser, getMovieById);
movieRouter.put("/update/:movieId",adminAuth, updateMovie);
movieRouter.delete("/delete/:movieId",adminAuth, deleteMovie);

movieRouter.get("/trending",getTrendingMovies); 

export default movieRouter;





