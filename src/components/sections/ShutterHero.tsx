import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Icon } from "@/components/ui/Icon";
import { whyHero } from "@/lib/data/whyNdrPage";
import styles from "./ShutterHero.module.css";

/**
 * Why NDR opening: the screen is a loading-dock door. Its roller shutter
 * rolls up into the drum on load and the park appears behind it, under the
 * headline. Pure CSS, so it plays without JavaScript; with reduced motion
 * the door is simply open.
 */
export function ShutterHero() {
  const { kicker, title, lede, image, scrollHint } = whyHero;

  return (
    <section className={styles.hero} aria-labelledby="why-hero-title">
      <div className={styles.opening}>
        <div className={styles.scene}>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="100vw"
            className={styles.photo}
          />
          <span className={styles.scrim} aria-hidden="true" />
        </div>

        <div className={styles.copy}>
          <p className={styles.kicker}>{kicker}</p>
          <h1 id="why-hero-title" className={styles.title}>
            {title.map((line, index) => (
              <span
                key={line}
                className={styles.line}
                style={{ animationDelay: `${1500 + index * 140}ms` }}
              >
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.lede}>{lede}</p>
        </div>

        <a href="#bays" className={styles.hint}>
          {scrollHint}
          <Icon name="chevron-down" size="sm" />
        </a>

        {/* the roller shutter, painted with the bay sign */}
        <div className={styles.shutter} aria-hidden="true">
          <span className={styles.paint}>
            <span className={styles.paintSmall}>Since 1954</span>
            <span className={styles.paintBig}>NDR</span>
          </span>
          <span className={styles.bottomRail}>
            <span className={styles.handle} />
          </span>
        </div>
      </div>

      {/* drum housing and guide rails: the door frame stays after it opens */}
      <span className={styles.drum} aria-hidden="true" />
      <span className={styles.railLeft} aria-hidden="true" />
      <span className={styles.railRight} aria-hidden="true" />
    </section>
  );
}
