const rateLimit = require('express-rate-limit');
const { error } = require('./responses');

/**
 * TRAFFIC GOVERNANCE
 * Prevents DDoS and brute-force attempts on sensitive endpoints.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Temporal threshold reached. Synchronizing... please wait." },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * PROTOCOL VALIDATION
 * Generic validator for request body schemas.
 */
const validate = (schema) => (req, res, next) => {
  const { error: validationError } = schema.validate(req.body);
  if (validationError) {
    return error(res, validationError.details[0].message, 400, 'VALIDATION_ERROR');
  }
  next();
};

module.exports = { rateLimiter, validate };