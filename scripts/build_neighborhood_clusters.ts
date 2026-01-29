#!/usr/bin/env ts-node
/**
 * Phase 4: Build Neighborhood Clusters
 *
 * Groups Census tracts into neighborhood-level clusters based on NYC NTAs.
 *
 * Process:
 * 1. Load ZIP-to-tract mapping (already enriched with NTA from Phase 3)
 * 2. For each unique NTA:
 *    - Collect all tracts with that NTA code
 *    - Reverse-map to all ZIPs that touch those tracts
 *    - Count constituent tracts + ZIPs
 * 3. Output: bronx_neighborhood_clusters.json
 *
 * Run: ts-node scripts/build_neighborhood_clusters.ts
 */

import Logger from './utils/logger';
import { NeighborhoodCluster, ZipToTractRow } from './types';

class NeighborhoodClustering {
  private logger: Logger;

  constructor() {
    this.logger = new Logger({ verbose: true });
  }

  /**
   * Build neighborhood clusters from ZIP-to-tract mapping
   * The ZipToTractRow data already has NTA assignments from Phase 3
   */
  async run(zipToTracts: ZipToTractRow[]): Promise<NeighborhoodCluster[]> {
    this.logger.section('PHASE 4: Neighborhood Clustering');

    this.logger.info('Building neighborhood clusters...');

    // Group by NTA code
    const clusters: Map<string, NeighborhoodCluster> = new Map();

    // Process each ZIP-to-tract row
    for (const row of zipToTracts) {
      // Skip unassigned tracts
      if (row.nta_code === 'UNASSIGNED') {
        continue;
      }

      // Get or create cluster for this NTA
      let cluster = clusters.get(row.nta_code);
      if (!cluster) {
        cluster = {
          nta_code: row.nta_code,
          nta_name: row.nta_name,
          tract_geoids: [],
          zips: [],
          tract_count: 0,
          zip_count: 0
        };
        clusters.set(row.nta_code, cluster);
      }

      // Add tract to cluster (avoid duplicates)
      if (!cluster.tract_geoids.includes(row.tract_geoid)) {
        cluster.tract_geoids.push(row.tract_geoid);
      }

      // Add ZIP to cluster (avoid duplicates)
      if (!cluster.zips.includes(row.zip)) {
        cluster.zips.push(row.zip);
      }
    }

    // Update counts and sort for deterministic output
    const result: NeighborhoodCluster[] = [];
    for (const cluster of clusters.values()) {
      // Sort tract GEOIDs for deterministic output
      cluster.tract_geoids.sort((a, b) => a.localeCompare(b));
      // Sort ZIPs for deterministic output
      cluster.zips.sort((a, b) => a.localeCompare(b));
      // Update counts
      cluster.tract_count = cluster.tract_geoids.length;
      cluster.zip_count = cluster.zips.length;
      result.push(cluster);
    }

    // Sort by NTA code for deterministic output
    result.sort((a, b) => a.nta_code.localeCompare(b.nta_code));

    this.logger.success(`Created ${result.length} neighborhood clusters`);

    // Log summary
    if (result.length > 0) {
      this.logger.info('Neighborhood summary:');
      for (const cluster of result) {
        this.logger.info(
          `  ${cluster.nta_code} (${cluster.nta_name}): ${cluster.tract_count} tracts, ${cluster.zip_count} ZIPs`
        );
      }
    }

    return result;
  }
}

export { NeighborhoodClustering };
