"use client";

import { useMemo } from "react";
import { Container, Grid, GridItem } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { esgImpactMap } from "@/lib/data/esg";
import type { ImpactCategory, ImpactInitiative } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./EsgImpactMap.module.css";

const categoryColor = (category: ImpactCategory): string =>
  esgImpactMap.categories.find((item) => item.key === category)?.color ?? "#f0b65a";

const categoryLabel = (category: ImpactCategory): string =>
  esgImpactMap.categories.find((item) => item.key === category)?.label ?? category;

type SiteGroup = {
  place: string;
  region: string;
  initiatives: ImpactInitiative[];
};

export function EsgImpactMap() {
  const { initiatives, categories } = esgImpactMap;

  const siteGroups = useMemo(() => {
    const grouped = new Map<string, SiteGroup>();
    for (const initiative of initiatives) {
      const key = `${initiative.place}::${initiative.region}`;
      if (!grouped.has(key)) {
        grouped.set(key, {
          place: initiative.place,
          region: initiative.region,
          initiatives: [],
        });
      }
      grouped.get(key)!.initiatives.push(initiative);
    }
    return Array.from(grouped.values());
  }, [initiatives]);

  return (
    <section
      className={styles.section}
      id="initiatives-on-site"
      aria-labelledby="esg-initiatives-title"
    >
      <Container>
        <Reveal>
          <EsgDocHeader numeral="03" code="REF 03 · INITIATIVES ON SITE" tone="dark" />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            ESG initiatives on site
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="esg-initiatives-title"
            className={styles.heading}
          >
            Where the work happens.
          </Heading>
          <Lede tone="dark" className={styles.lede}>
            Each property hosts a measured set of sustainability initiatives — tracked by category,
            verified by status and recorded as part of the ESG register.
          </Lede>
        </Reveal>

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

        <div className={styles.sites}>
          {siteGroups.map((site, groupIndex) => (
            <Reveal
              key={`${site.place}-${site.region}`}
              delay={(groupIndex % 3) as RevealDelay}
              className={styles.siteCard}
            >
              <div className={styles.siteHeader}>
                <h3 className={styles.siteName}>{site.place}</h3>
                <span className={styles.siteRegion}>{site.region}</span>
              </div>
              <ul className={styles.siteInitiatives}>
                {site.initiatives.map((initiative) => (
                  <li key={initiative.id} className={styles.initiative}>
                    <span className={styles.initiativeCode}>{initiative.code}</span>
                    <div className={styles.initiativeBody}>
                      <span className={styles.initiativeName}>{initiative.name}</span>
                      <p className={styles.initiativeNote}>{initiative.note}</p>
                    </div>
                    <div className={styles.initiativeMeta}>
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
                      <span className={styles.initiativeStatus}>{initiative.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <SourceFootnote tone="dark" className={styles.source}>
          {esgImpactMap.source}
        </SourceFootnote>
      </Container>
    </section>
  );
}
