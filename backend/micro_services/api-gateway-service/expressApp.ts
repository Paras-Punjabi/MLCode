import config from '../configs/dotenv.config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { clerkMiddleware, getAuth } from '@clerk/express';
import routes from './routes';
import serviceRoutes from './routes/service.routes';

const app = express();

app.use(
  cors({
    origin: ['*'],
    credentials: true,
  })
);

app.use(
  clerkMiddleware({
    secretKey: config.CLERK_SECRET_KEY,
    publishableKey: config.CLERK_PUBLISHABLE_KEY,
  })
);

app.use('/services', serviceRoutes);

app.use(express.json());
app.use(cookieParser());

app.use(routes);

export default app;
