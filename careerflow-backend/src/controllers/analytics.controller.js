import Application from "../models/Application.js";
import mongoose from "mongoose";

export const getFunnelAnalytics = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$currentStatus",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getResumePerformance = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Application.aggregate([
      { $match: { userId, resumeVersionId: { $ne: null } } },
      {
        $group: {
          _id: "$resumeVersionId",
          total: { $sum: 1 },
          interviews: {
            $sum: {
              $cond: [{ $eq: ["$currentStatus", "Interview"] }, 1, 0]
            }
          },
          offers: {
            $sum: {
              $cond: [{ $eq: ["$currentStatus", "Offer"] }, 1, 0]
            }
          }
        }
      },
      {
        $lookup: {
          from: "resumeversions",
          localField: "_id",
          foreignField: "_id",
          as: "resume"
        }
      },
      { $unwind: "$resume" },
      {
        $project: {
          resumeLabel: "$resume.label",
          total: 1,
          interviews: 1,
          offers: 1
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getSourcePerformance = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$source",
          total: { $sum: 1 },
          interviews: {
            $sum: {
              $cond: [{ $eq: ["$currentStatus", "Interview"] }, 1, 0]
            }
          },
          offers: {
            $sum: {
              $cond: [{ $eq: ["$currentStatus", "Offer"] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStageTiming = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const data = await Application.aggregate([
      { $match: { userId } },
      { $unwind: "$statusHistory" },
      {
        $group: {
          _id: {
            appId: "$_id",
            status: "$statusHistory.status"
          },
          changedAt: { $first: "$statusHistory.changedAt" }
        }
      },
      {
        $group: {
          _id: "$_id.appId",
          stages: {
            $push: {
              status: "$_id.status",
              changedAt: "$changedAt"
            }
          }
        }
      }
    ]);

    // compute diffs in JS (simpler + readable)
    const stageDiffs = [];

    data.forEach((app) => {
      const map = {};
      app.stages.forEach((s) => (map[s.status] = new Date(s.changedAt)));

      if (map.Applied && map.OA)
        stageDiffs.push((map.OA - map.Applied) / (1000 * 60 * 60 * 24));
      if (map.OA && map.Interview)
        stageDiffs.push((map.Interview - map.OA) / (1000 * 60 * 60 * 24));
      if (map.Interview && map.Offer)
        stageDiffs.push((map.Offer - map.Interview) / (1000 * 60 * 60 * 24));
    });

    const avg =
      stageDiffs.reduce((a, b) => a + b, 0) / (stageDiffs.length || 1);

    res.json({ avgDaysBetweenStages: avg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
