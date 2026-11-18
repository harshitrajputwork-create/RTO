import { stateAt, type Scenario } from "./engine";
import { ProtoStage } from "./ProtoStage";
import { Logo } from "../slides/Slide";

const BRAND = "Urban Kurti";

export const RESCUE_SCENARIOS: Scenario[] = [
  {
    id: "notHome",
    label: "Not at home",
    desc: "Courier missed the shopper. Reschedule in chat.",
    customer: "Neha G.",
    steps: [
      {
        kind: "sys", time: "14:10", text: "Courier update: “Customer not available” · attempt 1",
        patch: { reason: "Customer not available", status: "NDR raised", tone: "error", sla: "47h left" },
        event: "NDR received from courier via shipping aggregator",
      },
      {
        kind: "bot", time: "14:12",
        text: "Hi Neha, our courier tried delivering your order #1031 today but couldn't reach you 😕\n\nYour parcel is safe. When should we try again?",
        buttons: ["📅 Tomorrow", "🗓️ Pick another day", "📍 Change address", "📞 Call me"],
        patch: { status: "Shopper contacted", tone: "warning" },
        event: "WhatsApp sent within 2 min of NDR",
      },
      { kind: "user", viaButton: true, text: "📅 Tomorrow", time: "14:20" },
      {
        kind: "bot", time: "14:20", text: "Sure! Which time works best?",
        buttons: ["🌅 Morning 9–12", "🌆 Evening 4–8"],
      },
      { kind: "user", viaButton: true, text: "🌆 Evening 4–8", time: "14:21" },
      {
        kind: "bot", time: "14:21",
        text: "Done ✅ Re-attempt tomorrow, 4–8 PM.\nPlease keep ₹1,799 ready — or skip the cash and pay online 👇",
        buttons: ["💳 Pay online"],
        patch: { status: "Rescued · re-attempt booked", tone: "success", action: "Tomorrow 4–8 PM", saved: 340 },
        event: "Re-attempt + time slot pushed to courier",
      },
    ],
  },
  {
    id: "fake",
    label: "Fake attempt",
    desc: "Courier says ‘refused’. Shopper says nobody came.",
    customer: "Imran A.",
    steps: [
      {
        kind: "sys", time: "17:45", text: "Courier update: “Customer refused” · attempt 1",
        patch: { reason: "Customer refused", status: "NDR raised", tone: "error", sla: "46h left" },
        event: "NDR received: refused",
      },
      {
        kind: "bot", time: "17:47",
        text: "Hi Imran, the courier marked order #1032 as “refused”.\nDid you refuse the delivery?",
        buttons: ["🙅 No, nobody came", "👍 Yes, I refused"],
        patch: { status: "Verifying with shopper", tone: "warning" },
        event: "Asked shopper to verify the courier's reason",
      },
      { kind: "user", viaButton: true, text: "🙅 No, nobody came", time: "17:50" },
      {
        kind: "bot", time: "17:50",
        text: "Really sorry about that 🙏 We've flagged it with the courier and booked a re-attempt for tomorrow.",
        patch: { status: "Rescued · courier flagged", tone: "success", action: "Re-attempt + dispute", saved: 340, flag: true },
        event: "Flagged: possible fake attempt → courier scorecard",
      },
    ],
  },
  {
    id: "callAddr",
    label: "Voice + new address",
    desc: "No WhatsApp reply. Call fixes the address.",
    customer: "Pooja V.",
    steps: [
      {
        kind: "sys", time: "12:05", text: "Courier update: “Address not found” · attempt 1",
        patch: { reason: "Address not found", status: "NDR raised", tone: "error", sla: "47h left" },
        event: "NDR received: address not found",
      },
      {
        kind: "bot", time: "12:07",
        text: "Hi Pooja, our courier couldn't find your address for order #1033 📍\nCan you share the correct one?",
        buttons: ["📝 Type address", "📍 Share location", "📞 Call me"],
        patch: { status: "Shopper contacted", tone: "warning" },
        event: "WhatsApp sent",
      },
      {
        kind: "sys", time: "14:07", text: "No reply in 2 hours → AI voice call",
        patch: { status: "Calling…", tone: "info" }, event: "Escalated to AI voice call",
      },
      {
        kind: "call", time: "14:08",
        lines: [
          { who: "ai", text: "Hello Pooja ji, aapka Urban Kurti ka parcel aaj deliver nahi ho paaya — address nahi mila." },
          { who: "cust", text: "Oh, ghar pe koi nahi hota. Office pe bhej do — Plot 7, Malviya Nagar, Jaipur." },
          { who: "ai", text: "Noted: Plot 7, Malviya Nagar. Kal office time mein deliver hoga. Thank you!" },
        ],
      },
      {
        kind: "bot", time: "14:10",
        text: "Thanks Pooja ji ✅ New address saved:\n🏢 Plot 7, Malviya Nagar, Jaipur 302017\n📦 Re-attempt: tomorrow, office hours",
        patch: { status: "Rescued · address changed", tone: "success", action: "New address, tomorrow", saved: 340 },
        event: "Address updated with courier + re-attempt booked",
      },
    ],
  },
];

