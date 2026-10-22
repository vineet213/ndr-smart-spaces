"use client";

import { useState } from "react";

export function CopyCoordinates({
  lat,
  lon,
  className,
}: {
  lat: number;
  lon: number;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard
      ?.writeText(`${lat}, ${lon}`)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  };

  return (
    <button type="button" className={className} onClick={copy}>
      {copied ? "Copied" : "Copy coordinates"}
    </button>
  );
}
