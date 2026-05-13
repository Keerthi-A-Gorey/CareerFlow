import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  getFunnelAnalytics,
  getResumePerformance,
  getSourcePerformance,
  getStageTiming
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.use(protect);

router.get("/funnel", getFunnelAnalytics);
router.get("/resume-performance", getResumePerformance);
router.get("/source-performance", getSourcePerformance);
router.get("/stage-timing", getStageTiming);

export default router;
