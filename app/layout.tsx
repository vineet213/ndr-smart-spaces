import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../src/styles/index.css";

export const metadata: Metadata = {
  title: {
    default: "NDR Smart Spaces Pvt. Ltd.",
    template: "%s · NDR Smart Spaces",
  },
  description:
    "NDR Smart Spaces is a diversified infrastructure organization focused on developing, owning, and managing high-quality industrial, commercial and institutional assets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
