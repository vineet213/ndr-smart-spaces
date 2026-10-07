import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import type { ReactNode } from "react";
import "../src/styles/index.css";

export const viewport: Viewport = {
  // Matches the header ground (--color-charcoal-masthead) so the mobile browser
  // toolbar blends with the masthead instead of flashing the default colour.
  themeColor: "#2a1216",
};

export const metadata: Metadata = {
  title: {
    default: "NDR Smart Spaces Pvt. Ltd.",
    template: "%s · NDR Smart Spaces",
  },
  description:
    "NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial and institutional assets.",
  // Phone numbers are marked up explicitly; stop iOS auto-linking other digit runs.
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // The one webfont is otherwise only discovered after the CSS has been fetched and parsed.
  preload("/fonts/Exo2-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
