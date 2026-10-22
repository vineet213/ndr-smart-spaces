"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { cityMapStyle } from "@/lib/map/cityMapStyle";
import styles from "./WarehouseMap.module.css";

const WORKER_URL = "/vendor/maplibre/maplibre-gl-worker.mjs";
const GOLD = "#f0b65a";
const INK = "#faf7f2";
const HALO = "#14120f";

type Point = { label: string; lat: number; lon: number };

export type WarehouseMapProps = {
  site: { name: string; lat: number; lon: number };
  landmarks: readonly Point[];
  onFailure?: () => void;
};

/**
 * The site and its nearby landmarks on the site's own dark basemap, each joined
 * to the site by a dashed line so the connectivity list reads as a picture.
 */
export default function WarehouseMap({ site, landmarks, onFailure }: WarehouseMapProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const failRef = useRef(onFailure);
  useEffect(() => {
    failRef.current = onFailure;
  });

  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const bounds = new maplibregl.LngLatBounds([site.lon, site.lat], [site.lon, site.lat]);
    for (const point of landmarks) bounds.extend([point.lon, point.lat]);

    let map: maplibregl.Map;
    try {
      maplibregl.setWorkerUrl(WORKER_URL);
      map = new maplibregl.Map({
        container,
        style: cityMapStyle,
        bounds,
        fitBoundsOptions: { padding: 56, maxZoom: 13 },
        minZoom: 5,
        maxZoom: 17,
        attributionControl: false,
        dragRotate: false,
        pitchWithRotate: false,
        cooperativeGestures: true,
      });
    } catch {
      failRef.current?.();
      return;
    }
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("load", () => {
      map.addSource("links", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: landmarks.map((point) => ({
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: [
                [site.lon, site.lat],
                [point.lon, point.lat],
              ],
            },
          })),
        },
      });
      map.addSource("landmarks", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: landmarks.map((point) => ({
            type: "Feature",
            properties: { label: point.label },
            geometry: { type: "Point", coordinates: [point.lon, point.lat] },
          })),
        },
      });
      map.addSource("site", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: { label: site.name },
          geometry: { type: "Point", coordinates: [site.lon, site.lat] },
        },
      });

      map.addLayer({
        id: "links",
        type: "line",
        source: "links",
        paint: { "line-color": GOLD, "line-opacity": 0.45, "line-width": 1.2, "line-dasharray": [2, 3] },
      });
      map.addLayer({
        id: "landmarks",
        type: "circle",
        source: "landmarks",
        paint: {
          "circle-radius": 4.5,
          "circle-color": INK,
          "circle-stroke-color": HALO,
          "circle-stroke-width": 1.5,
        },
      });
      map.addLayer({
        id: "landmark-labels",
        type: "symbol",
        source: "landmarks",
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Noto Sans Regular"],
          "text-size": 12,
          "text-offset": [0, 1.1],
          "text-anchor": "top",
          "text-max-width": 10,
        },
        paint: { "text-color": INK, "text-halo-color": HALO, "text-halo-width": 1.5 },
      });
      map.addLayer({
        id: "site-halo",
        type: "circle",
        source: "site",
        paint: { "circle-radius": 18, "circle-color": GOLD, "circle-opacity": 0.18 },
      });
      map.addLayer({
        id: "site",
        type: "circle",
        source: "site",
        paint: {
          "circle-radius": 8,
          "circle-color": GOLD,
          "circle-stroke-color": HALO,
          "circle-stroke-width": 2,
        },
      });
      map.addLayer({
        id: "site-label",
        type: "symbol",
        source: "site",
        layout: {
          "text-field": ["get", "label"],
          "text-font": ["Noto Sans Bold"],
          "text-size": 14,
          "text-offset": [0, -1.6],
          "text-anchor": "bottom",
        },
        paint: { "text-color": GOLD, "text-halo-color": HALO, "text-halo-width": 2 },
      });
    });

    map.on("error", (event) => {
      if (!map.loaded() && event.error?.message?.includes("WebGL")) failRef.current?.();
    });

    return () => map.remove();
  }, [site, landmarks]);

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      role="img"
      aria-label={`Map of ${site.name} and nearby transport links`}
    />
  );
}
