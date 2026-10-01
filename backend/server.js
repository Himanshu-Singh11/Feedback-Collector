'use strict';

const app       = require('./app');
const connectDB = require('./config/db');
const { port }  = require('./config/env');

(async () => {
  // Connect to MongoDB before accepting any HTTP traffic
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`[Server] Running in ${process.env.NODE_ENV} mode on port ${port}`);
  });

  // ── Graceful shutdown ─────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n[Server] ${signal} received — shutting down gracefully…`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));

  // Catch unhandled promise rejections and terminate cleanly
  process.on('unhandledRejection', (reason) => {
    console.error('[Server] Unhandled Rejection:', reason);
    server.close(() => process.exit(1));
  });
})();
