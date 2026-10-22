/**
 * Enquiry submission for the static site.
 *
 * Both enquiry forms hand their fields to one of three endpoints, in this order:
 *  1. NEXT_PUBLIC_CONTACT_ENDPOINT: the local mock (see .env.development), or any
 *     endpoint that speaks the same contract.
 *  2. Web3Forms, when NEXT_PUBLIC_WEB3FORMS_KEY is set. This is what static hosts
 *     with no PHP use: the browser posts straight to Web3Forms, which emails the
 *     address the key was created with. The key is public by design.
 *  3. /api/contact.php, the PHP script that ships in the export, for cPanel hosting.
 *
 * Whichever is used, the failure codes below are the same, so the forms don't care.
 */

/** Options for the "Enquiry type" dropdown on both enquiry forms. */
export const ENQUIRY_TYPES = [
  "Enquiry for a warehouse",
  "Compliance related enquiry",
  "Grievance / POSH redressal",
  "Career opportunity",
  "Others",
] as const;

const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const CUSTOM_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

const USE_WEB3FORMS = !CUSTOM_ENDPOINT && Boolean(WEB3FORMS_KEY);
const ENDPOINT = CUSTOM_ENDPOINT || (USE_WEB3FORMS ? WEB3FORMS_ENDPOINT : "/api/contact.php");

// Submissions faster than this after the form appeared are treated as bots.
const MIN_FILL_MS = 3000;

export type EnquiryError =
  "network" | "invalid" | "consent" | "verification" | "rate_limited" | "unknown";

export type EnquiryResult = { ok: true } | { ok: false; error: EnquiryError };

const KNOWN: readonly EnquiryError[] = ["invalid", "consent", "verification", "rate_limited"];

function field(data: FormData, name: string): string {
  return String(data.get(name) ?? "").trim();
}

async function submitToWeb3Forms(data: FormData): Promise<EnquiryResult> {
  const name = field(data, "name");
  const company = field(data, "company");
  const enquiryType = field(data, "enquiryType");
  const form = field(data, "form");
  const warehouse = field(data, "warehouse");
  const source = warehouse
    ? `Warehouse page: ${warehouse}`
    : form === "contact"
      ? "Contact page"
      : form === "chat"
        ? "Website chat"
        : "Homepage";

  const payload = {
    access_key: WEB3FORMS_KEY,
    subject: `Website enquiry: ${warehouse || enquiryType || "General"} (${name}, ${company})`,
    from_name: "NDR Smart Spaces Website",
    // Web3Forms uses `email` as the Reply-To, so replying answers the visitor.
    name,
    email: field(data, "email"),
    company,
    phone: field(data, "phone"),
    enquiry_type: enquiryType,
    message: field(data, "message") || "(no message)",
    source,
    consent: "given",
  };

  let response: Response;
  try {
    response = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, error: "network" };
  }
  const body = (await response.json().catch(() => null)) as { success?: boolean } | null;
  if (response.ok && body?.success) return { ok: true };
  if (response.status === 429) return { ok: false, error: "rate_limited" };
  if (response.status === 400 || response.status === 422) return { ok: false, error: "invalid" };
  return { ok: false, error: body ? "unknown" : "network" };
}

export async function submitEnquiry(form: HTMLFormElement): Promise<EnquiryResult> {
  const data = new FormData(form);
  // Render time for the time-trap, stamped by FormSafeguards after mount.
  const renderedAt =
    form.querySelector<HTMLElement>("[data-rendered-at]")?.dataset.renderedAt ?? "";
  data.set("t", renderedAt);

  if (USE_WEB3FORMS) {
    // Bots get a fake success so they learn nothing; nothing is sent. (The PHP
    // endpoint does the same checks itself.)
    const elapsed = Date.now() - Number(renderedAt || 0);
    if (field(data, "website") !== "" || !renderedAt || elapsed < MIN_FILL_MS) {
      return { ok: true };
    }
    return submitToWeb3Forms(data);
  }

  let response: Response;
  try {
    response = await fetch(ENDPOINT, { method: "POST", body: data });
  } catch {
    return { ok: false, error: "network" };
  }
  const body = (await response.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (response.ok && body?.ok) return { ok: true };
  const error = KNOWN.find((code) => code === body?.error);
  return { ok: false, error: error ?? (body ? "unknown" : "network") };
}

/** Visitor-facing text for each failure; the form adds the direct-email fallback. */
export const enquiryErrorText: Record<EnquiryError, string> = {
  network: "We couldn't reach our server. Please check your connection and try again.",
  invalid: "Some details look incomplete. Please check the form and try again.",
  consent: "Please confirm you agree to the Privacy Policy so we can respond.",
  verification: "We couldn't verify you're human. Please complete the check and try again.",
  rate_limited: "We've received several enquiries from you recently. Please try again later.",
  unknown: "Something went wrong sending your enquiry. Please try again.",
};
