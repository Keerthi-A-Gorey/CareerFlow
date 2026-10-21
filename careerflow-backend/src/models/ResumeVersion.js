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

    description: {
      type: String,
      trim: true,
      default: ""
    },

    fileData: {
      type: Buffer,
      select: false // excluded from standard queries for performance
    },

    fileUrl: {
      type: String,
      default: ""
    },

    fileName: {
      type: String,
      default: ""
    },

    fileType: {
      type: String,
      default: "application/pdf"
    },

    fileSize: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const ResumeVersion = mongoose.model("ResumeVersion", resumeVersionSchema);
export default ResumeVersion;
