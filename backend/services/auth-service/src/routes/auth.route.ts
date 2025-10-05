import { Router } from 'express';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { getAuth, requireAuth as requireClerkAuth } from '@clerk/express';
import { clerkClient } from '@/configs/clerk.config';
import UserService from '@/services/user.service';
import { generateInternalJwt } from '@/utils/jwt.utils';
import { tokenExchange, tokenRefresh } from '@/controllers/auth.controller';

const userService = new UserService();

const router = Router();

router.get('/validate-jwt', authMiddleware, (req, res, next) => {
  res.status(200).json({ success: true, message: 'Token is valid' });
});

router.get('/refresh', tokenRefresh);

// exchange token with internal jwt
router.post('/token-exchange', tokenExchange);

export default router;
