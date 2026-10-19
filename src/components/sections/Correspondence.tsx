import { Fragment } from "react";
import { Container, Grid, GridItem } from "@/components/layout";
import { Eyebrow, Heading, Icon } from "@/components/ui";
import { correspondenceForm } from "@/lib/data/contact";
import { contact } from "@/lib/data/homepage";
import { CorrespondenceForm } from "./CorrespondenceForm";
import { Reveal } from "./Reveal";
import styles from "./Correspondence.module.css";

/* Quick answers beside the form: where we are, who else can be written to and  */
/* how fast to expect a reply. The response-time line is the same promise made   */
/* on the Asset Management page.                                                 */
export function Correspondence() {
  const address = contact.info.find((item) => item.label === "Corporate office");
  const emails = contact.info.find((item) => item.label === "Business enquiry");
  const emailList = emails ? emails.value.split(" · ") : [];

  return (
    <section
      className={styles.section}
      id="business-enquiry"
      aria-labelledby="correspondence-title"
    >
      <Container>
        <Grid>
          <GridItem span={5} className={styles.intro}>
            <Reveal>
              <Eyebrow className={styles.eyebrow}>{correspondenceForm.eyebrow}</Eyebrow>
              <Heading variant="section" id="correspondence-title" className={styles.heading}>
                {correspondenceForm.heading}
              </Heading>
              <p className={styles.subheading}>{correspondenceForm.subheading}</p>

              <ul className={styles.facts}>
                {address ? (
                  <li className={styles.fact}>
                    <span className={styles.factIcon}>
                      <Icon name="map-pin" />
                    </span>{" "}
                    <span className={styles.factBody}>
                      <span className={styles.factLabel}>Corporate office</span>{" "}
                      <span className={styles.factValue}>{address.value}</span>
                    </span>
                  </li>
                ) : null}
                {emailList.length > 0 ? (
                  <li className={styles.fact}>
                    <span className={styles.factIcon}>
                      <Icon name="mail" />
                    </span>{" "}
                    <span className={styles.factBody}>
                      <span className={styles.factLabel}>Write to us directly</span>{" "}
                      <span className={styles.factValue}>
                        {emailList.map((email, index) => (
                          <Fragment key={email}>
                            {index > 0 ? " " : null}
                            <a className={styles.factLink} href={`mailto:${email}`}>
                              {email}
                            </a>
                          </Fragment>
                        ))}
                      </span>
                    </span>
                  </li>
                ) : null}
                <li className={styles.fact}>
                  <span className={styles.factIcon}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </span>{" "}
                  <span className={styles.factBody}>
                    <span className={styles.factLabel}>Response time</span>{" "}
                    <span className={styles.factValue}>
                      We typically respond within 2 business days.
                    </span>
                  </span>
                </li>
              </ul>
            </Reveal>
          </GridItem>
          <GridItem span={7} className={styles.formColumn}>
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
