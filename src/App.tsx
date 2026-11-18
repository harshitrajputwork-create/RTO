import { useCallback, useEffect, useState } from "react";
import { SLIDES } from "./slides";

function getIndexFromHash() {
  const n = parseInt(window.location.hash.replace("#", ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= SLIDES.length ? n - 1 : 0;
}

export default function App() {
  const [index, setIndex] = useState(getIndexFromHash);
  const [scale, setScale] = useState(1);
  const [navHidden, setNavHidden] = useState(false);

  const go = useCallback((i: number) => {
    const next = Math.max(0, Math.min(SLIDES.length - 1, i));
    setIndex(next);
    window.history.replaceState(null, "", `#${next + 1}`);
  }, []);

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1600, window.innerHeight / 900));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowRight" || e.key === "PageDown") go(index + 1);
      else if (e.key === "ArrowLeft" || e.key === "PageUp") go(index - 1);
      else if (e.key.toLowerCase() === "h") setNavHidden((v) => !v);
      else if (e.key.toLowerCase() === "f") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
        else document.exitFullscreen?.();
      }
    };
    const onHash = () => setIndex(getIndexFromHash());
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [index, go]);

  const Current = SLIDES[index].component;

  return (
    <div className="stage">
      <div className="canvas" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        <Current key={index} page={index + 1} total={SLIDES.length} />
      </div>
      <div className={`nav ${navHidden ? "hidden" : ""}`}>
        <button onClick={() => go(index - 1)} aria-label="Previous">‹</button>
        <div className="dots">
          {SLIDES.map((s, i) => (
            <span key={s.id} className={i === index ? "on" : ""} title={s.title} onClick={() => go(i)} />
          ))}
        </div>
        <div className="label">{index + 1} / {SLIDES.length}</div>
        <button onClick={() => go(index + 1)} aria-label="Next">›</button>
      </div>
    </div>
  );
}
