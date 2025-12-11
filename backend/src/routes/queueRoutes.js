const express = require('express');
const router = express.Router();
const {
  createQueue,
  getAllQueues,
  getQueueById,
  updateQueue,
  deleteQueue,
} = require('../controllers/queueController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All queue management routes are protected and admin-only for modification
router.route('/').post(protect, isAdmin, createQueue).get(getAllQueues);

router
  .route('/:id')
  .get(getQueueById)
  .put(protect, isAdmin, updateQueue)
  .delete(protect, isAdmin, deleteQueue);

module.exports = router;
