'use strict';

const feedbackService = require('../services/feedbackService');
const { sendSuccess } = require('../utils/ApiResponse');

/**
 * Retrieves all feedback entries sorted newest-first.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
async function getAllFeedbacks(req, res, next) {
  try {
    const feedbacks = await feedbackService.findAllFeedbacks(req.user);
    sendSuccess(res, 200, 'Feedbacks retrieved successfully.', feedbacks);
  } catch (err) {
    next(err);
  }
}

/**
 * Retrieves a single feedback entry by its MongoDB ObjectId.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
async function getFeedbackById(req, res, next) {
  try {
    const feedback = await feedbackService.findFeedbackById(req.params.id, req.user);
    sendSuccess(res, 200, 'Feedback retrieved successfully.', feedback);
  } catch (err) {
    next(err);
  }
}

/**
 * Creates a new feedback entry using the validated request body.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
async function createFeedback(req, res, next) {
  try {
    const { message, rating } = req.body;
    const created = await feedbackService.createFeedback({ message, rating }, req.user);
    sendSuccess(res, 201, 'Feedback submitted successfully.', created);
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a feedback entry by its MongoDB ObjectId.
 * 
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {Promise<void>}
 */
async function deleteFeedback(req, res, next) {
  try {
    await feedbackService.deleteFeedbackById(req.params.id, req.user);
    sendSuccess(res, 200, 'Feedback deleted successfully.', {});
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllFeedbacks,
  getFeedbackById,
  createFeedback,
  deleteFeedback,
};
