import { Router } from 'express';
import { getUserDetails } from '../controllers/user.controller';

const router = Router();

router.get('/:username', getUserDetails);

export default router;
