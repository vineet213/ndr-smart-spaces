import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { corporateStructure, corporateStructureChapter } from "@/lib/data/business";
import { cx } from "../ui/cx";
import styles from "./CorporateStructure.module.css";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA REFERENCES
   ═══════════════════════════════════════════════════════════════════════════ */

const [spv, am, ave, third] = corporateStructure.branches;

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS — 1320 × 680, a symmetric three-level tree
   ═══════════════════════════════════════════════════════════════════════════
   Level 1  NDR Smart Spaces Pvt. Ltd. (hub)
   Level 2  What the hub owns, on one shared "Ownership" bus: NDR Asset
            Management · Group SPVs · Ave Acres LLP
   Level 3  The outward sale, directly under the entity that makes it:
            Ave Acres ⇄ Third parties (developed land)
   ═══════════════════════════════════════════════════════════════════════════ */

const VB_W = 1320;
const VB_H = 640;

type EntityId = "center" | "spv" | "am" | "ave" | "third";
type CardId = Exclude<EntityId, "center">;

type N = { x: number; y: number; w: number; h: number };

const NODES: Record<EntityId, N> = {
  center: { x: 460, y: 36, w: 400, h: 100 },
  am: { x: 65, y: 262, w: 270, h: 128 },
  spv: { x: 525, y: 262, w: 270, h: 128 },
  ave: { x: 985, y: 262, w: 270, h: 128 },
  third: { x: 985, y: 480, w: 270, h: 120 },
};

/* ═══════════════════════════════════════════════════════════════════════════
   CONNECTORS — orthogonal, every arrow ends on a card edge.
   ═══════════════════════════════════════════════════════════════════════════ */

type ConnType = "ownership" | "service" | "transaction";

type Connector = {
  id: string;
  type: ConnType;
  d: string;
  /** Plain connector with no arrowhead (the shared ownership trunk and bus). */
  noArrow?: boolean;
  /** Label plate, centred on (px, py); `|` splits it onto two lines. */
  plate?: { px: number; py: number; label: string };
};

const CONNECTORS: readonly Connector[] = [
  /* hub → everything it owns: one trunk, one bus, three drops, one label */
  {
    id: "own-trunk",
    type: "ownership",
    d: "M660 136 L660 205",
    noArrow: true,
  },
  { id: "own-bus", type: "ownership", d: "M200 205 L1120 205", noArrow: true },
  { id: "own-am", type: "ownership", d: "M200 205 L200 256" },
  { id: "own-spv", type: "ownership", d: "M660 205 L660 256" },
  { id: "own-ave", type: "ownership", d: "M1120 205 L1120 256" },
  /* Group SPVs → Asset Management, straight across the gap between them */
  {
    id: "svc-pmc",
    type: "service",
    d: "M519 326 L341 326",
    plate: { px: 430, py: 326, label: "PMC Fee|Consultancy" },
  },
  /* Ave Acres ⇄ Third parties */
  {
    id: "txn-sale-ave",
    type: "transaction",
    d: "M1100 396 L1100 474",
    plate: { px: 1009, py: 435, label: "Sale of|Developed Land" },
  },
  {
    id: "txn-pay-ave",
    type: "transaction",
    d: "M1140 474 L1140 396",
    plate: { px: 1227, py: 435, label: "Consideration|Paid" },
  },
];

const markerId = (t: ConnType, prefix = "a") =>
  `${prefix}-${t === "ownership" ? "own" : t === "service" ? "svc" : "txn"}`;

/* ═══════════════════════════════════════════════════════════════════════════
   TEXT HELPERS — deterministic word-wrap for titles and relationship lines
   ═══════════════════════════════════════════════════════════════════════════ */

const TITLE_CHAR_W = 8.2;

function wrapText(text: string, charW: number, width: number): string[] {
  const max = Math.max(24, Math.floor(width / charW));
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= max || current === "") current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return tidyWrap(lines.slice(0, 2));
}

/* Never leave a dangling separators ("·", "/") at the end of a wrapped line —
   move it onto the next line so wraps read naturally. */
