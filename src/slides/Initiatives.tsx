import type { ReactNode } from "react";
import { Slide, ChannelTag, type SlideProps } from "./Slide";
import { ConfirmPrototype } from "../proto/ConfirmProto";
import { RescuePrototype } from "../proto/RescueProto";

type NodeT = { t: string; s?: string; k?: "start" | "wa" | "voice" | "good" | "bad" | "hold" };

function N({ t, s, k }: NodeT) {
  return (
    <div className={`flow-node ${k ?? ""}`}>
      {t}
      {s && <span className="sub">{s}</span>}
    </div>
  );
}
const Down = () => <div className="arrow-d">↓</div>;
const Right = () => <div className="arrow-r">→</div>;

function Branch({ label, nodes }: { label: string; nodes: NodeT[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ textAlign: "center" }}>
        <span className="pill grey" style={{ fontSize: 12 }}>{label}</span>
      </div>
      <Down />
      {nodes.map((n, i) => (
        <div key={i} style={{ display: "contents" }}>
          <N {...n} />
          {i < nodes.length - 1 && <Down />}
        </div>
      ))}
    </div>
  );
}

function Flow({ top, branches }: { top: NodeT[]; branches: { label: string; nodes: NodeT[] }[] }) {
  return (
    <div className="card" style={{ background: "var(--mist)", border: "none", padding: 24, height: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${top.length * 2 - 1}, auto)`, justifyContent: "center", alignItems: "center", gap: 8 }}>
        {top.map((n, i) => (
          <div key={i} style={{ display: "contents" }}>
            <div style={{ width: 230 }}><N {...n} /></div>
            {i < top.length - 1 && <Right />}
          </div>
        ))}
      </div>
      <div style={{ position: "relative", margin: "10px 0 2px", height: 18 }}>
        <div style={{ position: "absolute", left: "50%", top: 0, height: 9, width: 2, background: "var(--blue-40)" }} />
        <div style={{ position: "absolute", left: "12.5%", right: "12.5%", top: 9, height: 2, background: "var(--blue-40)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${branches.length}, 1fr)`, gap: 14 }}>
        {branches.map((b) => <Branch key={b.label} {...b} />)}
      </div>
    </div>
  );
}

function Features({ items, title = "Key functionality" }: { items: { h: string; d: string }[]; title?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div className="h4">{title}</div>
      {items.map((f) => (
        <div key={f.h} className="card" style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 15.5, fontWeight: 600, color: "var(--navy)" }}>{f.h}</div>
          <div className="small" style={{ fontSize: 14, lineHeight: "20px" }}>{f.d}</div>
        </div>
      ))}
    </div>
  );
}

/* 07 — Initiative 1 detail */
export function Init1Slide(p: SlideProps) {
  return (
    <Slide {...p} eyebrow="Initiative 1 · MVP · Month 1" title={<>COD Confirm + <span className="grad-text">Address Fix</span></>}
      lead="Every COD order gets confirmed and cleaned before it ships. Bad orders die at ₹0 cost.">
      <div style={{ display: "grid", gridTemplateColumns: "2.1fr 1fr", gap: 28, height: "100%" }}>
        <Flow
          top={[
            { t: "COD order placed", s: "Shopify webhook", k: "start" },
            { t: "Auto checks", s: "House no. · pincode · phone" },
            { t: "WhatsApp confirmation", s: "within 2 min", k: "wa" },
          ]}
          branches={[
            { label: "Confirms", nodes: [{ t: "Tag: confirmed", s: "in Shopify" }, { t: "Ship", k: "good" }] },
            { label: "Address issue", nodes: [{ t: "AI reads reply", s: "Hinglish, free text, pin" }, { t: "Shopper OKs new address" }, { t: "Ship", k: "good" }] },
            { label: "Cancels", nodes: [{ t: "Capture reason" }, { t: "Cancel pre-ship", s: "₹0 RTO cost", k: "good" }] },
            { label: "No reply", nodes: [{ t: "Reminder at 2h", k: "wa" }, { t: "AI voice call at 4h", s: "local language", k: "voice" }, { t: "Still unreachable → hold", s: "merchant rule", k: "hold" }] },
          ]}
        />
        <Features items={[
          { h: "One-tap confirm", d: "Confirm · change address · cancel — buttons, not typing." },
          { h: "Address intelligence", d: "Flags missing house no. / bad pincode. AI turns messy replies into a clean address + delivery note." },
          { h: "Voice fallback", d: "No reply? AI calls in the shopper's language. Summary lands on WhatsApp." },
          { h: "Shopify sync + rules", d: "Tags orders. Merchant sets what ships, what waits." },
        ]} />
      </div>
    </Slide>
  );
}

