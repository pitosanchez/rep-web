/**
 * Converts Claude signal status strings to numeric scores for DB storage.
 *
 * present     → 1.0
 * possible    → 0.5
 * not_present → 0.0
 * unclear     → null (excluded from aggregation averages)
 */
export function statusToScore(status: string): number | null {
  switch (status) {
    case 'present':     return 1.0;
    case 'possible':    return 0.5;
    case 'not_present': return 0.0;
    case 'unclear':     return null;
    default:            return null;
  }
}

/**
 * SBI (Structural Burden Index) formula v1.
 * Matches the calculate_sbi() Postgres function for consistency.
 * Null values are treated as 0 in the weighted sum.
 */
export function calculateSBI(scores: {
  economic:    number | null;
  healthcare:  number | null;
  insurance:   number | null;
  food:        number | null;
  environment: number | null;
  safety:      number | null;
  literacy:    number | null;
  justice:     number | null;
  mental:      number | null;
  substance:   number | null;
  support:     number | null;
  structural:  number | null;
}): number {
  const v = (n: number | null) => n ?? 0;
  return (
    v(scores.economic)    * 0.200 +
    v(scores.healthcare)  * 0.200 +
    v(scores.insurance)   * 0.150 +
    v(scores.food)        * 0.100 +
    v(scores.environment) * 0.100 +
    v(scores.safety)      * 0.050 +
    v(scores.literacy)    * 0.050 +
    v(scores.justice)     * 0.050 +
    v(scores.mental)      * 0.050 +
    v(scores.substance)   * 0.025 +
    v(scores.support)     * 0.025 +
    v(scores.structural)  * 0.100
  );
}
