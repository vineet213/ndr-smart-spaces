"use client";

import { Container, Grid, GridItem } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { esgDashboard } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal } from "./Reveal";
import { EsgTrendChart } from "../visualizations/EsgTrendChart";
import { EsgGoalProgress } from "../visualizations/EsgGoalProgress";
import { EsgCompositionBar } from "../visualizations/EsgCompositionBar";
import styles from "./EsgDashboard.module.css";

export function EsgDashboard() {
  const { trends, goals, composition } = esgDashboard;
  const [heroTrend, ...sideTrends] = trends;

  return (
    <section className={styles.section} id="dashboard" aria-labelledby="esg-dashboard-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="06" code="REF 06 · DASHBOARD" />
          <Eyebrow className={styles.eyebrow}>{esgDashboard.eyebrow}</Eyebrow>
          <Heading variant="section" id="esg-dashboard-title" className={styles.heading}>
            {esgDashboard.heading}
          </Heading>
          <Lede className={styles.lede}>{esgDashboard.lede}</Lede>
          <p className={styles.note}>{esgDashboard.note}</p>
        </Reveal>

        <div className={styles.block}>
          <p className={styles.blockLabel}>Trends</p>
          <div className={styles.heroCard}>
            <Reveal>
              <div className={styles.cardHead}>
                <span className={styles.cardCode}>{heroTrend.code}</span>
                <h3 className={styles.cardTitle}>{heroTrend.title}</h3>
                <span className={styles.cardUnit}>{heroTrend.unit}</span>
              </div>
              <EsgTrendChart trend={heroTrend} />
            </Reveal>
          </div>
          <Grid className={styles.sideGrid}>
            {sideTrends.map((trend) => (
              <GridItem key={trend.id} span={6} className={styles.sideCard}>
                <Reveal>
                  <div className={styles.cardHead}>
                    <span className={styles.cardCode}>{trend.code}</span>
                    <h3 className={styles.cardTitle}>{trend.title}</h3>
                    <span className={styles.cardUnit}>{trend.unit}</span>
                  </div>
                  <EsgTrendChart trend={trend} />
                </Reveal>
              </GridItem>
            ))}
          </Grid>
        </div>

        <div className={styles.block}>
          <p className={styles.blockLabel}>Targets</p>
          <div className={styles.goals}>
            {goals.map((goal) => (
              <EsgGoalProgress key={goal.id} goal={goal} />
            ))}
          </div>
        </div>

        <div className={styles.block}>
          <p className={styles.blockLabel}>Composition</p>
          <Grid className={styles.compositionGrid}>
            {composition.map((item) => (
              <GridItem key={item.id} span={4} className={styles.compositionCard}>
                <Reveal>
                  <EsgCompositionBar composition={item} />
                </Reveal>
              </GridItem>
            ))}
          </Grid>
        </div>
      </Container>
    </section>
  );
}
