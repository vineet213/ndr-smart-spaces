import { Container } from "@/components/layout";
import { Body, Button, Eyebrow, Heading, TextLink } from "@/components/ui";
import { contactClosing } from "@/lib/data/contact";
import { Reveal } from "./Reveal";
import styles from "./ContactClosing.module.css";

export function ContactClosing() {
  return (
    <section className={styles.section} aria-labelledby="contact-closing-title">
      <Container>
        <Reveal>
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {contactClosing.eyebrow}
          </Eyebrow>
          <Heading
            variant="section"
            tone="dark"
            id="contact-closing-title"
            className={styles.title}
          >
            {contactClosing.line}
          </Heading>
          <Body tone="dark" className={styles.body}>
            {contactClosing.body}
          </Body>
          <div className={styles.ctas}>
            <Button href={contactClosing.primaryCta.href} tone="dark">
              {contactClosing.primaryCta.label}
            </Button>
            <TextLink
              tone="dark"
              href={contactClosing.tertiaryLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tertiary}
            >
              {contactClosing.tertiaryLink.label}
            </TextLink>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
