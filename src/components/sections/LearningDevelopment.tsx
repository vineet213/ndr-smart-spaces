import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container } from "@/components/layout";
import { learningDevelopment } from "@/lib/data/careers";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import { SheetHeader } from "./SheetHeader";
import styles from "./LearningDevelopment.module.css";

/**
 * Learning & development: one row per practice, picture and text side by
 * side, alternating sides down the page.
 */
export function LearningDevelopment() {
  const { stages } = learningDevelopment;
  const total = String(stages.length).padStart(2, "0");

  return (
    <section className={styles.section} id="learning" aria-labelledby="learning-title">
      <Container>
        <SheetHeader
          sheet="03"
          of="03"
          eyebrow={learningDevelopment.eyebrow}
          heading={learningDevelopment.heading}
          headingId="learning-title"
          lede={learningDevelopment.lede}
        />

        <ol className={styles.steps}>
          {stages.map((stage, index) => (
            <li key={stage.index} className={cx(styles.step, index % 2 === 1 && styles.flipped)}>
              <Reveal variant="unmask" className={styles.photo}>
                <Image
                  src={stage.image.src}
                  alt={stage.image.alt}
                  fill
                  sizes="(max-width: 767px) 100vw, 50vw"
                  className={styles.image}
                />
              </Reveal>
              <Reveal className={styles.copy}>
                <p className={styles.meta}>
                  <span className={styles.rule} aria-hidden="true" />
                  Step {stage.index}
                  <span className={styles.total}> / {total}</span>
                </p>
                <h3 className={styles.title}>{stage.title}</h3>
                <p className={styles.body}>{stage.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
