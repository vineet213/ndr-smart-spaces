import Image from "next/image";
import { Container } from "@/components/layout";
import { Button, Eyebrow, Heading } from "@/components/ui";
import { aveAcresClosing } from "@/lib/data/business";
import { Reveal } from "./Reveal";
import styles from "./AveAcresExplore.module.css";

/* Closing band for Residential Plotting: the aerial view of a plotted layout */
/* as a darkened backdrop, with the invitation to Ave Acres over it.          */
export function AveAcresExplore() {
  return (
    <section className={styles.section} aria-labelledby="ave-acres-explore-title">
      <Image
        src="/videos/residential-plotting/masthead-poster.jpg"
        alt=""
        fill
        sizes="100vw"
        className={styles.backdrop}
      />
      <div className={styles.scrim} aria-hidden="true" />
      <Container className={styles.inner}>
        <Reveal>
          <div className={styles.panel}>
            <div className={styles.copy}>
              <Eyebrow tone="dark">{aveAcresClosing.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="ave-acres-explore-title">
                {aveAcresClosing.heading}
              </Heading>
              <p className={styles.body}>{aveAcresClosing.description}</p>
            </div>

            <div className={styles.cta}>
              <Button href={aveAcresClosing.cta.href} target="_blank" rel="noreferrer" tone="dark">
                {aveAcresClosing.cta.label}
              </Button>{" "}
              <span className={styles.domain}>
                {aveAcresClosing.cta.href.replace(/^https?:\/\/|\/$/g, "")}
              </span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
