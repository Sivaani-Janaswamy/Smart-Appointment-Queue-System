const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    queueId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Queue',
    },
    tokenNumber: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'serving', 'served', 'cancelled', 'no-show'],
      default: 'waiting',
    },
    priority: {
      type: Number,
      default: 0, // 0: Normal, 1: VIP, 2: Emergency
    },
    estimatedWaitTime: {
      type: Number, // in minutes
    },
    // Timestamps for analytics
    calledAt: { type: Date },
    servedAt: { type: Date },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true, // `createdAt` will be the join time
  }
);

// Create a compound index for faster lookups
tokenSchema.index({ queueId: 1, status: 1 });

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
