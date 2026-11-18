import { useState } from "react";
import type { PageProps } from "../ProtoApp";

const WEEKS = [23.1, 22.8, 23.2, 22.6, 21.0, 19.9, 19.1, 18.4, 17.6, 17.1, 16.6, 16.1];

const PINCODES = [
  { pin: "311001", city: "Bhilwara", orders: 412, rto: 34 },
  { pin: "243001", city: "Bareilly", orders: 388, rto: 31 },
  { pin: "208001", city: "Kanpur", orders: 521, rto: 28 },
  { pin: "302006", city: "Jaipur", orders: 690, rto: 14 },
  { pin: "560034", city: "Bengaluru", orders: 812, rto: 9 },
];
const PRODUCTS = [
  { k: "Party wear lehenga", v: 33 },
  { k: "Silk dupatta", v: 26 },
  { k: "Printed palazzo", v: 19 },
  { k: "Cotton kurta set", v: 12 },
];
const SOURCES = [
  { k: "Instagram Reels ads", v: 36 },
  { k: "Influencer codes", v: 29 },
  { k: "Google Search", v: 15 },
  { k: "Organic / repeat", v: 8 },
];
const COURIERS = [
  { k: "Courier A", fake: 2.1, ndr: 61 },
  { k: "Courier B", fake: 6.8, ndr: 44 },
  { k: "Courier C", fake: 3.4, ndr: 55 },
];

function Trend() {
  const w = 460, h = 130, min = 14, max = 25;
  const pts = WEEKS.map((v, i) => [ (i / (WEEKS.length - 1)) * w, h - ((v - min) / (max - min)) * h ] as const);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const goLive = pts[3][0];
  return (
    <svg width={w} height={h + 22} style={{ overflow: "visible" }}>
      {[15, 20, 25].map((g) => {
        const y = h - ((g - min) / (max - min)) * h;
        return (
          <g key={g}>
            <line x1={0} x2={w} y1={y} y2={y} stroke="#E4E7EC" />
            <text x={-6} y={y + 4} fontSize="10.5" fill="#667085" textAnchor="end">{g}%</text>
          </g>
        );
      })}
      <line x1={goLive} x2={goLive} y1={0} y2={h} stroke="#A74091" strokeDasharray="4 4" />
      <text x={goLive + 6} y={12} fontSize="11" fill="#A74091" fontWeight={600}>Relay live</text>
      <path d={d} fill="none" stroke="#0056A5" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={5} fill="#0056A5" />
      <text x={w} y={h + 18} fontSize="10.5" fill="#667085" textAnchor="end">Week 12</text>
      <text x={0} y={h + 18} fontSize="10.5" fill="#667085">Week 1</text>
    </svg>
  );
}