function ProtoSlide({ p, eyebrow, title, children }: { p: SlideProps; eyebrow: string; title: ReactNode; children: ReactNode }) {
  return (
    <section className="slide soft" style={{ padding: "40px 64px 56px" }}>
      <div className="accent-strip" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 22 }}>
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="title" style={{ fontSize: 32, lineHeight: "40px" }}>{title}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="pill navy">Shopper view</span>
          <span className="pill blue">Merchant view</span>
        </div>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      <footer className="slide-footer" style={{ left: 64, right: 64, bottom: 20 }}>
        <span>Relay · clickable prototype</span>
        <span>{String(p.page).padStart(2, "0")} / {String(p.total).padStart(2, "0")}</span>
      </footer>
    </section>
  );
}

/* 08 — Prototype 1 */
export function Proto1Slide(p: SlideProps) {
  return (
    <ProtoSlide p={p} eyebrow="Prototype · Initiative 1" title="COD confirm + address fix, live">
      <ConfirmPrototype />
    </ProtoSlide>
  );
}

/* 09 — Initiative 2 detail */
export function Init2Slide(p: SlideProps) {
  return (
    <Slide {...p} eyebrow="Initiative 2 · Month 3" title={<>Failed-Delivery <span className="grad-text">Rescue</span></>}
      lead="When the courier fails, we have 24–48 hours. Reach the shopper fast, fix it, re-attempt.">
      <div style={{ display: "grid", gridTemplateColumns: "2.1fr 1fr", gap: 28, height: "100%" }}>
        <Flow
          top={[
            { t: "Courier marks failed", s: "NDR · attempt 1", k: "start" },
            { t: "Relay gets reason", s: "via shipping aggregator" },
            { t: "WhatsApp in < 5 min", s: "reason-specific message", k: "wa" },
          ]}
          branches={[
            { label: "Not at home", nodes: [{ t: "Pick day + time slot" }, { t: "Re-attempt booked", k: "good" }] },
            { label: "Address issue", nodes: [{ t: "New address or pin" }, { t: "Updated with courier" }, { t: "Re-attempt booked", k: "good" }] },
            { label: "“Refused” — not true", nodes: [{ t: "Shopper says nobody came" }, { t: "Flag fake attempt", s: "courier scorecard", k: "hold" }, { t: "Re-attempt booked", k: "good" }] },
            { label: "No reply", nodes: [{ t: "AI voice call at 2h", k: "voice" }, { t: "Outcome synced" }, { t: "Unreachable → let RTO go", k: "bad" }] },
          ]}
        />
        <Features items={[
          { h: "Courier feed → instant action", d: "NDR webhook triggers outreach in minutes, not next day." },
          { h: "Reason-aware flows", d: "Different message for not home, bad address, refused." },
          { h: "Fake-attempt detection", d: "Shopper contradicts courier → dispute + courier scorecard." },
          { h: "NDR queue for ops", d: "Countdown to RTO. Only unsolved cases need a human." },
        ]} />
      </div>
    </Slide>
  );
}

/* 10 — Prototype 2 */
export function Proto2Slide(p: SlideProps) {
  return (
    <ProtoSlide p={p} eyebrow="Prototype · Initiative 2" title="Failed-delivery rescue, live">
      <RescuePrototype />
    </ProtoSlide>
  );
}

