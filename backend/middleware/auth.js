const jwt = require('jsonwebtoken');
const { error } = require('../core/responses');

/**
 * IDENTITY VERIFICATION PROTOCOL
 * Validates the JWT bearer token for every authenticated node request.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return error(res, 'Identity token required.', 401, 'UNAUTHORIZED');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'genesis_nexus_node');
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Identity breach: Invalid or expired token.', 403, 'FORBIDDEN');
  }
};

module.exports = { authenticate };