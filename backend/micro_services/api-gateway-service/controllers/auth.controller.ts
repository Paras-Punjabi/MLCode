import { Request, Response } from 'express';
import UserService from '../services/user.service';
import ApiError from '../../utils/error.utils';
import clerkClient from '../../configs/clerk.config';

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
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { isMLCodeUser: true },
    });
    res.status(200).json({
      success: true,
      message: 'MLCode Profile created successfully',
    });
  } catch (error) {}
};
