import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { contact } from "@/lib/data/homepage";
import { EnquiryForm } from "./EnquiryForm";
import { Reveal } from "./Reveal";
import styles from "./ContactCta.module.css";

export function ContactCta() {
  return (
    <section className={styles.section} aria-labelledby="contact-title">
      <Container>
        <Grid>
          <GridItem span={8} className={styles.info}>
            <Stack gap="5xl">
              <Reveal>
                <Stack gap="xl">
                  <span className={styles.goldRule} aria-hidden="true" />
                  <Eyebrow>{contact.eyebrow}</Eyebrow>
                  <Heading variant="section" id="contact-title">
                    {contact.heading}
                  </Heading>
                </Stack>
              </Reveal>
              <ul className={styles.infoList}>
                {contact.info.map((item) => (
                  <li key={item.label} className={styles.infoRow}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className={styles.infoValue}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className={styles.infoValuePlain}>{item.value}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className={styles.note}>
                We typically respond within 2 business days. For investor-specific queries, write to
                compliance@ndrsmart.com.
              </p>
            </Stack>
          </GridItem>
          <GridItem span={4} className={styles.cardColumn}>
            <Reveal delay={1}>
              <div className={styles.card}>
                <h3 className={styles.cardHeading}>{contact.form.heading}</h3>
                <EnquiryForm />
              </div>
            </Reveal>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
