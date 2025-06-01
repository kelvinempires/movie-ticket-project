import express from "express";
import { checkSeatsAvailability, getSeatsForShowtime } from "../controllers/seat.controller.js";
import authUser from "../middleware/auth.js";

const seatRouter = express.Router();
seatRouter.get("/showtime/:showtimeId", getSeatsForShowtime);
seatRouter.post("/showtime/:showtimeId",authUser, checkSeatsAvailability);

export default seatRouter;
