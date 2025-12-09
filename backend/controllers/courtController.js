const Court = require('../models/Court');

// @desc    Get all courts
// @route   GET /api/courts
// @access  Public
exports.getAllCourts = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const courts = await Court.find(query).sort({ name: 1 });

    res.json({
      success: true,
      count: courts.length,
      data: courts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single court
// @route   GET /api/courts/:id
// @access  Public
exports.getCourt = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);

    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    res.json({
      success: true,
      data: court
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create court
// @route   POST /api/courts
// @access  Private/Admin
exports.createCourt = async (req, res) => {
  try {
    const court = await Court.create(req.body);

    res.status(201).json({
      success: true,
      data: court
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update court
// @route   PUT /api/courts/:id
// @access  Private/Admin
exports.updateCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    res.json({
      success: true,
      data: court
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete court
// @route   DELETE /api/courts/:id
// @access  Private/Admin
exports.deleteCourt = async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.id);

    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    res.json({
      success: true,
      message: 'Court deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
