import { ZONE_CHAPTERS, atlasField, geoZones, locationsInZone } from "@/lib/data/portfolio";
import styles from "./ZoneLegend.module.css";

export function ZoneLegend() {
  return (
    <div className={styles.legend} aria-label={atlasField.zoneIndexLabel}>
      <span className={styles.label}>{atlasField.zoneIndexLabel}</span>
      <ol className={styles.rows}>
        {geoZones.map((zone) => (
          <li key={zone.id} className={styles.cell}>
            <span className={styles.mark} aria-hidden="true" />
            <div className={styles.text}>
              <span className={styles.name}>
                <span className={styles.chapter} aria-hidden="true">
                  {ZONE_CHAPTERS[zone.id]}
                </span>
                {zone.name}
              </span>
              <span className={styles.fact}>{zone.fact}</span>
            </div>
            <span className={styles.count}>
              {locationsInZone(zone.id).length}
              <span className={styles.countUnit}>{atlasField.locationUnitLabel}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
