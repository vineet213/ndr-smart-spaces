import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading } from "@/components/ui";
import { canonicalHref } from "@/lib/routes";
import { contact } from "@/lib/data/homepage";
import { ContactArt } from "./ContactArt";
import { EnquiryForm } from "./EnquiryForm";
import { Reveal } from "./Reveal";
import styles from "./ContactCta.module.css";

export function ContactCta() {
  return (
    <section className={styles.section} aria-labelledby="contact-title">
      <svg className={styles.cornerMark} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path d="M12 12 H52 V52" />
        <path d="M22 22 H42 V42" />
      </svg>
      <Container className={styles.content}>
        <ContactArt />
        <Grid>
          <GridItem span={7} className={styles.info}>
            <Stack gap="5xl">
              <Reveal>
                <Stack gap="xl">
                  <Reveal variant="wipe">
                    <Heading variant="section" id="contact-title">
                      {contact.heading}
                    </Heading>
                  </Reveal>
                </Stack>
              </Reveal>
              <ul className={styles.infoList}>
                {contact.info.map((item) => (
                  <li key={item.label} className={styles.infoRow}>
                    <span className={styles.infoLabel}>{item.label}</span>
                    {item.href ? (
                      <a
                        href={canonicalHref(item.href)}
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
            </Stack>
          </GridItem>
          <GridItem span={5} className={styles.cardColumn}>
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
