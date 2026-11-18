import { useState } from "react";
import { stateAt, type Scenario } from "./engine";
import { ProtoStage } from "./ProtoStage";

const BRAND = "Urban Kurti";

export const CONFIRM_SCENARIOS: Scenario[] = [
  {
    id: "happy",
    label: "Quick confirm",
    desc: "Shopper confirms in one tap. Order ships.",
    customer: "Priya S.",
    steps: [
      {
        kind: "bot", time: "10:02",
        text: "Hi Priya 👋 Thanks for shopping with Urban Kurti!\n\n🧾 Order #1042 · Cotton kurta set\n💰 ₹1,299 · Cash on Delivery\n📍 14, Shanti Nagar, Jaipur 302006\n\nPlease confirm your order 👇",
        buttons: ["✅ Confirm order", "✏️ Change address", "❌ Cancel order"],
        patch: { status: "Awaiting reply", tone: "warning" },
        event: "Confirmation sent on WhatsApp (2 min after order)",
      },
      { kind: "user", viaButton: true, text: "✅ Confirm order", time: "10:04" },
      {
        kind: "bot", time: "10:04",
        text: "Done! ✅ Your order is confirmed and ships today.\nWe'll message you on delivery day.",
        patch: { status: "Confirmed", tone: "success", tag: "relay-confirmed", ship: "Ready to ship" },
        event: "Confirmed by shopper · tag added in Shopify",
      },
    ],
  },
  {
    id: "address",
    label: "Messy address fix",
    desc: "Incomplete address + Hinglish reply. AI cleans it up.",
    customer: "Rahul M.",
    steps: [
      {
        kind: "bot", time: "11:15",
        text: "Hi Rahul 👋 Your order #1043 (₹899, COD) is almost ready.\n\nWe couldn't find a house / flat no. in your address:\n📍 “Near Hanuman mandir, Sector 4, Bhilwara 311001”\n\nCan you share the full address?",
        buttons: ["📝 Type full address", "📍 Share location"],
        patch: { status: "Address incomplete", tone: "warning" },
        event: "Address check: no house no. found · asked shopper",
      },
      { kind: "user", viaButton: true, text: "📝 Type full address", time: "11:16" },
      {
        kind: "user", viaButton: false, time: "11:17",
        text: "ghar no 22, gali 3, hanuman mandir ke peeche. office time me mat bhejna, shaam 6 ke baad",
      },
      {
        kind: "bot", time: "11:17",
        text: "Got it 👍 Here's your updated address:\n\n🏠 House 22, Lane 3, Behind Hanuman Mandir, Sector 4, Bhilwara 311001\n🕕 Delivery note: after 6 PM\n\nIs this correct?",
        buttons: ["✅ Yes, correct", "✏️ Edit again"],
        patch: { status: "Address updated", tone: "info" },
        event: "AI parsed reply → structured address + delivery note",
      },
      { kind: "user", viaButton: true, text: "✅ Yes, correct", time: "11:18" },
      {
        kind: "bot", time: "11:18",
        text: "Perfect, order confirmed ✅ We'll deliver after 6 PM.",
        patch: { status: "Confirmed · address fixed", tone: "success", tag: "relay-address-fixed", ship: "Ready to ship" },
        event: "Address + note synced to Shopify & courier label",
      },
    ],
  },
  {
    id: "voice",
    label: "No reply → voice call",
    desc: "WhatsApp ignored. AI voice agent calls in Hindi.",
    customer: "Sunita K.",
    steps: [
      {
        kind: "bot", time: "09:30",
        text: "Hi Sunita 👋 Please confirm your order #1044\n💰 ₹749 · Cash on Delivery\n📍 Ward 7, Rampur Road, Bareilly 243001",
        buttons: ["✅ Confirm order", "✏️ Change address", "❌ Cancel order"],
        patch: { status: "Awaiting reply", tone: "warning" },
        event: "Confirmation sent on WhatsApp",
      },
      { kind: "sys", text: "No reply in 2 hours · gentle reminder sent", time: "11:30", event: "No reply → reminder sent" },
      {
        kind: "bot", time: "11:30",
        text: "Reminder 🙂 Your order is waiting. Tap below to confirm, or we'll give you a quick call.",
        buttons: ["✅ Confirm order"],
      },
      {
        kind: "sys", time: "13:30", text: "Still no reply after 4 hours → AI voice call",
        patch: { status: "Calling…", tone: "info" }, event: "Escalated to AI voice call (Hindi)",
      },
      {
        kind: "call", time: "13:31",
        lines: [
          { who: "ai", text: "Namaste Sunita ji, main Urban Kurti se bol rahi hoon. Aapka ₹749 ka order confirm karna tha." },
          { who: "cust", text: "Haan haan, chahiye. Par kal ghar pe nahi hoon, parso bhejna." },
          { who: "ai", text: "Bilkul. Delivery Thursday ko schedule kar di hai. Dhanyavaad!" },
        ],
      },
      {
        kind: "bot", time: "13:33",
        text: "Thanks for confirming on call, Sunita ji ✅\n📦 Delivery: Thursday\nReply here anytime to change it.",
        patch: { status: "Confirmed on call", tone: "success", tag: "relay-voice-confirmed", ship: "Ship Thu" },
        event: "Confirmed on call · delivery date set to Thu",
      },
    ],
  },
  {
    id: "cancel",
    label: "Cancel before ship",
    desc: "Shopper doesn't want it. We cancel at ₹0 cost.",
    customer: "Aman T.",
    steps: [
      {
        kind: "bot", time: "15:40",
        text: "Hi Aman 👋 Please confirm your order #1045\n🧾 Silk dupatta · ₹1,099 · COD\n📍 B-12, Civil Lines, Kanpur 208001",
        buttons: ["✅ Confirm order", "✏️ Change address", "❌ Cancel order"],
        patch: { status: "Awaiting reply", tone: "warning" },
        event: "Confirmation sent on WhatsApp",
      },
      { kind: "user", viaButton: true, text: "❌ Cancel order", time: "15:42" },
      {
        kind: "bot", time: "15:42",
        text: "No problem. Could you tell us why?",
        buttons: ["Ordered by mistake", "Found it cheaper", "Will order later"],
      },
      { kind: "user", viaButton: true, text: "Ordered by mistake", time: "15:42" },
      {
        kind: "bot", time: "15:43",
        text: "Cancelled ✅ No charges. See you again soon!",
        patch: { status: "Cancelled pre-ship", tone: "error", tag: "relay-cancelled", ship: "Not shipped", saved: 340 },
        event: "Cancelled before dispatch · ~₹340 RTO cost avoided",
      },
    ],
  },
];

