/**
 * server.js - HTTP server entry point.
 *
 * Responsibilities:
 * 1. Connect to MongoDB (fail fast if unable)
 * 2. Start listening on the configured port
 * 3. Handle graceful shutdown on SIGTERM / SIGINT
 *
 * Kept separate from app.js so that tests can import app.js without starting
 * a real HTTP listener or requiring a live DB connection.
 */

import mongoose from 'mongoose';
import app from './app.js';
import { PORT, MONGODB_URI, NODE_ENV } from './config/index.js';
import { logger } from './utils/logger.js';

let server;

/**
 * Connect to MongoDB then start the HTTP server.
 */
async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected', { uri: MONGODB_URI.replace(/\/\/.*@/, '//<credentials>@') });

    server = app.listen(PORT, () => {
      logger.info(`Server started`, { port: PORT, env: NODE_ENV });
    });
  } catch (err) {
    logger.error('Failed to start server', { message: err.message });
    process.exit(1);
  }
}

/**
 * Graceful shutdown handler.
 * Closes the HTTP server (stops accepting new connections), then
 * closes the MongoDB connection, then exits.
 *
 * @param {string} signal
 */
function shutdown(signal) {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await mongoose.connection.close();
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', { reason: String(reason) });
  // Give the server a moment to finish in-flight requests then exit
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

start();
