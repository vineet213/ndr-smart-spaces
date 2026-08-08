import { Container } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { safeHarbour } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./SafeHarbourBlock.module.css";

export function SafeHarbourBlock() {
  return (
    <section className={styles.section} id="safe-harbour" aria-labelledby="safe-harbour-title">
      <Container>
        <Reveal>
          <Eyebrow className={styles.eyebrow}>{safeHarbour.eyebrow}</Eyebrow>
          <Heading variant="section" id="safe-harbour-title" className={styles.heading}>
            {safeHarbour.heading}
          </Heading>
          <p className={styles.paragraph}>{safeHarbour.paragraph}</p>
        </Reveal>
      </Container>
    </section>
  );
}
