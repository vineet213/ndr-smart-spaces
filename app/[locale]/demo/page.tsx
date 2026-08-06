import type { Metadata } from "next";
import { Section, Container, Band, Stack, Grid, GridItem, Divider } from "@/components/layout";
import {
  Heading,
  Eyebrow,
  Lede,
  Body,
  Caption,
  Metric,
  SourceFootnote,
  Button,
  TextLink,
  ExternalLink,
  Icon,
  Skeleton,
  Spinner,
  FocusRing,
} from "@/components/ui";
import type { IconName } from "@/components/ui";
import demoStyles from "./demo.module.css";

export const metadata: Metadata = {
  title: "Core UI Library",
};

const iconNames: IconName[] = [
  "arrow-right",
  "arrow-up-right",
  "chevron-down",
  "phone",
  "mail",
  "map-pin",
  "download",
  "menu",
  "close",
];

function ShowcaseHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Stack gap="md">
      <Eyebrow>{eyebrow}</Eyebrow>
      <Heading variant="section">{title}</Heading>
      <Body>{description}</Body>
    </Stack>
  );
}

export default function DemoPage() {
  return (
    <>
      <Section id="intro">
        <Container>
          <Stack gap="3xl">
            <Stack gap="xl">
              <Eyebrow>NDR Smart Spaces · Design System</Eyebrow>
              <Heading variant="hero">Core UI Library</Heading>
              <Lede>
                The frozen design primitives from Design Direction v2 and the Homepage Visual
                Specification. Every component is token-driven, accessible, and reusable across
                light and dark surfaces.
              </Lede>
            </Stack>
            <Divider />
            <Stack gap="sm">
              <TextLink href="#typography">Typography</TextLink>
              <TextLink href="#buttons">Buttons</TextLink>
              <TextLink href="#layout">Layout</TextLink>
              <TextLink href="#feedback">Feedback</TextLink>
              <TextLink href="#utilities">Utilities</TextLink>
            </Stack>
          </Stack>
        </Container>
      </Section>

      <Section id="typography" tone="dim">
        <Container>
          <Stack gap="6xl">
            <ShowcaseHeading
              eyebrow="01 · Typography"
              title="The frozen scale"
              description="Fraunces for display, Inter for body. Sizes follow the visual specification's desktop, tablet and mobile steps."
            />
            <Grid>
              <GridItem span={6}>
                <Stack gap="3xl">
                  <Stack gap="sm">
                    <Eyebrow>Hero display · 88/64/40 · Fraunces 500</Eyebrow>
                    <Heading variant="hero">From land to listed assets.</Heading>
                  </Stack>
                  <Stack gap="sm">
                    <Eyebrow>Section H2 · 56/44/32</Eyebrow>
                    <Heading variant="section">A diversified infrastructure organization.</Heading>
                  </Stack>
                  <Stack gap="sm">
                    <Eyebrow>Sub-head H3 · 28/24/21</Eyebrow>
                    <Heading variant="sub">The development platform behind NDR InvIT.</Heading>
                  </Stack>
                </Stack>
              </GridItem>
              <GridItem span={6}>
                <Stack gap="3xl">
                  <Stack gap="sm">
                    <Eyebrow>Lede · 20/18/17</Eyebrow>
                    <Lede>
                      A diversified infrastructure organization developing, owning and managing
                      institutional-grade industrial, commercial and institutional assets across
                      India.
                    </Lede>
                  </Stack>
                  <Stack gap="sm">
                    <Eyebrow>Body · 16</Eyebrow>
                    <Body>
                      The company combines expertise in real estate development and grade A
                      warehousing for over 60 years.
                    </Body>
                  </Stack>
                  <Stack gap="sm">
                    <Eyebrow>Caption · 14</Eyebrow>
                    <Caption>1954 founded · 2018 InvIT listed · 2026 SPV monetizations.</Caption>
                  </Stack>
                  <Stack gap="sm">
                    <Eyebrow>Source footnote · 14</Eyebrow>
                    <SourceFootnote>Source: NDR Corporate Presentation, FY26</SourceFootnote>
                  </Stack>
                </Stack>
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section id="typography-dark" tone="dark">
        <Container>
          <Stack gap="6xl">
            <Stack gap="md">
              <Eyebrow tone="dark">Typography · On dark</Eyebrow>
              <Heading variant="section" tone="dark">
                Charcoal carries, ivory speaks.
              </Heading>
            </Stack>
            <Grid>
              <GridItem span={6}>
                <Stack gap="md">
                  <Heading variant="sub" tone="dark">
                    Grade A warehousing, asset management, and plotted development.
                  </Heading>
                  <Lede tone="dark">
                    Completed assets are offered to NDR InvIT under a Right of First Offer,
                    recycling capital into new development.
                  </Lede>
                </Stack>
              </GridItem>
              <GridItem span={6}>
                <Stack gap="md">
                  <Body tone="dark">
                    A transparent, disciplined engine that keeps building — serving retail,
                    e-commerce, 3PL and manufacturing.
                  </Body>
                  <Caption tone="dark">Eyebrows shift to gold on dark.</Caption>
                  <SourceFootnote tone="dark">
                    Source: NDR Smart Spaces Post-Demerger note
                  </SourceFootnote>
                  <Metric variant="section" tone="dark">
                    98%
                  </Metric>
                </Stack>
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section id="metrics">
        <Container>
          <Stack gap="6xl">
            <ShowcaseHeading
              eyebrow="02 · Metrics"
              title="One figure, one source."
              description="Fraunces numerals carry the proof — maroon on ivory, gold on maroon."
            />
            <Grid>
              <GridItem span={4}>
                <Stack gap="sm">
                  <Metric variant="hero">60+</Metric>
                  <Caption>Years of experience</Caption>
                  <SourceFootnote>Source: NDR Corporate Presentation, FY26</SourceFootnote>
                </Stack>
              </GridItem>
              <GridItem span={4}>
                <Stack gap="sm">
                  <Metric variant="hero">100+</Metric>
                  <Caption>Fortune Global 500 companies served</Caption>
                  <SourceFootnote>Source: NDR Corporate Presentation, FY26</SourceFootnote>
                </Stack>
              </GridItem>
              <GridItem span={4}>
                <Stack gap="sm">
                  <Metric variant="section">₹5,000 cr</Metric>
                  <Caption>InvIT valuation</Caption>
                  <SourceFootnote>Source: NDR InvIT disclosures, as on</SourceFootnote>
                </Stack>
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Section>

      <Section id="buttons" tone="dim">
        <Container>
          <Stack gap="6xl">
            <ShowcaseHeading
              eyebrow="03 · Buttons"
              title="One primary CTA per viewport."
              description="Rectilinear, 48 px, uppercase Inter 500. Gold is reserved for the signal."
            />
            <Stack gap="4xl">
              <Stack gap="md">
                <Eyebrow>On light</Eyebrow>
                <div className={demoStyles.row}>
                  <Button>Business Enquiry</Button>
                  <Button variant="secondary">Investor Centre</Button>
                  <Button disabled>Disabled</Button>
                  <TextLink href="#buttons">Explore the portfolio</TextLink>
                  <ExternalLink href="https://ndrinvit.com">NDR InvIT Trust</ExternalLink>
                </div>
              </Stack>
              <Stack gap="md">
                <Eyebrow>On dark</Eyebrow>
                <Band tone="charcoal" className={demoStyles.row}>
                  <Button tone="dark">The capital model</Button>
                  <Button variant="secondary" tone="dark">
                    Investor Centre
                  </Button>
                  <TextLink tone="dark" href="#buttons">
                    Our journey
                  </TextLink>
                  <ExternalLink tone="dark" href="https://aveacres.com">
                    Ave Acres
                  </ExternalLink>
                </Band>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Section>

      <Section id="layout">
        <Container>
          <Stack gap="6xl">
            <ShowcaseHeading
              eyebrow="04 · Layout"
              title="The grid is the governance."
              description="Twelve columns on desktop and tablet, a single stack on mobile. Gutter 24 / 20 / 16."
            />
            <Stack gap="3xl">
              <Grid>
                <GridItem span={6}>
                  <div className={demoStyles.box}>span 6</div>
                </GridItem>
                <GridItem span={6}>
                  <div className={demoStyles.box}>span 6</div>
                </GridItem>
              </Grid>
              <Grid>
                <GridItem span={4}>
                  <div className={demoStyles.box}>span 4</div>
                </GridItem>
                <GridItem span={4}>
                  <div className={demoStyles.box}>span 4</div>
                </GridItem>
                <GridItem span={4}>
                  <div className={demoStyles.box}>span 4</div>
                </GridItem>
              </Grid>
              <Grid>
                <GridItem span={3}>
                  <div className={demoStyles.box}>span 3</div>
                </GridItem>
                <GridItem span={3}>
                  <div className={demoStyles.box}>span 3</div>
                </GridItem>
                <GridItem span={3}>
                  <div className={demoStyles.box}>span 3</div>
                </GridItem>
                <GridItem span={3}>
                  <div className={demoStyles.box}>span 3</div>
                </GridItem>
              </Grid>
              <Divider />
              <div className={demoStyles.verticalDemo}>
                <Body>Stack, divider and band in one rhythm.</Body>
                <Divider orientation="vertical" />
                <Body>Hairlines divide content into bands.</Body>
                <Divider orientation="vertical" tone="dark" />
              </div>
            </Stack>
          </Stack>
        </Container>
      </Section>

      <Section id="feedback" tone="dim">
        <Container>
          <Stack gap="6xl">
            <ShowcaseHeading
              eyebrow="05 · Feedback"
              title="Loading states are states."
              description="Skeleton blocks for structure, a gold arc for the submitting form."
            />
            <Stack gap="3xl">
              <Stack gap="lg">
                <Eyebrow>Skeletons</Eyebrow>
                <div className={demoStyles.row}>
                  <Skeleton variant="line" />
                  <Skeleton variant="block" />
                  <Skeleton variant="media" />
                </div>
              </Stack>
              <Stack gap="lg">
                <Eyebrow>Spinners</Eyebrow>
                <div className={`${demoStyles.row} ${demoStyles.row2xl}`}>
                  <Spinner />
                  <Spinner tone="maroon" />
                  <Button disabled>
                    <Spinner tone="maroon" />
                    Sending…
                  </Button>
                </div>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Section>

      <Section id="utilities" tone="charcoal">
        <Container>
          <Stack gap="6xl">
            <ShowcaseHeading
              eyebrow="06 · Utilities"
              title="Small primitives, strict discipline."
              description="Icons at 16 and 24 px, 1.5 px stroke, maroon or gold only. Focus rings are gold."
            />
            <Grid>
              <GridItem span={6}>
                <Stack gap="md">
                  <Eyebrow tone="dark">Icons</Eyebrow>
                  <div className={demoStyles.row}>
                    {iconNames.map((name) => (
                      <span key={name} className={demoStyles.iconCell}>
                        <Icon name={name} />
                        <Caption tone="dark">{name}</Caption>
                      </span>
                    ))}
                  </div>
                </Stack>
              </GridItem>
              <GridItem span={6}>
                <Stack gap="md">
                  <Eyebrow tone="dark">Focus ring</Eyebrow>
                  <FocusRing>
                    <Button variant="secondary" tone="dark">
                      Tab to this button
                    </Button>
                  </FocusRing>
                </Stack>
              </GridItem>
            </Grid>
          </Stack>
        </Container>
      </Section>
    </>
  );
}
