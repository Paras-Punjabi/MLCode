import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/validate-jwt', authMiddleware, (req, res, next) => {

});
router.get('/refresh', (req, res, next) => {
  // verify clerk session
});
router.post('/signup', () => { });
router.post('/signin', () => { });

export default router;
