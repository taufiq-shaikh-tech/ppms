// ppms-server/src/routes/reports.js
import express from "express";
import path from "path";
import Report from "../models/Report.js";
import { requireAuth } from "../middleware/auth.js";
import { uploadReport } from "../middleware/upload.js";

const router = express.Router();

/**
 * Upload a report (doctor ya patient)
 * POST /api/reports/upload
 * form-data:
 *   - file: (binary)
 *   - owner: patientId (jis patient ka portal hai)
 *   - title (optional)
 *   - notes (optional)
 */
router.post(
  "/upload",
  requireAuth(), // koi bhi logged-in user
  (req, res) => {
    uploadReport(req, res, async (err) => {
      if (err) {
        console.error("Upload error:", err);
        return res.status(400).json({ message: err.message || "Upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file provided" });
      }

      const { owner, title, notes } = req.body;

      if (!owner) {
        return res.status(400).json({ message: "owner (patientId) is required" });
      }

      try {
        const report = await Report.create({
          owner, // patient
          uploadedBy: req.user.sub, // doctor ya patient
          fileName: req.file.originalname,
          filePath: req.file.path,
          fileType: req.file.mimetype,
          title: title || "",
          notes: notes || "",
        });

        res.status(201).json(report);
      } catch (e) {
        console.error("Save report error:", e);
        return res.status(500).json({ message: "Server error" });
      }
    });
  }
);

/**
 * Get all reports for one patient
 * GET /api/reports/user/:patientId
 * - doctor ya wohi patient dono dekh sakte hain
 */
router.get("/user/:patientId", requireAuth(), async (req, res) => {
  try {
    const { patientId } = req.params;
    const requesterId = req.user.sub;
    const requesterRole = req.user.role;

    // Optional security check: patient khud ya doctor hi dekh sake
    if (
      requesterRole === "patient" &&
      requesterId.toString() !== patientId.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const reports = await Report.find({ owner: patientId })
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name role");

    res.json(reports);
  } catch (e) {
    console.error("Get reports error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Delete a report (optional – future ke liye)
 * DELETE /api/reports/:id
 * - sirf doctor ya same patient ko allowed kar sakte ho
 */
router.delete("/:id", requireAuth(), async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const requesterId = req.user.sub;
    const requesterRole = req.user.role;

    // Example rule: jisne upload kiya ya same patient hi delete kar sakta hai
    if (
      requesterRole !== "admin" &&
      requesterId.toString() !== report.uploadedBy.toString() &&
      requesterId.toString() !== report.owner.toString()
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await report.deleteOne();

    res.json({ message: "Report deleted" });
  } catch (e) {
    console.error("Delete report error:", e);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;