import mongoose from "mongoose";

const screenSchema = new mongoose.Schema(
  {
    name: String,
    theatre: { type: mongoose.Schema.Types.ObjectId, ref: "Theatre" },
    totalSeats: Number,
    seatLayout: { type: Array, default: [] }, // optional seat map
  },
  { timestamps: true }
);

const Screen =
  mongoose.models.Screen || mongoose.model("Screen", screenSchema);

export default Screen;
