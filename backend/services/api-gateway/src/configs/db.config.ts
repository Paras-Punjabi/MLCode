import config from './dotenv.config';
import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {
    connectionString: config.DATABASE_URI,
  },
});
