import { Container, Stack } from "@/components/layout";
import { Button, Eyebrow, Heading, Lede } from "@/components/ui";
import { aboutClosing } from "@/lib/data/about";
import { Reveal } from "./Reveal";
import styles from "./ClosingCta.module.css";

type Cta = { readonly label: string; readonly href: string };

export type ClosingCtaData = {
  readonly eyebrow: string;
  readonly heading: string;
  readonly lede: string;
  readonly primaryCta: Cta;
  readonly secondaryCta: Cta;
};

const isExternal = (href: string) => /^https?:\/\//.test(href);

export function ClosingCta({ data = aboutClosing }: { data?: ClosingCtaData }) {
  const external = isExternal(data.secondaryCta.href);
  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <Container>
        <Reveal>
          <div className={styles.plate}>
            <span className={styles.goldRule} aria-hidden="true" />
            <Stack gap="xl" align="center" className={styles.inner}>
              <Eyebrow tone="dark">{data.eyebrow}</Eyebrow>
              <Heading variant="section" tone="dark" id="closing-title">
                {data.heading}
              </Heading>
              <Lede tone="dark" className={styles.lede}>
                {data.lede}
              </Lede>
              <div className={styles.ctas}>
                <Button href={data.primaryCta.href} tone="dark">
                  {data.primaryCta.label}
                </Button>
                <Button
                  variant="secondary"
                  tone="dark"
                  href={data.secondaryCta.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                >
                  {data.secondaryCta.label}
                </Button>
              </div>
            </Stack>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
