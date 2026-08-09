import { Container, Grid, GridItem } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { correspondenceForm } from "@/lib/data/contact";
import { ContactDocHeader } from "./ContactDocHeader";
import { CorrespondenceForm } from "./CorrespondenceForm";
import { Reveal } from "./Reveal";
import styles from "./Correspondence.module.css";

export function Correspondence() {
  return (
    <section
      className={styles.section}
      id="business-enquiry"
      aria-labelledby="correspondence-title"
    >
      <Container>
        <Grid>
          <GridItem span={7} className={styles.intro}>
            <Reveal>
              <ContactDocHeader numeral="02" code="Business enquiry" />
              <Eyebrow className={styles.eyebrow}>{correspondenceForm.eyebrow}</Eyebrow>
              <Heading variant="section" id="correspondence-title" className={styles.heading}>
                {correspondenceForm.heading}
              </Heading>
              <p className={styles.subheading}>{correspondenceForm.subheading}</p>
              <div className={styles.response}>
                <span className={styles.responseLabel}>Response time</span>
                <span className={styles.responseValue}>{correspondenceForm.response}</span>
              </div>
              <p className={styles.note}>{correspondenceForm.note}</p>
            </Reveal>
          </GridItem>
          <GridItem span={5} className={styles.formColumn}>
            <Reveal delay={1}>
              <div className={styles.card}>
                <CorrespondenceForm />
              </div>
            </Reveal>
          </GridItem>
        </Grid>
      </Container>
    </section>
  );
}
