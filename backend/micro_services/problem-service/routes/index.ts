import { Router } from 'express';
import problemRouter from './problem.route';

const router = Router();

router.use('/problems', problemRouter);

export default router;
