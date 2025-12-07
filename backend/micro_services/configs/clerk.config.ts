import config from './dotenv.config';
import { createClerkClient } from '@clerk/express';

export const clerkClient = createClerkClient({
  secretKey: config.CLERK_SECRET_KEY,
  publishableKey: config.CLERK_PUBLISHABLE_KEY,
});
