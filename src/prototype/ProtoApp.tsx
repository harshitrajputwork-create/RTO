import { useEffect, useReducer, useRef, useState, type ComponentType } from "react";
import { stepper } from "../proto/stepper";
import { SetupPage } from "./pages/Setup";
import { ConfirmLivePage, RescueLivePage } from "./pages/Live";
import { InsightsPage } from "./pages/Insights";
import { RulesPage } from "./pages/Rules";
import { BetaPage } from "./pages/Beta";
import { WinbackPage } from "./pages/Winback";

export type PageProps = { go: (id: string) => void };

type Chapter = {
  id: string;
  nav: string;
  icon: string;
  crumb: string;
  title: string;
  lead: string;
  month: string;
  tag: string;
  phase: string;
  solves: string;
  guide: { what: string; try: string; why: string };
  component: ComponentType<PageProps>;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "setup", nav: "Confirmation flow", icon: "⚙", crumb: "Automations", month: "M1 · MVP", tag: "M1", phase: "Month 1 · MVP", solves: "Bad address / contact + fake orders",
    title: "COD confirmation flow", lead: "Runs automatically on every new Cash-on-Delivery order.",
    guide: {
      what: "The merchant's one-time setup. Every new COD order will run through this flow.",
      try: "Switch the language to Hindi, turn the voice call off and on, change the fallback rule. The phone preview and cost update live.",
      why: "Targets the two biggest controllable causes: bad addresses and unreachable shoppers. Costs about ₹0.72 per order vs ₹340 per RTO.",
    },
    component: SetupPage,
  },
  {
    id: "confirm", nav: "COD orders", icon: "☑", crumb: "RTO Suite", month: "M1 · MVP", tag: "M1", phase: "Month 1 · MVP", solves: "Bad address / contact + fake orders",
    title: "COD orders", lead: "Confirmed, fixed or cancelled before dispatch.",
    guide: {
      what: "Left: the shopper's WhatsApp. Right: what the merchant sees, updating live.",
      try: "Pick a scenario, then tap the glowing button in the chat (or press Space). Try #2 for a messy Hinglish address and #3 for the AI voice call. Click any order row for full details.",
      why: "Bad orders are caught before shipping, so cancelling costs ₹0. Moves confirmation rate and RTO on confirmed orders (target −25% vs holdout).",
    },
    component: ConfirmLivePage,
  },
  {
    id: "beta", nav: "Beta results", icon: "⚗", crumb: "RTO Suite", month: "M2 · Beta", tag: "M2", phase: "Month 2 · beta test + go/no-go gate", solves: "Does the MVP actually work?",
    title: "Beta results", lead: "Relay vs a holdout group, with the go/no-go decision.",
    guide: {
      what: "Month 2: the MVP runs with 15–20 beta merchants. 20% of orders get no messages (the holdout), so we can measure the real effect.",
      try: "Read the gate on the right: five pass/fail criteria agreed before the beta. Then see what we'll change before scaling.",
      why: "Nothing after this gets built unless the gate passes. Proves RTO drops without losing genuine orders.",
    },
    component: BetaPage,
  },
  {
    id: "rescue", nav: "Failed deliveries", icon: "↻", crumb: "RTO Suite", month: "M3", tag: "M3", phase: "Month 3 · after the M2 gate", solves: "Not reachable at the door",
    title: "Failed deliveries", lead: "Rescue the order inside the 24–48h window before it returns.",
    guide: {
      what: "The courier couldn't deliver. Relay reaches the shopper within minutes, before the parcel heads back.",
      try: "Run ‘Fake attempt’: the shopper says nobody came, so the courier gets flagged. Then ‘Voice + new address’.",
      why: "Saves orders already in transit. Moves NDR → delivered from 35% to 55%, and builds a courier scorecard.",
    },
    component: RescueLivePage,
  },
  {
    id: "insights", nav: "RTO insights", icon: "◔", crumb: "RTO Suite", month: "M4", tag: "M4", phase: "Month 4 · needs ~3 months of data", solves: "Where RTO comes from (pincode, product, courier)",
    title: "RTO insights", lead: "Last 90 days · all COD orders.",
    guide: {
      what: "After about 3 months of data: where RTO actually comes from.",
      try: "Click a red pincode, then ‘Create rule →’ to act on it.",
      why: "Turns RTO from a cost line into a map: pincode, product, ad source, courier. Feeds the Month 5 growth rules.",
    },
    component: InsightsPage,
  },
  {
    id: "rules", nav: "Prepaid nudge", icon: "⚑", crumb: "RTO Suite", month: "M5", tag: "M5", phase: "Month 5 · growth phase", solves: "Weak intent: COD with no skin in the game",
    title: "Prepaid nudge rules", lead: "Applied right after the shopper confirms.",
    guide: {
      what: "Nudge only risky orders to prepaid. Everyone else keeps one-tap COD.",
      try: "Change the discount, or turn on the ₹99 token. Watch the net saving: too big a discount stops paying for itself.",
      why: "Prepaid RTO is about 5% vs about 35% for COD. That's the biggest lever, used without hurting conversion.",
    },
    component: RulesPage,
  },
  {
    id: "winback", nav: "Win-back & offers", icon: "✦", crumb: "RTO Suite", month: "M5", tag: "M5", phase: "Month 5 · growth phase", solves: "Lost intent + risky pincodes",
    title: "Win-back & offers", lead: "WhatsApp campaigns built from what the RTO data showed.",
    guide: {
      what: "The insights turned into action: win back shoppers who cancelled, and offer prepaid deals in high-RTO pincodes.",
      try: "Switch between the two campaigns. The audience comes straight from M1 cancels and M4 hotspots.",
      why: "Closes the loop: catch → learn → act. RTO work starts driving revenue and prepaid share, not just saving cost.",
    },
    component: WinbackPage,
  },
];

