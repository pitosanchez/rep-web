#!/usr/bin/env ts-node
/**
 * Phase 3: Spatial Join (Tract → NTA)
 *
 * Maps each Census tract to its corresponding NYC Neighborhood Tabulation Area (NTA)
 * using a centroid-based point-in-polygon test.
 *
 * Implements the following logic:
 * 1. Load Census TIGER tract geometries (Bronx County, FIPS 36005)
 * 2. Load NYC NTA boundaries as GeoJSON
 * 3. For each tract:
 *    - Calculate tract centroid (geographic center)
 *    - Find NTA containing that centroid
 *    - Assign NTA code + name
 * 4. Output: tract_to_nta_mapping.json with assignments
 *
 * Run: ts-node scripts/spatial_join_tract_to_nta.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as turf from '@turf/turf';
import Logger from './utils/logger';
import { TractToNtaMapping, CensusTractFeature, NtaFeature } from './types';
import { DEFAULT_CONFIG, CACHED_FILES } from './config';

class SpatialJoinTractToNta {
  private logger: Logger;

  constructor() {
    this.logger = new Logger({ verbose: true });
  }

  /**
   * Load GeoJSON file from disk
   */
  private loadGeoJSON(filePath: string): any {
    if (!fs.existsSync(filePath)) {
      throw new Error(`GeoJSON file not found: ${filePath}`);
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Calculate centroid of a polygon using @turf/turf
   * @param coordinates GeoJSON polygon coordinates [Ring[[lat,lng]...]]
   * @returns [longitude, latitude] of centroid
   */
  private calculateCentroid(
    coordinates: number[][][]
  ): [number, number] {
    try {
      // Extract the outer ring (first ring in polygon coordinates)
      const ring = coordinates[0];

      // Create a polygon feature for turf
      const polygon = turf.polygon([ring]);

      // Calculate centroid using turf
      const centroid = turf.centroid(polygon);

      // Return [lng, lat]
      return [
        centroid.geometry.coordinates[0],
        centroid.geometry.coordinates[1]
      ];
    } catch (error) {
      this.logger.warn(
        `Failed to calculate centroid: ${error instanceof Error ? error.message : String(error)}`
      );
      // Fallback: return first coordinate if centroid calculation fails
      return [coordinates[0][0][0], coordinates[0][0][1]];
    }
  }

  /**
   * Check if a point is inside a polygon using @turf/turf
   * @param point [lng, lat]
   * @param polygon GeoJSON polygon geometry
   * @returns true if point is inside polygon
   */
  private pointInPolygon(
    point: [number, number],
    polygon: { type: string; coordinates: any }
  ): boolean {
    try {
      // Create a point feature for turf
      const pointFeature = turf.point(point);

      // Check if point is inside polygon
      // For MultiPolygons, we need to check each polygon
      if (polygon.type === 'MultiPolygon') {
        for (const poly of polygon.coordinates) {
          const singlePolyFeature = turf.polygon(poly);
          if (turf.booleanPointInPolygon(pointFeature, singlePolyFeature)) {
            return true;
          }
        }
        return false;
      } else if (polygon.type === 'Polygon') {
        const polyFeature = turf.polygon(polygon.coordinates);
        return turf.booleanPointInPolygon(pointFeature, polyFeature);
      }
      return false;
    } catch (error) {
      this.logger.warn(
        `Point-in-polygon test failed: ${error instanceof Error ? error.message : String(error)}`
      );
      return false;
    }
  }

  /**
   * Extract NTA code and name from NTA feature properties
   * Handle various naming conventions
   */
  private extractNtaInfo(properties: any): {
    code: string;
    name: string;
  } {
    const code =
      properties.NTA_CODE ||
      properties.NTA_code ||
      properties.NTA ||
      properties.nta_code ||
      'UNKNOWN';

    const name =
      properties.NTA_NAME ||
      properties.NTA_name ||
      properties.nta_name ||
      properties.ntaname ||
      'Unknown';

    return { code, name };
  }

  /**
   * Run the spatial join
   */
  async run(): Promise<TractToNtaMapping[]> {
    this.logger.section('PHASE 3: Spatial Join (Tract → NTA)');

    try {
      // Load Census TIGER tract geometries
      this.logger.info('Loading Census TIGER tract geometries...');
      const tractFilePath = path.join(
        DEFAULT_CONFIG.cache_dir,
        CACHED_FILES.census_tiger_geojson
      );
      const tractGeoJSON = this.loadGeoJSON(tractFilePath);

      if (!tractGeoJSON.features || tractGeoJSON.features.length === 0) {
        throw new Error('No tract features found in GeoJSON');
      }
      this.logger.success(
        `Loaded ${tractGeoJSON.features.length} tract features`
      );

      // Load NYC NTA boundaries
      this.logger.info('Loading NYC NTA boundaries...');
      const ntaFilePath = path.join(
        DEFAULT_CONFIG.cache_dir,
        CACHED_FILES.nta_geojson
      );
      const ntaGeoJSON = this.loadGeoJSON(ntaFilePath);

      if (!ntaGeoJSON.features || ntaGeoJSON.features.length === 0) {
        throw new Error('No NTA features found in GeoJSON');
      }
      this.logger.success(`Loaded ${ntaGeoJSON.features.length} NTA features`);

      // Perform spatial join
      this.logger.info('Performing spatial join (centroid-based)...');
      const results: TractToNtaMapping[] = [];
      let assignedCount = 0;
      let unassignedCount = 0;

      for (const tractFeature of tractGeoJSON.features) {
        const tractGeoid = tractFeature.properties.GEOID || 'UNKNOWN';

        // Skip non-Bronx tracts
        if (!tractGeoid.startsWith('36005')) {
          continue;
        }

        // Calculate tract centroid
        let tractCentroid: [number, number];
        if (
          tractFeature.geometry.type === 'Polygon' &&
          tractFeature.geometry.coordinates
        ) {
          tractCentroid = this.calculateCentroid(
            tractFeature.geometry.coordinates
          );
        } else if (
          tractFeature.geometry.type === 'MultiPolygon' &&
          tractFeature.geometry.coordinates
        ) {
          // Use centroid of first polygon in MultiPolygon
          tractCentroid = this.calculateCentroid(
            tractFeature.geometry.coordinates[0]
          );
        } else {
          this.logger.warn(
            `Unsupported geometry type for tract ${tractGeoid}`
          );
          results.push({
            tract_geoid: tractGeoid,
            nta_code: 'UNASSIGNED',
            nta_name: '',
            spatial_join_method: 'centroid',
            confidence: 'low'
          });
          unassignedCount++;
          continue;
        }

        // Find NTA containing this centroid
        let assigned = false;
        for (const ntaFeature of ntaGeoJSON.features) {
          if (this.pointInPolygon(tractCentroid, ntaFeature.geometry)) {
            const { code, name } = this.extractNtaInfo(ntaFeature.properties);
            results.push({
              tract_geoid: tractGeoid,
              nta_code: code,
              nta_name: name,
              spatial_join_method: 'centroid',
              confidence: 'high'
            });
            assignedCount++;
            assigned = true;
            break;
          }
        }

        // If not assigned, add with UNASSIGNED status
        if (!assigned) {
          results.push({
            tract_geoid: tractGeoid,
            nta_code: 'UNASSIGNED',
            nta_name: '',
            spatial_join_method: 'centroid',
            confidence: 'low'
          });
          unassignedCount++;
        }
      }

      // Sort results deterministically
      results.sort((a, b) => a.tract_geoid.localeCompare(b.tract_geoid));

      this.logger.success(
        `Spatial join complete: ${assignedCount} assigned, ${unassignedCount} unassigned`
      );
      this.logger.info(`Total tracts processed: ${results.length}`);

      // Summary by NTA
      const ntaCounts: { [key: string]: number } = {};
      for (const result of results) {
        if (result.nta_code !== 'UNASSIGNED') {
          ntaCounts[result.nta_code] = (ntaCounts[result.nta_code] || 0) + 1;
        }
      }

      if (Object.keys(ntaCounts).length > 0) {
        this.logger.info('Tracts by NTA:');
        for (const [nta, count] of Object.entries(ntaCounts)) {
          this.logger.info(`  ${nta}: ${count} tracts`);
        }
      }

      return results;
    } catch (error) {
      this.logger.error(
        'Phase 3 failed',
        error instanceof Error ? error : new Error(String(error))
      );
      throw error;
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const spatialJoin = new SpatialJoinTractToNta();
  spatialJoin.run().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { SpatialJoinTractToNta };
