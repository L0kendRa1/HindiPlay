/**
 * Health check controller.
 * Returns operational status of HindiPlay backend API.
 */
exports.getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HindiPlay backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
};
