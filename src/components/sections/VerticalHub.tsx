import { Icon, ExternalLink, TextLink } from "@/components/ui";
import type { Division } from "@/lib/data/business";
import styles from "./VerticalHub.module.css";

type VerticalHubProps = {
  divisions: readonly Division[];
};

export function VerticalHub({ divisions }: VerticalHubProps) {
  return (
    <div className={styles.hub}>
      {divisions.map((division) => {
        const external = division.route.external ?? false;
        return (
          <article key={division.index} className={styles.item}>
            <div className={styles.rule} aria-hidden="true">
              <span className={styles.ruleCode}>DIV.{division.index}</span>
            </div>

            <div className={styles.body}>
              <span className={styles.numeral} aria-hidden="true">
                {division.index}
              </span>

              <div className={styles.identity}>
                <h3 className={styles.title}>{division.title}</h3>
                {external ? (
                  <ExternalLink href={division.route.href} className={styles.link}>
                    {division.route.label}
                  </ExternalLink>
                ) : (
                  <TextLink href={division.route.href} className={styles.link}>
                    {division.route.label}
                    <Icon name="arrow-right" size="sm" />
                  </TextLink>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
