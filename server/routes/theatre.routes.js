// routes/theatre.routes.js

import express from "express";
import {
  createTheatre,
  getAllTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
} from "../controllers/theatre.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const theatreRouter = express.Router();

theatreRouter.post("/create",adminAuth, createTheatre);
theatreRouter.get("/get", getAllTheatres);
theatreRouter.get("/get/:theatreId", getTheatreById);
theatreRouter.put("/update/:theatreId",adminAuth, updateTheatre);
theatreRouter.delete("/delete/:theatreId",adminAuth, deleteTheatre);

export default theatreRouter;
