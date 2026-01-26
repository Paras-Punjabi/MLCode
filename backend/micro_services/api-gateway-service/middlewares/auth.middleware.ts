import { Request, Response } from 'express';
import { verifyInternalJwt } from '../utils/jwt.utils';
import { JsonWebTokenError } from 'jsonwebtoken';

export const authorizeToken = (authorization: string | undefined) => {
  if (!authorization)
    return {
      success: false,
      message: 'Bearer token not found',
      statusCode: 401,
    };

  const [tokenType, bearerToken] = authorization?.split(' ') || [];
  if (tokenType !== 'Bearer')
    return {
      success: false,
      message: 'Bearer token not found',
      statusCode: 401,
    };
  try {
    const payload = verifyInternalJwt(bearerToken);
    return { success: true, message: 'Token is valid', statusCode: 200 };
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return { success: false, message: 'Token expired!', statusCode: 401 };
    } else {
      return {
        success: false,
        message: 'Internal Server error',
        error: err,
        statusCode: 500,
      };
    }
  }
};

export const authMiddleware = (req: Request, res: Response) => {
  const { success, statusCode, message, error } = authorizeToken(
    req.headers.authorization
  );
  res.status(statusCode).json({ success, message, error });
};
