import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { marqueeClients } from "@/lib/data/homepage";
import styles from "./MarqueeClients.module.css";

export function MarqueeClients() {
  const list = marqueeClients.clients;

  return (
    <section className={styles.section} aria-labelledby="marquee-clients-title">
      <Container>
        <Stack gap="3xl" align="center" className={styles.intro}>
          <Eyebrow className={styles.centerLabel}>Clients</Eyebrow>
          <Heading variant="section" id="marquee-clients-title" className={styles.claim}>
            {marqueeClients.claim}
          </Heading>
          <p className={styles.subline}>{marqueeClients.subline}</p>
        </Stack>
      </Container>
      <div className={styles.marquee}>
        <ul className={styles.track}>
          {list.map((name, index) => (
            <li key={`${name}-${index}`} className={styles.item}>
              {name}
            </li>
          ))}
          {list.map((name, index) => (
            <li key={`dup-${name}-${index}`} className={styles.item} aria-hidden="true">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
