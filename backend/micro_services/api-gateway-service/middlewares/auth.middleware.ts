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
  const [tokenType, bearerToken] = authHeader?.split(' ') || [];
  if (tokenType !== 'bearer') return next(Error('Bearer token not found'));

  try {
    verifyInternalJwt(bearerToken);
    return next();
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Token expired!' });
    } else {
      res
        .status(500)
        .json({ success: false, message: 'Internal Server error', error: err });
    }
  }
};
