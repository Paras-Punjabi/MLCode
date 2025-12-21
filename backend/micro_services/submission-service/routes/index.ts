import { Router } from 'express';
import submissionRouter from './submission.route';

const router = Router();

router.use('/', submissionRouter);

export default router;
