import express from "express";
import protect from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import {
  createResumeVersion,
  getResumeVersions,
  viewResumeFile,
  downloadResume,
  deleteResumeVersion
} from "../controllers/resume.controller.js";

const router = express.Router();

// Public file stream endpoints (so iframes and window.open can load files without Bearer headers)
router.get("/:id/file", viewResumeFile);
router.get("/:id/download", downloadResume);

// Protected endpoints for user resume management
router.use(protect);

router.post("/", uploadResume.single("file"), createResumeVersion);
router.get("/", getResumeVersions);
router.delete("/:id", deleteResumeVersion);

export default router;
