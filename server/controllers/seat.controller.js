import Screen from "../models/ScreenModel.js";
import Showtime from "../models/ShowtimeModel.js";

// Get all seats and their booking status for a showtime
export const getSeatsForShowtime = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    // Find the showtime with booked seats info
    const showtime = await Showtime.findById(showtimeId).populate("screen");
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    const screen = showtime.screen;
    if (!screen) return res.status(404).json({ message: "Screen not found for this showtime" });

    // seatLayout from screen (array of seat labels like ["A1", "A2", ...])
    const seatLayout = Screen.seatLayout || [];

    // bookedSeats from showtime (array of booked seat labels)
    const bookedSeats = showtime.bookedSeats || [];

    // Prepare seat status list
    const seatsWithStatus = seatLayout.map((seat) => ({
      seat,
      isBooked: bookedSeats.includes(seat),
    }));

    res.status(200).json({ seats: seatsWithStatus });
  } catch (err) {
    res.status(500).json({ message: "Error fetching seats", error: err.message });
  }
};

// Optional: Check if requested seats are available for a showtime
export const checkSeatsAvailability = async (req, res) => {
  try {
    const { showtimeId } = req.params;
    const { seats } = req.body; // seats to check, e.g. ["A1", "A2"]

    if (!seats || !Array.isArray(seats)) {
      return res.status(400).json({ message: "Seats must be an array of seat labels" });
    }

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ message: "Showtime not found" });

    const bookedSeats = showtime.bookedSeats || [];

    const unavailableSeats = seats.filter((seat) => bookedSeats.includes(seat));

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        message: "Some seats are already booked",
        unavailableSeats,
      });
    }

    res.status(200).json({ message: "Seats are available" });
  } catch (err) {
    res.status(500).json({ message: "Error checking seats", error: err.message });
  }
};
