import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Authorization token required' },
    });
    return;
  }

  try {
    const token = authHeader.slice('Bearer '.length).trim();
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Invalid or expired token' },
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as { userId: string };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      data: null,
      error: { message: 'Invalid or expired token' },
    });
  }
};