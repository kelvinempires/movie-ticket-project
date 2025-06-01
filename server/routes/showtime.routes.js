import express from "express";
import {
  createShowtime,
  getAllShowtimes,
  getShowtimeById,
  updateShowtime,
  deleteShowtime,
} from "../controllers/showtime.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const showtimeRouter = express.Router();

showtimeRouter.post("/create",adminAuth, createShowtime);
showtimeRouter.get("/get", getAllShowtimes);
showtimeRouter.get("/get/:showtimeId", getShowtimeById);
showtimeRouter.put("/update/:showtimeId",adminAuth, updateShowtime);
showtimeRouter.delete("/delete/:showtimeId",adminAuth, deleteShowtime);

export default showtimeRouter;