const TONE: Record<string, string> = { warning: "warning", success: "success", error: "error", info: "blue" };

export function RescuePrototype() {
  return (
    <ProtoStage
      scenarios={RESCUE_SCENARIOS}
      brand={BRAND}
      hint="Rescue window: 24–48h before the courier returns the parcel."
      dashboard={(cursors, activeId) => <RescueDashboard cursors={cursors} activeId={activeId} />}
    />
  );
}

function RescueDashboard({ cursors, activeId }: { cursors: Record<string, number>; activeId: string }) {
  const rows = RESCUE_SCENARIOS.map((s, i) => {
    const c = cursors[s.id];
    const { state, events } = stateAt(s, c);
    return { id: s.id, order: `#${1031 + i}`, customer: s.customer, state, events };
  });
  const rescued = rows.filter((r) => String(r.state.status ?? "").startsWith("Rescued")).length;
  const saved = rows.reduce((a, r) => a + Number(r.state.saved ?? 0), 0);
  const flags = rows.filter((r) => r.state.flag).length;
  const active = rows.find((r) => r.id === activeId)!;
  const cols = "62px 0.9fr 1.2fr 1.5fr 0.8fr";

  return (
    <div className="dash">
      <div className="dash-top">
        <Logo size={22} />
        <div className="dash-tabs">
          <span className="dash-tab">COD confirmation</span>
          <span className="dash-tab on">Failed deliveries</span>
          <span className="dash-tab">Insights</span>
        </div>
        <span className="pill grey" style={{ fontSize: 11 }}>● Courier feed live</span>
      </div>
      <div className="kpis">
        <div className="kpi"><div className="l">Failed deliveries today</div><div className="v">42</div><div className="s">contacted in &lt; 5 min</div></div>
        <div className="kpi"><div className="l">Shopper reached</div><div className="v">78%</div><div className="s">WA 61% + voice 17%</div></div>
        <div className="kpi"><div className="l">Rescued</div><div className="v">{24 + rescued}</div><div className="s">re-attempt booked</div></div>
        <div className="kpi"><div className="l">RTO cost avoided</div><div className="v">₹{(8160 + saved).toLocaleString("en-IN")}</div><div className="s">{3 + flags} fake attempts flagged</div></div>
      </div>
      <div className="tbl">
        <div className="tr h" style={{ gridTemplateColumns: cols }}>
          <span>Order</span><span>Customer</span><span>Courier reason</span><span>Relay status</span><span>Window</span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className={`tr ${r.id === activeId ? "active" : ""}`} style={{ gridTemplateColumns: cols }}>
            <span style={{ fontWeight: 600, color: "var(--navy)" }}>{r.order}</span>
            <span>{r.customer}</span>
            <span style={{ color: "var(--slate)" }}>{r.state.reason ? String(r.state.reason) : "—"}</span>
            <span>
              {r.state.status ? (
                <span className={`pill ${TONE[String(r.state.tone)] ?? "grey"}`} style={{ fontSize: 11.5, padding: "1px 9px" }}>{String(r.state.status)}</span>
              ) : <span className="pill grey" style={{ fontSize: 11.5, padding: "1px 9px" }}>Waiting</span>}
            </span>
            <span style={{ color: String(r.state.status ?? "").startsWith("Rescued") ? "#067647" : "var(--warning)", fontWeight: 600 }}>
              {String(r.state.status ?? "").startsWith("Rescued") ? "Saved" : r.state.sla ? String(r.state.sla) : "—"}
            </span>
          </div>
        ))}
        <div className="tr" style={{ gridTemplateColumns: cols, opacity: 0.55 }}>
          <span style={{ fontWeight: 600 }}>#1029</span><span>Arjun P.</span><span>Customer not available</span>
          <span><span className="pill success" style={{ fontSize: 11.5, padding: "1px 9px" }}>Delivered on re-attempt</span></span><span>Saved</span>
        </div>
      </div>
      <div className="timeline">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span className="h4" style={{ fontSize: 14 }}>Activity · {active.order} {active.customer}</span>
          {active.state.action ? <span className="pill navy" style={{ fontSize: 11 }}>Next: {String(active.state.action)}</span> : null}
        </div>
        {active.events.map((e, i) => (
          <div key={i} className="tl-item">
            <span className="tm">{e.time}</span><span className="bul" /><span>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
