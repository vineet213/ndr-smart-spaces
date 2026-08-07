import { Container, Section } from "@/components/layout";
import { Body, Eyebrow, Lede } from "@/components/ui";
import { businessChapters, businessMasthead } from "@/lib/data/business";
import { DrawnGrid } from "./DrawnGrid";
import { Reveal } from "./Reveal";
import styles from "./BusinessMasthead.module.css";

export function BusinessMasthead() {
  return (
    <Section ariaLabelledby="business-masthead-title" className={styles.section}>
      <DrawnGrid className={styles.gridFaint} />
      <Container className={styles.content}>
        <Reveal>
          <dl className={styles.control}>
            {businessMasthead.control.map((cell) => (
              <div key={cell.label} className={styles.controlCell}>
                <dt className={styles.controlLabel}>{cell.label}</dt>
                <dd className={styles.controlValue}>{cell.value}</dd>
              </div>
            ))}
          </dl>

          <span className={styles.rule} aria-hidden="true" />

          <div className={styles.mainCol}>
            <Eyebrow className={styles.eyebrow}>{businessMasthead.eyebrow}</Eyebrow>
            <h1 id="business-masthead-title" className={styles.title}>
              {businessMasthead.headline.before}
              <span className={styles.titleAccent}>{businessMasthead.headline.accent}</span>
              {businessMasthead.headline.after}
            </h1>
            <Lede className={styles.lede}>{businessMasthead.lede}</Lede>

            <div className={styles.scope}>
              <p className={styles.scopeLabel}>{businessMasthead.scope.label}</p>
              <Body className={styles.scopeBody}>{businessMasthead.scope.body}</Body>
            </div>
          </div>

          <nav aria-label="Chapters">
            <ol className={styles.toc}>
              {businessChapters.map((chapter) => (
                <li key={chapter.id}>
                  <a href={`#${chapter.id}`} className={styles.tocLink}>
                    <span className={styles.tocNumeral}>{chapter.index}</span>
                    <span className={styles.tocLabel}>{chapter.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </Reveal>
      </Container>
    </Section>
  );
}
