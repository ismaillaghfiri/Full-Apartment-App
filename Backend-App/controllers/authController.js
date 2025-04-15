const User = require("../models/user.js");
const { generateToken } = require("../config/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password, role, firstName, lastName, email, phone } =
      req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Username and password are required",
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
        message: "Please choose a different username",
      });
    }

    // Create new user
    const user = new User({
      username,
      password,
      role: role || "user",
      firstName,
      lastName,
      email,
      phone,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "An error occurred during registration",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        message: "Username or password is incorrect",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
        message: "Username or password is incorrect",
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    // Return response
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "An error occurred during login",
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      error: "Server Error",
      message: "An error occurred while fetching user data",
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
