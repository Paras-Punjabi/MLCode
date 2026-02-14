import { Client } from 'minio';
import config from './dotenv.config';

const minioClient = new Client({
  endPoint: config.MINIO_ENDPOINT,
  port: parseInt(config.MINIO_PORT as string),
  accessKey: config.MINIO_ACCESS_KEY,
  secretKey: config.MINIO_SECRET_KEY,
  useSSL: false,
});

export default minioClient;
