import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { BackToTop } from "@/components/BackToTop";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SmoothScroll } from "@/components/SmoothScroll";
import { runNavigationValidation } from "@/lib/navigationValidation";
import "../src/styles/index.css";

if (process.env.NODE_ENV === "development") {
  runNavigationValidation();
}

export const viewport: Viewport = {
  // Matches the header ground (--color-charcoal-masthead) so the mobile browser
  // toolbar blends with the masthead instead of flashing the default colour.
  themeColor: "#2a1216",
};

const SITE_URL = "https://ndrsmartspaces.com";
const SHARE_IMAGE = {
  url: "/og/ndr-smart-spaces.png",
  width: 1200,
  height: 630,
  alt: "NDR Smart Spaces: developing, owning and managing logistics and industrial infrastructure",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Self-referencing canonical, resolved against metadataBase and the page's own path.
  alternates: { canonical: "./" },
  title: {
    default: "NDR Smart Spaces Pvt. Ltd.",
    template: "%s · NDR Smart Spaces",
  },
  description:
    "NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial and institutional assets.",
  // Phone numbers are marked up explicitly; stop iOS auto-linking other digit runs.
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "NDR Smart Spaces",
    locale: "en_IN",
    title: "NDR Smart Spaces Pvt. Ltd.",
    description:
      "Developing, owning and managing high-quality industrial and institutional assets.",
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "NDR Smart Spaces Pvt. Ltd.",
    description:
      "Developing, owning and managing high-quality industrial and institutional assets.",
    images: [SHARE_IMAGE.url],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // The one webfont is otherwise only discovered after the CSS has been fetched and parsed.
  preload("/fonts/Exo2-latin.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });

  return (
    <html lang="en">
      <body>
        <SmoothScroll />
        <ScrollToTop />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main-content" tabIndex={-1}>
          <PageTransition>{children}</PageTransition>
        </main>
        <BackToTop />
        <BreadcrumbJsonLd />
      </body>
    </html>
  );
}
