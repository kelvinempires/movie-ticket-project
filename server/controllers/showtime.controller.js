import Showtime from "../models/ShowtimeModel.js";


// CREATE a new showtime
export const createShowtime = async (req, res) => {
  try {
    const showtime = new Showtime(req.body);
    const saved = await showtime.save();
    res.status(201).json({ message: "Showtime created", showtime: saved });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating showtime", error: err.message });
  }
};

// GET all showtimes (optionally filter by movie, date, theatre, etc.)
export const getAllShowtimes = async (req, res) => {
  const { movie, theatre, showDate } = req.query;
  let filter = {};

  if (movie) filter.movie = movie;
  if (theatre) filter.theatre = theatre;
  if (showDate) filter.showDate = new Date(showDate);

  try {
    const showtimes = await Showtime.find(filter)
      .populate("movie theatre screen")
      .sort({ showDate: 1, startTime: 1 });

    res.status(200).json(showtimes);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching showtimes", error: err.message });
  }
};

// GET single showtime by ID
export const getShowtimeById = async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate(
      "movie theatre screen"
    );
    if (!showtime)
      return res.status(404).json({ message: "Showtime not found" });
    res.status(200).json(showtime);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching showtime", error: err.message });
  }
};

// UPDATE showtime by ID
export const updateShowtime = async (req, res) => {
  try {
    const updated = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ message: "Showtime not found" });
    res.status(200).json({ message: "Showtime updated", showtime: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating showtime", error: err.message });
  }
};

// DELETE showtime by ID
export const deleteShowtime = async (req, res) => {
  try {
    const deleted = await Showtime.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Showtime not found" });
    res.status(200).json({ message: "Showtime deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting showtime", error: err.message });
  }
};