function tidyWrap(lines: string[]): string[] {
  if (lines.length < 2) return lines;
  for (let i = 0; i < lines.length - 1; i++) {
    const match = lines[i].match(/[\u00b7/]$/);
    if (match) {
      lines[i] = lines[i].slice(0, -1).trimEnd();
      lines[i + 1] = `${match[0]} ${lines[i + 1]}`;
    }
  }
  return lines;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SVG SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

/* `prefix` keeps marker ids unique per SVG: the phone diagram cannot borrow the
   desktop one's arrowheads, because markers inside a `display: none` SVG don't render. */
function ArrowDefs({ prefix = "a" }: { prefix?: string }) {
  return (
    <defs>
      <marker
        id={`${prefix}-own`}
        viewBox="0 0 12 12"
        refX="11"
        refY="6"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <path
          d="M1.5,1.5 L10.5,6 L1.5,10.5"
          fill="none"
          stroke="var(--color-maroon)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>
      <marker
        id={`${prefix}-svc`}
        viewBox="0 0 12 12"
        refX="11"
        refY="6"
        markerWidth="9"
        markerHeight="9"
        orient="auto"
      >
        <path
          d="M1.5,1.5 L10.5,6 L1.5,10.5"
          fill="none"
          stroke="var(--color-stone)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>
      <marker
        id={`${prefix}-txn`}
        viewBox="0 0 12 12"
        refX="11"
        refY="6"
        markerWidth="10"
        markerHeight="10"
        orient="auto"
      >
        <path
          d="M1.5,1.5 L10.5,6 L1.5,10.5"
          fill="none"
          stroke="var(--color-maroon-dark)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </marker>
    </defs>
  );
}

const ICONS: Record<CardId, ReactElement> = {
  am: (
    <g stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none">
      <rect x="10" y="6" width="14" height="18" rx="1" />
      <line x1="13" y1="10.5" x2="21" y2="10.5" />
      <line x1="13" y1="15" x2="21" y2="15" />
      <rect x="15" y="18" width="4" height="6" rx="0.5" fill="white" opacity="0.4" />
    </g>
  ),
  spv: (
    <g stroke="white" strokeWidth="1.3" strokeLinecap="round" fill="none">
      <rect x="8" y="9" width="8" height="13" rx="1" />
      <rect x="18" y="13" width="8" height="9" rx="1" />
    </g>
  ),
  ave: (
    <g stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M8,22 L8,12 L17,7 L26,12 L26,22 Z" />
      <line x1="17" y1="14" x2="17" y2="22" />
    </g>
  ),
  third: (
    <g stroke="white" strokeWidth="1.3" fill="none">
      <circle cx="17" cy="10" r="4" />
      <path d="M9,26 Q9,17 17,17 Q25,17 25,26" />
    </g>
  ),
};

/* ─── connector label plate sizing ───────────────────────────────────────── */

const PLATE_LINE_H = 17;
const PLATE_PAD = 14;
const CHAR_W = 9;

function DeskPlate({ px, py, label }: { px: number; py: number; label: string }) {
  const lines = label.split("|");
  const width = Math.ceil(Math.max(...lines.map((line) => line.length)) * CHAR_W) + PLATE_PAD * 2;
  const height = lines.length * PLATE_LINE_H + 8;
  const firstBaseline = py - ((lines.length - 1) * PLATE_LINE_H) / 2 + 5;
  return (
    <g>
      <rect
        x={px - width / 2}
        y={py - height / 2}
        width={width}
        height={height}
        rx={5}
        className={styles.plate}
      />
      {lines.map((line, index) => (
        <text
          key={line}
          x={px}
          y={firstBaseline + index * PLATE_LINE_H}
          textAnchor="middle"
          className={styles.connL}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PORTRAIT DIAGRAM (phones) — the same entity map redrawn for a tall screen
   ═══════════════════════════════════════════════════════════════════════════
   One column, 360 units wide (about one CSS pixel per unit on a small phone).
   A rail down the left edge carries the ownership arrows from the hub into the
   three entities it owns; each outward sale sits directly under its seller:

     NDR Smart Spaces          hub
     NDR Asset Management      ← PMC fee from Group SPVs
     Group SPVs
     Ave Acres LLP
     Third parties             ⇄ developed land / consideration
   ═══════════════════════════════════════════════════════════════════════════ */

const P_W = 360;
const P_H = 768;
const P_X = 48;
const P_BOX_W = 292;
const P_RAIL_X = 24;

const P_NODES: Record<EntityId, N> = {
  center: { x: P_X, y: 16, w: P_BOX_W, h: 84 },
  am: { x: P_X, y: 170, w: P_BOX_W, h: 84 },
  spv: { x: P_X, y: 318, w: P_BOX_W, h: 100 },
  ave: { x: P_X, y: 470, w: P_BOX_W, h: 84 },
  third: { x: P_X, y: 644, w: P_BOX_W, h: 84 },
};

const P_ENTITIES: readonly { id: CardId; title: string; fn: string }[] = [
  { id: "am", title: am.name, fn: "Project/Asset management company" },
  { id: "spv", title: spv.name, fn: "Owns / leases land · constructs warehouses" },
  { id: "ave", title: ave.name, fn: "Development entity · plotting" },
  { id: "third", title: third.name, fn: "Land purchasers" },
];

type PortraitConnector = {
  id: string;
  type: ConnType;
  d: string;
  noArrow?: boolean;
  /** Label plate: centre point, or an edge to align against (`start` / `end`). */
  lx?: number;
  ly?: number;
  anchor?: "start" | "middle" | "end";
  lines?: readonly string[];
};

const P_CONNECTORS: readonly PortraitConnector[] = [
  /* hub → owned entities, down the left rail */
  {
    id: "own-rail",
    type: "ownership",
    d: `M${P_X} 58 L${P_RAIL_X} 58 L${P_RAIL_X} 512`,
    noArrow: true,
  },
  { id: "own-am", type: "ownership", d: `M${P_RAIL_X} 212 L42 212` },
  { id: "own-spv", type: "ownership", d: `M${P_RAIL_X} 368 L42 368` },
  { id: "own-ave", type: "ownership", d: `M${P_RAIL_X} 512 L42 512` },
  /* Group SPVs → Asset Management, straight up between the two cards */
  {
    id: "svc-pmc",
    type: "service",
    d: "M250 312 L250 260",
    lx: 262,
    ly: 286,
    anchor: "start",
    lines: ["PMC fee ·", "consultancy"],
  },
  /* Ave Acres ⇄ Third parties */
  {
    id: "txn-sale-ave",
    type: "transaction",
    d: "M180 560 L180 638",
    lx: 170,
    ly: 599,
    anchor: "end",
    lines: ["Sale of", "developed land"],
  },
  {
    id: "txn-pay-ave",
    type: "transaction",
    d: "M216 644 L216 566",
    lx: 226,
    ly: 599,
    anchor: "start",
    lines: ["Consideration", "paid"],
  },
];

const P_LABEL_CHAR_W = 6.7;
const P_LABEL_LINE_H = 15;
const P_LABEL_PAD_X = 8;

/* Greedy wrap by character budget, never leaving a "·" or "/" dangling at a line end. */
function wrapLines(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(" ")) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || current === "") current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return tidyWrap(lines);
}

function PortraitLabel({ connector }: { connector: PortraitConnector }) {
  const { lines, lx, ly, anchor = "middle" } = connector;
  if (!lines || lx === undefined || ly === undefined) return null;
  const width =
    Math.ceil(Math.max(...lines.map((line) => line.length)) * P_LABEL_CHAR_W) + P_LABEL_PAD_X * 2;
  const height = lines.length * P_LABEL_LINE_H + 8;
  const x = anchor === "middle" ? lx - width / 2 : anchor === "end" ? lx - width : lx;
  const firstBaseline = ly - ((lines.length - 1) * P_LABEL_LINE_H) / 2 + 4;
  return (
    <g>
      <rect
        x={x}
        y={ly - height / 2}
        width={width}
        height={height}
        rx={4}
        className={styles.plate}
      />
      {lines.map((line, index) => (
        <text
          key={line}
          x={x + width / 2}
          y={firstBaseline + index * P_LABEL_LINE_H}
          textAnchor="middle"
          className={styles.pLabel}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function PortraitNode({ id, title, fn }: { id: CardId; title: string; fn: string }) {
  const node = P_NODES[id];
  const textX = node.x + 12;
  const titleLines = wrapLines(title, Math.floor((node.w - 24) / 7.6));
  const fnLines = wrapLines(fn, Math.floor((node.w - 24) / 6.5));
  const titleY = node.y + 30;
  const fnY = titleY + titleLines.length * 17 + 3;
  return (
    <g>
      <rect x={node.x} y={node.y} width={node.w} height={node.h} rx={4} className={styles.nodeBg} />
      <rect
        x={node.x}
        y={node.y}
        width={node.w}
        height={4}
        rx={2}
        className={id === "am" ? styles.accentG : styles.accentM}
      />
      {titleLines.map((line, index) => (
        <text key={line} x={textX} y={titleY + index * 17} className={styles.pTitle}>
          {line}
        </text>
      ))}
      {fnLines.map((line, index) => (
        <text key={line} x={textX} y={fnY + index * 15} className={styles.pFn}>
          {line}
        </text>
      ))}
      <g transform={`translate(${node.x + node.w - 28}, ${node.y - 11})`}>
        <circle cx="11" cy="11" r="11" className={styles.badgeBg} strokeWidth={2} />
        <g transform="translate(1.5, 1.5) scale(0.56)" className={styles.badgeIcon}>
          {ICONS[id]}
        </g>
      </g>
    </g>
  );
}

function PortraitDiagram() {
  const hub = P_NODES.center;
  const hubCx = hub.x + hub.w / 2;
  return (
    <div className={styles.diagramPortrait}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${P_W} ${P_H}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <ArrowDefs prefix="p" />

        {/* lines first, then every label plate, so a plate can sit over a crossing */}
        <g className={styles.connectors}>
          {P_CONNECTORS.map((connector) => (
            <path
              key={connector.id}
              d={connector.d}
              fill="none"
              strokeWidth={1.7}
              className={cx(
                styles.connP,
                connector.type === "ownership" && styles.pOwn,
                connector.type === "service" && styles.pSvc,
                connector.type === "transaction" && styles.pTxn,
              )}
              markerEnd={connector.noArrow ? undefined : `url(#${markerId(connector.type, "p")})`}
            />
          ))}
          {P_CONNECTORS.map((connector) => (
            <PortraitLabel key={connector.id} connector={connector} />
          ))}
        </g>

        {/* hub */}
        <g>
          <rect
            x={hub.x}
            y={hub.y}
            width={hub.w}
            height={hub.h}
            rx={4}
            className={styles.centerBg}
          />
          <rect x={hub.x} y={hub.y} width={hub.w} height={4} rx={2} className={styles.centerAcc} />
          <text
            x={hubCx}
            y={hub.y + hub.h / 2 + 6}
            textAnchor="middle"
            className={styles.pHubTitle}
          >
            NDR Smart Spaces Pvt. Ltd.
          </text>
        </g>

        {P_ENTITIES.map((entity) => (
          <PortraitNode key={entity.id} {...entity} />
        ))}
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — static, no animation, no hover interaction
   ═══════════════════════════════════════════════════════════════════════════ */

export function CorporateStructure() {
  return (
    <Section tone="dim" id="structure" ariaLabelledby="structure-title" className={styles.section}>
      <Container className={styles.content}>
        <header className={styles.header}>
          <span className={styles.headerRule} aria-hidden="true" />
          <h2 id="structure-title" className={styles.title}>
            {corporateStructureChapter.label}
          </h2>
          <p className={styles.subtitle}>{corporateStructureChapter.title}</p>
        </header>

        <figure className={styles.figure}>
          {/* Desktop / tablet: the orthogonal entity map (decorative SVG). */}
          <div className={styles.diagram}>
            <svg
              className={styles.svg}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <ArrowDefs />

              {/* connectors, then every label on top so a plate can sit over a line */}
              <g className={styles.connectors}>
                {CONNECTORS.map((connector) => (
                  <path
                    key={connector.id}
                    d={connector.d}
                    fill="none"
                    strokeWidth={2}
                    className={cx(
                      styles.connP,
                      connector.type === "ownership" && styles.pOwn,
                      connector.type === "service" && styles.pSvc,
                      connector.type === "transaction" && styles.pTxn,
                    )}
                    markerEnd={connector.noArrow ? undefined : `url(#${markerId(connector.type)})`}
                  />
                ))}
                {CONNECTORS.map((connector) =>
                  connector.plate ? <DeskPlate key={connector.id} {...connector.plate} /> : null,
                )}
              </g>

              {/* level 1 — the hub */}
              <g>
                <rect
                  x={NODES.center.x}
                  y={NODES.center.y}
                  width={NODES.center.w}
                  height={NODES.center.h}
                  rx={5}
                  className={styles.centerBg}
                />
                <rect
                  x={NODES.center.x}
                  y={NODES.center.y}
                  width={NODES.center.w}
                  height={5}
                  rx={2.5}
                  className={styles.centerAcc}
                />
                <text
                  x={NODES.center.x + NODES.center.w / 2}
                  y={NODES.center.y + NODES.center.h / 2 + 10}
                  textAnchor="middle"
                  className={styles.cTitle}
                >
                  NDR Smart Spaces Pvt. Ltd.
                </text>
              </g>

              {/* level 2 — what the hub owns */}
              <EntityNode id="am" title={am.name} fn="PROJECT/ASSET MANAGEMENT COMPANY" />
              <EntityNode
                id="spv"
                title={spv.name}
                fnLine1="OWNS / LEASES LAND ·"
                fnLine2="CONSTRUCTS WAREHOUSES"
              />
              <EntityNode id="ave" title={ave.name} fn="DEVELOPMENT ENTITY · PLOTTING" />

              {/* level 3 — the outward sale */}
              <EntityNode id="third" title={third.name} fn="LAND PURCHASERS" />
            </svg>
          </div>

          {/* Phones: the same map redrawn for a tall screen. */}
          <PortraitDiagram />

          {/* Screen-reader version of both (decorative) diagrams. */}
          <ol className={styles.tree}>
            <li>
              {corporateStructure.header.name}: {corporateStructure.header.role}
            </li>
            <li>
              Ownership: {am.name}. {am.function}.
            </li>
            <li>
              Ownership: {spv.name}. {spv.function}.
            </li>
            <li>
              Services / Fees, PMC fee and consultancy: {spv.name} to {am.name}.
            </li>
            <li>
              Ownership: {ave.name}. {ave.function}.
            </li>
            <li>
              Transactions, sale of developed land: {ave.name} to {third.name} (land purchasers).
            </li>
            <li>
              Transactions, consideration paid: {third.name} to {ave.name}.
            </li>
          </ol>

          <SourceFootnote className={styles.source}>{corporateStructure.source}</SourceFootnote>
        </figure>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENTITY NODE SUB-COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

type NodeProps = {
  id: CardId;
  title: string;
  fn?: string;
  fnLine1?: string;
  fnLine2?: string;
};

function EntityNode({ id, title, fn, fnLine1, fnLine2 }: NodeProps) {
  const n = NODES[id];
  const pad = 34;
  const inner = n.w - pad - 24;

  const titleLines = wrapText(title, TITLE_CHAR_W, inner);
  const twoLineTitle = titleLines.length === 2;

  const titleY1 = n.y + 30;
  const titleY2 = titleY1 + 18;
  const hairY = twoLineTitle ? n.y + 62 : n.y + 46;
  const fnY1 = twoLineTitle ? n.y + 80 : n.y + 64;

  return (
    <g>
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} className={styles.nodeBg} />
      <rect
        x={n.x}
        y={n.y}
        width={4}
        height={n.h}
        rx={2}
        className={id === "am" ? styles.accentG : styles.accentM}
      />
      <text x={n.x + pad} y={titleY1} className={styles.nTitle}>
        {titleLines[0]}
      </text>
      {twoLineTitle && (
        <text x={n.x + pad} y={titleY2} className={styles.nTitle}>
          {titleLines[1]}
        </text>
      )}
      {(fn || fnLine1) && (
        <line
          x1={n.x + pad}
          y1={hairY}
          x2={n.x + n.w - pad}
          y2={hairY}
          stroke="var(--color-hairline-light)"
          strokeWidth="0.6"
        />
      )}
      {fn && (
        <text x={n.x + pad} y={fnY1} className={styles.nFn}>
          {fn}
        </text>
      )}
      {fnLine1 && (
        <text x={n.x + pad} y={fnY1} className={styles.nFn}>
          {fnLine1}
        </text>
      )}
      {fnLine2 && (
        <text x={n.x + pad} y={fnY1 + 16} className={styles.nFn}>
          {fnLine2}
        </text>
      )}
      <g transform={`translate(${n.x - 6}, ${n.y - 6})`}>
        <circle cx="17" cy="17" r="17" className={styles.badgeBg} />
        <g className={styles.badgeIcon}>{ICONS[id]}</g>
      </g>
    </g>
  );
}
