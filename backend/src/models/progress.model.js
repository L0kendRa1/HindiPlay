const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      default: 'hindi',
      trim: true,
      lowercase: true,
    },
    activityId: {
      type: String,
      required: [true, 'Activity ID is required'],
      trim: true,
      index: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total is required'],
      min: [0, 'Total cannot be negative'],
    },
    accuracy: {
      type: Number,
      required: [true, 'Accuracy is required'],
      min: [0, 'Accuracy cannot be negative'],
      max: [100, 'Accuracy cannot exceed 100'],
    },
    attempts: {
      type: Number,
      required: [true, 'Attempts count is required'],
      min: [1, 'Attempts must be at least 1'],
      default: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timeSpentSeconds: {
      type: Number,
      min: [0, 'Time spent cannot be negative'],
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal querying and isolation
progressSchema.index({ user: 1, createdAt: -1 });
progressSchema.index({ user: 1, activityId: 1 });
progressSchema.index({ user: 1, subject: 1 });

// Clean JSON serialization (remove internal __v)
progressSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
