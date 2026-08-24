"use client";

import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout";
import { Eyebrow, Heading, Lede, SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import {
  ASSET_CLASS_LABELS,
  LAND_CLASSIFICATION_LABELS,
  LAND_STATUS_LABELS,
  formatAcres,
  formatSqFt,
  landBankByState,
  landBankSection,
  landBankStates,
  landParcelById,
  propertyRegister,
  underConstructionAssets,
  underConstructionSection,
} from "@/lib/data/portfolio";
import type { LandBankParcel, PortfolioAsset } from "@/lib/data/portfolio";
import { indianStateById } from "@/lib/data/india-states";
import { PortfolioAtlas } from "./PortfolioAtlas";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./PropertyRegister.module.css";

type RegisterMode = "landbank" | "construction";

/**
 * Number of parcel records above which the list is constrained to a scrolling
 * survey panel with an explicit "View all" expansion. Below this the full list
 * renders open, as before.
 */
const RECORD_COLLAPSE_LIMIT = 5;

export function PropertyRegister() {
  const [mode, setMode] = useState<RegisterMode>("landbank");
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { ref: panelRef, inView: panelInView } = useInView<HTMLDivElement>();

  const handleStateSelect = useCallback((stateId: string | null) => {
    setSelectedStateId(stateId);
    setExpanded(false);
  }, []);

  const handleModeChange = useCallback((next: RegisterMode) => {
    setMode(next);
    setSelectedStateId(null);
    setExpanded(false);
  }, []);

  const totalAcres = useMemo(
    () =>
      landBankStates.some((state) => state.totalAcres !== null)
        ? landBankStates.reduce((sum, state) => sum + (state.totalAcres ?? 0), 0)
        : null,
    [],
  );

  const totalParcels = useMemo(
    () => landBankStates.reduce((sum, state) => sum + state.parcelCount, 0),
    [],
  );

  const constructionAssets = useMemo(() => underConstructionAssets(), []);

  const selectedParcels = useMemo(
    () => (selectedStateId ? landBankByState(selectedStateId) : []),
    [selectedStateId],
  );
  const selectedStateName = selectedStateId
    ? (indianStateById(selectedStateId)?.name ?? null)
    : null;
  const selectedAcres = useMemo(
    () =>
      selectedParcels.some((parcel) => parcel.extentAcres !== undefined)
        ? selectedParcels.reduce((sum, parcel) => sum + (parcel.extentAcres ?? 0), 0)
        : null,
    [selectedParcels],
  );
  const constrainRecords =
    mode === "landbank" && selectedParcels.length > RECORD_COLLAPSE_LIMIT;

  return (
    <section className={styles.section} id="register" aria-labelledby="register-title">
      <Container>
        <Reveal>
          <div className={styles.headingBlock}>
            <span className={styles.goldRule} aria-hidden="true" />
            <span className={styles.chapter} aria-hidden="true">
              {propertyRegister.chapter}
            </span>
            <Eyebrow>{propertyRegister.eyebrow}</Eyebrow>
            <Heading variant="section" id="register-title">
              {propertyRegister.heading}
            </Heading>
            <Lede className={styles.framing}>{propertyRegister.framing}</Lede>
          </div>
        </Reveal>

        <Reveal variant="fade">
          <div className={styles.sheet}>
            <div className={styles.provenance}>
              <div
                className={styles.modeSwitch}
                role="group"
                aria-label={propertyRegister.modesLabel}
              >
                <button
                  type="button"
                  className={cx(styles.modeButton, mode === "landbank" && styles.modeActive)}
                  aria-pressed={mode === "landbank"}
                  onClick={() => handleModeChange("landbank")}
                >
                  {propertyRegister.landBankModeLabel}
                </button>
                <button
                  type="button"
                  className={cx(
                    styles.modeButton,
                    mode === "construction" && styles.modeActive,
                  )}
                  aria-pressed={mode === "construction"}
                  onClick={() => handleModeChange("construction")}
                >
                  {propertyRegister.underConstructionModeLabel}
                  {constructionAssets.length > 0 ? (
                    <span className={styles.modeCount}>{constructionAssets.length}</span>
                  ) : null}
                </button>
              </div>
              <span className={styles.provenanceSource}>
                {mode === "landbank"
                  ? landBankSection.source
                  : underConstructionSection.source}
              </span>
              <span className={styles.provenanceMeta}>
                {mode === "landbank"
                  ? `${landBankStates.length} ${
                      landBankStates.length === 1 ? "state" : "states"
                    } · ${totalParcels} ${totalParcels === 1 ? "parcel" : "parcels"}${
                      totalAcres !== null ? ` · ${formatAcres(totalAcres)}` : ""
                    }`
                  : `${constructionAssets.length} ${
                      constructionAssets.length === 1 ? "project" : "projects"
                    }`}
              </span>
            </div>

            <div className={styles.panels}>
              <div className={styles.mapPanel}>
                <PortfolioAtlas
                  selectedStateId={mode === "landbank" ? selectedStateId : null}
                  onStateSelect={handleStateSelect}
                />
                <p className={styles.captionLabel}>{propertyRegister.atlasCaptionLabel}</p>
                <p className={styles.captionLead}>
                  {mode === "landbank"
                    ? landBankSection.mapCaptionLead
                    : underConstructionSection.framing}
                </p>
                <SourceFootnote className={styles.mapSource}>
                  {mode === "landbank"
                    ? landBankSection.mapSource
                    : underConstructionSection.source}
                </SourceFootnote>
              </div>

              <div ref={panelRef} className={cx(styles.indexPanel, panelInView && styles.isInView)}>
                {mode === "landbank" ? (
                  <LandBankPanel
                    selectedStateId={selectedStateId}
                    selectedStateName={selectedStateName}
                    selectedParcels={selectedParcels}
                    selectedAcres={selectedAcres}
                    constrain={constrainRecords}
                    expanded={expanded}
                    onExpand={() => setExpanded(true)}
                    onCollapse={() => setExpanded(false)}
                    onSelect={handleStateSelect}
                  />
                ) : (
                  <ConstructionPanel assets={constructionAssets} />
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* Land bank mode ------------------------------------------------------------ */

type LandBankPanelProps = {
  selectedStateId: string | null;
  selectedStateName: string | null;
  selectedParcels: readonly LandBankParcel[];
  selectedAcres: number | null;
  constrain: boolean;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSelect: (stateId: string | null) => void;
};

function LandBankPanel({
  selectedStateId,
  selectedStateName,
  selectedParcels,
  selectedAcres,
  constrain,
  expanded,
  onExpand,
  onCollapse,
  onSelect,
}: LandBankPanelProps) {
  if (landBankStates.length === 0) {
    return (
      <p className={cx(styles.noSelection, styles.isInView)}>
        {landBankSection.emptyTitle} {landBankSection.emptyNote}
      </p>
    );
  }
  return (
    <>
      <div className={styles.stateIndex} role="group" aria-label={landBankSection.stateSelectLabel}>
        <button
          type="button"
          className={cx(styles.folio, selectedStateId === null && styles.folioActive)}
          aria-pressed={selectedStateId === null}
          onClick={() => onSelect(null)}
        >
          <span className={styles.folioName}>All India</span>
          <span className={styles.folioRange}>
            {landBankStates.length} {landBankStates.length === 1 ? "state" : "states"}
          </span>
        </button>
        {landBankStates.map((state) => {
          const active = selectedStateId === state.stateId;
          return (
            <button
              key={state.stateId}
              type="button"
              className={cx(styles.folio, active && styles.folioActive)}
              aria-pressed={active}
              onClick={() => onSelect(active ? null : state.stateId)}
            >
              <span className={styles.folioName}>{state.stateName}</span>
              <span className={styles.folioRange}>
                {state.parcelCount}{" "}
                {state.parcelCount === 1
                  ? landBankSection.parcelUnitLabel.replace(/s$/, "")
                  : landBankSection.parcelUnitLabel}
                {state.totalAcres !== null ? ` · ${formatAcres(state.totalAcres)}` : ""}
              </span>
            </button>
          );
        })}
      </div>

      {selectedStateId !== null && selectedParcels.length > 0 ? (
        <>
          <p className={styles.selectedState}>
            {selectedStateName}
            <span className={styles.selectedMeta}>
              {selectedParcels.length}{" "}
              {selectedParcels.length === 1
                ? landBankSection.parcelUnitLabel.replace(/s$/, "")
                : landBankSection.parcelUnitLabel}
              {selectedAcres !== null ? ` · ${formatAcres(selectedAcres)}` : ""}
            </span>
          </p>
          <div
            className={cx(
              styles.recordScroll,
              constrain && !expanded && styles.recordConstrained,
            )}
            role="region"
            aria-label={`${selectedStateName} — ${propertyRegister.recordListLabel}`}
            tabIndex={0}
          >
            <ol className={styles.recordList}>
              {selectedParcels.map((parcel, index) => (
                <li
                  key={parcel.id}
                  className={styles.recordRow}
                  style={{ "--i": index } as CSSProperties}
                >
                  <span className={styles.recordIndex} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.recordBody}>
                    <span className={styles.recordName}>{parcel.name}</span>
                    {parcel.district ? (
                      <span className={styles.recordSub}>{parcel.district}</span>
                    ) : null}
                    {parcel.note ? (
                      <span className={styles.recordNote}>{parcel.note}</span>
                    ) : null}
                  </div>
                  <div className={styles.recordMeta}>
                    <span className={styles.recordAcres}>
                      {formatAcres(parcel.extentAcres)}
                    </span>
                    <span className={styles.recordTag}>
                      {parcel.classification
                        ? LAND_CLASSIFICATION_LABELS[parcel.classification]
                        : "—"}
                    </span>
                    <span className={styles.recordTag}>
                      {parcel.status ? LAND_STATUS_LABELS[parcel.status] : "—"}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          {constrain ? (
            <button
              type="button"
              className={styles.viewAll}
              onClick={expanded ? onCollapse : onExpand}
              aria-expanded={expanded}
            >
              {expanded
                ? propertyRegister.collapseLabel
                : `${propertyRegister.viewAllPrefix} ${selectedParcels.length} ${
                    selectedParcels.length === 1 ? "parcel" : landBankSection.parcelUnitLabel
                  }`}
            </button>
          ) : null}
        </>
      ) : (
        <p className={styles.noSelection}>
          {selectedStateId === null
            ? landBankSection.mapCaptionLead
            : landBankSection.emptyTitle}
        </p>
      )}
    </>
  );
}

/* Under construction mode --------------------------------------------------- */

function ConstructionPanel({ assets }: { assets: readonly PortfolioAsset[] }) {
  if (assets.length === 0) {
    return (
      <div className={styles.constructionEmpty}>
        <p className={styles.constructionEmptyTitle}>{underConstructionSection.emptyTitle}</p>
        <p className={styles.constructionEmptyNote}>{underConstructionSection.emptyNote}</p>
      </div>
    );
  }
  return (
    <ol className={styles.recordList}>
      {assets.map((asset, index) => {
        const parcel = asset.landBankId ? landParcelById(asset.landBankId) : null;
        return (
          <li key={asset.id} className={styles.recordRow} style={{ "--i": index } as CSSProperties}>
            <span className={styles.recordIndex} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={styles.recordBody}>
              <span className={styles.recordName}>{asset.name}</span>
              <span className={styles.recordSub}>
                {asset.city} · {ASSET_CLASS_LABELS[asset.class]} ·{" "}
                {formatSqFt(asset.sizeSqFt)}
              </span>
              {parcel ? (
                <span className={styles.recordParcel}>
                  {`${underConstructionSection.columns.parcel}: ${parcel.name}${
                    parcel.district ? ` · ${parcel.district}` : ""
                  }${parcel.stateName ? ` · ${parcel.stateName}` : ""}${
                    parcel.extentAcres !== undefined ? ` · ${formatAcres(parcel.extentAcres)}` : ""
                  }`}
                </span>
              ) : (
                <span className={styles.recordParcel}>
                  {underConstructionSection.parcelMissingLabel}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
