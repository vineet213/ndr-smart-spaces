import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Grid, GridItem } from "@/components/layout";
import { ExternalLink, Icon } from "@/components/ui";
import { footer } from "@/lib/data/homepage";
import { navItems, type MenuLink } from "@/lib/data/navigation";
import { cx } from "../ui/cx";
import styles from "./Footer.module.css";

type FooterColumn = { heading: string; links: readonly MenuLink[] };

/* The footer's link columns are built from the navbar's own items, in the same
 * order and with the same labels, so the two can never drift apart:
 * runs of plain links become a column, and each dropdown becomes a column
 * headed by its label (with its sub-pages nested, as in the dropdown). */
const LINK_RUN_HEADINGS = ["Company", "More"];

function buildFooterColumns(): FooterColumn[] {
  const columns: FooterColumn[] = [];
  let run: MenuLink[] = [];
  let runCount = 0;
  const closeRun = () => {
    if (run.length === 0) return;
    columns.push({ heading: LINK_RUN_HEADINGS[runCount] ?? "More", links: run });
    runCount += 1;
    run = [];
  };
  for (const item of navItems) {
    if (item.type === "link") {
      run.push({ label: item.label, href: item.href });
    } else {
      closeRun();
      columns.push({ heading: item.label, links: item.columns.flatMap((column) => column.links) });
    }
  }
  closeRun();
  return columns;
}

const footerColumns = buildFooterColumns();

/* A column with nested sub-pages (Verticals) gets a wider slot so its long labels wrap less. */
const isWide = (column: FooterColumn) => column.links.some((link) => link.children?.length);

function FooterNavColumn({ heading, links }: FooterColumn) {
  return (
    <nav aria-label={heading} className={styles.col}>
      <h3 className={styles.colHeading}>{heading}</h3>
      <ul className={styles.colList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={styles.colLink}>
              {link.label}
            </Link>
            {link.children && link.children.length > 0 ? (
              <ul className={styles.subList}>
                {link.children.map((child) => (
                  <li key={child.href}>
                    <Link href={child.href} className={styles.subLink}>
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ hideWorkWithUsCta = true }: { hideWorkWithUsCta?: boolean }) {
  return (
    <footer className={styles.footer}>
      <Container>
        {!hideWorkWithUsCta ? (
          <div className={styles.ctaRow}>
            <p className={styles.ctaLabel}>Work with us</p>
            <Link href="/contact" className={styles.ctaLink}>
              Start a conversation
              <Icon name="arrow-right" size="sm" />
            </Link>
          </div>
        ) : null}

        <Grid className={styles.mainGrid}>
          <GridItem span={3} className={styles.brand}>
            <Link href="/" aria-label="NDR Smart Spaces: home" className={styles.logoLink}>
              <Image
                src="/logos/ndr-smart-spaces-lockup.svg"
                alt="NDR Smart Spaces"
                width={360}
                height={82}
                className={styles.logo}
              />
            </Link>
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
          {footerColumns.map((column) => (
            <GridItem
              key={column.heading}
              span={isWide(column) ? 3 : 2}
              className={cx(styles.colItem, isWide(column) && styles.wideCol)}
            >
              <FooterNavColumn heading={column.heading} links={column.links} />
            </GridItem>
          ))}
        </Grid>
      </Container>

      <div className={styles.contactBand}>
        <Container>
          <Grid>
            <GridItem span={5} className={styles.contactItem}>
              <span className={styles.contactLabel}>Corporate office</span>{" "}
              <span className={styles.contactValue}>{footer.contact.address}</span>
            </GridItem>
            <GridItem span={4} className={styles.contactItem}>
              <span className={styles.contactLabel}>Write to us</span>{" "}
              <span className={styles.contactValue}>
                {footer.contact.emails.map((email, index) => (
                  <Fragment key={email.href}>
                    {index > 0 ? " " : null}
                    <a href={email.href} className={styles.emailLink}>
                      {email.label}
                    </a>
                  </Fragment>
                ))}
              </span>
            </GridItem>
            <GridItem span={3} className={styles.contactItem}>
              <Link href="/contact" className={styles.contactCta}>
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
