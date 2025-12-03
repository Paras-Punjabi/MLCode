import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { tokenExchange, tokenRefresh } from '@/controllers/auth.controller';

const router = Router();

// TODO: remove this once services are integrated
router.get('/validate-jwt', authMiddleware, (_req, res) => {
  res.status(200).json({ success: true, message: 'Token is valid' });
});

router.get('/refresh', tokenRefresh);

// exchange token with internal jwt (login/signup)
router.post('/token-exchange', tokenExchange);

export default router;
