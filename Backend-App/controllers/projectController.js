const Project = require("../models/Project");
const User = require("../models/user");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: "dh0zexskw",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to check if responsable has active projects
const checkResponsableAvailability = async (
  responsableId,
  excludeProjectId = null
) => {
  const query = {
    responsable: responsableId,
    etat: { $in: ["En Construction", "Pret et Ouvert"] },
  };

  // If we're updating a project, exclude the current project from the check
  if (excludeProjectId) {
    query._id = { $ne: excludeProjectId };
  }

  const existingProject = await Project.findOne(query);
  return !existingProject;
};

// Get all projects
exports.getAllProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate("responsable", "firstName lastName email phone")
    .sort({ createdAt: -1 });
  res.json(projects);
});

// Get projects for a specific responsable
exports.getResponsableProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({ responsable: req.user._id })
    .populate("responsable", "firstName lastName email phone")
    .sort({ createdAt: -1 });
  res.json(projects);
});

// Get a single project
exports.getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "responsable",
    "firstName lastName email phone"
  );
  if (!project) {
    throw new ErrorResponse("Project not found", 404);
  }
  res.json(project);
});

// Create a new project
exports.createProject = asyncHandler(async (req, res) => {
  try {
    // Check if responsable is available
    const isResponsableAvailable = await checkResponsableAvailability(
      req.body.responsable
    );
    if (!isResponsableAvailable) {
      return res.status(400).json({
        message:
          "Le responsable sélectionné est déjà assigné à un projet actif",
      });
    }

    // Validate image data
    if (
      req.body.coverImage &&
      (!req.body.coverImage.url || !req.body.coverImage.publicId)
    ) {
      return res.status(400).json({
        message: "Invalid cover image data",
      });
    }

    if (req.body.gallery) {
      for (const image of req.body.gallery) {
        if (!image.url || !image.publicId) {
          return res.status(400).json({
            message: "Invalid gallery image data",
          });
        }
      }
    }

    // Create project with the processed data
    const project = new Project({
      name: req.body.name,
      description: req.body.description,
      city: req.body.city,
      type: req.body.type,
      price: req.body.price,
      numberOfApartments: req.body.numberOfApartments,
      etat: req.body.etat,
      features: req.body.features,
      responsable: req.body.responsable,
      coverImage: req.body.coverImage || null,
      gallery: req.body.gallery || [],
    });

    await project.save();

    // Populate the responsable field before sending response
    const populatedProject = await Project.findById(project._id).populate(
      "responsable",
      "firstName lastName email phone"
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(400).json({
      message: error.message,
      details: error.errors || error,
    });
  }
});

// Update a project
exports.updateProject = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    console.log(
      "Update Project Request Body:",
      JSON.stringify(req.body, null, 2)
    );

    // First check if project exists and get current state
    const existingProject = await Project.findById(id);
    if (!existingProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check authorization for responsable
    if (
      req.user.role === "responsable" &&
      !existingProject.responsable.equals(req.user._id)
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this project" });
    }

    let updateData = {};
    // Only include fields that are actually present in the request body
    const allowedFields = [
      "name",
      "description",
      "city",
      "type",
      "price",
      "numberOfApartments",
      "etat",
      "features",
      "gallery",
      "coverImage",
      "responsable",
    ];

    // Validate and process each field
    Object.keys(req.body).forEach((field) => {
      if (allowedFields.includes(field)) {
        // Special handling for price and numberOfApartments
        if (field === "price" || field === "numberOfApartments") {
          const value = Number(req.body[field]);
          if (!isNaN(value)) {
            updateData[field] = value;
          }
        }
        // Special handling for features object
        else if (
          field === "features" &&
          typeof req.body.features === "object"
        ) {
          updateData.features = req.body.features;
        }
        // Special handling for gallery array
        else if (field === "gallery" && Array.isArray(req.body.gallery)) {
          updateData.gallery = req.body.gallery;
        }
        // All other fields
        else {
          updateData[field] = req.body[field];
        }
      }
    });

    console.log("Processed Update Data:", JSON.stringify(updateData, null, 2));

    // If responsable is being updated and project status is active (admin only)
    if (req.user.role === "admin" && updateData.responsable) {
      const isResponsableAvailable = await checkResponsableAvailability(
        updateData.responsable,
        id
      );
      if (!isResponsableAvailable) {
        return res.status(400).json({
          message:
            "Le responsable sélectionné est déjà assigné à un projet actif",
        });
      }
    }

    // If user is responsable, restrict fields
    if (req.user.role === "responsable") {
      const restrictedFields = ["description", "features", "gallery", "price"];
      Object.keys(updateData).forEach((key) => {
        if (!restrictedFields.includes(key)) {
          delete updateData[key];
        }
      });
    }

    // Handle cover image update if present
    if (updateData.coverImage) {
      try {
        console.log("Processing cover image:", typeof updateData.coverImage);

        // If coverImage is an object with url and publicId, it's already processed
        if (
          typeof updateData.coverImage === "object" &&
          updateData.coverImage.url &&
          updateData.coverImage.publicId
        ) {
          console.log("Cover image is already in correct format");
          // Keep the existing format
        } else if (
          typeof updateData.coverImage === "string" &&
          updateData.coverImage.includes("data:image")
        ) {
          console.log("Processing new cover image upload");
          // Delete old image if exists
          if (existingProject.coverImage?.publicId) {
            await cloudinary.uploader.destroy(
              existingProject.coverImage.publicId
            );
          }

          // Upload new image
          const result = await cloudinary.uploader.upload(
            updateData.coverImage,
            {
              folder: "projects/cover",
              resource_type: "image",
            }
          );
          updateData.coverImage = {
            url: result.secure_url,
            publicId: result.public_id,
          };
          console.log("Successfully uploaded new cover image");
        } else {
          // If it's neither an object nor a base64 string, remove it from update
          console.log("Invalid cover image format, removing from update");
          delete updateData.coverImage;
        }
      } catch (cloudinaryError) {
        console.error("Cloudinary Error Details:", {
          error: cloudinaryError.message,
          code: cloudinaryError.http_code,
          details: cloudinaryError.details,
        });
        return res.status(400).json({
          message: "Error processing cover image",
          details: cloudinaryError.message,
        });
      }
    }

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    ).populate("responsable", "firstName lastName email phone");

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Successfully Updated Project:", updatedProject._id);
    res.json(updatedProject);
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(400).json({
      message: error.message,
      details: error.errors || error,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Delete image from project
exports.deleteProjectImage = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { publicId, isGallery } = req.body;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });

    // Update project in database
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (isGallery) {
      project.gallery = project.gallery.filter(
        (img) => img.publicId !== publicId
      );
    } else {
      project.coverImage = null;
    }

    await project.save();
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image" });
  }
});

// Delete project with all its images
exports.deleteProject = asyncHandler(async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete all images from Cloudinary
    if (project.coverImage?.publicId) {
      await cloudinary.uploader.destroy(project.coverImage.publicId, {
        resource_type: "image",
      });
    }

    for (const image of project.gallery) {
      if (image.publicId) {
        await cloudinary.uploader.destroy(image.publicId, {
          resource_type: "image",
        });
      }
    }

    // Delete project from database
    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ message: "Error deleting project" });
  }
});

// Get count of all projects
exports.getProjectsCount = asyncHandler(async (req, res) => {
  const count = await Project.countDocuments();
  res.json({ count });
});
