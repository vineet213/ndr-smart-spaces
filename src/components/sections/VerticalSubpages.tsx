import Link from "next/link";
import { Eyebrow, Icon } from "@/components/ui";
import { FadeImage } from "@/components/ui/FadeImage";
import { vertical02Subpages } from "@/lib/data/business";
import { Reveal } from "./Reveal";
import styles from "./VerticalSubpages.module.css";

/* Vertical 02's two subpages as a pair of compact link cards: a small photo */
/* thumbnail beside the title and line, the whole card is the link.          */
export function VerticalSubpages() {
  const { eyebrow, heading, links } = vertical02Subpages;

  return (
    <section className={styles.section} aria-labelledby="vertical-subpages-title">
      <Reveal>
        <header className={styles.head}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="vertical-subpages-title" className={styles.heading}>
            {heading}
          </h2>
        </header>
      </Reveal>

      <Reveal>
        <ul className={styles.grid}>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={styles.card}>
                <span className={styles.thumb}>
                  <FadeImage src={link.image} alt="" fill sizes="136px" className={styles.image} />
                </span>{" "}
                <span className={styles.copy}>
                  <span className={styles.title}>{link.title}</span>{" "}
                  <span className={styles.body}>{link.body}</span>{" "}
                  <span className={styles.cta}>
                    Explore
                    <Icon name="arrow-right" size="sm" className={styles.arrow} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
