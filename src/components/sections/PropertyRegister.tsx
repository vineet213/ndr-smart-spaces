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
  LOCATION_TIER_LABELS,
  ZONE_LABELS,
  formatAcres,
  formatSqFt,
  constructionByState,
  constructionStates,
  landBankSection,
  landParcelById,
  landSurveyByState,
  landSurveyPinsByState,
  landSurveyRecordById,
  landSurveyStates,
  propertyRegister,
  underConstructionAssets,
  underConstructionSection,
} from "@/lib/data/portfolio";
import type {
  LandBankParcel,
  LandSurveyRecord,
  PortfolioAsset,
  AtlasPinData,
  MappedLocation,
} from "@/lib/data/portfolio";
import { indianStateById } from "@/lib/data/india-states";
import { PortfolioAtlas } from "./PortfolioAtlas";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./PropertyRegister.module.css";

type RegisterMode = "landbank" | "construction";

const RECORD_COLLAPSE_LIMIT = 5;

function isLocationRecord(record: LandSurveyRecord | PortfolioAsset): record is MappedLocation {
  return "line" in record;
}

export function PropertyRegister() {
  const [mode, setMode] = useState<RegisterMode>("landbank");
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { ref: panelRef, inView: panelInView } = useInView<HTMLDivElement>();

  const handleStateSelect = useCallback((stateId: string | null) => {
    setSelectedStateId(stateId);
    setSelectedParcelId(null);
    setExpanded(false);
  }, []);

  const handleParcelSelect = useCallback((parcelId: string | null) => {
    setSelectedParcelId(parcelId);
  }, []);

  const handleModeChange = useCallback((next: RegisterMode) => {
    setMode(next);
    setSelectedStateId(null);
    setSelectedParcelId(null);
    setExpanded(false);
  }, []);

  const totalSites = useMemo(
    () => landSurveyStates.reduce((sum, state) => sum + state.parcelCount, 0),
    [],
  );

  const totalAcres = useMemo(
    () =>
      landSurveyStates.some((state) => state.totalAcres !== null)
        ? landSurveyStates.reduce((sum, state) => sum + (state.totalAcres ?? 0), 0)
        : null,
    [],
  );

  const constructionAssets = useMemo(() => underConstructionAssets(), []);

  /* Pins for the current mode + selected state. */
  const currentPins: readonly AtlasPinData[] = useMemo(() => {
    if (!selectedStateId) return [];
    if (mode === "landbank") return landSurveyPinsByState(selectedStateId);
    return constructionByState(selectedStateId);
  }, [mode, selectedStateId]);

  const currentStates = mode === "landbank" ? landSurveyStates : constructionStates;

  /* Detail panel: when a record is selected, resolve the full record. */
  const selectedRecord = useMemo(() => {
    if (!selectedParcelId) return null;
    if (mode === "construction") {
      return constructionAssets.find((a) => a.id === selectedParcelId) ?? null;
    }
    return landSurveyRecordById(selectedParcelId);
  }, [selectedParcelId, mode, constructionAssets]);

  const selectedStateName = selectedStateId
    ? (indianStateById(selectedStateId)?.name ?? null)
    : null;

  const selectedRecords = useMemo(
    () => (mode === "landbank" && selectedStateId ? landSurveyByState(selectedStateId) : []),
    [mode, selectedStateId],
  );
  const selectedParcels = useMemo(
    () => selectedRecords.filter((record) => !isLocationRecord(record)),
    [selectedRecords],
  );
  const selectedAcres = useMemo(
    () =>
      selectedParcels.some((parcel) => parcel.extentAcres !== undefined)
        ? selectedParcels.reduce((sum, parcel) => sum + (parcel.extentAcres ?? 0), 0)
        : null,
    [selectedParcels],
  );
  const constrainRecords = selectedRecords.length > RECORD_COLLAPSE_LIMIT && !selectedRecord;

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
                  className={cx(styles.modeButton, mode === "construction" && styles.modeActive)}
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
                {mode === "landbank" ? landBankSection.source : underConstructionSection.source}
              </span>
              <span className={styles.provenanceMeta}>
                {mode === "landbank"
                  ? `${landSurveyStates.length} ${
                      landSurveyStates.length === 1 ? "state" : "states"
                    } · ${totalSites} ${totalSites === 1 ? "site" : "sites"}${
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
                  selectedStateId={selectedStateId}
                  onStateSelect={handleStateSelect}
                  pins={currentPins}
                  states={currentStates}
                  selectedParcelId={selectedParcelId}
                  onParcelSelect={handleParcelSelect}
                  ariaLabel={
                    mode === "landbank"
                      ? "Map of India — select a state to survey the group's sites."
                      : "Map of India — select a state to view ongoing projects."
                  }
                />
                <p className={styles.captionLabel}>{propertyRegister.atlasCaptionLabel}</p>
                <p className={styles.captionLead}>
                  {mode === "landbank"
                    ? landBankSection.mapCaptionLead
                    : underConstructionSection.mapCaptionLead}
                </p>
                <SourceFootnote className={styles.mapSource}>
                  {mode === "landbank"
                    ? landBankSection.mapSource
                    : underConstructionSection.source}
                </SourceFootnote>
              </div>

              <div ref={panelRef} className={cx(styles.indexPanel, panelInView && styles.isInView)}>
                {selectedRecord ? (
                  <DetailPanel record={selectedRecord} onBack={() => setSelectedParcelId(null)} />
                ) : mode === "landbank" ? (
                  <LandBankPanel
                    selectedStateId={selectedStateId}
                    selectedStateName={selectedStateName}
                    selectedRecords={selectedRecords}
                    selectedAcres={selectedAcres}
                    constrain={constrainRecords}
                    expanded={expanded}
                    onExpand={() => setExpanded(true)}
                    onCollapse={() => setExpanded(false)}
                    onSelect={handleStateSelect}
                    onSelectParcel={handleParcelSelect}
                  />
                ) : (
                  <ConstructionPanel
                    selectedStateId={selectedStateId}
                    selectedStateName={selectedStateName}
                    constructionAssets={constructionAssets}
                    onSelect={handleStateSelect}
                    onSelectParcel={handleParcelSelect}
                  />
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* Detail panel — shown when a pin is selected -------------------------------- */

type DetailPanelProps = {
  record: LandSurveyRecord | PortfolioAsset;
  onBack: () => void;
};

function DetailPanel({ record, onBack }: DetailPanelProps) {
  const location = isLocationRecord(record) ? (record as MappedLocation) : null;
  const asset = "plate" in record ? (record as PortfolioAsset) : null;
  const landParcel = !location && !asset ? (record as LandBankParcel) : null;
  const linkedParcel = asset?.landBankId ? landParcelById(asset.landBankId) : null;

  return (
    <div className={styles.detailPanel}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Back to list
      </button>
      <div className={styles.detailHeader}>
        <span className={styles.detailName}>{record.name}</span>
        {location ? (
          <span className={styles.detailLocation}>{location.line}</span>
        ) : landParcel?.district ? (
          <span className={styles.detailLocation}>
            {landParcel.district}, {landParcel.stateName}
          </span>
        ) : asset ? (
          <span className={styles.detailLocation}>
            {asset.city}
            {asset.zone ? ` · ${asset.zone} zone` : ""}
          </span>
        ) : null}
      </div>

      <dl className={styles.detailGrid}>
        {location ? (
          <>
            <DetailField label="Zone" value={ZONE_LABELS[location.zone]} />
            <DetailField label="Tier" value={LOCATION_TIER_LABELS[location.tier]} />
            <DetailField label="State" value={location.district ?? null} />
            <DetailField label="Address" value={location.line} />
          </>
        ) : landParcel ? (
          <>
            <DetailField label="Size" value={formatAcres(landParcel.extentAcres)} />
            <DetailField
              label="Category"
              value={
                landParcel.classification
                  ? LAND_CLASSIFICATION_LABELS[landParcel.classification]
                  : null
              }
            />
            <DetailField
              label="Status"
              value={landParcel.status ? LAND_STATUS_LABELS[landParcel.status] : null}
            />
            {landParcel.note ? <DetailField label="Note" value={landParcel.note} /> : null}
          </>
        ) : asset ? (
          <>
            <DetailField
              label="Class"
              value={asset.class ? ASSET_CLASS_LABELS[asset.class] : null}
            />
            <DetailField
              label="Status"
              value={
                asset.status === "ongoing"
                  ? "Under construction"
                  : asset.status === "completed"
                    ? "Completed"
                    : asset.status
              }
            />
            <DetailField label="Zone" value={asset.zone ? `${asset.zone}` : null} />
            <DetailField label="Plate" value={asset.plate ?? null} />
            {asset.sizeSqFt !== undefined ? (
              <DetailField label="Built-up area" value={formatSqFt(asset.sizeSqFt)} />
            ) : null}
            {linkedParcel ? (
              <>
                <DetailField label="Land site" value={linkedParcel.name} />
                <DetailField label="Site size" value={formatAcres(linkedParcel.extentAcres)} />
                {linkedParcel.district ? (
                  <DetailField
                    label="Site location"
                    value={`${linkedParcel.district}, ${linkedParcel.stateName}`}
                  />
                ) : null}
              </>
            ) : null}
          </>
        ) : null}
      </dl>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className={styles.detailField}>
      <dt className={styles.detailLabel}>{label}</dt>
      <dd className={styles.detailValue}>{value}</dd>
    </div>
  );
}

/* Land bank mode panel — parcels and operating locations ---------------------- */

type LandBankPanelProps = {
  selectedStateId: string | null;
  selectedStateName: string | null;
  selectedRecords: readonly LandSurveyRecord[];
  selectedAcres: number | null;
  constrain: boolean;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSelect: (stateId: string | null) => void;
  onSelectParcel: (recordId: string | null) => void;
};

function LandBankPanel({
  selectedStateId,
  selectedStateName,
  selectedRecords,
  selectedAcres,
  constrain,
  expanded,
  onExpand,
  onCollapse,
  onSelect,
  onSelectParcel,
}: LandBankPanelProps) {
  if (landSurveyStates.length === 0) {
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
            {landSurveyStates.length} {landSurveyStates.length === 1 ? "state" : "states"}
          </span>
        </button>
        {landSurveyStates.map((state) => {
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
                {state.parcelCount} {state.parcelCount === 1 ? "site" : "sites"}
                {state.totalAcres !== null ? ` · ${formatAcres(state.totalAcres)}` : ""}
              </span>
            </button>
          );
        })}
      </div>

      {selectedStateId !== null && selectedRecords.length > 0 ? (
        <>
          <p className={styles.selectedState}>
            {selectedStateName}
            <span className={styles.selectedMeta}>
              {selectedRecords.length} {selectedRecords.length === 1 ? "site" : "sites"}
              {selectedAcres !== null ? ` · ${formatAcres(selectedAcres)}` : ""}
            </span>
          </p>
          <p className={styles.hintText}>Select a pin on the map to view details.</p>
          <div
            className={cx(styles.recordScroll, constrain && !expanded && styles.recordConstrained)}
            role="region"
            aria-label={`${selectedStateName} — ${propertyRegister.recordListLabel}`}
            tabIndex={0}
          >
            <ol className={styles.recordList}>
              {selectedRecords.map((record, index) => {
                const isLoc = isLocationRecord(record);
                const location = isLoc ? (record as MappedLocation) : null;
                const parcel = isLoc ? null : (record as LandBankParcel);
                return (
                  <li
                    key={record.id}
                    className={styles.recordRow}
                    style={{ "--i": index } as CSSProperties}
                  >
                    <span className={styles.recordIndex} aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className={styles.recordBody}>
                      <span className={styles.recordName}>{record.name}</span>
                      {location ? (
                        <span className={styles.recordSub}>{location.line}</span>
                      ) : parcel?.district ? (
                        <span className={styles.recordSub}>{parcel.district}</span>
                      ) : null}
                      {parcel?.note ? (
                        <span className={styles.recordNote}>{parcel.note}</span>
                      ) : null}
                    </div>
                    <div className={styles.recordMeta}>
                      {location ? (
                        <>
                          <span className={styles.recordTag}>{ZONE_LABELS[location.zone]}</span>
                          <span className={styles.recordTag}>
                            {LOCATION_TIER_LABELS[location.tier]}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className={styles.recordAcres}>
                            {formatAcres(parcel?.extentAcres)}
                          </span>
                          <span className={styles.recordTag}>
                            {parcel?.classification
                              ? LAND_CLASSIFICATION_LABELS[parcel.classification]
                              : "—"}
                          </span>
                          <span className={styles.recordTag}>
                            {parcel?.status ? LAND_STATUS_LABELS[parcel.status] : "—"}
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
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
                : `${propertyRegister.viewAllPrefix} ${selectedRecords.length} ${
                    selectedRecords.length === 1 ? "site" : "sites"
                  }`}
            </button>
          ) : null}
        </>
      ) : (
        <p className={styles.noSelection}>
          {selectedStateId === null ? landBankSection.mapCaptionLead : landBankSection.emptyTitle}
        </p>
      )}
    </>
  );
}

/* Under construction mode panel --------------------------------------------- */

type ConstructionPanelProps = {
  selectedStateId: string | null;
  selectedStateName: string | null;
  constructionAssets: readonly PortfolioAsset[];
  onSelect: (stateId: string | null) => void;
  onSelectParcel: (parcelId: string | null) => void;
};

function ConstructionPanel({
  selectedStateId,
  selectedStateName,
  constructionAssets,
  onSelect,
  onSelectParcel,
}: ConstructionPanelProps) {
  if (constructionStates.length === 0) {
    return (
      <div className={styles.constructionEmpty}>
        <p className={styles.constructionEmptyTitle}>{underConstructionSection.emptyTitle}</p>
        <p className={styles.constructionEmptyNote}>{underConstructionSection.emptyNote}</p>
      </div>
    );
  }

  if (!selectedStateId) {
    return (
      <>
        <div className={styles.stateIndex} role="group" aria-label="States with ongoing projects">
          {constructionStates.map((state) => (
            <button
              key={state.stateId}
              type="button"
              className={styles.folio}
              onClick={() => onSelect(state.stateId)}
            >
              <span className={styles.folioName}>{state.stateName}</span>
              <span className={styles.folioRange}>
                {state.parcelCount} {state.parcelCount === 1 ? "project" : "projects"}
                {state.totalAcres !== null ? ` · ${formatAcres(state.totalAcres)}` : ""}
              </span>
            </button>
          ))}
        </div>
        <p className={styles.noSelection}>{underConstructionSection.mapCaptionLead}</p>
      </>
    );
  }

  const stateAssets = constructionByState(selectedStateId);
  if (stateAssets.length === 0) {
    return (
      <>
        <div className={styles.stateIndex} role="group" aria-label="States with ongoing projects">
          {constructionStates.map((state) => (
            <button
              key={state.stateId}
              type="button"
              className={cx(styles.folio, state.stateId === selectedStateId && styles.folioActive)}
              aria-pressed={state.stateId === selectedStateId}
              onClick={() => onSelect(state.stateId === selectedStateId ? null : state.stateId)}
            >
              <span className={styles.folioName}>{state.stateName}</span>
              <span className={styles.folioRange}>
                {state.parcelCount} {state.parcelCount === 1 ? "project" : "projects"}
              </span>
            </button>
          ))}
        </div>
        <p className={styles.noSelection}>{underConstructionSection.emptyTitle}</p>
      </>
    );
  }

  return (
    <>
      <div className={styles.stateIndex} role="group" aria-label="States with ongoing projects">
        {constructionStates.map((state) => (
          <button
            key={state.stateId}
            type="button"
            className={cx(styles.folio, state.stateId === selectedStateId && styles.folioActive)}
            aria-pressed={state.stateId === selectedStateId}
            onClick={() => onSelect(state.stateId === selectedStateId ? null : state.stateId)}
          >
            <span className={styles.folioName}>{state.stateName}</span>
            <span className={styles.folioRange}>
              {state.parcelCount} {state.parcelCount === 1 ? "project" : "projects"}
              {state.totalAcres !== null ? ` · ${formatAcres(state.totalAcres)}` : ""}
            </span>
          </button>
        ))}
      </div>

      <p className={styles.selectedState}>
        {selectedStateName}
        <span className={styles.selectedMeta}>
          {stateAssets.length} {stateAssets.length === 1 ? "project" : "projects"}
        </span>
      </p>
      <p className={styles.hintText}>Select a pin on the map to view details.</p>
      <ol className={styles.recordList}>
        {stateAssets.map((asset, index) => (
          <li key={asset.id} className={styles.recordRow} style={{ "--i": index } as CSSProperties}>
            <span className={styles.recordIndex} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className={styles.recordBody}>
              <span className={styles.recordName}>{asset.name}</span>
              <span className={styles.recordSub}>
                {asset.city} · {ASSET_CLASS_LABELS[asset.class]} · {formatSqFt(asset.sizeSqFt)}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
