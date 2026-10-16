"use client";

import { useState } from "react";
import { Container, Grid, GridItem } from "@/components/layout";
import { Heading, Icon, TextLink, VisuallyHidden } from "@/components/ui";
import type { MapLocation, ZoneId } from "@/lib/data/homepage";
import { zones, mapLocations, portfolioPresence } from "@/lib/data/homepage";
import { IndiaMap } from "./IndiaMap";
import { Reveal, type RevealDelay } from "./Reveal";
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
            <Reveal variant="wipe">
              <Heading variant="section" tone="dark" id="portfolio-presence-title">
                {portfolioPresence.heading}
              </Heading>
            </Reveal>
            <ol className={styles.zoneList}>
              {zones.map((zone, zoneIndex) => {
                const active = activeZone === zone.id;
                return (
                  <Reveal as="li" key={zone.id} delay={(zoneIndex + 1) as RevealDelay}>
                    <div
                      className={cx(styles.zoneRow, active && styles.zoneRowActive)}
                      onMouseEnter={() => setActiveZone(zone.id)}
                      onMouseLeave={() => setActiveZone(null)}
                    >
                      <span className={cx("text-label-meta", styles.zoneLabel)}>
                        {zone.name} zone
                      </span>
                      <span className={styles.zoneFact}>{zone.cities.join(", ")}</span>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
            <TextLink
              tone="dark"
              href={portfolioPresence.viewPortfolio.href}
              className={styles.portfolioLink}
            >
              {portfolioPresence.viewPortfolio.label}
              <Icon name="arrow-up-right" className={styles.portfolioLinkArrow} />
            </TextLink>
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
