import { Icon, TextLink } from "@/components/ui";
import { ASSET_CLASS_LABELS, formatSqFt, plateCopy, portfolioRegister } from "@/lib/data/portfolio";
import type { PortfolioAsset } from "@/lib/data/portfolio";
import { cx } from "../ui/cx";
import { Reveal } from "./Reveal";
import type { RevealDelay } from "./Reveal";
import { StatusBadge } from "./StatusBadge";
import styles from "./ProjectPlate.module.css";

export function ProjectPlate({ asset, index }: { asset: PortfolioAsset; index: number }) {
  return (
    <article className={styles.card}>
      <span className={styles.cropCardTopLeft} aria-hidden="true" />
      <span className={styles.cropCardTopRight} aria-hidden="true" />
      <span className={styles.cropCardBottomLeft} aria-hidden="true" />
      <span className={styles.cropCardBottomRight} aria-hidden="true" />
      <Reveal variant="fade" delay={Math.min(index, 5) as RevealDelay} className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.plateNo}>
            <span className={styles.plateMark} aria-hidden="true" />
            <span>Plate {asset.plate}</span>
          </span>
          <span className={styles.reference} aria-hidden="true">
            PL.{asset.plate}
          </span>
          <StatusBadge status={asset.status} />
        </div>
        <div className={styles.media} aria-hidden="true">
          <span className={styles.cropTopLeft} />
          <span className={styles.cropTopRight} />
          <span className={styles.cropBottomLeft} />
          <span className={styles.cropBottomRight} />
          <span className={styles.mediaMark} />
          <span className={styles.mediaLabel}>{plateCopy.photographyPending}</span>
          <span className={styles.watermark}>{asset.plate}</span>
        </div>
        <h3 className={styles.name}>{asset.name}</h3>
        <p className={styles.location}>
          <Icon name="map-pin" size="sm" className={styles.pin} />
          {asset.city}
        </p>
        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt className={cx("text-label-meta", styles.factLabel)}>{plateCopy.classLabel}</dt>
            <dd className={styles.factValue}>{ASSET_CLASS_LABELS[asset.class]}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={cx("text-label-meta", styles.factLabel)}>{plateCopy.sizeLabel}</dt>
            <dd className={styles.factValue}>{formatSqFt(asset.sizeSqFt)}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={cx("text-label-meta", styles.factLabel)}>{plateCopy.occupierLabel}</dt>
            <dd className={styles.factValue}>{asset.occupier ?? portfolioRegister.sizeMissing}</dd>
          </div>
          <div className={styles.fact}>
            <dt className={cx("text-label-meta", styles.factLabel)}>{plateCopy.yearLabel}</dt>
            <dd className={styles.factValue}>
              {asset.completedYear ?? portfolioRegister.sizeMissing}
            </dd>
          </div>
        </dl>
        <div className={styles.footer}>
          <p className={styles.source}>
            <span className={styles.sourceLabel}>{plateCopy.sourceLabel} </span>
            {asset.source}
          </p>
          {asset.route ? (
            <div className={styles.route}>
              <TextLink href={asset.route.href}>
                {asset.route.label}
                <Icon name="arrow-right" size="sm" />
              </TextLink>
            </div>
          ) : null}
        </div>
      </Reveal>
    </article>
  );
}
