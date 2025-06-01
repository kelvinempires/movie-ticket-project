import Cinema from "../models/CinemaModel.js";

// Create a new cinema
export const createCinema = async (req, res) => {
  try {
    const cinema = await Cinema.create(req.body);
    res.status(201).json(cinema);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create cinema", error: error.message });
  }
};

// Get all cinemas
export const getAllCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find().populate("theatres");
    res.status(200).json(cinemas);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cinemas", error: error.message });
  }
};

// Get single cinema by ID
export const getCinemaById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id).populate("theatres");
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });
    res.status(200).json(cinema);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch cinema", error: error.message });
  }
};

// Update cinema
export const updateCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });
    res.status(200).json(cinema);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update cinema", error: error.message });
  }
};

// Delete cinema
export const deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndDelete(req.params.id);
    if (!cinema) return res.status(404).json({ message: "Cinema not found" });
    res.status(200).json({ message: "Cinema deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete cinema", error: error.message });
  }
};
