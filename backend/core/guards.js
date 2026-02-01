const { error } = require('./responses');

/**
 * ARCHITECTURAL GUARDS
 * Enforces RBAC at the routing layer based on user identity nodes.
 */
const checkPermission = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 'Identity token missing.', 401, 'AUTH_REQUIRED');
    }

    const userRole = req.user.role.toLowerCase();
    
    // Admin has genesis access
    if (userRole === 'admin') return next();

    if (userRole !== requiredRole.toLowerCase()) {
      return error(res, 'Insufficient protocol clearance.', 403, 'ACCESS_DENIED');
    }

    next();
  };
};

module.exports = { checkPermission };