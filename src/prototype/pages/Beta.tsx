import { useState } from "react";
import type { PageProps } from "../ProtoApp";

const COMPARE = [
  { k: "COD RTO rate", hold: "31.0%", relay: "23.6%", delta: "−24%", good: true },
  { k: "Shopper replied to confirmation", hold: "—", relay: "72%", delta: "", good: true },
  { k: "Bad addresses fixed before dispatch", hold: "—", relay: "61%", delta: "", good: true },
  { k: "Genuine orders lost (cancelled by mistake)", hold: "0%", relay: "1.2%", delta: "+1.2 pts", good: true },
  { k: "WhatsApp opt-outs", hold: "—", relay: "0.6%", delta: "", good: true },
];

const GATE = [
  { k: "RTO lower than holdout", target: "≥ 15%", actual: "24%" },
  { k: "Genuine orders lost", target: "< 2%", actual: "1.2%" },
  { k: "Shopper reply rate", target: "≥ 60%", actual: "72%" },
  { k: "Opt-outs", target: "< 1%", actual: "0.6%" },
  { k: "Merchants ready to pay", target: "≥ 10 of 18", actual: "13 of 18" },
];

const LEARN = [
  { t: "Hinglish beats English", d: "+9 pts reply rate in Tier 2/3. Make it the default there." },
  { t: "Call at 2h, not 4h", d: "Voice reach drops sharply after 3 hours. Change the default." },
  { t: "“When will it arrive?”", d: "Top shopper question after confirming. Add delivery-day heads-up in M3." },
  { t: "Couriers miss confirmed orders", d: "8% of confirmed orders still failed at the door. Build rescue in M3." },
];

export function BetaPage({ go }: PageProps) {
  const [approved, setApproved] = useState(false);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 18 }}>
      {/* Experiment */}
      <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
        <div className="panel-h">
          <div>
            <div className="panel-t">Experiment · COD confirm + address fix</div>
            <div className="caption">18 beta merchants · 6 weeks · 41,200 COD orders</div>
          </div>
          <span className="pill success" style={{ fontSize: 11 }}>Completed</span>
        </div>
        <div style={{ padding: "14px 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--mist)", border: "1px solid var(--line)" }}>
            <div className="caption">Holdout · 20% of orders</div>
            <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 2 }}>No Relay messages. Business as usual.</div>
          </div>
          <div style={{ padding: "12px 14px", borderRadius: 10, background: "var(--pale)", border: "1px solid var(--blue-20)" }}>
            <div className="caption" style={{ color: "var(--blue)" }}>Relay · 80% of orders</div>
            <div style={{ fontSize: 13, color: "var(--slate)", marginTop: 2 }}>Confirm, fix address, voice fallback.</div>
          </div>
        </div>
        <div className="tbl" style={{ padding: "0 4px" }}>
          <div className="tr h" style={{ gridTemplateColumns: "1.8fr 90px 90px 90px" }}>
            <span>Metric</span><span>Holdout</span><span>Relay</span><span>Change</span>
          </div>
          {COMPARE.map((r) => (
            <div key={r.k} className="tr" style={{ gridTemplateColumns: "1.8fr 90px 90px 90px" }}>
              <span style={{ color: "var(--ink)" }}>{r.k}</span>
              <span>{r.hold}</span>
              <b style={{ color: "var(--navy)" }}>{r.relay}</b>
              <span style={{ color: r.delta.startsWith("−") ? "#067647" : "var(--grey)", fontWeight: 600 }}>{r.delta}</span>
            </div>
          ))}
        </div>
        <div style={{ margin: "auto 18px 16px", paddingTop: 14 }}>
          <div className="dr-h">What we'll change before scaling</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {LEARN.map((l) => (
              <div key={l.t} style={{ padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--navy)" }}>{l.t}</div>
                <div style={{ fontSize: 12.5, color: "var(--slate)", marginTop: 2, lineHeight: "18px" }}>{l.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gate */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div className="panel">
          <div className="panel-h">
            <div className="panel-t">Go / no-go gate</div>
            <span className="caption">Agreed before the beta started</span>
          </div>
          <div style={{ padding: "6px 18px 14px" }}>
            {GATE.map((g) => (
              <div key={g.k} style={{ display: "grid", gridTemplateColumns: "22px 1fr 80px 80px", alignItems: "center", padding: "9px 0", borderBottom: "1px solid var(--line)", fontSize: 13 }}>
                <span style={{ color: "#067647", fontWeight: 700 }}>✓</span>
                <span style={{ color: "var(--ink)" }}>{g.k}</span>
                <span style={{ color: "var(--grey)" }}>{g.target}</span>
                <b style={{ color: "var(--navy)", textAlign: "right" }}>{g.actual}</b>
              </div>
            ))}
            <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, background: "var(--success-bg)" }}>
              <div style={{ fontSize: 12, color: "#05603a", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em" }}>Decision</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "#05603a", marginTop: 2 }}>GO: all 5 criteria met</div>
              <div style={{ fontSize: 13, color: "#05603a", marginTop: 2 }}>If any had failed, we'd iterate on M1 instead of building more.</div>
            </div>
          </div>
          <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn-secondary" style={{ height: 34, fontSize: 13 }} onClick={() => go("rescue")}>See what's next (M3) →</button>
            <button className="btn-primary" style={{ height: 34, fontSize: 13 }} onClick={() => setApproved(true)}>{approved ? "✓ Rolled out" : "Roll out to all merchants"}</button>
          </div>
        </div>
        <div className="panel" style={{ padding: "14px 18px" }}>
          <div className="dr-h">Merchant voice</div>
          <div style={{ fontSize: 13.5, color: "var(--ink)", lineHeight: "20px" }}>“We stopped shipping 1 in 10 orders that would have come back. The Hindi call is what sold my ops team.”</div>
          <div className="caption" style={{ marginTop: 6 }}>Founder, ethnic-wear D2C brand · 9K orders/month</div>
        </div>
      </div>
      {approved && <div className="toast">✓ Confirm flow rolled out to all merchants · rescue build starts (M3)</div>}
    </div>
  );
}
