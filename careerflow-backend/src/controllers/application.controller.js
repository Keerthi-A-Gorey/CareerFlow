import Application from "../models/Application.js";

export const createApplication = async (req, res) => {
  try {
    const {
      company,
      role,
      type,
      source,
      resumeVersionId,
      notes
    } = req.body;

    const application = await Application.create({
      userId: req.user.id,
      company,
      role,
      type,
      source,
      resumeVersionId,
      notes
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id })
      .sort({ appliedAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const app = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!app)
      return res.status(404).json({ message: "Application not found" });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const updated = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Application not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const deleted = await Application.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deleted)
      return res.status(404).json({ message: "Application not found" });

    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const app = await Application.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!app)
      return res.status(404).json({ message: "Application not found" });

    app.currentStatus = status;
    app.statusHistory.push({
      status,
      changedAt: new Date()
    });

    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
