import { Router, Request, Response } from 'express';
import authRoutes from './auth.route';
import userRoutes from './user.route';
import serviceRoutes from './service.routes';
import adminRoutes from './admin.route';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.get('/health', (_req: Request, res: Response) => {
  try {
    res.status(200).json({ success: true, message: 'API Gateway is Healthy' });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Internal Server Error', error: err });
  }
});

router.use('/auth', authRoutes);

router.use('/user', userRoutes);

router.use('/services', serviceRoutes);

router.use('/admin', authMiddleware, isAdmin, adminRoutes);

export default router;
