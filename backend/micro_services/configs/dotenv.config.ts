import { config } from 'dotenv';

config({
  path: 'D:\\React Frameworks\\MLCode\\backend\\micro_services\\.env',
});

export default {
  PORT: process.env.PORT!,

  POSTGRES_HOST: process.env.POSTGRES_HOST!,
  POSTGRES_URI: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
  POSTGRES_USER: process.env.POSTGRES_USER!,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
  POSTGRES_DB: process.env.POSTGRES_DB!,

  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
  MINIO_PORT: process.env.MINIO_PORT! || 9000,

  REDIS_URI: process.env.REDIS_URI!,
  REDIS_SORTED_SET_NAME: 'problems_set',
  REDIS_HASHSET_NAME: 'problems_hset',

  KAFKA_BROKERS: process.env.KAFKA_BROKERS!,
  KAFKA_TOPIC: 'submissions',

  NOTEBOOKS_BUCKET_NAME: 'notebooks',
  DATASETS_BUCKET_NAME: 'datasets',
  ANSWERS_BUCKET_NAME: 'answers',

  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  JWT_SECRET: process.env.JWT_SECRET! || '0f92b685-b6cc-4c4d-864a-94f8eb63cdcc',

  JWT_ISSUER: process.env.JWT_ISSUER || 'api-gateway',

  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,

  SERVICES: {
    'problem-service': process.env.PROBLEM_SERVICE_URL!,
    'api-gateway-service': process.env.API_GATEWAY_SERVICE_URL!,
    'submission-service': process.env.SUBMISSION_SERVICE_URL!,
    'container-service': process.env.CONTAINER_SERVICE_URL!,
  },
  CURRENT_SERVICE: process.env.CURRENT_SERVICE!,

  NAMESPACE: process.env.NAMESPACE || 'mlcode',
  NOTEBOOK_DOCKER: 'paraspunjabi2002/mlcode_notebook:1.0.0',
};
