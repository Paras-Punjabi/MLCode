import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { clerkClient } from '@clerk/express';
import ApiError from '../../utils/error.utils';

const userService = new UserService();

export const syncUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId)
    throw new ApiError({
      message: 'User not logged in',
      errorSource: 'Auth',
      statusCode: 500,
    });

  const clerkUser = await clerkClient.users.getUser(userId);
  if (!clerkUser.username || !clerkUser.primaryEmailAddress)
    return res.status(400).json({
      success: false,
      message: 'No username and/or email is associated with this account',
    });

  // update user (so that any changes in clerk stays in sync with auth service)
  const updatedUser = await userService.upsert({
    userId: clerkUser.id,
    userName: clerkUser.username,
    userEmail: clerkUser.primaryEmailAddress.emailAddress,
  });

  res.status(200).json({ success: true, updatedUser });
};
