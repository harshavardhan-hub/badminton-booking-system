const Coach = require('../models/Coach');

// @desc    Get all coaches
// @route   GET /api/coaches
// @access  Public
exports.getAllCoaches = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const coaches = await Coach.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single coach
// @route   GET /api/coaches/:id
// @access  Public
exports.getCoach = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return res.status(404).json({ success: false, message: 'Coach not found' });
    }

    res.json({
      success: true,
      data: coach
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create coach
// @route   POST /api/coaches
// @access  Private/Admin
exports.createCoach = async (req, res) => {
  try {
    const coach = await Coach.create(req.body);

    res.status(201).json({
      success: true,
      data: coach
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update coach
// @route   PUT /api/coaches/:id
// @access  Private/Admin
exports.updateCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!coach) {
      return res.status(404).json({ success: false, message: 'Coach not found' });
    }

    res.json({
      success: true,
      data: coach
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete coach
// @route   DELETE /api/coaches/:id
// @access  Private/Admin
exports.deleteCoach = async (req, res) => {
  try {
    const coach = await Coach.findByIdAndDelete(req.params.id);

    if (!coach) {
      return res.status(404).json({ success: false, message: 'Coach not found' });
    }

    res.json({
      success: true,
      message: 'Coach deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
