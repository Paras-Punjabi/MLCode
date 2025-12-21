import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import config from '../../configs/dotenv.config';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const { SERVICES } = config;

// public service (problem service)
if (SERVICES['problem-service']) {
  router.use(
    '/problems',
    createProxyMiddleware({
      target: SERVICES['problem-service'],
      changeOrigin: true,
    })
  );
}

router.use(authMiddleware);
// protected services here
router.get('/test-auth', (_req, res) => {
  return res.json({ message: 'protected routes work', success: true });
});

export default router;
