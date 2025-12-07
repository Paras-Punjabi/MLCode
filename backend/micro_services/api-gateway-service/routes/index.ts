import { Router } from 'express';
import authRoutes from './auth.route';
import serviceRoutes from './service.routes';

const router = Router();

router.use('/auth', authRoutes);
// public services
router.use('/services', serviceRoutes);

export default router;
