import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import ResumeVersion from "../models/ResumeVersion.js";
import Application from "../models/Application.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createResumeVersion = async (req, res) => {
  try {
    const label = req.body.label || req.body.name || (req.file ? req.file.originalname : "Untitled Resume");
    const description = req.body.description || "";

    let fileUrl = "";
    let fileName = "";
    let fileType = "";
    let fileSize = 0;

    if (req.file) {
      fileUrl = `/uploads/resumes/${req.file.filename}`;
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
      fileSize = req.file.size;
    } else if (req.body.fileUrl) {
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || "";
    }

    const resume = await ResumeVersion.create({
      userId: req.user.id,
      label,
      description,
      fileUrl,
      fileName,
      fileType,
      fileSize
    });

    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getResumeVersions = async (req, res) => {
  try {
    const resumes = await ResumeVersion.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const counts = await Application.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          resumeVersionId: { $ne: null }
        }
      },
      {
        $group: {
          _id: "$resumeVersionId",
          count: { $sum: 1 }
        }
      }
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const enriched = resumes.map((r) => ({
      ...r,
      applicationsCount: countMap[r._id.toString()] || 0
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const downloadResume = async (req, res) => {
  try {
    const resume = await ResumeVersion.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!resume || !resume.fileUrl) {
      return res.status(404).json({ message: "Resume file not found" });
    }

    const cleanPath = resume.fileUrl.replace(/^\//, "");
    const filePath = path.join(__dirname, "../../", cleanPath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }

    const downloadName = resume.fileName || `${resume.label}.pdf`;
    res.download(filePath, downloadName);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteResumeVersion = async (req, res) => {
  try {
    const used = await Application.findOne({
      userId: req.user.id,
      resumeVersionId: req.params.id
    });

    if (used) {
      return res
        .status(400)
        .json({ message: "Resume version is linked to applications" });
    }

    const deleted = await ResumeVersion.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ message: "Resume version not found" });

    if (deleted.fileUrl) {
      try {
        const cleanPath = deleted.fileUrl.replace(/^\//, "");
        const filePath = path.join(__dirname, "../../", cleanPath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (fileErr) {
        console.warn("Failed to delete local file:", fileErr.message);
      }
    }

    res.json({ message: "Resume version deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
