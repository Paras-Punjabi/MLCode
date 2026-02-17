import minioClient from '../../configs/minio.config';
import csv from 'csv-parser';
import { getZodSchema } from '../utils/schemaToZod.utils';
import { ObjectStore } from '../core/objectStore.interface';
import Stream from 'stream';

export default class MinioService implements ObjectStore {
  async objectExists(bucketName: string, path: string) {
    try {
      await minioClient.statObject(bucketName, path);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getParsedJSONObject(bucketName: string, path: string) {
    try {
      let stream = await minioClient.getObject(bucketName, path);
      let data = stream.read().toString();
      return {
        success: true,
        data: JSON.parse(data),
        message: 'JSON Object Parsed Successfully',
      };
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
    if (!(await this.objectExists(bucketName, path))) {
      return {
        success: false,
        data: null,
        message: `${path.split('/').slice(-1)} does not exists`,
      };
    }
    let stream = await minioClient.getObject(bucketName, path);
    let rows: Record<string, unknown>[] = [];
    let success = true;
    for await (let chunk of stream.pipe(csv())) {
      let parsedChunk = zodSchema.safeParse(chunk);
      success &&= parsedChunk.success;
      if (!parsedChunk.success) {
        return {
          success: false,
          data: null,
          message: 'Failed to parse the User Submission',
        };
      }
      rows.push(parsedChunk.data);
    }
    return {
      success,
      data: rows,
      message: success
        ? 'User Submission Parsed Successfully'
        : 'Failed to parse the User Submission',
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
