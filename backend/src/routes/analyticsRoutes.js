const express = require('express');
const router = express.Router();
const { getWeeklyAnalytics } = require('../controllers/analyticsController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/weekly').get(protect, isAdmin, getWeeklyAnalytics);

module.exports = router;
