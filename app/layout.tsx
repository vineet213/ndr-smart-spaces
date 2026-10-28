import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import { BackToTop } from "@/components/BackToTop";
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { EnquireTab } from "@/components/EnquireTab";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SmoothScroll } from "@/components/SmoothScroll";
import { runNavigationValidation } from "@/lib/navigationValidation";
import { SHARE_IMAGE, SITE_DESCRIPTION, SITE_URL } from "@/lib/seo";
import "../src/styles/index.css";

if (process.env.NODE_ENV === "development") {
  runNavigationValidation();
}

export const viewport: Viewport = {
  // Matches the header ground (--color-charcoal-masthead) so the mobile browser
  // toolbar blends with the masthead instead of flashing the default colour.
  themeColor: "#2a1216",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Self-referencing canonical, resolved against metadataBase and the page's own path.
  alternates: { canonical: "./" },
  title: {
    default: "NDR Smart Spaces Pvt. Ltd.",
    template: "%s · NDR Smart Spaces",
  },
  description: SITE_DESCRIPTION,
  // Phone numbers are marked up explicitly; stop iOS auto-linking other digit runs.
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    siteName: "NDR Smart Spaces",
    locale: "en_IN",
    title: "NDR Smart Spaces Pvt. Ltd.",
    description: SITE_DESCRIPTION,
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "NDR Smart Spaces Pvt. Ltd.",
    description: SITE_DESCRIPTION,
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
        <EnquireTab />
        <BackToTop />
        <ChatLauncher />
        <BreadcrumbJsonLd />
      </body>
    </html>
  );
}
