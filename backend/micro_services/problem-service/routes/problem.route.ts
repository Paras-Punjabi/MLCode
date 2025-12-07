import { Router } from 'express';
import {
  getProblemById,
  getProblems,
} from '../controllers/problem.controller.js';

const router = Router();

router.get('/', getProblems);

router.get('/id/:problem_id', getProblemById);

export default router;
