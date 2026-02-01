const { Server } = require('socket.io');
const logger = require('../config/logger');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }
  });

  io.on('connection', (socket) => {
    logger.info(`[SOCKET] Node Connected: ${socket.id}`);

    socket.on('join_room', (room) => {
      socket.join(room);
      logger.info(`[SOCKET] Client joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      logger.info(`[SOCKET] Node Disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };