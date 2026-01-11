import mongoose from "mongoose";

const statusEnum = [
  "Applied",
  "OA",
  "Interview",
  "Offer",
  "Rejected",
  "Withdrawn"
];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: statusEnum },
    changedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },

    type: {
      type: String,
      enum: ["Intern", "Full-time"],
      required: true
    },

    source: {
      type: String,
      enum: ["LinkedIn", "Referral", "Career Page", "Other"],
      default: "Other"
    },

    resumeVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ResumeVersion",
      required: false
    },

    currentStatus: {
      type: String,
      enum: statusEnum,
      default: "Applied"
    },

    statusHistory: [statusHistorySchema],

    appliedAt: { type: Date, default: Date.now },
    lastUpdatedAt: { type: Date, default: Date.now },

    notes: { type: String }
  },
  { timestamps: true }
);

applicationSchema.pre("save", function () {
  this.lastUpdatedAt = new Date();

  if (this.isNew) {
    this.statusHistory.push({
      status: this.currentStatus,
      changedAt: new Date()
    });
  }
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
