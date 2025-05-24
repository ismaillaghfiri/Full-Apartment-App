const express = require("express");
const router = express.Router();
const visitController = require("../controllers/visitController");
const auth = require("../middlewares/auth");

// Public route for creating a visit
router.post("/", visitController.createVisit);

// Protected routes
router.get("/stats", auth(["admin"]), visitController.getVisitStats);
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
router.get("/:id", auth(["admin", "responsable"]), visitController.getVisit);
router.put("/:id", auth(["admin", "responsable"]), visitController.updateVisit);
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
