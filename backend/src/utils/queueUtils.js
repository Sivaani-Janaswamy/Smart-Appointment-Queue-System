const Token = require('../models/Token');

/**
 * Calculates the estimated wait time for a new token.
 * @param {string} queueId - The ID of the queue.
 * @param {number} avgServiceTime - The average service time in minutes for this queue.
 * @returns {Promise<number>} - The estimated wait time in minutes.
 */
const calculateWaitTime = async (queueId, avgServiceTime) => {
  // Count how many people are currently 'waiting' in the queue
  const waitingCount = await Token.countDocuments({
    queueId,
    status: 'waiting',
  });

  // The new token will be behind all currently waiting tokens
  const estimatedTime = (waitingCount - 1) * avgServiceTime;
  return Math.max(0, estimatedTime); // Ensure wait time is not negative
};

/**
 * Finds the next token to be served from a queue based on priority.
 * Sorts by priority (desc), then by creation time (asc).
 * @param {string} queueId - The ID of the queue.
 * @returns {Promise<object|null>} - The next token document or null if queue is empty.
 */
const findNextToken = async (queueId) => {
  const nextToken = await Token.findOne({
    queueId,
    status: 'waiting',
  })
    .sort({ priority: -1, createdAt: 1 }) // Highest priority first, then oldest
    .exec();

  return nextToken;
};

module.exports = {
  calculateWaitTime,
  findNextToken,
};
