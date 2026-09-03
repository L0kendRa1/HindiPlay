const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt');

// Simple regex for email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validation: Required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // 2. Validation: Name length
    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 50 characters long',
      });
    }

    // 3. Validation: Email format
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    // 4. Validation: Password length
    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // 6. Create user (password is automatically hashed by pre-save hook)
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    // 7. Generate JWT token
    const token = generateToken(user._id);

    // 8. Return response with token and safe user payload
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validation: Required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 2. Find user in database with password selected
    const user = await User.findOne({ email: trimmedEmail }).select('+password');

    // 3. Check user existence and match password
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user._id);

    // 5. Return success response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (Protected by auth middleware)
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    // req.user is already populated and password-stripped by protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Logout user / clear session
 * @route   POST /api/auth/logout
 * @access  Public / Stateless
 * @note    In stateless Bearer JWT authentication, the client removes the stored token.
 */
exports.logoutUser = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
};
