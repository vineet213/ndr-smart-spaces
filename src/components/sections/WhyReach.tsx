import { Container } from "@/components/layout";
import { TextLink } from "@/components/ui";
import { whyReach } from "@/lib/data/whyNdrPage";
import { Reveal, type RevealDelay } from "./Reveal";
import { SheetHeader } from "./SheetHeader";
import styles from "./WhyReach.module.css";

/** "Where we build": the markets NDR serves, set as a large city ledger. */
export function WhyReach() {
  return (
    <section className={styles.section} aria-labelledby="reach-title">
      <Container>
        <SheetHeader
          sheet="06"
          of="06"
          eyebrow={whyReach.eyebrow}
          heading={whyReach.heading}
          headingId="reach-title"
          lede={whyReach.lede}
          tone="dark"
        />

        <ol className={styles.cities}>
          {whyReach.cities.map((city, index) => (
            <li key={city} className={styles.city}>
              <Reveal delay={(index % 5) as RevealDelay} variant="fade">
                <span className={styles.cityIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.cityName}>{city}</span>
              </Reveal>
            </li>
          ))}
        </ol>

        <div className={styles.footer}>
          <TextLink href={whyReach.link.href} tone="dark">
            {whyReach.link.label}
          </TextLink>
        </div>
      </Container>
    </section>
  );
}
