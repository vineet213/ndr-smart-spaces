"use client";

import { useState } from "react";
import { Container, Grid, GridItem } from "@/components/layout";
import { Heading, Eyebrow, Lede, VisuallyHidden } from "@/components/ui";
import type { MapLocation, ZoneId } from "@/lib/data/homepage";
import { zones, mapLocations, portfolioPresence } from "@/lib/data/homepage";
import { IndiaMap } from "./IndiaMap";
import styles from "./PortfolioPresence.module.css";
import { cx } from "../ui/cx";

export function PortfolioPresence() {
  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [tooltip, setTooltip] = useState<MapLocation | null>(null);

  return (
    <section className={styles.section} aria-labelledby="portfolio-presence-title">
      <Container>
        <Grid className={styles.grid}>
          <GridItem span={5} className={styles.content}>
            <Eyebrow>{portfolioPresence.eyebrow}</Eyebrow>
            <Heading variant="section" id="portfolio-presence-title">
              {portfolioPresence.heading}
            </Heading>
            <Lede>{portfolioPresence.lede}</Lede>
            <ol className={styles.zoneList}>
              {zones.map((zone) => {
                const active = activeZone === zone.id;
                return (
                  <li key={zone.id}>
                    <div
                      className={cx(styles.zoneRow, active && styles.zoneRowActive)}
                      onMouseEnter={() => setActiveZone(zone.id)}
                      onMouseLeave={() => setActiveZone(null)}
                    >
                      <span className={cx("text-label-meta", styles.zoneLabel)}>
                        {zone.name} zone
                      </span>
                      <span className={styles.zoneFact}>{zone.fact}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </GridItem>
          <GridItem span={7} className={styles.mapColumn}>
            <IndiaMap
              locations={mapLocations}
              activeZone={activeZone}
              tooltip={tooltip}
              onLocationEnter={setTooltip}
              onLocationLeave={() => setTooltip(null)}
            />
          </GridItem>
        </Grid>
        <VisuallyHidden>
          <p>NDR Smart Spaces locations: </p>
          <ul>
            {mapLocations.map((location) => (
              <li key={location.name}>
                {location.name}, {location.line} ({location.zone} zone)
              </li>
            ))}
          </ul>
        </VisuallyHidden>
      </Container>
    </section>
  );
}
