import express from "express";
import Appointment from "../models/Appointment.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

/**
 * Patient creates appointment
 * POST /api/appointments
 * body: { doctor, date, reason }
 * doctor: doctor _id (ObjectId as string)
 */
router.post("/", requireAuth(["patient"]), async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;

    if (!doctor || !date || !reason) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const appointment = await Appointment.create({
      patient: req.user.sub,
      doctor,
      date,
      reason,
    });

    res.status(201).json(appointment);
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Patient/Doctor – apne appointments dekhen
 * GET /api/appointments/my
 */
router.get("/my", requireAuth(["patient", "doctor"]), async (req, res) => {
  try {
    const filter =
      req.user.role === "patient"
        ? { patient: req.user.sub }
        : { doctor: req.user.sub };

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email")
      .populate("doctor", "name email")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Admin – sab appointments dekhe
 * GET /api/appointments/all
 */
router.get("/all", requireAuth(["admin"]), async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate("patient", "name email role")
      .populate("doctor", "name email role")
      .sort({ date: 1 });

    res.json(appointments);
  } catch (err) {
    console.error("Get all appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Doctor/Admin – status update kare
 * PATCH /api/appointments/:id/status
 * body: { status }
 */
router.patch(
  "/:id/status",
  requireAuth(["doctor", "admin"]),
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.json(appointment);
    } catch (err) {
      console.error("Update status error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;