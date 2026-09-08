import { Container, Grid, GridItem, Stack } from "@/components/layout";
import { Heading, Eyebrow } from "@/components/ui";
import { customerReviews, type CustomerReview } from "@/lib/data/homepage";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./CustomerReviews.module.css";

function ReviewQuote({ review }: { review: CustomerReview }) {
  if (review.quote === "DATA TO BE INSERTED") {
    return <p className={styles.placeholder}>{review.quote}</p>;
  }
  return <p className={styles.cardQuote}>{review.quote}</p>;
}

export function CustomerReviews() {
  return (
    <section className={styles.section} aria-labelledby="customer-reviews-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow tone="dark">{customerReviews.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="customer-reviews-title">
                {customerReviews.heading}
              </Heading>
            </Stack>
          </Reveal>

          <Grid>
            {customerReviews.reviews.map((review, index) => (
              <GridItem key={index} span={4}>
                <Reveal delay={index as RevealDelay}>
                  <figure className={styles.card}>
                    <ReviewQuote review={review} />
                    <figcaption className={styles.cardMeta}>
                      <span className={styles.cardName}>{review.name}</span>
                      <span className={styles.cardRole}>{review.role}</span>
                      <span className={styles.cardCompany}>{review.company}</span>
                    </figcaption>
                  </figure>
                </Reveal>
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </Container>
    </section>
  );
}
