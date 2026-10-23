"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { applyHref, careersBoard, careersHero, hrEmail, roles } from "@/lib/data/careers";
import { cx } from "../ui/cx";
import styles from "./CareersBoard.module.css";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FRAME_MS = 55;

/**
 * Split-flap characters. Rendered settled on the server; when the board
 * comes into view each tile riffles through a few letters before landing,
 * the way a departures board updates. Screen readers get the plain text.
 */
function Flaps({ text, play, offset = 0 }: { text: string; play: boolean; offset?: number }) {
  const target = text.toUpperCase();
  const [shown, setShown] = useState(target);

  useEffect(() => {
    if (!play || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const timer = window.setInterval(() => {
      frame += 1;
      let settled = true;
      const next = target
        .split("")
        .map((char, index) => {
          if (char === " ") return " ";
          const flips = 4 + ((index + offset) % 9);
          if (frame >= flips) return char;
          settled = false;
          return GLYPHS[(frame * 7 + index * 3 + offset) % GLYPHS.length];
        })
        .join("");
      setShown(next);
      if (settled) window.clearInterval(timer);
    }, FRAME_MS);
    return () => window.clearInterval(timer);
  }, [play, target, offset]);

  return (
    <span className={styles.flaps} aria-label={text}>
      {shown.split("").map((char, index) => (
        <span
          key={index}
          className={cx(styles.tile, char === " " && styles.gap)}
          aria-hidden="true"
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}

/**
 * Careers & Opportunities: open roles on a dispatch board. With nothing
 * open, the board says so and the CV invitation takes over.
 */
export function CareersBoard() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  const b = careersBoard;
  const count = String(roles.length).padStart(2, "0");

  return (
    <>
      <section className={styles.hero} aria-labelledby="careers-title">
        <Container className={styles.heroInner}>
          <h1 id="careers-title" className={styles.title}>
            {careersHero.title}
          </h1>
          <p className={styles.lede}>{careersHero.lede}</p>
        </Container>
      </section>

      <section className={styles.section} id="openings" aria-labelledby="board-title">
        <Container>
          <div ref={ref} className={styles.board}>
            <header className={styles.boardHead}>
              <h2 id="board-title" className={styles.boardTitle}>
                {b.title}
              </h2>
              <span className={styles.counter}>
                <Flaps text={count} play={inView} />
              </span>
            </header>

            <div className={styles.columns} aria-hidden="true">
              {b.columns.map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>

            {roles.length === 0 ? (
              <div className={styles.emptyRow}>
                <span className={styles.emptyMessage}>
                  {b.empty.map((line, index) => (
                    <Flaps key={line} text={line} play={inView} offset={index * 5} />
                  ))}
                </span>
                <span className={styles.status}>
                  <Flaps text={b.emptyStatus} play={inView} offset={3} />
                </span>
              </div>
            ) : (
              <ul className={styles.rows}>
                {roles.map((role, index) => (
                  <li key={role.ref} className={styles.row}>
                    <span className={styles.role}>
                      {role.title}
                      <span className={styles.ref}>
                        {role.ref}, {role.experience}
                      </span>
                    </span>
                    <span className={styles.cell}>{role.team}</span>
                    <span className={styles.cell}>{role.location}</span>
                    <span className={styles.cell}>{role.type}</span>
                    <span className={styles.status}>
                      <Flaps text={b.status} play={inView} offset={index * 2} />
                      <a className={styles.apply} href={applyHref(role)}>
                        {b.apply}
                      </a>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.invite}>
            <h3 className={styles.inviteHeading}>{b.invite.heading}</h3>
            <p className={styles.inviteBody}>{b.invite.body}</p>
            <div className={styles.inviteActions}>
              <Button href={applyHref()}>{b.invite.cta}</Button>
              <a className={styles.email} href={`mailto:${hrEmail}`}>
                {hrEmail}
              </a>
            </div>
          </div>

          <p className={styles.notice}>
            {b.notice}{" "}
            <a href="/privacy-policy/" className={styles.email}>
              Privacy policy
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
