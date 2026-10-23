import { Container } from "@/components/layout";
import { TextLink } from "@/components/ui";
import { CapitalCycle, type CycleMedallion, type CycleNodeDef } from "./CapitalCycle";
import { SheetHeader } from "./SheetHeader";
import styles from "./CycleSection.module.css";

type CycleSectionProps = {
  id: string;
  sheet: string;
  of: string;
  eyebrow: string;
  heading: string;
  lede: string;
  /** Four ring nodes; omitted, the ring shows the capital cycle. */
  nodes?: readonly CycleNodeDef[];
  medallion?: CycleMedallion;
  links?: readonly { label: string; href: string }[];
};

/** A titled section around the four-node ring diagram. */
export function CycleSection({
  id,
  sheet,
  of,
  eyebrow,
  heading,
  lede,
  nodes,
  medallion,
  links,
}: CycleSectionProps) {
  const headingId = `${id}-title`;

  return (
    <section className={styles.section} id={id} aria-labelledby={headingId}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <SheetHeader
              sheet={sheet}
              of={of}
              eyebrow={eyebrow}
              heading={heading}
              headingId={headingId}
              lede={lede}
            />
            {links && links.length > 0 ? (
              <ul className={styles.links}>
                {links.map((link) => (
                  <li key={link.href}>
                    <TextLink href={link.href}>{link.label}</TextLink>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className={styles.diagram}>
            <CapitalCycle nodes={nodes} medallion={medallion} />
          </div>
        </div>
      </Container>
    </section>
  );
}
