import { Router, Request, Response } from 'express';
import {
  getSubmissions,
  pushSubmissionToKafka,
} from '../controllers/submission.controller';

const router = Router();

router.post('/allSubmissions', getSubmissions);
router.post('/submit', pushSubmissionToKafka);
router.get('/health', (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .json({ success: true, message: 'Submission Service is Healthy' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: err });
  }
});
export default router;
