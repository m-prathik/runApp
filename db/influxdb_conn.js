const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * InfluxDB Connection Module
 * Handles InfluxDB client initialization and data writing operations
 */

let influxDB = null;
let writeApi = null;

/**
 * Initialize InfluxDB connection
 * @returns {InfluxDB} InfluxDB client instance
 */
function initializeInfluxDB() {
  if (!config.influxdb.token) {
    logger.warn('InfluxDB token not configured. InfluxDB features will be disabled.');
    return null;
  }

  try {
    influxDB = new InfluxDB({
      url: config.influxdb.url,
      token: config.influxdb.token,
    });

    writeApi = influxDB.getWriteApi(config.influxdb.org, config.influxdb.bucket, 'ms');
    
    // Set error handler for write API
    writeApi.useDefaultTags({ app: 'runapp' });

    logger.info('InfluxDB client initialized successfully');
    return influxDB;
  } catch (error) {
    logger.error('Failed to initialize InfluxDB:', error);
    throw error;
  }
}

/**
 * Write run data to InfluxDB
 * @param {Object} runData - Run data object
 * @param {number} runData.userID - User ID
 * @param {string} runData.runId - Run ID
 * @param {Array} runData.route - Array of route points
 * @returns {Promise<void>}
 */
async function writeRunData(runData) {
  if (!writeApi) {
    throw new Error('InfluxDB write API not initialized');
  }

  if (!runData || !runData.route || !Array.isArray(runData.route) || runData.route.length === 0) {
    throw new Error('Invalid run data: route array is required and must not be empty');
  }

  const points = [];

  try {
    runData.route.forEach((dataPoint) => {
      const latitude = parseFloat(dataPoint.latitude);
      const longitude = parseFloat(dataPoint.longitude);
      const heartBeat = dataPoint.heartBeat !== null && dataPoint.heartBeat !== undefined
        ? parseInt(dataPoint.heartBeat, 10)
        : 0;

      // Validate coordinates
      if (isNaN(latitude) || isNaN(longitude)) {
        logger.warn('Invalid coordinates in route point, skipping:', dataPoint);
        return;
      }

      const point = new Point('runRoute4')
        .tag('runId', String(runData.runId))
        .tag('userId', String(runData.userID))
        .floatField('latitude', latitude)
        .floatField('longitude', longitude)
        .intField('heartBeat', heartBeat);

      // Set timestamp if provided
      if (dataPoint.timeStamp) {
        const timestamp = typeof dataPoint.timeStamp === 'number'
          ? new Date(dataPoint.timeStamp * 1000)
          : new Date(dataPoint.timeStamp);
        point.timestamp(timestamp);
      }

      points.push(point);
    });

    if (points.length === 0) {
      throw new Error('No valid points to write');
    }

    writeApi.writePoints(points);
    await writeApi.flush();

    logger.info(`Successfully wrote ${points.length} data points to InfluxDB`);
  } catch (error) {
    logger.error('Error writing data to InfluxDB:', error);
    throw error;
  }
}

/**
 * Close InfluxDB write API
 * @returns {Promise<void>}
 */
async function closeInfluxDB() {
  if (writeApi) {
    try {
      await writeApi.close();
      logger.info('InfluxDB write API closed');
    } catch (error) {
      logger.error('Error closing InfluxDB write API:', error);
    }
  }
}

// Initialize on module load if token is available
if (config.influxdb.token) {
  initializeInfluxDB();
}

module.exports = {
  influxDB: () => influxDB,
  initializeInfluxDB,
  writeRunData,
  closeInfluxDB,
};
