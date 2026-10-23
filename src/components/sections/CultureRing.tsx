"use client";

import { useState, type CSSProperties, type KeyboardEvent } from "react";
import { Container } from "@/components/layout";
import { cultureRing } from "@/lib/data/careers";
import { cx } from "../ui/cx";
import styles from "./CultureRing.module.css";

const STEP = 360 / cultureRing.nodes.length;

/**
 * How we grow people, as a ring you turn. Choosing a stage rotates the ring
 * the short way round until that stage sits at the top, and the centre of
 * the ring tells its story. Arrow keys turn it too.
 */
export function CultureRing() {
  const { nodes } = cultureRing;
  const [active, setActive] = useState(0);
  /* cumulative rotation, so the ring always turns the short way */
  const [turn, setTurn] = useState(0);

  const select = (index: number) => {
    const count = nodes.length;
    const next = ((index % count) + count) % count;
    let delta = (next - active + count) % count;
    if (delta > count / 2) delta -= count;
    setTurn((current) => current - delta * STEP);
    setActive(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      select(active + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      select(active - 1);
    }
  };

  return (
    <section className={styles.section} aria-labelledby="ring-title">
      <Container className={styles.grid}>
        <div className={styles.copy}>
          <h2 id="ring-title" className={styles.heading}>
            {cultureRing.heading}
          </h2>
          <p className={styles.lede}>{cultureRing.lede}</p>
        </div>

        <div className={styles.stage}>
          {/* a gold arc that stays at the top, behind whichever stage is there */}
          <svg className={styles.track} viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="44" className={styles.trackSweep} pathLength={100} />
          </svg>
          <div
            className={styles.ring}
            style={{ "--turn": `${turn}deg` } as CSSProperties}
            role="group"
            aria-label="Stages of growing people at NDR"
            onKeyDown={onKeyDown}
          >
            <svg className={styles.track} viewBox="0 0 100 100" aria-hidden="true">
              <circle cx="50" cy="50" r="44" className={styles.trackLine} />
            </svg>

            {nodes.map((node, index) => (
              <button
                key={node.name}
                type="button"
                className={cx(styles.node, index === active && styles.nodeActive)}
                style={{ "--angle": `${index * STEP}deg` } as CSSProperties}
                aria-pressed={index === active}
                onClick={() => select(index)}
              >
                <span className={styles.nodeInner}>
                  <span className={styles.dot} aria-hidden="true" />
                  <span className={styles.nodeName}>{node.name}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={styles.centre} aria-live="polite">
            <p className={styles.centreLabel}>{cultureRing.centre}</p>
            <p key={active} className={styles.centreName}>
              {nodes[active].name}
            </p>
            <p key={`b${active}`} className={styles.centreBody}>
              {nodes[active].body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
