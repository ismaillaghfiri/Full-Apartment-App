const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const auth = require("../middlewares/auth");

// Public routes
router.get("/", projectController.getAllProjects);

// Count route before parameterized routes
router.get("/count", projectController.getProjectsCount);

// Get projects for a specific responsable
router.get(
  "/responsable",
  auth(["responsable"]),
  projectController.getResponsableProjects
);

// Parameterized routes
router.get("/:id", projectController.getProjectById);
router.post("/", auth(["admin"]), projectController.createProject);
router.put(
  "/:id",
  auth(["admin", "responsable"]),
  projectController.updateProject
);
router.delete("/:id", auth(["admin"]), projectController.deleteProject);
router.post(
  "/:id/delete-image",
  auth(["admin"]),
  projectController.deleteProjectImage
);

module.exports = router;
