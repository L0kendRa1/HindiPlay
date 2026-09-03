const jwt = require('jsonwebtoken');

/**
 * Generate signed JWT token with user ID in payload.
 *
 * @param {string} userId - User's MongoDB _id
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'hindiplay_fallback_secret_key_change_in_production';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign({ id: userId }, secret, {
    expiresIn,
  });
};

/**
 * Verify and decode JWT token.
 *
 * @param {string} token - Bearer JWT token string
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  const secret = process.env.JWT_SECRET || 'hindiplay_fallback_secret_key_change_in_production';
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  verifyToken,
};
