import Image from "next/image";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading, Lede } from "@/components/ui";
import { leadership } from "@/lib/data/about";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./Leadership.module.css";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Leadership() {
  const profiles = leadership.profiles;
  const slots = Math.max(profiles.length, leadership.placeholderSlots);

  return (
    <section className={styles.section} aria-labelledby="leadership-title">
      <Container>
        <Stack gap="6xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>{leadership.eyebrow}</Eyebrow>
              <Heading variant="section" id="leadership-title">
                {leadership.heading}
              </Heading>
              <Lede className={styles.lede}>{leadership.lede}</Lede>
            </Stack>
          </Reveal>

          <ol className={styles.grid}>
            {Array.from({ length: slots }, (_, index) => {
              const profile = profiles[index];
              return (
                <li key={profile?.name ?? index}>
                  <Reveal delay={(index + 1) as RevealDelay}>
                    {profile ? (
                      <article className={styles.card}>
                        <figure className={styles.portrait}>
                          {profile.photo ? (
                            <Image
                              src={profile.photo}
                              alt={profile.name}
                              fill
                              sizes="(max-width: 767px) 40vw, 10rem"
                              className={styles.photo}
                            />
                          ) : (
                            <div className={styles.monogram} aria-hidden="true">
                              {initialsOf(profile.name)}
                            </div>
                          )}
                        </figure>
                        <div className={styles.cardBody}>
                          <h3 className={styles.cardName}>{profile.name}</h3>
                          <p className={styles.cardRole}>{profile.role}</p>
                          <p className={styles.cardBio}>{profile.bio}</p>
                        </div>
                      </article>
                    ) : (
                      <div className={styles.slot}>
                        <div className={styles.slotHeader}>
                          <span className={styles.slotIndex}>
                            Record {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={styles.slotMark} aria-hidden="true" />
                        </div>
                        <p className={styles.slotTitle}>{leadership.placeholderTitle}</p>
                        <p className={styles.slotStatus}>{leadership.placeholderStatus}</p>
                        <p className={styles.slotNote}>{leadership.placeholderNote}</p>
                      </div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </Stack>
      </Container>
    </section>
  );
}
