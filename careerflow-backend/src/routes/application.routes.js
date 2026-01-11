import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  updateStatus
} from "../controllers/application.controller.js";

const router = express.Router();

router.use(protect); // all routes below are protected

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

router.patch("/:id/status", updateStatus);

export default router;
