const PricingRule = require('../models/PricingRule');

/**
 * Calculate total price for a booking based on active pricing rules
 */
const calculatePrice = async (courtBasePrice, courtType, bookingDate, startTime) => {
  try {
    // Get all active pricing rules
    const rules = await PricingRule.find({ isActive: true }).sort({ priority: 1 });

    const hour = parseInt(startTime.split(':')[0]);
    const dayOfWeek = new Date(bookingDate).getDay();

    let finalPrice = courtBasePrice;
    const appliedRules = [];

    for (const rule of rules) {
      let shouldApply = false;

      switch (rule.type) {
        case 'peak_hour':
          if (rule.conditions.startTime && rule.conditions.endTime) {
            const ruleStart = parseInt(rule.conditions.startTime.split(':')[0]);
            const ruleEnd = parseInt(rule.conditions.endTime.split(':')[0]);
            if (hour >= ruleStart && hour < ruleEnd) {
              shouldApply = true;
            }
          }
          break;

        case 'weekend':
          if (rule.conditions.days && rule.conditions.days.includes(dayOfWeek)) {
            shouldApply = true;
          }
          break;

        case 'court_type':
          if (rule.conditions.courtType === courtType) {
            shouldApply = true;
          }
          break;

        case 'holiday':
        case 'custom':
          if (rule.conditions.startDate && rule.conditions.endDate) {
            const bookingDateObj = new Date(bookingDate);
            const startDate = new Date(rule.conditions.startDate);
            const endDate = new Date(rule.conditions.endDate);
            if (bookingDateObj >= startDate && bookingDateObj <= endDate) {
              shouldApply = true;
            }
          }
          break;
      }

      if (shouldApply) {
        if (rule.modifier.type === 'percentage') {
          const modifier = (rule.modifier.value / 100) * finalPrice;
          finalPrice += modifier;
          appliedRules.push({
            ruleName: rule.name,
            modifier: modifier
          });
        } else if (rule.modifier.type === 'fixed') {
          finalPrice += rule.modifier.value;
          appliedRules.push({
            ruleName: rule.name,
            modifier: rule.modifier.value
          });
        }
      }
    }

    return {
      basePrice: courtBasePrice,
      finalPrice: Math.round(finalPrice * 100) / 100,
      appliedRules
    };
  } catch (error) {
    console.error('Price calculation error:', error);
    return {
      basePrice: courtBasePrice,
      finalPrice: courtBasePrice,
      appliedRules: []
    };
  }
};

module.exports = { calculatePrice };