/* 11 — Metrics */
export function MetricsSlide(p: SlideProps) {
  const Metric = ({ m, t, g = false }: { m: string; t: string; g?: boolean }) => (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "9px 0", borderTop: "1px solid var(--line)", alignItems: "center" }}>
      <span style={{ fontSize: 15.5, color: g ? "var(--slate)" : "var(--ink)" }}>{g && <span className="pill warning" style={{ fontSize: 11, padding: "0 7px", marginRight: 8 }}>Guardrail</span>}{m}</span>
      <span style={{ fontSize: 15.5, fontWeight: 600, color: "var(--navy)", whiteSpace: "nowrap" }}>{t}</span>
    </div>
  );
  return (
    <Slide {...p} eyebrow="Metrics" title="How we know it's working">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, height: "100%" }}>
        <div className="card" style={{ background: "var(--g3)", color: "#fff", border: "none", display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", opacity: 0.8 }}>North Star</div>
          <div style={{ fontSize: 30, lineHeight: "38px", fontWeight: 600, marginTop: 10 }}>COD RTO rate</div>
          <div style={{ fontSize: 15, opacity: 0.85, marginTop: 4 }}>% of shipped COD orders that come back</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 26 }}>
            <span style={{ fontSize: 46, fontWeight: 700 }}>30%</span>
            <span style={{ fontSize: 22, opacity: 0.7 }}>→</span>
            <span style={{ fontSize: 46, fontWeight: 700 }}>21%</span>
          </div>
          <div style={{ fontSize: 14, opacity: 0.8 }}>−30% for active merchants by Month 6</div>
          <div style={{ marginTop: "auto", display: "grid", gap: 8, fontSize: 14, lineHeight: "20px", color: "rgba(255,255,255,.88)" }}>
            <div>✓ It is the merchant's real pain</div>
            <div>✓ Comes from courier data, hard to game</div>
            <div>✓ Every initiative ladders into it</div>
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.15)" }}>
              Business proof: <b>₹ RTO cost saved / merchant / month</b>
            </div>
          </div>
        </div>
        <div className="card brand">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="h4">Initiative 1 · Confirm + fix</div><ChannelTag kind="wa" />
          </div>
          <div style={{ marginTop: 12 }}>
            <Metric m="Shopper reached (WA + voice)" t="≥ 85%" />
            <Metric m="Responded to confirmation" t="≥ 70%" />
            <Metric m="Flagged addresses fixed" t="≥ 60%" />
            <Metric m="Median time to confirm" t="< 2 hrs" />
            <Metric m="RTO on confirmed vs holdout" t="−25%" />
            <Metric m="Genuine orders lost" t="< 2%" g />
            <Metric m="Opt-outs per message" t="< 1%" g />
          </div>
        </div>
        <div className="card brand">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="h4">Initiative 2 · NDR rescue</div><ChannelTag kind="voice" />
          </div>
          <div style={{ marginTop: 12 }}>
            <Metric m="Contacted within 5 min of NDR" t="≥ 95%" />
            <Metric m="Shopper reached" t="≥ 75%" />
            <Metric m="NDR → delivered" t="35% → 55%" />
            <Metric m="Re-attempt within 24 hrs" t="≥ 80%" />
            <Metric m="Fake attempts flagged / courier" t="Tracked" />
            <Metric m="Cost per rescued order" t="< ₹15" g />
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* 12 — Risks + next */
export function CloseSlide(p: SlideProps) {
  const risks = [
    { r: "Feels like spam", m: "Max 2 messages + 1 call per order. Utility templates only." },
    { r: "Messaging + call cost eats ROI", m: "COD orders only. Voice only on no-reply. Price per outcome." },
    { r: "Merchants fear holding orders", m: "Default auto-ship. Merchant controls the rules." },
    { r: "Courier data gaps", m: "Start with the top 2 shipping aggregators, then expand." },
  ];
  return (
    <Slide {...p} variant="navy" eyebrow="Risks + what's next" title="What could break — and what comes after Month 6">
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 40, height: "100%" }}>
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          {risks.map((x) => (
            <div key={x.r} style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18, padding: "16px 20px", borderRadius: 14, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)" }}>
              <span style={{ fontWeight: 600, fontSize: 17 }}>{x.r}</span>
              <span style={{ fontSize: 15.5, color: "rgba(255,255,255,.85)" }}>→ {x.m}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="h4" style={{ color: "#fff" }}>After Month 6</div>
          <ul className="bullets" style={{ marginTop: 12 }}>
            <li>Cross-merchant serial-refuser signal</li>
            <li>Courier allocation by pincode (partner)</li>
            <li>Prepaid-first checkout for risky pincodes</li>
            <li>Beyond Shopify: WooCommerce, custom stores</li>
          </ul>
          <div style={{ marginTop: "auto", padding: "22px 24px", borderRadius: 16, background: "var(--g2)" }}>
            <div style={{ fontSize: 24, fontWeight: 600, lineHeight: "32px" }}>Fix the biggest leak first.<br />Prove it. Then scale.</div>
            <div style={{ fontSize: 15, opacity: 0.85, marginTop: 8 }}>Thank you.</div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* Launch — opens the live prototype app */
export function LaunchSlide(p: SlideProps) {
  const chapters = [
    { n: 1, t: "Set up the flow", d: "Language, timing, voice fallback, cost per order", m: "M1" },
    { n: 2, t: "COD confirmation, live", d: "Shopper chat + merchant dashboard + order details", m: "M1" },
    { n: 3, t: "Failed-delivery rescue, live", d: "Not home · fake attempt · new address on call", m: "M3" },
    { n: 4, t: "Insights", d: "RTO by pincode, product, ad source, courier", m: "M4" },
    { n: 5, t: "Rules + growth", d: "Prepaid nudge only for risky orders", m: "M5" },
  ];
  return (
    <section className="slide" style={{ background: "var(--g4)" }}>
      <div className="accent-strip" />
      <div className="eyebrow fade-up">Live prototype</div>
      <h1 className="title fade-up">Let's see it <span className="grad-text">working</span></h1>
      <p className="lead fade-up">Not wireframes on a slide: a clickable product, walked through in roadmap order.</p>
      <div className="body fade-up" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 48, alignItems: "center" }}>
        <div style={{ display: "grid", gap: 12 }}>
          {chapters.map((c) => (
            <a key={c.n} href={`/prototype/#${["setup", "confirm", "rescue", "insights", "rules"][c.n - 1]}`}
              style={{ textDecoration: "none", display: "grid", gridTemplateColumns: "44px 1fr auto", gap: 16, alignItems: "center", padding: "14px 18px", background: "#fff", borderRadius: 14, border: "1px solid rgba(0,86,165,.13)", boxShadow: "var(--shadow-1)" }}>
              <span style={{ width: 40, height: 40, borderRadius: "50%", background: c.m === "M1" ? "var(--g1)" : "var(--blue-10)", color: c.m === "M1" ? "#fff" : "var(--blue)", display: "grid", placeItems: "center", fontWeight: 600 }}>{c.n}</span>
              <span>
                <span style={{ display: "block", fontSize: 18, fontWeight: 600, color: "var(--navy)" }}>{c.t}</span>
                <span style={{ display: "block", fontSize: 14, color: "var(--slate)" }}>{c.d}</span>
              </span>
              <span className={`pill ${c.m === "M1" ? "blue" : "grey"}`}>{c.m}</span>
            </a>
          ))}
        </div>
        <div style={{ textAlign: "center" }}>
          <a href="/prototype/#setup" className="btn-primary" style={{ height: 64, padding: "0 36px", fontSize: 20, borderRadius: 12, textDecoration: "none", display: "inline-flex" }}>
            Open live prototype →
          </a>
          <div className="caption" style={{ marginTop: 14 }}>Opens the Relay merchant app · “Back to deck” returns here</div>
        </div>
      </div>
      <footer className="slide-footer">
        <span>Relay · RTO mandate</span>
        <span>{String(p.page).padStart(2, "0")} / {String(p.total).padStart(2, "0")}</span>
      </footer>
    </section>
  );
}
