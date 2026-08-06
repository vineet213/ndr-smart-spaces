import type { ReactNode } from "react";
import { Header } from "@/components/header";

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default function LocaleLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
