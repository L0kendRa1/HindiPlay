const mongoose = require('mongoose');

const hindiMatraSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Matra symbol is required'],
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Matra name is required'],
      trim: true,
    },
    sound: {
      type: String,
      required: [true, 'Sound description is required'],
      trim: true,
    },
    vowelEquivalent: {
      type: String,
      default: '',
      trim: true,
    },
    position: {
      type: String,
      enum: ['right', 'left', 'top', 'bottom'],
      default: 'right',
    },
    examples: [
      {
        baseConsonant: { type: String, required: true },
        combinedUnit: { type: String, required: true },
        exampleWord: { type: String, default: '' },
      },
    ],
    learningUnits: {
      type: [String],
      default: [],
    },
    audioText: {
      type: String,
      required: [true, 'audioText is required for pronunciation'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
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

const HindiMatra = mongoose.model('HindiMatra', hindiMatraSchema);

module.exports = HindiMatra;
