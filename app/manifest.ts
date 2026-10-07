import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NDR Smart Spaces Pvt. Ltd.",
    short_name: "NDR Smart Spaces",
    start_url: "/en/",
    display: "browser",
    background_color: "#faf7f2",
    theme_color: "#2a1216",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
