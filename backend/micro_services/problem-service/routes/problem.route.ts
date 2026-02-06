import { Router, Request, Response } from 'express';
import {
  getProblemBySlug,
  getProblems,
} from '../controllers/problem.controller';

const router = Router();

router.get('/', getProblems);

router.get('/:problem_slug', getProblemBySlug);

router.get('/health', (_req: Request, res: Response) => {
  try {
    res
      .status(200)
      .json({ success: true, message: 'Problem Service is Healthy' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: err });
  }
});

export default router;
