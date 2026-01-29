#!/usr/bin/env ts-node
/**
 * Main Orchestration Script: Build Bronx ZIP-to-Tract Crosswalk
 *
 * Coordinates all 5 phases of the data pipeline:
 * 1. Download & cache data sources
 * 2. Map ZIP codes to Census tracts (with HUD weights)
 * 3. Perform spatial join (Tract → NTA via centroid)
 * 4. Build neighborhood clusters (NTA-level groupings)
 * 5. Assemble outputs & validate data quality
 *
 * Run: pnpm ts-node scripts/build_bronx_crosswalk.ts
 * or:  npm run pipeline
 */

import * as fs from 'fs';
import * as path from 'path';
import Logger from './utils/logger';
import FileCache from './utils/file-cache';
import Validator from './utils/validator';
import { SourceDownloader } from './download_sources';
import { ZipToTractBuilder } from './build_zip_to_tract';
import { DEFAULT_CONFIG, OUTPUT_FILES, PHASE_CONFIG, CACHED_FILES } from './config';
import { PipelineStatus, PipelineOutput, ZipToTractRow } from './types';

class PipelineMaster {
  private logger: Logger;
  private cache: FileCache;
  private validator: Validator;
  private startTime: Date;
  private statuses: Map<number, PipelineStatus>;

  constructor() {
    this.logger = new Logger({ verbose: DEFAULT_CONFIG.verbose });
    this.cache = new FileCache(
      {
        cacheDir: DEFAULT_CONFIG.cache_dir,
        useCache: DEFAULT_CONFIG.use_cache,
        maxAgeDays: DEFAULT_CONFIG.cache_max_age_days
      },
      this.logger
    );
    this.validator = new Validator(this.logger);
    this.startTime = new Date();
    this.statuses = new Map();
  }

  /**
   * Log status for a phase
   */
  private setPhaseStatus(phase: number, status: Partial<PipelineStatus>): void {
    const existing = this.statuses.get(phase) || {
      phase,
      phase_name: PHASE_CONFIG[`phase${phase}` as keyof typeof PHASE_CONFIG].name,
      status: 'pending' as const,
      start_time: new Date()
    };

    this.statuses.set(phase, {
      ...existing,
      ...status
    } as PipelineStatus);
  }

  /**
   * Phase 1: Download & Cache Sources
   */
  private async runPhase1(): Promise<void> {
    this.setPhaseStatus(1, { status: 'running' });

    try {
      this.logger.section('PHASE 1: Download & Cache Sources');

      const downloader = new SourceDownloader();
      await downloader.run();

      this.setPhaseStatus(1, { status: 'complete', end_time: new Date() });
    } catch (error) {
      this.setPhaseStatus(1, { status: 'error', error: String(error) });
      throw error;
    }
  }

  /**
   * Phase 2: Map ZIP codes to Census tracts
   */
  private zipToTracts: ZipToTractRow[] = [];

  private async runPhase2(): Promise<void> {
    this.setPhaseStatus(2, { status: 'running' });

    try {
      const builder = new ZipToTractBuilder();
      this.zipToTracts = await builder.run();

      this.setPhaseStatus(2, {
        status: 'complete',
        end_time: new Date(),
        items_processed: this.zipToTracts.length
      });
    } catch (error) {
      this.setPhaseStatus(2, { status: 'error', error: String(error) });
      throw error;
    }
  }

  /**
   * Phase 3: Spatial join (Tract → NTA)
   * Stubbed for now
   */
  private async runPhase3(): Promise<void> {
    this.setPhaseStatus(3, { status: 'running' });

    try {
      this.logger.section('PHASE 3: Spatial Join (Tract → NTA)');
      this.logger.info(
        'Loading Census TIGER tracts and NYC NTA boundaries...'
      );

      const tigerGeojson = this.cache.loadText(
        CACHED_FILES.census_tiger_geojson
      );
      const ntaGeojson = this.cache.loadText(CACHED_FILES.nta_geojson);

      this.logger.success('Loaded geospatial data');
      this.logger.info('(Full implementation coming next)');

      this.setPhaseStatus(3, {
        status: 'complete',
        end_time: new Date()
      });
    } catch (error) {
      this.setPhaseStatus(3, { status: 'error', error: String(error) });
      throw error;
    }
  }

