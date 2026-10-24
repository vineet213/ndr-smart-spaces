import { FadeImage as Image } from "@/components/ui/FadeImage";
import { cultureHero } from "@/lib/data/careers";
import styles from "./CultureHero.module.css";

/**
 * Corporate Culture opening. The headline builds itself like a stack: the
 * foundation slab is laid, then each line is set down on the one below,
 * bottom first. Beside it, the team photograph runs to the edge of the
 * screen.
 */
export function CultureHero() {
  const { title, lead, body, image } = cultureHero;
  const last = title.length - 1;

  return (
    <section className={styles.hero} id="overview" aria-labelledby="culture-title">
      <div className={styles.copy}>
        <h2 id="culture-title" className={styles.title}>
          {title.map((line, index) => (
            <span
              key={line}
              className={index === last ? `${styles.line} ${styles.base}` : styles.line}
              /* stacked bottom up: the last line lands first */
              style={{ animationDelay: `${450 + (last - index) * 260}ms` }}
            >
              {line}
            </span>
          ))}
          <span className={styles.slab} aria-hidden="true" />
        </h2>

        <p className={styles.lead}>{lead}</p>
        {body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className={styles.body}>
            {paragraph}
          </p>
        ))}
      </div>

      <figure className={styles.figure}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 46vw"
          className={styles.photo}
        />
      </figure>
    </section>
  );
}
