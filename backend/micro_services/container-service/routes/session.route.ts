import { Router } from 'express';
import {
  deleteSession,
  getCurrentSession,
  requestSession,
} from '../controllers/session.controller';

const router = Router();

router.post('/currentSession', getCurrentSession);
router.post('/requestSession', requestSession);
router.post('/deleteSession', deleteSession);

export default router;
