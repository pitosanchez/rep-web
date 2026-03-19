/**
 * Data validation utilities for pipeline quality assurance
 * Validates data at each phase and provides detailed error reporting
 */

import Logger from './logger';
import { ValidationResult, ValidationError, ValidationWarning, ZipToTractRow } from '../types';

export class Validator {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Validate ZIP code format
   */
  isValidZip(zip: string): boolean {
    return /^\d{5}$/.test(zip);
  }

  /**
   * Validate FIPS code format
   */
  isValidFips(fips: string): boolean {
    return /^\d{2,5}$/.test(fips);
  }

  /**
   * Validate GEOID format (20-digit Census tract identifier)
   */
  isValidGeoid(geoid: string): boolean {
    return /^\d{20}$/.test(geoid);
  }

  /**
   * Validate NTA code format
   */
  isValidNtaCode(code: string): boolean {
    return /^[A-Z]{2}\d{2}$/.test(code);
  }

  /**
   * Validate weight value (0-1)
   */
  isValidWeight(weight: any): boolean {
    const num = parseFloat(weight);
    return !isNaN(num) && num >= 0 && num <= 1;
  }

  /**
   * Validate ZIP-to-tract row
   */
  validateZipToTractRow(row: Partial<ZipToTractRow>): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!row.zip || !this.isValidZip(row.zip)) {
      errors.push(`Invalid ZIP: ${row.zip}`);
    }

    if (!row.county_fips || !this.isValidFips(row.county_fips)) {
      errors.push(`Invalid county FIPS: ${row.county_fips}`);
    }

    if (!row.tract_geoid || !this.isValidGeoid(row.tract_geoid)) {
      errors.push(`Invalid GEOID: ${row.tract_geoid}`);
    }

    if (!row.nta_code || !this.isValidNtaCode(row.nta_code) && row.nta_code !== 'UNASSIGNED') {
      // Allow UNASSIGNED as fallback
    }

    if (row.weight_res !== undefined && !this.isValidWeight(row.weight_res)) {
      errors.push(`Invalid weight_res: ${row.weight_res}`);
    }

    if (row.weight_tot !== undefined && !this.isValidWeight(row.weight_tot)) {
      errors.push(`Invalid weight_tot: ${row.weight_tot}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate complete output dataset
   */
  validateZipToTractOutput(
    rows: ZipToTractRow[],
    expectedZips: Set<string>
  ): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const zips = new Set<string>();
    const tracts = new Set<string>();
    const ntas = new Set<string>();
    let duplicateCount = 0;
    let nullWeightCount = 0;
    const seen = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Check for duplicates
      const key = `${row.zip}-${row.tract_geoid}`;
      if (seen.has(key)) {
        duplicateCount++;
        errors.push({
          type: 'duplicate',
          message: `Duplicate ZIP-tract pair`,
          location: `row ${i + 1}`,
          value: key
        });
      }
      seen.add(key);

      // Validate each row
      const validation = this.validateZipToTractRow(row);
      if (!validation.valid) {
        errors.push({
          type: 'invalid_row',
          message: validation.errors.join('; '),
          location: `row ${i + 1}`
        });
      }

      // Check for null weights
      if (row.weight_res === null || row.weight_tot === null) {
        nullWeightCount++;
        warnings.push({
          type: 'null_weight',
          message: `Null weight found`,
          location: `row ${i + 1}`
        });
      }

      // Collect unique values
      zips.add(row.zip);
      tracts.add(row.tract_geoid);
      ntas.add(row.nta_code);
    }

    // Check for missing ZIPs
    for (const expectedZip of expectedZips) {
      if (!zips.has(expectedZip)) {
        warnings.push({
          type: 'missing_zip',
          message: `Expected ZIP not found: ${expectedZip}`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      summary: {
        total_zips: zips.size,
        total_tracts: tracts.size,
        total_ntas: ntas.size,
        duplicate_rows: duplicateCount,
        null_weights: nullWeightCount
      }
    };
  }

  /**
   * Log validation results
   */
  logResults(result: ValidationResult): void {
    if (result.isValid) {
      this.logger.success('Validation passed');
    } else {
      this.logger.warn('Validation failed');
    }

    this.logger.info('Summary:', result.summary);

    if (result.errors.length > 0) {
      this.logger.warn(`${result.errors.length} errors found:`);
      result.errors.slice(0, 5).forEach(err => {
        console.log(`  - ${err.message} ${err.location || ''}`);
      });
      if (result.errors.length > 5) {
        console.log(`  ... and ${result.errors.length - 5} more`);
      }
    }

    if (result.warnings.length > 0) {
      this.logger.warn(`${result.warnings.length} warnings found:`);
      result.warnings.slice(0, 5).forEach(warn => {
        console.log(`  - ${warn.message} ${warn.location || ''}`);
      });
      if (result.warnings.length > 5) {
        console.log(`  ... and ${result.warnings.length - 5} more`);
      }
    }
  }
}

export default Validator;
