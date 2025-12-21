import { Router } from 'express';
import problemRouter from './problem.route';

const router = Router();

router.use('/', problemRouter);

export default router;
