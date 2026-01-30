import { Request, Response } from 'express';
import UserService from '../services/user.service';

const userService = new UserService();

export async function getUserDetails(req: Request, res: Response) {
  try {
    const username = req.params.username;

    if (!username) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Username is Required',
      });
    }

    const user = await userService.getUserDetailsFromClerk(username);
    res.status(200).json({
      success: true,
      data: user,
      message: `User Details of ${username}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      data: null,
      message: 'Internal Server Error from Clerk',
    });
  }
}
