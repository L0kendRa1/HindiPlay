const User = require('../models/user.model');
const { verifyToken } = require('../utils/jwt');

/**
 * Protect routes by verifying Bearer JWT token and attaching user to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Check for Authorization header starting with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Return 401 if token is missing
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  try {
    // 3. Verify JWT token
    const decoded = verifyToken(token);

    // 4. Find user by ID (password is excluded by default in schema)
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    // 5. Attach user object to request
    req.user = user;
    next();
  } catch (error) {
    console.warn(`Auth middleware verification notice: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, invalid or expired token',
    });
  }
};

/**
 * Optional authentication middleware: if Bearer token is provided and valid, attaches req.user.
 * If token is missing or invalid, proceeds without error with req.user = null.
 */
const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

module.exports = {
  protect,
  optionalProtect,
};

