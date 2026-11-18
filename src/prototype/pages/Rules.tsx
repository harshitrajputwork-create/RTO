import { useState } from "react";
import { StaticPhone } from "../../proto/Phone";
import type { PageProps } from "../ProtoApp";

const fmt = (n: number) => n.toLocaleString("en-IN");

export function RulesPage(_: PageProps) {
  const [pinRto, setPinRto] = useState<"25%" | "30%" | "35%">("25%");
  const [firstOnly, setFirstOnly] = useState(true);
  const [minOrder, setMinOrder] = useState<"Any" | "₹999+" | "₹1,499+">("₹999+");
  const [discount, setDiscount] = useState<0 | 30 | 50 | 75>(50);
  const [partial, setPartial] = useState(false);
  const [saved, setSaved] = useState(false);

  // illustrative impact model
  const base = pinRto === "25%" ? 1680 : pinRto === "30%" ? 1120 : 640;
  const matched = Math.round(base * (firstOnly ? 0.62 : 1) * (minOrder === "Any" ? 1 : minOrder === "₹999+" ? 0.7 : 0.45));
  const shift = discount === 0 ? 0.08 : discount === 30 ? 0.16 : discount === 50 ? 0.22 : 0.27;
  const shiftAdj = partial ? shift + 0.1 : shift;
  const moved = Math.round(matched * shiftAdj);
  const rtoAvoided = Math.round(moved * 0.29);
  const discountCost = moved * discount;
  const net = rtoAvoided * 340 - discountCost;

  const pay = 1299 - discount;
  const msgs = [
    {
      text: "Hi Rahul 👋 Thanks for your order #1043!\n\n🧾 Printed palazzo · ₹1,299 (COD)\n📍 House 22, Lane 3, Bhilwara 311001\n\nPlease confirm 👇",
      buttons: ["✅ Confirm order"],
    },
    { me: true, text: "✅ Confirm order", time: "11:18" },
    {
      text:
        discount > 0
          ? `Confirmed ✅\n\n🎁 Pay online now and save ₹${discount}\n${partial ? "Or pay just ₹99 now, rest on delivery.\n" : ""}Faster dispatch, no cash needed at the door.`
          : `Confirmed ✅\n\nPrefer to pay online? It's faster and you won't need cash at the door.${partial ? "\nOr pay just ₹99 now, rest on delivery." : ""}`,
      buttons: [`💳 Pay ₹${fmt(pay)} now`, ...(partial ? ["🪙 Pay ₹99 now"] : []), "Keep Cash on Delivery"],
      time: "11:18",
    },
  ];

  const Seg = <T extends string | number>({ v, opts, on, fmtLabel }: { v: T; opts: T[]; on: (x: T) => void; fmtLabel?: (x: T) => string }) => (
    <div className="seg">
      {opts.map((o) => (
        <button key={String(o)} className={o === v ? "on" : ""} onClick={() => { on(o); setSaved(false); }}>{fmtLabel ? fmtLabel(o) : String(o)}</button>
      ))}
    </div>
  );

  const Cond = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: "grid", gridTemplateColumns: "60px 1fr", alignItems: "center", gap: 10, padding: "10px 12px", border: "1px solid var(--line)", borderRadius: 12, background: "#fff" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "var(--blue)" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 13.5, color: "var(--navy)", fontWeight: 500 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 330px 300px", gap: 22, height: "100%", position: "relative" }}>
      {/* Builder */}
      <div className="panel" style={{ display: "flex", flexDirection: "column" }}>
        <div className="panel-h">
          <div>
            <div className="panel-t">Rule · Nudge risky COD orders to prepaid</div>
            <div className="caption">Runs right after the shopper confirms</div>
          </div>
          <span className="pill grey" style={{ fontSize: 11 }}>Draft</span>
        </div>
        <div style={{ padding: 18, display: "grid", gap: 10, background: "var(--mist)", flex: 1, alignContent: "start" }}>
          <div className="dr-h" style={{ marginBottom: 0 }}>When</div>
          <Cond label="IF">Pincode RTO is above <Seg v={pinRto} opts={["25%", "30%", "35%"] as const as unknown as ("25%" | "30%" | "35%")[]} on={setPinRto} /></Cond>
          <Cond label="AND">
            First order from this customer
            <button className={`toggle ${firstOnly ? "on" : ""}`} onClick={() => { setFirstOnly(!firstOnly); setSaved(false); }} />
          </Cond>
          <Cond label="AND">Order value <Seg v={minOrder} opts={["Any", "₹999+", "₹1,499+"] as ("Any" | "₹999+" | "₹1,499+")[]} on={setMinOrder} /></Cond>

          <div className="dr-h" style={{ marginBottom: 0, marginTop: 8 }}>Then</div>
          <Cond label="DO">Offer online-payment discount <Seg v={discount} opts={[0, 30, 50, 75] as (0 | 30 | 50 | 75)[]} on={setDiscount} fmtLabel={(x) => (x === 0 ? "None" : `₹${x}`)} /></Cond>
          <Cond label="ALSO">
            Allow ₹99 token payment (partial COD)
            <button className={`toggle ${partial ? "on" : ""}`} onClick={() => { setPartial(!partial); setSaved(false); }} />
          </Cond>
          <Cond label="ELSE">Keep one-tap COD — no friction for everyone else</Cond>
        </div>
        <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="caption">Guardrail: auto-pause if COD conversion drops more than 1 pt</span>
          <button className="btn-primary" onClick={() => setSaved(true)}>{saved ? "✓ Rule active" : "Activate rule"}</button>
        </div>
      </div>

      {/* Preview */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <span className="pill navy">Shopper sees</span>
        <StaticPhone key={`${discount}-${partial}`} brand="Urban Kurti" messages={msgs} height={630} />
      </div>

      {/* Impact */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="panel" style={{ padding: 18 }}>
          <div className="dr-h">Estimated impact · per month</div>
          <div style={{ display: "grid", gap: 10, marginTop: 4 }}>
            <div className="risk-row"><span>Orders matching rule</span><b style={{ color: "var(--navy)" }}>{fmt(matched)}</b></div>
            <div className="risk-row"><span>Shift to prepaid</span><b style={{ color: "var(--navy)" }}>{Math.round(shiftAdj * 100)}% · {fmt(moved)}</b></div>
            <div className="risk-row"><span>RTOs avoided</span><b style={{ color: "var(--navy)" }}>{fmt(rtoAvoided)}</b></div>
            <div className="risk-row"><span>Discount cost</span><b style={{ color: "var(--navy)" }}>₹{fmt(discountCost)}</b></div>
          </div>
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 12, background: net > 0 ? "var(--success-bg)" : "var(--error-bg)" }}>
            <div className="caption">Net saving</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: net > 0 ? "#05603a" : "#912018" }}>₹{fmt(net)}</div>
          </div>
          <div className="caption" style={{ marginTop: 8 }}>Illustrative model · validated with holdout in M5</div>
        </div>
        <div className="panel" style={{ padding: 18 }}>
          <div className="dr-h">Also in Month 5</div>
          <ul className="bullets" style={{ gap: 7 }}>
            <li style={{ fontSize: 13.5, lineHeight: "20px" }}>Pincode-targeted campaigns</li>
            <li style={{ fontSize: 13.5, lineHeight: "20px" }}>Win back cancelled orders</li>
            <li style={{ fontSize: 13.5, lineHeight: "20px" }}>“Out for delivery” intent nudge</li>
          </ul>
        </div>
      </div>
      {saved && <div className="toast">✓ Rule active · applies to new orders from high-RTO pincodes</div>}
    </div>
  );
}
