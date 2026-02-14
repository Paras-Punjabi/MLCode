import Stream from 'stream';

export interface ObjectStore {
  getParsedJSONObject(
    bucketName: string,
    path: string
  ): Promise<{
    success: boolean;
    data: Record<string, string> | null;
    message: string | null;
  }>;

  getParsedCSVObject(
    bucketName: string,
    path: string,
    schema: Record<string, string>
  ): Promise<{
    success: boolean;
    data: Record<string, unknown>[];
    message: string | null;
  }>;

  insertObject(
    bucketName: string,
    path: string,
    stream: Stream.Readable,
    size: number
  ): Promise<void>;
}
