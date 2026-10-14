"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { correspondenceForm } from "@/lib/data/contact";
import { enquiryErrorText, submitEnquiry } from "@/lib/enquiry";
import {
  FIELD_MAX,
  isValidEmail,
  isValidLabel,
  isValidName,
  isValidPhone,
  sanitizePhone,
} from "@/lib/formValidation";
import { FormSafeguards, isVerified, resetVerification } from "./FormSafeguards";
import styles from "./CorrespondenceForm.module.css";

type FieldName = "name" | "company" | "email" | "phone";
type FormValues = Record<FieldName, string> & { enquiryType: string; message: string };

const initialValues: FormValues = {
  name: "",
  company: "",
  email: "",
  phone: "",
  enquiryType: "",
  message: "",
};

export function CorrespondenceForm() {
  const { fields, messageLabel, submit, sending, success, consentLabel, consentError, route } =
    correspondenceForm;
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [consentMissing, setConsentMissing] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const labelId = (name: string) => `correspondence-${name}`;

  function setField(name: FieldName, value: string) {
    const next = name === "phone" ? sanitizePhone(value) : value;
    setValues((prev) => ({ ...prev, [name]: next }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (!values.name.trim()) {
      nextErrors.name = "Please enter your name.";
    } else if (!isValidName(values.name)) {
      nextErrors.name = "Please enter your name using letters only.";
    }
    if (!values.company.trim()) {
      nextErrors.company = "Please enter your company.";
    } else if (!isValidLabel(values.company, FIELD_MAX.company)) {
      nextErrors.company = "Please enter a valid company name.";
    }
    if (!values.email.trim()) {
      nextErrors.email = "Please enter your work email.";
    } else if (!isValidEmail(values.email)) {
      nextErrors.email = "Please enter a valid email address, like name@company.com.";
    }
    if (values.phone.trim() && !isValidPhone(values.phone)) {
      nextErrors.phone = "Please enter a phone number with 7 to 15 digits.";
    }
    const noConsent = !new FormData(form).get("consent");

    setErrors(nextErrors);
    setConsentMissing(noConsent);
    if (Object.keys(nextErrors).length > 0 || noConsent) {
      // Bring the first problem into view and under the keyboard's focus.
      const firstInvalid = fields.find((field) => nextErrors[field.name]);
      const target = firstInvalid ? labelId(firstInvalid.name) : labelId("consent");
      window.requestAnimationFrame(() => document.getElementById(target)?.focus());
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
      <div className={styles.success} role="status">
        <p>{success}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <label className={styles.label} htmlFor={labelId(field.name)}>
            {field.label}
            {!field.required ? <span className={styles.optional}>Optional</span> : null}
          </label>
          <input
            id={labelId(field.name)}
            className={styles.input}
            name={field.name}
            type={field.type}
            autoComplete={field.autocomplete}
            inputMode={field.type === "email" ? "email" : field.type === "tel" ? "tel" : undefined}
            maxLength={FIELD_MAX[field.name]}
            enterKeyHint="next"
            autoCapitalize={field.type === "email" ? "none" : undefined}
            required={field.required}
            aria-required={field.required}
            value={values[field.name]}
            onChange={(event) => setField(field.name, event.target.value)}
            aria-invalid={Boolean(errors[field.name])}
            aria-describedby={errors[field.name] ? `${labelId(field.name)}-error` : undefined}
          />
          {errors[field.name] ? (
            <span id={`${labelId(field.name)}-error`} className={styles.error} role="alert">
              {errors[field.name]}
            </span>
          ) : null}
        </div>
      ))}

      <div className={styles.field}>
        <label className={styles.label} htmlFor={labelId("enquiryType")}>
          Enquiry type
          <span className={styles.optional}>Optional</span>
        </label>
        <input
          id={labelId("enquiryType")}
          className={styles.input}
          name="enquiryType"
          type="text"
          value={values.enquiryType}
          onChange={(event) => setValues((prev) => ({ ...prev, enquiryType: event.target.value }))}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={labelId("message")}>
          {messageLabel}
        </label>
        <textarea
          id={labelId("message")}
          className={styles.textarea}
          name="message"
          rows={4}
          value={values.message}
          onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
        />
      </div>

      <FormSafeguards
        formId="contact"
        idPrefix="correspondence"
        theme="light"
        consentLabel={consentLabel}
        consentError={consentMissing ? consentError : undefined}
        onConsentChange={() => setConsentMissing(false)}
        styles={styles}
      />

      {status === "error" ? (
        <div className={styles.formError} role="alert">
          <p>{submitError}</p>
          <p className={styles.fallback}>
            You can also write to us directly at{" "}
            <a href={`mailto:${route.General}`}>{route.General}</a>.
          </p>
        </div>
      ) : null}

      <button
        className={styles.submit}
        type="submit"
        disabled={status === "sending"}
        aria-busy={status === "sending"}
      >
        {status === "sending" ? sending : submit}
      </button>
    </form>
  );
}