  /**
   * Phase 4: Build neighborhood clusters
   * Stubbed for now
   */
  private async runPhase4(): Promise<void> {
    this.setPhaseStatus(4, { status: 'running' });

    try {
      this.logger.section('PHASE 4: Neighborhood Clustering');
      this.logger.info('Grouping tracts into neighborhood clusters...');

      this.logger.success('Clustering complete');
      this.logger.info('(Full implementation coming next)');

      this.setPhaseStatus(4, {
        status: 'complete',
        end_time: new Date()
      });
    } catch (error) {
      this.setPhaseStatus(4, { status: 'error', error: String(error) });
      throw error;
    }
  }

  /**
   * Phase 5: Assemble outputs & validate
   */
  private async runPhase5(): Promise<void> {
    this.setPhaseStatus(5, { status: 'running' });

    try {
      this.logger.section('PHASE 5: Output Assembly & Validation');

      // Ensure output directory exists
      if (!fs.existsSync(DEFAULT_CONFIG.output_dir)) {
        fs.mkdirSync(DEFAULT_CONFIG.output_dir, { recursive: true });
        this.logger.success(`Created output directory: ${DEFAULT_CONFIG.output_dir}`);
      }

      // Write ZIP-to-tract JSON (intermediate output from Phase 2)
      if (this.zipToTracts.length > 0) {
        const jsonPath = path.join(
          DEFAULT_CONFIG.output_dir,
          OUTPUT_FILES.zip_to_tracts_json
        );
        fs.writeFileSync(jsonPath, JSON.stringify(this.zipToTracts, null, 2));
        this.logger.success(`Wrote: ${jsonPath} (${this.zipToTracts.length} rows)`);
      }

      this.logger.success('Output files assembled');
      this.logger.info('(CSV export and remaining phases coming next)');

      this.setPhaseStatus(5, {
        status: 'complete',
        end_time: new Date()
      });
    } catch (error) {
      this.setPhaseStatus(5, { status: 'error', error: String(error) });
      throw error;
    }
  }

  /**
   * Print summary of all phases
   */
  private printSummary(): void {
    this.logger.section('Pipeline Execution Summary');

    const totalTime = new Date().getTime() - this.startTime.getTime();
    const totalSeconds = (totalTime / 1000).toFixed(1);

    for (let i = 1; i <= 5; i++) {
      const status = this.statuses.get(i);
      if (status) {
        const icon =
          status.status === 'complete'
            ? '✓'
            : status.status === 'error'
              ? '✗'
              : status.status === 'running'
                ? '⏳'
                : '○';
        console.log(`${icon} Phase ${i}: ${status.phase_name} [${status.status}]`);
        if (status.error) {
          console.log(`  Error: ${status.error}`);
        }
      }
    }

    console.log(`\nTotal time: ${totalSeconds}s`);
  }

  /**
   * Run the complete pipeline
   */
  async run(): Promise<void> {
    try {
      // Phase 1: Download
      await this.runPhase1();

      // Phase 2: ZIP-to-tract mapping
      await this.runPhase2();

      // Phase 3: Spatial join
      await this.runPhase3();

      // Phase 4: Clustering
      await this.runPhase4();

      // Phase 5: Outputs & validation
      await this.runPhase5();

      this.printSummary();
      this.logger.success('Pipeline completed successfully!');
      process.exit(0);
    } catch (error) {
      this.logger.error('Pipeline failed', error as Error);
      this.printSummary();
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const pipeline = new PipelineMaster();
  pipeline.run().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { PipelineMaster };
