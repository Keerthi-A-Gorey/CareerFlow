import multer from "multer";
import path from "path";

// Store in memory buffer so file can be persisted to MongoDB Atlas
// This avoids ephemeral disk loss on Render and cloud hosts
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    allowedExtensions.includes(ext) ||
    file.mimetype.startsWith("image/") ||
    file.mimetype.includes("pdf") ||
    file.mimetype.includes("word")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Please upload PDF, Word document, or image files."));
  }
};

export const uploadResume = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit
  },
  fileFilter
});
