import { Request, Response } from 'express';
import UserService from '../services/user.service';
import { generateInternalJwt } from '../utils/jwt.utils';
import { clerkClient, getAuth } from '@clerk/express';

const userService = new UserService();

export const tokenRefresh = async (req: Request, res: Response) => {
  // verify clerk session
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated || !userId)
    return res.status(401).json({ success: false, message: 'Not logged in!' });

  const authUser = await userService.findById(userId);
  if (!authUser) {
    return res
      .status(403)
      .json({ success: false, message: 'User not found. Sign up first' });
  }

  const internalJwt = generateInternalJwt(authUser);
  res
    .cookie('access_token', internalJwt, {
      maxAge: 1000 * 60 * 15,
    })
    .status(200)
    .json({
      success: true,
      token: internalJwt,
    });
};

export const tokenExchange = async (req: Request, res: Response) => {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated || !userId)
    return res
      .status(401)
      .json({ success: false, message: 'User not logged in!' });

  const clerkUser = await clerkClient.users.getUser(userId);
  if (!clerkUser.username || !clerkUser.primaryEmailAddress)
    return res.status(400).json({
      success: false,
      message: 'No username and/or email is associated with this account',
    });

  // update user (so that any changes in clerk stays in sync with auth service)
  const authUser = await userService.upsert({
    userId: clerkUser.id,
    userName: clerkUser.username,
    userEmail: clerkUser.primaryEmailAddress.emailAddress,
  });

  const internalJwt = generateInternalJwt(authUser);
  res
    .cookie('access_token', internalJwt, {
      maxAge: 1000 * 60 * 15,
    })
    .status(200)
    .json({
      success: true,
      token: internalJwt,
    });
};
