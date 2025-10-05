import config from './dotenv.config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: 'src/db/schema.ts',
  out: 'src/db/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: config.DATABASE_URI as string,
  },
  verbose: true,
  strict: true,
});
