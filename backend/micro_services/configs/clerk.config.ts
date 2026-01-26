import config from './dotenv.config';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({
  secretKey: config.CLERK_SECRET_KEY,
  publishableKey: config.CLERK_PUBLISHABLE_KEY,
});

export default clerkClient;
