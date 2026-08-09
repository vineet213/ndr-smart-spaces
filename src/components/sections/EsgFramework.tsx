import { Container, Grid, GridItem } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { esgFramework } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./EsgFramework.module.css";

export function EsgFramework() {
  return (
    <section className={styles.section} id="framework" aria-labelledby="esg-framework-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="02" code="REF 02 · FRAMEWORK" />
          <Eyebrow className={styles.eyebrow}>{esgFramework.eyebrow}</Eyebrow>
          <Heading variant="section" id="esg-framework-title" className={styles.heading}>
            {esgFramework.heading}
          </Heading>
          <Lede className={styles.lede}>{esgFramework.lede}</Lede>
        </Reveal>

        <Grid className={styles.pillars}>
          {esgFramework.pillars.map((pillar, index) => (
            <GridItem key={pillar.key} span={4} className={styles.pillar}>
              <Reveal delay={(index + 1) as RevealDelay}>
                <span className={styles.chapter} aria-hidden="true">
                  {pillar.chapter}
                </span>
                <h3 className={styles.name}>{pillar.name}</h3>
                <p className={styles.focus}>{pillar.focus}</p>
                <ol className={styles.items}>
                  {pillar.items.map((item) => (
                    <li key={item.ref} className={styles.item}>
                      <span className={styles.itemRef}>{item.ref}</span>
                      <div className={styles.itemBody}>
                        <span className={styles.itemLabel}>{item.label}</span>
                        <span className={styles.itemNote}>{item.note}</span>
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