const TONE: Record<string, string> = { warning: "warning", success: "success", error: "error", info: "blue" };

export function ConfirmPrototype() {
  return (
    <ProtoStage
      scenarios={CONFIRM_SCENARIOS}
      brand={BRAND}
      hint="Tap the highlighted button in the chat, or press Space."
      dashboard={(cursors, activeId) => <ConfirmDashboard cursors={cursors} activeId={activeId} />}
    />
  );
}

function ConfirmDashboard({ cursors, activeId }: { cursors: Record<string, number>; activeId: string }) {
  const rows = CONFIRM_SCENARIOS.map((s, i) => {
    const c = cursors[s.id];
    const { state, events } = stateAt(s, c);
    return { id: s.id, order: `#${1042 + i}`, customer: s.customer, state, events };
  });
  const confirmed = rows.filter((r) => String(r.state.status ?? "").startsWith("Confirmed")).length;
  const fixed = rows.filter((r) => r.state.tag === "relay-address-fixed").length;
  const cancelled = rows.filter((r) => r.state.tag === "relay-cancelled").length;
  const saved = rows.reduce((a, r) => a + Number(r.state.saved ?? 0), 0);
  const active = rows.find((r) => r.id === activeId)!;
  const amounts: Record<string, string> = { happy: "₹1,299", address: "₹899", voice: "₹749", cancel: "₹1,099" };
  const [open, setOpen] = useState<string | null>(null);
  const openRow = rows.find((r) => r.id === open);

  return (
    <div className="dash" style={{ position: "relative" }}>
      <div className="dash-top">
        <span className="panel-t">COD orders · today</span>
        <div className="dash-tabs"><span className="dash-tab on">All</span><span className="dash-tab">Awaiting reply</span><span className="dash-tab">Confirmed</span><span className="dash-tab">Cancelled</span></div>
        <span className="pill grey" style={{ fontSize: 11 }}>● Shopify connected</span>
      </div>
      <div className="kpis">
        <div className="kpi"><div className="l">COD orders today</div><div className="v">248</div><div className="s">auto-messaged in 2 min</div></div>
        <div className="kpi"><div className="l">Confirmed</div><div className="v">{176 + confirmed}</div><div className="s">71% · WA + voice</div></div>
        <div className="kpi"><div className="l">Address fixed</div><div className="v">{22 + fixed}</div><div className="s">before dispatch</div></div>
        <div className="kpi"><div className="l">RTO cost avoided</div><div className="v">₹{(5440 + saved).toLocaleString("en-IN")}</div><div className="s">{16 + cancelled} cancelled pre-ship</div></div>
      </div>
      <div className="tbl">
        <div className="tr h" style={{ gridTemplateColumns: "70px 1fr 80px 1.4fr 1.1fr" }}>
          <span>Order</span><span>Customer</span><span>Amount</span><span>Relay status</span><span>Fulfilment</span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className={`tr click ${r.id === activeId ? "active" : ""}`} style={{ gridTemplateColumns: "70px 1fr 80px 1.4fr 1.1fr" }} onClick={() => setOpen(r.id)} title="Open order details">
            <span style={{ fontWeight: 600, color: "var(--navy)" }}>{r.order}</span>
            <span>{r.customer}</span>
            <span>{amounts[r.id]}</span>
            <span>
              {r.state.status ? (
                <span className={`pill ${TONE[String(r.state.tone)] ?? "grey"}`} style={{ fontSize: 11.5, padding: "1px 9px" }}>{String(r.state.status)}</span>
              ) : <span className="pill grey" style={{ fontSize: 11.5, padding: "1px 9px" }}>Queued</span>}
            </span>
            <span style={{ color: r.state.ship ? "var(--navy)" : "var(--grey)", fontWeight: r.state.ship ? 600 : 400 }}>
              {r.state.ship ? String(r.state.ship) : "On hold"}
            </span>
          </div>
        ))}
        <div className="tr" style={{ gridTemplateColumns: "70px 1fr 80px 1.4fr 1.1fr", opacity: 0.55 }}>
          <span style={{ fontWeight: 600 }}>#1041</span><span>Kavya R.</span><span>₹2,150</span>
          <span><span className="pill success" style={{ fontSize: 11.5, padding: "1px 9px" }}>Confirmed</span></span><span>Shipped</span>
        </div>
      </div>
      <div className="timeline">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span className="h4" style={{ fontSize: 14 }}>Activity · {active.order} {active.customer}</span>
          <button className="btn-secondary" style={{ height: 28, fontSize: 12 }} onClick={() => setOpen(active.id)}>Order details →</button>
        </div>
        {active.events.map((e, i) => (
          <div key={i} className="tl-item">
            <span className="tm">{e.time}</span><span className="bul" /><span>{e.text}</span>
          </div>
        ))}
      </div>
      {openRow && (
        <>
          <div className="drawer-back" onClick={() => setOpen(null)} />
          <OrderDrawer
            id={openRow.id} order={openRow.order} customer={openRow.customer} amount={amounts[openRow.id]}
            state={openRow.state} events={openRow.events} onClose={() => setOpen(null)}
          />
        </>
      )}
    </div>
  );
}

