'use strict';

const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const { clientOrigin, nodeEnv } = require('./config/env');

const authRoutes     = require('./routes/authRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const notFound       = require('./middleware/notFound');
const errorHandler   = require('./middleware/errorHandler');

const app = express();

// ── CORS ──────────────────────────────────────────────────
app.use(
  cors({
    origin:      clientOrigin,
    methods:     ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  })
);

// ── Request parsing ───────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// ── HTTP request logging ──────────────────────────────────
if (nodeEnv !== 'test') {
  app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));
}

// ── Health check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', env: nodeEnv });
});

// ── API routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);

// Explicit role-based routes mapping to the same DRY controller logic
const { protect, authorizeRoles } = require('./middleware/authMiddleware');
const feedbackController = require('./controllers/feedbackController');
app.get('/api/admin/feedback', protect, authorizeRoles('admin'), feedbackController.getAllFeedbacks);
app.get('/api/user/feedback', protect, authorizeRoles('user', 'admin'), feedbackController.getAllFeedbacks);

// ── 404 handler (must come after all routes) ──────────────
app.use(notFound);

// ── Global error handler (must come last) ─────────────────
app.use(errorHandler);

module.exports = app;
