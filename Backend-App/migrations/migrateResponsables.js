const mongoose = require('mongoose');
const { User, Responsable, Project } = require('../models');

mongoose.connect(process.env.MONGO_URI);

async function migrate() {
  const responsables = await Responsable.find().lean();
  
  for (const resp of responsables) {
    // 1. Create user account for each responsable
    const user = new User({
      username: resp.email.split('@')[0], // Or generate unique username
      password: 'temporaryPassword123', // Should be changed after migration
      role: 'responsable',
      firstName: resp.firstName,
      lastName: resp.lastName,
      email: resp.email,
      phone: resp.phone,
      assignedProjects: resp.assignedProjects
    });
    
    await user.save();
    
    // 2. Update all projects referencing this responsable
    await Project.updateMany(
      { responsable: resp._id },
      { responsable: user._id }
    );
  }
  
  console.log(`Migrated ${responsables.length} responsables`);
  process.exit();
}

migrate();