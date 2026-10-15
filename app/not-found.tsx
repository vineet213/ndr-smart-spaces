import type { Metadata } from "next";
import { Button } from "@/components/ui";
import { Footer } from "@/components/sections/Footer";
import { PageMasthead } from "@/components/sections/PageMasthead";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page not found",
  // Next.js already marks 404 pages noindex. A 404 has no address of its own, so no canonical either.
  alternates: { canonical: null },
};

/**
 * Shown for any unknown URL. The root layout supplies the header; the static
 * export writes this page to out/404.html, which Apache serves for missing
 * files (ErrorDocument in public/.htaccess).
 */
export default function NotFound() {
  return (
    <>
      <PageMasthead
        id="not-found-title"
        title={{ before: "Page ", accent: "not found." }}
        subtext="The page you were looking for has moved or no longer exists. Start again from the home page, or reach our team directly."
      >
        <div className={styles.actions}>
          <Button href="/" tone="dark">
            Back to home
          </Button>
          <Button href="/contact/" tone="dark" variant="secondary">
            Contact us
          </Button>
        </div>
      </PageMasthead>
      <Footer />
    </>
  );
}
