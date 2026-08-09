import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote, TextLink } from "@/components/ui";
import { inquiryRouting } from "@/lib/data/contact";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./InquiryRouting.module.css";

export function InquiryRouting() {
  return (
    <section className={styles.section} id="routing" aria-labelledby="routing-title">
      <Container>
        <Reveal>
          <Eyebrow className={styles.eyebrow}>{inquiryRouting.eyebrow}</Eyebrow>
          <Heading variant="section" id="routing-title" className={styles.heading}>
            {inquiryRouting.heading}
          </Heading>
          <Lede className={styles.lede}>{inquiryRouting.lede}</Lede>
        </Reveal>

        <div className={styles.desks}>
          {inquiryRouting.desks.map((desk, index) => (
            <Reveal key={desk.key} delay={(index % 3) as RevealDelay} className={styles.desk}>
              <div className={styles.deskTop}>
                <h3 className={styles.deskLabel}>{desk.label}</h3>
                <span className={styles.deskResponse}>{desk.response}</span>
              </div>
              <p className={styles.deskRoute}>{desk.route}</p>
              <div className={styles.deskContact}>
                <TextLink href={desk.href} className={styles.deskRecipient}>
                  {desk.recipient}
                </TextLink>
                <span className={styles.deskPhone}>{desk.phone}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <SourceFootnote className={styles.note}>{inquiryRouting.note}</SourceFootnote>
      </Container>
    </section>
  );
}
