import { Container } from "@/components/layout";
import { Body, Eyebrow, ExternalLink, Heading, SourceFootnote } from "@/components/ui";
import { invitRelationship } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./InvITRelationship.module.css";

export function InvITRelationship() {
  return (
    <section className={styles.section} aria-labelledby="invit-relationship-title">
      <Container>
        <Reveal>
          <div className={styles.docHeader}>
            <span className={styles.numeral} aria-hidden="true">
              05
            </span>
            <span className={styles.ref}>REF 05 · SPONSOR & INVIT</span>
          </div>
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {invitRelationship.eyebrow}
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="invit-relationship-title"
            className={styles.heading}
          >
            {invitRelationship.heading}
          </Heading>
          {invitRelationship.body.map((paragraph) => (
            <Body key={paragraph.slice(0, 24)} tone="dark" className={styles.body}>
              {paragraph}
            </Body>
          ))}
          <div className={styles.linkRow}>
            <ExternalLink tone="dark" href={invitRelationship.external.href}>
              {invitRelationship.external.label}
            </ExternalLink>
          </div>
          <SourceFootnote tone="dark" className={styles.note}>
            {invitRelationship.note}
          </SourceFootnote>
        </Reveal>
      </Container>
    </section>
  );
}
