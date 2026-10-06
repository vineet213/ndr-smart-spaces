"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { contact } from "@/lib/data/homepage";
import styles from "./EnquiryForm.module.css";

type FieldName = "name" | "email" | "company" | "enquiryType";
type FormValues = Record<FieldName, string> & { message: string };

const initialValues: FormValues = {
  name: "",
  email: "",
  company: "",
  enquiryType: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EnquiryForm() {
  const { fields, messageLabel, submit, sending, success, route } = contact.form;
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  function setField(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<FieldName, string>> = {};

    if (!values.name.trim()) nextErrors.name = "Please enter your name.";
    if (!values.email.trim()) {
      nextErrors.email = "Please enter your work email.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!values.company.trim()) nextErrors.company = "Please enter your company.";
    if (!values.enquiryType.trim()) nextErrors.enquiryType = "Please enter an enquiry type.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("sending");

    const recipient = route.default;
    const subject = `Business Enquiry — ${values.enquiryType}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      `Company: ${values.company}`,
      `Enquiry type: ${values.enquiryType}`,
      ``,
      values.message,
    ].join("\n");

    window.setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    }, 400);
  }

  if (status === "sent") {
    return (
      <p className={styles.success} role="status">
        {success}
      </p>
    );
  }

  const labelId = (name: string) => `enquiry-${name}`;

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <label className={styles.label} htmlFor={labelId(field.name)}>
            {field.label}
          </label>
          <input
            id={labelId(field.name)}
            className={styles.input}
            type={field.type}
            autoComplete={field.autocomplete}
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
