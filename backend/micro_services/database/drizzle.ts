import config from '../configs/dotenv.config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './database/schema.ts',
  out: './database/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: config.POSTGRES_URI as string,
  },
  verbose: true,
  strict: true,
});
