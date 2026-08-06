import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Icon } from "@/components/ui";
import { latestUpdates } from "@/lib/data/homepage";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./LatestUpdates.module.css";

export function LatestUpdates() {
  if (latestUpdates.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="latest-updates-title">
      <Container>
        <Stack gap="8xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>Updates</Eyebrow>
              <Heading variant="section" id="latest-updates-title">
                Latest updates.
              </Heading>
            </Stack>
          </Reveal>
          <ul className={styles.list}>
            {latestUpdates.map((update, index) => (
              <li key={`${update.date}-${update.title}`}>
                <Reveal delay={(index + 1) as RevealDelay}>
                  <a href={update.href} className={styles.row}>
                    <span className={styles.meta}>
                      <time dateTime={update.date}>{update.date}</time>
                      <span className={styles.category}>{update.category}</span>
                    </span>
                    <span className={styles.title}>{update.title}</span>
                    <Icon name="arrow-up-right" size="sm" className={styles.arrow} />
                  </a>
                </Reveal>
              </li>
            ))}
          </ul>
        </Stack>
      </Container>
    </section>
  );
}
