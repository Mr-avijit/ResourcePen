require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initSocket } = require('./sockets/socket.server');
const db = require('./config/db');
const logger = require('./config/logger');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

// Initialize Real-time Node
const io = initSocket(server);

// System Genesis
const startServer = async () => {
  try {
    await db.connect();
    server.listen(PORT, () => {
      logger.info(`[RESOURCES PEN] Architectural Core Active on Port ${PORT}`);
      logger.info(`[SYSTEM] Socket Engine Synchronized`);
    });
  } catch (error) {
    logger.error(`[CRITICAL] Genesis Failure: ${error.message}`);
    process.exit(1);
  }
};

startServer();