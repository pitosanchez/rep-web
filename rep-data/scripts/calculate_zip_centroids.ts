/**
 * Calculate ZIP code centroids from tract geometries
 *
 * This script:
 * 1. Loads the Census TIGER tract GeoJSON
 * 2. Groups tracts by ZIP code (from ZIP-to-tract mapping)
 * 3. Calculates weighted centroid for each ZIP
 * 4. Outputs centroids as JSON for use in the API
 *
 * Run: ts-node scripts/calculate_zip_centroids.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as turf from '@turf/turf';

interface ZipToTractRow {
  zip: string;
  tract_geoid: string;
  weight_tot: number;
  [key: string]: any;
}

interface ZipCentroid {
  zip: string;
  longitude: number;
  latitude: number;
  tractCount: number;
}

async function calculateZipCentroids() {
  try {
    console.log('Calculating ZIP code centroids from tract geometries...\n');

    // Load ZIP-to-tract mapping
    const zipToTractPath = path.join(
      process.cwd(),
      'data/geo/bronx_zip_to_tracts.json'
    );
    const zipToTractContent = fs.readFileSync(zipToTractPath, 'utf-8');
    const zipToTracts: ZipToTractRow[] = JSON.parse(zipToTractContent);

    // Load tract GeoJSON
    const tractGeojsonPath = path.join(
      process.cwd(),
      '.cache/census_tiger_bronx.geojson'
    );

    if (!fs.existsSync(tractGeojsonPath)) {
      console.log('⚠️  Tract GeoJSON not found at:', tractGeojsonPath);
      console.log('This file is created by the data pipeline (Phase 1).');
      console.log('Using mock centroids for now.\n');
      return;
    }

    const tractGeojsonContent = fs.readFileSync(tractGeojsonPath, 'utf-8');
    const tractGeojson = JSON.parse(tractGeojsonContent);

    // Create a map of tract GEOID to geometry
    const tractGeometries: { [geoid: string]: any } = {};
    for (const feature of tractGeojson.features) {
      const geoid = feature.properties?.GEOID || feature.properties?.geoid;
      if (geoid) {
        tractGeometries[geoid] = feature.geometry;
      }
    }

    console.log(`Loaded ${Object.keys(tractGeometries).length} tract geometries\n`);

    // Group tracts by ZIP and calculate weighted centroids
    const zipCentroids: { [zip: string]: ZipCentroid } = {};

    for (const row of zipToTracts) {
      if (!zipCentroids[row.zip]) {
        zipCentroids[row.zip] = {
          zip: row.zip,
          longitude: 0,
          latitude: 0,
          tractCount: 0
        };
      }

      const geometry = tractGeometries[row.tract_geoid];
      if (geometry) {
        try {
          // Create feature to calculate centroid
          const feature = turf.feature(geometry, { geoid: row.tract_geoid });
          const centroid = turf.centroid(feature);
          const [lng, lat] = centroid.geometry.coordinates;

          // Weight by the tract's total weight
          const weight = row.weight_tot || 1;
          zipCentroids[row.zip].longitude += lng * weight;
          zipCentroids[row.zip].latitude += lat * weight;
          zipCentroids[row.zip].tractCount++;
        } catch (err) {
          console.warn(`Failed to calculate centroid for tract ${row.tract_geoid}`);
        }
      }
    }

    // Normalize weighted sums
    const results: ZipCentroid[] = [];
    for (const zip in zipCentroids) {
      const centroid = zipCentroids[zip];
      if (centroid.tractCount > 0) {
        centroid.longitude = centroid.longitude / centroid.tractCount;
        centroid.latitude = centroid.latitude / centroid.tractCount;
        results.push(centroid);
      }
    }

    results.sort((a, b) => a.zip.localeCompare(b.zip));

    console.log(`✓ Calculated ${results.length} ZIP code centroids\n`);
    console.log('Sample centroids:');
    results.slice(0, 5).forEach(c => {
      console.log(`  ${c.zip}: [${c.longitude.toFixed(4)}, ${c.latitude.toFixed(4)}]`);
    });

    // Output as JSON
    const outputPath = path.join(process.cwd(), 'data/geo/zip_centroids.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n✓ Saved to: ${outputPath}`);

    // Also output as TypeScript object for embedding in API
    console.log('\nTo use in API, add this to bronx-zips/route.ts:');
    console.log('const ZIP_CENTROIDS: { [key: string]: [number, number] } = {');
    results.slice(0, 10).forEach(c => {
      console.log(`  '${c.zip}': [${c.longitude.toFixed(4)}, ${c.latitude.toFixed(4)}],`);
    });
    console.log('  // ... more ZIP codes');
    console.log('};');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

calculateZipCentroids();
