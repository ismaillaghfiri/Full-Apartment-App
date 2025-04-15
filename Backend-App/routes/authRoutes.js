const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrentUser,
} = require("../controllers/authController");
const auth = require("../middlewares/auth");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", auth(["user", "responsable", "admin"]), getCurrentUser);

module.exports = router;
