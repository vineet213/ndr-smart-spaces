import { FadeImage as Image } from "@/components/ui/FadeImage";
import { Reveal } from "./Reveal";
import styles from "./CompanyOverview.module.css";

type OverviewMediaProps = {
  src: string;
  alt: string;
};

/* The overview photograph with an offset gold frame behind it. */
export function OverviewMedia({ src, alt }: OverviewMediaProps) {
  return (
    <div className={styles.mediaWrap}>
      <span className={styles.mediaFrame} aria-hidden="true" />
      <Reveal variant="unmask" className={styles.mediaReveal}>
        <div className={styles.media}>
          <div className={styles.mediaLayer}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 767px) 100vw, 40vw"
              className={styles.mediaImage}
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}
