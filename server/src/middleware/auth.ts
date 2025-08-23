import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function attachAuth(req: any, _res: Response, next: NextFunction) {
  const header = req.headers?.authorization;
  if (header?.startsWith('Bearer ')) {
    try {
      const token = header.replace('Bearer ', '');
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev') as any;
      req.userId = payload.sub;
      req.userRole = payload.role;
    } catch {}
  }
  next();
}

export function requireRole(...roles: string[]) {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.userId) return res.status(401).json({ error: 'Unauthorized' });
    if (roles.length && !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}