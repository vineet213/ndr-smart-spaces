import type { ReactElement } from "react";
import { Container, Section } from "@/components/layout";
import { SourceFootnote } from "@/components/ui";
import { corporateStructure, corporateStructureChapter } from "@/lib/data/business";
import { ChapterOpener } from "./ChapterOpener";
import { cx } from "../ui/cx";
import styles from "./CorporateStructure.module.css";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA REFERENCES
   ═══════════════════════════════════════════════════════════════════════════ */

const [spv, am, ave, invit, third] = corporateStructure.branches;

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS — 1250 × 720, three structured tiers
   ═══════════════════════════════════════════════════════════════════════════
   Tier 1  NDR Smart Spaces Pvt. Ltd. (anchor)
   Tier 2  Operating & ownership block: NDR Asset Management · Group SPVs ·
           Warehouses · Ave Acres LLP
   Tier 3  Capital & interaction block: NDR InvIT Trust · Third parties
   ═══════════════════════════════════════════════════════════════════════════ */

const VB_W = 1250;
const VB_H = 720;

type EntityId = "center" | "spv" | "am" | "ave" | "invit" | "warehouses" | "third";

type N = { x: number; y: number; w: number; h: number };

const NODES: Record<EntityId, N> = {
  center: { x: 400, y: 36, w: 450, h: 124 },
  am: { x: 40, y: 270, w: 250, h: 190 },
  spv: { x: 350, y: 270, w: 250, h: 190 },
  warehouses: { x: 650, y: 270, w: 250, h: 190 },
  ave: { x: 960, y: 270, w: 250, h: 190 },
  invit: { x: 475, y: 540, w: 300, h: 136 },
  third: { x: 960, y: 540, w: 250, h: 136 },
};

/* Anchor card title, centred on the (now generously widened) box itself —
   wide enough that "NDR Smart Spaces" clears both the box's own edges and
   the corner badge without needing an off-centre fudge. */
const CCX = NODES.center.x + NODES.center.w / 2;

/* ═══════════════════════════════════════════════════════════════════════════
   CONNECTORS — orthogonal elbows, every edge end lands on a card edge.
   All nine relationships are preserved from the previous diagram.
   ═══════════════════════════════════════════════════════════════════════════ */

type ConnType = "ownership" | "service" | "transaction";

type Connector = {
  id: string;
  type: ConnType;
  d: string;
  lx: number;
  ly: number;
  label: string;
};

const CONNECTORS: readonly Connector[] = [
  {
    id: "own-am",
    type: "ownership",
    d: `M470 160 L470 200 L165 200 L165 264`,
    lx: 183,
    ly: 232,
    label: "Ownership",
  },
  {
    id: "own-spv",
    type: "ownership",
    d: `M475 160 L475 264`,
    lx: 493,
    ly: 228,
    label: "Ownership",
  },
  {
    id: "own-ave",
    type: "ownership",
    d: `M850 160 L850 200 L1085 200 L1085 264`,
    lx: 1103,
    ly: 232,
    label: "Ownership",
  },
  {
    id: "svc-rental",
    type: "service",
    d: `M700 160 L700 200 L775 200 L775 264`,
    lx: 793,
    ly: 232,
    label: "Rental Income",
  },
  {
    id: "svc-pmc",
    type: "service",
    d: `M400 460 L400 495 L165 495 L165 462`,
    lx: 196,
    ly: 506,
    label: "PMC Fee · Consultancy",
  },
  {
    id: "txn-sale-invit",
    type: "transaction",
    d: `M618 168 L618 540`,
    lx: 660,
    ly: 480,
    label: "Sale of SPV Ownership",
  },
  {
    id: "txn-pay-invit",
    type: "transaction",
    d: `M632 540 L632 168`,
    lx: 660,
    ly: 526,
    label: "Consideration Paid",
  },
  {
    id: "txn-sale-ave",
    type: "transaction",
    d: `M1077 468 L1077 532`,
    lx: 879,
    ly: 476,
    label: "Sale of Developed Land",
  },
  {
    id: "txn-pay-ave",
    type: "transaction",
    d: `M1093 532 L1093 468`,
    lx: 922,
    ly: 504,
    label: "Consideration Paid",
  },
];

const markerId = (t: ConnType, prefix = "a") =>
  `${prefix}-${t === "ownership" ? "own" : t === "service" ? "svc" : "txn"}`;

/* ═══════════════════════════════════════════════════════════════════════════
   TEXT HELPERS — deterministic word-wrap for titles and relationship lines
   ═══════════════════════════════════════════════════════════════════════════ */

const TITLE_CHAR_W = 8.2;
const REL_CHAR_W = 6.3;

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

