import { useState, type ReactNode } from "react";
import { StaticPhone, type StaticMsg } from "../../proto/Phone";
import type { PageProps } from "../ProtoApp";

type Lang = "English" | "Hinglish" | "Hindi";

const TEMPLATE: Record<Lang, { text: string; buttons: string[]; addr: string; remind: string }> = {
  English: {
    text: "Hi Priya 👋 Thanks for shopping with Urban Kurti!\n\n🧾 Order #1042 · Cotton kurta set\n💰 ₹1,299 · Cash on Delivery\n📍 14, Shanti Nagar, Jaipur 302006\n\nPlease confirm your order 👇",
    buttons: ["✅ Confirm order", "✏️ Change address", "❌ Cancel order"],
    addr: "We couldn't find a house / flat no. in your address. Can you share the full address?",
    remind: "Reminder 🙂 Your order is waiting. Tap to confirm, or we'll give you a quick call.",
  },
  Hinglish: {
    text: "Hi Priya 👋 Urban Kurti se shopping ke liye thanks!\n\n🧾 Order #1042 · Cotton kurta set\n💰 ₹1,299 · Cash on Delivery\n📍 14, Shanti Nagar, Jaipur 302006\n\nKya hum order confirm kar dein? 👇",
    buttons: ["✅ Haan, confirm", "✏️ Address badlo", "❌ Cancel karo"],
    addr: "Aapke address mein ghar / flat no. nahi mila. Poora address bhej dijiye?",
    remind: "Reminder 🙂 Aapka order wait kar raha hai. Confirm karein, warna hum ek call karenge.",
  },
  Hindi: {
    text: "नमस्ते प्रिया 👋 Urban Kurti से खरीदारी के लिए धन्यवाद!\n\n🧾 ऑर्डर #1042 · कॉटन कुर्ता सेट\n💰 ₹1,299 · कैश ऑन डिलीवरी\n📍 14, शांति नगर, जयपुर 302006\n\nकृपया अपना ऑर्डर कन्फ़र्म करें 👇",
    buttons: ["✅ कन्फ़र्म करें", "✏️ पता बदलें", "❌ कैंसल करें"],
    addr: "आपके पते में मकान / फ़्लैट नंबर नहीं मिला। कृपया पूरा पता भेजें।",
    remind: "रिमाइंडर 🙂 आपका ऑर्डर इंतज़ार कर रहा है। कन्फ़र्म करें, वरना हम कॉल करेंगे।",
  },
};

function Seg<T extends string>({ value, options, onChange }: { value: T; options: T[]; onChange: (v: T) => void }) {
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o} className={o === value ? "on" : ""} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button className={`toggle ${on ? "on" : ""}`} onClick={() => onChange(!on)} aria-pressed={on} />;
}

function Step({ icon, bg, wait, title, desc, right, off, last, children }: {
  icon: string; bg: string; wait?: string; title: string; desc: string; right?: ReactNode; off?: boolean; last?: boolean; children?: ReactNode;
}) {
  return (
    <div className="fb-step">
      <div className="fb-rail">
        <div className="fb-icon" style={{ background: bg }}>{icon}</div>
        {!last && <div className="fb-line" />}
      </div>
      <div className={`fb-card ${off ? "off" : ""}`}>
        {wait && <div className="fb-wait">{wait}</div>}
        <div className="fb-row">
          <div>
            <div className="fb-t">{title}</div>
            <div className="fb-d">{desc}</div>
          </div>
          {right}
        </div>
        {children && <div style={{ marginTop: 8 }}>{children}</div>}
      </div>
    </div>
  );
}

