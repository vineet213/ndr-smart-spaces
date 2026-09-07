import Image from "next/image";
import { Container, Stack } from "@/components/layout";
import { Eyebrow, Heading } from "@/components/ui";
import { leadership, type LeadershipGroup } from "@/lib/data/about";
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

function LeadershipGroupSection({ group }: { group: LeadershipGroup }) {
  const profiles = group.profiles;
  const slots = Math.max(profiles.length, group.placeholderSlots);

  return (
    <Stack gap="6xl">
      <Reveal>
        <h3 className={styles.groupTitle} id={`${group.id}-title`}>
          {group.title}
        </h3>
      </Reveal>
      <ol className={styles.grid} aria-labelledby={`${group.id}-title`}>
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
                      <h4 className={styles.cardName}>{profile.name}</h4>
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
                    <p className={styles.slotTitle}>{group.placeholderTitle}</p>
                    <p className={styles.slotStatus}>{group.placeholderStatus}</p>
                    <p className={styles.slotNote}>{group.placeholderNote}</p>
                  </div>
                )}
              </Reveal>
            </li>
          );
        })}
      </ol>
    </Stack>
  );
}

export function Leadership() {
  return (
    <section className={styles.section} aria-labelledby="leadership-title">
      <Container>
        <Stack gap="8xl">
          <Reveal>
            <Stack gap="xl">
              <span className={styles.goldRule} aria-hidden="true" />
              <Eyebrow>{leadership.eyebrow}</Eyebrow>
              <Heading variant="section" id="leadership-title">
                {leadership.heading}
              </Heading>
            </Stack>
          </Reveal>

          {leadership.groups.map((group) => (
            <LeadershipGroupSection key={group.id} group={group} />
          ))}
        </Stack>
      </Container>
    </section>
  );
}
