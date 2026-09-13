import { Grid, GridItem } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { aboutPrinciples } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import { VisionDiagram, MissionDiagram } from "./VisionMissionArt";
import styles from "./VisionMissionValues.module.css";

export function VisionMissionValues() {
  return (
    <section className={styles.section} aria-label="Vision and mission">
      {/* Full-bleed panel row — deliberately outside Container so it spans   */}
      {/* the viewport edge to edge, per the client's full-bleed request.    */}
      <Grid className={styles.panels}>
        {aboutPrinciples.columns.map((column, index) => (
          <GridItem key={column.title} span={6}>
            <Reveal delay={(index + 1) as RevealDelay}>
              <article className={styles.panel} aria-label={column.title} tabIndex={0}>
                {column.title === "Vision" ? <VisionDiagram /> : <MissionDiagram />}
                <div className={styles.scrim} aria-hidden="true" />
                <span className={styles.curtain} aria-hidden="true" />
                <div className={styles.content}>
                  <Eyebrow tone="dark" as="span" className={styles.index}>
                    {column.index}
                  </Eyebrow>
                  <h3 className={styles.title}>{column.title}</h3>
                  <span className={styles.titleRule} aria-hidden="true" />
                  <p className={styles.body}>{column.body}</p>
                  <span className={styles.cue} aria-hidden="true">
                    <svg width="34" height="28" viewBox="0 0 34 28" fill="none" aria-hidden="true">
                      <path d="M1 27 L29 2 M22 2 H29 V9" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </div>
              </article>
            </Reveal>
          </GridItem>
        ))}
      </Grid>
    </section>
  );
}
