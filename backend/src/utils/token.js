const jwt = require('jsonwebtoken');

/**
 * IDENTITY TOKEN PROTOCOL
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET || 'genesis_nexus_node', 
    { expiresIn: '24h' }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'genesis_nexus_node');
};

module.exports = { generateToken, verifyToken };