import { useCallback, useEffect, useState } from "react";
import { SLIDES } from "./slides";
import { Logo } from "./slides/Slide";

const SIDEBAR_W = 300;

function getIndexFromHash() {
  const n = parseInt(window.location.hash.replace("#", ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= SLIDES.length ? n - 1 : 0;
}

export default function App() {
  const [index, setIndex] = useState(getIndexFromHash);
  const [step, setStep] = useState(0);
  const [scale, setScale] = useState(1);
  const [chrome, setChrome] = useState(true); // sidebar + nav visible
  const [sideOpen, setSideOpen] = useState(true);
  const showSide = chrome && sideOpen;

  const go = useCallback((i: number, atStep = 0) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIndex(next);
    setStep(atStep);
    window.history.replaceState(null, "", `#${next + 1}`);
  }, []);

  const forward = useCallback(() => {
    const max = SLIDES[index]?.steps ?? 0;
    if (step < max) setStep(step + 1);
    else go(index + 1);
  }, [index, step, go]);

  const back = useCallback(() => {
    if (step > 0) setStep(step - 1);
    else if (index > 0) go(index - 1, SLIDES[index - 1].steps ?? 0);
  }, [index, step, go]);

  useEffect(() => {
    const fit = () => {
      const w = window.innerWidth - (showSide ? SIDEBAR_W : 0);
      setScale(Math.min(w / 1600, window.innerHeight / 900));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [showSide]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") forward();
      else if (e.key === "ArrowLeft" || e.key === "PageUp") back();
      else if (e.key.toLowerCase() === "h") setChrome((v) => !v);
      else if (e.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    const onHash = () => { setIndex(getIndexFromHash()); setStep(0); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [forward, back]);

  const safe = Math.min(index, SLIDES.length - 1);
  const def = SLIDES[safe];
  const Current = def.component;
  const groups = [...new Set(SLIDES.map((s) => s.group))];
  const maxSteps = def.steps ?? 0;

  return (
    <div className="stage">
      {showSide && (
        <aside className="deck-side">
          <div style={{ padding: "22px 22px 6px" }}><Logo size={26} /></div>
          <div style={{ padding: "0 22px 14px", fontSize: 12.5, color: "var(--grey)", lineHeight: "18px" }}>
            Cutting RTO for Shopify merchants · PM assignment
          </div>
          <nav className="deck-index">
            {groups.map((g) => (
              <div key={g}>
                <div className="di-group">{g}</div>
                {SLIDES.map((s, i) => s.group !== g ? null : (
                  <button key={s.id} className={`di-item ${i === safe ? "on" : ""} ${s.id === "live" ? "live" : ""}`} onClick={() => go(i)}>
                    <span className="di-num">{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ flex: 1 }}>
                      <span className="di-t">{s.title}{s.id === "live" ? " ↗" : ""}</span>
                      <span className="di-p">{s.purpose}</span>
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="deck-side-foot">
            <a href="/prototype/" className="btn-primary" style={{ width: "100%", justifyContent: "center", textDecoration: "none" }}>Open live prototype ↗</a>
            <div className="caption" style={{ marginTop: 10, lineHeight: "17px" }}>
              → next · ← back · <b>H</b> hide panels · <b>F</b> fullscreen
            </div>
          </div>
        </aside>
      )}
      <div className="deck-area" style={{ left: showSide ? SIDEBAR_W : 0 }}>
        <div className="canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
          <Current key={safe} page={safe + 1} total={SLIDES.length} step={step} />
        </div>
      </div>
      {chrome && (
        <button className="side-toggle" style={{ left: showSide ? SIDEBAR_W + 12 : 12 }} onClick={() => setSideOpen((v) => !v)} title="Toggle index">
          {showSide ? "‹" : "☰"}
        </button>
      )}
      <div className={`nav ${chrome ? "" : "hidden"}`} style={{ left: `calc(50% + ${showSide ? SIDEBAR_W / 2 : 0}px)` }}>
        <button onClick={back} aria-label="Previous">‹</button>
        <div className="label">
          {safe + 1} / {SLIDES.length}
          {maxSteps > 0 && <span style={{ opacity: 0.65 }}> · build {step + 1}/{maxSteps + 1}</span>}
        </div>
        <button onClick={forward} aria-label="Next">›</button>
      </div>
    </div>
  );
}
