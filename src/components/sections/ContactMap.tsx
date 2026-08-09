import type { CSSProperties } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { ExternalLink } from "@/components/ui";
import { contactMap } from "@/lib/data/contact";
import { ContactDocHeader } from "./ContactDocHeader";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./ContactMap.module.css";

const VIEWBOX = `${contactMap.mapViewbox.width} ${contactMap.mapViewbox.height}`;

function formatCoordinate(value: number): string {
  return value.toFixed(4).replace(/\.?0+$/, "");
}

export function ContactMap() {
  return (
    <section className={styles.section} id="location" aria-labelledby="contact-map-title">
      <Container>
        <Reveal>
          <ContactDocHeader numeral="03" code="Office locations" tone="dark" />
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

          <div className={styles.legend}>
            <span className={styles.legendLabel}>Legend</span>
            <ul className={styles.legendList}>
              {contactMap.legend.map((item) => (
                <li key={item.key} className={styles.legendItem}>
                  <span
                    className={cx(styles.legendMark, item.key === "hq" && styles.legendMarkHq)}
                    aria-hidden="true"
                  />
                  <span className={styles.legendText}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.caption}>
            <p className={styles.captionLead}>{contactMap.captionLead}</p>
            <p className={styles.captionDetail}>{contactMap.captionDetail}</p>
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
