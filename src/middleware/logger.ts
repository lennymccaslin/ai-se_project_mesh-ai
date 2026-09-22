import type { Request, Response, NextFunction } from 'express';

export const logger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  console.log(`${req.method} ${req.path}`);
  next();
};