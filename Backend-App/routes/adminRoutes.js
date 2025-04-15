const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const User = require("../models/User");
const Project = require("../models/Project");
const Visit = require("../models/Visit");

// Apply auth and adminAuth middleware to all routes
router.use(auth);
router.use(adminAuth);

// Get all users (excluding passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects with populated owner
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate({
      path: "owner",
      select: "-password",
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all visits with populated user and project
router.get("/visits", async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate({
        path: "user",
        select: "-password",
      })
      .populate("project");
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user role
router.patch("/users/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user and all associated data
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all projects owned by the user
    await Project.deleteMany({ owner: user._id });

    // Delete all visits by the user
    await Visit.deleteMany({ user: user._id });

    // Delete the user
    await user.remove();

    res.json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    const [
      userCount,
      projectCount,
      visitCount,
      recentUsers,
      recentProjects,
      recentVisits,
    ] = await Promise.all([
      User.countDocuments(),
      Project.countDocuments(),
      Visit.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
      Project.find().sort({ createdAt: -1 }).limit(5).populate({
        path: "owner",
        select: "-password",
      }),
      Visit.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: "user",
          select: "-password",
        })
        .populate("project"),
    ]);

    res.json({
      counts: {
        users: userCount,
        projects: projectCount,
        visits: visitCount,
      },
      recent: {
        users: recentUsers,
        projects: recentProjects,
        visits: recentVisits,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
