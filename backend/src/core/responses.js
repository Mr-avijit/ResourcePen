/**
 * UNIFIED RESPONSE PROTOCOL
 */
const success = (res, data, message = 'Operation Successful', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const error = (res, message = 'Internal Error', status = 500, code = 'GENERIC_ERROR') => {
  return res.status(status).json({
    success: false,
    error: message,
    code,
    timestamp: new Date().toISOString()
  });
};

module.exports = { success, error };