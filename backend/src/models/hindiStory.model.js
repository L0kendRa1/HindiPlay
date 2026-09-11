const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, 'Question options are required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length >= 2,
        message: 'A question must have at least 2 options',
      },
    },
    answer: {
      type: String,
      required: [true, 'Correct answer is required'],
      trim: true,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

const hindiStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Story title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    paragraphs: {
      type: [String],
      required: [true, 'Story paragraphs are required'],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'A story must have at least one paragraph',
      },
    },
    content: {
      type: String,
      required: [true, 'Full story content is required'],
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
      index: true,
    },
    ageLevel: {
      type: String,
      default: '5-8 years',
    },
    vocabulary: {
      type: [String],
      default: [],
    },
    questions: {
      type: [questionSchema],
      default: [],
    },
    image: {
      type: {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        source: { type: String, default: 'HindiPlay Assets' },
        license: { type: String, default: 'Educational / CC-BY' },
      },
      default: null,
    },
    audioText: {
      type: String,
      required: [true, 'audioText is required for narration'],
      trim: true,
    },
    emoji: {
      type: String,
      default: '📖',
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

const HindiStory = mongoose.model('HindiStory', hindiStorySchema);

module.exports = HindiStory;
