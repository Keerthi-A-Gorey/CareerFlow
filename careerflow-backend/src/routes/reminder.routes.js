import express from "express";
import auth from "../middleware/auth.middleware.js";
import Reminder from "../models/reminder.model.js";

const router = express.Router();

// Get user reminders
router.get("/", auth, async (req, res) => {
  try {
    const reminders = await Reminder.find({
      userId: req.user.id,
      status: "pending"
    }).populate("applicationId");

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reminders" });
  }
});

// Mark reminder as done
router.patch("/:id/done", auth, async (req, res) => {
  try {
    await Reminder.findByIdAndUpdate(req.params.id, {
      status: "done"
    });

    res.json({ message: "Reminder marked as done" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update reminder" });
  }
});

export default router;