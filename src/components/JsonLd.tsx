/**
 * Invisible structured data. `<` is escaped so the payload can never close
 * its own <script> tag (see the Next.js JSON-LD guide).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }}
    />
  );
}
