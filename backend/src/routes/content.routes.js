const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');

/**
 * @route   GET /api/content/hindi/stats
 * @desc    Get content library statistics
 * @access  Public
 */
router.get('/stats', contentController.getContentStats);

/**
 * @route   GET /api/content/hindi/words/random
 * @desc    Get random unique Hindi words
 * @access  Public
 */
router.get('/words/random', contentController.getRandomWords);

/**
 * @route   GET /api/content/hindi/words
 * @desc    Get paginated and filtered Hindi words
 * @access  Public
 */
router.get('/words', contentController.getWords);

/**
 * @route   GET /api/content/hindi/words/:id
 * @desc    Get single word by ID
 * @access  Public
 */
router.get('/words/:id', contentController.getWordById);

/**
 * @route   GET /api/content/hindi/letters
 * @desc    Get all Hindi letters (Swar & Vyanjan)
 * @access  Public
 */
router.get('/letters', contentController.getLetters);

/**
 * @route   GET /api/content/hindi/matras
 * @desc    Get all Hindi Matras
 * @access  Public
 */
router.get('/matras', contentController.getMatras);

/**
 * @route   GET /api/content/hindi/stories
 * @desc    Get Hindi reading stories with pagination & filtering
 * @access  Public
 */
router.get('/stories', contentController.getStories);

/**
 * @route   GET /api/content/hindi/stories/:id
 * @desc    Get single story by ID
 * @access  Public
 */
router.get('/stories/:id', contentController.getStoryById);

module.exports = router;
