const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getResponsables,
  assignProjectToResponsable,
  removeProjectFromResponsable,
  getUsersCount,
} = require("../controllers/userController");

// Admin routes
router.get("/", auth(["admin"]), getUsers);
router.post("/", auth(["admin"]), createUser);

// Specific routes before parameterized routes
router.get("/count", auth(["admin"]), getUsersCount);
router.get("/responsables", auth(["admin"]), getResponsables);

// Parameterized routes
router.get("/:id", auth(["admin"]), getUser);
router.put("/:id", auth(["admin"]), updateUser);
router.delete("/:id", auth(["admin"]), deleteUser);
router.post(
  "/:responsableId/assign-project/:projectId",
  auth(["admin"]),
  assignProjectToResponsable
);
router.delete(
  "/:responsableId/remove-project/:projectId",
  auth(["admin"]),
  removeProjectFromResponsable
);

module.exports = router;
