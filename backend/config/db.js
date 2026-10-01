'use strict';

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Exits the process on failure — there is no value running without a database.
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[DB] MongoDB connected → ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB] MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
