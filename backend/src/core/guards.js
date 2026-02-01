const { error } = require('./responses');
const { PERMISSIONS } = require('./permissions');

/**
 * ARCHITECTURAL GUARDS
 * Enforces RBAC at the routing layer
 */
const checkPermission = (permission) => {
  return (req, res, next) => {
    const userRole = req.user.role.toUpperCase();
    const allowedPermissions = PERMISSIONS[userRole] || [];

    if (!allowedPermissions.includes(permission)) {
      return error(res, 'Insufficient protocol clearance.', 403, 'PERMISSION_DENIED');
    }
    next();
  };
};

module.exports = { checkPermission };