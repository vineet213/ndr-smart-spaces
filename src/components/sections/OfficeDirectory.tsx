import type { ReactNode } from "react";
import { Container } from "@/components/layout";
import { Heading, Icon, SourceFootnote } from "@/components/ui";
import { ExternalLink } from "@/components/ui";
import { officeDirectory } from "@/lib/data/contact";
import { contact } from "@/lib/data/homepage";
import { Reveal, type RevealDelay } from "./Reveal";
import styles from "./OfficeDirectory.module.css";

function phoneHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const iconProps = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

/* One mark per desk, drawn in the same line style as the rest of the site. */
const deskIcons: Record<string, ReactNode> = {
  "smart-spaces": (
    <svg {...iconProps}>
      <path d="M5 27V12l9-6 9 6v15" />
      <path d="M23 27V15l4 2.5V27" />
      <path d="M3 27h26" />
      <path d="M11 27v-7h6v7" />
    </svg>
  ),
  hr: (
    <svg {...iconProps}>
      <circle cx="11" cy="11" r="4" />
      <circle cx="23" cy="12" r="3" />
      <path d="M3.5 26c0-4.7 3.4-8 7.5-8s7.5 3.3 7.5 8" />
      <path d="M20 19.2c.9-.4 1.9-.6 3-.6 3.2 0 5.5 2.6 5.5 6" />
    </svg>
  ),
  grievance: (
    <svg {...iconProps}>
      <path d="M16 4 6 8v8c0 5.6 4 9.6 10 12 6-2.4 10-6.4 10-12V8L16 4Z" />
      <path d="m11.5 16 3.2 3.2L21 12.8" />
    </svg>
  ),
  compliance: (
    <svg {...iconProps}>
      <path d="M9 4h10l6 6v18H9z" />
      <path d="M19 4v6h6" />
      <path d="m13 19 3 3 6-6" />
    </svg>
  ),
  posh: (
    <svg {...iconProps}>
      <circle cx="16" cy="9" r="4" />
      <path d="M8 27c0-5 3.6-9 8-9s8 4 8 9" />
      <path d="M4 16h4M24 16h4" />
    </svg>
  ),
};

/* A one-line purpose for each desk, so a visitor can pick the right one.     */
const deskPurpose: Record<string, string> = {
  "smart-spaces": "Business enquiries, projects and partnerships.",
  hr: "Careers, hiring and people matters.",
  grievance: "Complaints, concerns and redressal.",
  compliance: "Regulatory, statutory and compliance matters.",
  posh: "Prevention of sexual harassment at the workplace.",
};

export function OfficeDirectory() {
  const address = contact.info.find((item) => item.label === "Corporate office");
  const directions = contact.info.find((item) => item.label === "Directions");

  return (
    <section className={styles.section} id="directory" aria-labelledby="directory-title">
      <Container>
        <Reveal>
          <div className={styles.header}>
            <div>
              <Heading variant="section" id="directory-title" className={styles.heading}>
                {officeDirectory.heading}
              </Heading>
            </div>
            <a className={styles.jump} href="#business-enquiry">
              Prefer to write? Send an enquiry
              <Icon name="chevron-down" />
            </a>
          </div>
        </Reveal>

        <div className={styles.directory}>
          {officeDirectory.offices.map((office, index) => (
            <Reveal key={office.key} delay={(index % 3) as RevealDelay} className={styles.office}>
              <div className={styles.officeBody}>
                <span className={styles.officeIcon}>{deskIcons[office.key]}</span>
                <span className={styles.officeKind}>{office.kind}</span>
                <h3 className={styles.officeName}>{office.name}</h3>
                {deskPurpose[office.key] ? (
                  <p className={styles.officePurpose}>{deskPurpose[office.key]}</p>
                ) : null}
                <ul className={styles.lines}>
                  {office.lines.map((line) => (
                    <li key={line} className={styles.line}>
                      {line}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.contact}>
                {officeDirectory.detailsConfirmed ? (
                  <div className={styles.contactRow}>
                    <span className={styles.contactLabel}>Phone</span>{" "}
                    <a className={styles.contactPhone} href={phoneHref(office.phone)}>
                      {office.phone}
                    </a>
                  </div>
                ) : null}
                {office.email.href ? (
                  <a className={styles.emailRow} href={office.email.href}>
                    <span className={styles.emailIcon}>
                      <Icon name="mail" />
                    </span>{" "}
                    <span className={styles.emailText}>
                      <span className={styles.contactLabel}>Email</span>{" "}
                      <span className={styles.emailAddress}>{office.email.label}</span>
                    </span>{" "}
                    <span className={styles.emailArrow}>
                      <Icon name="arrow-up-right" />
                    </span>
                  </a>
                ) : (
                  <div className={styles.emailRow}>
                    <span className={styles.emailIcon}>
                      <Icon name="mail" />
                    </span>{" "}
                    <span className={styles.emailText}>
                      <span className={styles.contactLabel}>Email</span>{" "}
                      <span className={styles.emailAddress}>To be announced</span>
                    </span>
                  </div>
                )}
                {officeDirectory.detailsConfirmed ? (
                  <div className={styles.contactRow}>
                    <span className={styles.contactLabel}>Hours</span>{" "}
                    <span className={styles.contactHours}>{office.hours}</span>
                  </div>
                ) : null}
                {office.directions ? (
                  <ExternalLink href={office.directions.href} className={styles.directions}>
                    {office.directions.label}
                  </ExternalLink>
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>

        {address ? (
          <Reveal>
            <div className={styles.visit}>
              <span className={styles.visitIcon}>
                <Icon name="map-pin" />
              </span>
              <div className={styles.visitText}>
                <span className={styles.visitLabel}>Visit our corporate office</span>{" "}
                <span className={styles.visitAddress}>{address.value}</span>
              </div>
              {directions?.href ? (
                <a
                  className={styles.visitLink}
                  href={directions.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get directions
                  <Icon name="arrow-up-right" />
                </a>
              ) : null}
            </div>
          </Reveal>
        ) : null}

        {officeDirectory.detailsConfirmed ? (
          <SourceFootnote className={styles.note}>{officeDirectory.note}</SourceFootnote>
        ) : null}
      </Container>
    </section>
  );
}
