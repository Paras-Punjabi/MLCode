import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  containerServiceProxyServer,
  problemServiceProxyServer,
  submissionServiceProxyServer,
} from '../services/proxy.service';

const router = Router();

router.use('/problems', (req: Request, res: Response) => {
  problemServiceProxyServer.web(req, res);
});

router.use('/submissions', authMiddleware, (req: Request, res: Response) => {
  submissionServiceProxyServer.web(req, res);
});

router.use('/containers', authMiddleware, (req: Request, res: Response) => {
  containerServiceProxyServer.web(req, res);
});

export default router;
