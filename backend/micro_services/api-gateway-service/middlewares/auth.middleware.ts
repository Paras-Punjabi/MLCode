import { NextFunction, Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import ApiError from '../../utils/error.utils';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { isAuthenticated, userId, sessionClaims } = getAuth(req);
  if (isAuthenticated && userId) {
    req.userId = userId;
    req.isMLCodeUser = sessionClaims.metadata.isMLCodeUser;
    return next();
  }

  throw new ApiError({
    message: 'Session Expired',
    errorSource: 'Auth',
    statusCode: 401,
  });
};