const ICONS: Record<EntityId, ReactElement> = {
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
  invit: (
    <g stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M17,5 L8,10 L8,17 Q8,25 17,27 Q26,25 26,17 L26,10 Z" />
      <polyline points="12,15 16,19 23,11" />
    </g>
  ),
  warehouses: (
    <g stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none">
      <path d="M6,16 L17,8 L28,16" />
      <rect x="8" y="16" width="18" height="10" rx="0.5" />
      <line x1="17" y1="16" x2="17" y2="26" />
    </g>
  ),
  center: (
    <g stroke="white" strokeWidth="1.3" fill="none">
      <circle cx="17" cy="17" r="11" opacity="0.35" />
      <path d="M12,12 L12,22 M12,12 L22,22 L22,12" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
};

/* ─── connector label plate sizing ───────────────────────────────────────── */

const PLATE_H = 22;
const PLATE_PAD = 14;
const CHAR_W = 9;
const pw = (label: string) => Math.ceil(label.length * CHAR_W) + PLATE_PAD * 2;

/* ─── legend ─────────────────────────────────────────────────────────────── */

function Legend() {
  const items = [
    { label: "Ownership", x: 150, cls: styles.legendOwn },
    { label: "Services / Fees", x: 300, cls: styles.legendSvc },
    { label: "Transactions", x: 480, cls: styles.legendTxn },
  ];
  return (
    <g className={styles.legend}>
      <text x={40} y={706} className={styles.legendHeading}>
        LEGEND
      </text>
      {items.map((item) => (
        <g key={item.label}>
          <line x1={item.x} y1={700} x2={item.x + 40} y2={700} className={item.cls} />
          <text x={item.x + 50} y={706} className={styles.legendText}>
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PORTRAIT DIAGRAM (phones) — the same entity map redrawn for a tall screen
   ═══════════════════════════════════════════════════════════════════════════
   360 units wide, so one unit is roughly one CSS pixel on a small phone and the
   text (12+ units) stays readable. Top to bottom:

     NDR InvIT            capital partner, paired transaction arrows to the hub
     NDR Smart Spaces     the hub
     Asset Mgmt | SPVs    owned entities
     Warehouses | Ave     rental assets, plotting entity
     Legend     | Third   land purchasers

   Long-haul lines run in dedicated channels (centre gutter, right margin) so no
   connector ever passes through a card.
   ═══════════════════════════════════════════════════════════════════════════ */

const P_W = 360;
const P_H = 852;
const P_COL_L = 30;
const P_COL_R = 192;
const P_BOX_W = 138;
const P_BOX_H = 124;
const P_GUTTER_X = 180;
const P_RAIL_X = 345;

const P_NODES: Record<EntityId, N> = {
  invit: { x: 90, y: 16, w: 180, h: 88 },
  center: { x: 40, y: 166, w: 280, h: 92 },
  am: { x: P_COL_L, y: 332, w: P_BOX_W, h: P_BOX_H },
  spv: { x: P_COL_R, y: 332, w: P_BOX_W, h: P_BOX_H },
  warehouses: { x: P_COL_L, y: 566, w: P_BOX_W, h: 100 },
  ave: { x: P_COL_R, y: 566, w: P_BOX_W, h: 100 },
  third: { x: P_COL_R, y: 736, w: P_BOX_W, h: 84 },
};

const P_ENTITIES: readonly { id: Exclude<EntityId, "center">; title: string; fn: string }[] = [
  { id: "invit", title: invit.name, fn: "Separate listed entity under the NDR Group" },
  { id: "am", title: am.name, fn: "Project management company" },
  { id: "spv", title: spv.name, fn: "Owns / leases land · constructs warehouses" },
  { id: "warehouses", title: "Warehouses", fn: "Rental income assets" },
  { id: "ave", title: ave.name, fn: "Development entity · plotting" },
  { id: "third", title: third.name, fn: "Land purchasers" },
];

type PortraitConnector = {
  id: string;
  type: ConnType;
  d: string;
  /** Label plate: centre point, or an edge to align against (`start` / `end`). */
  lx: number;
  ly: number;
  anchor?: "start" | "middle" | "end";
  lines: readonly string[];
};

const P_CONNECTORS: readonly PortraitConnector[] = [
  /* hub ⇄ InvIT, a tight vertical pair with a label on each side */
  {
    id: "txn-sale-invit",
    type: "transaction",
    d: "M172 166 L172 110",
    lx: 162,
    ly: 135,
    anchor: "end",
    lines: ["Sale of SPV ownership"],
  },
  {
    id: "txn-pay-invit",
    type: "transaction",
    d: "M188 104 L188 160",
    lx: 198,
    ly: 135,
    anchor: "start",
    lines: ["Consideration paid"],
  },
  /* hub → owned entities directly beneath it */
  {
    id: "own-am",
    type: "ownership",
    d: "M99 258 L99 326",
    lx: 99,
    ly: 292,
    lines: ["Ownership"],
  },
  {
    id: "own-spv",
    type: "ownership",
    d: "M261 258 L261 326",
    lx: 261,
    ly: 292,
    lines: ["Ownership"],
  },
  /* Group SPVs → Asset Management, a U beneath the two cards */
  {
    id: "svc-pmc",
    type: "service",
    d: "M240 456 L240 482 L120 482 L120 462",
    lx: P_GUTTER_X,
    ly: 482,
    lines: ["PMC fee ·", "consultancy"],
  },
  /* hub → Warehouses, down the centre gutter between the cards */
  {
    id: "svc-rental",
    type: "service",
    d: `M${P_GUTTER_X} 258 L${P_GUTTER_X} 520 L80 520 L80 560`,
    lx: 148,
    ly: 520,
    lines: ["Rental", "income"],
  },
  /* hub → Ave Acres, down the right-margin rail */
  {
    id: "own-ave",
    type: "ownership",
    d: `M320 212 L${P_RAIL_X} 212 L${P_RAIL_X} 520 L262 520 L262 560`,
    lx: 304,
    ly: 520,
    lines: ["Ownership"],
  },
  /* Ave Acres ⇄ Third parties */
  {
    id: "txn-sale-ave",
    type: "transaction",
    d: "M206 666 L206 730",
    lx: 196,
    ly: 698,
    anchor: "end",
    lines: ["Sale of", "developed land"],
  },
  {
    id: "txn-pay-ave",
    type: "transaction",
    d: "M222 736 L222 672",
    lx: 232,
    ly: 698,
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

function PortraitNode({ id, title, fn }: { id: EntityId; title: string; fn: string }) {
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
        className={id === "invit" ? styles.accentG : styles.accentM}
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

function PortraitLegend() {
  const x = P_COL_L;
  const top = P_NODES.third.y + 22;
  const items = [
    { label: "Ownership", cls: styles.legendOwn },
    { label: "Services / fees", cls: styles.legendSvc },
    { label: "Transactions", cls: styles.legendTxn },
  ];
  return (
    <g className={styles.legend}>
      <text x={x} y={top} className={styles.pLegendHeading}>
        LEGEND
      </text>
      {items.map((item, index) => {
        const y = top + 26 + index * 26;
        return (
          <g key={item.label}>
            <line x1={x} y1={y - 4} x2={x + 30} y2={y - 4} className={item.cls} />
            <text x={x + 40} y={y} className={styles.pLegendText}>
              {item.label}
            </text>
          </g>
        );
      })}
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
              markerEnd={`url(#${markerId(connector.type, "p")})`}
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
          <text x={hubCx} y={hub.y + 38} textAnchor="middle" className={styles.pHubTitle}>
            NDR Smart Spaces
          </text>
          <text x={hubCx} y={hub.y + 58} textAnchor="middle" className={styles.pHubSub}>
            Pvt. Ltd.
          </text>
          <text x={hubCx} y={hub.y + 79} textAnchor="middle" className={styles.pHubRole}>
            Parent platform of the NDR Group
          </text>
        </g>

        {P_ENTITIES.map((entity) => (
          <PortraitNode key={entity.id} {...entity} />
        ))}

        <PortraitLegend />
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
        <ChapterOpener
          chapter={corporateStructureChapter}
          headingId="structure-title"
          animate={false}
          hideNumeral
        />

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

              {/* connectors */}
              <g className={styles.connectors}>
                {CONNECTORS.map((connector) => {
                  const width = pw(connector.label);
                  return (
                    <g key={connector.id}>
                      <path
                        d={connector.d}
                        fill="none"
                        strokeWidth={2}
                        className={cx(
                          styles.connP,
                          connector.type === "ownership" && styles.pOwn,
                          connector.type === "service" && styles.pSvc,
                          connector.type === "transaction" && styles.pTxn,
                        )}
                        markerEnd={`url(#${markerId(connector.type)})`}
                      />
                      <rect
                        x={connector.lx - PLATE_PAD}
                        y={connector.ly - PLATE_H / 2}
                        width={width}
                        height={PLATE_H}
                        rx={5}
                        className={styles.plate}
                      />
                      <text
                        x={connector.lx - PLATE_PAD + width / 2}
                        y={connector.ly + 5}
                        textAnchor="middle"
                        className={styles.connL}
                      >
                        {connector.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* tier 1 — anchor hub */}
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
                <text x={CCX} y={NODES.center.y + 62} textAnchor="middle" className={styles.cTitle}>
                  NDR Smart Spaces
                </text>
                <text
                  x={CCX}
                  y={NODES.center.y + 88}
                  textAnchor="middle"
                  className={styles.cTitleSub}
                >
                  Pvt. Ltd.
                </text>
                <text x={CCX} y={NODES.center.y + 114} textAnchor="middle" className={styles.cRole}>
                  PARENT PLATFORM OF THE NDR GROUP
                </text>
                <g
                  transform={`translate(${NODES.center.x + NODES.center.w - 44}, ${NODES.center.y + 43})`}
                >
                  <circle cx="17" cy="17" r="17" fill="white" opacity="0.07" />
                  <g>{ICONS.center}</g>
                </g>
              </g>

              {/* tier 2 — operating & ownership block */}
              <EntityNode
                id="am"
                title={am.name}
                fn="PROJECT MANAGEMENT COMPANY"
                rel="Ownership · Project Management"
              />
              <EntityNode
                id="spv"
                title={spv.name}
                fnLine1="OWNS / LEASES LAND"
                fnLine2="· CONSTRUCTS WAREHOUSES"
                rel="Rental income · Subsidiaries / JVs"
              />
              <EntityNode
                id="warehouses"
                title="Warehouses"
                fn="RENTAL INCOME ASSETS"
                rel="Income generating assets"
              />
              <EntityNode
                id="ave"
                title={ave.name}
                fn="DEVELOPMENT ENTITY · PLOTTING"
                rel="Development fee · Sale of developed land"
              />

              {/* tier 3 — capital & interaction block */}
              <EntityNode
                id="invit"
                title={invit.name}
                fnLine1="SEPARATE LISTED ENTITY"
                fnLine2="UNDER THE NDR GROUP"
                rel="Sale of SPV ownership · Consideration paid"
              />
              <EntityNode
                id="third"
                title={third.name}
                fn="LAND PURCHASERS"
                rel="Purchasers of developed land"
              />

              <Legend />
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
              Services / Fees, rental income: {corporateStructure.header.name} to Warehouses (rental
              income assets).
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
            <li>
              Transactions, sale of SPV ownership: {corporateStructure.header.name} to {invit.name}{" "}
              ({invit.function}).
            </li>
            <li>
              Transactions, consideration paid: {invit.name} to {corporateStructure.header.name}.
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
  id: EntityId;
  title: string;
  fn?: string;
  fnLine1?: string;
  fnLine2?: string;
  rel: string;
};

function EntityNode({ id, title, fn, fnLine1, fnLine2, rel }: NodeProps) {
  const n = NODES[id];
  const pad = 34;
  const inner = n.w - pad - 24;

  const titleLines = wrapText(title, TITLE_CHAR_W, inner);
  const relLines = wrapText(rel, REL_CHAR_W, inner);
  const twoLineTitle = titleLines.length === 2;

  const titleY1 = n.y + 30;
  const titleY2 = titleY1 + 18;
  const hairY = twoLineTitle ? n.y + 62 : n.y + 46;
  const fnY1 = twoLineTitle ? n.y + 80 : n.y + 64;
  const relY1 = n.y + n.h - (relLines.length === 2 ? 38 : 32);
  const relY2 = relY1 + 16;

  return (
    <g>
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} className={styles.nodeBg} />
      <rect
        x={n.x}
        y={n.y}
        width={4}
        height={n.h}
        rx={2}
        className={id === "am" || id === "invit" ? styles.accentG : styles.accentM}
      />
      <text x={n.x + pad} y={titleY1} className={styles.nTitle}>
        {titleLines[0]}
      </text>
      {twoLineTitle && (
        <text x={n.x + pad} y={titleY2} className={styles.nTitle}>
          {titleLines[1]}
        </text>
      )}
      <line
        x1={n.x + pad}
        y1={hairY}
        x2={n.x + n.w - pad}
        y2={hairY}
        stroke="var(--color-hairline-light)"
        strokeWidth="0.6"
      />
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
      <text x={n.x + pad} y={relY1} className={styles.nRel}>
        {relLines[0]}
      </text>
      {relLines.length === 2 && (
        <text x={n.x + pad} y={relY2} className={styles.nRel}>
          {relLines[1]}
        </text>
      )}
      <g transform={`translate(${n.x - 6}, ${n.y - 6})`}>
        <circle cx="17" cy="17" r="17" className={styles.badgeBg} />
        <g className={styles.badgeIcon}>{ICONS[id]}</g>
      </g>
    </g>
  );
}
