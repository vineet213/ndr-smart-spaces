import { mediaFeatured, mediaKit, pressArchive, pressContact, PRESS_CATEGORIES } from "./media";

/**
 * Media data validation — pure rules over the press register datasets.
 *
 * Validation is one-directional (this module imports the data; the page wires
 * the run). Rules fail loud in development only, never in production.
 */

export function validateArchiveReferences(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const entry of pressArchive.entries) {
    if (seen.has(entry.ref)) {
      errors.push(`Press archive repeats reference "${entry.ref}".`);
    }
    seen.add(entry.ref);
  }
  return errors;
}

export function validateArchiveCategories(): string[] {
  const errors: string[] = [];
  const valid = new Set<string>(PRESS_CATEGORIES.map((category) => category.key));
  for (const entry of pressArchive.entries) {
    if (!valid.has(entry.category)) {
      errors.push(`Press archive entry "${entry.ref}" has unknown category "${entry.category}".`);
    }
  }
  return errors;
}

export function validateArchiveDraftMarkers(): string[] {
  const errors: string[] = [];
  for (const entry of pressArchive.entries) {
    if (entry.status === "draft" && !entry.date.includes("*")) {
      errors.push(
        `Press archive entry "${entry.ref}" is flagged draft but its date "${entry.date}" lacks the * marker.`,
      );
    }
  }
  return errors;
}

export function validateFeaturedReference(): string[] {
  const errors: string[] = [];
  const archiveRefs = new Set(pressArchive.entries.map((entry) => entry.ref));
  if (!archiveRefs.has(mediaFeatured.ref)) {
    errors.push(
      `Featured publication references "${mediaFeatured.ref}" which is absent from the press archive.`,
    );
  }
  return errors;
}

export function validateKitReferences(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const item of mediaKit.items) {
    if (seen.has(item.ref)) {
      errors.push(`Media kit repeats asset reference "${item.ref}".`);
    }
    seen.add(item.ref);
  }
  return errors;
}

export function validateContactReferences(): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const department of pressContact.departments) {
    if (seen.has(department.ref)) {
      errors.push(`Press contact repeats department reference "${department.ref}".`);
    }
    seen.add(department.ref);
  }
  return errors;
}

export function runMediaValidation(): boolean {
  const rules: Array<[string, () => string[]]> = [
    ["archive references", validateArchiveReferences],
    ["archive categories", validateArchiveCategories],
    ["archive draft markers", validateArchiveDraftMarkers],
    ["featured reference", validateFeaturedReference],
    ["kit references", validateKitReferences],
    ["contact references", validateContactReferences],
  ];

  let allPassed = true;
  for (const [name, rule] of rules) {
    const errors = rule();
    if (errors.length > 0) {
      allPassed = false;
      console.error(`[media-validation] ${name}:`);
      for (const error of errors) console.error(`  · ${error}`);
    }
  }
  return allPassed;
}
