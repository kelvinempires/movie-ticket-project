import Booking from "../models/BookingModel.js";
import Showtime from "../models/ShowtimeModel.js";

// CREATE a new booking
export const createBooking = async (req, res) => {
  try {
    const { user, showtime, seats, totalPrice } = req.body;

    // Check if seats are already booked
    const selectedShowtime = await Showtime.findById(showtime);
    const alreadyBooked = selectedShowtime.bookedSeats.filter((seat) =>
      seats.includes(seat)
    );
    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        message: "Some seats are already booked",
        seats: alreadyBooked,
      });
    }

    // Save booking
    const booking = new Booking({
      user,
      showtime,
      seats,
      totalPrice,
      paymentStatus: "pending",
    });
    const savedBooking = await booking.save();

    // Update booked seats on showtime
    selectedShowtime.bookedSeats.push(...seats);
    await selectedShowtime.save();

    res.status(201).json({ message: "Booking created", booking: savedBooking });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating booking", error: err.message });
  }
};

// GET all bookings (optionally by user or showtime)
export const getAllBookings = async (req, res) => {
  const { user, showtime } = req.query;
  let filter = {};
  if (user) filter.user = user;
  if (showtime) filter.showtime = showtime;

  try {
    const bookings = await Booking.find(filter)
      .populate("user showtime")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching bookings", error: err.message });
  }
};

// GET booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "user showtime"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching booking", error: err.message });
  }
};

// UPDATE booking (e.g., mark payment status as "paid")
export const updateBooking = async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking updated", booking: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating booking", error: err.message });
  }
};

// DELETE booking (optional: free up seats)
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Free up seats in showtime
    const showtime = await Showtime.findById(booking.showtime);
    showtime.bookedSeats = showtime.bookedSeats.filter(
      (seat) => !booking.seats.includes(seat)
    );
    await showtime.save();

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Booking canceled and seats released" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting booking", error: err.message });
  }
};
