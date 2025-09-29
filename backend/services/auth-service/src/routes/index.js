import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  const { name } = req.query;
  const resText = `Hello ${name ?? 'world'} from MLCode!`;
  return res.json(resText);
});

export default router;
