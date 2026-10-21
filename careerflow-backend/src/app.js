import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import reminderRoutes from "./routes/reminder.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: ["http://localhost:8080", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("CareerFlow API running 🚀");
});
app.use("/applications", applicationRoutes);

app.use("/resumes", resumeRoutes);

app.use("/analytics", analyticsRoutes);

app.use("/reminders", reminderRoutes);

export default app;
