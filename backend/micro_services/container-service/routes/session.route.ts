import { Router } from 'express';
import {
  deleteSession,
  getCurrentSession,
  getPodStatus,
  requestSession,
} from '../controllers/session.controller';

const router = Router();

router.post('/currentSession', getCurrentSession);
router.post('/requestSession', requestSession);
router.post('/deleteSession', deleteSession);
router.post('/podStatus', getPodStatus);

export default router;
