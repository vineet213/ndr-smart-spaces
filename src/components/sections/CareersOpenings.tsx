"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout";
import { Button } from "@/components/ui";
import { Icon } from "@/components/ui/Icon";
import { applyHref, careersOpenings, hrEmail, roles } from "@/lib/data/careers";
import { cx } from "../ui/cx";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./CareersOpenings.module.css";

const ALL = "All teams";

/**
 * Open roles as a ledger, filterable by team, each with an email apply link
 * that carries the role and its reference. With no roles open it becomes the
 * talent-pool invitation instead.
 */
export function CareersOpenings() {
  const teams = useMemo(() => [ALL, ...new Set(roles.map((role) => role.team))], []);
  const [team, setTeam] = useState(ALL);
  const shown = team === ALL ? roles : roles.filter((role) => role.team === team);

  return (
    <section className={styles.section} id="openings" aria-labelledby="openings-title">
      <Container>
        <Reveal>
          <div className={styles.head}>
            <p className={styles.eyebrow}>{careersOpenings.eyebrow}</p>
            <h2 id="openings-title" className={styles.heading}>
              {careersOpenings.heading}
              <span className={styles.count}>{String(roles.length).padStart(2, "0")}</span>
            </h2>
          </div>
        </Reveal>

        {roles.length === 0 ? (
          <Reveal>
            <div className={styles.empty}>
              <span className={styles.emptyMark} aria-hidden="true" />
              <div className={styles.emptyCopy}>
                <h3 className={styles.emptyHeading}>{careersOpenings.empty.heading}</h3>
                <p className={styles.emptyBody}>{careersOpenings.empty.body}</p>
              </div>
              <div className={styles.emptyActions}>
                <Button href={applyHref()}>{careersOpenings.empty.cta}</Button>
                <a className={styles.email} href={`mailto:${hrEmail}`}>
                  {hrEmail}
                </a>
              </div>
            </div>
          </Reveal>
        ) : (
          <>
            {teams.length > 2 ? (
              <div className={styles.filters} role="group" aria-label="Filter roles by team">
                {teams.map((name) => (
                  <button
                    key={name}
                    type="button"
                    className={cx(styles.filter, name === team && styles.filterActive)}
                    aria-pressed={name === team}
                    onClick={() => setTeam(name)}
                  >
                    {name}
                  </button>
                ))}
              </div>
            ) : null}

            <ul className={styles.roles} aria-live="polite">
              {shown.map((role, index) => (
                <li key={role.ref} className={styles.role}>
                  <Reveal delay={Math.min(index, 5) as RevealDelay} variant="fade">
                    <div className={styles.roleRow}>
                      <div className={styles.roleMain}>
                        <p className={styles.roleTeam}>{role.team}</p>
                        <h3 className={styles.roleTitle}>{role.title}</h3>
                        <p className={styles.roleSummary}>{role.summary}</p>
                      </div>
                      <dl className={styles.roleMeta}>
                        <div>
                          <dt>Location</dt>
                          <dd>{role.location}</dd>
                        </div>
                        <div>
                          <dt>Type</dt>
                          <dd>{role.type}</dd>
                        </div>
                        <div>
                          <dt>Experience</dt>
                          <dd>{role.experience}</dd>
                        </div>
                        <div>
                          <dt>Ref.</dt>
                          <dd>{role.ref}</dd>
                        </div>
                      </dl>
                      <a className={styles.apply} href={applyHref(role)}>
                        {careersOpenings.applyLabel}
                        <Icon name="arrow-right" size="sm" />
                      </a>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>

            <p className={styles.talentPool}>
              {careersOpenings.talentPool}{" "}
              <a href={applyHref()} className={styles.inlineLink}>
                {hrEmail}
              </a>
            </p>
          </>
        )}

        <p className={styles.notice}>
          {careersOpenings.notice}{" "}
          <a href="/privacy-policy/" className={styles.inlineLink}>
            Privacy policy
          </a>
        </p>
      </Container>
    </section>
  );
}
