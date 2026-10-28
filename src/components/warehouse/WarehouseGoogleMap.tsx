import styles from "./WarehouseMap.module.css";

/**
 * Google Maps satellite view of the site, embedded as an iframe. It needs no
 * API key and loads only as the section nears the viewport (loading="lazy").
 */
export function WarehouseGoogleMap({ name, lat, lon }: { name: string; lat: number; lon: number }) {
  const src = `https://maps.google.com/maps?q=${lat},${lon}&t=k&z=17&hl=en&output=embed`;
  return (
    <div className={styles.frame}>
      <iframe
        className={styles.canvas}
        src={src}
        title={`Satellite map of ${name}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
