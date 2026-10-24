"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { jumpTo, jumpToSection } from "@/lib/lenis";

/**
 * After a route change, land on the very top of the new page.
 *
 * Next.js scrolls the new page's own content into view, which sits below the
 * fixed header's spacer, so every page opened from a footer link ended up ~86px
 * down (title half under the navbar), arriving by a slow glide from the old
 * scroll position. This jumps straight to 0 instead. Links that target a
 * section (`/contact#business-enquiry`) land on that section: Next's own
 * smooth scroll to it is cut short by the smooth scroller, so it is jumped to
 * here once the new page has laid out.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.location.hash) {
      jumpTo(0);
      return;
    }
    const id = decodeURIComponent(window.location.hash.slice(1));
    const timer = window.setTimeout(() => jumpToSection(id), 50);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