function Bars({ rows, color, suffix = "%" }: { rows: { k: string; v: number }[]; color: string; suffix?: string }) {
  const max = Math.max(...rows.map((r) => r.v));
  return (
    <div>
      {rows.map((r, i) => (
        <div key={r.k} className="bar-row">
          <span style={{ color: "var(--ink)" }}>{r.k}</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${(r.v / max) * 100}%`, background: i === 0 ? color : "var(--blue-20)" }} /></div>
          <b style={{ color: "var(--navy)", textAlign: "right" }}>{r.v}{suffix}</b>
        </div>
      ))}
    </div>
  );
}

export function InsightsPage({ go }: PageProps) {
  const [sel, setSel] = useState<string | null>("311001");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gridTemplateRows: "auto 1fr", gap: 18, height: "100%" }}>
      {/* Trend */}
      <div className="panel" style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
        <div>
          <div className="dr-h">RTO rate · all orders · North Star</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 38, fontWeight: 700, color: "var(--navy)" }}>16.1%</span>
          </div>
          <div style={{ fontSize: 13, color: "#067647", fontWeight: 600 }}>▼ 7.0 pts since go-live</div>
          <div className="caption" style={{ marginTop: 2 }}>COD only: 31% → 22%</div>
          <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "var(--pale)" }}>
            <div className="caption">RTO cost saved · last 30 days</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>₹2.4L</div>
          </div>
        </div>
        <div style={{ paddingLeft: 26, paddingTop: 6 }}><Trend /></div>
      </div>

      {/* Source + product */}
      <div className="panel" style={{ padding: "16px 20px", display: "grid", gap: 14 }}>
        <div>
          <div className="dr-h">RTO by ad source</div>
          <Bars rows={SOURCES} color="var(--magenta)" />
        </div>
        <div>
          <div className="dr-h">RTO by product</div>
          <Bars rows={PRODUCTS} color="var(--blue)" />
        </div>
      </div>

      {/* Pincodes */}
      <div className="panel" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="panel-h">
          <div className="panel-t">RTO hotspots by pincode</div>
          <span className="caption">Click a pincode</span>
        </div>
        <div className="tbl" style={{ paddingTop: 6 }}>
          <div className="tr h" style={{ gridTemplateColumns: "90px 1fr 80px 1.6fr" }}>
            <span>Pincode</span><span>City</span><span>COD orders</span><span>RTO rate</span>
          </div>
          {PINCODES.map((p) => (
            <div key={p.pin} className={`tr click ${sel === p.pin ? "active" : ""}`} style={{ gridTemplateColumns: "90px 1fr 80px 1.6fr" }} onClick={() => setSel(p.pin)}>
              <b style={{ color: "var(--navy)" }}>{p.pin}</b><span>{p.city}</span><span>{p.orders}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="bar-track" style={{ flex: 1 }}><span className="bar-fill" style={{ display: "block", width: `${(p.rto / 34) * 100}%`, background: p.rto >= 25 ? "var(--error)" : p.rto >= 15 ? "var(--warning)" : "var(--success)" }} /></span>
                <b style={{ width: 36, textAlign: "right", color: "var(--navy)" }}>{p.rto}%</b>
              </span>
            </div>
          ))}
        </div>
        {sel && (() => {
          const p = PINCODES.find((x) => x.pin === sel)!;
          const risky = p.rto >= 25;
          return (
            <div style={{ margin: "auto 18px 16px", padding: "12px 14px", borderRadius: 12, background: risky ? "var(--error-bg)" : "var(--success-bg)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 13, color: risky ? "#912018" : "#05603a" }}>
                <b>{p.city} {p.pin}:</b> {risky ? `${p.rto}% RTO — 2.3× your average. Mostly first-time COD buyers from Reels ads.` : `Healthy at ${p.rto}%. No action needed.`}
              </div>
              {risky && <button className="btn-primary" style={{ height: 34, fontSize: 13, flexShrink: 0 }} onClick={() => go("rules")}>Create rule →</button>}
            </div>
          );
        })()}
      </div>

      {/* Couriers */}
      <div className="panel" style={{ padding: "16px 20px" }}>
        <div className="dr-h">Courier scorecard</div>
        <div className="tr h" style={{ gridTemplateColumns: "1fr 1fr 1fr", padding: "6px 0" }}>
          <span>Courier</span><span>Fake attempts</span><span>NDR → delivered</span>
        </div>
        {COURIERS.map((c) => (
          <div key={c.k} className="tr" style={{ gridTemplateColumns: "1fr 1fr 1fr", padding: "8px 0" }}>
            <b style={{ color: "var(--navy)" }}>{c.k}</b>
            <span><span className={`pill ${c.fake > 5 ? "error" : "grey"}`} style={{ fontSize: 11.5, padding: "0 8px" }}>{c.fake}%</span></span>
            <span>{c.ndr}%</span>
          </div>
        ))}
        <div className="caption" style={{ marginTop: 10 }}>Fake attempts = shopper said “nobody came” in the rescue flow. Used to negotiate or switch couriers.</div>
      </div>
    </div>
  );
}
