import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { Reveal } from "@/components/sections/Reveal";
import { contact } from "@/lib/data/homepage";
import {
  formatAreaSqFt,
  formatMonth,
  LANDMARK_LABELS,
  relatedWarehouses,
  type Warehouse,
} from "@/lib/data/warehouses";
import { formatMsf } from "@/lib/data/portfolio";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { cx } from "../ui/cx";
import { CopyCoordinates, PrintSpecSheet } from "./WarehouseActions";
import { WarehouseMapLoader } from "./WarehouseMapLoader";
import { PhotoMosaic } from "./PhotoMosaic";
import styles from "./WarehousePage.module.css";

const LOGISTICS = {
  href: "/business/logistics-and-industrial-infrastructure/",
  label: "Logistics and Industrial Infrastructure",
};

function jsonLd(warehouse: Warehouse) {
  const url = absoluteUrl(warehouse.href);
  const { detail, location } = warehouse;
  const graph: object[] = [
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
      containedInPlace: { "@type": "State", name: warehouse.stateName },
      publicAccess: false,
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: LOGISTICS.label, item: absoluteUrl(LOGISTICS.href) },
        { "@type": "ListItem", position: 3, name: warehouse.name, item: url },
      ],
    },
  ];
  if (detail.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: detail.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function WarehousePage({ warehouse }: { warehouse: Warehouse }) {
  const { detail, location, connections } = warehouse;
  const [hero, ...rest] = detail.photos ?? [];
  const related = relatedWarehouses(warehouse);
  const email = detail.contact?.email ?? contact.form.route.default;

  const heroStats = [
    ...(warehouse.leasableAreaMsf !== undefined
      ? [{ label: "Leasable area", value: formatMsf(warehouse.leasableAreaMsf).replace(" msf", ""), unit: "msf" }]
      : []),
    ...(detail.keyStats ?? []),
  ];

  const glance = [
    warehouse.leasableAreaMsf !== undefined
      ? { label: "Leasable area", value: `${formatMsf(warehouse.leasableAreaMsf)} (approx ${formatAreaSqFt(warehouse.leasableAreaMsf)})` }
      : null,
    { label: "Location", value: warehouse.placeLine },
    warehouse.district ? { label: "District", value: warehouse.district } : null,
    detail.availability
      ? { label: "Availability", value: `${detail.availability.label}, as of ${formatMonth(detail.availability.asOf)}` }
      : null,
  ].filter((row): row is { label: string; value: string } => row !== null);

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

          <div className={styles.heroMeta}>
            {detail.availability ? (
              <span className={styles.badge}>
                <span className={styles.badgeDot} aria-hidden="true" />
                {detail.availability.label}
              </span>
            ) : null}
            {detail.certifications?.map((certification) => (
              <span key={certification} className={styles.chip}>
                {certification}
              </span>
            ))}
          </div>

          <div className={styles.heroActions}>
            <a href="#enquire" className={styles.ctaPrimary}>
              Enquire about this site
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
                      {stat.value}
                      {stat.unit ? <span className={styles.statUnit}> {stat.unit}</span> : null}
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
          Preview for review: the specifications, amenities and answers on this page are sample
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

      {/* Photos ------------------------------------------------------------------ */}
      {rest.length ? (
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

              {connections.length ? (
                <ol className={styles.connections}>
                  {connections.map((connection) => (
                    <li key={connection.label} className={styles.connection}>
                      <span className={styles.connectionKind}>{LANDMARK_LABELS[connection.kind]}</span>
                      <span className={styles.connectionName}>{connection.label}</span>
                      <span className={styles.connectionKm}>
                        approx {connection.km < 10 ? connection.km.toFixed(1) : Math.round(connection.km)} km
                      </span>
                    </li>
                  ))}
                </ol>
              ) : null}

              <p className={styles.locationNote}>
                {connections.some((connection) => connection.basis === "straight-line")
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
                <CopyCoordinates lat={location.lat} lon={location.lon} className={styles.textAction} />
              </div>
            </div>

            <div className={styles.mapFrame}>
              <WarehouseMapLoader
                site={{ name: warehouse.name, lat: location.lat, lon: location.lon }}
                landmarks={connections.map(({ label, lat, lon }) => ({ label, lat, lon }))}
              />
            </div>
          </Container>
        </section>
      ) : null}

      {/* Specifications ------------------------------------------------------------ */}
      {detail.specs?.length || detail.amenities?.length ? (
        <section className={styles.specs} aria-labelledby="specs-title">
          <Container>
            <div className={styles.specsHead}>
              <div>
                <p className={styles.eyebrow}>Specifications</p>
                <h2 id="specs-title" className={styles.sectionTitle}>
                  Building and services
                </h2>
              </div>
              <PrintSpecSheet className={styles.printButton} />
            </div>

            <div className={styles.specGrid}>
              {detail.specs?.map((group) => (
                <div key={group.title} className={styles.specGroup}>
                  <h3 className={styles.specTitle}>{group.title}</h3>
                  <dl className={styles.specRows}>
                    {group.rows.map((row) => (
                      <div key={row.label} className={styles.specRow}>
                        <dt>{row.label}</dt>
                        <dd>{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
              {detail.amenities?.length ? (
                <div className={styles.specGroup}>
                  <h3 className={styles.specTitle}>Amenities</h3>
                  <ul className={styles.amenities}>
                    {detail.amenities.map((amenity) => (
                      <li key={amenity}>{amenity}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}

      {/* FAQ ------------------------------------------------------------------------ */}
      {detail.faq?.length ? (
        <section className={styles.faq} aria-labelledby="faq-title">
          <Container className={styles.split}>
            <div className={styles.splitMain}>
              <p className={styles.eyebrow}>Questions</p>
              <h2 id="faq-title" className={styles.sectionTitle}>
                Before you lease
              </h2>
            </div>
            <div className={styles.faqList}>
              {detail.faq.map((item) => (
                <details key={item.q} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{item.q}</summary>
                  <p className={styles.faqAnswer}>{item.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Enquiry ------------------------------------------------------------------- */}
      <section id="enquire" className={styles.enquire} aria-labelledby="enquire-title">
        <Container className={styles.enquireGrid}>
          <div className={styles.enquireText}>
            <p className={styles.eyebrow}>Leasing</p>
            <h2 id="enquire-title" className={styles.sectionTitle}>
              Lease space at {warehouse.name}
            </h2>
            <p className={styles.body}>
              Tell us the area you need and when you need it. Our leasing team will reply with
              availability, layout options and terms for this site.
            </p>
            <p className={styles.body}>
              Prefer email? Write to{" "}
              <a className={styles.inlineLink} href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${warehouse.name}`)}`}>
                {email}
              </a>
              .
            </p>
          </div>
          <div className={styles.enquireCard}>
            <h3 className={styles.enquireCardTitle}>Enquire about this site</h3>
            <EnquiryForm warehouse={{ id: warehouse.id, name: `${warehouse.name}, ${warehouse.placeLine}` }} />
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
                          <Image src={cover.src} alt="" fill sizes="(max-width: 767px) 100vw, 33vw" />
                        ) : (
                          <span className={styles.relatedPlaceholder} aria-hidden="true" />
                        )}
                      </span>
                      <span className={styles.relatedBody}>
                        <span className={styles.relatedName}>{other.name}</span>
                        <span className={styles.relatedPlace}>{other.placeLine}</span>
                        {other.leasableAreaMsf !== undefined ? (
                          <span className={styles.relatedArea}>{formatMsf(other.leasableAreaMsf)}</span>
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
        <a href="#enquire" className={styles.mobileBarPrimary}>
          Enquire
        </a>
        <a href={`mailto:${email}?subject=${encodeURIComponent(`Enquiry: ${warehouse.name}`)}`} className={styles.mobileBarSecondary}>
          Email
        </a>
      </div>
    </article>
  );
}
