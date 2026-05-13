import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { startReminderCron } from "./jobs/reminder.cron.js";

dotenv.config();
connectDB();
startReminderCron();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
