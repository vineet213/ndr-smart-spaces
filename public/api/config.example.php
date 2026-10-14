<?php
/**
 * Settings for contact.php. On the server, copy this file to config.php in the
 * same folder and edit it there; config.php is git-ignored and never served
 * as text (see .htaccess). Changing recipients needs no site rebuild.
 */

return [
    // Who receives enquiries. 'homepage' / 'contact' override 'default' per form.
    // Testing inbox for now; replace with the client's addresses before go-live.
    'recipients' => [
        'default' => ['s.vineet2004@gmail.com'],
    ],

    // Must be a real mailbox on the site's own domain (create it in cPanel → Email
    // Accounts), or GoDaddy will refuse or junk the mail.
    'from_email' => 'no-reply@example.com',
    'from_name' => 'NDR Smart Spaces Website',

    'site_name' => 'NDR Smart Spaces',
    'site_url' => 'https://example.com',

    // Cloudflare Turnstile secret key for the site's domain. Empty skips the check
    // (only for testing). Its site key goes in NEXT_PUBLIC_TURNSTILE_SITE_KEY at build.
    'turnstile_secret' => '',

    // Send the visitor a short "we've received your enquiry" email.
    'auto_reply' => true,

    // At most rate_limit_max successful enquiries per IP per rate_limit_window seconds.
    'rate_limit_max' => 5,
    'rate_limit_window' => 3600,

    // Submissions faster than this after the form appeared are treated as bots.
    'min_fill_ms' => 3000,
];
