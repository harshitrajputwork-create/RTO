import { useEffect, useState, type ComponentType } from "react";
import { Logo } from "../slides/Slide";
import { SetupPage } from "./pages/Setup";
import { ConfirmLivePage, RescueLivePage } from "./pages/Live";
import { InsightsPage } from "./pages/Insights";
import { RulesPage } from "./pages/Rules";

export type PageProps = { go: (id: string) => void };

type Chapter = {
  id: string;
  label: string;
  month: string;
  sub: string;
  title: string;
  lead: string;
  component: ComponentType<PageProps>;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "setup", label: "Set up the flow", month: "M1", sub: "Merchant, one-time",
    title: "COD confirmation flow", lead: "Merchant sets it up once. Every new COD order runs through it automatically.",
    component: SetupPage,
  },
  {
    id: "confirm", label: "COD confirmation", month: "M1", sub: "Live · shopper + merchant",
    title: "COD confirmation · live", lead: "Every COD order confirmed and cleaned before it ships.",
    component: ConfirmLivePage,
  },
  {
    id: "rescue", label: "Failed deliveries", month: "M3", sub: "Live · NDR rescue",
    title: "Failed-delivery rescue · live", lead: "Courier failed? Reach the shopper in minutes and re-attempt before the parcel comes back.",
    component: RescueLivePage,
  },
  {
    id: "insights", label: "Insights", month: "M4", sub: "Where RTO comes from",
    title: "RTO insights", lead: "Three months of data tell us which pincodes, products and ads create RTO.",
    component: InsightsPage,
  },
  {
    id: "rules", label: "Rules + growth", month: "M5", sub: "Prepaid nudge for risky orders",
    title: "Risk rules + prepaid nudge", lead: "Nudge only risky orders to prepaid. Everyone else keeps one-tap COD.",
    component: RulesPage,
  },
];

function idFromHash() {
  const h = window.location.hash.replace("#", "");
  return CHAPTERS.some((c) => c.id === h) ? h : CHAPTERS[0].id;
}

export default function ProtoApp() {
  const [active, setActive] = useState(idFromHash);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    fit();
    window.addEventListener("resize", fit);
    const onHash = () => setActive(idFromHash());
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  const go = (id: string) => {
    setActive(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const idx = CHAPTERS.findIndex((c) => c.id === active);
  const ch = CHAPTERS[idx];
  const Page = ch.component;
  const next = CHAPTERS[idx + 1];

  return (
    <div className="stage">
      <div className="canvas app" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <aside className="side">
          <div style={{ padding: "22px 22px 18px" }}><Logo size={28} /></div>
          <div className="store">
            <div className="store-ava">U</div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--navy)" }}>Urban Kurti</div>
              <div style={{ fontSize: 11.5, color: "var(--grey)" }}>Shopify · 9.8K orders/mo</div>
            </div>
          </div>
          <div className="side-label">Demo walkthrough</div>
          <nav className="side-nav">
            {CHAPTERS.map((c, i) => (
              <button key={c.id} className={`side-item ${c.id === active ? "on" : ""} ${i < idx ? "past" : ""}`} onClick={() => go(c.id)}>
                <span className="side-num">{i < idx ? "✓" : i + 1}</span>
                <span style={{ flex: 1, textAlign: "left" }}>
                  <span className="side-t">{c.label}</span>
                  <span className="side-s">{c.sub}</span>
                </span>
                <span className={`side-m ${c.month === "M1" ? "m1" : ""}`}>{c.month}</span>
              </button>
            ))}
          </nav>
          <div style={{ marginTop: "auto", padding: 16 }}>
            <div className="side-foot">
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--navy)" }}>Roadmap view</div>
              <div style={{ fontSize: 11.5, color: "var(--slate)", lineHeight: "17px", marginTop: 2 }}>
                M1 MVP → M3 rescue → M4 insights → M5 growth
              </div>
            </div>
            <a href="/#9" className="back-link">← Back to deck</a>
          </div>
        </aside>

        <main className="main">
          <header className="topbar">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className={`pill ${ch.month === "M1" ? "solid" : "navy"}`} style={{ fontSize: 12 }}>{ch.month === "M1" ? "MVP · Month 1" : `Month ${ch.month.slice(1)}`}</span>
                <h1 className="page-title">{ch.title}</h1>
              </div>
              <div className="page-lead">{ch.lead}</div>
            </div>
            {next ? (
              <button className="btn-secondary" onClick={() => go(next.id)}>Next: {next.label} →</button>
            ) : (
              <a className="btn-secondary" href="/#10" style={{ textDecoration: "none" }}>Back to deck: metrics →</a>
            )}
          </header>
          <div className="page" key={active}>
            <Page go={go} />
          </div>
        </main>
      </div>
    </div>
  );
}
