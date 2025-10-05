import config from './dotenv.config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle({
  connection: {
    connectionString: config.DATABASE_URI,
  },
});

export default db;
