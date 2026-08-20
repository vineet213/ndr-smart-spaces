"use client";

import { type CSSProperties, type ReactElement, useCallback, useMemo, useState } from "react";
import { Container, Section } from "@/components/layout";
import { useInView } from "@/hooks/useInView";
import { businessChapters, corporateStructure } from "@/lib/data/business";
import { ChapterOpener } from "./ChapterOpener";
import { Reveal } from "./Reveal";
import { cx } from "../ui/cx";
import styles from "./CorporateStructure.module.css";

/* ═══════════════════════════════════════════════════════════════════════════
   DATA REFERENCES
   ═══════════════════════════════════════════════════════════════════════════ */

const b = corporateStructure.branches;

/* ═══════════════════════════════════════════════════════════════════════════
   CANVAS — 1500 × 960
   ═══════════════════════════════════════════════════════════════════════════ */

const VB_W = 1500;
const VB_H = 960;

type EntityId = "center" | "spv" | "am" | "ave" | "invit" | "warehouses" | "third";

type N = { x: number; y: number; w: number; h: number };

const NODES: Record<EntityId, N> = {
  center:     { x: 555, y: 355, w: 390, h: 220 },
  am:         { x: 65,  y: 55,  w: 310, h: 165 },
  ave:        { x: 1075, y: 55,  w: 310, h: 165 },
  spv:        { x: 30,  y: 350, w: 285, h: 165 },
  third:      { x: 1165, y: 385, w: 255, h: 145 },
  invit:      { x: 380, y: 695, w: 330, h: 150 },
  warehouses: { x: 880, y: 710, w: 270, h: 130 },
};

const rx  = (id: EntityId) => NODES[id].x + NODES[id].w;
const by  = (id: EntityId) => NODES[id].y + NODES[id].h;
const mcx = (id: EntityId) => NODES[id].x + NODES[id].w / 2;
const mcy = (id: EntityId) => NODES[id].y + NODES[id].h / 2;

/* ═══════════════════════════════════════════════════════════════════════════
   CONNECTORS — every d starts/ends at a card edge
   ═══════════════════════════════════════════════════════════════════════════ */

type ConnType = "ownership" | "service" | "transaction";

type Connector = {
  id: string;
  from: EntityId;
  to: EntityId;
  type: ConnType;
  d: string;
  lx: number;
  ly: number;
  label: string;
};

