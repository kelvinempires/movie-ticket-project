import Theatre from "../models/TheatreModel.js";

// CREATE a new theatre
export const createTheatre = async (req, res) => {
  try {
    const { name, location } = req.body;

    const theatre = new Theatre({ name, location });
    const savedTheatre = await theatre.save();

    res.status(201).json({ message: "Theatre created", theatre: savedTheatre });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating theatre", error: err.message });
  }
};

// GET all theatres
export const getAllTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find().populate("screens");
    res.status(200).json(theatres);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching theatres", error: err.message });
  }
};

// GET theatre by ID
export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id).populate("screens");
    if (!theatre) return res.status(404).json({ message: "Theatre not found" });
    res.status(200).json(theatre);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching theatre", error: err.message });
  }
};

// UPDATE a theatre
export const updateTheatre = async (req, res) => {
  try {
    const updated = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Theatre not found" });
    res.status(200).json({ message: "Theatre updated", theatre: updated });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating theatre", error: err.message });
  }
};

// DELETE a theatre
export const deleteTheatre = async (req, res) => {
  try {
    const deleted = await Theatre.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Theatre not found" });
    res.status(200).json({ message: "Theatre deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting theatre", error: err.message });
  }
};
