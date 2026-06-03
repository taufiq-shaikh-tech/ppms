// src/routes/users.js
import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * Get all doctors – for patient dropdown
 * GET /api/users/doctors
 */
router.get(
  "/doctors",
  requireAuth(["patient", "doctor", "admin"]),
  async (req, res) => {
    try {
      const doctors = await User.find({ role: "doctor" }).select(
        "name email _id"
      );
      res.json(doctors);
    } catch (err) {
      console.error("Get doctors error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;