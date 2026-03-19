/**
 * File caching utility for data source management
 * Handles downloading, caching, and validating source files
 */

import * as fs from 'fs';
import * as path from 'path';
import Logger from './logger';

export interface CacheConfig {
  cacheDir: string;
  maxAgeDays?: number;
  useCache?: boolean;
}

export class FileCache {
  private cacheDir: string;
  private maxAgeMs: number;
  private useCache: boolean;
  private logger: Logger;

  constructor(config: CacheConfig, logger: Logger) {
    this.cacheDir = config.cacheDir;
    this.maxAgeMs = (config.maxAgeDays || 30) * 24 * 60 * 60 * 1000;
    this.useCache = config.useCache !== false;
    this.logger = logger;

    // Ensure cache directory exists
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
      this.logger.success(`Created cache directory: ${this.cacheDir}`);
    }
  }

  /**
   * Get local cache path for a file
   */
  getPath(filename: string): string {
    return path.join(this.cacheDir, filename);
  }

  /**
   * Check if cached file exists and is fresh
   */
  isFresh(filename: string): boolean {
    if (!this.useCache) return false;

    const filePath = this.getPath(filename);
    if (!fs.existsSync(filePath)) {
      return false;
    }

    const stat = fs.statSync(filePath);
    const ageMs = new Date().getTime() - stat.mtime.getTime();
    const isFresh = ageMs < this.maxAgeMs;

    if (isFresh) {
      const ageDays = (ageMs / (24 * 60 * 60 * 1000)).toFixed(1);
      this.logger.debug(`Cache hit: ${filename} (${ageDays} days old)`);
    }

    return isFresh;
  }

  /**
   * Save content to cache
   */
  save(filename: string, content: string | Buffer): void {
    const filePath = this.getPath(filename);
    fs.writeFileSync(filePath, content);
    const sizeKb = (content.length / 1024).toFixed(1);
    this.logger.success(`Cached: ${filename} (${sizeKb} KB)`);
  }

  /**
   * Load content from cache
   */
  load(filename: string): Buffer {
    const filePath = this.getPath(filename);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Cache file not found: ${filename}`);
    }
    return fs.readFileSync(filePath);
  }

  /**
   * Load as text
   */
  loadText(filename: string): string {
    return this.load(filename).toString('utf-8');
  }

  /**
   * List all cached files
   */
  list(): string[] {
    if (!fs.existsSync(this.cacheDir)) {
      return [];
    }
    return fs.readdirSync(this.cacheDir);
  }

  /**
   * Clear cache
   */
  clear(): void {
    if (fs.existsSync(this.cacheDir)) {
      fs.rmSync(this.cacheDir, { recursive: true });
      this.logger.success('Cache cleared');
    }
  }

  /**
   * Get file info
   */
  info(filename: string): { exists: boolean; size: number; age: number } | null {
    const filePath = this.getPath(filename);
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const stat = fs.statSync(filePath);
    return {
      exists: true,
      size: stat.size,
      age: new Date().getTime() - stat.mtime.getTime()
    };
  }
}

export default FileCache;
