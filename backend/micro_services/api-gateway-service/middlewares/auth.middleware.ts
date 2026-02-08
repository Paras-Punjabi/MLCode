import { NextFunction, Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import ApiError from '../../utils/error.utils';
import config from '../../configs/dotenv.config';
import clerkClient from '../../configs/clerk.config';

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { isAuthenticated, userId, sessionClaims } = getAuth(req);

  const orgResponse = (
    await clerkClient.organizations.getOrganizationMembershipList({
      organizationId: config.CLERK_ORGANIZATION_ID,
      userId: [userId as string],
    })
  ).data;

  if (
    orgResponse.length !== 0 &&
    orgResponse[0].role === config.CLERK_ADMIN_ROLE
  ) {
    req.isAdmin = true;
  } else {
    req.isAdmin = false;
  }

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

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAdmin) {
    return next();
  }
  throw new ApiError({
    message: 'Access Denied',
    errorSource: 'Auth',
    statusCode: 401,
  });
};
