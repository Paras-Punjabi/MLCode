import { Router, Request, Response } from 'express';
import {
  getProblemById,
  getProblems,
} from '../controllers/problem.controller.js';

const router = Router();

router.get('/', getProblems);

router.get('/id/:problem_id', getProblemById);

router.get('/health', (req: Request, res: Response) => {
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
