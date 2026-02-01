const rateLimit = require('express-rate-limit');

/**
 * TRAFFIC GOVERNANCE NODE
 * Prevents endpoint exhaustion via request throttling.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    error: "Temporal limit reached. Please wait for the next cycle."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { rateLimiter };