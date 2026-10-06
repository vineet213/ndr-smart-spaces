import type { CSSProperties } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { governance } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./GovernanceManual.module.css";

/* Same curated, on-brand hue families as the ESG "In practice" scroll cards —   */
/* maroon/bronze/teal/plum/terracotta/forest — lifted to brighter tones here so  */
/* they stay legible as foreground text/accents on this section's dark ground.  */
const ROW_ACCENTS = ["#c9636a", "#d9a35c", "#5fb8ae", "#b67ab5", "#d98a5e", "#7fae6e"] as const;

export function GovernanceManual() {
  const { framework } = governance;

  return (
    <>
      <section className={styles.frameworkSection} aria-labelledby="governance-framework-title">
        <Container>
          <Reveal>
            <Eyebrow tone="dark" className={styles.eyebrow}>
              {framework.eyebrow}
            </Eyebrow>
            <Heading
              variant="section"
              tone="dark"
              id="governance-framework-title"
              className={styles.heading}
            >
              {framework.heading}
            </Heading>
            <Lede tone="dark" className={styles.statement}>
              {framework.statement}
            </Lede>
          </Reveal>

          <ol className={styles.rows}>
            {framework.rows.map((row, index) => (
              <Reveal
                key={row.label}
                as="li"
                delay={(index % 3) as 0 | 1 | 2}
                className={styles.row}
              >
                <div
                  className={styles.rowInner}
                  style={{ "--row-accent": ROW_ACCENTS[index % ROW_ACCENTS.length] } as CSSProperties}
                >
                  <h3 className={styles.label}>{row.label}</h3>
                  <p className={styles.note}>{row.note}</p>
                  {row.documents.length > 0 ? (
                    <ul className={styles.documentList}>
                      {row.documents.map((doc) => (
                        <li key={doc.href}>
                          <a
                            className={styles.documentLink}
                            href={doc.href}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {doc.title}
                            <span className={styles.documentLinkIcon} aria-hidden="true">
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <SourceFootnote tone="dark" className={styles.source}>
                    {row.source}
                  </SourceFootnote>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
