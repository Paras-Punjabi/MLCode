import { Router } from 'express';
import {
  getSubmissions,
  pushSubmissionToKafka,
} from '../controllers/submission.controller';

const router = Router();

router.post('/allSubmissions', getSubmissions);
router.post('/submit', pushSubmissionToKafka);

export default router;
