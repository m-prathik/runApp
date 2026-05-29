/**
 * Configuration module
 * Centralizes all configuration values from environment variables
 */
require('dotenv').config();

const logger = require('../utils/logger');

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  
  mongo: {
    url: process.env.MONGO_URL || 'mongodb://localhost:27017/runapp',
  },
  
  influxdb: {
    url: process.env.INFLUXDB_URL || 'http://localhost:8086',
    token: process.env.INFLUXDB_TOKEN || '',
    org: process.env.INFLUXDB_ORG || 'dd',
    bucket: process.env.INFLUXDB_BUCKET || 'run_time_stamps',
  },
};

// Validate required environment variables
if (!config.mongo.url) {
  throw new Error('MONGO_URL environment variable is required');
}

if (!config.influxdb.token) {
  logger.warn('INFLUXDB_TOKEN not set. InfluxDB features may not work.');
}

module.exports = config;

