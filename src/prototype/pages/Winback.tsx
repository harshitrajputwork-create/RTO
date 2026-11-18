import { useState } from "react";
import { StaticPhone } from "../../proto/Phone";
import type { PageProps } from "../ProtoApp";

type Id = "winback" | "pincode";

const CAMPAIGNS: Record<Id, {
  name: string; goal: string; from: string;
  audience: { k: string; v: string }[]; size: string;
  msgs: { text: string; buttons?: string[]; me?: boolean; time?: string }[];
  results: { k: string; v: string }[];
}> = {
  winback: {
    name: "Win back cancelled orders",
    goal: "Turn ‘not now’ cancels into prepaid orders",
    from: "COD orders (M1): shoppers who cancelled in the confirm flow",
    audience: [
      { k: "Cancelled in confirm flow", v: "Last 30 days" },
      { k: "Reason", v: "Changed mind · ordered elsewhere" },
      { k: "Exclude", v: "Fake-flagged · opted out" },
    ],
    size: "412 shoppers",
    msgs: [
      { text: "Hi Aman 👋 Still thinking about the Cotton kurta set?\n\nIt's back in your size (M).\n🎁 Pay online today: ₹100 off + free shipping.", buttons: ["🛍 Shop now", "Not interested"], time: "11:00" },
      { me: true, text: "🛍 Shop now", time: "11:04" },
      { text: "Here's your link 👇\nurbankurti.in/c/aman-100\nOffer valid till midnight.", time: "11:04" },
    ],
    results: [
      { k: "Expected to reorder", v: "8–10% · ~37 orders" },
      { k: "Paid online", v: "100% (offer is prepaid-only)" },
      { k: "Cost", v: "₹0.8 per message" },
    ],
  },
  pincode: {
    name: "Prepaid offer for high-RTO pincodes",
    goal: "Shift risky areas to prepaid before they order",
    from: "RTO insights (M4): pincodes with RTO above 30%",
    audience: [
      { k: "Pincodes", v: "311001 Bhilwara · 243001 Bareilly" },
      { k: "Who", v: "Past buyers, opted in to offers" },
      { k: "Exclude", v: "Ordered in last 7 days" },
    ],
    size: "1,240 shoppers",
    msgs: [
      { text: "Festive drop is live in Bhilwara 🎉\n\nPrepaid orders ship in 24 hours + 10% off.\nNo cash needed at the door.", buttons: ["💳 Shop prepaid", "Stop offers"], time: "18:30" },
      { me: true, text: "💳 Shop prepaid", time: "18:41" },
      { text: "Your 10% code: BHL10 ✨\nurbankurti.in/festive", time: "18:41" },
    ],
    results: [
      { k: "Prepaid share in these pincodes", v: "18% → 30% target" },
      { k: "RTO in these pincodes", v: "34% → under 25%" },
      { k: "Cost", v: "₹0.8 per message" },
    ],
  },
};

export function WinbackPage(_: PageProps) {
  const [id, setId] = useState<Id>("winback");
  const [sent, setSent] = useState<Id | null>(null);
  const c = CAMPAIGNS[id];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 330px 300px", gap: 22 }}>
      <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
        <div className="panel-h">
          <div className="seg">
            <button className={id === "winback" ? "on" : ""} onClick={() => setId("winback")}>Win back cancels</button>
            <button className={id === "pincode" ? "on" : ""} onClick={() => setId("pincode")}>High-RTO pincodes</button>
          </div>
          <span className="pill grey" style={{ fontSize: 11 }}>{sent === id ? "Scheduled" : "Draft"}</span>
        </div>
        <div style={{ padding: 18, display: "grid", gap: 14, background: "var(--mist)", flex: 1, alignContent: "start" }}>
          <div>
            <div className="panel-t" style={{ fontSize: 16 }}>{c.name}</div>
            <div className="caption">{c.goal}</div>
          </div>
          <div style={{ padding: "10px 12px", borderRadius: 8, background: "#fff", border: "1px dashed var(--blue-40)", fontSize: 13, color: "var(--slate)" }}>
            <b style={{ color: "var(--blue)" }}>Audience comes from:</b> {c.from}
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: 10 }}>
            {c.audience.map((a, i) => (
              <div key={a.k} style={{ display: "grid", gridTemplateColumns: "60px 160px 1fr", gap: 10, padding: "10px 12px", borderTop: i ? "1px solid var(--line)" : "none", fontSize: 13.5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--blue)" }}>{i === 0 ? "WHO" : i === 1 ? "AND" : "NOT"}</span>
                <span style={{ color: "var(--slate)" }}>{a.k}</span>
                <b style={{ color: "var(--navy)", fontWeight: 600 }}>{a.v}</b>
              </div>
            ))}
            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", fontSize: 13.5 }}>
              <span style={{ color: "var(--slate)" }}>Audience size</span><b style={{ color: "var(--navy)" }}>{c.size}</b>
            </div>
          </div>
          <div className="dr-h" style={{ marginBottom: 0 }}>Guardrails</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Opted-in shoppers only", "Max 2 offers / month", "Approved WhatsApp template", "Auto-stop on ‘Stop’"].map((g) => (
              <span key={g} className="pill grey" style={{ fontSize: 12 }}>{g}</span>
            ))}
          </div>
        </div>
        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="caption">Sends tomorrow 11:00 AM · best reply window</span>
          <button className="btn-primary" onClick={() => setSent(id)}>{sent === id ? "✓ Scheduled" : "Schedule campaign"}</button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span className="pill navy">Shopper sees</span>
        <StaticPhone key={id} brand="Urban Kurti" messages={c.msgs} height={560} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="panel" style={{ padding: 18 }}>
          <div className="dr-h">Expected result</div>
          <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
            {c.results.map((r) => (
              <div key={r.k} className="risk-row" style={{ flexDirection: "column", gap: 2 }}>
                <span>{r.k}</span><b style={{ color: "var(--navy)", fontSize: 15 }}>{r.v}</b>
              </div>
            ))}
          </div>
          <div className="caption" style={{ marginTop: 10 }}>Illustrative · measured against a holdout, same as M2</div>
        </div>
        <div className="panel" style={{ padding: 18 }}>
          <div className="dr-h">The loop</div>
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--ink)" }}>
            {["Confirm flow catches cancels (M1)", "Insights find risky pincodes (M4)", "Rules + campaigns act on them (M5)", "RTO drops → feeds the next insight"].map((s, i) => (
              <div key={s} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--blue-10)", color: "var(--blue)", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center", flexShrink: 0 }}>{i + 1}</span>{s}
              </div>
            ))}
          </div>
        </div>
      </div>
      {sent === id && <div className="toast">✓ Campaign scheduled · {c.size} · tomorrow 11:00 AM</div>}
    </div>
  );
}
