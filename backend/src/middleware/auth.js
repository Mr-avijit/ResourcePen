const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Identity token missing." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'genesis_nexus');
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Token invalid or expired." });
  }
};

module.exports = { authenticate };