import express from "express";
import protect from "../middleware/auth.middleware.js";
import { uploadResume } from "../middleware/upload.middleware.js";
import {
  createResumeVersion,
  getResumeVersions,
  downloadResume,
  deleteResumeVersion
} from "../controllers/resume.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", uploadResume.single("file"), createResumeVersion);
router.get("/", getResumeVersions);
router.get("/:id/download", downloadResume);
router.delete("/:id", deleteResumeVersion);

export default router;
