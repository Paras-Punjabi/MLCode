import { config } from 'dotenv';

config();

export default {
  POSTGRES_HOST: process.env.POSTGRES_HOST!,
  POSTGRES_URI: `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:5432/${process.env.POSTGRES_DB}`,
  POSTGRES_USER: process.env.POSTGRES_USER!,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
  POSTGRES_DB: process.env.POSTGRES_DB!,

  MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY!,
  MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY!,
  MINIO_ENDPOINT: process.env.MINIO_ENDPOINT!,
  MINIO_PORT: process.env.MINIO_PORT! || '9000',

  REDIS_URI: process.env.REDIS_URI!,
  REDIS_SORTED_SET_NAME: process.env.REDIS_SORTED_SET_NAME! || 'problems_set',
  REDIS_HASHSET_NAME: process.env.REDIS_HASHSET_NAME! || 'problems_hset',

  KAFKA_BROKERS: process.env.KAFKA_BROKERS!,
  KAFKA_TOPIC: process.env.KAFKA_TOPIC! || 'submissions',

  NOTEBOOKS_BUCKET_NAME: process.env.NOTEBOOKS_BUCKET_NAME! || 'notebooks',
  DATASETS_BUCKET_NAME: process.env.DATASETS_BUCKET_NAME! || 'datasets',
  ANSWERS_BUCKET_NAME: process.env.ANSWERS_BUCKET_NAME! || 'answers',

  LOG_LEVEL: process.env.LOG_LEVEL! || 'info',

  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY!,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY!,
  CLERK_ORGANIZATION_ID: process.env.CLERK_ORGANIZATION_ID!,
  CLERK_MEMBER_ROLE: process.env.CLERK_MEMBER_ROLE! || 'org:member',
  CLERK_PRO_MEMBER_ROLE: process.env.CLERK_PRO_MEMBER_ROLE! || 'org:pro_member',
  CLERK_ADMIN_ROLE: process.env.CLERK_ADMIN_ROLE! || 'org:admin',
  CLERK_USER_ROLE: process.env.CLERK_USER_ROLE! || 'org:user',

  SERVICES: {
    'problem-service': process.env.PROBLEM_SERVICE_URL!,
    'api-gateway-service': process.env.API_GATEWAY_SERVICE_URL!,
    'submission-service': process.env.SUBMISSION_SERVICE_URL!,
    'container-service': process.env.CONTAINER_SERVICE_URL!,
  },
  CURRENT_SERVICE: process.env.CURRENT_SERVICE!,

  FRONTEND_URL: process.env.FRONTEND_URL!,

  NAMESPACE: process.env.NAMESPACE! || 'mlcode',
  NOTEBOOK_DOCKER_IMAGE:
    process.env.NOTEBOOK_DOCKER_IMAGE! ||
    'paraspunjabi2002/mlcode_notebook:1.1.0',

  DEVELOPMENT_MODE: process.env.DEVELOPMENT_MODE! || 'local', // 'local' || 'production'
};
