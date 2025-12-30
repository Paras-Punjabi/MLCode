import { Request, Response } from 'express';
import SessionService from '../services/session.service';

const sessionService = new SessionService();

export async function getCurrentSession(req: Request, res: Response) {
  try {
    let { userId } = req.body;
    let data = await sessionService.getCurrentSession(userId);
    res
      .status(200)
      .json({ success: true, data, message: 'User Current Session' });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Cannot Retrieve the current session',
        err,
      });
  }
}

export async function requestSession(req: Request, res: Response) {
  try {
    let { userId, problemId } = req.body;
    let data = await sessionService.getCurrentSession(userId);
    if (data.length > 0) {
      res
        .status(400)
        .json({ success: false, message: 'One Session is already running' });
    }
    data = await sessionService.insertSession(userId, problemId);
    // containerService startPod()
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Cannot request a session', err });
  }
}

export async function deleteSession(req: Request, res: Response) {
  try {
    let { userId } = req.body;
    let data = await sessionService.deleteSession(userId);
    // containerService stopPod()
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Cannot delete the session', err });
  }
}
