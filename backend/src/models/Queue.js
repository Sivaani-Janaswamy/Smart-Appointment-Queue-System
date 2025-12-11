const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // The prefix for tickets in this queue, e.g., 'A' for 'A-101'
    ticketPrefix: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        maxLength: 3,
    },
    // Average time in minutes to serve one token
    avgServiceTime: {
      type: Number,
      required: true,
      default: 5, // Default to 5 minutes
    },
    lastTicketNumber: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Queue = mongoose.model('Queue', queueSchema);

module.exports = Queue;
