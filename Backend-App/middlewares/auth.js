const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("express-async-handler");

const auth = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from header
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          error: "No token provided",
          message: "Please authenticate",
        });
      }

      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({
          success: false,
          error: "Invalid token format",
          message: "Please authenticate",
        });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: "Invalid token",
          message: "Please authenticate",
        });
      }

      // Get user from database
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Authentication Failed",
          message: "User not found",
        });
      }

      // Check if user role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          error: "Not Authorized",
          message: "You do not have permission to perform this action",
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(500).json({
        success: false,
        error: "Server Error",
        message: "An error occurred during authentication",
      });
    }
  };
};

module.exports = auth;
