import { Router } from 'express';
import {
  createProblem,
  getOverview,
  updateProblem,
} from '../controllers/admin.controller';

const router = Router();

router.post('/problem/create', createProblem);

router.post('/problem/update', updateProblem);

router.get('/overview', getOverview);

export default router;
