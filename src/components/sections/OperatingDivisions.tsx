import { Container, Section } from "@/components/layout";
import { divisions, verticalsChapter } from "@/lib/data/business";
import { ChapterOpener } from "./ChapterOpener";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import { VerticalHub } from "./VerticalHub";
import { WarehousePlate } from "./WarehousePlate";
import styles from "./OperatingDivisions.module.css";

export function OperatingDivisions() {
  return (
    <Section tone="dim" id="verticals" ariaLabelledby="verticals-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterOpener chapter={verticalsChapter} headingId="verticals-title" />
        </Reveal>
        <Reveal delay={1}>
          <WarehousePlate />
        </Reveal>
        <Reveal delay={2}>
          <VerticalHub divisions={divisions} />
        </Reveal>
      </Container>
    </Section>
  );
}
