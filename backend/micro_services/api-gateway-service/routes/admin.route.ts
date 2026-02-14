import { Router } from 'express';
import {
  createProblem,
  getOverview,
  updateProblem,
} from '../controllers/admin.controller';
import multer from 'multer';

const multerMemoryStorage = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post('/problem/create', multerMemoryStorage.any(), createProblem);

router.post('/problem/update', updateProblem);

router.get('/overview', getOverview);

export default router;
