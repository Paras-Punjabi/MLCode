import { Request, Response } from 'express';
import SubmissionService from '../services/submission.service';

const submissionService = new SubmissionService();

export async function getSubmissions(req: Request, res: Response) {
  try {
    const { userId, problemSlug } = req.body;
    let data = await submissionService.getSubmissions(userId, problemSlug);
    res.status(200).json({ success: true, data, message: 'All Submissions' });
  } catch (err) {
    res.status(200).json({ success: false, message: err });
  }
}

export async function pushSubmissionToKafka(req: Request, res: Response) {
  try {
    const { userId, problemSlug } = req.body;
    await submissionService.pushSubmissionToKafka(userId, problemSlug);
    res
      .status(200)
      .json({ success: true, message: 'Submission Request Queued' });
  } catch (err) {
    res.status(200).json({ success: false, message: err });
  }
}
