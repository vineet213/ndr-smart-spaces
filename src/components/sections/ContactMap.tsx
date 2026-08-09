import type { CSSProperties, ReactNode } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { ExternalLink } from "@/components/ui";
import { contactMap } from "@/lib/data/contact";
import { Reveal } from "./Reveal";
import styles from "./ContactMap.module.css";

const VIEWBOX = `${contactMap.mapViewbox.width} ${contactMap.mapViewbox.height}`;

function formatCoordinate(value: number): string {
  return value.toFixed(4).replace(/\.?0+$/, "");
}

function EdgeTicks() {
  const W = contactMap.mapViewbox.width;
  const H = contactMap.mapViewbox.height;
  const ticks: ReactNode[] = [];
  for (let x = 0; x <= W; x += 80) {
    ticks.push(<line key={`t${x}`} x1={x} y1={0} x2={x} y2={7} />);
    ticks.push(<line key={`b${x}`} x1={x} y1={H} x2={x} y2={H - 7} />);
  }
  for (let y = 0; y <= H; y += 80) {
    ticks.push(<line key={`l${y}`} x1={0} y1={y} x2={7} y2={y} />);
    ticks.push(<line key={`r${y}`} x1={W} y1={y} x2={W - 7} y2={y} />);
  }
  return <g className={styles.ticks}>{ticks}</g>;
}

export function ContactMap() {
  return (
    <section className={styles.section} id="location" aria-labelledby="contact-map-title">
      <Container>
        <Reveal>
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {contactMap.eyebrow}
          </Eyebrow>
          <Heading variant="section" tone="dark" id="contact-map-title" className={styles.heading}>
            {contactMap.heading}
          </Heading>
          <Lede tone="dark" className={styles.lede}>
            {contactMap.lede}
          </Lede>
        </Reveal>

        <div className={styles.plate}>
          <div className={styles.frame}>
            <span className={styles.mark}>{contactMap.frameMark}</span>
            <span className={styles.plateRef}>{contactMap.plateRef}</span>
            <svg
              viewBox={`0 0 ${VIEWBOX}`}
              className={styles.map}
              role="img"
              aria-label="Schematic map of India showing the NDR Smart Spaces corporate office in Chennai."
              focusable="false"
            >
              <EdgeTicks />
              <path className={styles.outline} d={contactMap.indiaOutline} />
              <g className={styles.markers}>
                {contactMap.markers.map((marker, index) => (
                  <g
                    key={marker.id}
                    transform={`translate(${marker.x} ${marker.y})`}
                    style={{ "--i": index } as CSSProperties}
                  >
                    <circle r={20} className={styles.halo} />
                    <circle r={9} className={styles.marker} />
                  </g>
                ))}
              </g>
            </svg>
          </div>

          <div className={styles.locator}>
            {contactMap.markers.map((marker) => (
              <div key={marker.id} className={styles.locatorRow}>
                <span className={styles.locatorName}>
                  {marker.name} — {marker.place}, {marker.region}
                </span>
                <span className={styles.locatorCoords}>
                  {formatCoordinate(marker.lat)}° N · {formatCoordinate(marker.lon)}° E
                </span>
              </div>
            ))}
          </div>

          <div className={styles.caption}>
            <p className={styles.notToScale}>{contactMap.notToScale}</p>
          </div>

          <ExternalLink href={contactMap.directions.href} className={styles.directions}>
            {contactMap.directions.label}
          </ExternalLink>
        </div>

        <SourceFootnote tone="dark" className={styles.source}>
          {contactMap.source}
        </SourceFootnote>
      </Container>
    </section>
  );
}
