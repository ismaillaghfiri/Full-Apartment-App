const Responsable = require('../models/Responsable');
const Project = require('../models/Project');

// Get all responsables (Admin only)
exports.getAllResponsables = async (req, res) => {
  try {
    const responsables = await Responsable.find()
      .select('-__v')
      .populate('createdBy', 'username');
    res.json(responsables);
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
};

// Get single responsable (Admin only)
exports.getResponsable = async (req, res) => {
  try {
    const responsable = await Responsable.findById(req.params.id)
      .select('-__v')
      .populate('createdBy', 'username');

    if (!responsable) {
      return res.status(404).json({ error: 'Responsable not found' });
    }
    res.json(responsable);
  } catch (err) {
    res.status(500).json({ 
      error: 'Server error',
      details: err.message 
    });
  }
};

// Create a new responsable (Admin only)
exports.createResponsable = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Check if email already exists
    const emailExists = await Responsable.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const responsable = new Responsable({
      firstName,
      lastName,
      email,
      phone,
      createdBy: req.user.id
    });

    await responsable.save();
    
    // Remove unnecessary fields from response
    const responsableData = responsable.toObject();
    delete responsableData.__v;
    
    res.status(201).json(responsableData);
  } catch (err) {
    res.status(400).json({ 
      error: 'Validation failed',
      details: err.message 
    });
  }
};

// Update responsable (Admin only)
exports.updateResponsable = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    const responsable = await Responsable.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, email, phone },
      { 
        new: true,
        runValidators: true,
        select: '-__v' 
      }
    ).populate('createdBy', 'username');

    if (!responsable) {
      return res.status(404).json({ error: 'Responsable not found' });
    }
    res.json(responsable);
  } catch (err) {
    res.status(400).json({ 
      error: 'Update failed',
      details: err.message 
    });
  }
};

// Delete responsable (Admin only)
exports.deleteResponsable = async (req, res) => {
  try {
    // 1. Check if responsable exists
    const responsable = await Responsable.findById(req.params.id);
    if (!responsable) {
      return res.status(404).json({ error: 'Responsable not found' });
    }

    // 2. Check if responsable is assigned to any projects
    const projectsCount = await Project.countDocuments({ 
      responsable: req.params.id 
    });
    
    if (projectsCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete responsable assigned to projects',
        details: `This responsable is assigned to ${projectsCount} project(s)`
      });
    }

    // 3. Delete the responsable
    await Responsable.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Responsable deleted successfully' });
  } catch (err) {
    res.status(500).json({ 
      error: 'Deletion failed',
      details: err.message 
    });
  }
};