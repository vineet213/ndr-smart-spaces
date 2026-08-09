import { Container } from "@/components/layout";
import { Body, Eyebrow, Heading } from "@/components/ui";
import { pressContact } from "@/lib/data/media";
import { MediaDocHeader } from "./MediaDocHeader";
import { Reveal } from "./Reveal";
import styles from "./PressContact.module.css";

export function PressContact() {
  return (
    <section className={styles.section} id="press-contact" aria-labelledby="press-contact-title">
      <Container>
        <Reveal>
          <MediaDocHeader numeral="05" code="REF 05 · PRESS CONTACT" />
          <Eyebrow className={styles.eyebrow}>{pressContact.eyebrow}</Eyebrow>
          <Heading variant="section" id="press-contact-title" className={styles.heading}>
            {pressContact.heading}
          </Heading>
          <Body className={styles.body}>{pressContact.body}</Body>
        </Reveal>

        <div className={styles.response}>
          <span className={styles.responseLabel}>{pressContact.response.label}</span>
          <span className={styles.responseValue}>{pressContact.response.value}</span>
          <span className={styles.responseClass}>{pressContact.response.classification}</span>
        </div>

        <div className={styles.registerIndex}>
          <span className={styles.registerCode}>{pressContact.registerCode}</span>
          <span className={styles.registerMeta}>Desks · {pressContact.departments.length}</span>
        </div>

        <div className={styles.directory}>
          {pressContact.departments.map((department) => (
            <a key={department.ref} className={styles.entry} href={department.href}>
              <span className={styles.entryRef}>{department.ref}</span>
              <span className={styles.entryBody}>
                <span className={styles.entryLabel}>{department.label}</span>
                <span className={styles.entryNote}>{department.note}</span>
              </span>
              <span className={styles.entryValue}>{department.value}</span>
            </a>
          ))}
        </div>

        <p className={styles.address}>{pressContact.address}</p>
      </Container>
    </section>
  );
}
