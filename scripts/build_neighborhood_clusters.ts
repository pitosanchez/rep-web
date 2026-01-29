#!/usr/bin/env ts-node
/**
 * Phase 4: Build Neighborhood Clusters
 *
 * Groups Census tracts into neighborhood-level clusters based on NYC NTAs.
 *
 * Process:
 * 1. Load tract-to-NTA mapping from Phase 3
 * 2. Load ZIP-to-tract mapping from Phase 2
 * 3. For each unique NTA:
 *    - Collect all tracts with that NTA code
 *    - Reverse-map to all ZIPs that touch those tracts
 *    - Count constituent tracts + ZIPs
 * 4. Output: bronx_neighborhood_clusters.json
 *
 * Run: ts-node scripts/build_neighborhood_clusters.ts
 */

import Logger from './utils/logger';
import { NeighborhoodCluster, ZipToTractRow, TractToNtaMapping } from './types';

class NeighborhoodClustering {
  private logger: Logger;

  constructor() {
    this.logger = new Logger({ verbose: true });
  }

  /**
   * Build neighborhood clusters from tract and ZIP mappings
   */
  async run(
    zipToTracts: ZipToTractRow[],
    tractToNta: TractToNtaMapping[]
  ): Promise<NeighborhoodCluster[]> {
    this.logger.section('PHASE 4: Neighborhood Clustering');

    this.logger.info('Building neighborhood clusters...');

    const clusters: Map<string, NeighborhoodCluster> = new Map();

    // TODO: For each unique NTA, collect constituent tracts and ZIPs

    const result = Array.from(clusters.values());
    this.logger.success(`Created ${result.length} neighborhood clusters`);

    return result;
  }
}

export { NeighborhoodClustering };
