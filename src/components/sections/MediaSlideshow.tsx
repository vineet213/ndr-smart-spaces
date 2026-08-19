"use client";

import { useCallback, useRef, useState } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading, SourceFootnote } from "@/components/ui";
import { slideshows } from "@/lib/data/generated/slideshows";
import { Reveal } from "./Reveal";
import styles from "./MediaSlideshow.module.css";

const SLIDESHOW_ID = "media-coverage";

export function MediaSlideshow() {
  const slideshow = slideshows.find((s) => s.id === SLIDESHOW_ID);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      if (!slideshow) return;
      const clamped = Math.max(0, Math.min(index, slideshow.slides.length - 1));
      setActiveIndex(clamped);
      const container = scrollRef.current;
      if (!container) return;
      const slide = container.children[clamped] as HTMLElement | undefined;
      if (slide) {
        slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
      }
    },
    [slideshow],
  );

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container || !slideshow) return;
    const scrollLeft = container.scrollLeft;
    const slideWidth = container.clientWidth * 0.8;
    const index = Math.round(scrollLeft / slideWidth);
    setActiveIndex(Math.max(0, Math.min(index, slideshow.slides.length - 1)));
  }, [slideshow]);

  if (!slideshow) return null;

  return (
    <section className={styles.section} aria-labelledby="media-slideshow-title">
      <Container>
        <Reveal>
          <Eyebrow className={styles.eyebrow}>Featured coverage</Eyebrow>
          <Heading variant="section" id="media-slideshow-title" className={styles.heading}>
            {slideshow.title}
          </Heading>
          {slideshow.caption ? <p className={styles.caption}>{slideshow.caption}</p> : null}
        </Reveal>

        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollTo(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous slide"
          >
            <span className={styles.arrowIcon} aria-hidden="true">
              &larr;
            </span>
          </button>
          <span className={styles.counter}>
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(slideshow.slides.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollTo(activeIndex + 1)}
            disabled={activeIndex === slideshow.slides.length - 1}
            aria-label="Next slide"
          >
            <span className={styles.arrowIcon} aria-hidden="true">
              &rarr;
            </span>
          </button>
        </div>
      </Container>

      <div
        ref={scrollRef}
        className={styles.track}
        onScroll={handleScroll}
        role="region"
        aria-label={slideshow.title}
        aria-roledescription="carousel"
      >
        {slideshow.slides.map((slide, index) => (
          <article
            key={index}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${index + 1} of ${slideshow.slides.length}`}
          >
            <div className={styles.imageWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.alt}
                className={styles.image}
                loading={index === 0 ? "eager" : "lazy"}
              />
            </div>
            {slide.caption ? <p className={styles.slideCaption}>{slide.caption}</p> : null}
          </article>
        ))}
      </div>

      <Container>
        <div className={styles.dots}>
          {slideshow.slides.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${index === activeIndex ? styles.dotActive : ""}`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <SourceFootnote className={styles.source}>
          Source: NDR Smart Spaces — editorial archive
        </SourceFootnote>
      </Container>
    </section>
  );
}
