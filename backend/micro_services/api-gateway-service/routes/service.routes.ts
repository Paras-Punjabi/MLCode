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
      ws: true,
    })
  );
}

router.use(authMiddleware);

// protected services here
if (SERVICES['submission-service']) {
  router.use(
    '/submissions',
    createProxyMiddleware({
      target: SERVICES['submission-service'],
      changeOrigin: true,
      ws: true,
    })
  );
}

if (SERVICES['container-service']) {
  router.use(
    '/containers',
    createProxyMiddleware({
      target: SERVICES['container-service'],
      changeOrigin: true,
      ws: true,
    })
  );
}

export default router;
