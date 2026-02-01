const { getIO } = require('../../sockets/socket.server');
const nodemailer = require('nodemailer');

/**
 * REACH ORCHESTRATOR
 */
class NotificationService {
  constructor() {
    this.mailer = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  }

  async broadcast(userId, title, message) {
    // 1. Real-time Socket Dispatch
    const io = getIO();
    io.to(`user_${userId}`).emit('notification', { title, message });

    // 2. Email Relay
    await this.mailer.sendMail({
      from: '"Resources Pen" <noreply@resourcespen.com>',
      to: 'user@example.com',
      subject: title,
      text: message
    });
  }
}

module.exports = new NotificationService();