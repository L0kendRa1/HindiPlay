const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamification.controller');
const { protect } = require('../middleware/auth.middleware');

// All gamification routes require valid Bearer JWT authentication
router.use(protect);

/**
 * @route   GET /api/gamification/badges
 * @desc    Get all badges and user's earned badges status
 * @access  Private
 * NOTE: Registered before dynamic routes
 */
router.get('/badges', gamificationController.getBadges);

/**
 * @route   GET /api/gamification
 * @desc    Get user's gamification profile (XP, stars, streak, badges)
 * @access  Private
 */
router.get('/', gamificationController.getGamification);

module.exports = router;
