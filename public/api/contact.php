<?php
/**
 * Enquiry endpoint for the static site (GoDaddy cPanel / any PHP 7.4+ host).
 *
 * Both enquiry forms (Homepage "Speak to our team", Contact "Business Enquiry")
 * POST here. The request is checked (honeypot, time-trap, consent, Turnstile,
 * per-IP rate limit, field validation), the enquiry is mailed to the configured
 * recipients with Reply-To set to the visitor, and the visitor gets a short
 * fixed-template acknowledgement.
 *
 * Settings live in config.php next to this file (copy config.example.php).
 * Responses are JSON: { "ok": true } or { "ok": false, "error": "<code>" }.
 * scripts/contact-mock.mjs implements the same contract for local testing.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'method']);
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    respond(500, ['ok' => false, 'error' => 'config']);
}
$config = require $configFile;

/** Single-line value: trimmed, CR/LF removed (blocks header injection), length-capped. */
function line(string $key, int $max): string
{
    $value = trim((string) ($_POST[$key] ?? ''));
    $value = preg_replace('/[\r\n]+/', ' ', $value) ?? '';
    return mb_substr($value, 0, $max);
}

/* --- bots: honeypot and time-trap succeed silently so bots learn nothing ---- */

if (line('website', 200) !== '') {
    respond(200, ['ok' => true]);
}
$renderedAt = (int) ($_POST['t'] ?? 0);
$elapsedMs = (int) round(microtime(true) * 1000) - $renderedAt;
if ($renderedAt <= 0 || $elapsedMs < (int) $config['min_fill_ms']) {
    respond(200, ['ok' => true]);
}

/* --- rate limit per IP ------------------------------------------------------ */

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$bucket = sys_get_temp_dir() . '/ndr-enquiry-' . hash('sha256', $ip . __DIR__);
$now = time();
$window = (int) $config['rate_limit_window'];
$hits = array_filter(
    is_file($bucket) ? (json_decode((string) file_get_contents($bucket), true) ?: []) : [],
    static fn ($at) => is_int($at) && $at > $now - $window
);
if (count($hits) >= (int) $config['rate_limit_max']) {
    respond(429, ['ok' => false, 'error' => 'rate_limited']);
}

/* --- fields --------------------------------------------------------------- */

$form = line('form', 40) === 'contact' ? 'contact' : 'homepage';
$name = line('name', 120);
$email = line('email', 200);
$company = line('company', 160);
$phone = line('phone', 40);
$enquiryType = line('enquiryType', 120);
$message = mb_substr(trim((string) ($_POST['message'] ?? '')), 0, 5000);
$consent = ($_POST['consent'] ?? '') === 'yes';

$invalid = $name === ''
    || $company === ''
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || ($phone !== '' && !preg_match('/^[+]?[\d\s().-]+$/', $phone))
    || ($form === 'homepage' && $enquiryType === '');
if ($invalid) {
    respond(422, ['ok' => false, 'error' => 'invalid']);
}
if (!$consent) {
    respond(422, ['ok' => false, 'error' => 'consent']);
}

/* --- Turnstile ------------------------------------------------------------ */

if (!empty($config['turnstile_secret'])) {
    $verify = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($verify, [
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_POSTFIELDS => http_build_query([
            'secret' => $config['turnstile_secret'],
            'response' => (string) ($_POST['cf-turnstile-response'] ?? ''),
            'remoteip' => $ip,
        ]),
    ]);
    $result = json_decode((string) curl_exec($verify), true);
    curl_close($verify);
    if (empty($result['success'])) {
        respond(403, ['ok' => false, 'error' => 'verification']);
    }
}

/* --- send ----------------------------------------------------------------- */

$recipients = $config['recipients'][$form] ?? $config['recipients']['default'];
$subjectType = $enquiryType !== '' ? $enquiryType : 'General';
$subject = "Website enquiry: {$subjectType} ({$name}, {$company})";
$source = $form === 'contact' ? 'Contact page' : 'Homepage';

$body = implode("\n", array_filter([
    "New enquiry from the {$config['site_name']} website ({$source}).",
    '',
    "Name: {$name}",
    "Company: {$company}",
    "Email: {$email}",
    $phone !== '' ? "Phone: {$phone}" : null,
    $enquiryType !== '' ? "Enquiry type: {$enquiryType}" : null,
    '',
    'Message:',
    $message !== '' ? $message : '(no message)',
    '',
    '--',
    'Consent to processing: given',
    'Submitted: ' . gmdate('Y-m-d H:i') . ' UTC from ' . $ip,
    'Reply to this email to answer the enquirer directly.',
], static fn ($row) => $row !== null));

$encode = static fn (string $text) => '=?UTF-8?B?' . base64_encode($text) . '?=';
$from = $encode((string) $config['from_name']) . " <{$config['from_email']}>";
$headers = implode("\r\n", [
    "From: {$from}",
    'Reply-To: ' . $encode($name) . " <{$email}>",
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);
$envelope = '-f' . $config['from_email'];

$sent = mail(implode(', ', (array) $recipients), $encode($subject), $body, $headers, $envelope);
if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'send']);
}

$hits[] = $now;
@file_put_contents($bucket, json_encode(array_values($hits)), LOCK_EX);

/* Fixed text only: the visitor's message is never echoed back, so this cannot be used to relay spam. */
if (!empty($config['auto_reply'])) {
    $replyBody = implode("\n", [
        'Hello,',
        '',
        "Thank you for contacting {$config['site_name']}. We have received your enquiry and the right team will reply to you shortly.",
        '',
        'This is an automated acknowledgement; please do not reply to this email.',
        '',
        "{$config['site_name']}",
        (string) $config['site_url'],
    ]);
    $replyHeaders = implode("\r\n", [
        "From: {$from}",
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        'Auto-Submitted: auto-replied',
    ]);
    @mail($email, $encode("We've received your enquiry: {$config['site_name']}"), $replyBody, $replyHeaders, $envelope);
}

respond(200, ['ok' => true]);
