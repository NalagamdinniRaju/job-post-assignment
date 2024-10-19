const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  experienceLevel: {
    type: String,
    required: true
  },
  candidates: [{
    type: String,
    required: true
  }],
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress','scheduled','pending', 'completed', 'cancelled'],
    default: 'scheduled'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', interviewSchema);