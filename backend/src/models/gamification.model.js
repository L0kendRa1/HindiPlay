const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Badge ID is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Badge name is required'],
      trim: true,
    },
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { _id: false }
);

const gamificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },
    totalXp: {
      type: Number,
      required: true,
      min: [0, 'Total XP cannot be negative'],
      default: 0,
    },
    totalStars: {
      type: Number,
      required: true,
      min: [0, 'Total stars cannot be negative'],
      default: 0,
    },
    currentStreak: {
      type: Number,
      required: true,
      min: [0, 'Current streak cannot be negative'],
      default: 0,
    },
    longestStreak: {
      type: Number,
      required: true,
      min: [0, 'Longest streak cannot be negative'],
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: null,
    },
    badges: {
      type: [badgeSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Clean JSON serialization (remove internal __v)
gamificationSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Gamification = mongoose.model('Gamification', gamificationSchema);

module.exports = Gamification;
