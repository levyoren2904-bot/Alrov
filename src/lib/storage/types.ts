export interface StorageAdapter {
  upload(buffer: Buffer, filename: string, contentType: string): Promise<string>;
  getUrl(path: string): string;
  delete(path: string): Promise<void>;
}
