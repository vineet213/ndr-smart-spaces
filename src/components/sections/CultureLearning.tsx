"use client";

import { useState } from "react";
import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Container } from "@/components/layout";
import { learningDevelopment } from "@/lib/data/careers";
import { cx } from "../ui/cx";
import styles from "./CultureLearning.module.css";

/**
 * Learning & development: the practices as a list of large titles. Pointing
 * at one (or tapping it) opens its text and brings its photograph up in the
 * frame beside the list, which is exactly as tall as the list.
 */
export function CultureLearning() {
  const { items } = learningDevelopment;
  const [active, setActive] = useState(0);

  return (
    <section className={styles.section} id="learning" aria-labelledby="learning-title">
      <Container>
        <h2 id="learning-title" className={styles.heading}>
          {learningDevelopment.heading}
        </h2>

        <div className={styles.grid}>
          <ul className={styles.list}>
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <li
                  key={item.title}
                  className={cx(styles.item, isActive && styles.itemActive)}
                  onMouseEnter={() => setActive(index)}
                >
                  <button
                    type="button"
                    className={styles.trigger}
                    aria-expanded={isActive}
                    aria-controls={`learning-${index}`}
                    onClick={() => setActive(index)}
                    onFocus={() => setActive(index)}
                  >
                    <span className={styles.title}>{item.title}</span>
                  </button>
                  <div id={`learning-${index}`} className={styles.reveal}>
                    <div className={styles.revealInner}>
                      <p className={styles.body}>{item.body}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.frame}>
            {items.map((item, index) => (
              <div
                key={item.title}
                className={cx(styles.slide, index === active && styles.slideActive)}
                aria-hidden={index !== active}
              >
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 45vw"
                  className={styles.photo}
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
