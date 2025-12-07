import config from '../configs/dotenv.config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/schema.ts',
  out: './migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: config.DATABASE_URI as string,
  },
  verbose: true,
  strict: true,
});
