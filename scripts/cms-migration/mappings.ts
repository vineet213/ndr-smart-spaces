/**
 * CMS Phase 2A — migration mapping.
 *
 * The single source of truth for the Phase 2A seed: it maps every frozen,
 * handwritten data module (`src/lib/data/*.ts`) into the fourteen shared CMS
 * collections (§11) as explicit records. Both the seeding pipeline
 * (`cms-seed.ts`) and the parity verification (`cms-parity.ts`) derive their
 * expectations from this module, so "what we seeded" and "what we verify" can
 * never drift apart.
 *
 * Mapping conventions (documented in the Phase 2A Migration Report):
 *  - `order` is a zero-padded four-digit key preserving the source array order
 *    (the content store sorts by `order`, then id).
 *  - Record ids are the frozen source ids (locations = geoLocation ids, assets =
 *    PortfolioAsset ids, governance = register row ids, directory = office keys)
 *    or the slugified reference for register collections without an id.
 *  - Status reflects the source's publication state: live records become
 *    `published`; source-draft records (ESG environment metrics) and pending
 *    register rows (governance, disclosures, media kit) become `draft` /
 *    `pending` so the generated exports carry only the live set.
 *  - Fields the editor schema does not model but the migration must preserve
 *    are carried verbatim (`sourceRef` on governance records, `ref` on the
 *    documents register) — the engine tolerates extra fields and the audit
 *    keeps them byte-for-byte.
 */

import type { JsonValue, PublicationStatus } from "../../src/lib/cms";
import {
  investorMetrics,
} from "../../src/lib/data/investor";
import {
  esgEnvironment,
  esgGovernance,
  esgDisclosures,
  esgImpactMap,
} from "../../src/lib/data/esg";
import { geoLocations, portfolioAssets } from "../../src/lib/data/portfolio";
import { mapLocations, footer as homepageFooter } from "../../src/lib/data/homepage";
import { officeDirectory, contactMap } from "../../src/lib/data/contact";
import { mediaKit, PRESS_ARCHIVE_ENTRIES } from "../../src/lib/data/media";
import { divisions, VERTICAL_PROOF_METRIC_KEYS } from "../../src/lib/data/business";
import {
  siteHome,
  utilityStrip,
  headerCta,
  navItems,
  mobileNavItems,
  mobileMenuFooter,
} from "../../src/lib/data/navigation";

