import { Container, Grid, GridItem } from "@/components/layout";
import { esgFramework } from "@/lib/data/esg";
import { EsgBand } from "./EsgBand";
import { PillarMark } from "./PillarMark";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./EsgFramework.module.css";

const PILLAR_COLORS = [styles.colorMaroon, styles.colorBronze, styles.colorTeal, styles.colorPlum];

export function EsgFramework() {
  return (
    <section className={styles.section} id="framework" aria-labelledby="esg-framework-title">
      <EsgBand
        id="esg-framework-title"
        heading={esgFramework.heading}
        lede={esgFramework.lede}
        image={esgFramework.image}
        align="right"
      />
      <Container className={styles.content}>
        <Grid className={styles.pillars}>
          {esgFramework.pillars.map((pillar, index) => (
            <GridItem
              key={pillar.key}
              span={3}
              className={cx(styles.pillar, PILLAR_COLORS[index % PILLAR_COLORS.length])}
              id={`pillar-${pillar.key}`}
            >
              {/* Outside the Reveal: its transform would otherwise become the mark's */}
              {/* positioning box mid-animation and shift it until the fade ends.    */}
              <PillarMark pillarKey={pillar.key} />
              <Reveal delay={(index + 1) as RevealDelay}>
                <span className={styles.chapter} aria-hidden="true">
                  {pillar.chapter}
                </span>
                <h3 className={styles.name}>{pillar.name}</h3>
                <p className={styles.focus}>{pillar.focus}</p>
                <ol className={styles.items}>
                  {pillar.items.map((item) => (
                    <li key={item.ref} className={styles.item}>
                      <div className={styles.itemBody}>
                        <span className={styles.itemLabel}>{item.label}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </section>
  );
}
