// routes/screen.routes.js

import express from "express";
import {
  createScreen,
  getAllScreens,
  getScreenById,
  updateScreen,
  deleteScreen,
} from "../controllers/screen.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const screenRouter = express.Router();

screenRouter.post("/create",adminAuth, createScreen);
screenRouter.get("/get",adminAuth, getAllScreens);
screenRouter.get("/get/:screenId",adminAuth, getScreenById);
screenRouter.put("/update/:screenId",adminAuth, updateScreen);
screenRouter.delete("/delete/:screenId",adminAuth, deleteScreen);

export default screenRouter;
