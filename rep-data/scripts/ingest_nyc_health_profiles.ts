/**
 * ingest_nyc_health_profiles.ts
 *
 * Part 10: Data Strategy — NYC Community Health Profiles Ingestion
 *
 * Fetches Bronx-area neighborhood health indicator data from three NYC open data sources:
 *   1. NYC Community Health Profiles (DOHMH) — neighborhood-level health indicators
 *   2. NYC Environment & Health Data Portal (EH Portal) — environmental burden by ZIP
 *   3. NYC Community Air Survey (NYCCAS) — NO2, PM2.5, SO2 by community district
 *
 * Output: data/health/nyc_health_profiles_bronx.json
 *         data/health/nyc_eh_portal_bronx.json
 *         data/health/nyc_air_survey_bronx.json
 *
 * Usage:
 *   npx ts-node -P tsconfig.scripts.json scripts/ingest_nyc_health_profiles.ts
 *   npx ts-node -P tsconfig.scripts.json scripts/ingest_nyc_health_profiles.ts --dry-run
 */

import { promises as fs } from 'fs';
import path from 'path';
import { BRONX_ZIPS } from './config';

const DRY_RUN = process.argv.includes('--dry-run');
const OUTPUT_DIR = path.join(process.cwd(), 'data', 'health');

// ── NYC Open Data endpoints ───────────────────────────────────────────────────

/**
 * NYC Community Health Profiles — 2018 neighborhood-level indicators.
 * Dataset: https://data.cityofnewyork.us/Health/Community-Health-Profiles-2018/v5j8-i8n8
 * Contains: CKD prevalence proxy, hypertension, diabetes, poverty, uninsured rates.
 */
const COMMUNITY_HEALTH_URL =
  'https://data.cityofnewyork.us/resource/v5j8-i8n8.json?$limit=500&$where=borough=%27Bronx%27';

/**
 * NYC Environment & Health Data Portal — ZIP-level environmental burden.
 * Dataset: https://a816-dohbesp.nyc.gov/IndicatorPublic/beta/data-explorer/
 * We use the Socrata export for air quality and heat vulnerability by ZIP.
 */
const EH_PORTAL_URL =
  'https://data.cityofnewyork.us/resource/qrh3-s9pm.json?$limit=500&$where=geo_type_name=%27ZIP%20Code%27';

/**
 * NYC Community Air Survey (NYCCAS) — annual average pollutant concentrations.
 * Dataset: https://data.cityofnewyork.us/Environment/NYCCAS-Air-Pollution-Rasters/q68s-8qxv
 * Socrata table: https://data.cityofnewyork.us/resource/fn2b-yqm2.json
 */
const NYCCAS_URL =
  'https://data.cityofnewyork.us/resource/fn2b-yqm2.json?$limit=500&borough=Bronx';

// ── Bronx community district → ZIP mapping ────────────────────────────────────
// Used to cross-reference NYCCAS community district data with ZIP codes.
const CD_TO_ZIPS: Record<string, string[]> = {
  '201': ['10451', '10452', '10456'],  // CD 1 — Mott Haven, Melrose
  '202': ['10453', '10457', '10458'],  // CD 2 — Hunts Point, Longwood
  '203': ['10454', '10455', '10459'],  // CD 3 — Morrisania, Crotona, Tremont
  '204': ['10460', '10462', '10473'],  // CD 4 — Highbridge, Concourse
  '205': ['10463', '10468', '10471'],  // CD 5 — University Heights, Morris Heights
  '206': ['10461', '10462', '10464'],  // CD 6 — East Tremont, West Farms
  '207': ['10466', '10467', '10469'],  // CD 7 — Fordham, University Heights
  '208': ['10458', '10467', '10468'],  // CD 8 — Riverdale, Fieldston
  '209': ['10465', '10473', '10474'],  // CD 9 — Soundview, Parkchester
  '210': ['10466', '10469', '10470'],  // CD 10 — Throgs Neck, Co-op City
  '211': ['10460', '10461', '10475'],  // CD 11 — Pelham Bay, City Island
  '212': ['10466', '10469', '10472'],  // CD 12 — Williamsbridge, Woodlawn
};

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchJSON(url: string, label: string): Promise<unknown[]> {
  console.log(`[fetch] ${label}`);
  if (DRY_RUN) {
    console.log(`  [dry-run] Would fetch: ${url}`);
    return [];
  }
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${label}: ${res.statusText}`);
  }
  return res.json() as Promise<unknown[]>;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeOutput(filename: string, data: unknown) {
  const filepath = path.join(OUTPUT_DIR, filename);
  if (DRY_RUN) {
    console.log(`  [dry-run] Would write: ${filepath}`);
    return;
  }
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✓ Wrote: ${filepath}`);
}

// ── Transform functions ───────────────────────────────────────────────────────

interface HealthProfileRow {
  neighborhood?: string;
  borough?: string;
  ckd_prevalence?: string | number;
  hypertension_prevalence?: string | number;
  diabetes_prevalence?: string | number;
  poverty_rate?: string | number;
  uninsured_rate?: string | number;
  [key: string]: unknown;
}

