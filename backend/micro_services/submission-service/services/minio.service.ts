import minioClient from '../../configs/minio.config';
import csv from 'csv-parser';
import { getZodSchema } from '../utils/schemaToZod.utils';
import { ObjectStore } from '../core/objectStore.interface';
import Stream from 'stream';

export default class MinioService implements ObjectStore {
  async getParsedJSONObject(bucketName: string, path: string) {
    try {
      let stream = await minioClient.getObject(bucketName, path);
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
    let stream = await minioClient.getObject(bucketName, path);
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

  async insertObject(
    bucketName: string,
    path: string,
    stream: Stream.Readable,
    size: number
  ) {
    await minioClient.putObject(bucketName, path, stream, size, {
      lastUpdated: new Date().toDateString(),
    });
  }
}
