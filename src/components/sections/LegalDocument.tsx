import { Container, Section } from "@/components/layout";
import { Lede } from "@/components/ui";
import type { LegalDocumentData } from "@/lib/data/legal";
import styles from "./LegalDocument.module.css";

export function LegalDocument({ doc }: { doc: LegalDocumentData }) {
  return (
    <>
      <Section tone="charcoal" ariaLabelledby="legal-document-title" className={styles.cover}>
        <Container>
          <div className={styles.coverInner}>
            <h1 id="legal-document-title" className={styles.title}>
              {doc.title}
            </h1>
            <Lede tone="dark" className={styles.lede}>
              {doc.lede}
            </Lede>
            <p className={styles.edition}>{doc.edition}</p>
          </div>
        </Container>
      </Section>

      <Section className={styles.body}>
        <Container>
          <div className={styles.bodyInner}>
            {doc.sections.map((section, index) => (
              <div key={section.heading} className={styles.block}>
                <div className={styles.blockMeta} aria-hidden="true">
                  <span className={styles.blockIndex}>{String(index + 1).padStart(2, "0")}</span>
                  <span className={styles.blockRule} />
                </div>
                <div className={styles.blockContent}>
                  <h2 className={styles.heading}>{section.heading}</h2>
                  <div className={styles.paragraphs}>
                    {section.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 48)} className={styles.paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.list ? (
                    <ul className={styles.list}>
                      {section.list.map((item) => (
                        <li key={item.slice(0, 48)} className={styles.listItem}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
