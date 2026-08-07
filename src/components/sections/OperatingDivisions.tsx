import { Container, Section } from "@/components/layout";
import { divisions } from "@/lib/data/business";
import { ChapterHeader } from "./ChapterHeader";
import { DivisionPlate } from "./DivisionPlate";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import styles from "./OperatingDivisions.module.css";

export function OperatingDivisions() {
  return (
    <Section tone="dim" id="verticals" ariaLabelledby="verticals-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterHeader
            numeral="01"
            eyebrow="Operating Verticals"
            heading="What the company runs."
            headingId="verticals-title"
            lede="Three operating divisions, documented as spec sheets — what each one is, and what it delivers."
          />
          <div className={styles.plates}>
            {divisions.map((division) => (
              <DivisionPlate key={division.index} division={division} />
            ))}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
