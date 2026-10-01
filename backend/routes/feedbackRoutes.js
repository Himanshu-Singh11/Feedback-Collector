'use strict';

const { Router } = require('express');
const feedbackController = require('../controllers/feedbackController');
const validateRequest = require('../middleware/validateRequest');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = Router();

// Protect all routes and ensure only specific roles can access
router.use(protect, authorizeRoles('user', 'admin'));

// GET  /api/feedback
router.get('/', feedbackController.getAllFeedbacks);

// GET  /api/feedback/:id
router.get('/:id', feedbackController.getFeedbackById);

// POST /api/feedback
router.post(
  '/',
  validateRequest({
    message: { required: true, type: 'string' },
    rating: { required: true, type: 'string' },
  }),
  feedbackController.createFeedback
);

// DELETE /api/feedback/:id
router.delete('/:id', feedbackController.deleteFeedback);

module.exports = router;
