import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { whyNdr } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import { SheetHeader } from "./SheetHeader";
import styles from "./WhyNdr.module.css";

type WhyNdrProps = {
  /** Number the section as a sheet of a drawing set (the Why NDR page). */
  sheet?: { sheet: string; of: string };
};

export function WhyNdr({ sheet }: WhyNdrProps = {}) {
  return (
    <section className={styles.section} aria-labelledby="why-ndr-title">
      <Container>
        <Stack gap="6xl">
          {sheet ? (
            <SheetHeader
              sheet={sheet.sheet}
              of={sheet.of}
              eyebrow={whyNdr.eyebrow}
              heading={whyNdr.heading}
              headingId="why-ndr-title"
              lede={whyNdr.lede}
            />
          ) : (
            <Reveal>
              <Stack gap="xl">
                <span className={styles.goldRule} aria-hidden="true" />
                <Eyebrow>{whyNdr.eyebrow}</Eyebrow>
                <Heading variant="section" id="why-ndr-title">
                  {whyNdr.heading}
                </Heading>
                <Lede className={styles.lede}>{whyNdr.lede}</Lede>
              </Stack>
            </Reveal>
          )}

          <ul className={styles.ledger}>
            {whyNdr.strengths.map((strength, index) => (
              <li key={strength.title}>
                <Reveal delay={(index + 1) as RevealDelay}>
                  <div className={styles.row}>
                    <span className={styles.index} aria-hidden="true">
                      {strength.index}
                    </span>
                    <div className={styles.body}>
                      <h3 className={styles.title}>{strength.title}</h3>
                      <p className={styles.line}>{strength.body}</p>
                    </div>
                    <span className={styles.proof}>{strength.proof}</span>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </Stack>
      </Container>
    </section>
  );
}