const DETAILS: Record<string, {
  item: string; city: string; risk: { k: string; v: string; tone: "error" | "warning" | "success" }[];
  addrOld?: string; addrNew?: string; note?: string;
}> = {
  happy: {
    item: "Cotton kurta set · 1", city: "Jaipur 302006",
    risk: [
      { k: "Pincode RTO (last 90 days)", v: "14% · low", tone: "success" },
      { k: "Customer history", v: "2 delivered, 0 RTO", tone: "success" },
      { k: "Address quality", v: "Complete", tone: "success" },
    ],
  },
  address: {
    item: "Printed palazzo · 1", city: "Bhilwara 311001",
    risk: [
      { k: "Pincode RTO (last 90 days)", v: "31% · high", tone: "error" },
      { k: "Customer history", v: "First order", tone: "warning" },
      { k: "Address quality", v: "No house no.", tone: "error" },
    ],
    addrOld: "Near Hanuman mandir, Sector 4, Bhilwara 311001",
    addrNew: "House 22, Lane 3, Behind Hanuman Mandir, Sector 4, Bhilwara 311001",
    note: "Deliver after 6 PM (from shopper's reply)",
  },
  voice: {
    item: "Cotton dupatta · 2", city: "Bareilly 243001",
    risk: [
      { k: "Pincode RTO (last 90 days)", v: "27% · medium", tone: "warning" },
      { k: "Customer history", v: "First order", tone: "warning" },
      { k: "WhatsApp", v: "No reply in 4h", tone: "warning" },
    ],
    note: "Deliver on Thursday (from AI call)",
  },
  cancel: {
    item: "Silk dupatta · 1", city: "Kanpur 208001",
    risk: [
      { k: "Pincode RTO (last 90 days)", v: "22% · medium", tone: "warning" },
      { k: "Customer history", v: "1 RTO before", tone: "error" },
      { k: "Cancel reason", v: "Ordered by mistake", tone: "warning" },
    ],
  },
};

