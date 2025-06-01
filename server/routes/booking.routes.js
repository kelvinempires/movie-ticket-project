// routes/booking.routes.js

import express from "express";
import {
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  createBooking,
} from "../controllers/booking.controller.js";
import authUser from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const bookingRouter = express.Router();

bookingRouter.post("/create", authUser, createBooking);
bookingRouter.get("/get", adminAuth, getAllBookings);
bookingRouter.get("/get/:bookingId", authUser, getBookingById);
bookingRouter.put("/update/:bookingId", authUser, updateBooking);
bookingRouter.delete("/delete/:bookingId", authUser, deleteBooking);

export default bookingRouter;