const TIPS: Record<string, string> = {
  M1: "Month 1 · MVP: built first",
  M2: "Month 2 · beta test with 15–20 merchants + go/no-go gate",
  M3: "Month 3 · built only after the beta passes",
  M4: "Month 4 · needs ~3 months of order data",
  M5: "Month 5 · growth phase",
};

function idFromHash() {
  const h = window.location.hash.replace("#", "");
  return CHAPTERS.some((c) => c.id === h) ? h : CHAPTERS[0].id;
}

function readGuidePref() {
  try { return localStorage.getItem("relay-guide") !== "off"; } catch { return true; }
}

export default function ProtoApp() {
  const [active, setActive] = useState(idFromHash);
  const [guide, setGuide] = useState(readGuidePref);
  const [, bump] = useReducer((x: number) => x + 1, 0);
  stepper.notify = bump;

  const stepRef = useRef<(d: 1 | -1) => void>(() => {});

  useEffect(() => {
    const onHash = () => setActive(idFromHash());
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key.toLowerCase() === "g") setGuide((g) => !g);
      if (e.key === "ArrowRight") { e.preventDefault(); stepRef.current(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); stepRef.current(-1); }
    };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("hashchange", onHash); window.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    try { localStorage.setItem("relay-guide", guide ? "on" : "off"); } catch { /* ignore */ }
  }, [guide]);

  const go = (id: string) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0 });
  };

  const idx = CHAPTERS.findIndex((c) => c.id === active);
  const ch = CHAPTERS[idx];
  const Page = ch.component;
  const prev = CHAPTERS[idx - 1];
  const next = CHAPTERS[idx + 1];

  const step = (dir: 1 | -1) => {
    const st = stepper.stage;
    if (st && (dir === 1 ? st.next() : st.prev())) return;
    const target = CHAPTERS[idx + dir];
    if (target) go(target.id);
    else if (dir === 1) window.location.href = "/#10";
  };
  stepRef.current = step;

  const NavLink = ({ c }: { c: Chapter }) => (
    <button className={`side-link ${c.id === active ? "on" : ""}`} onClick={() => go(c.id)}>
      <span className="ic">{c.icon}</span>{c.nav}
      <span className={`mtag ${c.tag === "M1" ? "mvp" : c.tag === "M2" ? "beta" : ""}`} data-tip={TIPS[c.tag]}>{c.tag}</span>
    </button>
  );
  const Dim = ({ icon, label }: { icon: string; label: string }) => (
    <div className="side-link dim"><span className="ic">{icon}</span>{label}</div>
  );

  return (
    <div className="app">
      <aside className="side">
        <div className="side-brand">
          <span className="side-mark">r</span>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>relay</span>
        </div>
        <div className="side-store">
          <span className="ava">UK</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Urban Kurti</div>
            <div style={{ fontSize: 11.5, color: "#9fb2cf" }}>Shopify · Growth plan</div>
          </div>
        </div>
        <Dim icon="⌂" label="Home" />
        <Dim icon="✉" label="Inbox" />
        <Dim icon="📣" label="Campaigns" />
        <div className="side-sec">Automations</div>
        <NavLink c={CHAPTERS[0]} />
        <div className="side-sec">RTO Suite</div>
        {CHAPTERS.slice(1).map((c) => <NavLink key={c.id} c={c} />)}
        <div className="side-sec">Workspace</div>
        <Dim icon="☎" label="Voice agents" />
        <Dim icon="⚙" label="Settings" />
        <div className="side-bottom">
          <a href="/#9" style={{ color: "#bcd3f5", textDecoration: "none", fontWeight: 600 }}>← Back to deck</a>
          <div style={{ marginTop: 6 }}>Press <b style={{ color: "#fff" }}>G</b> to {guide ? "hide" : "show"} the guide</div>
        </div>
      </aside>

      <div className="main">
        <header className="appbar">
          <div className="search">⌕ <span>Search orders, customers, phone numbers…</span></div>
          <div style={{ flex: 1 }} />
          <span className="pill success" style={{ fontSize: 11.5 }}>● WhatsApp connected</span>
          <span className="pill grey" style={{ fontSize: 11.5 }}>● Shopify synced 1 min ago</span>
          <button className="icon-btn" title="Notifications">🔔</button>
          <span className="avatar">PS</span>
        </header>

        {guide && (
          <section className="guide" key={`g-${active}`}>
            <div>
              <div className="guide-step">Demo guide · {idx + 1} of {CHAPTERS.length} · {ch.month}</div>
              <div className="guide-title">{ch.nav}</div>
              <div className="guide-dots">
                {CHAPTERS.map((c, i) => <span key={c.id} className={i === idx ? "on" : ""} onClick={() => go(c.id)} title={c.nav} />)}
              </div>
            </div>
            <div><div className="guide-k">What you're seeing</div><div className="guide-v">{ch.guide.what}</div></div>
            <div><div className="guide-k">Try this</div><div className="guide-v">{ch.guide.try}</div></div>
            <div><div className="guide-k">Why it matters</div><div className="guide-v">{ch.guide.why}</div></div>
            <div className="guide-btns">
              {next ? <button className="guide-btn" onClick={() => go(next.id)}>Next: {next.nav} →</button>
                : <a className="guide-btn" href="/#10" style={{ textDecoration: "none", display: "grid", placeItems: "center" }}>Back to deck: metrics →</a>}
              <div style={{ display: "flex", gap: 6 }}>
                {prev && <button className="guide-btn ghost" style={{ flex: 1 }} onClick={() => go(prev.id)}>← Back</button>}
                <button className="guide-btn ghost" style={{ flex: 1 }} onClick={() => setGuide(false)}>Hide (G)</button>
              </div>
            </div>
          </section>
        )}

        <div className="page-head">
          <div>
            <div className="crumbs">{ch.crumb} / <b>{ch.nav}</b></div>
            <h1 className="page-title">{ch.title}</h1>
            <div className="page-lead">{ch.lead}</div>
          </div>
          <div className="ctx">
            <span className={`ctx-phase ${ch.tag === "M1" ? "mvp" : ""}`} title={TIPS[ch.tag]}>{ch.phase}</span>
            <span className="ctx-solves">Solves: <b>{ch.solves}</b></span>
          </div>
        </div>
        <div className="page" key={active}>
          <Page go={go} />
        </div>
      </div>

      <div className="stepbar">
        <button onClick={() => step(-1)} disabled={idx === 0 && !stepper.stage} title="Previous (←)">‹</button>
        <div className="stepbar-mid">
          <b>{idx + 1}/{CHAPTERS.length} · {ch.nav}</b>
          <span>{stepper.stage ? stepper.stage.label : ch.tag}</span>
        </div>
        <button className="fwd" onClick={() => step(1)} title="Next (→)">›</button>
      </div>

      {!guide && <button className="guide-pill" onClick={() => setGuide(true)}>Show guide (G)</button>}
    </div>
  );
}
