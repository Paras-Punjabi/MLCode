import config from '../configs/dotenv.config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import routes from './routes';
import errorMiddleware from './middlewares/error.middleware';

const app = express();

app.use(
  cors({
    origin: [config.FRONTEND_URL],
    credentials: true,
  })
);

app.use(
  clerkMiddleware({
    secretKey: config.CLERK_SECRET_KEY,
    publishableKey: config.CLERK_PUBLISHABLE_KEY,
  })
);

app.use(routes);

app.use(errorMiddleware);

export default app;
