const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const { protect } = require('../middleware/auth.middleware');

// All progress routes require valid Bearer JWT authentication
router.use(protect);

/**
 * @route   POST /api/progress
 * @desc    Save activity progress / attempt
 * @access  Private
 */
router.post('/', progressController.createProgress);

/**
 * @route   GET /api/progress
 * @desc    Get user's progress history with pagination and filters
 * @access  Private
 */
router.get('/', progressController.getProgress);

/**
 * @route   GET /api/progress/stats
 * @desc    Get overall learning progress statistics and activity breakdown
 * @access  Private
 * NOTE: Must be registered BEFORE /:activityId to avoid route collision
 */
router.get('/stats', progressController.getProgressStats);

/**
 * @route   GET /api/progress/:activityId
 * @desc    Get user's progress for a specific activity
 * @access  Private
 */
router.get('/:activityId', progressController.getActivityProgress);

module.exports = router;
