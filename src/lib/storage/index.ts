import { type StorageAdapter } from './types';
import { LocalStorageAdapter } from './local';

let storageInstance: StorageAdapter | null = null;

export function getStorage(): StorageAdapter {
  if (!storageInstance) {
    const adapter = process.env.STORAGE_ADAPTER || 'local';
    switch (adapter) {
      case 'local':
        storageInstance = new LocalStorageAdapter();
        break;
      // Future: case 's3': storageInstance = new S3StorageAdapter(); break;
      default:
        storageInstance = new LocalStorageAdapter();
    }
  }
  return storageInstance;
}

export type { StorageAdapter };
