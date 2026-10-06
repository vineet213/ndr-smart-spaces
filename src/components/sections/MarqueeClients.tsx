import Image from "next/image";
import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { marqueeClients } from "@/lib/data/homepage";
import type { MarqueeClient } from "@/lib/data/homepage";
import styles from "./MarqueeClients.module.css";

function ClientMark({ client }: { client: MarqueeClient }) {
  if (!client.logo) return <span className={styles.item}>{client.name}</span>;
  return (
    <span className={styles.itemWithLogo}>
      <Image
        src={client.logo.src}
        alt={client.logo.alt}
        width={140}
        height={56}
        className={styles.logo}
        unoptimized
      />
    </span>
  );
}

export function MarqueeClients() {
  const { clients } = marqueeClients;

  return (
    <section className={styles.section} aria-label="Clients served">
      <Container>
        <Grid>
          <GridItem span={4}>
            <Stack gap="sm" className={styles.claim}>
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
                  {clients.map((client) => (
                    <li key={client.name}>
                      <ClientMark client={client} />
                    </li>
                  ))}
                </ul>
                <ul className={styles.list} aria-hidden="true">
                  {clients.map((client) => (
                    <li key={`${client.name}-copy`}>
                      <ClientMark client={client} />
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
