import { Request, Response } from 'express';
import UserService from '../services/user.service';
import ApiError from '../../utils/error.utils';
import clerkClient from '../../configs/clerk.config';
import config from '../../configs/dotenv.config';

const userService = new UserService();

export const syncUser = async (req: Request, res: Response) => {
  const { userId, isMLCodeUser } = req;

  if (!userId)
    throw new ApiError({
      message: 'User not logged in',
      errorSource: 'Auth',
      statusCode: 500,
    });

  if (isMLCodeUser)
    return res.status(200).json({
      success: true,
      message: 'Profile already exists',
    });

  try {
    await userService.upsert({ userId });

    await clerkClient.organizations.createOrganizationMembership({
      userId,
      organizationId: config.CLERK_ORGANIZATION_ID,
      role: config.CLERK_MEMBER_ROLE,
    });

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { isMLCodeUser: true, role: config.CLERK_MEMBER_ROLE },
    });

    res.status(200).json({
      success: true,
      message: 'MLCode Profile created successfully',
    });
  } catch (error) {
    throw new ApiError({
      statusCode: 500,
      errorSource: 'Auth',
      message: 'An error occured while login. Please try again!',
    });
  }
};
