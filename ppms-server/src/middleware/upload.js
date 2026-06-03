// ppms-server/src/middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads/reports";

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || "";
    let base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_");

    // fallback: agar base empty nikle to "report" use karo
    if (!base) {
      base = "report";
    }

    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${base}-${unique}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  // Agar sirf PDF + images allow karne hain, uncomment karo:
  // const allowed = ["application/pdf", "image/png", "image/jpeg"];
  // if (!allowed.includes(file.mimetype)) {
  //   return cb(new Error("Only PDF and image files are allowed"));
  // }
  cb(null, true);
}

export const uploadReport = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
}).single("file");