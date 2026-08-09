"use client";

import type { CSSProperties } from "react";
import { Container, Grid, GridItem } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { esgImpactMap } from "@/lib/data/esg";
import type { ImpactCategory } from "@/lib/data/esg";
import { useInView } from "@/hooks/useInView";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./EsgImpactMap.module.css";

const VIEWBOX = `${esgImpactMap.mapViewbox.width} ${esgImpactMap.mapViewbox.height}`;

const categoryColor = (category: ImpactCategory): string =>
  esgImpactMap.categories.find((item) => item.key === category)?.color ?? "#f0b65a";

const categoryLabel = (category: ImpactCategory): string =>
  esgImpactMap.categories.find((item) => item.key === category)?.label ?? category;

export function EsgImpactMap() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const { initiatives, categories } = esgImpactMap;

  return (
    <section className={styles.section} id="impact-map" aria-labelledby="esg-impact-map-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="07" code="REF 07 · IMPACT MAP" tone="dark" />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {esgImpactMap.eyebrow}
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="esg-impact-map-title"
            className={styles.heading}
          >
            {esgImpactMap.heading}
          </Heading>
          <Lede tone="dark" className={styles.lede}>
            {esgImpactMap.lede}
          </Lede>
        </Reveal>

        <div ref={ref} className={cx(styles.mapWrap, inView && styles.isInView)}>
          <svg
            viewBox={`0 0 ${VIEWBOX}`}
            className={styles.map}
            role="img"
            aria-label="Schematic map of India showing sustainability initiatives by category — energy, water, waste, green building and community."
            focusable="false"
          >
            <path className={styles.outline} d={esgImpactMap.indiaOutline} />
            <g className={styles.markers}>
              {initiatives.map((initiative, index) => {
                const color = categoryColor(initiative.category);
                return (
                  <g
                    key={initiative.id}
                    transform={`translate(${initiative.x} ${initiative.y})`}
                    style={{ "--i": index, "--marker": color } as CSSProperties}
                  >
                    <circle r={13} className={styles.halo} />
                    <circle r={6} className={styles.marker} />
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div className={styles.caption}>
          <p className={styles.captionLead}>{esgImpactMap.captionLead}</p>
          <p className={styles.captionDetail}>{esgImpactMap.captionDetail}</p>
          <p className={styles.notToScale}>{esgImpactMap.notToScale}</p>
        </div>

        <ul className={styles.legend}>
          {categories.map((category) => {
            const count = initiatives.filter((item) => item.category === category.key).length;
            return (
              <li key={category.key} className={styles.legendEntry}>
                <span
                  className={styles.swatch}
                  style={{ backgroundColor: category.color }}
                  aria-hidden="true"
                />
                <span className={styles.legendLabel}>{category.label}</span>
                <span className={styles.legendCount}>{count}</span>
              </li>
            );
          })}
        </ul>

        <ol className={styles.register}>
          {initiatives.map((initiative, index) => (
            <Reveal
              key={initiative.id}
              as="li"
              delay={(index % 3) as RevealDelay}
              className={styles.row}
            >
              <span className={styles.rowCode}>{initiative.code}</span>
              <div className={styles.rowBody}>
                <h3 className={styles.rowName}>{initiative.name}</h3>
                <p className={styles.rowPlace}>
                  {initiative.place}, {initiative.region}
                </p>
                <p className={styles.rowNote}>{initiative.note}</p>
              </div>
              <div className={styles.rowMeta}>
                <span
                  className={styles.categoryBadge}
                  style={{ color: categoryColor(initiative.category) }}
                >
                  <span
                    className={styles.categoryDot}
                    style={{ backgroundColor: categoryColor(initiative.category) }}
                    aria-hidden="true"
                  />
                  {categoryLabel(initiative.category)}
                </span>
                <span className={styles.rowStatus}>{initiative.status}</span>
              </div>
            </Reveal>
          ))}
        </ol>

        <SourceFootnote tone="dark" className={styles.source}>
          {esgImpactMap.source}
        </SourceFootnote>
      </Container>
    </section>
  );
}
