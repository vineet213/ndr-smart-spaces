"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/**
 * The anti-spam and consent part shared by both enquiry forms: a form id, a
 * render timestamp (time-trap), a hidden honeypot field, the Privacy Policy
 * consent checkbox and, when a site key is configured, a Cloudflare Turnstile
 * check. contact.php validates all of them; enquiry.ts checks the honeypot and
 * timing itself when posting to Web3Forms. Turnstile's script loads only once the
 * form nears the viewport, so pages that never reach the form never fetch it.
 */

// The widget only exists once a real site key is built in. Without one (static
// hosting before the custom domain) the other safeguards still apply.
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let scriptPromise: Promise<Turnstile> | null = null;
function loadTurnstile(): Promise<Turnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject());
    script.onerror = () => {
      scriptPromise = null;
      reject();
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Turnstile tokens are single-use: get a fresh one after a failed submission. */
export function resetVerification(form: HTMLFormElement) {
  const id = form.querySelector<HTMLElement>("[data-turnstile-id]")?.dataset.turnstileId;
  if (id) window.turnstile?.reset(id);
}

/** True once the check has produced a token (the widget writes it into the form). */
export function isVerified(form: HTMLFormElement) {
  if (!SITE_KEY) return true;
  return Boolean(new FormData(form).get("cf-turnstile-response"));
}

type FormSafeguardsProps = {
  formId: "homepage" | "contact";
  idPrefix: string;
  theme: "light" | "dark";
  consentLabel: string;
  consentError?: string;
  onConsentChange: () => void;
  styles: Record<string, string>;
};

export function FormSafeguards({
  formId,
  idPrefix,
  theme,
  consentLabel,
  consentError,
  onConsentChange,
  styles,
}: FormSafeguardsProps) {
  const honeypotRef = useRef<HTMLDivElement>(null);
  const captchaRef = useRef<HTMLDivElement>(null);

  // Time-trap stamp, set after mount (not during render, so server and client
  // markup match) as an attribute React does not manage: a hidden input's value
  // would be reset to its default on every re-render of the form.
  useEffect(() => {
    honeypotRef.current?.setAttribute("data-rendered-at", String(Date.now()));
  }, []);

  useEffect(() => {
    const container = captchaRef.current;
    if (!container || !SITE_KEY) return;
    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        loadTurnstile()
          .then((turnstile) => {
            if (cancelled || container.dataset.turnstileId) return;
            container.dataset.turnstileId = turnstile.render(container, {
              sitekey: SITE_KEY,
              theme,
              // The flexible widget needs 300px; narrow columns get the compact one.
              size: container.clientWidth < 300 ? "compact" : "flexible",
            });
          })
          .catch(() => {
            // Blocked or offline: the server rejects the submission and the form says so.
          });
      },
      { rootMargin: "400px" },
    );
    observer.observe(container);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [theme]);

  const consentId = `${idPrefix}-consent`;

  return (
    <>
      <input type="hidden" name="form" value={formId} />
      <div ref={honeypotRef} className={styles.honeypot} aria-hidden="true">
        <label htmlFor={`${idPrefix}-website`}>Leave this field empty</label>
        <input id={`${idPrefix}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.consentField}>
        <input
          id={consentId}
          className={styles.checkbox}
          type="checkbox"
          name="consent"
          value="yes"
          required
          aria-required
          aria-invalid={Boolean(consentError)}
          aria-describedby={consentError ? `${consentId}-error` : undefined}
          onChange={onConsentChange}
        />
        <label className={styles.consentLabel} htmlFor={consentId}>
          {consentLabel}{" "}
          <Link href="/privacy-policy/" className={styles.consentLink}>
            Privacy Policy
          </Link>
          .
        </label>
        {consentError ? (
          <span id={`${consentId}-error`} className={styles.error} role="alert">
            {consentError}
          </span>
        ) : null}
      </div>

      {SITE_KEY ? <div ref={captchaRef} className={styles.captcha} /> : null}
    </>
  );
}
