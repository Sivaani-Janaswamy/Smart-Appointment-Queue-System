const asyncHandler = require('express-async-handler');
const Queue = require('../models/Queue');
const Token = require('../models/Token');
const ApiError = require('../utils/apiError');
const { broadcastToQueue } = require('../services/webSocketServer');

// @desc    Create a new queue
// @route   POST /api/queues
// @access  Private/Admin
const createQueue = asyncHandler(async (req, res, next) => {
  const { name, description, avgServiceTime, ticketPrefix } = req.body;

  if (!name || !avgServiceTime || !ticketPrefix) {
    return next(new ApiError('Name, average service time, and ticket prefix are required', 400));
  }

  const queue = await Queue.create({ name, description, avgServiceTime, ticketPrefix });
  res.status(201).json(queue);
});

// @desc    Get all queues
// @route   GET /api/queues
// @access  Public
const getAllQueues = asyncHandler(async (req, res, next) => {
  const queues = await Queue.find({ isActive: true });
  res.status(200).json(queues);
});

// @desc    Get a single queue by ID with its waiting tokens
// @route   GET /api/queues/:id
// @access  Public
const getQueueById = asyncHandler(async (req, res, next) => {
  const queue = await Queue.findById(req.params.id);

  if (!queue) {
    return next(new ApiError('Queue not found', 404));
  }
  
  // Also fetch tokens for this queue
  const tokens = await Token.find({ queueId: req.params.id, status: { $in: ['waiting', 'serving'] } })
    .sort({ priority: -1, createdAt: 1 });

  res.status(200).json({
    ...queue.toObject(),
    tokens
  });
});

// @desc    Update a queue
// @route   PUT /api/queues/:id
// @access  Private/Admin
const updateQueue = asyncHandler(async (req, res, next) => {
  const queue = await Queue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!queue) {
    return next(new ApiError('Queue not found', 404));
  }
  
  // If queue details change, it's good to broadcast an update
  broadcastToQueue(queue._id, { type: 'queue_updated', payload: queue });

  res.status(200).json(queue);
});

// @desc    Delete a queue
// @route   DELETE /api/queues/:id
// @access  Private/Admin
const deleteQueue = asyncHandler(async (req, res, next) => {
    const queue = await Queue.findById(req.params.id);

    if (!queue) {
        return next(new ApiError('Queue not found', 404));
    }
    
    // Optional: Check if there are active tokens before deleting
    const activeTokens = await Token.countDocuments({ queueId: req.params.id, status: { $in: ['waiting', 'serving'] } });
    if (activeTokens > 0) {
        return next(new ApiError('Cannot delete queue with active tokens', 400));
    }
    
    await queue.deleteOne(); // Use deleteOne() to trigger middleware if any
    
    broadcastToQueue(queue._id, { type: 'queue_deleted', payload: { queueId: req.params.id } });

    res.status(200).json({ message: 'Queue removed' });
});

module.exports = {
  createQueue,
  getAllQueues,
  getQueueById,
  updateQueue,
  deleteQueue,
};
