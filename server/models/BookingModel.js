import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    showtime: { type: mongoose.Schema.Types.ObjectId, ref: "Showtime" },
    seats: [String], // ["A1", "A2"]
    totalPrice: Number,
    paymentStatus: { type: String, default: "pending" }, // "pending", "paid", "failed"
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
