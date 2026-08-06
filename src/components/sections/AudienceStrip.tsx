import { Container } from "@/components/layout";
import { Icon } from "@/components/ui";
import { audienceRoutes } from "@/lib/data/homepage";
import styles from "./AudienceStrip.module.css";

export function AudienceStrip() {
  return (
    <section className={styles.strip} aria-label="Quick routes">
      <Container>
        <nav className={styles.grid} aria-label="Choose your audience">
          {audienceRoutes.map((route) => (
            <a key={route.label} href={route.href} className={styles.link}>
              <span className={styles.row}>
                <span className={styles.label}>{route.label}</span>
                <Icon name="arrow-right" size="sm" className={styles.arrow} />
              </span>
              <span className={styles.descriptor}>{route.descriptor}</span>
            </a>
          ))}
        </nav>
      </Container>
    </section>
  );
}
