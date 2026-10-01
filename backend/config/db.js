'use strict';

const mongoose = require('mongoose');

/**
 * Establishes a connection to MongoDB using the URI from environment variables.
 * Exits the process on failure — there is no value running without a database.
 */
async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2000, // Fail fast if local MongoDB isn't running
    });
    console.log(`[DB] MongoDB connected → ${conn.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Connection to ${process.env.MONGO_URI} failed: ${err.message}`);
    console.log(`[DB] Falling back to zero-config in-memory MongoDB...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const fallbackUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(fallbackUri);
      console.log(`[DB] In-Memory MongoDB connected → ${conn.connection.host}`);
    } catch (fallbackErr) {
      console.error(`[DB] Critical Failure - Could not start fallback DB: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
}

module.exports = connectDB;
