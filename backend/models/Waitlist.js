const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'expired'],
    default: 'waiting'
  },
  notifiedAt: Date
}, {
  timestamps: true
});

// Index for efficient queries
waitlistSchema.index({ court: 1, date: 1, status: 1 });

module.exports = mongoose.model('Waitlist', waitlistSchema);
