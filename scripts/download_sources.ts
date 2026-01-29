#!/usr/bin/env ts-node
/**
 * Phase 1: Download & Cache Data Sources
 *
 * Downloads the three required data sources:
 * 1. HUD USPS ZIP-TRACT Crosswalk (CSV)
 * 2. US Census TIGER Tracts for NY (Shapefile ZIP)
 * 3. NYC NTA Boundaries (GeoJSON)
 *
 * Sources are cached locally to avoid repeated downloads.
 * Run: ts-node scripts/download_sources.ts
 */

import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import Logger from './utils/logger';
import FileCache from './utils/file-cache';
import { DEFAULT_CONFIG, CACHED_FILES } from './config';

class SourceDownloader {
  private logger: Logger;
  private cache: FileCache;

  constructor() {
    this.logger = new Logger({ verbose: true });
    this.cache = new FileCache(
      {
        cacheDir: DEFAULT_CONFIG.cache_dir,
        useCache: DEFAULT_CONFIG.use_cache,
        maxAgeDays: DEFAULT_CONFIG.cache_max_age_days
      },
      this.logger
    );
  }

  /**
   * Download a file from URL
   */
  private async downloadFile(url: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.logger.info(`Downloading: ${url.split('/').pop()}`);

      const protocol = url.startsWith('https') ? https : http;
      const request = protocol.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          if (redirectUrl) {
            this.downloadFile(redirectUrl).then(resolve).catch(reject);
            return;
          }
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }

        const chunks: Buffer[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      });

      request.setTimeout(60000); // 60 second timeout
      request.on('error', reject);
    });
  }

  /**
   * Download HUD USPS ZIP-TRACT Crosswalk
   */
  async downloadHudCrosswalk(): Promise<Buffer> {
    const filename = CACHED_FILES.hud_zip_tract;

    if (this.cache.isFresh(filename)) {
      this.logger.success(`Using cached: ${filename}`);
      return this.cache.load(filename);
    }

    this.logger.info('Downloading HUD USPS ZIP-TRACT Crosswalk...');
    try {
      const data = await this.downloadFile(DEFAULT_CONFIG.sources.hud_url);
      this.cache.save(filename, data);
      return data;
    } catch (error) {
      this.logger.error('Failed to download HUD crosswalk', error as Error);

      // Try alternative source if available
      const alternativeUrl =
        'https://www.huduser.gov/portal/datasets/lihtc/zip_to_zcta_2021.csv';
      this.logger.info('Trying alternative source...');

      try {
        const data = await this.downloadFile(alternativeUrl);
        this.cache.save(filename, data);
        return data;
      } catch (altError) {
        throw new Error(
          `Could not download HUD data from either source: ${error} / ${altError}`
        );
      }
    }
  }

  /**
   * Download US Census TIGER Tracts for New York
   */
  async downloadCensusTiger(): Promise<Buffer> {
    const filename = CACHED_FILES.census_tiger;

    if (this.cache.isFresh(filename)) {
      this.logger.success(`Using cached: ${filename}`);
      return this.cache.load(filename);
    }

    this.logger.info('Downloading Census TIGER/Line Tracts (NY)...');
    try {
      const data = await this.downloadFile(DEFAULT_CONFIG.sources.census_tiger_url);
      this.cache.save(filename, data);
      return data;
    } catch (error) {
      this.logger.error('Failed to download Census TIGER data', error as Error);
      throw new Error(`Could not download Census TIGER data: ${error}`);
    }
  }

  /**
   * Download NYC NTA Boundaries
   */
  async downloadNtaBoundaries(): Promise<Buffer> {
    const filename = CACHED_FILES.nta_geojson;

    if (this.cache.isFresh(filename)) {
      this.logger.success(`Using cached: ${filename}`);
      return this.cache.load(filename);
    }

    this.logger.info('Downloading NYC Neighborhood Tabulation Areas (NTA)...');
    try {
      const data = await this.downloadFile(DEFAULT_CONFIG.sources.nta_url);
      this.cache.save(filename, data);
      return data;
    } catch (error) {
      this.logger.error('Failed to download NTA boundaries', error as Error);

      // NTA data is critical; don't have a fallback
      throw new Error(`Could not download NTA boundaries: ${error}`);
    }
  }

  /**
   * Run the complete download phase
   */
  async run(failOnError: boolean = false): Promise<void> {
    this.logger.section('PHASE 1: Download & Cache Sources');

    try {
      // Download all three sources (with error handling)
      try {
        await this.downloadHudCrosswalk();
      } catch (error) {
        this.logger.warn('HUD download failed, proceeding if cache exists');
        if (failOnError) throw error;
      }

      try {
        await this.downloadCensusTiger();
      } catch (error) {
        this.logger.warn('Census TIGER download failed, proceeding if cache exists');
        if (failOnError) throw error;
      }

      try {
        await this.downloadNtaBoundaries();
      } catch (error) {
        this.logger.warn('NTA download failed, proceeding if cache exists');
        if (failOnError) throw error;
      }

      this.logger.section('All sources downloaded successfully!');

      // List cached files
      const cached = this.cache.list();
      this.logger.success(`Cache contains ${cached.length} files:`);
      cached.forEach((file) => {
        const info = this.cache.info(file);
        if (info) {
          const ageDays = (info.age / (24 * 60 * 60 * 1000)).toFixed(1);
          const sizeMb = (info.size / (1024 * 1024)).toFixed(2);
          console.log(`  - ${file} (${sizeMb} MB, ${ageDays} days old)`);
        }
      });
    } catch (error) {
      this.logger.error('Phase 1 failed', error as Error);
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const downloader = new SourceDownloader();
  downloader.run().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { SourceDownloader };
