const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Court',
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    default: null
  },
  equipment: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment'
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  pricingBreakdown: {
    courtBasePrice: {
      type: Number,
      required: true
    },
    courtFinalPrice: {
      type: Number,
      required: true
    },
    appliedRules: [{
      ruleName: String,
      modifier: Number
    }],
    coachFee: {
      type: Number,
      default: 0
    },
    equipmentFee: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient availability queries
bookingSchema.index({ court: 1, date: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ coach: 1, date: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
