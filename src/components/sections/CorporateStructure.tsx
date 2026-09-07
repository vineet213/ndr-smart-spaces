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
  center: { x: 465, y: 36, w: 320, h: 124 },
  am: { x: 40, y: 270, w: 250, h: 190 },
  spv: { x: 350, y: 270, w: 250, h: 190 },
  warehouses: { x: 650, y: 270, w: 250, h: 190 },
  ave: { x: 960, y: 270, w: 250, h: 190 },
  invit: { x: 475, y: 540, w: 300, h: 136 },
  third: { x: 960, y: 540, w: 250, h: 136 },
};

/* Anchor card text is centred left of its corner badge so no glyph collides
   with the badge disk. */
const CCX = 575;

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
    d: `M785 160 L785 200 L1085 200 L1085 264`,
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
    lx: 636,
    ly: 488,
    label: "Sale of SPV Ownership",
  },
  {
    id: "txn-pay-invit",
    type: "transaction",
    d: `M632 540 L632 168`,
    lx: 650,
    ly: 516,
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

const markerId = (t: ConnType) =>
  t === "ownership" ? "a-own" : t === "service" ? "a-svc" : "a-txn";

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

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="a-own"
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
        id="a-svc"
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
        id="a-txn"
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
                        rx={3}
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

          {/* Mobile: a stacked relationship tree built from the same data. */}
          <ol className={styles.tree}>
            <li className={styles.treeItem}>
              <span className={styles.treeRole}>{corporateStructure.header.role}</span>
              <span className={styles.treeName}>{corporateStructure.header.name}</span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Ownership</span>
              <span className={styles.treeName}>{am.name}</span>
              <span className={styles.treeRole}>
                {am.function} · {am.relationship}
              </span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Ownership</span>
              <span className={styles.treeName}>{spv.name}</span>
              <span className={styles.treeRole}>
                {spv.function} · {spv.relationship}
              </span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Services / Fees · PMC fee · Consultancy</span>
              <span className={styles.treeName}>
                {spv.name} → {am.name}
              </span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Services / Fees · Rental income</span>
              <span className={styles.treeName}>{corporateStructure.header.name} → Warehouses</span>
              <span className={styles.treeRole}>
                Rental income assets · Income generating assets
              </span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Ownership</span>
              <span className={styles.treeName}>{ave.name}</span>
              <span className={styles.treeRole}>
                {ave.function} · {ave.relationship}
              </span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Transactions · Sale of developed land</span>
              <span className={styles.treeName}>{ave.name} → Third parties</span>
              <span className={styles.treeRole}>Land purchasers</span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Transactions · Consideration paid</span>
              <span className={styles.treeName}>Third parties → {ave.name}</span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Transactions · Sale of SPV ownership</span>
              <span className={styles.treeName}>
                {corporateStructure.header.name} → {invit.name}
              </span>
              <span className={styles.treeRole}>
                {invit.function} · {invit.relationship}
              </span>
            </li>
            <li className={styles.treeItem}>
              <span className={styles.treeRel}>Transactions · Consideration paid</span>
              <span className={styles.treeName}>
                {invit.name} → {corporateStructure.header.name}
              </span>
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
