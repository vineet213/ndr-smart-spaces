import Link from "next/link";
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
                      <Link className={styles.item} href="/en/portfolio">
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className={styles.list} aria-hidden="true">
                  {clients.map((name) => (
                    <li key={`${name}-copy`}>
                      <Link className={styles.item} href="/en/portfolio" tabIndex={-1}>
                        {name}
                      </Link>
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
