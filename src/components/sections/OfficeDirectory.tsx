import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote, TextLink } from "@/components/ui";
import { ExternalLink } from "@/components/ui";
import { officeDirectory } from "@/lib/data/contact";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./OfficeDirectory.module.css";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function OfficeDirectory() {
  return (
    <section className={styles.section} id="directory" aria-labelledby="directory-title">
      <Container>
        <Reveal>
          <Eyebrow className={styles.eyebrow}>{officeDirectory.eyebrow}</Eyebrow>
          <Heading variant="section" id="directory-title" className={styles.heading}>
            {officeDirectory.heading}
          </Heading>
          <Lede className={styles.lede}>{officeDirectory.lede}</Lede>
        </Reveal>

        <div className={styles.directory}>
          {officeDirectory.offices.map((office, index) => (
            <Reveal key={office.key} delay={(index % 3) as RevealDelay} className={styles.office}>
              <div className={styles.officeBody}>
                <span className={styles.officeKind}>{office.kind}</span>
                <h3 className={styles.officeName}>{office.name}</h3>
                <ul className={styles.lines}>
                  {office.lines.map((line) => (
                    <li key={line} className={styles.line}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.contact}>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>Phone</span>
                  <a className={styles.contactPhone} href={phoneHref(office.phone)}>
                    {office.phone}
                  </a>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>Email</span>
                  <TextLink href={office.email.href} className={styles.contactEmail}>
                    {office.email.label}
                  </TextLink>
                </div>
                <div className={styles.contactRow}>
                  <span className={styles.contactLabel}>Hours</span>
                  <span className={styles.contactHours}>{office.hours}</span>
                </div>
                {office.directions ? (
                  <ExternalLink href={office.directions.href} className={styles.directions}>
                    {office.directions.label}
                  </ExternalLink>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        <SourceFootnote className={styles.note}>{officeDirectory.note}</SourceFootnote>
      </Container>
    </section>
  );
}
