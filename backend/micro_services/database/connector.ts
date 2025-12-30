import config from '../configs/dotenv.config';
import { drizzle } from 'drizzle-orm/node-postgres';

const db = drizzle({
  connection: {
    connectionString: config.POSTGRES_URI,
  },
});

export default db;
