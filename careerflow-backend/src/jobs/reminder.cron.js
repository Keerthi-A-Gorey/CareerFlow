import cron from "node-cron";
import Application from "../models/Application.js";
import Reminder from "../models/reminder.model.js";

export const startReminderCron = () => {
  // Runs every 6 hours
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏰ Running reminder cron job...");

    const now = new Date();

    try {
      const apps = await Application.find({
        currentStatus: { $in: ["Applied", "Interview"] }
      });

      for (const app of apps) {
        const appliedDate = new Date(app.appliedAt);
        const daysPassed = Math.floor(
          (now - appliedDate) / (1000 * 60 * 60 * 24)
        );

        let shouldRemind = false;
        let message = "";

        if (app.currentStatus === "Applied" && daysPassed >= 7) {
          shouldRemind = true;
          message = `Follow up on your application to ${app.company} for ${app.role}`;
        }

        if (app.currentStatus === "Interview" && daysPassed >= 5) {
          shouldRemind = true;
          message = `Check back after interview with ${app.company} for ${app.role}`;
        }

        if (!shouldRemind) continue;

        const existing = await Reminder.findOne({
          applicationId: app._id,
          status: "pending"
        });

        if (!existing) {
          await Reminder.create({
            userId: app.userId,
            applicationId: app._id,
            message,
            dueAt: now
          });

          console.log("🔔 Reminder created for:", app.company);
        }
      }
    } catch (err) {
      console.error("Reminder cron failed:", err);
    }
  });
};