function OrderDrawer({ id, order, customer, amount, state, events, onClose }: {
  id: string; order: string; customer: string; amount: string;
  state: Record<string, string | number | boolean>; events: { time: string; text: string }[]; onClose: () => void;
}) {
  const d = DETAILS[id];
  const call = CONFIRM_SCENARIOS.find((s) => s.id === id)?.steps.find((st) => st.kind === "call");
  const reached = events.some((e) => e.text.toLowerCase().includes("call"));
  return (
    <div className="drawer">
      <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--navy)" }}>{order} · {customer}</div>
          <div className="caption">{d.item} · {amount} COD · {d.city}</div>
        </div>
        <button onClick={onClose} style={{ fontSize: 18, color: "var(--grey)" }}>✕</button>
      </div>
      <div style={{ padding: "0 18px 12px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {state.status ? <span className={`pill ${TONE[String(state.tone)] ?? "grey"}`} style={{ fontSize: 11.5 }}>{String(state.status)}</span> : null}
        {state.tag ? <span className="pill navy" style={{ fontSize: 11.5 }}>Shopify tag: {String(state.tag)}</span> : null}
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        <div className="dr-sec">
          <div className="dr-h">Risk signals</div>
          {d.risk.map((r) => (
            <div key={r.k} className="risk-row">
              <span>{r.k}</span>
              <span className={`pill ${r.tone}`} style={{ fontSize: 11, padding: "0 8px" }}>{r.v}</span>
            </div>
          ))}
        </div>
        {d.addrOld && (
          <div className="dr-sec">
            <div className="dr-h">Address</div>
            <div className="addr old">{d.addrOld}</div>
            {state.tag === "relay-address-fixed" || String(state.status ?? "").includes("updated") ? (
              <div className="addr new">✓ {d.addrNew}</div>
            ) : <div className="caption" style={{ marginTop: 6 }}>Waiting for shopper…</div>}
          </div>
        )}
        {d.note && (state.ship || String(state.status ?? "").includes("updated")) ? (
          <div className="dr-sec">
            <div className="dr-h">Delivery note → courier label</div>
            <div style={{ fontSize: 13, color: "var(--navy)", fontWeight: 500 }}>🕕 {d.note}</div>
          </div>
        ) : null}
        {call && reached && (
          <div className="dr-sec">
            <div className="dr-h">AI call transcript · 0:48</div>
            {(call.lines ?? []).map((l, i) => (
              <div key={i} style={{ fontSize: 12.5, lineHeight: "18px", padding: "3px 0", color: l.who === "ai" ? "var(--slate)" : "var(--navy)" }}>
                <b style={{ fontWeight: 600 }}>{l.who === "ai" ? "AI: " : "Shopper: "}</b>{l.text}
              </div>
            ))}
          </div>
        )}
        <div className="dr-sec">
          <div className="dr-h">Timeline</div>
          {events.map((e, i) => (
            <div key={i} className="tl-item"><span className="tm">{e.time}</span><span className="bul" /><span>{e.text}</span></div>
          ))}
        </div>
      </div>
      <div style={{ padding: 14, borderTop: "1px solid var(--line)", display: "flex", gap: 8 }}>
        <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>
          {state.ship && state.ship !== "Not shipped" ? "Ship now" : "Hold order"}
        </button>
        <button className="btn-secondary" style={{ height: 40 }}>📞 Call manually</button>
      </div>
    </div>
  );
}
