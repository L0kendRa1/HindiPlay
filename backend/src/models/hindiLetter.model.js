const mongoose = require('mongoose');

const hindiLetterSchema = new mongoose.Schema(
  {
    character: {
      type: String,
      required: [true, 'Character is required'],
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: ['स्वर', 'व्यंजन', 'अन्य'],
      index: true,
    },
    pronunciationText: {
      type: String,
      required: [true, 'Pronunciation text is required'],
      trim: true,
    },
    learningUnits: {
      type: [String],
      default: function () {
        return [this.character];
      },
    },
    exampleWord: {
      type: String,
      default: '',
    },
    exampleMeaning: {
      type: String,
      default: '',
    },
    image: {
      type: {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        source: { type: String, default: 'HindiPlay Vector Assets' },
        license: { type: String, default: 'Educational / CC-BY' },
      },
      default: null,
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

const HindiLetter = mongoose.model('HindiLetter', hindiLetterSchema);

module.exports = HindiLetter;
