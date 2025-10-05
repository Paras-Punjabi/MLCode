import { config } from 'dotenv';
import path from 'path';

config({
  path: path.resolve(process.cwd(), 'src/.env'),
});

export default {
  PORT: process.env.PORT!,
  DATABASE_URI: process.env.DATABASE_URI!,
  DATABASE_USER: process.env.DATABASE_USER!,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD!,
  DATABASE_NAME: process.env.DATABASE_NAME!,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
  MINIO_URI: process.env.MINIO_URI!,
  REDIS_URI:process.env.REDIS_URI!,
  REDIS_SORTED_SET_NAME:"problems_set",
  REDIS_HASHSET_NAME:"problems_hset",
  BUCKET_NAME: 'problems',
};
