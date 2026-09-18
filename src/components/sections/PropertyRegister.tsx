"use client";

import { useCallback, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout";
import { Heading, Lede, SourceFootnote } from "@/components/ui";
import { useInView } from "@/hooks/useInView";
import {
  ASSET_CLASS_LABELS,
  AUM_CLASSIFICATION_LABELS,
  AUM_STATUS_LABELS,
  formatMsf,
  formatSqFt,
  constructionByState,
  constructionStates,
  assetsUnderManagementSection,
  aumAssetById,
  aumByCity,
  aumByState,
  aumCityGroups,
  aumPinsByState,
  aumStates,
  propertyRegister,
  underConstructionAssets,
  underConstructionSection,
} from "@/lib/data/portfolio";
import type { AumAsset, PortfolioAsset, AtlasPinData } from "@/lib/data/portfolio";
import { indianStateById } from "@/lib/data/india-states";
import { PortfolioAtlas } from "./PortfolioAtlas";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./PropertyRegister.module.css";

type RegisterMode = "aum" | "construction";

const RECORD_COLLAPSE_LIMIT = 5;

export function PropertyRegister() {
  const [mode, setMode] = useState<RegisterMode>("aum");
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const { ref: panelRef, inView: panelInView } = useInView<HTMLDivElement>();

  const handleStateSelect = useCallback((stateId: string | null) => {
    setSelectedStateId(stateId);
    setSelectedCityId(null);
    setSelectedParcelId(null);
    setExpanded(false);
  }, []);

  const handleCitySelect = useCallback((city: string | null) => {
    setSelectedCityId(city);
    setSelectedParcelId(null);
    setExpanded(false);
  }, []);

  const handleParcelSelect = useCallback((parcelId: string | null) => {
    setSelectedParcelId(parcelId);
  }, []);

  const handleModeChange = useCallback((next: RegisterMode) => {
    setMode(next);
    setSelectedStateId(null);
    setSelectedCityId(null);
    setSelectedParcelId(null);
    setExpanded(false);
  }, []);

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

  const constructionAssets = useMemo(() => underConstructionAssets(), []);

  /* Pins for the current mode + selected state (unfiltered by city — the
     map itself derives city clusters and zoom from this same set). */
  const currentPins: readonly AtlasPinData[] = useMemo(() => {
    if (!selectedStateId) return [];
    if (mode === "aum") return aumPinsByState(selectedStateId);
    return constructionByState(selectedStateId);
  }, [mode, selectedStateId]);

  const currentStates = mode === "aum" ? aumStates : constructionStates;

  /* Detail panel: when a record is selected, resolve the full record. */
  const selectedRecord = useMemo(() => {
    if (!selectedParcelId) return null;
    if (mode === "construction") {
      return constructionAssets.find((a) => a.id === selectedParcelId) ?? null;
    }
    return aumAssetById(selectedParcelId);
  }, [selectedParcelId, mode, constructionAssets]);

  const selectedStateName = selectedStateId
    ? (indianStateById(selectedStateId)?.name ?? null)
    : null;

  /* City groups within the selected state — the register panel's own
     drill-down affordance, mirroring the map's clickable city clusters. */
  const stateCityGroups = useMemo(
    () =>
      mode === "aum" && selectedStateId
        ? aumCityGroups.filter((group) => group.stateId === selectedStateId)
        : [],
    [mode, selectedStateId],
  );

  const selectedRecords = useMemo(() => {
    if (mode !== "aum" || !selectedStateId) return [];
    return selectedCityId ? aumByCity(selectedStateId, selectedCityId) : aumByState(selectedStateId);
  }, [mode, selectedStateId, selectedCityId]);

  const selectedLeasableArea = useMemo(
    () =>
      selectedRecords.some((record) => record.leasableAreaMsf !== undefined)
        ? selectedRecords.reduce((sum, record) => sum + (record.leasableAreaMsf ?? 0), 0)
        : null,
    [selectedRecords],
  );
  const constrainRecords = selectedRecords.length > RECORD_COLLAPSE_LIMIT && !selectedRecord;

  return (
    <section className={styles.section} id="register" aria-labelledby="register-title">
      <Container>
        <Reveal>
          <div className={styles.headingBlock}>
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
                  className={cx(styles.modeButton, mode === "aum" && styles.modeActive)}
                  aria-pressed={mode === "aum"}
                  onClick={() => handleModeChange("aum")}
                >
                  {propertyRegister.assetsUnderManagementModeLabel}
                  {totalSites > 0 ? <span className={styles.modeCount}>{totalSites}</span> : null}
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
              <span className={styles.provenanceMeta}>
                {mode === "aum"
                  ? `${aumStates.length} ${
                      aumStates.length === 1 ? "state" : "states"
                    } · ${totalSites} ${totalSites === 1 ? "site" : "sites"}${
                      totalLeasableArea !== null ? ` · ${formatMsf(totalLeasableArea)}` : ""
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
                  selectedCityId={selectedCityId}
                  onCitySelect={handleCitySelect}
                  ariaLabel={
                    mode === "aum"
                      ? "Map of India — select a state to survey the group's assets."
                      : "Map of India — select a state to view ongoing projects."
                  }
                />
                <p className={styles.captionLabel}>{propertyRegister.atlasCaptionLabel}</p>
                <p className={styles.captionLead}>
                  {mode === "aum"
                    ? assetsUnderManagementSection.mapCaptionLead
                    : underConstructionSection.mapCaptionLead}
                </p>
                {mode === "aum" ? null : (
                  <SourceFootnote className={styles.mapSource}>
                    {underConstructionSection.source}
                  </SourceFootnote>
                )}
              </div>

              <div ref={panelRef} className={cx(styles.indexPanel, panelInView && styles.isInView)}>
                {selectedRecord ? (
                  <DetailPanel record={selectedRecord} onBack={() => setSelectedParcelId(null)} />
                ) : mode === "aum" ? (
                  <AumPanel
                    selectedStateId={selectedStateId}
                    selectedStateName={selectedStateName}
                    selectedCityId={selectedCityId}
                    cityGroups={stateCityGroups}
                    selectedRecords={selectedRecords}
                    selectedLeasableArea={selectedLeasableArea}
                    constrain={constrainRecords}
                    expanded={expanded}
                    onExpand={() => setExpanded(true)}
                    onCollapse={() => setExpanded(false)}
                    onSelect={handleStateSelect}
                    onSelectCity={handleCitySelect}
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
  record: AumAsset | PortfolioAsset;
  onBack: () => void;
};

function DetailPanel({ record, onBack }: DetailPanelProps) {
  const asset = "plate" in record ? (record as PortfolioAsset) : null;
  const aumAsset = !asset ? (record as AumAsset) : null;
  const linkedAsset = asset?.assetsUnderManagementId
    ? aumAssetById(asset.assetsUnderManagementId)
    : null;

  return (
    <div className={styles.detailPanel}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Back to list
      </button>
      <div className={styles.detailHeader}>
        <span className={styles.detailName}>{record.name}</span>
        {aumAsset ? (
          <span className={styles.detailLocation}>
            {aumAsset.district ? `${aumAsset.district}, ` : ""}
            {aumAsset.city}, {aumAsset.stateName}
          </span>
        ) : asset ? (
          <span className={styles.detailLocation}>
            {asset.city}
            {asset.zone ? ` · ${asset.zone} zone` : ""}
          </span>
        ) : null}
      </div>

      <dl className={styles.detailGrid}>
        {aumAsset ? (
          <>
            <DetailField label="Leasable area" value={formatMsf(aumAsset.leasableAreaMsf)} />
            <DetailField
              label="Category"
              value={
                aumAsset.classification ? AUM_CLASSIFICATION_LABELS[aumAsset.classification] : null
              }
            />
            <DetailField
              label="Status"
              value={aumAsset.status ? AUM_STATUS_LABELS[aumAsset.status] : null}
            />
            {aumAsset.note ? <DetailField label="Note" value={aumAsset.note} /> : null}
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
            {linkedAsset ? (
              <>
                <DetailField label="Linked asset" value={linkedAsset.name} />
                <DetailField label="Leasable area" value={formatMsf(linkedAsset.leasableAreaMsf)} />
                <DetailField
                  label="Location"
                  value={`${linkedAsset.city}, ${linkedAsset.stateName}`}
                />
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

/* Assets under management panel ----------------------------------------------- */

type AumPanelProps = {
  selectedStateId: string | null;
  selectedStateName: string | null;
  selectedCityId: string | null;
  cityGroups: readonly { city: string; stateId: string; assetCount: number }[];
  selectedRecords: readonly AumAsset[];
  selectedLeasableArea: number | null;
  constrain: boolean;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
  onSelect: (stateId: string | null) => void;
  onSelectCity: (city: string | null) => void;
  onSelectParcel: (recordId: string | null) => void;
};

function AumPanel({
  selectedStateId,
  selectedStateName,
  selectedCityId,
  cityGroups,
  selectedRecords,
  selectedLeasableArea,
  constrain,
  expanded,
  onExpand,
  onCollapse,
  onSelect,
  onSelectCity,
  onSelectParcel,
}: AumPanelProps) {
  if (aumStates.length === 0) {
    return (
      <p className={cx(styles.noSelection, styles.isInView)}>
        {assetsUnderManagementSection.emptyTitle} {assetsUnderManagementSection.emptyNote}
      </p>
    );
  }
  return (
    <>
      <div
        className={styles.stateIndex}
        role="group"
        aria-label={assetsUnderManagementSection.stateSelectLabel}
      >
        <button
          type="button"
          className={cx(styles.folio, selectedStateId === null && styles.folioActive)}
          aria-pressed={selectedStateId === null}
          onClick={() => onSelect(null)}
        >
          <span className={styles.folioName}>All India</span>
          <span className={styles.folioRange}>
            {aumStates.length} {aumStates.length === 1 ? "state" : "states"}
          </span>
        </button>
        {aumStates.map((state) => {
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
                {state.totalLeasableAreaMsf !== null ? ` · ${formatMsf(state.totalLeasableAreaMsf)}` : ""}
              </span>
            </button>
          );
        })}
      </div>

      {selectedStateId !== null && cityGroups.length > 0 ? (
        <div
          className={styles.stateIndex}
          role="group"
          aria-label={assetsUnderManagementSection.cityStepLabel}
        >
          <button
            type="button"
            className={cx(styles.folio, selectedCityId === null && styles.folioActive)}
            aria-pressed={selectedCityId === null}
            onClick={() => onSelectCity(null)}
          >
            <span className={styles.folioName}>{selectedStateName}</span>
            <span className={styles.folioRange}>whole state</span>
          </button>
          {cityGroups.map((group) => {
            const active = selectedCityId === group.city;
            return (
              <button
                key={group.city}
                type="button"
                className={cx(styles.folio, active && styles.folioActive)}
                aria-pressed={active}
                onClick={() => onSelectCity(active ? null : group.city)}
              >
                <span className={styles.folioName}>{group.city}</span>
                <span className={styles.folioRange}>
                  {group.assetCount} {group.assetCount === 1 ? "asset" : "assets"}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}

      {selectedStateId !== null && selectedRecords.length > 0 ? (
        <>
          <p className={styles.selectedState}>
            {selectedCityId ?? selectedStateName}
            <span className={styles.selectedMeta}>
              {selectedRecords.length} {selectedRecords.length === 1 ? "site" : "sites"}
              {selectedLeasableArea !== null ? ` · ${formatMsf(selectedLeasableArea)}` : ""}
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
              {selectedRecords.map((record, index) => (
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
                    {record.district ? (
                      <span className={styles.recordSub}>
                        {record.district}
                        {record.city && record.city !== record.district ? ` · ${record.city}` : ""}
                      </span>
                    ) : record.city ? (
                      <span className={styles.recordSub}>{record.city}</span>
                    ) : null}
                    {record.note ? <span className={styles.recordNote}>{record.note}</span> : null}
                  </div>
                  <div className={styles.recordMeta}>
                    <span className={styles.recordAcres}>{formatMsf(record.leasableAreaMsf)}</span>
                    <span className={styles.recordTag}>
                      {record.classification ? AUM_CLASSIFICATION_LABELS[record.classification] : "—"}
                    </span>
                    <span className={styles.recordTag}>
                      {record.status ? AUM_STATUS_LABELS[record.status] : "—"}
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
                : `${propertyRegister.viewAllPrefix} ${selectedRecords.length} ${
                    selectedRecords.length === 1 ? "site" : "sites"
                  }`}
            </button>
          ) : null}
        </>
      ) : (
        <p className={styles.noSelection}>
          {selectedStateId === null
            ? assetsUnderManagementSection.mapCaptionLead
            : assetsUnderManagementSection.emptyTitle}
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
                {state.totalLeasableAreaMsf !== null
                  ? ` · ${formatMsf(state.totalLeasableAreaMsf)}`
                  : ""}
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
              {state.totalLeasableAreaMsf !== null ? ` · ${formatMsf(state.totalLeasableAreaMsf)}` : ""}
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
