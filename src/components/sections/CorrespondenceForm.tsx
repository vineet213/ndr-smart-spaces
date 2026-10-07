"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { correspondenceForm } from "@/lib/data/contact";
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

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+]?[\d\s().-]+$/;

export function CorrespondenceForm() {
  const { fields, messageLabel, submit, sending, success, route } = correspondenceForm;
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const labelId = (name: string) => `correspondence-${name}`;

  function setField(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!values.company.trim()) nextErrors.company = "Please enter your company.";
    if (!values.email.trim()) {
      nextErrors.email = "Please enter your work email.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (values.phone.trim() && !phonePattern.test(values.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Bring the first problem into view and under the keyboard's focus.
      const firstInvalid = fields.find((field) => nextErrors[field.name]);
      if (firstInvalid) {
        window.requestAnimationFrame(() =>
          document.getElementById(labelId(firstInvalid.name))?.focus(),
        );
      }
      return;
    }

    setStatus("sending");

    const enquiryType = values.enquiryType.trim();
    const recipient = route.General;
    const subject = enquiryType ? `Enquiry — ${enquiryType}` : "Enquiry";
    const body = [
      `Name: ${values.name}`,
      `Company: ${values.company}`,
      `Email: ${values.email}`,
      values.phone.trim() ? `Phone: ${values.phone.trim()}` : "",
      enquiryType ? `Enquiry type: ${enquiryType}` : "",
      ``,
      values.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    }, 400);
  }

  if (status === "sent") {
    return (
      <div className={styles.success} role="status">
        <p>{success}</p>
        {/* The enquiry is handed to the visitor's mail app (static site, no backend). */}
        {/* If none is set up (common on phones) nothing opens, so say where to write. */}
        <p className={styles.fallback}>
          Your email app should have opened with your message ready to send. If it did not, write to{" "}
          <a href={`mailto:${route.General}`}>{route.General}</a>.
        </p>
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
          rows={4}
          value={values.message}
          onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))}
        />
      </div>

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
