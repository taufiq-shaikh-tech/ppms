// src/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import appointmentRoutes from "./routes/appointments.js";
import userRoutes from "./routes/users.js";
import messageRoutes from "./routes/messages.js";
import reportRoutes from "./routes/reports.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; // ✅ sirf env se lo

// __dirname for ES modules (points to src/)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root directory (ppms-server)
const rootDir = path.join(__dirname, "..");

// Mongo connect
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not defined");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("Mongo error", err);
    process.exit(1);
  });

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reports", reportRoutes);

// Static serve for uploaded files (reports, etc.)
app.use("/uploads", express.static(path.join(rootDir, "uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "PPMS API running" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});