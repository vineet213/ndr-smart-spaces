# Contact form: deployment and go-live

The two enquiry forms (Homepage "Speak to our team" and Contact "Business Enquiry") send their submissions by email. `src/lib/enquiry.ts` picks the route in this order:

1. `NEXT_PUBLIC_CONTACT_ENDPOINT`: local mock only (`.env.development`).
2. **Web3Forms**, when `NEXT_PUBLIC_WEB3FORMS_KEY` is set. For static hosts that cannot run PHP, such as the GoDaddy app preview. No server code.
3. `/api/contact.php`, the PHP script that ships in the export, for cPanel hosting. It is used when no Web3Forms key is set.

## Option A: static host (Web3Forms), the current setup

1. Go to web3forms.com, enter the inbox that should receive enquiries, and verify the email they send. You get an **access key**.
2. Put it in `.env.production`: `NEXT_PUBLIC_WEB3FORMS_KEY=<key>` (the key is public by design, so committing it is fine).
3. Commit and push to `main`, then press **Update Preview** (or **Publish to Live**) in the host dashboard. The key is read at build time, so a rebuild is required.
4. Test: send an enquiry from each form and check the inbox, including spam. Replying should go to the visitor.

**Changing the recipient** (for example from the test inbox to the client's address): create a new key for the new address and update `.env.production`, then rebuild. The key is tied to the address it was created with.

Safeguards in this mode: a hidden honeypot field, a 3-second minimum fill time and the required privacy consent, all checked in the browser, plus Web3Forms' own spam filtering. Bot submissions get a fake "success" and nothing is sent.

Not available in this mode: the visitor auto-reply (Web3Forms offers autoresponders on paid plans only), and mail comes from Web3Forms' sender rather than the client's domain. The free plan has a monthly submission cap.

### Adding Cloudflare Turnstile later (custom domain)
Create a Turnstile site for the domain in Cloudflare (free), set `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>` in `.env.production` and rebuild. The widget appears on both forms and submission is blocked until it passes. Note that Web3Forms does not verify Turnstile tokens, so on this route it is a browser-side deterrent; for server-side verification use Option B.

## Option B: cPanel hosting (PHP)

Leave `NEXT_PUBLIC_WEB3FORMS_KEY` empty. Each submission is checked in this order: honeypot, 3-second minimum fill time, 5 enquiries per IP per hour, required fields, privacy consent, then Turnstile (when a secret is configured). The enquiry email and the visitor's auto-reply are sent from the site's own domain.

| Piece | Where | Purpose |
|---|---|---|
| `public/api/contact.php` | Exported to `out/api/` | Checks the submission and sends the emails |
| `public/api/config.example.php` | Exported to `out/api/` | Template for the server settings |
| `api/config.php` | **Created on the server only** (git-ignored) | Recipients, sender address, Turnstile secret, limits |
| `public/api/.htaccess` | Exported to `out/api/` | Blocks direct access to the config files |

1. **Sender mailbox:** in cPanel → Email Accounts, create `no-reply@<client-domain>`.
2. **Deliverability:** in cPanel → Email Deliverability, make sure SPF and DKIM are valid.
3. **Turnstile (optional):** create a Turnstile site in Cloudflare; build with `NEXT_PUBLIC_TURNSTILE_SITE_KEY=<site key>` and put the secret in `config.php`.
4. **Upload** the contents of `out/` to `public_html/`, including `api/` and its `.htaccess` (hidden files too).
5. **Server settings:** copy `public_html/api/config.example.php` to `public_html/api/config.php` and set `recipients`, `from_email`, `site_url` and `turnstile_secret`. Changing recipients later only means editing this file; no rebuild.
6. **Test** both forms, check the inbox (and spam) and the auto-reply.

If mail does not arrive: check spam, then cPanel → Track Delivery. GoDaddy limits how much mail PHP `mail()` can send per hour; if delivery is unreliable, switch `contact.php` to authenticated SMTP.

## Local testing (no PHP or Web3Forms needed)

- **Production build:** `npm run build`, then `npm start`. `POST /api/contact.php` is handled by the mock. (Leave `NEXT_PUBLIC_WEB3FORMS_KEY` empty for this.)
- **Dev server:** run `npm run contact:mock` in one terminal and `npm run dev` in another. `.env.development` points the forms at `http://localhost:3200`.
- **Results:** each "sent" enquiry and auto-reply appears as a JSON file in `.contact-outbox/`.

## Other
- **Contact details:** once the client confirms the office phone numbers and hours, set `detailsConfirmed: true` in `src/lib/data/contact.ts`, then rebuild.
- The form shows an error with a direct email link whenever sending fails, so enquiries are never lost silently.
