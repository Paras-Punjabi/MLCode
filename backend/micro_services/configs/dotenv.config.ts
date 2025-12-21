import { config } from 'dotenv';

config({ path: 'D:\\React Frameworks\\MLCode\\backend\\micro_services\\.env' });

export default {
  PORT: process.env.PORT!,
  DATABASE_URI: process.env.DATABASE_URI!,
  DATABASE_USER: process.env.DATABASE_USER!,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD!,
  DATABASE_NAME: process.env.DATABASE_NAME!,
  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
  MINIO_PORT: process.env.MINIO_PORT!,
  REDIS_URI: process.env.REDIS_URI!,
  REDIS_SORTED_SET_NAME: 'problems_set',
  REDIS_HASHSET_NAME: 'problems_hset',
  KAFKA_BROKERS: process.env.KAFKA_BROKERS!,
  KAFKA_TOPIC: 'submissions',
  NOTEBOOKS_BUCKET_NAME: 'notebooks',
  DATASETS_BUCKET_NAME: 'datasets',
  ANSWERS_BUCKET_NAME: 'answers',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_ISSUER: process.env.JWT_ISSUER || 'auth-service',
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  SERVICES: {
    'problem-service': process.env.PROBLEM_SERVICE_URL!,
    'api-gateway-service': process.env.API_GATEWAY_SERVICE_URL!,
    'submission-service': process.env.SUBMISSION_SERVICE_URL!,
  },
  CURRENT_SERVICE: process.env.CURRENT_SERVICE!,
};
