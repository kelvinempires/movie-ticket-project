import Showtime from "../models/ShowtimeModel.js";
import { checkTimeConflict } from "../services/showtime.service.js";
import { validateShowtime } from "../utils/validators.js";

// CREATE a new showtime
export const createShowtime = async (req, res) => {
  try {
    const { error } = validateShowtime(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const conflict = await checkTimeConflict(
      req.body.screen,
      req.body.showDate,
      req.body.startTime,
      req.body.endTime
    );

    if (conflict) {
      return res.status(409).json({
        message: "Time conflict with existing showtime",
        conflictingShowtime: conflict,
      });
    }

    const showtime = new Showtime(req.body);
    const saved = await showtime.save();

    const populated = await Showtime.findById(saved._id)
      .populate("movie", "title posterUrl")
      .populate("theatre", "name location")
      .populate("screen", "name seatLayout");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({
      message: "Error creating showtime",
      error: err.message,
    });
  }
};

// GET available seats for a showtime (formerly getSeatsForShowtime)
export const getAvailableSeats = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate(
      "screen",
      "seatLayout"
    );

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    const allSeats = showtime.screen.seatLayout;
    const bookedSeats = showtime.bookedSeats || [];
    const availableSeats = allSeats.filter(
      (seat) => !bookedSeats.includes(seat)
    );

    res.status(200).json({
      totalSeats: allSeats.length,
      bookedSeats,
      availableSeats,
      availableCount: availableSeats.length,
      screenName: showtime.screen.name,
      movieTitle: showtime.movie.title,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching seat availability",
      error: err.message,
    });
  }
};

// Check seat availability (formerly checkSeatsAvailability)
export const checkSeatsAvailability = async (req, res) => {
  try {
    const { seats } = req.body;
    const { id } = req.params;

    if (!seats || !Array.isArray(seats)) {
      return res.status(400).json({
        message: "Seats must be provided as an array",
      });
    }

    const showtime = await Showtime.findById(id);
    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    const unavailableSeats = seats.filter((seat) =>
      showtime.bookedSeats.includes(seat)
    );

    if (unavailableSeats.length > 0) {
      return res.status(409).json({
        message: "Some seats are already booked",
        unavailableSeats,
        available: false,
      });
    }

    res.status(200).json({
      message: "Seats are available",
      available: true,
      showtimeId: id,
      requestedSeats: seats,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error checking seat availability",
      error: err.message,
    });
  }
};

// GET all showtimes (filterable)
export const getAllShowtimes = async (req, res) => {
  try {
    const { movie, theatre, date, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (movie) filter.movie = movie;
    if (theatre) filter.theatre = theatre;
    if (date) filter.showDate = new Date(date);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [showtimes, total] = await Promise.all([
      Showtime.find(filter)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("movie", "title duration posterUrl")
        .populate("theatre", "name location")
        .populate("screen", "name seatLayout")
        .sort({ showDate: 1, startTime: 1 }),

      Showtime.countDocuments(filter),
    ]);

    res.status(200).json({
      showtimes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + showtimes.length < total,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching showtimes",
      error: err.message,
    });
  }
};


// GET showtimes by movie
export const getShowtimesByMovie = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movie: req.params.movieId })
      .populate("theatre", "name location")
      .populate("screen", "name")
      .sort({ showDate: 1 });

    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching showtimes",
      error: err.message,
    });
  }
};

// GET showtimes by theatre
export const getShowtimesByTheatre = async (req, res) => {
  try {
    const showtimes = await Showtime.find({ theatre: req.params.theatreId })
      .populate("movie", "title posterUrl")
      .populate("screen", "name")
      .sort({ showDate: 1 });

    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching showtimes",
      error: err.message,
    });
  }
};
// GET showtimes by date
export const getShowtimesByDate = async (req, res) => {
  try {
    const { date } = req.params;

    // Validate date format or parse it safely
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Normalize date range to get all showtimes on that day
    const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999));

    const showtimes = await Showtime.find({
      showDate: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate("movie", "title posterUrl duration")
      .populate("theatre", "name location")
      .populate("screen", "name seatLayout")
      .sort({ startTime: 1 });

    res.status(200).json(showtimes);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching showtimes by date",
      error: err.message,
    });
  }
};
// POST check for showtime conflicts
export const checkShowtimeConflict = async (req, res) => {
  try {
    const { screen, showDate, startTime, endTime } = req.body;

    if (!screen || !showDate || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const conflict = await checkTimeConflict(screen, showDate, startTime, endTime);

    if (conflict) {
      return res.status(409).json({
        message: "Time conflict detected with existing showtime",
        conflictingShowtime: conflict,
      });
    }

    res.status(200).json({ message: "No conflict detected" });
  } catch (err) {
    res.status(500).json({
      message: "Error checking showtime conflict",
      error: err.message,
    });
  }
};

// GET single showtime
export const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate("movie", "title description duration posterUrl")
      .populate("theatre", "name location")
      .populate("screen", "name seatLayout");

    if (!showtime) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    res.status(200).json(showtime);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching showtime",
      error: err.message,
    });
  }
};

// UPDATE showtime
export const updateShowtime = async (req, res) => {
  try {
    const { error } = validateShowtime(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const updated = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("movie theatre screen");

    if (!updated) {
      return res.status(404).json({ message: "Showtime not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({
      message: "Error updating showtime",
      error: err.message,
    });
  }
};

// DELETE showtime
export const deleteShowtime = async (req, res) => {
  try {
    const deleted = await Showtime.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Showtime not found" });
    }
    res.status(200).json({ message: "Showtime deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting showtime",
      error: err.message,
    });
  }
};
