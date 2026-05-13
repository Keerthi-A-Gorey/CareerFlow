import mongoose from "mongoose";

const resumeVersionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    label: {
      type: String,
      required: true,
      trim: true
    },

    fileUrl: {
      type: String // later when we add S3 uploads
    }
  },
  { timestamps: true }
);

const ResumeVersion = mongoose.model("ResumeVersion", resumeVersionSchema);
export default ResumeVersion;
