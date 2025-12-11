// src/controllers/analyticsController.js
const asyncHandler = require('express-async-handler');
const Token = require('../models/Token');
const mongoose = require('mongoose');

// @desc    Get weekly analytics data
// @route   GET /api/analytics/weekly
// @access  Private/Admin
const getWeeklyAnalytics = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyData = await Token.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
        status: 'served',
      },
    },
    {
      $project: {
        dayOfWeek: { $dayOfWeek: '$createdAt' }, // Sunday=1, Monday=2...
        // Calculate wait time in minutes
        waitTime: {
          $divide: [{ $subtract: ['$servedAt', '$calledAt'] }, 1000 * 60],
        },
      },
    },
    {
      $group: {
        _id: '$dayOfWeek',
        totalTokens: { $sum: 1 },
        avgWaitTime: { $avg: '$waitTime' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Format data for easier frontend consumption
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const formattedData = days.map((day, index) => {
    const foundDay = weeklyData.find(d => d._id === index + 1);
    return {
      name: day,
      "Tokens Served": foundDay ? foundDay.totalTokens : 0,
      "Avg Wait (min)": foundDay ? Math.round(foundDay.avgWaitTime) : 0,
    };
  });

  res.json(formattedData);
});

module.exports = { getWeeklyAnalytics };
