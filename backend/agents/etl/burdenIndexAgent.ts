/**
 * Burden Index Agent (Backend ETL)
 *
 * Purpose: Compute a composite burden index from aggregated data
 * This runs server-side during data pipeline, NEVER on the frontend.
 *
 * The Burden Index synthesizes:
 * - Poverty (Census)
 * - Food environment (OSM POI aggregates)
 * - Alcohol density (OSM POI aggregates)
 * - Education (Census)
 * - Housing (Census)
 * - Transit access (OSM POI aggregates)
 *
 * The index is NOT causal. It shows co-occurrence of structural factors.
 * It is deliberately composite to avoid singling out any one factor.
 *
 * This is deterministic, testable, offline work.
 */

import { BurdenIndex } from "../../agents/types";

/**
 * Configuration for burden index calculation
 * These weights reflect priorities set by community partners and researchers
 * (Adjust based on community input during design)
 */
const BURDEN_INDEX_CONFIG = {
  // Factor: poverty percentage (0–100)
  poverty: {
    weight: 0.25,
    threshold: 20, // Above 20% poverty = more burden
  },
  // Factor: fast food density (POIs per 10k population)
  fastFoodDensity: {
    weight: 0.15,
    threshold: 30, // Above 30 per 10k = more burden
  },
  // Factor: alcohol store density (POIs per 10k population)
  alcoholDensity: {
    weight: 0.15,
    threshold: 10, // Above 10 per 10k = more burden
  },
  // Factor: limited grocery access (inverse: low supermarket density)
  groceryAccess: {
    weight: 0.2,
    threshold: 5, // Below 5 supermarkets per 10k = food desert
  },
  // Factor: education (% without bachelor's degree)
  educationAttainment: {
    weight: 0.15,
    threshold: 60, // Above 60% without degree = less educational access
  },
  // Factor: transit access (count of transit stops)
  transitAccess: {
    weight: 0.1,
    threshold: 20, // Below 20 stops = limited transit
  },
};

/**
 * Normalize a single factor to 0–100 scale
 * Higher normalized score = more burden
 *
 * @param value The raw factor value
 * @param threshold The benchmark value
 * @returns Normalized score (0–100)
 */
function normalizeFactor(value: number | null, threshold: number): number {
  if (value === null || value === undefined) {
    return 0; // Missing data = no burden contribution
  }

  // Sigmoid-like normalization: smooth curve
  // Below threshold = low burden, above threshold = high burden
  const ratio = value / threshold;
  // Clamp to 0–100
  return Math.min(100, Math.max(0, ratio * 100));
}

/**
 * Calculate burden index for a single census tract
 *
 * @param geoid Census tract GEOID
 * @param metrics Aggregated metrics from Census and OSM
 * @returns BurdenIndex object with score and components
 */
export function calculateBurdenIndex(
  geoid: string,
  metrics: {
    povertyPercent?: number | null;
    fastFoodDensity?: number | null;
    alcoholStoreDensity?: number | null;
    supermarketDensity?: number | null;
    educationAttainmentPercent?: number | null;
    transitStopCount?: number | null;
  }
): BurdenIndex {
  const components: Record<
    string,
    { value: number; weight: number }
  > = {};
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // Factor 1: Poverty
  const povertyNorm = normalizeFactor(
    metrics.povertyPercent,
    BURDEN_INDEX_CONFIG.poverty.threshold
  );
  components["poverty"] = {
    value: povertyNorm,
    weight: BURDEN_INDEX_CONFIG.poverty.weight,
  };
  totalWeightedScore += povertyNorm * BURDEN_INDEX_CONFIG.poverty.weight;
  totalWeight += BURDEN_INDEX_CONFIG.poverty.weight;

  // Factor 2: Fast food density
  const fastFoodNorm = normalizeFactor(
    metrics.fastFoodDensity,
    BURDEN_INDEX_CONFIG.fastFoodDensity.threshold
  );
  components["fastFoodDensity"] = {
    value: fastFoodNorm,
    weight: BURDEN_INDEX_CONFIG.fastFoodDensity.weight,
  };
  totalWeightedScore +=
    fastFoodNorm * BURDEN_INDEX_CONFIG.fastFoodDensity.weight;
  totalWeight += BURDEN_INDEX_CONFIG.fastFoodDensity.weight;

  // Factor 3: Alcohol store density
  const alcoholNorm = normalizeFactor(
    metrics.alcoholStoreDensity,
    BURDEN_INDEX_CONFIG.alcoholDensity.threshold
  );
  components["alcoholDensity"] = {
    value: alcoholNorm,
    weight: BURDEN_INDEX_CONFIG.alcoholDensity.weight,
  };
  totalWeightedScore += alcoholNorm * BURDEN_INDEX_CONFIG.alcoholDensity.weight;
  totalWeight += BURDEN_INDEX_CONFIG.alcoholDensity.weight;

  // Factor 4: Grocery access (inverse: low supermarket density = high burden)
  const groceryAccessNorm = normalizeFactor(
    metrics.supermarketDensity
      ? BURDEN_INDEX_CONFIG.groceryAccess.threshold - metrics.supermarketDensity
      : null,
    BURDEN_INDEX_CONFIG.groceryAccess.threshold
  );
  components["groceryAccess"] = {
    value: groceryAccessNorm,
    weight: BURDEN_INDEX_CONFIG.groceryAccess.weight,
  };
  totalWeightedScore +=
    groceryAccessNorm * BURDEN_INDEX_CONFIG.groceryAccess.weight;
  totalWeight += BURDEN_INDEX_CONFIG.groceryAccess.weight;

  // Factor 5: Education attainment
  const educationNorm = normalizeFactor(
    metrics.educationAttainmentPercent,
    BURDEN_INDEX_CONFIG.educationAttainment.threshold
  );
  components["educationAttainment"] = {
    value: educationNorm,
    weight: BURDEN_INDEX_CONFIG.educationAttainment.weight,
  };
  totalWeightedScore +=
    educationNorm * BURDEN_INDEX_CONFIG.educationAttainment.weight;
  totalWeight += BURDEN_INDEX_CONFIG.educationAttainment.weight;

  // Factor 6: Transit access (inverse: low count = high burden)
  const transitNorm = normalizeFactor(
    metrics.transitStopCount
      ? BURDEN_INDEX_CONFIG.transitAccess.threshold - metrics.transitStopCount
      : null,
    BURDEN_INDEX_CONFIG.transitAccess.threshold
  );
  components["transitAccess"] = {
    value: transitNorm,
    weight: BURDEN_INDEX_CONFIG.transitAccess.weight,
  };
  totalWeightedScore += transitNorm * BURDEN_INDEX_CONFIG.transitAccess.weight;
  totalWeight += BURDEN_INDEX_CONFIG.transitAccess.weight;

  // Final weighted average (0–100)
  const finalScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

  // Determine confidence based on data completeness
  const nonNullFactors = Object.values(components).filter(
    c => c.value > 0
  ).length;
  const confidence =
    nonNullFactors >= 5 ? "high" : nonNullFactors >= 3 ? "medium" : "low";

  return {
    geoid,
    score: Math.round(finalScore),
    components,
    factorCount: nonNullFactors,
    confidence,
    computedAt: new Date(),
  };
}

