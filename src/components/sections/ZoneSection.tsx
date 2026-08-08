import { Container } from "@/components/layout";
import { Icon, TextLink } from "@/components/ui";
import {
  ZONE_CHAPTERS,
  assetsInZone,
  atlasField,
  formatPlateRange,
  locationsInZone,
  zoneSection,
} from "@/lib/data/portfolio";
import type { GeoZone } from "@/lib/data/portfolio";
import { ProjectPlate } from "./ProjectPlate";
import { Reveal } from "./Reveal";
import styles from "./ZoneSection.module.css";

export function ZoneSection({ zone }: { zone: GeoZone }) {
  const assets = assetsInZone(zone.id);
  if (assets.length === 0) return null;

  const locations = locationsInZone(zone.id);
  const plateRange = formatPlateRange(assets.map((asset) => asset.plate));

  return (
    <section className={styles.zone} aria-labelledby={`zone-${zone.id}-title`}>
      <Container>
        <Reveal>
          <header className={styles.header}>
            <span className={styles.chapter} aria-hidden="true">
              {ZONE_CHAPTERS[zone.id]}
            </span>
            <span className={styles.plateRun}>
              <span className={styles.plateRunLabel}>{plateRange}</span>
            </span>
            <div className={styles.split}>
              <h2 id={`zone-${zone.id}-title`} className={styles.title}>
                {zone.name}
              </h2>
              <div className={styles.factBlock}>
                <span className={styles.factLabel}>{zoneSection.zoneFactLabel}</span>
                <p className={styles.fact}>{zone.fact}</p>
              </div>
            </div>
          </header>
        </Reveal>

        <div className={styles.platesGrid}>
          {assets.map((asset, index) => (
            <ProjectPlate key={asset.id} asset={asset} index={index} />
          ))}
        </div>

        <Reveal variant="fade">
          <div className={styles.handoff}>
            <TextLink href={`/en/portfolio?zone=${zone.id}#register`}>
              {zoneSection.handoffPrefix} {zone.name.toLowerCase()} {zoneSection.handoffSuffix}
              <Icon name="arrow-right" size="sm" />
            </TextLink>
            <span className={styles.handoffCount}>
              {locations.length} {atlasField.locationUnitLabel}
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
