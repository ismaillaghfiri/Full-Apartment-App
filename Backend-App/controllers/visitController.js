const Visit = require("../models/Visit");
const Project = require("../models/Project");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// Get all visits
exports.getAllVisits = asyncHandler(async (req, res) => {
  const visits = await Visit.find()
    .populate("project", "name city type responsable")
    .sort({ date: 1 });
  res.json(visits);
});

// Get visits for a responsable's projects
exports.getResponsableVisits = asyncHandler(async (req, res) => {
  const projects = await Project.find({ responsable: req.user._id });
  const projectIds = projects.map((p) => p._id);

  const visits = await Visit.find({ project: { $in: projectIds } })
    .populate("project", "name city type responsable")
    .sort({ date: 1 });

  res.json(visits);
});

// Get visits for a specific project
exports.getProjectVisits = asyncHandler(async (req, res) => {
  const visits = await Visit.find({ project: req.params.projectId })
    .populate("project", "name city type responsable")
    .sort({ date: 1 });
  res.json(visits);
});

// Get single visit
exports.getVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.findById(req.params.id).populate(
    "project",
    "name city type responsable"
  );

  if (!visit) {
    throw new ErrorResponse("Visit not found", 404);
  }

  // Check if user is admin or the responsable of the project
  if (
    req.user.role === "responsable" &&
    !visit.project.responsable.equals(req.user._id)
  ) {
    throw new ErrorResponse("Not authorized to access this visit", 403);
  }

  res.json(visit);
});

// Create a new visit
exports.createVisit = asyncHandler(async (req, res) => {
  try {
    console.log("Creating visit with data:", req.body);
    console.log("User:", req.user);

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "date",
      "project",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      throw new ErrorResponse(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // Find the project
    const project = await Project.findById(req.body.project);
    if (!project) {
      throw new ErrorResponse("Project not found", 404);
    }

    // Check authorization only if req.user exists
    if (req.user && req.user.role === "responsable") {
      if (!project.responsable || !project.responsable.equals(req.user._id)) {
        throw new ErrorResponse(
          "Not authorized to create visits for this project",
          403
        );
      }
    }

    // Create the visit
    const visit = new Visit({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      date: req.body.date,
      project: req.body.project,
      status: "Pending",
    });

    await visit.save();

    // Return populated visit
    const populatedVisit = await Visit.findById(visit._id).populate(
      "project",
      "name city type responsable"
    );

    console.log("Visit created successfully:", populatedVisit);
    res.status(201).json(populatedVisit);
  } catch (error) {
    console.error("Error creating visit:", error);
    throw error;
  }
});

// Update visit
exports.updateVisit = asyncHandler(async (req, res) => {
  let visit = await Visit.findById(req.params.id).populate(
    "project",
    "name city type responsable"
  );

  if (!visit) {
    throw new ErrorResponse("Visit not found", 404);
  }

  // Check if user is admin or the responsable of the project
  if (
    req.user.role === "responsable" &&
    !visit.project.responsable.equals(req.user._id)
  ) {
    throw new ErrorResponse("Not authorized to update this visit", 403);
  }

  visit = await Visit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate("project", "name city type responsable");

  res.json(visit);
});

// Update visit status
exports.updateVisitStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
    throw new ErrorResponse("Invalid status value", 400);
  }

  let visit = await Visit.findById(req.params.id).populate(
    "project",
    "name city type responsable"
  );

  if (!visit) {
    throw new ErrorResponse("Visit not found", 404);
  }

  // Check if user is admin or the responsable of the project
  if (
    req.user.role === "responsable" &&
    !visit.project.responsable.equals(req.user._id)
  ) {
    throw new ErrorResponse(
      "Not authorized to update this visit's status",
      403
    );
  }

  visit = await Visit.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate("project", "name city type responsable");

  res.json(visit);
});

// Delete visit
exports.deleteVisit = asyncHandler(async (req, res) => {
  const visit = await Visit.findById(req.params.id).populate(
    "project",
    "name city type responsable"
  );

  if (!visit) {
    throw new ErrorResponse("Visit not found", 404);
  }

  // Check if user is admin or the responsable of the project
  if (
    req.user.role === "responsable" &&
    !visit.project.responsable.equals(req.user._id)
  ) {
    throw new ErrorResponse("Not authorized to delete this visit", 403);
  }

  await Visit.findByIdAndDelete(req.params.id);
  res.json({ message: "Visit deleted successfully" });
});

// Get visit statistics
exports.getVisitStats = asyncHandler(async (req, res) => {
  const stats = await Visit.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedStats = stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});

  res.json(formattedStats);
});
