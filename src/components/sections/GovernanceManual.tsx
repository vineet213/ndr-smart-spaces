import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { governance } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./GovernanceManual.module.css";

type RegisterTone = "active" | "pending";

type RegisterRowData = {
  id: string;
  ref: string;
  asOn: string;
  entry: string;
  note?: string;
  status: string;
  tone: RegisterTone;
};

function pendingRow(id: string, ref: string, entry: string): RegisterRowData {
  return {
    id,
    ref,
    asOn: "—",
    entry,
    note: "Records publish as approvals land.",
    status: "Pending filing",
    tone: "pending",
  };
}

function RegisterTable({ title, rows }: { title: string; rows: RegisterRowData[] }) {
  return (
    <div className={styles.register}>
      <h3 className={styles.registerTitle}>{title}</h3>
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
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={styles.refCell}>{row.ref}</td>
                <td className={styles.dateCell}>{row.asOn}</td>
                <td className={styles.entryCell}>
                  <span className={styles.entryName}>{row.entry}</span>
                  {row.note ? <span className={styles.entryNote}>{row.note}</span> : null}
                </td>
                <td className={styles.statusCell}>
                  <span
                    className={cx(
                      styles.statusMark,
                      row.tone === "active" ? styles.statusActive : styles.statusPending,
                    )}
                  >
                    <span className={styles.statusGlyph} aria-hidden="true">
                      {row.tone === "active" ? "●" : "—"}
                    </span>
                    {row.status}
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

export function GovernanceManual() {
  const { framework, board, committees, policies, policyCategories } = governance;

  const boardRows: RegisterRowData[] =
    board.length > 0
      ? board.map((member) => ({
          id: member.id,
          ref: member.id,
          asOn: "—",
          entry: member.name,
          note: member.role,
          status: "On record",
          tone: "active",
        }))
      : [pendingRow("gb", "GB", "Board register")];

  const committeeRows: RegisterRowData[] =
    committees.length > 0
      ? committees.map((committee) => ({
          id: committee.id,
          ref: committee.id,
          asOn: "—",
          entry: committee.name,
          note: committee.charter,
          status: committee.status === "published" ? "Active" : "Pending filing",
          tone: committee.status === "published" ? "active" : "pending",
        }))
      : [pendingRow("cm", "CM", "Committee register")];

  const policyRows: RegisterRowData[] =
    policies.length > 0
      ? policies.map((policy) => ({
          id: policy.ref,
          ref: policy.ref,
          asOn: policy.asOn,
          entry: policy.title,
          status: policy.status === "published" ? "On record" : "Pending filing",
          tone: policy.status === "published" ? "active" : "pending",
        }))
      : policyCategories.map((category, index) =>
          pendingRow(`pc-${index}`, `PO-${String(index + 1).padStart(2, "0")}`, category),
        );

  return (
    <>
      <section className={styles.frameworkSection} aria-labelledby="governance-framework-title">
        <Container>
          <Reveal>
            <div className={styles.docHeader}>
              <span className={styles.numeral} aria-hidden="true">
                01
              </span>
              <span className={styles.ref}>REF 01 · GOVERNANCE FRAMEWORK</span>
            </div>
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
                <div className={styles.rowInner}>
                  <h3 className={styles.label}>{row.label}</h3>
                  <p className={styles.note}>{row.note}</p>
                  <SourceFootnote tone="dark" className={styles.source}>
                    {row.source}
                  </SourceFootnote>
                </div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className={styles.registerSection} aria-labelledby="governance-registers-title">
        <Container>
          <Reveal>
            <div className={styles.docHeader}>
              <span className={styles.numeral} aria-hidden="true">
                02
              </span>
              <span className={styles.ref}>REF 02 · REGISTERS</span>
            </div>
            <Eyebrow>Registers</Eyebrow>
            <Heading variant="section" id="governance-registers-title" className={styles.heading}>
              What is on record.
            </Heading>
            <Lede className={styles.statement}>
              The board, its committees and the company&apos;s policies — each register entry with
              its documentary reference.
            </Lede>
          </Reveal>

          <RegisterTable title="Board of directors" rows={boardRows} />
          <RegisterTable title="Committees" rows={committeeRows} />
          <RegisterTable title="Policies" rows={policyRows} />

          <SourceFootnote className={styles.note}>{governance.note}</SourceFootnote>
        </Container>
      </section>
    </>
  );
}
