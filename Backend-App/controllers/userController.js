const User = require("../models/user");
const Project = require("../models/Project");
const asyncHandler = require("../middlewares/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json(user);
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
    );
  }

  // Check if user is assigned to any projects
  const projects = await Project.find({ responsable: req.params.id });
  if (projects.length > 0) {
    return next(
      new ErrorResponse("Cannot delete user who is assigned to projects", 400)
    );
  }

  await user.remove();
  res.status(200).json({ success: true, data: {} });
});

// @desc    Get all responsables
// @route   GET /api/users/responsables
// @access  Private/Admin
exports.getResponsables = asyncHandler(async (req, res) => {
  try {
    // Get all users with role 'responsable'
    const responsables = await User.find({ role: "responsable" })
      .select("-password")
      .lean();

    // Get working status and projects for each responsable
    const responsablesWithDetails = await Promise.all(
      responsables.map(async (responsable) => {
        // Find all projects assigned to this responsable
        const projects = await Project.find({
          responsable: responsable._id,
        })
          .select("name city etat")
          .lean();

        // Check if any project is active
        const hasActiveProject = projects.some((project) =>
          ["En Construction", "Pret et Ouvert"].includes(project.etat)
        );

        return {
          ...responsable,
          workingStatus: hasActiveProject ? "Working" : "Not yet",
          assignedProjects: projects,
        };
      })
    );

    console.log(
      "Responsables with details:",
      JSON.stringify(responsablesWithDetails, null, 2)
    );
    res.json(responsablesWithDetails);
  } catch (error) {
    console.error("Error in getResponsables:", error);
    res.status(500).json({
      message: error.message,
      details: error.stack,
    });
  }
});

// @desc    Assign project to responsable
// @route   POST /api/users/:responsableId/assign-project/:projectId
// @access  Private/Admin
exports.assignProjectToResponsable = asyncHandler(async (req, res, next) => {
  const { responsableId, projectId } = req.params;

  const responsable = await User.findById(responsableId);
  if (!responsable || responsable.role !== "responsable") {
    return next(new ErrorResponse("Invalid responsable", 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorResponse("Project not found", 404));
  }

  // Update project's responsable
  project.responsable = responsableId;
  await project.save();

  // Add project to responsable's assignedProjects if not already there
  if (!responsable.assignedProjects.includes(projectId)) {
    responsable.assignedProjects.push(projectId);
    await responsable.save();
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc    Remove project from responsable
// @route   DELETE /api/users/:responsableId/remove-project/:projectId
// @access  Private/Admin
exports.removeProjectFromResponsable = asyncHandler(async (req, res, next) => {
  const { responsableId, projectId } = req.params;

  const responsable = await User.findById(responsableId);
  if (!responsable || responsable.role !== "responsable") {
    return next(new ErrorResponse("Invalid responsable", 400));
  }

  const project = await Project.findById(projectId);
  if (!project) {
    return next(new ErrorResponse("Project not found", 404));
  }

  // Remove project from responsable's assignedProjects
  responsable.assignedProjects = responsable.assignedProjects.filter(
    (id) => id.toString() !== projectId
  );
  await responsable.save();

  // Remove responsable from project
  project.responsable = undefined;
  await project.save();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Get users count
// @route   GET /api/users/count
// @access  Private/Admin
exports.getUsersCount = asyncHandler(async (req, res, next) => {
  const count = await User.countDocuments();
  res.status(200).json({ count });
});

// Keep existing user methods
exports.getUserProfile = async (req, res) => {
  /* ... existing code ... */
};

exports.addFavorite = async (req, res) => {
  /* ... existing code ... */
};

exports.removeFavorite = async (req, res) => {
  /* ... existing code ... */
};
