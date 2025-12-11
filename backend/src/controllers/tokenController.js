const asyncHandler = require('express-async-handler');
const Token = require('../models/Token');
const Queue = require('../models/Queue');
const ApiError = require('../utils/apiError');
const { calculateAIPredictedWaitTime } = require('../utils/predictionUtils');
const { findNextToken } = require('../utils/queueUtils');
const { broadcastToQueue } = require('../services/webSocketServer');

// @desc    Create a new token for a queue
// @route   POST /api/tokens
// @access  Public
const createToken = asyncHandler(async (req, res, next) => {
  const { queueId, priority = 0 } = req.body;

  if (!queueId) {
    return next(new ApiError('Queue ID is required', 400));
  }

  const queue = await Queue.findById(queueId);
  if (!queue || !queue.isActive) {
    return next(new ApiError('Queue not found or is not active', 404));
  }

  // Atomically increment the ticket number
  const updatedQueue = await Queue.findByIdAndUpdate(
    queueId,
    { $inc: { lastTicketNumber: 1 } },
    { new: true }
  );

  const tokenNumber = `${updatedQueue.ticketPrefix}-${updatedQueue.lastTicketNumber}`;

  const estimatedWaitTime = await calculateAIPredictedWaitTime(
    queueId,
    queue.avgServiceTime
  );

  const token = await Token.create({
    queueId,
    tokenNumber,
    priority,
    estimatedWaitTime,
  });

  // Broadcast the update to all subscribed clients for this queue
  broadcastToQueue(queueId, { type: 'token_created', payload: token });

  res.status(201).json(token);
});

// @desc    Get status of a specific token
// @route   GET /api/tokens/:id/status
// @access  Public
const getTokenStatus = asyncHandler(async (req, res, next) => {
  const token = await Token.findById(req.params.id);

  if (!token) {
    return next(new ApiError('Token not found', 404));
  }

  // Calculate position in queue if waiting
  let position = 0;
  if (token.status === 'waiting') {
    // Count tokens created before this one that are still waiting, considering priority
    const higherPriorityCount = await Token.countDocuments({
      queueId: token.queueId,
      status: 'waiting',
      priority: { $gt: token.priority },
    });
    
    const samePriorityCount = await Token.countDocuments({
        queueId: token.queueId,
        status: 'waiting',
        priority: token.priority,
        createdAt: { $lt: token.createdAt },
    });

    position = higherPriorityCount + samePriorityCount + 1;
  }

  res.status(200).json({
    ...token.toObject(),
    position,
  });
});

// @desc    Call the next token in a queue
// @route   POST /api/tokens/action/call-next
// @access  Private (Agent/Admin)
const callNextToken = asyncHandler(async (req, res, next) => {
  const { queueId } = req.body;

  const nextToken = await findNextToken(queueId);

  if (!nextToken) {
    return next(new ApiError('No waiting customers in the queue', 404));
  }

  nextToken.status = 'serving';
  nextToken.calledAt = new Date();
  nextToken.agentId = req.user._id;
  await nextToken.save();

  // Broadcast that a token is being called
  broadcastToQueue(queueId, { type: 'token_called', payload: nextToken });

  res.status(200).json(nextToken);
});

// @desc    Mark a token as 'served'
// @route   POST /api/tokens/action/complete
// @access  Private (Agent/Admin)
const completeServiceForToken = asyncHandler(async (req, res, next) => {
    const { tokenId } = req.body;
    const token = await Token.findById(tokenId);

    if (!token) {
        return next(new ApiError('Token not found', 404));
    }
    
    if (token.status !== 'serving') {
        return next(new ApiError('Token is not currently being served', 400));
    }
    
    token.status = 'served';
    token.servedAt = new Date();
    await token.save();

    // Broadcast update
    broadcastToQueue(token.queueId, { type: 'token_served', payload: token });

    res.status(200).json({ message: 'Service completed', token });
});

// @desc    Cancel a token
// @route   POST /api/tokens/action/cancel
// @access  Private (Agent/Admin)
const cancelToken = asyncHandler(async (req, res, next) => {
    const { tokenId } = req.body;
    const token = await Token.findById(tokenId);
    
    if (!token) {
        return next(new ApiError('Token not found', 404));
    }
    
    token.status = 'cancelled';
    await token.save();

    // Broadcast update
    broadcastToQueue(token.queueId, { type: 'token_cancelled', payload: token });
    
    res.status(200).json({ message: 'Token cancelled', token });
});


module.exports = {
  createToken,
  getTokenStatus,
  callNextToken,
  completeServiceForToken,
  cancelToken
};
