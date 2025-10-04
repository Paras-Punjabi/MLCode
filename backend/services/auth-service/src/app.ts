import config from './configs/dotenv.config';

import express from 'express';
import cors from 'cors';
import routes from './routes';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(cors());

app.use(clerkMiddleware({
  jwtKey: config.CLERK_SECRET_KEY,
  publishableKey: config.CLERK_PUBLISHABLE_KEY
}))

app.use(routes);

export default app;

app.listen(config.PORT, async () => {
  console.log('Auth service running at', config.PORT);
});
