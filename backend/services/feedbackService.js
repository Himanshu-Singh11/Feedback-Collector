'use strict';

const Feedback = require('../models/Feedback');
const ApiError  = require('../utils/ApiError');

/**
 * Retrieve feedback entries based on role.
 * Admins see all, users see only their own.
 */
async function findAllFeedbacks(user) {
  const query = user.role === 'admin' ? {} : { userId: user._id };
  const feedbacks = await Feedback.find(query)
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .lean();

  return feedbacks.map((fb) => ({
    ...fb,
    name: fb.userId ? fb.userId.name : 'Unknown User',
    email: fb.userId ? fb.userId.email : 'unknown@example.com',
  }));
}

/**
 * Find a single feedback entry by its MongoDB ObjectId.
 */
async function findFeedbackById(id, user) {
  const feedback = await Feedback.findById(id).populate('userId', 'name email').lean();
  if (!feedback) {
    throw new ApiError(404, `Feedback with id '${id}' not found.`);
  }
  
  if (user.role !== 'admin' && feedback.userId._id.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this feedback');
  }

  return {
    ...feedback,
    name: feedback.userId ? feedback.userId.name : 'Unknown User',
    email: feedback.userId ? feedback.userId.email : 'unknown@example.com',
  };
}

/**
 * Persist a new feedback entry.
 */
async function createFeedback(payload, user) {
  // Attach the user ID to the feedback payload
  const feedback = await Feedback.create({ ...payload, userId: user._id });
  const fbObject = feedback.toObject();
  
  return {
    ...fbObject,
    name: user.name,
    email: user.email
  };
}

/**
 * Remove a feedback entry by id based on role.
 */
async function deleteFeedbackById(id, user) {
  const feedback = await Feedback.findById(id);
  if (!feedback) {
    throw new ApiError(404, `Feedback with id '${id}' not found.`);
  }

  // Check ownership if not admin
  if (user.role !== 'admin' && feedback.userId.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this feedback');
  }

  await feedback.deleteOne();
}

module.exports = {
  findAllFeedbacks,
  findFeedbackById,
  createFeedback,
  deleteFeedbackById,
};
