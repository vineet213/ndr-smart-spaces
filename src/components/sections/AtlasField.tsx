import { Container } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import {
  atlasField,
  formatPlateRange,
  portfolioAssets,
  portfolioMasthead,
} from "@/lib/data/portfolio";
import type { SurveyMark } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import { AtlasMap } from "./AtlasMap";
import { Reveal } from "./Reveal";
import { ZoneLegend } from "./ZoneLegend";
import styles from "./AtlasField.module.css";

function NorthIndicator({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1" />
      <path d="M12 4l3.5 5h-7L12 4z" fill="currentColor" />
    </svg>
  );
}

const keyMarkClass: Record<SurveyMark, string> = {
  asset: styles.keyMarkAsset,
  hq: styles.keyMarkHq,
  hub: styles.keyMarkHub,
  satellite: styles.keyMarkSatellite,
};

function SurveyKey() {
  return (
    <div className={styles.key} aria-label={atlasField.surveyKeyLabel}>
      <span className={styles.keyLabel}>{atlasField.surveyKeyLabel}</span>
      <ul className={styles.keyRows}>
        {atlasField.surveyKey.map((entry) => (
          <li key={entry.mark} className={styles.keyRow}>
            <span className={cx(styles.keyMark, keyMarkClass[entry.mark])} aria-hidden="true" />
            <span className={styles.keyText}>{entry.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AtlasField() {
  const plateRange = formatPlateRange(portfolioAssets.map((asset) => asset.plate));

  return (
    <section className={styles.section} aria-label={atlasField.mark}>
      <Reveal variant="fade">
        <div className={styles.plate}>
          <Container>
            <div className={styles.grid}>
              <div className={styles.mapColumn}>
                <div className={styles.frame}>
                  <span className={styles.cropTopLeft} aria-hidden="true" />
                  <span className={styles.cropTopRight} aria-hidden="true" />
                  <span className={styles.cropBottomLeft} aria-hidden="true" />
                  <span className={styles.cropBottomRight} aria-hidden="true" />
                  <AtlasMap />
                  <p className={styles.mark}>{atlasField.mark}</p>
                  <span className={styles.plateNote}>
                    {plateRange} · {portfolioMasthead.editionPeriod}
                  </span>
                  <span className={styles.notToScale}>{atlasField.notToScale}</span>
                  <NorthIndicator className={styles.compass} />
                </div>
              </div>
              <div className={styles.indexColumn}>
                <ZoneLegend />
                <SurveyKey />
                <div className={styles.captionBlock}>
                  <span className={styles.captionLabel}>{atlasField.captionLabel}</span>
                  <p className={styles.captionLead}>{atlasField.captionLead}</p>
                  <p className={styles.captionDetail}>{atlasField.captionDetail}</p>
                </div>
                <SourceFootnote className={styles.source}>{atlasField.source}</SourceFootnote>
              </div>
            </div>
          </Container>
        </div>
      </Reveal>
    </section>
  );
}
