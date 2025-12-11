// src/utils/predictionUtils.js

const Token = require('../models/Token');

/**
 * Calculates a multiplier based on the current hour.
 * (e.g., lunch hours and end-of-day are busier)
 */
const getTimeMultiplier = () => {
  const hour = new Date().getHours();
  // Peak hours (12pm-2pm, 4pm-5pm)
  if ((hour >= 12 && hour < 14) || (hour >= 16 && hour < 17)) {
    return 1.3; // 30% busier
  }
  // Off-peak hours
  if (hour < 10 || hour > 17) {
    return 0.8; // 20% less busy
  }
  return 1.0; // Normal
};

/**
 * Calculates a multiplier based on the day of the week.
 * (e.g., Fridays are busier)
 */
const getDayMultiplier = () => {
  const day = new Date().getDay(); // Sunday = 0, Monday = 1, etc.
  if (day === 5) { // Friday
    return 1.2; // 20% busier
  }
  if (day === 0 || day === 6) { // Weekend
    return 0.7;
  }
  return 1.0;
};

/**
 * Calculates an AI-enhanced estimated wait time.
 * @param {string} queueId - The ID of the queue.
 * @param {number} avgServiceTime - The base average service time.
 * @returns {Promise<number>} - The estimated wait time in minutes.
 */
const calculateAIPredictedWaitTime = async (queueId, avgServiceTime) => {
  const waitingCount = await Token.countDocuments({
    queueId,
    status: 'waiting',
  });

  const timeMultiplier = getTimeMultiplier();
  const dayMultiplier = getDayMultiplier();

  // The new token is behind all currently waiting tokens
  const baseWaitTime = (waitingCount > 0 ? waitingCount - 1 : 0) * avgServiceTime;
  const predictedTime = baseWaitTime * timeMultiplier * dayMultiplier;
  
  // Return a rounded integer, ensuring it's at least the avg service time if there's a queue
  const finalTime = Math.ceil(predictedTime);
  return waitingCount > 1 ? Math.max(finalTime, Math.ceil(avgServiceTime / 2)) : 0;
};

module.exports = { calculateAIPredictedWaitTime };
