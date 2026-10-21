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

// Trust proxy for secure cookies behind reverse proxies (Render, Cloudflare, etc.)
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.includes("localhost")
    ) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
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

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/applications", applicationRoutes);

app.use("/resumes", resumeRoutes);

app.use("/analytics", analyticsRoutes);

app.use("/reminders", reminderRoutes);

export default app;
