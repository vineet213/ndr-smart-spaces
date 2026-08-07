import { Container, Section } from "@/components/layout";
import { ExternalLink, SourceFootnote } from "@/components/ui";
import { corporateStructure } from "@/lib/data/business";
import { ChapterHeader } from "./ChapterHeader";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import styles from "./CorporateStructure.module.css";

export function CorporateStructure() {
  return (
    <Section tone="dim" id="structure" ariaLabelledby="structure-title" className={styles.section}>
      <DrawnGrid />
      <Container className={styles.content}>
        <Reveal>
          <ChapterHeader
            numeral="03"
            eyebrow="Corporate Structure"
            heading="How the corporate body is assembled."
            headingId="structure-title"
            lede="The parent platform, its SPVs, its service entities, and its relationship to the InvIT and third parties."
          />

          <div className={styles.map}>
            <div className={styles.headerPlate}>
              <h3 className={styles.headerName}>{corporateStructure.header.name}</h3>
              <p className={styles.headerRole}>{corporateStructure.header.role}</p>
            </div>

            <ol className={styles.branches}>
              {corporateStructure.branches.map((branch) => (
                <li key={branch.name} className={styles.branch}>
                  <h4 className={styles.entity}>{branch.name}</h4>
                  <p className={styles.function}>{branch.function}</p>
                  <p className={styles.relationship}>{branch.relationship}</p>
                  {branch.route ? (
                    <ExternalLink className={styles.branchRoute} href={branch.route.href}>
                      {branch.route.label}
                    </ExternalLink>
                  ) : null}
                  {branch.routeNote ? <p className={styles.routeNote}>{branch.routeNote}</p> : null}
                </li>
              ))}
            </ol>
          </div>

          <SourceFootnote className={styles.source}>{corporateStructure.source}</SourceFootnote>
        </Reveal>
      </Container>
    </Section>
  );
}
