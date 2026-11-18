import type { PageProps } from "../ProtoApp";

const GATE = [
  { k: "RTO lower than holdout", target: "≥ 15%", actual: "24%" },
  { k: "Genuine orders lost", target: "< 2%", actual: "1.2%" },
  { k: "Shopper reply rate", target: "≥ 60%", actual: "72%" },
  { k: "Opt-outs", target: "< 1%", actual: "0.6%" },
  { k: "Merchants ready to pay", target: "≥ 10/18", actual: "13/18" },
];

export function BetaPage({ go }: PageProps) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {/* The one question */}
      <div className="panel" style={{ padding: "22px 26px", display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 28 }}>
        <div>
          <div className="caption">Holdout · no messages</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "var(--grey)", lineHeight: 1.1 }}>31%</div>
          <div className="caption">COD RTO</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "var(--slate)" }}>18 merchants · 6 weeks</div>
          <div style={{ fontSize: 30, fontWeight: 700, color: "#067647" }}>−24%</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="caption" style={{ color: "var(--blue)" }}>With Relay</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: "var(--navy)", lineHeight: 1.1 }}>23.6%</div>
          <div className="caption">COD RTO</div>
        </div>
      </div>

      {/* Gate */}
      <div className="panel">
        <div className="panel-h">
          <div className="panel-t">Go / no-go gate</div>
          <span className="caption">Set before the beta started</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, padding: 16 }}>
          {GATE.map((g) => (
            <div key={g.k} style={{ padding: "12px 14px", borderRadius: 10, border: "1px solid var(--line)" }}>
              <div style={{ fontSize: 12.5, color: "var(--slate)", minHeight: 34 }}>{g.k}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)" }}>{g.actual} <span style={{ color: "#067647", fontSize: 16 }}>✓</span></div>
              <div className="caption">target {g.target}</div>
            </div>
          ))}
        </div>
        <div style={{ margin: "0 16px 16px", padding: "14px 18px", borderRadius: 10, background: "var(--success-bg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#05603a" }}>GO → build M3</div>
            <div style={{ fontSize: 13, color: "#05603a" }}>If it failed, we'd fix M1 first. Nothing else gets built.</div>
          </div>
          <button className="btn-primary" onClick={() => go("rescue")}>Next: Failed deliveries (M3) →</button>
        </div>
      </div>

      {/* Two learnings */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span className="caption" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>We learned</span>
        <span className="pill grey" style={{ fontSize: 13 }}>Hinglish gets +9 pts more replies</span>
        <span className="pill grey" style={{ fontSize: 13 }}>8% of confirmed orders still fail at the door → M3</span>
      </div>
    </div>
  );
}
