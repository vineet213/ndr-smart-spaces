"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { contact } from "@/lib/data/homepage";
import { ENQUIRY_TYPES, enquiryErrorText, submitEnquiry } from "@/lib/enquiry";
import {
  FIELD_MAX,
  isValidEmail,
  isValidLabel,
  isValidName,
  isValidPhone,
  sanitizePhone,
} from "@/lib/formValidation";
import {
  FormSafeguards,
  isVerified,
  resetVerification,
} from "@/components/sections/FormSafeguards";
import styles from "./ChatEnquiryCard.module.css";

/**
 * The enquiry form offered inside the chat when the assistant judges the visitor
 * wants to talk to someone. It sends through the same path as the site's other
 * enquiry forms (src/lib/enquiry.ts), marked as coming from the website chat,
 * with the visitor's recent questions as the message. Nothing here goes to the AI.
 */

type Field = "name" | "company" | "email" | "phone";
const FIELDS: {
  name: Field;
  label: string;
  type: string;
  autoComplete: string;
  optional?: boolean;
}[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  { name: "email", label: "Work email", type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone (optional)", type: "tel", autoComplete: "tel", optional: true },
];

function validate(name: Field, value: string): string | undefined {
  const text = value.trim();
  if (name === "name") return isValidName(text) ? undefined : "Please enter your name.";
  if (name === "company")
    return isValidLabel(text, FIELD_MAX.company) ? undefined : "Please enter your company.";
  if (name === "email") return isValidEmail(text) ? undefined : "Please enter a valid email.";
  return !text || isValidPhone(text) ? undefined : "Please enter a valid phone number.";
}

type ChatEnquiryCardProps = { summary: string };

export function ChatEnquiryCard({ summary }: ChatEnquiryCardProps) {
  const { consentLabel, consentError, success, route } = contact.form;
  const [values, setValues] = useState<Record<Field, string>>({
    name: "",
    company: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [consentMissing, setConsentMissing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors: Partial<Record<Field, string>> = {};
    for (const field of FIELDS) {
      const error = validate(field.name, values[field.name]);
      if (error) nextErrors[field.name] = error;
    }
    const noConsent = !new FormData(form).get("consent");
    setErrors(nextErrors);
    setConsentMissing(noConsent);
    const first = FIELDS.find((field) => nextErrors[field.name]);
    if (first || noConsent) {
      form
        .querySelector<HTMLElement>(first ? `#chat-enquiry-${first.name}` : "#chat-enquiry-consent")
        ?.focus();
      return;
    }
    if (!isVerified(form)) {
      setSubmitError(enquiryErrorText.verification);
      setStatus("error");
      return;
    }
    setStatus("sending");
    const result = await submitEnquiry(form);
    if (result.ok) {
      setStatus("sent");
      return;
    }
    resetVerification(form);
    setSubmitError(enquiryErrorText[result.error]);
    setStatus("error");
  }

  if (status === "sent") {
    return (
      <div className={styles.sent} role="status">
        {success} The team will get back to you shortly.
      </div>
    );
  }

  return (
    <form
      className={styles.card}
      onSubmit={onSubmit}
      noValidate
      aria-label="Send an enquiry to the NDR team"
    >
      <p className={styles.intro}>Leave your details and the right team will get in touch.</p>
      {FIELDS.map((field) => (
        <div key={field.name} className={styles.field}>
          <label className={styles.label} htmlFor={`chat-enquiry-${field.name}`}>
            {field.label}
          </label>
          <input
            id={`chat-enquiry-${field.name}`}
            className={styles.input}
            name={field.name}
            type={field.type}
            autoComplete={field.autoComplete}
            inputMode={field.type === "email" ? "email" : field.type === "tel" ? "tel" : undefined}
            maxLength={FIELD_MAX[field.name]}
            required={!field.optional}
            aria-invalid={Boolean(errors[field.name])}
            aria-describedby={errors[field.name] ? `chat-enquiry-${field.name}-error` : undefined}
            value={values[field.name]}
            onChange={(event) => {
              const value =
                field.name === "phone" ? sanitizePhone(event.target.value) : event.target.value;
              setValues((prev) => ({ ...prev, [field.name]: value }));
              setErrors((prev) => ({ ...prev, [field.name]: undefined }));
            }}
          />
          {errors[field.name] ? (
            <span id={`chat-enquiry-${field.name}-error`} className={styles.error} role="alert">
              {errors[field.name]}
            </span>
          ) : null}
        </div>
      ))}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="chat-enquiry-type">
          Enquiry type
        </label>
        <select
          id="chat-enquiry-type"
          className={`${styles.input} ${styles.select}`}
          name="enquiryType"
          defaultValue={ENQUIRY_TYPES[0]}
        >
          {ENQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <input type="hidden" name="message" value={`Asked in the website chat:\n${summary}`} />

      <FormSafeguards
        formId="chat"
        idPrefix="chat-enquiry"
        theme="dark"
        consentLabel={consentLabel}
        consentError={consentMissing ? consentError : undefined}
        onConsentChange={() => setConsentMissing(false)}
        styles={styles}
      />

      {status === "error" ? (
        <p className={styles.formError} role="alert">
          {submitError} You can also write to{" "}
          <a href={`mailto:${route.default}`}>{route.default}</a>.
        </p>
      ) : null}

      <button
        type="submit"
        className={styles.submit}
        disabled={status === "sending"}
        aria-busy={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send to the team"}
      </button>
    </form>
  );
}
