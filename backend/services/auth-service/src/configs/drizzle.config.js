import config from './dotenv.config.js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: 'src/db/schema.js',
  out: 'src/db/migrations/',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: config.DATABASE_URI,
  },
  verbose: true,
  strict: true,
});
