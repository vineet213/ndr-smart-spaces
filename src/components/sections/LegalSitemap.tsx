import Link from "next/link";
import { Container, Section } from "@/components/layout";
import { Eyebrow, Icon, Lede } from "@/components/ui";
import { sitemapGroups } from "@/lib/data/legal";
import styles from "./LegalSitemap.module.css";

export function LegalSitemap() {
  return (
    <>
      <Section tone="charcoal" ariaLabelledby="legal-sitemap-title" className={styles.cover}>
        <Container>
          <div className={styles.coverInner}>
            <Eyebrow tone="dark" className={styles.eyebrow}>
              Legal · Notice
            </Eyebrow>
            <h1 id="legal-sitemap-title" className={styles.title}>
              Website Sitemap
            </h1>
            <Lede tone="dark" className={styles.lede}>
              Every route on this website, grouped by publication.
            </Lede>
          </div>
        </Container>
      </Section>

      <Section className={styles.body}>
        <Container>
          <div className={styles.bodyInner}>
            {sitemapGroups.map((group) => (
              <div key={group.heading} className={styles.group}>
                <h2 className={styles.groupHeading}>{group.heading}</h2>
                <ul className={styles.groupList}>
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={styles.groupLink}>
                        {link.label}
                        <Icon name="arrow-right" size="sm" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
