"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/layout";
import { Heading, Lede } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import {
  aumAssetById,
  aumPinsByState,
  aumStates,
  constructionByState,
  constructionStates,
  formatMsf,
  propertyRegister,
  underConstructionAssets,
} from "@/lib/data/portfolio";
import type { AtlasPinData } from "@/lib/data/portfolio";
import { indianStateById } from "@/lib/data/india-states";
import { MapContextBar } from "./MapContextBar";
import { PortfolioAtlas } from "./PortfolioAtlas";
import { PortfolioPanel, recordMsf } from "./PortfolioPanel";
import type { CardCity, CardRecord, CityGroup, PanelLevel } from "./PortfolioPanel";
import type { SearchItem } from "./PortfolioSearch";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./PropertyRegister.module.css";

const PortfolioMap = dynamic(() => import("./PortfolioMap"), { ssr: false });

type RegisterMode = "aum" | "construction";

const round2 = (value: number) => Math.round(value * 100) / 100;

export function PropertyRegister() {
  const [mode, setMode] = useState<RegisterMode>("aum");
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [calloutOpen, setCalloutOpen] = useState(false);
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const searchTimer = useRef<number | undefined>(undefined);
  const [sheetOpen, setSheetOpen] = useState(true);

  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false);
  const { ref: sectionRef, inView: sectionInView } = useInView<HTMLDivElement>({
    threshold: 0,
    rootMargin: "600px 0px",
  });

  const noun = mode === "aum" ? "warehouse" : "project";
  const currentStates = mode === "aum" ? aumStates : constructionStates;
  const constructionAssets = useMemo(() => underConstructionAssets(), []);

  const stateNameOf = useCallback(
    (stateId: string | null) => (stateId ? (indianStateById(stateId)?.name ?? stateId) : ""),
    [],
  );

  /* data -------------------------------------------------------------------- */

  const allPins: readonly AtlasPinData[] = useMemo(
    () =>
      mode === "aum"
        ? aumStates.flatMap((state) => aumPinsByState(state.stateId))
        : constructionStates.flatMap((state) => constructionByState(state.stateId)),
    [mode],
  );

  const statePins = useMemo(
    () => (selectedStateId ? allPins.filter((pin) => pin.stateId === selectedStateId) : []),
    [allPins, selectedStateId],
  );

  const recordFor = useCallback(
    (pin: AtlasPinData): CardRecord | null => {
      if (mode === "aum") {
        const asset = aumAssetById(pin.id);
        return asset ? { kind: "aum", asset } : null;
      }
      const asset = constructionAssets.find((item) => item.id === pin.id);
      if (!asset) return null;
      const linked = asset.assetsUnderManagementId
        ? aumAssetById(asset.assetsUnderManagementId)
        : null;
      return { kind: "construction", asset, linked };
    },
    [mode, constructionAssets],
  );

  const groups: readonly CityGroup[] = useMemo(() => {
    const byCity = new Map<string, CardRecord[]>();
    for (const pin of statePins) {
      if (!pin.city) continue;
      const record = recordFor(pin);
      if (!record) continue;
      const list = byCity.get(pin.city);
      if (list) list.push(record);
      else byCity.set(pin.city, [record]);
    }
    return [...byCity.entries()]
      .map(([city, records]) => {
        const withArea = records
          .map(recordMsf)
          .filter((value): value is number => value !== undefined);
        return {
          city,
          records,
          msf: withArea.length > 0 ? round2(withArea.reduce((sum, value) => sum + value, 0)) : null,
        };
      })
      .sort((a, b) => b.records.length - a.records.length || a.city.localeCompare(b.city));
  }, [statePins, recordFor]);

  const stateSummary = currentStates.find((state) => state.stateId === selectedStateId) ?? null;
  const stateName = stateNameOf(selectedStateId);

  const activeGroup = groups.find((group) => group.city === selectedCityId) ?? null;
  const cityRecords = activeGroup?.records ?? [];
  const city: CardCity | null =
    selectedStateId && activeGroup
      ? {
          name: activeGroup.city,
          stateId: selectedStateId,
          stateName,
          count: activeGroup.records.length,
          totalMsf: activeGroup.msf,
        }
      : null;

  const recordIndex = cityRecords.findIndex((record) => record.asset.id === selectedParcelId);
  const record = recordIndex >= 0 ? cityRecords[recordIndex] : null;

  const level: PanelLevel = record
    ? "warehouse"
    : city
      ? "city"
      : selectedStateId
        ? "state"
        : "india";

  /* selection --------------------------------------------------------------- */

  const handleModeChange = useCallback((next: RegisterMode) => {
    window.clearTimeout(searchTimer.current);
    setMode(next);
    setSelectedStateId(null);
    setSelectedCityId(null);
    setSelectedParcelId(null);
    setSpotlightId(null);
    setCalloutOpen(false);
  }, []);

  const handleStateSelect = useCallback((stateId: string | null) => {
    window.clearTimeout(searchTimer.current);
    setSelectedStateId(stateId);
    setSelectedCityId(null);
    setSelectedParcelId(null);
    setSpotlightId(null);
    setCalloutOpen(stateId !== null);
  }, []);

  const handleCitySelect = useCallback((cityName: string | null) => {
    window.clearTimeout(searchTimer.current);
    setSelectedCityId(cityName);
    setSelectedParcelId(null);
    setSpotlightId(null);
    setCalloutOpen(cityName !== null);
  }, []);

  /* a warehouse only opens from inside its city: from a pin, a name box or the city's list */
  const handleRecordSelect = useCallback((id: string | null) => {
    window.clearTimeout(searchTimer.current);
    setSelectedParcelId(id);
    setSpotlightId(null);
    setCalloutOpen(true);
  }, []);

  const searchItems: readonly SearchItem[] = useMemo(() => {
    const counts = new Map<string, { stateId: string; city: string; count: number }>();
    for (const pin of allPins) {
      if (!pin.stateId || !pin.city) continue;
      const key = `${pin.stateId}::${pin.city}`;
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { stateId: pin.stateId, city: pin.city, count: 1 });
    }
    const cities: SearchItem[] = [...counts.values()].map((entry) => ({
      kind: "city",
      key: `city:${entry.stateId}:${entry.city}`,
      label: entry.city,
      sub: `${stateNameOf(entry.stateId)} · ${entry.count} ${entry.count === 1 ? noun : `${noun}s`}`,
      stateId: entry.stateId,
      city: entry.city,
    }));
    const sites: SearchItem[] = allPins.flatMap((pin): SearchItem[] =>
      pin.stateId && pin.city
        ? [
            {
              kind: "warehouse",
              key: `site:${pin.id}`,
              label: pin.name,
              sub: `${pin.city}, ${stateNameOf(pin.stateId)}`,
              stateId: pin.stateId,
              city: pin.city,
              id: pin.id,
            },
          ]
        : [],
    );
    return [...cities, ...sites];
  }, [allPins, noun, stateNameOf]);

  /*
   * Search obeys the hierarchy: a city opens its city; a warehouse opens its
   * city with that warehouse highlighted (one more click opens it). A target in
   * another state is reached state first, then city, never in one jump.
   */
  const handleSearchPick = useCallback(
    (item: SearchItem) => {
      window.clearTimeout(searchTimer.current);
      setSelectedParcelId(null);
      setSpotlightId(item.kind === "warehouse" ? item.id : null);
      setCalloutOpen(true);
      if (selectedStateId === item.stateId) {
        setSelectedCityId(item.city);
        return;
      }
      setSelectedStateId(item.stateId);
      setSelectedCityId(null);
      searchTimer.current = window.setTimeout(() => setSelectedCityId(item.city), 2600);
    },
    [selectedStateId],
  );

  useEffect(() => () => window.clearTimeout(searchTimer.current), []);

  /* a spotlight is a hint, not a state: it fades after a while */
  useEffect(() => {
    if (!spotlightId) return;
    const timer = window.setTimeout(() => setSpotlightId(null), 9000);
    return () => window.clearTimeout(timer);
  }, [spotlightId]);

  /* the map mounts as the section nears the viewport so it is ready before it is reached */

  useEffect(() => {
    if (sectionInView) void import("./PortfolioMap");
  }, [sectionInView]);

  const showMap = sectionInView && !mapFailed;

  /* callout -------------------------------------------------------------------- */

  type Note = {
    eyebrow: string;
    title: string;
    figures: { value: string; label: string }[];
  };

  /* state and city feedback lives in the fixed context bar; a warehouse gets a pointing callout */
  const context = useMemo<Note | null>(() => {
    if (!calloutOpen || !selectedStateId || record) return null;
    if (activeGroup) {
      return {
        eyebrow: stateName,
        title: activeGroup.city,
        figures: [
          {
            value: String(activeGroup.records.length),
            label: activeGroup.records.length === 1 ? noun : `${noun}s`,
          },
          ...(activeGroup.msf !== null
            ? [{ value: activeGroup.msf.toLocaleString("en-IN"), label: "msf" }]
            : []),
        ],
      };
    }
    return {
      eyebrow: "State",
      title: stateName,
      figures: [
        {
          value: String(stateSummary?.parcelCount ?? 0),
          label: (stateSummary?.parcelCount ?? 0) === 1 ? noun : `${noun}s`,
        },
        ...(stateSummary?.totalLeasableAreaMsf != null
          ? [
              {
                value: round2(stateSummary.totalLeasableAreaMsf).toLocaleString("en-IN"),
                label: "msf",
              },
            ]
          : []),
      ],
    };
  }, [calloutOpen, selectedStateId, record, activeGroup, stateName, stateSummary, noun]);

  const warehouseCallout = useMemo<Note | null>(() => {
    if (!calloutOpen || !record) return null;
    const msf = recordMsf(record);
    return {
      eyebrow: `${activeGroup?.city ?? ""} · ${stateName}`,
      title: record.asset.name,
      figures: msf !== undefined ? [{ value: formatMsf(msf), label: "leasable" }] : [],
    };
  }, [calloutOpen, record, activeGroup, stateName]);

  /* Esc closes the callout first; a second Esc steps one level up while focus is in the stage. */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (calloutOpen) {
        setCalloutOpen(false);
        return;
      }
      if (!stageRef.current?.contains(document.activeElement) || document.fullscreenElement) return;
      if (selectedParcelId) setSelectedParcelId(null);
      else if (selectedCityId) setSelectedCityId(null);
      else if (selectedStateId) setSelectedStateId(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [calloutOpen, selectedParcelId, selectedCityId, selectedStateId]);

  /* fullscreen ------------------------------------------------------------------ */

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === stageRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    if (!cssFullscreen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCssFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [cssFullscreen]);

  const toggleFullscreen = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else if (cssFullscreen) {
      setCssFullscreen(false);
    } else if (document.fullscreenEnabled && stage.requestFullscreen) {
      stage.requestFullscreen().catch(() => setCssFullscreen(true));
    } else {
      setCssFullscreen(true);
    }
  }, [cssFullscreen]);

  const isFull = fullscreen || cssFullscreen;

  /* totals ---------------------------------------------------------------------- */

  const totalSites = useMemo(
    () => aumStates.reduce((sum, state) => sum + state.parcelCount, 0),
    [],
  );
  const totalLeasableArea = useMemo(
    () =>
      aumStates.some((state) => state.totalLeasableAreaMsf !== null)
        ? aumStates.reduce((sum, state) => sum + (state.totalLeasableAreaMsf ?? 0), 0)
        : null,
    [],
  );

  const stateCount = currentStates.length;

  return (
    <section className={styles.section} id="register" aria-labelledby="register-title">
      <Container>
        <Reveal>
          <div className={styles.headingBlock}>
            <Heading variant="section" tone="dark" id="register-title">
              {propertyRegister.heading}
            </Heading>
            <Lede tone="dark" className={styles.framing}>
              {propertyRegister.framing}
            </Lede>
          </div>
        </Reveal>

        <Reveal variant="fade">
          <div ref={sectionRef} className={styles.instrument}>
            <div className={styles.controlBar}>
              <div className={styles.tabs} role="group" aria-label={propertyRegister.modesLabel}>
                <button
                  type="button"
                  className={cx(styles.tab, mode === "aum" && styles.tabActive)}
                  aria-pressed={mode === "aum"}
                  onClick={() => handleModeChange("aum")}
                >
                  {propertyRegister.assetsUnderManagementModeLabel}
                  <span className={styles.tabCount}>{totalSites}</span>
                </button>
                <button
                  type="button"
                  className={cx(styles.tab, mode === "construction" && styles.tabActive)}
                  aria-pressed={mode === "construction"}
                  onClick={() => handleModeChange("construction")}
                >
                  {propertyRegister.underConstructionModeLabel}
                  <span className={styles.tabCount}>{constructionAssets.length}</span>
                </button>
              </div>

              <dl className={styles.tally}>
                <div>
                  <dd>{stateCount}</dd>
                  <dt>{stateCount === 1 ? "State" : "States"}</dt>
                </div>
                <div>
                  <dd>{mode === "aum" ? totalSites : constructionAssets.length}</dd>
                  <dt>{mode === "aum" ? "Sites" : "Projects"}</dt>
                </div>
                {mode === "aum" && totalLeasableArea !== null ? (
                  <div>
                    <dd>{round2(totalLeasableArea).toLocaleString("en-IN")}</dd>
                    <dt>msf</dt>
                  </div>
                ) : null}
              </dl>
            </div>

            <div
              ref={stageRef}
              className={cx(
                styles.stage,
                isFull && styles.stageFull,
                cssFullscreen && styles.stageCss,
              )}
            >
              {mapFailed ? (
                <div className={styles.atlasLayer}>
                  <PortfolioAtlas
                    selectedStateId={selectedStateId}
                    onStateSelect={handleStateSelect}
                    states={currentStates}
                    ariaLabel="Map of India — select a state to see its warehouses."
                  />
                </div>
              ) : null}

              {showMap ? (
                <div className={styles.mapLayer}>
                  <PortfolioMap
                    pins={allPins}
                    states={currentStates}
                    stateId={selectedStateId}
                    cityId={selectedCityId}
                    parcelId={selectedParcelId}
                    hoveredId={hoveredId}
                    spotlightId={spotlightId}
                    hoveredStateId={hoveredStateId}
                    tone={mode}
                    sheetOpen={sheetOpen}
                    callout={warehouseCallout}
                    onCloseCallout={() => setCalloutOpen(false)}
                    onSelectState={handleStateSelect}
                    onSelectCity={handleCitySelect}
                    onSelectParcel={handleRecordSelect}
                    onHoverParcel={setHoveredId}
                    onHoverState={setHoveredStateId}
                    onBackground={() => setCalloutOpen(false)}
                    onReady={() => setMapReady(true)}
                    onFailure={() => setMapFailed(true)}
                  >
                    {({ flying }) =>
                      context ? (
                        <MapContextBar
                          visible={!flying}
                          eyebrow={context.eyebrow}
                          title={context.title}
                          figures={context.figures}
                          onClose={() => setCalloutOpen(false)}
                        />
                      ) : null
                    }
                  </PortfolioMap>
                </div>
              ) : null}

              {!mapReady && !mapFailed ? <span className={styles.loading}>Loading map</span> : null}

              <PortfolioPanel
                level={level}
                noun={noun}
                states={currentStates}
                stateId={selectedStateId}
                stateName={stateName}
                stateFigures={
                  stateSummary
                    ? {
                        sites: stateSummary.parcelCount,
                        msf:
                          stateSummary.totalLeasableAreaMsf !== null
                            ? round2(stateSummary.totalLeasableAreaMsf)
                            : null,
                      }
                    : null
                }
                groups={groups}
                city={city}
                cityRecords={cityRecords}
                record={record}
                recordIndex={recordIndex}
                hoveredId={hoveredId}
                onHover={setHoveredId}
                hoveredStateId={hoveredStateId}
                onHoverState={setHoveredStateId}
                spotlightId={spotlightId}
                onSelectState={handleStateSelect}
                onSelectCity={handleCitySelect}
                onSelectRecord={handleRecordSelect}
                searchItems={searchItems}
                searchPlaceholder={
                  mode === "aum" ? "Search a city or warehouse" : "Search a city or project"
                }
                searchNoun={mode === "aum" ? "Warehouse" : "Project"}
                onSearchPick={handleSearchPick}
                sheetOpen={sheetOpen}
                onToggleSheet={() => setSheetOpen((value) => !value)}
              />

              <button
                type="button"
                className={styles.fullscreen}
                aria-label={isFull ? "Exit full screen" : "Full screen"}
                onClick={toggleFullscreen}
              >
                {isFull ? "×" : "⤢"}
              </button>

              <span className={cx(styles.corner, styles.tl)} aria-hidden="true" />
              <span className={cx(styles.corner, styles.tr)} aria-hidden="true" />
              <span className={cx(styles.corner, styles.bl)} aria-hidden="true" />
              <span className={cx(styles.corner, styles.br)} aria-hidden="true" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