export type SeedRecordSpec = {
  id: string;
  status: PublicationStatus;
  order: string;
  data: JsonValue;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad(index: number): string {
  return String(index).padStart(4, "0");
}

/** Cast a strongly-typed (literal/readonly) record into the CMS JsonValue shape. */
function toData(value: object): JsonValue {
  return value as unknown as JsonValue;
}

/* metrics ------------------------------------------------------------------ */

const investorMetricRecords: SeedRecordSpec[] = investorMetrics.map((metric, index) => ({
  id: metric.id.toLowerCase(),
  status: "published",
  order: pad(index),
  data: {
    name: metric.stat,
    key: metric.id,
    value: metric.value,
    period: metric.period,
    source: metric.source,
    entity: metric.entity,
    ...(metric.lead ? { lead: true } : {}),
  },
}));

const environmentMetricRecords: SeedRecordSpec[] = esgEnvironment.metrics.map((metric, index) => ({
  id: metric.id.toLowerCase(),
  status: "draft",
  order: pad(investorMetrics.length + index),
  data: {
    name: metric.stat,
    key: metric.code,
    value: metric.value,
    unit: metric.unit,
    period: metric.period,
    source: metric.source,
    trend: metric.trend,
  },
}));

/* locations ---------------------------------------------------------------- */

const geoByName = new Map(geoLocations.map((location) => [location.name, location]));

const HOMEPAGE_MAP_NAMES: Record<string, string> = { Chennai: "Headquarters" };

/** Homepage map location for a geo location, matched by name (Chennai → Headquarters). */
function homepageLocationFor(geo: (typeof geoLocations)[number]):
  | (typeof mapLocations)[number]
  | undefined {
  const mapName = HOMEPAGE_MAP_NAMES[geo.name] ?? geo.name;
  return mapLocations.find((location) => location.name === mapName);
}

const contactMarker = contactMap.markers[0];

const locationRecords: SeedRecordSpec[] = geoLocations.map((geo, index) => {
  const homepage = homepageLocationFor(geo);
  return {
    id: geo.id,
    status: "published",
    order: pad(index),
    data: {
      name: geo.name,
      tier: geo.tier,
      zone: geo.zone,
      line: geo.line,
      lat: geo.lat,
      lon: geo.lon,
      portfolioOffset: {
        x: geo.x,
        y: geo.y,
        ...(geo.labelSide ? { labelSide: geo.labelSide } : {}),
        ...(geo.leaderTo ? { leaderTo: { x: geo.leaderTo.x, y: geo.leaderTo.y } } : {}),
      },
      ...(homepage
        ? {
            homepageOffset: {
              x: homepage.x,
              y: homepage.y,
              ...(homepage.leaderTo
                ? { leaderTo: { x: homepage.leaderTo.x, y: homepage.leaderTo.y } }
                : {}),
            },
          }
        : {}),
      ...(geo.id === "chennai-hq" && contactMarker
        ? { contactOffset: { x: contactMarker.x, y: contactMarker.y } }
        : {}),
      visible: {
        homepage: homepage !== undefined,
        portfolio: true,
        contact: geo.id === "chennai-hq",
      },
    },
  };
});

/* portfolio assets ---------------------------------------------------------- */

const assetRecords: SeedRecordSpec[] = portfolioAssets.map((asset, index) => ({
  id: asset.id,
  status: "published",
  order: pad(index),
  data: toData({
    name: asset.name,
    plate: asset.plate,
    city: asset.city,
    zone: asset.zone,
    locationId: asset.locationId,
    class: asset.class,
    status: asset.status,
    ...(asset.sizeSqFt !== undefined ? { sizeSqFt: asset.sizeSqFt } : {}),
    ...(asset.occupier ? { occupier: asset.occupier } : {}),
    ...(asset.completedYear ? { completedYear: asset.completedYear } : {}),
    ...(asset.entity ? { entity: asset.entity } : {}),
    source: asset.source,
  }),
}));

/* business verticals --------------------------------------------------------- */

const verticalRecords: SeedRecordSpec[] = divisions.map((division, index) => ({
  id: slugify(division.title),
  status: "published",
  order: pad(index),
  data: toData({
    title: division.title,
    index: division.index,
    writeup: division.writeup,
    spec: division.spec.map((row) => ({ label: row.label, value: row.value })),
    proof: division.proof,
    proofSource: division.proofSource,
    ...("anchor" in division ? { anchor: division.anchor } : {}),
    route: {
      label: division.route.label,
      href: division.route.href,
      ...("external" in division.route ? { external: true } : {}),
    },
    metrics: (VERTICAL_PROOF_METRIC_KEYS[division.index] ?? []).map((metricKey) => ({
      metricKey,
    })),
    source: division.source,
  }),
}));

/* esg initiatives ------------------------------------------------------------ */

function locationIdForPlace(place: string): string {
  const geo = geoByName.get(place);
  if (!geo) throw new Error(`ESG initiative place "${place}" has no matching portfolio location.`);
  return geo.id;
}

const initiativeRecords: SeedRecordSpec[] = esgImpactMap.initiatives.map((initiative, index) => ({
  id: initiative.id,
  status: "published",
  order: pad(index),
  data: {
    name: initiative.name,
    code: initiative.code,
    place: initiative.place,
    region: initiative.region,
    category: initiative.category,
    status: initiative.status,
    locationId: locationIdForPlace(initiative.place),
    lat: initiative.lat,
    lon: initiative.lon,
    ...(initiative.note ? { note: initiative.note } : {}),
  },
}));

/* governance records ---------------------------------------------------------- */

const GOVERNANCE_REGISTER_KINDS: Record<string, "committee" | "policy"> = {
  Committees: "committee",
  Policies: "policy",
};

const governanceRecords: SeedRecordSpec[] = [];
{
  let index = 0;
  for (const register of esgGovernance.registers) {
    if (register.title === "Disclosure index") continue; // covered by the DS documents
    const kind = GOVERNANCE_REGISTER_KINDS[register.title];
    if (!kind) throw new Error(`Unmapped governance register "${register.title}".`);
    for (const row of register.rows) {
      governanceRecords.push({
        id: row.id,
        status: "pending",
        order: pad(index++),
        data: {
          title: row.entry,
          kind,
          holder: "NDR Smart Spaces Pvt. Ltd.",
          recordStatus: "pending",
          summary: row.note,
          sourceRef: row.ref,
        },
      });
    }
  }
}

/** Registry-issued GV-REG references, in the order the clean seed issues them. */
export function expectedGovernanceRefs(): string[] {
  return governanceRecords.map((_, index) => `GV-REG-${String(index + 1).padStart(3, "0")}`);
}

/* documents ------------------------------------------------------------------- */

const documentRecords: SeedRecordSpec[] = [];
{
  let index = 0;
  for (const group of esgDisclosures.groups) {
    for (const document of group.documents) {
      documentRecords.push({
        id: slugify(document.ref),
        status: "pending",
        order: pad(index++),
        data: {
          title: document.title,
          category: group.category,
          type: document.title,
          asOn: document.asOn,
          ref: document.ref,
          ...(document.note ? { note: document.note } : {}),
          ...(document.edition ? { edition: document.edition } : {}),
        },
      });
    }
  }
}

/* media ------------------------------------------------------------------------ */

const mediaRecords: SeedRecordSpec[] = [
  ...mediaKit.items.map((item, index) => {
    const isSvg = item.format.includes("SVG");
    return {
      id: slugify(item.ref),
      status: "pending" as const,
      order: pad(index),
      data: {
        ref: item.ref,
        label: item.label,
        name: `${slugify(item.label)}.${isSvg ? "svg" : "pdf"}`,
        kind: isSvg ? ("logo" as const) : ("pdf" as const),
        folder: "media-kit",
        mime: isSvg ? "image/svg+xml" : "application/pdf",
        caption: item.note,
        format: item.format,
        classification: item.classification,
        revision: item.revision,
        status: item.status,
      },
    };
  }),
  ...PRESS_ARCHIVE_ENTRIES.map((entry, index) => ({
    id: slugify(entry.ref),
    status: "pending" as const,
    order: pad(mediaKit.items.length + index),
    data: {
      ref: entry.ref,
      label: entry.title,
      name: `${slugify(entry.id)}.pdf`,
      kind: "pdf" as const,
      folder: "press-archive",
      ...(entry.note !== undefined ? { caption: entry.note } : {}),
      recordStatus: entry.status,
      date: entry.date,
      category: entry.category,
      ...(entry.href ? { href: entry.href } : {}),
      ...(entry.external ? { external: true } : {}),
    },
  })),
];

/* contact directory ------------------------------------------------------------- */

const directoryRecords: SeedRecordSpec[] = officeDirectory.offices.map((office, index) => ({
  id: office.key,
  status: "published",
  order: pad(index),
  data: {
    name: office.name,
    key: office.key,
    kind: office.kind,
    lines: office.lines.map((line) => ({ value: line })),
    phone: office.phone,
    email: { label: office.email.label, href: office.email.href },
    hours: office.hours,
    ...(office.directions
      ? {
          directions: {
            label: office.directions.label,
            href: office.directions.href,
            external: true,
          },
        }
      : {}),
  },
}));

/* navigation --------------------------------------------------------------------- */

const navigationRecord: SeedRecordSpec = {
  id: "default",
  status: "published",
  order: "0000",
  data: toData({
    siteHome,
    utilityStrip,
    headerCta,
    navItems,
    mobileNavItems,
    mobileMenuFooter,
  }),
};

/* footer --------------------------------------------------------------------------- */

const footerRecord: SeedRecordSpec = {
  id: "default",
  status: "published",
  order: "0000",
  data: {
    descriptor: homepageFooter.descriptor,
    ecosystem: homepageFooter.ecosystem.map((link) => ({
      label: link.label,
      href: link.href,
      external: true,
    })),
    groups: homepageFooter.groups.map((group) => ({
      heading: group.heading,
      links: group.links.map((link) => ({ label: link.label, href: link.href })),
    })),
    contact: {
      heading: "Correspondence",
      address: homepageFooter.contact.address,
      emails: homepageFooter.contact.emails.map((email) => ({
        label: email.label,
        href: email.href,
      })),
    },
    legal: homepageFooter.legal.map((link) => ({ label: link.label, href: link.href })),
    copyright: homepageFooter.copyright,
  },
};

/* settings ------------------------------------------------------------------------- */

const corporateOffice = officeDirectory.offices.find((office) => office.key === "corporate")!;

const corporateSettingsRecord: SeedRecordSpec = {
  id: "default",
  status: "published",
  order: "0000",
  data: {
    companyName: "NDR Smart Spaces",
    legalEntity: "NDR Smart Spaces Pvt. Ltd.",
    registryLine: "NDR Smart Spaces Pvt. Ltd. — an NDR Group platform",
    cin: "U45201TN2005PTC059267",
    addresses: [
      {
        label: "Corporate office",
        lines: corporateOffice.lines.map((line) => ({ value: line })),
      },
      {
        label: "Registered office",
        lines: [{ value: "Registered office address and CIN to be confirmed." }],
      },
    ],
    phoneNumbers: [...new Set(officeDirectory.offices.map((office) => office.phone))].map(
      (phone) => ({ value: phone }),
    ),
    emails: [
      ...new Set([
        ...officeDirectory.offices.map((office) => office.email.label),
        ...mobileMenuFooter.emails,
      ]),
    ].map((email) => ({ value: email })),
    pressResponseExpectation: "Within 2 business days",
    externalLinks: {
      invitUrl: "https://ndrinvit.com",
      aveAcresUrl: "https://aveacres.com",
      googleMapsDirectionsUrl: corporateOffice.directions?.href ?? "",
    },
  },
};

const publicationSettingsRecord: SeedRecordSpec = {
  id: "default",
  status: "published",
  order: "0000",
  data: {
    editionPeriod: "FY26",
    asOnDate: "As on 31 March 2026",
    documentPrefixes: {
      "PR-": "Press reference",
      "PC-": "Press correspondence reference",
      "MK-": "Media kit asset",
      "DOC-": "Document reference",
      "DS-": "ESG disclosure reference",
      "CE-": "Certification reference",
      "GV-REG-": "Governance register number",
      "GC-": "Governance committee code",
      "GP-": "Governance policy code",
      "IM-": "ESG initiative code",
    },
    numberingRules: {
      ref: "PR-NNN",
      fig: "FIG-NNN",
      doc: "DOC-NNN",
      register: "GV-REG-NNN",
      plate: "NN catalogue plate",
      volume: "Roman numeral",
    },
    copyrightLine: "© 2026 NDR Smart Spaces Pvt. Ltd.",
  },
};

const brandSettingsRecord: SeedRecordSpec = {
  id: "default",
  status: "published",
  order: "0000",
  data: {
    brandName: "NDR Smart Spaces",
    logoLight: {
      src: "/logos/ndr-smart-spaces-lockup-light.svg",
      alt: "NDR Smart Spaces",
    },
    logoDark: {
      src: "/logos/ndr-smart-spaces-lockup.svg",
      alt: "NDR Smart Spaces",
    },
    favicon: "/icon.svg",
    seoDefaults: {
      title: "NDR Smart Spaces Pvt. Ltd.",
      description:
        "NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial, commercial and institutional assets.",
    },
  },
};

/* seed spec ------------------------------------------------------------------------ */

const COLLECTION_RECORDS: Record<string, SeedRecordSpec[]> = {
  "corporate-settings": [corporateSettingsRecord],
  "publication-settings": [publicationSettingsRecord],
  "brand-settings": [brandSettingsRecord],
  navigation: [navigationRecord],
  footer: [footerRecord],
  metrics: [...investorMetricRecords, ...environmentMetricRecords],
  locations: locationRecords,
  "portfolio-assets": assetRecords,
  "business-verticals": verticalRecords,
  "esg-initiatives": initiativeRecords,
  "governance-records": governanceRecords,
  documents: documentRecords,
  media: mediaRecords,
  "contact-directory": directoryRecords,
};

/**
 * Seeding order — the engine rebuilds its reference snapshot per save, so
 * collections referenced by others must be persisted before their dependents
 * are validated (assets/initiatives → locations).
 */
export const SEED_ORDER: readonly string[] = [
  "corporate-settings",
  "publication-settings",
  "brand-settings",
  "navigation",
  "footer",
  "metrics",
  "locations",
  "portfolio-assets",
  "business-verticals",
  "esg-initiatives",
  "governance-records",
  "documents",
  "media",
  "contact-directory",
];

export function seedRecordsFor(collectionKey: string): SeedRecordSpec[] {
  const records = COLLECTION_RECORDS[collectionKey];
  if (!records) throw new Error(`No Phase 2A seed mapping for collection "${collectionKey}".`);
  return records;
}

export function allSeedCollections(): readonly string[] {
  return SEED_ORDER;
}
