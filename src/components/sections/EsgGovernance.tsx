import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { esgGovernance, ESG_STATUS_LABELS, ESG_STATUS_TONES } from "@/lib/data/esg";
import type { EsgRegister, EsgRegisterRow } from "@/lib/data/esg";
import { EsgDocHeader } from "./EsgDocHeader";
import { Reveal, type RevealDelay } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./EsgGovernance.module.css";

function RegisterTable({ register }: { register: EsgRegister }) {
  return (
    <div className={styles.register}>
      <h3 className={styles.registerTitle}>{register.title}</h3>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Ref</th>
              <th scope="col">As on</th>
              <th scope="col">Register entry</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {register.rows.map((row: EsgRegisterRow) => (
              <tr key={row.id}>
                <td className={styles.refCell}>{row.ref}</td>
                <td className={styles.dateCell}>{row.asOn}</td>
                <td className={styles.entryCell}>
                  <span className={styles.entryName}>{row.entry}</span>
                  <span className={styles.entryNote}>{row.note}</span>
                </td>
                <td className={styles.statusCell}>
                  <span
                    className={cx(
                      styles.status,
                      ESG_STATUS_TONES[row.status] === "active"
                        ? styles.statusActive
                        : styles.statusPending,
                    )}
                  >
                    <span className={styles.statusGlyph} aria-hidden="true">
                      {ESG_STATUS_TONES[row.status] === "active" ? "●" : "—"}
                    </span>
                    {ESG_STATUS_LABELS[row.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function EsgGovernance() {
  return (
    <section className={styles.section} id="governance" aria-labelledby="esg-governance-title">
      <Container>
        <Reveal>
          <EsgDocHeader numeral="05" code="REF 05 · GOVERNANCE" />
          <Eyebrow className={styles.eyebrow}>{esgGovernance.eyebrow}</Eyebrow>
          <Heading variant="section" id="esg-governance-title" className={styles.heading}>
            {esgGovernance.heading}
          </Heading>
          <Lede className={styles.lede}>{esgGovernance.lede}</Lede>
        </Reveal>

        <ol className={styles.commitments}>
          {esgGovernance.commitments.map((commitment, index) => (
            <Reveal
              key={commitment.ref}
              as="li"
              delay={(index % 3) as RevealDelay}
              className={styles.commitment}
            >
              <span className={styles.commitmentRef}>{commitment.ref}</span>
              <div className={styles.commitmentBody}>
                <h3 className={styles.commitmentLabel}>{commitment.label}</h3>
                <p className={styles.commitmentNote}>{commitment.note}</p>
                <SourceFootnote className={styles.commitmentSource}>
                  {commitment.source}
                </SourceFootnote>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className={styles.registers}>
          {esgGovernance.registers.map((register) => (
            <RegisterTable key={register.title} register={register} />
          ))}
        </Reveal>

        <SourceFootnote className={styles.note}>{esgGovernance.note}</SourceFootnote>
      </Container>
    </section>
  );
}
