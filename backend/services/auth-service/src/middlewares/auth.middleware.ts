import { Request, Response, NextFunction } from 'express';
import { verifyInternalJwt } from '../utils/jwt.utils';
import { JsonWebTokenError } from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // parse tokens
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.split(' ')[1];
  if (!bearerToken) return next(Error('Token not found'));

  try {
    verifyInternalJwt(bearerToken);
    return next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: 'Token expired!' });
    } else {
      next(err);
    }
  }
};