/**
 * Calculate burden index for multiple geographies (batch)
 * Used during data pipeline
 *
 * @param geographies Array of { geoid, metrics }
 * @returns Array of BurdenIndex objects
 */
export function calculateBurdenIndexBatch(
  geographies: Array<{
    geoid: string;
    metrics: {
      povertyPercent?: number | null;
      fastFoodDensity?: number | null;
      alcoholStoreDensity?: number | null;
      supermarketDensity?: number | null;
      educationAttainmentPercent?: number | null;
      transitStopCount?: number | null;
    };
  }>
): BurdenIndex[] {
  return geographies.map(geo => calculateBurdenIndex(geo.geoid, geo.metrics));
}

/**
 * Generate a burden index report
 * Shows which factors are driving high scores
 *
 * @param index Burden index object
 * @returns Human-readable report
 */
export function generateBurdenReport(index: BurdenIndex): string {
  let report = `## Burden Index Report\n`;
  report += `Geography: ${index.geoid}\n`;
  report += `Overall Score: ${index.score}/100 (Confidence: ${index.confidence})\n`;
  report += `Computed: ${new Date(index.computedAt).toISOString()}\n\n`;

  report += `### Contributing Factors\n`;
  Object.entries(index.components)
    .sort(([, a], [, b]) => b.value - a.value)
    .forEach(([factor, { value, weight }]) => {
      const contribution = value * weight;
      report += `- ${factor}: ${value.toFixed(0)}/100 (weight: ${(
        weight * 100
      ).toFixed(0)}%, contribution: ${contribution.toFixed(1)})\n`;
    });

  report += `\n### Interpretation\n`;
  report += `This index combines ${index.factorCount} factors: poverty, food environment, alcohol density, educational access, housing, and transit.\n`;
  report += `Higher scores indicate multiple structural factors present. This is NOT a causal measure.\n`;

  return report;
}

/**
 * Get interpretation of a burden score
 * Maps 0–100 score to categorical label
 *
 * @param score Burden index score (0–100)
 * @returns Categorical label
 */
export function interpretBurdenScore(
  score: number
): "low" | "moderate" | "high" | "very_high" {
  if (score < 25) return "low";
  if (score < 50) return "moderate";
  if (score < 75) return "high";
  return "very_high";
}

/**
 * EXAMPLE: How to use this agent
 *
 * During ETL pipeline:
 *
 * const aggregatedGeographies = await fetchAggregatedData();
 *
 * // Calculate burden indices
 * const indices = calculateBurdenIndexBatch(aggregatedGeographies);
 *
 * // Save to database
 * await saveIndicesToDatabase(indices);
 *
 * // Generate audit report
 * indices.forEach(index => {
 *   console.log(generateBurdenReport(index));
 *   console.log(`Interpretation: ${interpretBurdenScore(index.score)}`);
 * });
 */
