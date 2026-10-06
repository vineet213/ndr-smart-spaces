import type { ReactNode } from "react";
import { Header } from "@/components/header";
import { PageTransition } from "@/components/PageTransition";
import { SmoothScroll } from "@/components/SmoothScroll";
import { runNavigationValidation } from "@/lib/navigationValidation";

if (process.env.NODE_ENV === "development") {
  runNavigationValidation();
}

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <PageTransition>{children}</PageTransition>
      </main>
    </>
  );
}
