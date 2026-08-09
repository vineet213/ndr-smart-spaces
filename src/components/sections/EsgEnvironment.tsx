import { Container, Grid, GridItem } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { esgEnvironment } from "@/lib/data/esg";
import type { EsgEnvironmentMetric } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./EsgEnvironment.module.css";

function EnvironmentMetric({ metric, index }: { metric: EsgEnvironmentMetric; index: number }) {
  return (
    <GridItem span={4} className={styles.metricCell}>
      <Reveal delay={(index % 3) as RevealDelay}>
        <p className={styles.value}>
          <span className={styles.number}>{metric.value}</span>
          <span className={styles.unit}>{metric.unit}</span>
        </p>
        <p className={styles.stat}>{metric.stat}</p>
        <p className={styles.period}>
          {metric.period}
          {metric.draft ? <span className={styles.draft}>*</span> : null}
        </p>
        <SourceFootnote tone="dark" className={styles.source}>
          {metric.source}
        </SourceFootnote>
      </Reveal>
    </GridItem>
  );
}

export function EsgEnvironment() {
  return (
    <section className={styles.section} id="environmental" aria-labelledby="esg-environment-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="03" code="REF 03 · ENVIRONMENT" tone="dark" />
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {esgEnvironment.eyebrow}
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="esg-environment-title"
            className={styles.heading}
          >
            {esgEnvironment.heading}
          </Heading>
          <Lede tone="dark" className={styles.lede}>
            {esgEnvironment.lede}
          </Lede>
        </Reveal>

        <Grid className={styles.metrics}>
          {esgEnvironment.metrics.map((metric, index) => (
            <EnvironmentMetric key={metric.id} metric={metric} index={index} />
          ))}
        </Grid>

        <p className={styles.note}>{esgEnvironment.note}</p>

        <ol className={styles.categories}>
          {esgEnvironment.categories.map((category, index) => {
            const metric = esgEnvironment.metrics.find((item) => item.id === category.metricId);
            return (
              <Reveal
                key={category.code}
                as="li"
                delay={(index % 3) as RevealDelay}
                className={styles.category}
              >
                <span className={styles.categoryCode}>{category.code}</span>
                <div className={styles.categoryBody}>
                  <h3 className={styles.categoryTitle}>{category.title}</h3>
                  <p className={styles.categoryText}>{category.body}</p>
                </div>
                {metric ? (
                  <p className={styles.categoryMetric}>
                    {metric.stat}: {metric.value}
                    {metric.unit}
                    {metric.draft ? <span className={styles.draft}>*</span> : null}
                  </p>
                ) : null}
              </Reveal>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
