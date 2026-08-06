import Image from "next/image";
import Link from "next/link";
import { Container, Grid, GridItem } from "@/components/layout";
import { ExternalLink, Icon } from "@/components/ui";
import { footer } from "@/lib/data/homepage";
import styles from "./Footer.module.css";

function FooterNavColumn({
  heading,
  links,
}: {
  heading: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <nav aria-label={heading} className={styles.col}>
      <h3 className={styles.colHeading}>{heading}</h3>
      <ul className={styles.colList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.colLink}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.ctaRow}>
          <p className={styles.ctaLabel}>Work with us</p>
          <Link href="/en/contact" className={styles.ctaLink}>
            Start a conversation
            <Icon name="arrow-right" size="sm" />
          </Link>
        </div>

        <Grid className={styles.mainGrid}>
          <GridItem span={5} className={styles.brand}>
            <Link href="/en" aria-label="NDR Smart Spaces — home">
              <Image
                src="/logos/ndr-smart-spaces-lockup-light.svg"
                alt=""
                width={180}
                height={41}
                className={styles.logo}
              />
            </Link>
            <p className={styles.descriptor}>{footer.descriptor}</p>
            <ul className={styles.ecosystem}>
              {footer.ecosystem.map((link) => (
                <li key={link.href}>
                  <ExternalLink tone="dark" href={link.href}>
                    {link.label}
                  </ExternalLink>
                </li>
              ))}
            </ul>
          </GridItem>
          <GridItem span={3}>
            <FooterNavColumn heading="Sitemap" links={footer.sitemap} />
          </GridItem>
          <GridItem span={4}>
            <FooterNavColumn heading="Investor" links={footer.investor} />
          </GridItem>
        </Grid>
      </Container>

      <div className={styles.contactBand}>
        <Container>
          <Grid>
            <GridItem span={5} className={styles.contactItem}>
              <span className={styles.contactLabel}>Corporate office</span>
              <span className={styles.contactValue}>{footer.contact.address}</span>
            </GridItem>
            <GridItem span={4} className={styles.contactItem}>
              <span className={styles.contactLabel}>Write to us</span>
              <span className={styles.contactValue}>
                {footer.contact.emails.map((email) => (
                  <a key={email.href} href={email.href} className={styles.emailLink}>
                    {email.label}
                  </a>
                ))}
              </span>
            </GridItem>
            <GridItem span={3} className={styles.contactItem}>
              <Link href="/en/contact" className={styles.contactCta}>
                Contact us
                <Icon name="arrow-up-right" size="sm" />
              </Link>
            </GridItem>
          </Grid>
        </Container>
      </div>

      <div className={styles.legal}>
        <Container>
          <div className={styles.legalRow}>
            <p className={styles.copyright}>{footer.copyright}</p>
            <ul className={styles.legalLinks}>
              {footer.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.legalLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
