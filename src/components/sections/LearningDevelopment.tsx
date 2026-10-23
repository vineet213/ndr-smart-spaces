import { Container } from "@/components/layout";
import { learningDevelopment } from "@/lib/data/careers";
import { DevelopmentLifecycle } from "./DevelopmentLifecycle";
import { SheetHeader } from "./SheetHeader";
import styles from "./LearningDevelopment.module.css";

/**
 * Learning & development: an intro, then the pinned picture-and-text scroll
 * sequence from the Development Lifecycle page with one step per practice.
 */
export function LearningDevelopment() {
  return (
    <div className={styles.wrap} id="learning">
      <section className={styles.intro} aria-labelledby="learning-title">
        <Container>
          <SheetHeader
            sheet="03"
            of="03"
            eyebrow={learningDevelopment.eyebrow}
            heading={learningDevelopment.heading}
            headingId="learning-title"
            lede={learningDevelopment.lede}
          />
        </Container>
      </section>
      <DevelopmentLifecycle
        stages={learningDevelopment.stages}
        source=""
        label="Learning and development"
        stepWord="Step"
        finale={false}
      />
    </div>
  );
}
