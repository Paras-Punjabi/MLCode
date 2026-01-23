import config from '../configs/dotenv.config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { clerkMiddleware } from '@clerk/express';
import routes from './routes';
import serviceRoutes from './routes/service.routes';

const app = express();

app.use(cors());
app.use(
  clerkMiddleware({
    secretKey: config.CLERK_SECRET_KEY,
    publishableKey: config.CLERK_PUBLISHABLE_KEY,
  })
);

// Service Routes want raw request object
app.use('/services', serviceRoutes);

app.use(express.json());
app.use(cookieParser());
app.use(routes);

export default app;