export function SetupPage({ go }: PageProps) {
  const [lang, setLang] = useState<Lang>("Hinglish");
  const [addrCheck, setAddrCheck] = useState(true);
  const [reminder, setReminder] = useState<"1h" | "2h" | "4h">("2h");
  const [voice, setVoice] = useState(true);
  const [voiceAfter, setVoiceAfter] = useState<"2h" | "4h" | "6h">("4h");
  const [fallback, setFallback] = useState<"Hold order" | "Ship anyway" | "Auto-cancel">("Hold order");
  const [preview, setPreview] = useState<"confirm" | "address" | "reminder">("confirm");
  const [live, setLive] = useState(false);

  const t = TEMPLATE[lang];
  const msgs: StaticMsg[] =
    preview === "confirm"
      ? [{ text: t.text, buttons: t.buttons }]
      : preview === "address"
      ? [{ text: t.text, buttons: t.buttons }, { me: true, text: t.buttons[1], time: "10:04" }, { text: t.addr, buttons: ["📝 Type address", "📍 Share location"], time: "10:04" }]
      : [{ text: t.text, buttons: t.buttons }, { sys: true, text: `No reply in ${reminder}` }, { text: t.remind, buttons: [t.buttons[0]], time: "12:02" }];

  const waCost = 0.12 * (1 + 0.45);
  const voiceCost = voice ? 0.22 * 2.5 : 0;
  const cost = waCost + voiceCost;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 330px 300px", gap: 22, height: "100%", position: "relative" }}>
      {/* Flow builder */}
      <div className="panel" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
        <div className="panel-h">
          <div>
            <div className="panel-t">Flow · COD order confirmation</div>
            <div className="caption">Runs on every new Cash-on-Delivery order</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="label">Language</span>
            <Seg value={lang} options={["English", "Hinglish", "Hindi"] as Lang[]} onChange={setLang} />
          </div>
        </div>
        <div style={{ padding: "16px 18px 6px", overflow: "hidden" }}>
          <Step icon="🛍️" bg="var(--navy-10)" title="Trigger: new COD order on Shopify" desc="Prepaid orders skip this flow" right={<span className="pill grey" style={{ fontSize: 11 }}>Shopify webhook</span>} />
          <Step icon="⭐" bg="var(--navy-10)" title="Skip trusted repeat buyers" desc="2+ delivered COD orders, no RTO → ships straight away" off
            right={<span className="pill grey" style={{ fontSize: 11 }} title="Month 4 · needs ~3 months of order history">Unlocks in M4</span>} />
          <Step icon="🔎" bg="var(--blue-10)" wait="Instantly" title="Address + phone check" desc="Missing house no. · invalid pincode · bad number" off={!addrCheck} right={<Toggle on={addrCheck} onChange={setAddrCheck} />} />
          <Step icon="💬" bg="var(--blue-10)" wait="After 2 min" title="WhatsApp confirmation" desc={`Template: COD confirm · ${lang}${addrCheck ? " · asks for missing address" : ""}`}
            right={<button className="btn-secondary" style={{ height: 30, fontSize: 12.5 }} onClick={() => setPreview("confirm")}>Preview</button>} />
          <Step icon="⏰" bg="var(--blue-10)" wait={`If no reply in ${reminder}`} title="Gentle reminder" desc="One reminder only, never spam"
            right={<div style={{ display: "flex", gap: 8, alignItems: "center" }}><Seg value={reminder} options={["1h", "2h", "4h"]} onChange={(v) => { setReminder(v); setPreview("reminder"); }} /></div>} />
          <Step icon="📞" bg="var(--mag-10)" wait={`If still no reply in ${voiceAfter}`} title="AI voice call" desc="Speaks the shopper's language · summary sent on WhatsApp" off={!voice}
            right={<div style={{ display: "flex", gap: 10, alignItems: "center" }}>{voice && <Seg value={voiceAfter} options={["2h", "4h", "6h"]} onChange={setVoiceAfter} />}<Toggle on={voice} onChange={setVoice} /></div>} />
          <Step icon="🛑" bg="var(--warning-bg)" wait="If unreachable after 12h" title="Fallback" desc="Merchant decides what happens to silent orders" last
            right={<select className="select" value={fallback} onChange={(e) => setFallback(e.target.value as typeof fallback)}>
              <option>Hold order</option><option>Ship anyway</option><option>Auto-cancel</option>
            </select>} />
        </div>
        <div style={{ marginTop: "auto", padding: "12px 18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="caption">Every step writes back to Shopify as an order tag · <b style={{ color: "var(--navy)" }}>relay-confirmed</b>, <b style={{ color: "var(--navy)" }}>relay-address-fixed</b>, <b style={{ color: "var(--navy)" }}>relay-cancelled</b></div>
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div className="seg">
          {(["confirm", "address", "reminder"] as const).map((p) => (
            <button key={p} className={preview === p ? "on" : ""} onClick={() => setPreview(p)}>
              {p === "confirm" ? "Confirmation" : p === "address" ? "Address ask" : "Reminder"}
            </button>
          ))}
        </div>
        <StaticPhone key={`${lang}-${preview}`} brand="Urban Kurti" messages={msgs} height={610} />
      </div>

      {/* Summary */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="panel" style={{ padding: 18 }}>
          <div className="dr-h">Cost per COD order</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--navy)" }}>₹{cost.toFixed(2)}</div>
          <div className="caption">vs ~₹340 lost on every RTO</div>
          <div style={{ marginTop: 12, display: "grid", gap: 6 }}>
            <div className="risk-row"><span>WhatsApp (utility)</span><b style={{ color: "var(--navy)" }}>₹{waCost.toFixed(2)}</b></div>
            <div className="risk-row"><span>Voice (≈22% of orders)</span><b style={{ color: "var(--navy)" }}>₹{voiceCost.toFixed(2)}</b></div>
          </div>
          <div className="caption" style={{ marginTop: 8 }}>Estimates for illustration</div>
        </div>
        <div className="panel" style={{ padding: 18 }}>
          <div className="dr-h">Guardrails built in</div>
          <ul className="bullets" style={{ gap: 7 }}>
            <li style={{ fontSize: 13.5, lineHeight: "20px" }}>Max 2 messages + 1 call per order</li>
            <li style={{ fontSize: 13.5, lineHeight: "20px" }}>Calls only 9 AM – 8 PM</li>
            <li style={{ fontSize: 13.5, lineHeight: "20px" }}>Silent orders: <b>{fallback.toLowerCase()}</b></li>
            <li style={{ fontSize: 13.5, lineHeight: "20px" }}>Holdout group for A/B (20%)</li>
          </ul>
        </div>
        <button className="btn-primary" style={{ height: 46, justifyContent: "center", fontSize: 15 }} onClick={() => { setLive(true); setTimeout(() => go("confirm"), 1100); }}>
          {live ? "✓ Flow is live" : "Go live"}
        </button>
      </div>

      {live && <div className="toast">✓ Flow live · new COD orders will be confirmed automatically</div>}
    </div>
  );
}
