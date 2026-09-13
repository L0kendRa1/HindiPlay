const mongoose = require('mongoose');

const hindiWordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: [true, 'Word is required'],
      trim: true,
      unique: true,
    },
    normalizedWord: {
      type: String,
      required: [true, 'Normalized word is required'],
      trim: true,
      index: true,
    },
    meaning: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
      index: true,
    },
    letters: {
      type: [String],
      required: [true, 'Letters array is required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A word must contain at least one Hindi letter unit',
      },
    },
    learningUnits: {
      type: [String],
      required: [true, 'Learning units array is required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A word must contain at least one learning unit',
      },
    },
    matras: {
      type: [String],
      default: [],
    },
    image: {
      type: {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        source: { type: String, default: 'HindiPlay Vector Assets' },
        license: { type: String, default: 'Original HindiPlay asset' },
        isAvailable: { type: Boolean, default: true },
      },
      default: null,
    },
    audioText: {
      type: String,
      required: [true, 'audioText is required for pronunciation'],
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    subject: {
      type: String,
      default: 'hindi',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for high-frequency queries
hindiWordSchema.index({ category: 1, difficulty: 1, isActive: 1 });
hindiWordSchema.index({ word: 'text', normalizedWord: 'text', tags: 'text' });

const HindiWord = mongoose.model('HindiWord', hindiWordSchema);

module.exports = HindiWord;
