import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { tokenExchange, tokenRefresh } from '../controllers/auth.controller';

const router = Router();

// TODO: remove this once services are integrated
router.get('/validate-jwt', authMiddleware);

router.get('/refresh', tokenRefresh);

// exchange token with internal jwt (login/signup)
router.get('/token-exchange', tokenExchange);

export default router;
