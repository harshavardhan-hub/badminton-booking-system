const mongoose = require('mongoose');

const pricingRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['peak_hour', 'weekend', 'court_type', 'holiday', 'custom'],
    required: true
  },
  conditions: {
    // For peak_hour
    startTime: String, // Format: "HH:MM"
    endTime: String,
    
    // For weekend
    days: [Number], // 0 = Sunday, 6 = Saturday
    
    // For court_type
    courtType: {
      type: String,
      enum: ['indoor', 'outdoor']
    },
    
    // For holiday/custom
    startDate: Date,
    endDate: Date
  },
  modifier: {
    type: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PricingRule', pricingRuleSchema);
