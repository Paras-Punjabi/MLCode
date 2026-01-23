import { Client } from 'minio';
import config from '../../configs/dotenv.config';
import csv from 'csv-parser';
import { getZodSchema } from '../utils/schemaToZod.utils';
import { ObjectReader } from '../core/objectStore.interface';

export default class MinioObjectReader implements ObjectReader {
  private client: Client;
  constructor() {
    this.client = new Client({
      endPoint: config.MINIO_ENDPOINT,
      port: parseInt(config.MINIO_PORT as string),
      accessKey: config.MINIO_ACCESS_KEY,
      secretKey: config.MINIO_SECRET_KEY,
      useSSL: false,
    });
  }

  async getParsedJSONObject(bucketName: string, path: string) {
    try {
      let stream = await this.client.getObject(bucketName, path);
      let data = stream.read().toString();
      return { success: true, data: JSON.parse(data), message: null };
    } catch (err) {
      return { success: false, data: null, message: 'Failed to parse schema' };
    }
  }

  async getParsedCSVObject(
    bucketName: string,
    path: string,
    schema: Record<string, string>
  ) {
    let zodSchema = getZodSchema(schema);
    let stream = await this.client.getObject(bucketName, path);
    let rows: Record<string, unknown>[] = [];
    let success = true;
    for await (let chunk of stream.pipe(csv())) {
      let parsedChunk = zodSchema.safeParse(chunk);
      success &&= parsedChunk.success;
      if (!parsedChunk.success) {
        return {
          success: false,
          data: [],
          message: success ? null : 'Failed to parse the submission',
        };
      }
      rows.push(parsedChunk.data);
    }
    return {
      success,
      data: rows,
      message: success ? null : 'Failed to parse the submission',
    };
  }
}
