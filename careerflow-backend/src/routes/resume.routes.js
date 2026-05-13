import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createResumeVersion,
  getResumeVersions,
  deleteResumeVersion
} from "../controllers/resume.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", createResumeVersion);
router.get("/", getResumeVersions);
router.delete("/:id", deleteResumeVersion);

export default router;
