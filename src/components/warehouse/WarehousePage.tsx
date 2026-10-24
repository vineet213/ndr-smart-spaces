import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Reveal } from "@/components/sections/Reveal";
import { contact } from "@/lib/data/homepage";
import {
  formatAreaSqFt,
  LANDMARK_LABELS,
  relatedWarehouses,
  reportedKmFloor,
  type Connection,
  type LandmarkKind,
  type ReportedConnection,
  type Warehouse,
} from "@/lib/data/warehouses";
import { formatMsf } from "@/lib/data/portfolio";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { cx } from "../ui/cx";
import { CopyCoordinates } from "./WarehouseActions";
import { WarehouseGoogleMap } from "./WarehouseGoogleMap";
import { PhotoMosaic } from "./PhotoMosaic";
import styles from "./WarehousePage.module.css";

const LOGISTICS = {
  href: "/business/logistics-and-industrial-infrastructure/",
  label: "Logistics and Industrial Infrastructure",
};

/** Hero figures that come from the location itself, so no site data is needed. */
const DISTANCE_STATS: { kinds: LandmarkKind[]; label: string }[] = [
  { kinds: ["airport"], label: "To the airport" },
  { kinds: ["seaport"], label: "To the port" },
  { kinds: ["metro", "rail"], label: "To metro / rail" },
];

function formatKm(km: number): string {
  return km < 10 ? km.toFixed(1) : String(Math.round(km));
}

function nearest(connections: readonly Connection[], kinds: LandmarkKind[]) {
  return connections.find((connection) => kinds.includes(connection.kind)) ?? null;
}

/** "<1" -> "under 1", "45–46" stays as it is. */
function formatReportedKm(km: string): string {
  if (km.startsWith("<")) return `under ${km.slice(1)}`;
  if (km.startsWith(">")) return `over ${km.slice(1)}`;
  return km;
}

function nearestReported(connections: readonly ReportedConnection[], kinds: LandmarkKind[]) {
  const matches = connections.filter((connection) => connection.kind && kinds.includes(connection.kind));
  return matches.sort((a, b) => reportedKmFloor(a.km) - reportedKmFloor(b.km))[0] ?? null;
}

function jsonLd(warehouse: Warehouse) {
  const url = absoluteUrl(warehouse.href);
  const { detail, location } = warehouse;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Place",
        "@id": `${url}#place`,
        name: warehouse.name,
        url,
        ...(detail.summary ? { description: detail.summary } : {}),
        address: {
          "@type": "PostalAddress",
          addressLocality: detail.locality ?? warehouse.city,
          addressRegion: warehouse.stateName,
          addressCountry: "IN",
        },
        ...(location
          ? { geo: { "@type": "GeoCoordinates", latitude: location.lat, longitude: location.lon } }
          : {}),
        ...(detail.photos?.length
          ? { image: detail.photos.map((photo) => `${SITE_URL}${photo.src}`) }
          : {}),
        ...(warehouse.leasableAreaMsf !== undefined
          ? {
              floorSize: {
                "@type": "QuantitativeValue",
                value: Math.round(warehouse.leasableAreaMsf * 1_000_000),
                unitCode: "FTK",
              },
            }
          : {}),
        ...(detail.amenities?.length
          ? {
              amenityFeature: detail.amenities.map((name) => ({
                "@type": "LocationFeatureSpecification",
                name,
                value: true,
              })),
            }
          : {}),
        containedInPlace: { "@type": "State", name: warehouse.stateName },
        publicAccess: false,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: LOGISTICS.label,
            item: absoluteUrl(LOGISTICS.href),
          },
          { "@type": "ListItem", position: 3, name: warehouse.name, item: url },
        ],
      },
    ],
  };
}

/**
 * A warehouse's page is a teaser that earns a site visit: where it is, how it
 * connects, what it offers in general terms. Detailed specifications are kept
 * for the visit itself.
 */
