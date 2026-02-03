import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { syncUser } from '../controllers/auth.controller';

const router = Router();

// sync user details from clerk on every login
router.put('/sync-user', authMiddleware, syncUser);

export default router;
