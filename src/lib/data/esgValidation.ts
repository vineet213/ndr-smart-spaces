import { esgDashboard, esgImpactMap, esgEnvironment } from "./esg";

/**
 * ESG data validation — pure rules over the ledger datasets.
 *
 * Validation is one-directional (this module imports the data; the page wires
 * the run). Rules fail loud in development only, never in production.
 */

export function validateComposition(): string[] {
  const errors: string[] = [];
  for (const composition of esgDashboard.composition) {
    const total = composition.parts.reduce((sum, part) => sum + part.value, 0);
    if (Math.abs(total - 100) > 0.5) {
      errors.push(`Composition "${composition.id}" sums to ${total}, expected 100 (±0.5).`);
    }
  }
  return errors;
}

export function validateMapCoordinates(): string[] {
  const errors: string[] = [];
  for (const initiative of esgImpactMap.initiatives) {
    if (initiative.lat < -90 || initiative.lat > 90) {
      errors.push(`Initiative "${initiative.id}" has invalid latitude ${initiative.lat}.`);
    }
    if (initiative.lon < -180 || initiative.lon > 180) {
      errors.push(`Initiative "${initiative.id}" has invalid longitude ${initiative.lon}.`);
    }
  }
  return errors;
}

export function validateMapUniqueness(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const initiative of esgImpactMap.initiatives) {
    const key = `${initiative.name}·${initiative.region}`;
    if (seen.has(key)) {
      errors.push(`Duplicate impact initiative location: "${key}".`);
    }
    seen.add(key);
  }
  return errors;
}

export function validateTrendSeries(): string[] {
  const errors: string[] = [];
  for (const trend of esgDashboard.trends) {
    if (trend.points.length < 2) {
      errors.push(`Trend "${trend.id}" has fewer than two points.`);
    }
    const periods = new Set<string>();
    for (const point of trend.points) {
      if (!Number.isFinite(point.value)) {
        errors.push(`Trend "${trend.id}" has a non-finite value at ${point.period}.`);
      }
      if (periods.has(point.period)) {
        errors.push(`Trend "${trend.id}" repeats period "${point.period}".`);
      }
      periods.add(point.period);
    }
  }
  return errors;
}

export function validateGoals(): string[] {
  const errors: string[] = [];
  for (const goal of esgDashboard.goals) {
    if (!Number.isFinite(goal.current) || !Number.isFinite(goal.target)) {
      errors.push(`Goal "${goal.id}" has a non-finite current or target value.`);
    }
    if (goal.current <= 0 || goal.target <= 0) {
      errors.push(`Goal "${goal.id}" must have positive current and target values.`);
    }
  }
  return errors;
}

export function validateEnvironmentMetrics(): string[] {
  const errors: string[] = [];
  for (const metric of esgEnvironment.metrics) {
    if (metric.draft && !metric.period.includes("*")) {
      errors.push(
        `Environment metric "${metric.id}" is flagged draft but its period "${metric.period}" lacks the * marker.`,
      );
    }
  }
  return errors;
}

export function runEsgValidation(): boolean {
  const rules: Array<[string, () => string[]]> = [
    ["composition sums", validateComposition],
    ["map coordinates", validateMapCoordinates],
    ["map uniqueness", validateMapUniqueness],
    ["trend series", validateTrendSeries],
    ["goal values", validateGoals],
    ["environment draft markers", validateEnvironmentMetrics],
  ];

  let allPassed = true;
  for (const [name, rule] of rules) {
    const errors = rule();
    if (errors.length > 0) {
      allPassed = false;
      console.error(`[esg-validation] ${name}:`);
      for (const error of errors) console.error(`  · ${error}`);
    }
  }
  return allPassed;
}
