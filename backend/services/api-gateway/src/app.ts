import config from './configs/dotenv.config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import httpLoggerMiddleware from './middlewares/http-logger.middleware';
import { clerkMiddleware } from '@clerk/express';
import routes from './routes';

const app = express();

app.use(httpLoggerMiddleware);
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  clerkMiddleware({
    secretKey: config.CLERK_SECRET_KEY,
    publishableKey: config.CLERK_PUBLISHABLE_KEY,
  })
);
app.use(routes);

app.listen(config.PORT, (err) => {
  if (err) {
    return console.error('Failed to start Auth service:', err);
  }
  console.info('Auth service running at ' + config.PORT);
});
