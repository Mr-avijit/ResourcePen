/**
 * GLOBAL EXCEPTION PROTOCOL
 * Formats system faults into semantic API responses.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[CRITICAL_FAULT] ${err.message}`);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Architectural Failure';

  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl
  });
};

module.exports = { errorHandler };