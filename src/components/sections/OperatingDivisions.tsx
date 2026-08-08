import { Container, Section } from "@/components/layout";
import { businessChapters, divisions } from "@/lib/data/business";
import { ChapterOpener } from "./ChapterOpener";
import { DivisionPlate } from "./DivisionPlate";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import { WarehousePlate } from "./WarehousePlate";
import styles from "./OperatingDivisions.module.css";

export function OperatingDivisions() {
  return (
    <Section tone="dim" id="verticals" ariaLabelledby="verticals-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterOpener chapter={businessChapters[0]} headingId="verticals-title" />
        </Reveal>
        <Reveal delay={1}>
          <WarehousePlate />
        </Reveal>
        <Reveal delay={2}>
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
