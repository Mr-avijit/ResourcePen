
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'genesis_nexus_node_secret';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: 'admin' | 'user';
    firstName: string;
  };
}

/**
 * Validates JWT bearer protocol.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Fix: Use a type cast to any to ensure headers property access is permitted (resolves error: Property 'headers' does not exist on type 'AuthRequest')
  const authHeader = (req as any).headers?.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Identity token missing.", code: "AUTH_LOCKED" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as any;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Identity breach: Invalid token protocol.", code: "AUTH_INVALID" });
  }
};

/**
 * Enforces role-based clearance levels.
 */
export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient clearance level for this node.", code: "ACCESS_DENIED" });
    }
    next();
  };
};
