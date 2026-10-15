"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenisInstance } from "@/lib/lenis";

/**
 * After a route change, land on the very top of the new page.
 *
 * Next.js scrolls the new page's own content into view, which sits below the
 * fixed header's spacer, so every page opened from a footer link ended up ~86px
 * down (title half under the navbar), arriving by a slow glide from the old
 * scroll position. This jumps straight to 0 instead. Links that target a
 * section (`/en/contact#business-enquiry`) are left to the browser.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    // The site's smooth scroll-behavior would otherwise animate this jump.
    root.style.scrollBehavior = "auto";
    getLenisInstance()?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    root.style.scrollBehavior = previous;
  }, [pathname]);

  return null;
}
