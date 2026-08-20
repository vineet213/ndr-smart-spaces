import { contactMap, officeDirectory } from "./contact";

/**
 * Contact data validation — pure rules over the contact datasets.
 *
 * Validation is one-directional (this module imports the data; the page wires
 * the run). Rules fail loud in development only, never in production.
 */

export function validateOfficeKeys(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const office of officeDirectory.offices) {
    if (seen.has(office.key)) {
      errors.push(`Office directory repeats key "${office.key}".`);
    }
    seen.add(office.key);
  }
  return errors;
}

export function validateOfficeContactDetails(): string[] {
  const errors: string[] = [];
  for (const office of officeDirectory.offices) {
    if (!office.phone.trim()) {
      errors.push(`Office directory entry "${office.key}" is missing a phone number.`);
    }
    if (!office.hours.trim()) {
      errors.push(`Office directory entry "${office.key}" is missing office hours.`);
    }
    if (!office.email.label.trim() || !office.email.href.startsWith("mailto:")) {
      errors.push(`Office directory entry "${office.key}" has an invalid email record.`);
    }
  }
  return errors;
}

export function validateMapCoordinates(): string[] {
  const errors: string[] = [];
  for (const marker of contactMap.markers) {
    if (marker.lat < -90 || marker.lat > 90) {
      errors.push(`Contact marker "${marker.id}" has invalid latitude ${marker.lat}.`);
    }
    if (marker.lon < -180 || marker.lon > 180) {
      errors.push(`Contact marker "${marker.id}" has invalid longitude ${marker.lon}.`);
    }
    if (
      marker.x < 0 ||
      marker.x > contactMap.mapViewbox.width ||
      marker.y < 0 ||
      marker.y > contactMap.mapViewbox.height
    ) {
      errors.push(
        `Contact marker "${marker.id}" projects outside the map viewbox (x=${marker.x}, y=${marker.y}).`,
      );
    }
  }
  return errors;
}

export function runContactValidation(): boolean {
  const rules: Array<[string, () => string[]]> = [
    ["office keys", validateOfficeKeys],
    ["office contact details", validateOfficeContactDetails],
    ["map coordinates", validateMapCoordinates],
  ];

  let allPassed = true;
  for (const [name, rule] of rules) {
    const errors = rule();
    if (errors.length > 0) {
      allPassed = false;
      console.error(`[contact-validation] ${name}:`);
      for (const error of errors) console.error(`  · ${error}`);
    }
  }
  return allPassed;
}
