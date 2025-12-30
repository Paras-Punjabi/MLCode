import sessionRouter from './session.route';
import { Router } from 'express';
const router = Router();

router.use('/', sessionRouter);

export default router


