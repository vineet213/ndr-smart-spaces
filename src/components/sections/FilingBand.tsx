import { Container } from "@/components/layout";
import { Icon, TextLink } from "@/components/ui";
import {
  ZONE_CHAPTERS,
  assetsInZone,
  atlasField,
  filingBand,
  formatPlateRange,
  geoZones,
  locationsInZone,
  portfolioAssets,
  portfolioMasthead,
} from "@/lib/data/portfolio";
import type { GeoZone } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import styles from "./FilingBand.module.css";

function FilingRecord({ zone, dominant }: { zone: GeoZone; dominant: boolean }) {
  const assets = assetsInZone(zone.id);
  const locations = locationsInZone(zone.id);
  const plateRange = formatPlateRange(assets.map((asset) => asset.plate));
  const status = dominant ? `${plateRange} · ${filingBand.filedLabel}` : filingBand.pendingLabel;

  return (
    <div className={cx(styles.record, dominant ? styles.recordFiled : styles.recordPending)}>
      <span className={styles.recordTab} aria-hidden="true" />
      <div className={styles.recordHead}>
        <span className={styles.recordNumeral} aria-hidden="true">
          {ZONE_CHAPTERS[zone.id]}
        </span>
        <h3 className={styles.recordZone}>{zone.name}</h3>
        {dominant ? (
          <span className={styles.recordRange}>{plateRange}</span>
        ) : (
          <span className={styles.recordCount}>
            {locations.length} {atlasField.locationUnitLabel}
          </span>
        )}
      </div>

      {dominant ? (
        <p className={styles.recordFact}>{zone.fact}</p>
      ) : (
        <div className={styles.recordMeta}>
          <dl className={styles.metaRows}>
            <div className={styles.metaRow}>
              <dt>{filingBand.plateRefLabel}</dt>
              <dd>—</dd>
            </div>
          </dl>
        </div>
      )}

      <div className={styles.recordFoot}>
        <span
          className={cx(styles.statusTag, dominant ? styles.statusFiled : styles.statusPending)}
        >
          <span className={styles.statusMark} aria-hidden="true" />
          {status}
        </span>
        {dominant ? (
          <TextLink href={`/en/portfolio?zone=${zone.id}#register`}>
            {filingBand.handoffPrefix} {zone.name.toLowerCase()} {filingBand.handoffSuffix}
            <Icon name="arrow-right" size="sm" />
          </TextLink>
        ) : null}
      </div>
    </div>
  );
}

export function FilingBand() {
  const plateRange = formatPlateRange(portfolioAssets.map((asset) => asset.plate));
  const filedZones = geoZones.filter((zone) => assetsInZone(zone.id).length > 0);
  const pendingZones = geoZones.filter((zone) => assetsInZone(zone.id).length === 0);

  return (
    <section className={styles.band} aria-labelledby="filing-title">
      <Container>
        <Reveal>
          <header className={styles.header}>
            <span className={styles.divider} aria-hidden="true" />
            <div className={styles.chapterMeta}>
              <span className={styles.chapterRef}>{filingBand.chapterLabel}</span>
              <span className={styles.chapterRun}>
                {plateRange} · {portfolioMasthead.editionPeriod}
              </span>
            </div>
            <div className={styles.heading}>
              <span className={styles.chapter} aria-hidden="true">
                IV
              </span>
              <h2 id="filing-title" className={styles.title}>
                {filingBand.label}
              </h2>
              <p className={styles.framing}>{filingBand.framing}</p>
            </div>
          </header>
        </Reveal>

        <Reveal variant="fade">
          <div className={styles.ledger}>
            {filedZones.map((zone) => (
              <FilingRecord key={zone.id} zone={zone} dominant />
            ))}
            {pendingZones.map((zone) => (
              <FilingRecord key={zone.id} zone={zone} dominant={false} />
            ))}
          </div>
        </Reveal>

        <Reveal variant="fade">
          <div className={styles.docket}>
            <dl className={styles.docketRefs}>
              <div className={styles.docketRef}>
                <dt>{filingBand.referenceLabel}</dt>
                <dd>
                  {plateRange} · {portfolioMasthead.editionPeriod}
                </dd>
              </div>
              <div className={cx(styles.docketRef, styles.docketRefStrong)}>
                <dt>{filingBand.registerChapterLabel}</dt>
                <dd>{filingBand.registerHandoffLabel}</dd>
              </div>
            </dl>
            <div className={styles.docketLink}>
              <TextLink href="/en/portfolio#register" tone="dark">
                {filingBand.handoffPrefix} {filingBand.handoffSuffix}
                <Icon name="arrow-right" size="sm" />
              </TextLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
