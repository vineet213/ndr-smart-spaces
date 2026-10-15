/**
 * Renders the site's link-preview (Open Graph / Twitter) card to
 * public/og/ndr-smart-spaces.png (1200x630). Run once when the brand changes:
 *   node scripts/make-og-image.mjs
 */
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const W = 1200;
const H = 630;
const logo = await readFile("public/logos/ndr-smart-spaces-lockup.svg");
const LOGO_W = 620;
const logoPng = await sharp(logo, { density: 600 }).resize({ width: LOGO_W }).png().toBuffer();
const { height: LOGO_H } = await sharp(logoPng).metadata();

const ground = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="18%" r="75%">
      <stop offset="0" stop-color="#5a1e22"/>
      <stop offset="1" stop-color="#1c1a19"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect x="0" y="${H - 6}" width="${W}" height="6" fill="#f0b65a"/>
  <path d="M1040 70 H1130 V160" fill="none" stroke="#f0b65a" stroke-width="8"/>
  <rect x="96" y="402" width="88" height="3" fill="#f0b65a"/>
  <text x="96" y="462" font-family="Segoe UI, Arial, sans-serif" font-size="38" font-weight="300" fill="#faf7f2">Developing, owning and managing</text>
  <text x="96" y="512" font-family="Segoe UI, Arial, sans-serif" font-size="38" font-weight="300" fill="#faf7f2">logistics and industrial infrastructure.</text>
  <text x="96" y="572" font-family="Segoe UI, Arial, sans-serif" font-size="22" letter-spacing="3" fill="#f0b65a">NDRSMARTSPACES.COM</text>
</svg>`);

await sharp(ground)
  .composite([{ input: logoPng, left: 92, top: Math.round(250 - LOGO_H) }])
  .png({ compressionLevel: 9 })
  .toFile("public/og/ndr-smart-spaces.png");
console.log("wrote public/og/ndr-smart-spaces.png", `${W}x${H}`);
