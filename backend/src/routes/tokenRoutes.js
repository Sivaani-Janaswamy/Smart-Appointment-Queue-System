const express = require('express');
const router = express.Router();
const {
  createToken,
  getTokenStatus,
  callNextToken,
  completeServiceForToken,
  cancelToken,
} = require('../controllers/tokenController');
const { protect, isAgent } = require('../middleware/authMiddleware');

// @route   POST /api/tokens
// @desc    Create a new token for a queue (customer action)
// @access  Public
router.post('/', createToken);

// @route   GET /api/tokens/:id/status
// @desc    Get the status of a specific token
// @access  Public
router.get('/:id/status', getTokenStatus);

// @route   POST /api/tokens/action/call-next
// @desc    Call the next token in a queue (agent action)
// @access  Private (Agent/Admin)
router.post('/action/call-next', protect, isAgent, callNextToken);

// @route   POST /api/tokens/action/complete
// @desc    Mark a token as 'served' (agent action)
// @access  Private (Agent/Admin)
router.post('/action/complete', protect, isAgent, completeServiceForToken);

// @route   POST /api/tokens/action/cancel
// @desc    Cancel a token (agent or customer action)
// @access  Private (Agent/Admin) for now
router.post('/action/cancel', protect, isAgent, cancelToken);

module.exports = router;
