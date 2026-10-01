'use strict';

const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    message: {
      type:      String,
      required:  [true, 'Message is required.'],
      trim:      true,
      minlength: [5, 'Message must be at least 5 characters.'],
      maxlength: [2000, 'Message must be 2000 characters or fewer.'],
    },
    rating: {
      type: String,
      enum: ['needs-work', 'okay', 'good', 'amazing'],
      required: [true, 'Rating is required.'],
    },
    status: {
      type: String,
      enum: ['Submitted', 'Reviewed', 'Resolved'],
      default: 'Submitted',
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    versionKey: false,
  }
);

// Compound index to assist sorted queries by user and creation date
feedbackSchema.index({ userId: 1, createdAt: -1 });
// Compound index for admin filtering by status and date
feedbackSchema.index({ status: 1, createdAt: -1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