const CONNECTORS: readonly Connector[] = [
  {
    id: "c1",
    from: "center", to: "am", type: "ownership",
    d: `M${NODES.center.x},${NODES.center.y + 15} C${NODES.center.x - 80},${NODES.center.y - 40} ${rx("am") + 30},${by("am") + 40} ${rx("am") - 20},${by("am")}`,
    lx: NODES.center.x - 110, ly: NODES.center.y - 15,
    label: "Ownership",
  },
  {
    id: "c2",
    from: "center", to: "spv", type: "ownership",
    d: `M${NODES.center.x},${mcy("center") + 15} L${rx("spv")},${mcy("spv") + 5}`,
    lx: (NODES.center.x + rx("spv")) / 2 - 20, ly: mcy("center") - 10,
    label: "Ownership",
  },
  {
    id: "c3",
    from: "spv", to: "am", type: "service",
    d: `M${NODES.spv.x + 80},${NODES.spv.y} L${NODES.am.x + 100},${by("am")}`,
    lx: NODES.spv.x - 20, ly: (by("am") + NODES.spv.y) / 2 + 5,
    label: "PMC Fee · Consultancy",
  },
  {
    id: "c4",
    from: "center", to: "ave", type: "ownership",
    d: `M${rx("center")},${NODES.center.y + 15} C${rx("center") + 80},${NODES.center.y - 40} ${NODES.ave.x - 30},${by("ave") + 40} ${NODES.ave.x + 20},${by("ave")}`,
    lx: rx("center") + 110, ly: NODES.center.y - 15,
    label: "Ownership",
  },
  {
    id: "c5",
    from: "ave", to: "third", type: "transaction",
    d: `M${NODES.ave.x + 80},${by("ave")} L${NODES.third.x + 70},${NODES.third.y}`,
    lx: NODES.ave.x - 30, ly: (by("ave") + NODES.third.y) / 2,
    label: "Sale of Developed Land",
  },
  {
    id: "c6",
    from: "third", to: "ave", type: "transaction",
    d: `M${NODES.third.x + NODES.third.w - 80},${NODES.third.y} L${rx("ave") - 80},${by("ave")}`,
    lx: rx("ave") + 10, ly: (by("ave") + NODES.third.y) / 2,
    label: "Consideration Paid",
  },
  {
    id: "c7",
    from: "center", to: "invit", type: "transaction",
    d: `M${NODES.center.x + 70},${by("center")} L${NODES.invit.x + 90},${NODES.invit.y}`,
    lx: NODES.center.x - 60, ly: (by("center") + NODES.invit.y) / 2,
    label: "Sale of SPV Ownership",
  },
  {
    id: "c8",
    from: "invit", to: "center", type: "transaction",
    d: `M${NODES.invit.x + NODES.invit.w - 90},${NODES.invit.y} L${rx("center") - 70},${by("center") + 14}`,
    lx: rx("center") + 10, ly: (by("center") + NODES.invit.y) / 2,
    label: "Consideration Paid",
  },
  {
    id: "c9",
    from: "center", to: "warehouses", type: "service",
    d: `M${rx("center") - 60},${by("center")} L${NODES.warehouses.x + 60},${NODES.warehouses.y}`,
    lx: rx("center") + 10, ly: (by("center") + NODES.warehouses.y) / 2 + 10,
    label: "Rental Income",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HOVER GRAPH
   ═══════════════════════════════════════════════════════════════════════════ */

function related(id: EntityId): Set<EntityId> {
  const s = new Set<EntityId>([id]);
  for (const c of CONNECTORS) { if (c.from === id) s.add(c.to); if (c.to === id) s.add(c.from); }
  return s;
}
function connIds(id: EntityId): Set<string> {
  const s = new Set<string>();
  for (const c of CONNECTORS) { if (c.from === id || c.to === id) s.add(c.id); }
  return s;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SVG SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function ArrowDefs() {
  return (
    <defs>
      <marker id="a-own" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto">
        <path d="M1.5,1.5 L10.5,6 L1.5,10.5" fill="none" stroke="var(--color-maroon)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
      <marker id="a-svc" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="9" markerHeight="9" orient="auto">
        <path d="M1.5,1.5 L10.5,6 L1.5,10.5" fill="none" stroke="var(--color-stone)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
      <marker id="a-txn" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="10" markerHeight="10" orient="auto">
        <path d="M1.5,1.5 L10.5,6 L1.5,10.5" fill="none" stroke="var(--color-maroon-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </marker>
    </defs>
  );
}

function Background() {
  const grid: ReactElement[] = [];
  for (let x = 60; x < VB_W; x += 60) grid.push(<line key={`gv${x}`} x1={x} y1={20} x2={x} y2={VB_H - 20} />);
  for (let y = 60; y < VB_H; y += 60) grid.push(<line key={`gh${y}`} x1={20} y1={y} x2={VB_W - 20} y2={y} />);

  const cx0 = mcx("center"), cy0 = mcy("center");
  const rings = [220, 320, 430, 550].map((r, i) => (
    <circle key={`ring${i}`} cx={cx0} cy={cy0} r={r} fill="none" stroke="var(--color-charcoal)" strokeWidth="0.5" opacity={0.04 - i * 0.007} />
  ));

  return (
    <g className={styles.bg}>
      <g className={styles.bgGrid}>{grid}</g>
      {rings}
      <rect x={22} y={22} width={VB_W - 44} height={VB_H - 44} rx={2} fill="none" stroke="var(--color-charcoal)" strokeWidth="0.6" opacity={0.06} />
      <line x1={cx0 - 480} y1={cy0} x2={cx0 + 480} y2={cy0} stroke="var(--color-charcoal)" strokeWidth="0.3" opacity={0.03} strokeDasharray="4 8" />
      <line x1={cx0} y1={40} x2={cx0} y2={VB_H - 40} stroke="var(--color-charcoal)" strokeWidth="0.3" opacity={0.03} strokeDasharray="4 8" />
    </g>
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

/* ═══════════════════════════════════════════════════════════════════════════
   PLATE WIDTH HELPER
   ═══════════════════════════════════════════════════════════════════════════ */

const PLATE_H = 22;
const PLATE_PAD = 12;
const CHAR_W = 8;
function pw(label: string) { return label.length * CHAR_W + PLATE_PAD * 2; }

/* ═══════════════════════════════════════════════════════════════════════════
   LEGEND
   ═══════════════════════════════════════════════════════════════════════════ */

function Legend() {
  const items = [
    { label: "Ownership", cls: styles.legendOwn },
    { label: "Services / Fees", cls: styles.legendSvc },
    { label: "Transactions", cls: styles.legendTxn },
  ];
  const lx = 1160, ly = 880;
  return (
    <g className={styles.legend}>
      <text x={lx} y={ly} className={styles.legendHeading}>LEGEND</text>
      {items.map((it, i) => {
        const iy = ly + 22 + i * 24;
        return (
          <g key={it.label}>
            <line x1={lx} y1={iy} x2={lx + 32} y2={iy} className={it.cls} />
            <text x={lx + 40} y={iy + 4} className={styles.legendText}>{it.label}</text>
          </g>
        );
      })}
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   EDITORIAL BOTTOM-LEFT
   ═══════════════════════════════════════════════════════════════════════════ */

function Editorial() {
  const x = 50, y = 878;
  return (
    <g className={styles.editorial}>
      <text x={x} y={y} className={styles.edTitle}>CORPORATE STRUCTURE</text>
      <line x1={x} y1={y + 10} x2={x + 60} y2={y + 10} stroke="var(--color-gold)" strokeWidth="2" />
      <text x={x} y={y + 34} className={styles.edSubtitle}>How We Create</text>
      <text x={x} y={y + 52} className={styles.edSubtitle}>Enduring Value.</text>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function CorporateStructure() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [hovered, setHovered] = useState<EntityId | null>(null);

  const relSet = useMemo(() => hovered ? related(hovered) : null, [hovered]);
  const connSet = useMemo(() => hovered ? connIds(hovered) : null, [hovered]);

  const enter = useCallback((id: EntityId) => setHovered(id), []);
  const leave = useCallback(() => setHovered(null), []);

  const hasFocus = hovered !== null;
  const drawn = inView;

  return (
    <Section tone="dim" id="structure" ariaLabelledby="structure-title" className={styles.section}>
      <Container className={styles.content}>
        <Reveal>
          <ChapterOpener chapter={businessChapters[2]} headingId="structure-title" />
        </Reveal>

        <div ref={ref} className={styles.scrollWrap}>
          <div
            className={cx(styles.diagram, drawn && styles.drawn)}
            role="img"
            aria-label="Corporate structure relationship diagram"
          >
            <svg
              className={styles.svg}
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <ArrowDefs />
              <Background />

              {/* ── CONNECTORS ──────────────────────────────────── */}
              <g className={styles.connectors}>
                {CONNECTORS.map((c, i) => {
                  const isConn = connSet?.has(c.id) ?? false;
                  const dim = hasFocus && !isConn;
                  const mid = markerId(c.type);
                  const len = 3000;
                  const w = pw(c.label);
                  return (
                    <g
                      key={c.id}
                      className={cx(styles.connG, drawn && styles.connD, isConn && styles.connHi, dim && styles.connDim)}
                      style={{ "--cd": `${300 + i * 100}ms` } as CSSProperties}
                    >
                      <path
                        d={c.d}
                        fill="none"
                        className={cx(styles.connP, c.type === "ownership" && styles.pOwn, c.type === "service" && styles.pSvc, c.type === "transaction" && styles.pTxn)}
                        markerEnd={`url(#${mid})`}
                        strokeDasharray={len}
                        strokeDashoffset={len}
                      />
                      <rect
                        x={c.lx - PLATE_PAD}
                        y={c.ly - PLATE_H / 2}
                        width={w}
                        height={PLATE_H}
                        rx={3}
                        className={styles.plate}
                      />
                      <text
                        x={c.lx + w / 2 - PLATE_PAD}
                        y={c.ly + 5}
                        textAnchor="middle"
                        className={styles.connL}
                      >
                        {c.label}
                      </text>
                    </g>
                  );
                })}
              </g>

              {/* ── CENTER HUB ──────────────────────────────────── */}
              <g
                className={cx(styles.nodeG, drawn && styles.nodeD, hasFocus && !relSet?.has("center") && styles.nodeDim)}
                style={{ "--nd": "0ms" } as CSSProperties}
                onMouseEnter={() => enter("center")}
                onMouseLeave={leave}
                onFocus={() => enter("center")}
                onBlur={leave}
                tabIndex={0}
                role="button"
                aria-label={corporateStructure.header.name}
              >
                <rect x={NODES.center.x} y={NODES.center.y} width={NODES.center.w} height={NODES.center.h} rx={5} className={styles.centerBg} />
                <rect x={NODES.center.x} y={NODES.center.y} width={NODES.center.w} height={5} rx={2.5} className={styles.centerAcc} />
                <text x={mcx("center")} y={NODES.center.y + 65} textAnchor="middle" className={styles.cTitle}>NDR Smart Spaces</text>
                <text x={mcx("center")} y={NODES.center.y + 95} textAnchor="middle" className={styles.cTitleSub}>Pvt. Ltd.</text>
                <text x={mcx("center")} y={NODES.center.y + 138} textAnchor="middle" className={styles.cRole}>PARENT PLATFORM OF THE NDR GROUP</text>
                <g transform={`translate(${NODES.center.x + NODES.center.w - 42}, ${NODES.center.y + NODES.center.h - 42})`}>
                  <circle cx="17" cy="17" r="17" fill="white" opacity="0.07" />
                  <g transform="translate(0,0)">{ICONS.center}</g>
                </g>
              </g>

              {/* ── AM ─────────────────────────────────────────── */}
              <EntityNode id="am" drawn={drawn} hasFocus={hasFocus} relSet={relSet} enter={enter} leave={leave} delay={150}
                title={b[1].name}
                fn="PROJECT MANAGEMENT COMPANY"
                rel="Ownership · Project Management"
              />

              {/* ── AVE ACRES ──────────────────────────────────── */}
              <EntityNode id="ave" drawn={drawn} hasFocus={hasFocus} relSet={relSet} enter={enter} leave={leave} delay={250}
                title={b[2].name}
                fn="DEVELOPMENT ENTITY · PLOTTING"
                rel="Development fee · Sale of developed land"
              />

              {/* ── GROUP SPVs ─────────────────────────────────── */}
              <EntityNode id="spv" drawn={drawn} hasFocus={hasFocus} relSet={relSet} enter={enter} leave={leave} delay={350}
                title={b[0].name}
                fnLine1="OWNS / LEASES LAND"
                fnLine2="· CONSTRUCTS WAREHOUSES"
                rel="Rental income · Subsidiaries / JVs"
              />

              {/* ── THIRD PARTIES ──────────────────────────────── */}
              <EntityNode id="third" drawn={drawn} hasFocus={hasFocus} relSet={relSet} enter={enter} leave={leave} delay={450}
                title="Third Parties"
                fn="LAND PURCHASERS"
                rel="Purchasers of developed land"
              />

              {/* ── INVIT ──────────────────────────────────────── */}
              <EntityNode id="invit" drawn={drawn} hasFocus={hasFocus} relSet={relSet} enter={enter} leave={leave} delay={550}
                title={b[3].name}
                fnLine1="SEPARATE LISTED ENTITY"
                fnLine2="UNDER THE NDR GROUP"
                rel="Sale of SPV ownership · Consideration paid"
              />

              {/* ── WAREHOUSES ─────────────────────────────────── */}
              <EntityNode id="warehouses" drawn={drawn} hasFocus={hasFocus} relSet={relSet} enter={enter} leave={leave} delay={650}
                title="Warehouses"
                fn="RENTAL INCOME ASSETS"
                rel="Income generating assets"
              />

              <Legend />
              <Editorial />
            </svg>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ENTITY NODE SUB-COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

function markerId(t: ConnType) { return t === "ownership" ? "a-own" : t === "service" ? "a-svc" : "a-txn"; }

type NodeProps = {
  id: EntityId;
  drawn: boolean;
  hasFocus: boolean;
  relSet: Set<EntityId> | null;
  enter: (id: EntityId) => void;
  leave: () => void;
  delay: number;
  title: string;
  fn?: string;
  fnLine1?: string;
  fnLine2?: string;
  rel: string;
};

function EntityNode({ id, drawn, hasFocus, relSet, enter, leave, delay, title, fn, fnLine1, fnLine2, rel }: NodeProps) {
  const n = NODES[id];
  const pad = 24;
  const titleY = n.y + 34;
  const fnY = n.y + 58;
  const relY = fnLine2 ? n.y + 96 : n.y + 78;
  const isDim = hasFocus && !relSet?.has(id);

  return (
    <g
      className={cx(styles.nodeG, drawn && styles.nodeD, isDim && styles.nodeDim)}
      style={{ "--nd": `${delay}ms` } as CSSProperties}
      onMouseEnter={() => enter(id)}
      onMouseLeave={leave}
      onFocus={() => enter(id)}
      onBlur={leave}
      tabIndex={0}
      role="button"
      aria-label={title}
    >
      <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={4} className={styles.nodeBg} />
      <rect x={n.x} y={n.y} width={4} height={n.h} rx={2} className={id === "am" || id === "invit" ? styles.accentG : styles.accentM} />
      <text x={n.x + pad} y={titleY} className={styles.nTitle}>{title}</text>
      <line x1={n.x + pad} y1={titleY + 8} x2={n.x + n.w - pad} y2={titleY + 8} stroke="var(--color-hairline-light)" strokeWidth="0.6" />
      {fn && <text x={n.x + pad} y={fnY} className={styles.nFn}>{fn}</text>}
      {fnLine1 && <text x={n.x + pad} y={fnY} className={styles.nFn}>{fnLine1}</text>}
      {fnLine2 && <text x={n.x + pad} y={fnY + 16} className={styles.nFn}>{fnLine2}</text>}
      <text x={n.x + pad} y={relY} className={styles.nRel}>{rel}</text>
      <g transform={`translate(${n.x - 6}, ${n.y - 6})`}>
        <circle cx="17" cy="17" r="17" className={styles.badgeBg} />
        <g className={styles.badgeIcon}>{ICONS[id]}</g>
      </g>
    </g>
  );
}
