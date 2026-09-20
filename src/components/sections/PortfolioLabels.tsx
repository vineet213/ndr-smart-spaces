"use client";

import type { Map as MapLibreMap } from "maplibre-gl";
import { useCallback, useEffect, useRef, useState } from "react";
import { CALLOUT_ID, LabelDom } from "@/lib/map/labelDom";
import type { CalloutLabel, CityLabel, LabelState, PinLabel } from "@/lib/map/labelDom";
import type { Rect } from "@/lib/map/types";
import styles from "./PortfolioLabels.module.css";

export type { CalloutLabel, CityLabel, PinLabel };

type Props = {
  map: MapLibreMap | null;
  level: "state" | "city";
  pins: readonly PinLabel[];
  cities: readonly CityLabel[];
  /** Name boxes are shown while true; hovered and spotlighted ones always are. */
  namesOn: boolean;
  hoveredId: string | null;
  spotlightId: string | null;
  callout: CalloutLabel | null;
  /** True while the camera flies; boxes hide until it lands. */
  flying: boolean;
  safeRect: () => Rect;
  onSelectCity: (city: string) => void;
  onSelectParcel: (id: string) => void;
  onHoverParcel: (id: string | null) => void;
  onCloseCallout: () => void;
};

/**
 * Every name box on the map. Boxes are HTML buttons placed by the pure layout
 * function in `labelLayout.ts`, so two of them can never overlap; positions are
 * written straight to the DOM on each map move (no React render per frame).
 */
export function PortfolioLabels({
  map,
  level,
  pins,
  cities,
  namesOn,
  hoveredId,
  spotlightId,
  callout,
  flying,
  safeRect,
  onSelectCity,
  onSelectParcel,
  onHoverParcel,
  onCloseCallout,
}: Props) {
  const [engine] = useState(() => new LabelDom());
  const live = useRef<LabelState>({
    level,
    pins,
    cities,
    namesOn,
    hoveredId,
    spotlightId,
    callout,
    flying,
    safeRect,
  });
  useEffect(() => {
    live.current = {
      level,
      pins,
      cities,
      namesOn,
      hoveredId,
      spotlightId,
      callout,
      flying,
      safeRect,
    };
  });

  const update = useCallback(() => {
    if (map) engine.update(map, live.current);
  }, [map, engine]);

  /* follow the camera */
  useEffect(() => {
    if (!map) return;
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    map.on("move", schedule);
    map.on("resize", schedule);
    map.on("moveend", schedule);
    schedule();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      map.off("move", schedule);
      map.off("resize", schedule);
      map.off("moveend", schedule);
    };
  }, [map, update]);

  /* re-run when the data or the featured boxes change; sizes may have changed too */
  useEffect(() => {
    engine.forgetSizes();
    const frame = requestAnimationFrame(() => update());
    return () => cancelAnimationFrame(frame);
  }, [pins, cities, callout, level, namesOn, hoveredId, spotlightId, flying, update, engine]);

  return (
    <div className={styles.layer}>
      <svg className={styles.svg} aria-hidden="true">
        {level === "state"
          ? cities.map((city) => (
              <circle
                key={city.city}
                ref={engine.dot(`city:${city.city}`)}
                r="4.5"
                className={styles.dot}
                opacity="0"
              />
            ))
          : null}
        {[...pins.map((pin) => pin.id), CALLOUT_ID].map((id) => (
          <line key={id} ref={engine.line(id)} className={styles.leader} opacity="0" />
        ))}
      </svg>

      {level === "state"
        ? cities.map((city) => (
            <button
              key={city.city}
              ref={engine.element(`city:${city.city}`)}
              type="button"
              data-state="off"
              className={styles.chip}
              onClick={() => onSelectCity(city.city)}
            >
              <span>{city.city}</span>
              <b>{city.count}</b>
            </button>
          ))
        : null}

      {level === "city"
        ? pins.map((pin) =>
            callout?.id === pin.id ? null : (
              <button
                key={pin.id}
                ref={engine.element(pin.id)}
                type="button"
                data-state="off"
                className={styles.pill}
                onClick={() => onSelectParcel(pin.id)}
                onMouseEnter={() => onHoverParcel(pin.id)}
                onMouseLeave={() => onHoverParcel(null)}
              >
                <strong>{pin.name}</strong>
                {pin.msfLabel ? <span>{pin.msfLabel}</span> : null}
              </button>
            ),
          )
        : null}

      {level === "city" && callout ? (
        <div
          ref={engine.element(CALLOUT_ID)}
          data-state="off"
          className={styles.callout}
          role="status"
        >
          <button
            type="button"
            className={styles.close}
            aria-label="Close"
            onClick={onCloseCallout}
          >
            ×
          </button>
          <span className={styles.eyebrow}>{callout.eyebrow}</span>
          <strong className={styles.title}>{callout.title}</strong>
          {callout.figures.length > 0 ? (
            <dl className={styles.figures}>
              {callout.figures.map((figure) => (
                <div key={figure.label}>
                  <dd>{figure.value}</dd>
                  <dt>{figure.label}</dt>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
