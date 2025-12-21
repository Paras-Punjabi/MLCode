export interface ObjectReader {
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
    data: (Record<string, unknown>)[];
    message: string | null;
  }>;
}
