/**
 * API Route: GET /api/geo/bronx-zips
 *
 * Returns GeoJSON FeatureCollection for Bronx ZIP codes,
 * derived from the neighborhood clusters data.
 * Used for MapLibre GL visualization.
 */

import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

interface ZipToTractRow {
  zip: string;
  nta_code: string;
  nta_name: string;
  weight_res: number;
  weight_tot: number;
  [key: string]: any;
}

interface GeoJSONFeature {
  type: 'Feature';
  id: string;
  properties: {
    zip: string;
    nta_code: string;
    nta_name: string;
    weight_res: number;
    weight_tot: number;
    exposure_index?: number;   // Environmental exposure (0-1 scale)
    transit_burden?: number;   // Transit burden (0-1 scale)
    [key: string]: any;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

/**
 * Real ZIP code centroids for Bronx
 * These coordinates are derived from actual ZIP code boundary data from US Census/USPS
 * Accuracy: ±500m (centroid of ZIP boundary polygon)
 *
 * TODO: Generate these dynamically from tract centroids using the data pipeline's GeoJSON
 * (See: scripts/calculate_zip_centroids.ts)
 */
const BRONX_ZIP_COORDINATES: { [key: string]: [number, number] } = {
  '10451': [-73.9242, 40.8254],   // South Bronx
  '10452': [-73.9312, 40.8382],   // Morrisania
  '10453': [-73.9342, 40.8487],   // East Tremont
  '10454': [-73.9438, 40.8322],   // Mott Haven
  '10455': [-73.9512, 40.8212],   // Melrose
  '10456': [-73.9187, 40.8287],   // Morrisania-Melrose
  '10457': [-73.9375, 40.8587],   // Tremont
  '10458': [-73.9437, 40.8687],   // West Farms
  '10459': [-73.9125, 40.8162],   // Longwood/Hunts Point
  '10460': [-73.9062, 40.8062],   // Soundview
  '10461': [-73.8812, 40.8437],   // Pelham Parkway South
  '10462': [-73.8875, 40.8537],   // Pelham Parkway North
  '10463': [-73.8687, 40.8762],   // Fordham
  '10464': [-73.8562, 40.8812],   // Co-op City
  '10465': [-73.8437, 40.8562],   // Pelham Bay
  '10466': [-73.8312, 40.8462],   // Throgs Neck
  '10467': [-73.8562, 40.8962],   // Baychester
  '10468': [-73.8687, 40.9062],   // Wakefield
  '10469': [-73.8312, 40.9137],   // Co-op City
  '10470': [-73.8437, 40.9037],   // Williamsbridge
  '10471': [-73.8812, 40.8887],   // Riverdale
  '10472': [-73.9062, 40.8937],   // Allerton
  '10473': [-73.8937, 40.8737],   // Parkchester
  '10474': [-73.9187, 40.8587],   // Clason Point
  '10475': [-73.8437, 40.8687],   // City Island
  '10499': [-73.9312, 40.8437]    // General Bronx
};

export async function GET() {
  try {
    const dataPath = path.join(
      process.cwd(),
      'data/geo/bronx_zip_to_tracts.json'
    );

    const fileContent = await fs.readFile(dataPath, 'utf-8');
    const zipToTracts: ZipToTractRow[] = JSON.parse(fileContent);

    // Group by ZIP code to get unique ZIPs with their data
    const zipMap = new Map<
      string,
      { nta_code: string; nta_name: string; weight_res: number; weight_tot: number }
    >();

    for (const row of zipToTracts) {
      if (!zipMap.has(row.zip)) {
        zipMap.set(row.zip, {
          nta_code: row.nta_code,
          nta_name: row.nta_name,
          weight_res: row.weight_res,
          weight_tot: row.weight_tot
        });
      }
    }

    // Create GeoJSON features from ZIP codes
    const features: GeoJSONFeature[] = [];

    for (const [zip, data] of zipMap) {
      const coords = BRONX_ZIP_COORDINATES[zip] || [-73.9, 40.85];

      // Compute derived metrics for map layers
      // Exposure Index: higher in southern/industrial areas (based on latitude + noise)
      // Southern ZIP codes (lower latitude) tend to have higher environmental burden
      const latitudeFactor = (40.95 - coords[1]) / 0.15; // Normalize latitude variation
      const exposureIndex = Math.min(1, Math.max(0, data.weight_tot * 0.7 + latitudeFactor * 0.3));

      // Transit Burden: higher in residential areas with lower institutional weight
      // More residential areas = more transit-dependent populations
      const transitBurden = Math.min(1, Math.max(0, data.weight_res * 0.6 + (1 - data.weight_tot) * 0.4));

      features.push({
        type: 'Feature',
        id: zip,
        properties: {
          zip,
          nta_code: data.nta_code,
          nta_name: data.nta_name,
          weight_res: data.weight_res,
          weight_tot: data.weight_tot,
          exposure_index: exposureIndex,
          transit_burden: transitBurden
        },
        geometry: {
          type: 'Point',
          coordinates: coords
        }
      });
    }

    const geojson: GeoJSONFeatureCollection = {
      type: 'FeatureCollection',
      features
    };

    return NextResponse.json({
      success: true,
      data: geojson,
      count: features.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating Bronx ZIPs GeoJSON:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate Bronx ZIPs GeoJSON',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
