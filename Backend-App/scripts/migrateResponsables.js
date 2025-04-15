const mongoose = require("mongoose");
const User = require("../models/user");
const Project = require("../models/Project");
require("dotenv").config();

const migrateResponsables = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Find all projects with responsables
    const projects = await Project.find({
      responsable: { $exists: true, $ne: null },
    }).populate("responsable");

    console.log(`Found ${projects.length} projects with responsables`);

    // Process each project
    for (const project of projects) {
      if (project.responsable) {
        // Check if the responsable exists as a user
        let user = await User.findOne({
          $or: [
            { email: project.responsable.email },
            { username: project.responsable.username },
          ],
        });

        if (!user) {
          // Create new user from responsable
          user = await User.create({
            username:
              project.responsable.username || `responsable_${Date.now()}`,
            password: "defaultPassword123", // Set a default password
            role: "responsable",
            firstName: project.responsable.firstName,
            lastName: project.responsable.lastName,
            email: project.responsable.email,
            phone: project.responsable.phone,
            assignedProjects: [project._id],
          });
          console.log(
            `Created new user for responsable: ${user.firstName} ${user.lastName}`
          );
        } else {
          // Update existing user
          user.role = "responsable";
          if (!user.assignedProjects.includes(project._id)) {
            user.assignedProjects.push(project._id);
          }
          await user.save();
          console.log(
            `Updated existing user: ${user.firstName} ${user.lastName}`
          );
        }

        // Update project's responsable reference
        project.responsable = user._id;
        await project.save();
        console.log(`Updated project ${project.name} with new responsable`);
      }
    }

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateResponsables();
