import { Container } from "@/components/layout";
import { Button, Eyebrow, Heading } from "@/components/ui";
import { aveAcresClosing } from "@/lib/data/business";
import { Reveal } from "./Reveal";
import styles from "./AveAcresExplore.module.css";

export function AveAcresExplore() {
  return (
    <section className={styles.section} aria-labelledby="ave-acres-explore-title">
      <Container>
        <Reveal>
          <div className={styles.panel}>
            <div className={styles.copy}>
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>{aveAcresClosing.eyebrow}</Eyebrow>
              <Heading variant="sub" id="ave-acres-explore-title">
                {aveAcresClosing.heading}
              </Heading>
              <p className={styles.body}>{aveAcresClosing.description}</p>
            </div>

            <div className={styles.cta}>
              <Button href={aveAcresClosing.cta.href} target="_blank" rel="noreferrer">
                {aveAcresClosing.cta.label}
              </Button>
              <span className={styles.domain}>aveacres.com</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
