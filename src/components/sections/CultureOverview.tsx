import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { cultureOverview } from "@/lib/data/careers";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./CultureOverview.module.css";

/**
 * Corporate Culture overview: the business verticals' overview (heading,
 * then a lead sentence on a maroon rule) with the team photograph beside it
 * in the framed plate used on the homepage and About pages.
 */
export function CultureOverview() {
  const { eyebrow, heading, lead, body, image, chip } = cultureOverview;

  return (
    <section className={styles.section} id="overview" aria-labelledby="culture-overview-title">
      <Container>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <Reveal>
              <div className={styles.head}>
                <Eyebrow>{eyebrow}</Eyebrow>
                <Reveal variant="wipe">
                  <h2 id="culture-overview-title" className={styles.heading}>
                    {heading}
                  </h2>
                </Reveal>
              </div>
            </Reveal>
            <div className={styles.body}>
              <Reveal delay={1}>
                <p className={styles.lead}>{lead}</p>
              </Reveal>
              {body.map((paragraph, index) => (
                <Reveal key={index} delay={(index + 2) as RevealDelay}>
                  <p className={styles.paragraph}>{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <figure className={styles.figure}>
            <div className={styles.plateWrap}>
              <span className={styles.plateFrame} aria-hidden="true" />
              <Reveal variant="unmask" className={styles.plateReveal}>
                <div className={styles.plate}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1023px) 100vw, 42vw"
                    loading="eager"
                    className={styles.image}
                  />
                </div>
              </Reveal>
              <span className={styles.chip} aria-hidden="true">
                <span className={styles.chipLabel}>{chip.label}</span>{" "}
                <span className={styles.chipValue}>{chip.value}</span>
              </span>
            </div>
          </figure>
        </div>
      </Container>
    </section>
  );
}
