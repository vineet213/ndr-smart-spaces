import { Container } from "@/components/layout";
import { Eyebrow, VisuallyHidden } from "@/components/ui";
import { capitalCycle } from "@/lib/data/investor";
import { Reveal } from "./Reveal";
import styles from "./CapitalCycleDiagram.module.css";

export function CapitalCycleDiagram() {
  return (
    <section className={styles.section} id="capital-cycle" aria-labelledby="capital-cycle-title">
      <Container>
        <Reveal>
          <span className={styles.numeral} aria-hidden="true">
            03
          </span>
          <Eyebrow tone="dark" className={styles.eyebrow}>
            {capitalCycle.eyebrow}
          </Eyebrow>
          <h2 id="capital-cycle-title" className={styles.heading}>
            {capitalCycle.heading}
          </h2>
          <p className={styles.lede}>{capitalCycle.lede}</p>
        </Reveal>

        <Reveal className={styles.diagramWrap}>
          <div
            className={styles.diagram}
            role="img"
            aria-label="The capital cycle: develop, stabilise, offer to NDR InvIT, recycle — the loop closes back to development."
          >
            <div className={styles.track}>
              {capitalCycle.nodes.map((node, index) => (
                <div className={styles.nodeGroup} key={node.number}>
                  <article className={styles.node}>
                    <span className={styles.nodeNumeral} aria-hidden="true">
                      {node.number}
                    </span>
                    <h3 className={styles.nodeLabel}>{node.label}</h3>
                    <p className={styles.nodeCaption}>{node.caption}</p>
                  </article>
                  {index < capitalCycle.nodes.length - 1 ? (
                    <div className={styles.connector} aria-hidden="true">
                      <span className={styles.arrow} />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className={styles.return} aria-hidden="true">
              <span className={styles.returnLabel}>
                The loop closes — capital returns to development
              </span>
              <span className={styles.returnArrow} />
            </div>
          </div>
        </Reveal>

        <VisuallyHidden>
          <ol>
            {capitalCycle.nodes.map((node) => (
              <li key={node.number}>
                {node.number} — {node.label}: {node.caption}
              </li>
            ))}
          </ol>
        </VisuallyHidden>
      </Container>
    </section>
  );
}