function transformHealthProfile(rows: unknown[]): object[] {
  return (rows as HealthProfileRow[]).map(row => ({
    neighborhood: row.neighborhood ?? row['geoname'] ?? null,
    borough: row.borough ?? 'Bronx',
    ckd_prevalence_pct: toFloat(row.ckd_prevalence ?? row['ckd'] ?? null),
    hypertension_pct: toFloat(row.hypertension_prevalence ?? row['hypertension'] ?? null),
    diabetes_pct: toFloat(row.diabetes_prevalence ?? row['diabetes'] ?? null),
    poverty_rate_pct: toFloat(row.poverty_rate ?? row['poverty'] ?? null),
    uninsured_rate_pct: toFloat(row.uninsured_rate ?? row['uninsured'] ?? null),
    source: 'NYC DOHMH Community Health Profiles 2018',
    _raw_keys: Object.keys(row),
  }));
}

interface EHPortalRow {
  geo_entity_name?: string;
  zip_code?: string;
  indicator_name?: string;
  data_value?: string | number;
  [key: string]: unknown;
}

function transformEHPortal(rows: unknown[]): object[] {
  // Group by ZIP, pivot indicators into columns
  const byZip: Record<string, Record<string, number | null>> = {};
  for (const row of rows as EHPortalRow[]) {
    const zip = row.zip_code ?? row.geo_entity_name ?? 'unknown';
    if (!byZip[zip]) byZip[zip] = {};
    const indicator = (row.indicator_name ?? 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    byZip[zip][indicator] = toFloat(row.data_value);
  }
  return Object.entries(byZip)
    .filter(([zip]) => BRONX_ZIPS.includes(zip))
    .map(([zip, indicators]) => ({
      zip_code: zip,
      ...indicators,
      source: 'NYC Environment & Health Data Portal',
    }));
}

interface NYCCASRow {
  borough?: string;
  geo_entity_name?: string;
  pollutant?: string;
  data_value?: string | number;
  time_period?: string;
  [key: string]: unknown;
}

function transformNYCCAS(rows: unknown[]): object[] {
  // Aggregate by community district, then expand to ZIPs using CD_TO_ZIPS
  const byCd: Record<string, Record<string, number | null>> = {};
  for (const row of rows as NYCCASRow[]) {
    const cd = row.geo_entity_name ?? 'unknown';
    if (!byCd[cd]) byCd[cd] = {};
    const pollutant = (row.pollutant ?? 'unknown').toLowerCase().replace(/[^a-z0-9]+/g, '_');
    byCd[cd][`${pollutant}_avg`] = toFloat(row.data_value);
    if (row.time_period) byCd[cd]['time_period'] = row.time_period as unknown as number;
  }

  const result: object[] = [];
  for (const [cd, readings] of Object.entries(byCd)) {
    const zips = CD_TO_ZIPS[cd] ?? [];
    for (const zip of zips) {
      result.push({
        zip_code: zip,
        community_district: cd,
        ...readings,
        source: 'NYC Community Air Survey (NYCCAS)',
      });
    }
  }
  return result;
}

function toFloat(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const n = parseFloat(String(val));
  return isNaN(n) ? null : n;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n=== NYC Health Data Ingestion${DRY_RUN ? ' [DRY RUN]' : ''} ===\n`);
  await ensureDir(OUTPUT_DIR);

  const [healthRows, ehRows, aircRows] = await Promise.all([
    fetchJSON(COMMUNITY_HEALTH_URL, 'NYC Community Health Profiles').catch(err => {
      console.warn(`  ⚠ Health Profiles fetch failed: ${err.message} — skipping`);
      return [];
    }),
    fetchJSON(EH_PORTAL_URL, 'NYC EH Portal').catch(err => {
      console.warn(`  ⚠ EH Portal fetch failed: ${err.message} — skipping`);
      return [];
    }),
    fetchJSON(NYCCAS_URL, 'NYC Community Air Survey').catch(err => {
      console.warn(`  ⚠ NYCCAS fetch failed: ${err.message} — skipping`);
      return [];
    }),
  ]);

  const healthProfiles = transformHealthProfile(healthRows);
  const ehPortal = transformEHPortal(ehRows);
  const airSurvey = transformNYCCAS(aircRows);

  const meta = {
    generated_at: new Date().toISOString(),
    data_version: 'v1.0',
    bronx_zips: BRONX_ZIPS,
    note: 'Data fetched from NYC Open Data. Always verify against primary source before publishing.',
  };

  await Promise.all([
    writeOutput('nyc_health_profiles_bronx.json', { meta, data: healthProfiles }),
    writeOutput('nyc_eh_portal_bronx.json',        { meta, data: ehPortal }),
    writeOutput('nyc_air_survey_bronx.json',        { meta, data: airSurvey }),
  ]);

  console.log(`\nIngestion complete:`);
  console.log(`  Health Profiles: ${healthProfiles.length} neighborhoods`);
  console.log(`  EH Portal:       ${ehPortal.length} ZIP records`);
  console.log(`  Air Survey:      ${airSurvey.length} ZIP records`);
  console.log(`  Output:          ${OUTPUT_DIR}\n`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
