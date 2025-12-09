const PricingRule = require('../models/PricingRule');

// @desc    Get all pricing rules
// @route   GET /api/pricing-rules
// @access  Public
exports.getAllRules = async (req, res) => {
  try {
    const { isActive } = req.query;
    
    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const rules = await PricingRule.find(query).sort({ priority: 1 });

    res.json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single pricing rule
// @route   GET /api/pricing-rules/:id
// @access  Public
exports.getRule = async (req, res) => {
  try {
    const rule = await PricingRule.findById(req.params.id);

    if (!rule) {
      return res.status(404).json({ success: false, message: 'Pricing rule not found' });
    }

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create pricing rule
// @route   POST /api/pricing-rules
// @access  Private/Admin
exports.createRule = async (req, res) => {
  try {
    const rule = await PricingRule.create(req.body);

    res.status(201).json({
      success: true,
      data: rule
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update pricing rule
// @route   PUT /api/pricing-rules/:id
// @access  Private/Admin
exports.updateRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!rule) {
      return res.status(404).json({ success: false, message: 'Pricing rule not found' });
    }

    res.json({
      success: true,
      data: rule
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete pricing rule
// @route   DELETE /api/pricing-rules/:id
// @access  Private/Admin
exports.deleteRule = async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndDelete(req.params.id);

    if (!rule) {
      return res.status(404).json({ success: false, message: 'Pricing rule not found' });
    }

    res.json({
      success: true,
      message: 'Pricing rule deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Calculate price for a booking
// @route   POST /api/pricing-rules/calculate
// @access  Public
exports.calculateBookingPrice = async (req, res) => {
  try {
    const { courtId, coachId, equipment, date, startTime } = req.body;

    const Court = require('../models/Court');
    const Coach = require('../models/Coach');
    const Equipment = require('../models/Equipment');
    const { calculatePrice } = require('../utils/priceCalculator');

    // Get court
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ success: false, message: 'Court not found' });
    }

    // Calculate court price with rules
    const courtPricing = await calculatePrice(court.basePrice, court.type, date, startTime);

    // Calculate equipment fee
    let equipmentFee = 0;
    if (equipment && equipment.length > 0) {
      for (const item of equipment) {
        const equipmentItem = await Equipment.findById(item.item);
        if (equipmentItem) {
          equipmentFee += equipmentItem.pricePerHour * item.quantity;
        }
      }
    }

    // Calculate coach fee
    let coachFee = 0;
    if (coachId) {
      const coach = await Coach.findById(coachId);
      if (coach) {
        coachFee = coach.hourlyRate;
      }
    }

    const totalPrice = courtPricing.finalPrice + equipmentFee + coachFee;

    res.json({
      success: true,
      data: {
        courtBasePrice: courtPricing.basePrice,
        courtFinalPrice: courtPricing.finalPrice,
        appliedRules: courtPricing.appliedRules,
        equipmentFee,
        coachFee,
        totalPrice
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
