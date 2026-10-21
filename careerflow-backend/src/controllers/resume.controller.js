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
    const label =
      req.body.label ||
      req.body.name ||
      (req.file ? req.file.originalname : "Untitled Resume");
    const description = req.body.description || "";

    let fileData = null;
    let fileName = "";
    let fileType = "application/pdf";
    let fileSize = 0;

    if (req.file) {
      fileData = req.file.buffer;
      fileName = req.file.originalname;
      fileType = req.file.mimetype || "application/pdf";
      fileSize = req.file.size;
    }

    const resume = new ResumeVersion({
      userId: req.user.id,
      label,
      description,
      fileData,
      fileName,
      fileType,
      fileSize
    });

    // Provide persistent streaming URL
    resume.fileUrl = `/resumes/${resume._id}/file`;
    await resume.save();

    // Don't send large buffer in JSON response
    const result = resume.toObject();
    delete result.fileData;

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getResumeVersions = async (req, res) => {
  try {
    const resumes = await ResumeVersion.find({ userId: req.user.id })
      .select("-fileData")
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
      // Ensure fileUrl is standardized to the streaming route if a file exists
      fileUrl: (r.fileName || r.fileUrl) ? `/resumes/${r._id}/file` : "",
      applicationsCount: countMap[r._id.toString()] || 0
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stream file for in-browser preview (iframe / new tab)
export const viewResumeFile = async (req, res) => {
  try {
    const resume = await ResumeVersion.findById(req.params.id).select("+fileData");

    if (!resume) {
      return res.status(404).send("Resume not found");
    }

    // Set CORS & Cross-Origin-Resource-Policy so iframes from Vercel can display it
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    // 1. Check MongoDB Atlas buffer (primary persistent storage)
    if (resume.fileData && resume.fileData.length > 0) {
      const type = resume.fileType || "application/pdf";
      const cleanName = resume.fileName || `${resume.label}.pdf`;

      res.setHeader("Content-Type", type);
      res.setHeader("Content-Length", resume.fileData.length);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${encodeURIComponent(cleanName)}"`
      );
      return res.send(resume.fileData);
    }

    // 2. Fallback to local disk if an older file was saved on disk
    if (resume.fileUrl && resume.fileUrl.startsWith("/uploads/")) {
      const cleanPath = resume.fileUrl.replace(/^\//, "");
      const filePath = path.join(__dirname, "../../", cleanPath);
      if (fs.existsSync(filePath)) {
        res.setHeader("Content-Type", resume.fileType || "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename="${encodeURIComponent(resume.fileName || resume.label + '.pdf')}"`
        );
        return fs.createReadStream(filePath).pipe(res);
      }
    }

    return res
      .status(404)
      .send("File not found on server. If this resume was created before cloud deployment, please re-upload your resume document.");
  } catch (err) {
    res.status(500).send("Error streaming resume: " + err.message);
  }
};

// Stream file for download
export const downloadResume = async (req, res) => {
  try {
    const resume = await ResumeVersion.findById(req.params.id).select("+fileData");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const downloadName = resume.fileName || `${resume.label}.pdf`;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    // 1. Check MongoDB buffer
    if (resume.fileData && resume.fileData.length > 0) {
      res.setHeader("Content-Type", resume.fileType || "application/octet-stream");
      res.setHeader("Content-Length", resume.fileData.length);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(downloadName)}"`
      );
      return res.send(resume.fileData);
    }

    // 2. Fallback to local disk
    if (resume.fileUrl && resume.fileUrl.startsWith("/uploads/")) {
      const cleanPath = resume.fileUrl.replace(/^\//, "");
      const filePath = path.join(__dirname, "../../", cleanPath);
      if (fs.existsSync(filePath)) {
        return res.download(filePath, downloadName);
      }
    }

    return res.status(404).json({
      message:
        "File not found on server. Please re-upload your resume document to store it permanently."
    });
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

    // Clean up local disk file if any
    if (deleted.fileUrl && deleted.fileUrl.startsWith("/uploads/")) {
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
