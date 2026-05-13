import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true
    },
    message: {
      type: String,
      required: true
    },
    dueAt: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["pending", "done"],
      default: "pending"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
