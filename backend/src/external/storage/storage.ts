import fs from 'fs';
import path from 'path';
import { config } from '../../config';

export interface StorageProvider {
  save(key: string, buffer: Buffer, mimeType: string): Promise<string>;
  getUrl(key: string): string;
  getBuffer(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
}

// ─── Local storage (dev) ──────────────────────────────────────────────────────

class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor(uploadDir: string) {
    this.uploadDir = uploadDir;
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  async save(key: string, buffer: Buffer, _mimeType: string): Promise<string> {
    const filePath = path.join(this.uploadDir, key);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, buffer);
    return key;
  }

  getUrl(key: string): string {
    return `/api/v1/files/${key}`;
  }

  async getBuffer(key: string): Promise<Buffer> {
    return fs.readFileSync(path.join(this.uploadDir, key));
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.uploadDir, key);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
}

// ─── Factory ─────────────────────────────────────────────────────────────────

function createStorage(): StorageProvider {
  if (config.storage.type === 'local') {
    return new LocalStorageProvider(config.storage.uploadDir);
  }
  throw new Error(`Storage type '${config.storage.type}' not yet implemented. Set STORAGE_TYPE=local for development.`);
}

export const storage = createStorage();
