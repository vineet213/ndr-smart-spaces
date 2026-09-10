"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { Container } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import type { LifecycleStage } from "@/lib/data/business";
import { useInView } from "@/hooks/useInView";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import { WarehousePlate } from "./WarehousePlate";
import styles from "./DevelopmentLifecycle.module.css";

type DevelopmentLifecycleProps = {
  intro: { heading: string; description: string };
  stages: readonly LifecycleStage[];
  source: string;
};

/* Per-photograph crop emphasis. Values tune object-position so the main
 * subject stays in frame while the quiet area carries the overlay text.
 */
const STAGE_POSITIONS: Record<string, string> = {
  "01": "50% 42%",
  "02": "50% 38%",
  "03": "50% 40%",
  "04": "50% 62%",
  "05": "50% 35%",
  "06": "50% 34%",
  "07": "50% 40%",
  "08": "50% 45%",
};

type StageRowProps = {
  stage: LifecycleStage;
  fromLeft: boolean;
  priority: boolean;
};

function StageRow({ stage, fromLeft, priority }: StageRowProps) {
  const { ref, inView } = useInView<HTMLElement>();

  const position = STAGE_POSITIONS[stage.index] ?? "center";

  return (
    <article
      ref={ref}
      className={cx(
        styles.stage,
        fromLeft ? styles.fromLeft : styles.fromRight,
        inView && styles.isInView,
      )}
    >
      <figure className={styles.figure}>
        <Image
          src={stage.image.src}
          alt={stage.image.alt}
          fill
          sizes="100vw"
          className={styles.image}
          style={{ "--stage-crop": position } as CSSProperties}
          priority={priority}
          unoptimized
        />
      </figure>

      <div className={styles.scrim} aria-hidden="true" />

      <div className={styles.overlay}>
        <div className={styles.overlayInner}>
          <span className={styles.index} aria-hidden="true">
            {stage.index}
          </span>
          <h3 className={styles.title}>{stage.title}</h3>
          <p className={styles.body}>{stage.body}</p>
        </div>
      </div>
    </article>
  );
}

export function DevelopmentLifecycle({ intro, stages, source }: DevelopmentLifecycleProps) {
  return (
    <section className={styles.section}>
      <Container>
        <Reveal>
          <header className={styles.intro}>
            <h2 className={styles.introHeading}>{intro.heading}</h2>
            <p className={styles.introBody}>{intro.description}</p>
          </header>
        </Reveal>
      </Container>

      <div className={styles.list}>
        {stages.map((stage, index) => (
          <StageRow
            key={stage.index}
            stage={stage}
            fromLeft={index % 2 === 0}
            priority={index === 0}
          />
        ))}
      </div>

      <Container>
        <Reveal>
          <div className={styles.plate}>
            <WarehousePlate />
          </div>
        </Reveal>

        <Reveal>
          <SourceFootnote>{source}</SourceFootnote>
        </Reveal>
      </Container>
    </section>
  );
}
