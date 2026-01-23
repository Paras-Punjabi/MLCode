import { Router, type Request, Response } from 'express';
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
router.get('/health', (req: Request, res: Response) => {
  try {
    res
      .status(200)
      .json({ success: true, message: 'Container Service is Healthy' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: err });
  }
});

export default router;
