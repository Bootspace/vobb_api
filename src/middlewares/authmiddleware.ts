import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppResponse } from '@/common/utils';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return AppResponse(res, 401, null, 'Access denied: No token provided');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.userId = decoded.id;
    next();
  } catch {
    return AppResponse(res, 401, null, 'Invalid or expired token');
  }
};
