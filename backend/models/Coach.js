const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    default: 'Badminton'
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    default: ''
  },
  experience: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  availability: [{
    dayOfWeek: {
      type: Number, // 0 = Sunday, 6 = Saturday
      required: true
    },
    startTime: {
      type: String, // Format: "HH:MM"
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Coach', coachSchema);
