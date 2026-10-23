"use client";

import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { whyAudiences } from "@/lib/data/whyNdrPage";
import { cx } from "../ui/cx";
import { Reveal, type RevealDelay } from "./Reveal";
import { SheetHeader } from "./SheetHeader";
import styles from "./WhyAudience.module.css";

const noopSubscribe = () => () => {};

/**
 * "Who are you building for?": one tab per audience, each with its own three
 * reasons and next step. Before hydration every panel is shown in turn, so
 * the content never depends on JavaScript.
 */
export function WhyAudience() {
  const { audiences } = whyAudiences;
  const [active, setActive] = useState(0);
  // false in the server render, true once hydrated: tabs only exist with JS.
  const enhanced = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);


  const select = (index: number) => {
    const next = (index + audiences.length) % audiences.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = {
      ArrowRight: active + 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: audiences.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key]);
  };

  return (
    <section className={styles.section} id="audiences" aria-labelledby="audiences-title">
      <Container>
        <SheetHeader
          sheet="01"
          of="06"
          eyebrow={whyAudiences.eyebrow}
          heading={whyAudiences.heading}
          headingId="audiences-title"
        />

        <div className={cx(styles.switcher, enhanced && styles.enhanced)}>
          <div role="tablist" aria-label="Choose your perspective" className={styles.tabs}>
            {audiences.map((audience, index) => (
              <button
                key={audience.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`audience-tab-${audience.id}`}
                aria-selected={index === active}
                aria-controls={`audience-panel-${audience.id}`}
                tabIndex={index === active ? 0 : -1}
                className={cx(styles.tab, index === active && styles.tabActive)}
                onClick={() => setActive(index)}
                onKeyDown={onKeyDown}
              >
                <span className={styles.tabIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {audience.tab}
              </button>
            ))}
          </div>

          {audiences.map((audience, index) => (
            <div
              key={audience.id}
              role="tabpanel"
              id={`audience-panel-${audience.id}`}
              aria-labelledby={`audience-tab-${audience.id}`}
              hidden={enhanced && index !== active}
              tabIndex={0}
              className={styles.panel}
            >
              <div className={styles.panelHead}>
                <h3 className={styles.panelHeading}>{audience.heading}</h3>
                <p className={styles.panelLede}>{audience.lede}</p>
                <Button href={audience.cta.href} className={styles.cta}>
                  {audience.cta.label}
                </Button>
              </div>

              <ol className={styles.reasons}>
                {audience.reasons.map((reason, reasonIndex) => (
                  <li key={reason.title} className={styles.reason}>
                    <Reveal delay={(reasonIndex + 1) as RevealDelay} variant="fade">
                      <span className={styles.reasonIndex} aria-hidden="true">
                        {String(reasonIndex + 1).padStart(2, "0")}
                      </span>
                      <h4 className={styles.reasonTitle}>{reason.title}</h4>
                      <p className={styles.reasonBody}>{reason.body}</p>
                      <p className={styles.reasonProof}>{reason.proof}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
