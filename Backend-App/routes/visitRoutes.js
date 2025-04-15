const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");
const auth = require("../middlewares/auth");

// Protected routes - require authentication
router.post("/", auth(["admin", "responsable"]), visitController.createVisit);

// Public routes
router.get("/stats", auth(["admin"]), visitController.getVisitStats);

// Get routes
router.get("/all", auth(["admin"]), visitController.getAllVisits);
router.get(
  "/responsable",
  auth(["responsable"]),
  visitController.getResponsableVisits
);
router.get(
  "/project/:projectId",
  auth(["admin", "responsable"]),
  visitController.getProjectVisits
);

// Single visit routes
router.get("/:id", auth(["admin", "responsable"]), visitController.getVisit);

router.put("/:id", auth(["admin", "responsable"]), visitController.updateVisit);

// Visit management routes (admin and responsable only)
router.put(
  "/:id/status",
  auth(["admin", "responsable"]),
  visitController.updateVisitStatus
);

router.delete(
  "/:id",
  auth(["admin", "responsable"]),
  visitController.deleteVisit
);

module.exports = router;
