import fs from 'fs/promises';
import path from 'path';
import { type StorageAdapter } from './types';

export class LocalStorageAdapter implements StorageAdapter {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath || process.env.STORAGE_LOCAL_PATH || './uploads';
  }

  async upload(buffer: Buffer, filename: string, _contentType: string): Promise<string> {
    const dir = path.join(this.basePath, 'cv');
    await fs.mkdir(dir, { recursive: true });

    const uniqueName = `${Date.now()}-${filename}`;
    const filePath = path.join(dir, uniqueName);
    await fs.writeFile(filePath, buffer);

    return `cv/${uniqueName}`;
  }

  getUrl(filePath: string): string {
    return `/api/files/${filePath}`;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(this.basePath, filePath);
    try {
      await fs.unlink(fullPath);
    } catch {
      // File may not exist
    }
  }
}
