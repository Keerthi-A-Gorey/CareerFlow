import express from "express";
import {
  register,
  login,
  refreshAccessToken,
  logout
} from "../controllers/auth.controller.js";
import protect from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);

export default router;
