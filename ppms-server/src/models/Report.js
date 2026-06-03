// ppms-server/src/models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    // Patient jiske portal par ye report dikhni chahiye
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Kisne upload kiya (doctor ya patient)
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Original filename (user ki machine ka naam)
    fileName: {
      type: String,
      required: true,
    },

    // Server par stored file ka relative path, e.g. "uploads/reports/report-123.png"
    filePath: {
      type: String,
      required: true,
    },

    // MIME type, e.g. "application/pdf", "image/jpeg"
    fileType: {
      type: String,
      default: "",
    },

    // UI ke liye title (e.g. "CBC Report", "X-ray Chest")
    title: {
      type: String,
      default: "",
    },

    // Additional notes / description
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;