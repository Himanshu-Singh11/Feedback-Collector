'use strict';

/**
 * Centralised access to validated environment variables.
 * Import this module instead of referencing process.env directly
 * so that missing variables surface at boot time, not at runtime.
 */

require('dotenv').config();

const required = ['MONGO_URI'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[Config] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  nodeEnv:      process.env.NODE_ENV || 'development',
  port:         Number(process.env.PORT) || 5000,
  mongoUri:     process.env.MONGO_URI,
  clientOrigin: process.env.CLIENT_ORIGIN || '*',
  jwtSecret:    process.env.JWT_SECRET || 'default_secret',
  jwtExpire:    process.env.JWT_EXPIRE || '30d',
};
