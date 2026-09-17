"use client";

import { Grid, GridItem, Stack } from "@/components/layout";
import { Heading } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import { ourCode, type OurCodeValue } from "@/lib/data/about";
import { cx } from "../ui/cx";
import styles from "./OurCode.module.css";

const markProps = {
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function CodeMark({ index }: { index: string }) {
  switch (index) {
    case "01":
      // Infrastructure that enables — a built structure with growth rising from it.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M14 46 H42 V22 L28 12 L14 22 Z" />
          <path d="M24 46 V33 H32 V46" />
          <path d="M28 12 V5 M22 10 L28 4 L34 10" />
        </svg>
      );
    case "02":
      // Enabling the last mile — a route resolving to a destination pin.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M8 42 Q 22 42 27 31 T 40 17" />
          <circle cx="44" cy="14" r="5" />
          <path d="M44 19 V25" />
        </svg>
      );
    case "03":
      // Efficiency at scale — accelerating bars.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M10 44 H46" />
          <path d="M16 44 V34 M26 44 V26 M36 44 V18 M46 44 V11" />
          <path d="M38 12 L46 11 L45 19" />
        </svg>
      );
    case "04":
      // Design that delivers — a drafting square, structure engineered ahead of time.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M12 44 L28 10 L44 44 Z" />
          <path d="M20 30 H36" />
          <path d="M28 10 V4" />
        </svg>
      );
    case "05":
      // Agility with accountability — a stopwatch, moving fast without losing the mark.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <circle cx="27" cy="31" r="15" />
          <path d="M23 10 H31 M27 10 V5" />
          <path d="M40 12 L44 16" />
          <path d="M20 31 L25 36 L35 24" />
        </svg>
      );
    case "06":
      // Customer-led approach — two sides meeting on equal terms.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <path d="M8 28 H21 M35 28 H48" />
          <path d="M21 28 L16 23 M21 28 L16 33" />
          <path d="M35 28 L40 23 M35 28 L40 33" />
          <circle cx="28" cy="28" r="3" />
        </svg>
      );
    case "07":
      // People build the organization — three figures of rising height, the
      // organization literally built up from its people.
      return (
        <svg {...markProps} aria-hidden="true" focusable="false">
          <circle cx="12" cy="21" r="4" />
          <path d="M5 45 C5 33 19 33 19 45" />
          <circle cx="28" cy="13" r="4.5" />
          <path d="M17 45 C17 27 39 27 39 45" />
          <circle cx="44" cy="21" r="4" />
          <path d="M37 45 C37 33 51 33 51 45" />
        </svg>
      );
    default:
      return null;
  }
}

type CodeRowProps = {
  value: OurCodeValue;
  fromLeft: boolean;
};

function CodeRow({ value, fromLeft }: CodeRowProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: "0px 0px -12% 0px" });

  const plate = (
    <div className={styles.plate}>
      <span className={styles.mark}>
        <CodeMark index={value.index} />
      </span>
    </div>
  );

  const text = (
    <Stack gap="md" className={styles.text}>
      <span className={styles.index}>{value.index}</span>
      <Heading variant="sub" as="h3" className={styles.title}>
        {value.title}
      </Heading>
      <p className={styles.tagline}>{value.tagline}</p>
      <p className={styles.body}>{value.body}</p>
    </Stack>
  );

  return (
    <div
      ref={ref}
      className={cx(styles.row, fromLeft ? styles.fromLeft : styles.fromRight, inView && styles.isInView)}
    >
      <Grid className={styles.grid}>
        {fromLeft ? (
          <>
            <GridItem span={5} className={styles.plateColumn}>
              {plate}
            </GridItem>
            <GridItem span={7} className={styles.textColumn}>
              {text}
            </GridItem>
          </>
        ) : (
          <>
            <GridItem span={7} className={styles.textColumn}>
              {text}
            </GridItem>
            <GridItem span={5} className={styles.plateColumn}>
              {plate}
            </GridItem>
          </>
        )}
      </Grid>
    </div>
  );
}

export function OurCode() {
  return (
    <section className={styles.section} aria-labelledby="our-code-title">
      <div className={styles.bleed}>
        <Stack gap="xl" className={styles.header}>
          <span className={styles.goldRule} aria-hidden="true" />
          <Heading variant="section" id="our-code-title">
            {ourCode.heading}
          </Heading>
        </Stack>

        <div className={styles.rows}>
          {ourCode.values.map((value, index) => (
            <CodeRow key={value.index} value={value} fromLeft={index % 2 === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
