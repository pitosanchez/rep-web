#!/usr/bin/env ts-node
/**
 * Phase 2: ZIP-to-Tract Mapping
 *
 * Processes the HUD USPS ZIP-TRACT Crosswalk CSV to create a clean mapping
 * of Bronx ZIP codes to Census tracts with weights.
 *
 * Process:
 * 1. Parse HUD CSV file
 * 2. Filter for Bronx County (FIPS 36005) + 26 Bronx ZIPs
 * 3. Validate data (weights, FIPS codes, GEOIDs)
 * 4. Enrich with tract GEOIDs (ensure 20-digit format)
 * 5. Output: bronx_zip_to_tracts_raw.json
 *
 * Run: ts-node scripts/build_zip_to_tract.ts
 * or:  npm run pipeline (orchestrated)
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import Logger from './utils/logger';
import FileCache from './utils/file-cache';
import Validator from './utils/validator';
import { DEFAULT_CONFIG, CACHED_FILES, OUTPUT_FILES, BRONX_ZIPS } from './config';
import { HudZipTractRow, ZipToTractRow } from './types';

class ZipToTractBuilder {
  private logger: Logger;
  private cache: FileCache;
  private validator: Validator;
  private bronxZips: Set<string>;

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
    this.bronxZips = new Set(BRONX_ZIPS);
  }

  /**
   * Parse HUD CSV with flexible column name handling
   * Different versions may have slightly different column names
   */
  private parseHudCsv(csvContent: string): Partial<HudZipTractRow>[] {
    this.logger.info('Parsing HUD CSV...');

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    this.logger.success(`Parsed ${records.length} rows from HUD data`);
    return records as Partial<HudZipTractRow>[];
  }

  /**
   * Normalize column names (different HUD versions use different names)
   */
  private normalizeRow(row: any): Partial<HudZipTractRow> {
    return {
      zip_code: row.ZIP_CODE || row.zip_code || row.USPS_ZIP_CODE || row.zip,
      county_fips: row.COUNTY_FIPS || row.county_fips || row.COUNTYFP,
      tract: row.TRACT || row.tract || row.CENSUS_TRACT,
      state_fips: row.STATE_FIPS || row.state_fips || row.STATEFP,
      res_ratio: this.parseFloat(row.RES_RATIO || row.res_ratio),
      tot_ratio: this.parseFloat(row.TOT_RATIO || row.tot_ratio)
    };
  }

  /**
   * Safe float parsing
   */
  private parseFloat(value: any): number {
    if (value === null || value === undefined || value === '') return 0;
    const num = parseFloat(String(value));
    return isNaN(num) ? 0 : num;
  }

  /**
   * Create 11-digit Census GEOID from components (tract level)
   * Format: SSCCCTTTTTT
   *   SS = State FIPS (2 digits)
   *   CCC = County FIPS (3 digits)
   *   TTTTTT = Tract code (6 digits)
   *
   * Note: HUD data may have county_fips as "36005" (5 digits: state+county)
   * We extract just the last 3 digits as the actual county code.
   */
  private createGeoid(stateFips: string, countyFips: string, tract: string): string {
    // Ensure state is 2 digits
    let s = String(stateFips).padStart(2, '0');
    // Handle county FIPS: if it's 5 digits (SSCCC), extract last 3; otherwise use as-is
    let c = String(countyFips);
    if (c.length === 5) {
      // County FIPS includes state prefix (e.g., "36005"), extract last 3 digits
      c = c.substring(2);
    }
    c = c.padStart(3, '0');

    // Ensure tract is 6 digits
    let t = String(tract).padStart(6, '0');
    if (t.length > 6) {
      // If it's longer than 6 digits, extract just the last 6
      t = t.substring(t.length - 6);
    }

    return `${s}${c}${t}`;
  }

  /**
   * Filter and validate records for Bronx County
   */
  private filterBronxRecords(records: Partial<HudZipTractRow>[]): HudZipTractRow[] {
    this.logger.info('Filtering for Bronx County (36005)...');

    const validRecords: HudZipTractRow[] = [];
    const invalidRecords: { row: any; reason: string }[] = [];

    for (const record of records) {
      const normalized = this.normalizeRow(record);

      // Check county
      if (normalized.county_fips !== DEFAULT_CONFIG.county_fips) {
        continue; // Skip non-Bronx counties
      }

      // Check ZIP code
      const zip = String(normalized.zip_code || '').trim();
      if (!this.bronxZips.has(zip)) {
        continue; // Not in our list of 26 Bronx ZIPs
      }

      // Validate
      if (!normalized.zip_code || !normalized.county_fips || !normalized.tract) {
        invalidRecords.push({
          row: normalized,
          reason: 'Missing required fields'
        });
        continue;
      }

      // Validate weights
      const resRatio = normalized.res_ratio || 0;
      const totRatio = normalized.tot_ratio || 0;

      if (!this.validator.isValidWeight(resRatio) || !this.validator.isValidWeight(totRatio)) {
        invalidRecords.push({
          row: normalized,
          reason: `Invalid weights: res=${resRatio}, tot=${totRatio}`
        });
        continue;
      }

      // All checks passed
      validRecords.push({
        zip_code: zip,
        county_fips: String(normalized.county_fips),
        tract: String(normalized.tract),
        state_fips: String(normalized.state_fips || DEFAULT_CONFIG.state_fips),
        res_ratio: resRatio,
        tot_ratio: totRatio
      });
    }

    this.logger.success(`Filtered to ${validRecords.length} Bronx records`);
    if (invalidRecords.length > 0) {
      this.logger.warn(`Skipped ${invalidRecords.length} invalid records`);
    }

    return validRecords;
  }

  /**
   * Create output rows with GEOID + validation
   */
  private createOutputRows(hudRecords: HudZipTractRow[]): ZipToTractRow[] {
    this.logger.info('Creating output rows with GEOIDs...');

    const outputRows: ZipToTractRow[] = [];
    const seen = new Set<string>();

    for (const record of hudRecords) {
      // Create 20-digit GEOID
      const tractGeoid = this.createGeoid(
        record.state_fips,
        record.county_fips,
        record.tract
      );

      // Check for duplicates
      const key = `${record.zip_code}-${tractGeoid}`;
      if (seen.has(key)) {
        this.logger.debug(`Skipping duplicate: ${key}`);
        continue;
      }
      seen.add(key);

      // Create output row (NTA assignment happens in Phase 3)
      const outputRow: ZipToTractRow = {
        zip: record.zip_code,
        county_fips: record.county_fips,
        tract_geoid: tractGeoid,
        state_fips: record.state_fips,
        tract: String(record.tract).padStart(6, '0'),
        weight_res: record.res_ratio,
        weight_tot: record.tot_ratio,
        nta_code: 'UNASSIGNED', // Will be filled in Phase 3
        nta_name: ''
      };

      outputRows.push(outputRow);
    }

    this.logger.success(`Created ${outputRows.length} output rows`);
    return outputRows;
  }

  /**
   * Sort for deterministic output
   */
  private sortRows(rows: ZipToTractRow[]): ZipToTractRow[] {
    return rows.sort((a, b) => {
      if (a.zip !== b.zip) return a.zip.localeCompare(b.zip);
      return a.tract_geoid.localeCompare(b.tract_geoid);
    });
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(rows: ZipToTractRow[]): {
    total_rows: number;
    unique_zips: number;
    unique_tracts: number;
    zip_list: string[];
  } {
    const zips = new Set<string>();
    const tracts = new Set<string>();

    for (const row of rows) {
      zips.add(row.zip);
      tracts.add(row.tract_geoid);
    }

    return {
      total_rows: rows.length,
      unique_zips: zips.size,
      unique_tracts: tracts.size,
      zip_list: Array.from(zips).sort()
    };
  }

  /**
   * Run Phase 2: ZIP-to-Tract Mapping
   */
  async run(): Promise<ZipToTractRow[]> {
    this.logger.section('PHASE 2: ZIP-to-Tract Mapping');

    try {
      // Step 1: Load HUD CSV from cache
      this.logger.info('Loading HUD USPS ZIP-TRACT Crosswalk...');
      const csvContent = this.cache.loadText(CACHED_FILES.hud_zip_tract);

      // Step 2: Parse CSV
      const allRecords = this.parseHudCsv(csvContent);

      // Step 3: Filter for Bronx
      const bronxRecords = this.filterBronxRecords(allRecords);

      // Step 4: Create output rows with GEOIDs
      const outputRows = this.createOutputRows(bronxRecords);

      // Step 5: Sort for deterministic output
      const sortedRows = this.sortRows(outputRows);

      // Step 6: Generate summary
      const summary = this.generateSummary(sortedRows);

      // Log summary
      this.logger.success('Phase 2 Summary:');
      console.log(`  Total rows: ${summary.total_rows}`);
      console.log(`  Unique ZIPs: ${summary.unique_zips}/${BRONX_ZIPS.length}`);
      console.log(`  Unique tracts: ${summary.unique_tracts}`);
      console.log(`  ZIP codes: ${summary.zip_list.join(', ')}`);

      // Check for missing ZIPs
      const missingZips = BRONX_ZIPS.filter((zip) => !summary.zip_list.includes(zip));
      if (missingZips.length > 0) {
        this.logger.warn(`Missing ZIPs in HUD data: ${missingZips.join(', ')}`);
      }

      return sortedRows;
    } catch (error) {
      this.logger.error('Phase 2 failed', error as Error);
      throw error;
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const builder = new ZipToTractBuilder();
  builder
    .run()
    .then((rows) => {
      console.log(`\n✓ Phase 2 complete: ${rows.length} ZIP-tract mappings ready`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export { ZipToTractBuilder };