export function WarehousePage({ warehouse }: { warehouse: Warehouse }) {
  const { detail, location, connections } = warehouse;
  const reported = detail.connectivity ?? [];
  const hero = detail.photos?.[0];
  const related = relatedWarehouses(warehouse);
  const email = detail.contact?.email ?? contact.form.route.default;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(`Site visit: ${warehouse.name}`)}`;

  const heroStats: { label: string; value: string; unit: string; approx?: boolean }[] = [
    ...(warehouse.leasableAreaMsf !== undefined
      ? [
          {
            label: "Leasable area",
            value: formatMsf(warehouse.leasableAreaMsf).replace(" msf", ""),
            unit: "msf",
          },
        ]
      : []),
    ...DISTANCE_STATS.flatMap(({ kinds, label }) => {
      // A reported range ("45–46") already reads as approximate.
      if (reported.length) {
        const hit = nearestReported(reported, kinds);
        return hit ? [{ label, value: formatReportedKm(hit.km), unit: "km" }] : [];
      }
      const hit = nearest(connections, kinds);
      return hit ? [{ label, value: formatKm(hit.km), unit: "km", approx: true }] : [];
    }),
  ];

  const glance = [
    warehouse.leasableAreaMsf !== undefined
      ? {
          label: "Leasable area",
          value: `${formatMsf(warehouse.leasableAreaMsf)} (approx ${formatAreaSqFt(warehouse.leasableAreaMsf)})`,
        }
      : null,
    { label: "Location", value: detail.address ?? warehouse.placeLine },
    warehouse.district ? { label: "District", value: warehouse.district } : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

  const hasFeatures =
    Boolean(detail.utilities?.length) ||
    Boolean(detail.amenities?.length) ||
    Boolean(detail.certifications?.length);

  return (
    <article className={styles.page}>
      <JsonLd data={jsonLd(warehouse)} />

      {/* Hero ------------------------------------------------------------------ */}
      <header className={cx(styles.hero, !hero && styles.heroPlain)}>
        {hero ? (
          <Image
            className={styles.heroImage}
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="100vw"
          />
        ) : null}
        <div className={styles.heroShade} aria-hidden="true" />

        <Container className={styles.heroInner}>
          <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href={LOGISTICS.href}>Logistics</Link>
              </li>
              <li aria-current="page">{warehouse.name}</li>
            </ol>
          </nav>

          <p className={styles.heroEyebrow}>Warehouse · {warehouse.stateName}</p>
          <h1 className={styles.heroTitle}>{warehouse.name}</h1>
          <p className={styles.heroPlace}>{warehouse.placeLine}</p>

          {detail.certifications?.length ? (
            <div className={styles.heroMeta}>
              {detail.certifications.map((certification) => (
                <span key={certification} className={styles.chip}>
                  {certification}
                </span>
              ))}
            </div>
          ) : null}

          <div className={styles.heroActions}>
            <a href="#visit" className={styles.ctaPrimary}>
              Book a site visit
            </a>
            {location ? (
              <a href="#location" className={styles.ctaSecondary}>
                See location
              </a>
            ) : null}
          </div>
        </Container>

        {heroStats.length ? (
          <div className={styles.statBand}>
            <Container>
              <dl className={styles.stats}>
                {heroStats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <dt className={styles.statLabel}>{stat.label}</dt>
                    <dd className={styles.statValue}>
                      {stat.approx ? <span className={styles.statUnit}>approx </span> : null}
                      {stat.value}
                      <span className={styles.statUnit}> {stat.unit}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Container>
          </div>
        ) : null}
      </header>

      {warehouse.hasSampleContent ? (
        <p className={styles.sampleNotice} role="note">
          Preview for review: the description, utilities and amenities on this page are sample
          values and will be replaced with the site&apos;s real details.
        </p>
      ) : null}

      {/* Overview ---------------------------------------------------------------- */}
      <section className={styles.overview} aria-labelledby="overview-title">
        <Container className={styles.split}>
          <Reveal className={styles.splitMain}>
            <p className={styles.eyebrow}>Overview</p>
            <h2 id="overview-title" className={styles.sectionTitle}>
              {detail.summary ? "About the site" : `${warehouse.name} at a glance`}
            </h2>
            {detail.summary ? <p className={styles.lede}>{detail.summary}</p> : null}
            {detail.bestFor?.length ? (
              <div className={styles.bestFor}>
                <p className={styles.smallLabel}>Suited to</p>
                <ul className={styles.tags}>
                  {detail.bestFor.map((use) => (
                    <li key={use} className={styles.tag}>
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={1} className={styles.splitSide}>
            <dl className={styles.glance}>
              {glance.map((row) => (
                <div key={row.label} className={styles.glanceRow}>
                  <dt className={styles.smallLabel}>{row.label}</dt>
                  <dd className={styles.glanceValue}>{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* More photographs (only when a site has more than one) ------------------- */}
      {(detail.photos?.length ?? 0) > 1 ? (
        <section className={styles.photos} aria-labelledby="photos-title">
          <Container>
            <p className={styles.eyebrow}>Photographs</p>
            <h2 id="photos-title" className={styles.sectionTitle}>
              The site
            </h2>
            <PhotoMosaic photos={detail.photos ?? []} skipFirst />
          </Container>
        </section>
      ) : null}

      {/* Location ---------------------------------------------------------------- */}
      {location ? (
        <section id="location" className={styles.location} aria-labelledby="location-title">
          <Container className={styles.locationGrid}>
            <div className={styles.locationText}>
              <p className={cx(styles.eyebrow, styles.eyebrowDark)}>Location</p>
              <h2 id="location-title" className={cx(styles.sectionTitle, styles.titleDark)}>
                Connectivity
              </h2>

              {reported.length ? (
                <ol className={styles.connections}>
                  {reported.map((connection) => (
                    <li key={connection.label} className={styles.connection}>
                      <span className={styles.connectionKind}>
                        {connection.kind ? LANDMARK_LABELS[connection.kind] : ""}
                      </span>
                      <span className={styles.connectionName}>{connection.label}</span>
                      <span className={styles.connectionKm}>
                        {/^[<>]/.test(connection.km) ? "" : "approx "}
                        {formatReportedKm(connection.km)} km
                      </span>
                    </li>
                  ))}
                </ol>
              ) : connections.length ? (
                <ol className={styles.connections}>
                  {connections.map((connection) => (
                    <li key={connection.label} className={styles.connection}>
                      <span className={styles.connectionKind}>
                        {LANDMARK_LABELS[connection.kind]}
                      </span>
                      <span className={styles.connectionName}>{connection.label}</span>
                      <span className={styles.connectionKm}>approx {formatKm(connection.km)} km</span>
                    </li>
                  ))}
                </ol>
              ) : null}

              <p className={styles.locationNote}>
                {detail.access ? `Road access: ${detail.access}. ` : ""}
                {reported.length ? "Distances are approximate. " : ""}
                {!reported.length && connections.some((connection) => connection.basis === "straight-line")
                  ? "Distances are approximate straight-line distances; road distances will be longer. "
                  : ""}
                {location.verified
                  ? ""
                  : "The pin marks the locality; the exact site pin will be added shortly."}
              </p>

              <div className={styles.locationActions}>
                <a
                  className={styles.textAction}
                  href={`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps ↗
                </a>
                <CopyCoordinates
                  lat={location.lat}
                  lon={location.lon}
                  className={styles.textAction}
                />
              </div>
            </div>

            <div className={styles.mapFrame}>
              <WarehouseGoogleMap name={warehouse.name} lat={location.lat} lon={location.lon} />
            </div>
          </Container>
        </section>
      ) : null}

      {/* Utilities, amenities, certifications -------------------------------------- */}
      {hasFeatures ? (
        <section className={styles.features} aria-labelledby="features-title">
          <Container>
            <p className={styles.eyebrow}>On site</p>
            <h2 id="features-title" className={styles.sectionTitle}>
              Utilities and amenities
            </h2>

            <div className={styles.featureGrid}>
              {detail.utilities?.length ? (
                <div className={styles.featureGroup}>
                  <h3 className={styles.featureTitle}>Basic utilities</h3>
                  <dl className={styles.featureRows}>
                    {detail.utilities.map((row) => (
                      <div key={row.label} className={styles.featureRow}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
              {detail.amenities?.length ? (
                <div className={styles.featureGroup}>
                  <h3 className={styles.featureTitle}>Amenities</h3>
                  <ul className={styles.amenities}>
                    {detail.amenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {detail.certifications?.length ? (
                <div className={styles.featureGroup}>
                  <h3 className={styles.featureTitle}>Certifications</h3>
                  <ul className={styles.amenities}>
                    {detail.certifications.map((certification) => (
                      <li key={certification}>{certification}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <p className={styles.featureNote}>
              Full building specifications are shared during a site visit.{" "}
              <a href="#visit" className={styles.inlineLink}>
                Book one
              </a>
              .
            </p>
          </Container>
        </section>
      ) : null}

      {/* Site visit ---------------------------------------------------------------- */}
      <section id="visit" className={styles.enquire} aria-labelledby="visit-title">
        <Container className={styles.enquireGrid}>
          <div className={styles.enquireText}>
            <p className={styles.eyebrow}>Site visit</p>
            <h2 id="visit-title" className={styles.sectionTitle}>
              See {warehouse.name} in person
            </h2>
            <p className={styles.body}>
              Tell us when you would like to visit and roughly how much space you need. Our
              leasing team will confirm a time and walk you through the site, its layout and its
              specifications.
            </p>
            <p className={styles.body}>
              Prefer email? Write to{" "}
              <a className={styles.inlineLink} href={mailto}>
                {email}
              </a>
              .
            </p>
          </div>
          <div className={styles.enquireCard}>
            <h3 className={styles.enquireCardTitle}>Book a site visit</h3>
            <EnquiryForm
              warehouse={{ id: warehouse.id, name: `${warehouse.name}, ${warehouse.placeLine}` }}
            />
          </div>
        </Container>
      </section>

      {/* Related ------------------------------------------------------------------- */}
      {related.length ? (
        <section className={styles.related} aria-labelledby="related-title">
          <Container>
            <p className={styles.eyebrow}>Nearby</p>
            <h2 id="related-title" className={styles.sectionTitle}>
              Other warehouses
            </h2>
            <ul className={styles.relatedGrid}>
              {related.map((other) => {
                const cover = other.detail.photos?.[0];
                return (
                  <li key={other.id}>
                    <Link href={other.href} className={styles.relatedCard}>
                      <span className={styles.relatedMedia}>
                        {cover ? (
                          <Image
                            src={cover.src}
                            alt=""
                            fill
                            sizes="(max-width: 767px) 100vw, 33vw"
                          />
                        ) : (
                          <span className={styles.relatedPlaceholder} aria-hidden="true" />
                        )}
                      </span>
                      <span className={styles.relatedBody}>
                        <span className={styles.relatedName}>{other.name}</span>
                        <span className={styles.relatedPlace}>{other.placeLine}</span>
                        {other.leasableAreaMsf !== undefined ? (
                          <span className={styles.relatedArea}>
                            {formatMsf(other.leasableAreaMsf)}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Mobile action bar ----------------------------------------------------------- */}
      <div className={styles.mobileBar}>
        <a href="#visit" className={styles.mobileBarPrimary}>
          Book a site visit
        </a>
        <a href={mailto} className={styles.mobileBarSecondary}>
          Email
        </a>
      </div>
    </article>
  );
}
