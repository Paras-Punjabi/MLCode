import config from './configs/dotenv.config';
import express from 'express';
import cors from 'cors';
import routes from './routes';
import httpLoggerMiddleware from './middlewares/http-logger.middleware';
import { clerkMiddleware } from '@clerk/express';

const app = express();

app.use(httpLoggerMiddleware);

app.use(cors());

app.use(
  clerkMiddleware({
    secretKey: config.CLERK_SECRET_KEY,
    publishableKey: config.CLERK_PUBLISHABLE_KEY,
  })
);

app.use(routes);

export default app;

app.listen(config.PORT, (err) => {
  if (err) {
    return console.error('Failed to start Auth service:', err);
  }
  console.info('Auth service running at ' + config.PORT);
});
