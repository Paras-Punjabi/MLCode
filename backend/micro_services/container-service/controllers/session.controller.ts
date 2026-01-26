import { Request, Response } from 'express';
import ContainerService from '../services/container.service';

const containerService = new ContainerService();

export async function getCurrentSession(req: Request, res: Response) {
  try {
    let { userId } = req.body;
    let data = await containerService.getSession(userId);
    res
      .status(200)
      .json({ success: true, data, message: 'User Current Session' });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Cannot Retrieve the current session',
      err,
    });
  }
}

export async function requestSession(req: Request, res: Response) {
  try {
    let { userId, problemId } = req.body;
    let data = await containerService.getSession(userId);
    if (data.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: 'One Session is already running' });
    }
    const sessionDetails = {
      sessionId: crypto.randomUUID(),
      userId,
      problemId,
    };
    await containerService.startNotebookPod(
      sessionDetails.sessionId,
      userId,
      problemId
    );
    res.status(201).json({
      success: true,
      message: 'Session Started',
      data: sessionDetails,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Cannot request a session', err });
  }
}

export async function deleteSession(req: Request, res: Response) {
  try {
    let { userId } = req.body;
    let data = await containerService.getSession(userId);
    if (data.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Session does not exists' });
    }
    let sessionDetails = data[0];
    await containerService.stopNotebookPod(sessionDetails.sessionId || '');
    res.status(202).json({
      success: true,
      message: 'Session Stopped',
      data: sessionDetails,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Cannot delete the session', err });
  }
}

export async function getPodStatus(req: Request, res: Response) {
  try {
    let { sessionId } = req.body;
    let data = await containerService.getNotebookPodStatus(sessionId);
    if (data == null) {
      return res
        .status(404)
        .json({ success: false, message: 'Cannot find session' });
    }
    res.status(200).json({
      success: true,
      message: 'Pod Status',
      data,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Cannot get Pod status', err });
  }
}
