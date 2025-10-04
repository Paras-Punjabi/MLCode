import config from './dotenv.config.ts';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {
    connectionString: config.DATABASE_URI,
  },
});
