import ResumeVersion from "../models/ResumeVersion.js";
import Application from "../models/Application.js";

export const createResumeVersion = async (req, res) => {
  try {
    const { label, fileUrl } = req.body;

    const resume = await ResumeVersion.create({
      userId: req.user.id,
      label,
      fileUrl
    });

    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getResumeVersions = async (req, res) => {
  try {
    const resumes = await ResumeVersion.find({ userId: req.user.id }).sort({
      createdAt: -1
    });

    res.json(resumes);
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

    res.json({ message: "Resume version deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
