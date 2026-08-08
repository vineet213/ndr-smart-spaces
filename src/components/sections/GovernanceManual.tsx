import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { governance } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./GovernanceManual.module.css";

function RegisterRow({ label }: { label: string }) {
  return (
    <li className={styles.registerRow}>
      <span className={styles.registerLabel}>{label}</span>
      <span className={styles.registerStatus}>
        Records being filed · publish as approvals land.
      </span>
    </li>
  );
}

export function GovernanceManual() {
  const { framework, board, committees, policies } = governance;

  return (
    <>
      <section className={styles.frameworkSection} aria-labelledby="governance-framework-title">
        <Container>
          <Reveal>
            <Eyebrow>{framework.eyebrow}</Eyebrow>
            <Heading variant="section" id="governance-framework-title" className={styles.heading}>
              {framework.heading}
            </Heading>
            <Lede className={styles.statement}>{framework.statement}</Lede>
          </Reveal>

          <ol className={styles.rows}>
            {framework.rows.map((row, index) => (
              <Reveal
                key={row.label}
                as="li"
                delay={(index % 3) as 0 | 1 | 2}
                className={styles.row}
              >
                <div className={styles.rowInner}>
                  <h3 className={styles.label}>{row.label}</h3>
                  <p className={styles.note}>{row.note}</p>
                  <SourceFootnote className={styles.source}>{row.source}</SourceFootnote>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className={styles.registerSection} aria-labelledby="governance-registers-title">
        <Container>
          <Reveal>
            <Eyebrow>Registers</Eyebrow>
            <Heading variant="section" id="governance-registers-title" className={styles.heading}>
              What is on record.
            </Heading>
            <Lede className={styles.statement}>
              The board, its committees and the company&apos;s policies — each with its documentary
              reference.
            </Lede>
          </Reveal>

          <Reveal className={styles.register}>
            <h3 className={styles.registerTitle}>Board of directors</h3>
            {board.length > 0 ? (
              <ol className={styles.boardGrid}>
                {board.map((member) => (
                  <li key={member.id} className={styles.boardSlot}>
                    <h4 className={styles.boardName}>{member.name}</h4>
                    <p className={styles.boardRole}>{member.role}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className={styles.rows}>
                <RegisterRow label="Board register" />
              </ol>
            )}
          </Reveal>

          <Reveal className={styles.register}>
            <h3 className={styles.registerTitle}>Committees</h3>
            {committees.length > 0 ? (
              <ol className={styles.rows}>
                {committees.map((committee) => (
                  <li key={committee.id} className={styles.row}>
                    <div className={styles.rowInner}>
                      <h4 className={styles.label}>{committee.name}</h4>
                      <p className={styles.note}>{committee.charter}</p>
                      <SourceFootnote className={styles.source}>
                        {committee.status === "published" ? "Active" : "Pending filing"}
                      </SourceFootnote>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className={styles.rows}>
                <RegisterRow label="Committee register" />
              </ol>
            )}
          </Reveal>

          <Reveal className={styles.register}>
            <h3 className={styles.registerTitle}>Policies</h3>
            {policies.length > 0 ? (
              <ol className={styles.rows}>
                {policies.map((policy) => (
                  <li key={policy.ref} className={styles.row}>
                    <div className={styles.rowInner}>
                      <h4 className={styles.label}>{policy.title}</h4>
                      <p className={styles.note}>{policy.asOn}</p>
                      <SourceFootnote className={styles.source}>{policy.ref}</SourceFootnote>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <ol className={styles.rows}>
                {governance.policyCategories.map((category) => (
                  <RegisterRow key={category} label={category} />
                ))}
              </ol>
            )}
          </Reveal>

          <SourceFootnote className={styles.note}>{governance.note}</SourceFootnote>
        </Container>
      </section>
    </>
  );
}
