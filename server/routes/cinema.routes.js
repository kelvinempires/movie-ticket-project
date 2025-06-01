import express from "express";
import {
  createCinema,
  getAllCinemas,
  getCinemaById,
  updateCinema,
  deleteCinema,
} from "../controllers/cinema.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const cinemaRouter = express.Router();

cinemaRouter.post("/createCinema", adminAuth, createCinema);
cinemaRouter.get("/getAllCinemas", getAllCinemas);
cinemaRouter.get("/get/:cinemaId", getCinemaById);
cinemaRouter.put("/update/:cinemaId", adminAuth, updateCinema);
cinemaRouter.delete("/delete/:cinemaId", adminAuth, deleteCinema);

export default cinemaRouter;
