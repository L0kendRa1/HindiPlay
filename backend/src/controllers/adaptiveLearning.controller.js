const adaptiveLearningService = require('../services/adaptiveLearning.service');

/**
 * @desc    Get personalized learning recommendations for authenticated learner (or guest fallback)
 * @route   GET /api/content/hindi/personalized
 * @access  Public / Optional Auth (tailors content if authenticated)
 */
exports.getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const recommendations = await adaptiveLearningService.getPersonalizedRecommendations(userId);

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get guest starter learning recommendations
 * @route   GET /api/content/hindi/personalized/guest
 * @access  Public
 */
exports.getGuestRecommendations = async (req, res, next) => {
  try {
    const recommendations = await adaptiveLearningService.getGuestRecommendations();

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};
