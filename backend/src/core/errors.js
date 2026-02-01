const errorHandler = (err, req, res, next) => {
  console.error(`[PROTOCOL_FAULT] ${err.stack}`);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Architectural Failure';

  res.status(status).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

module.exports = { errorHandler };