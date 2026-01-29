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
import { stringify } from 'csv-stringify/sync';
import Logger from './utils/logger';
import FileCache from './utils/file-cache';
import Validator from './utils/validator';
import { SourceDownloader } from './download_sources';
import { ZipToTractBuilder } from './build_zip_to_tract';
import { SpatialJoinTractToNta } from './spatial_join_tract_to_nta';
import { NeighborhoodClustering } from './build_neighborhood_clusters';
import { DEFAULT_CONFIG, OUTPUT_FILES, PHASE_CONFIG, CACHED_FILES, BRONX_ZIPS } from './config';
import { PipelineStatus, PipelineOutput, ZipToTractRow, TractToNtaMapping, NeighborhoodCluster } from './types';

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
   */
  private tractToNta: TractToNtaMapping[] = [];

  private async runPhase3(): Promise<void> {
    this.setPhaseStatus(3, { status: 'running' });

    try {
      const spatialJoin = new SpatialJoinTractToNta();
      this.tractToNta = await spatialJoin.run();

      // Merge NTA assignments into ZIP-to-tract mapping
      this.mergeNtaIntoZipToTracts();

      this.setPhaseStatus(3, {
        status: 'complete',
        end_time: new Date(),
        items_processed: this.tractToNta.length
      });
    } catch (error) {
      this.setPhaseStatus(3, { status: 'error', error: String(error) });
      throw error;
    }
  }

  /**
   * Merge NTA assignments from Phase 3 into ZIP-to-tract data from Phase 2
   */
  private mergeNtaIntoZipToTracts(): void {
    // Create a map for fast lookup
    const tractToNtaMap = new Map<string, TractToNtaMapping>();
    for (const mapping of this.tractToNta) {
      tractToNtaMap.set(mapping.tract_geoid, mapping);
    }

    // Update each ZIP-to-tract row with NTA information
    for (const row of this.zipToTracts) {
      const mapping = tractToNtaMap.get(row.tract_geoid);
      if (mapping) {
        row.nta_code = mapping.nta_code;
        row.nta_name = mapping.nta_name;
      } else {
        row.nta_code = 'UNASSIGNED';
        row.nta_name = '';
      }
    }

    this.logger.success(
      `Merged NTA assignments: ${this.zipToTracts.filter((r) => r.nta_code !== 'UNASSIGNED').length} rows with NTA codes`
    );
  }

  /**
   * Phase 4: Build neighborhood clusters
   */
  private neighborhoodClusters: NeighborhoodCluster[] = [];

  private async runPhase4(): Promise<void> {
    this.setPhaseStatus(4, { status: 'running' });

    try {
      const clustering = new NeighborhoodClustering();
      this.neighborhoodClusters = await clustering.run(this.zipToTracts);

      this.setPhaseStatus(4, {
        status: 'complete',
        end_time: new Date(),
        items_processed: this.neighborhoodClusters.length
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

      // 1. Write ZIP-to-tract JSON (main output)
      this.logger.info('Writing ZIP-to-tract JSON...');
      if (this.zipToTracts.length > 0) {
        const jsonPath = path.join(
          DEFAULT_CONFIG.output_dir,
          OUTPUT_FILES.zip_to_tracts_json
        );
        fs.writeFileSync(jsonPath, JSON.stringify(this.zipToTracts, null, 2));
        this.logger.success(`Wrote: ${jsonPath} (${this.zipToTracts.length} rows)`);
      }

      // 2. Write ZIP-to-tract CSV
      this.logger.info('Writing ZIP-to-tract CSV...');
      if (this.zipToTracts.length > 0) {
        const csvPath = path.join(
          DEFAULT_CONFIG.output_dir,
          OUTPUT_FILES.zip_to_tracts_csv
        );
        const csv = stringify(this.zipToTracts, {
          header: true,
          columns: [
            'zip',
            'county_fips',
            'state_fips',
            'tract_geoid',
            'tract',
            'weight_res',
            'weight_tot',
            'nta_code',
            'nta_name'
          ]
        });
        fs.writeFileSync(csvPath, csv);
        this.logger.success(`Wrote: ${csvPath} (${this.zipToTracts.length} rows)`);
      }

      // 3. Write neighborhood clusters JSON
      this.logger.info('Writing neighborhood clusters JSON...');
      if (this.neighborhoodClusters.length > 0) {
        const clustersPath = path.join(
          DEFAULT_CONFIG.output_dir,
          OUTPUT_FILES.neighborhood_clusters_json
        );
        fs.writeFileSync(
          clustersPath,
          JSON.stringify(this.neighborhoodClusters, null, 2)
        );
        this.logger.success(
          `Wrote: ${clustersPath} (${this.neighborhoodClusters.length} clusters)`
        );
      }

      // 4. Validate data quality
      this.logger.info('Validating data quality...');
      const expectedZips = new Set(BRONX_ZIPS);
      const validationResult = this.validator.validateZipToTractOutput(
        this.zipToTracts,
        expectedZips
      );

      if (validationResult.isValid) {
        this.logger.success('Data validation passed!');
      } else {
        this.logger.warn(`Data validation found issues`);
      }

      // 5. Write validation report
      this.logger.info('Writing validation report...');
      const reportPath = path.join(
        DEFAULT_CONFIG.output_dir,
        OUTPUT_FILES.validation_report
      );
      fs.writeFileSync(reportPath, JSON.stringify(validationResult, null, 2));
      this.logger.success(
        `Wrote: ${reportPath} (${validationResult.errors.length} errors, ${validationResult.warnings.length} warnings)`
      );

      this.logger.success('Output files assembled and validated');

      this.setPhaseStatus(5, {
        status: 'complete',
        end_time: new Date(),
        items_processed: this.zipToTracts.length
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
