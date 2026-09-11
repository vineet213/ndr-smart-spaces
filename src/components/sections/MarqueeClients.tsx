import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Eyebrow } from "@/components/ui";
import { marqueeClients } from "@/lib/data/homepage";
import styles from "./MarqueeClients.module.css";

export function MarqueeClients() {
  const { clients } = marqueeClients;

  return (
    <section className={styles.section} aria-label="Clients served">
      <Container>
        <Grid>
          <GridItem span={4}>
            <Stack gap="sm" className={styles.claim}>
              <Eyebrow>Clients</Eyebrow>
              <p className={styles.claimLine}>
                Serving <span className={styles.claimStrong}>100+ Fortune Global 500</span>{" "}
                companies
              </p>
              <p className={styles.subline}>{marqueeClients.subline}</p>
            </Stack>
          </GridItem>
          <GridItem span={8}>
            <div className={styles.viewport}>
              <div className={styles.track}>
                <ul className={styles.list}>
                  {clients.map((name) => (
                    <li key={name}>
                      <span className={styles.item}>{name}</span>
                    </li>
                  ))}
                </ul>
                <ul className={styles.list} aria-hidden="true">
                  {clients.map((name) => (
                    <li key={`${name}-copy`}>
                      <span className={styles.item}>{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
