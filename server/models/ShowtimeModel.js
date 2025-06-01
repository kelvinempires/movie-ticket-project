import mongoose from "mongoose";

const showtimeSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
    screen: { type: mongoose.Schema.Types.ObjectId, ref: "Screen" },
    showDate: Date,
    startTime: String, // "14:00"
    endTime: String,
    price: Number,
    bookedSeats: [{ type: String }], // e.g. ["A1", "A2"]
  },
  { timestamps: true }
);

const Showtime =
  mongoose.models.Showtime || mongoose.model("Showtime", showtimeSchema);

export default Showtime;
