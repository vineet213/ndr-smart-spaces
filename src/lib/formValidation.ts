/**
 * Field rules shared by both enquiry forms (Homepage and Contact page). The
 * server (contact.php / Web3Forms) re-checks, but these give the visitor
 * immediate, specific feedback and keep junk out of the inbox.
 */

export const FIELD_MAX = { name: 80, company: 120, email: 254, phone: 20, enquiryType: 120 } as const;

// Local part: letters, digits and . _ % + - (no leading/trailing/double dots);
// domain: dot-separated labels ending in a 2+ letter TLD.
const EMAIL = /^[A-Za-z0-9_%+-]+(\.[A-Za-z0-9_%+-]+)*@([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  return email.length <= FIELD_MAX.email && EMAIL.test(email);
}

/** A person's name: letters (any script), spaces and . ' - only; no digits or symbols. */
export function isValidName(value: string): boolean {
  const name = value.trim();
  return name.length >= 2 && name.length <= FIELD_MAX.name && /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(name);
}

/** Company / free-text label: at least two characters, with at least one letter or digit. */
export function isValidLabel(value: string, max: number): boolean {
  const text = value.trim();
  return text.length >= 2 && text.length <= max && /[\p{L}\p{N}]/u.test(text);
}

/** Keeps only what a phone number can contain: digits, spaces, ( ) -, and a leading +. */
export function sanitizePhone(value: string): string {
  const cleaned = value.replace(/[^\d\s()+-]/g, "");
  const plusFirst = cleaned.startsWith("+") ? "+" : "";
  return (plusFirst + cleaned.replace(/\+/g, "")).slice(0, FIELD_MAX.phone);
}

/** 7 to 15 digits (the international E.164 range), with optional formatting characters. */
export function isValidPhone(value: string): boolean {
  const phone = value.trim();
  if (!/^\+?[\d\s()-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}
