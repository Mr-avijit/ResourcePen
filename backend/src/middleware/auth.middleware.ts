
import { Request as ExpressRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends ExpressRequest {
  user?: {
    id: string;
    role: string;
    clearance: number;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Use a type cast to any to ensure headers property access is permitted across different environments
  const authHeader = (req as any).headers?.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: "Identity token missing. Access denied." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_genesis_node');
    req.user = decoded as any;
    next();
  } catch (err) {
    res.status(403).json({ error: "Identity breach: Invalid protocol token." });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient clearance for this node." });
    }
    next();
  };
};
