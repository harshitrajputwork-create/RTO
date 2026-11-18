import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Scenario } from "./engine";
import { Phone } from "./Phone";
import { stepper } from "./stepper";

type Props = {
  scenarios: Scenario[];
  brand: string;
  hint: string;
  dashboard: (cursors: Record<string, number>, activeId: string) => ReactNode;
};

export function ProtoStage({ scenarios, brand, hint, dashboard }: Props) {
  const [activeId, setActiveId] = useState(scenarios[0].id);
  const [cursors, setCursors] = useState<Record<string, number>>(() =>
    Object.fromEntries(scenarios.map((s) => [s.id, -1]))
  );
  const active = scenarios.find((s) => s.id === activeId)!;
  const cursor = cursors[activeId];

  // first message appears on open
  useEffect(() => {
    if (cursors[activeId] === -1) setCursors((c) => ({ ...c, [activeId]: 0 }));
  }, [activeId, cursors]);

  const next = useCallback(() => {
    setCursors((c) => ({ ...c, [activeId]: Math.min(active.steps.length - 1, c[activeId] + 1) }));
  }, [activeId, active.steps.length]);

  const reset = () => setCursors((c) => ({ ...c, [activeId]: 0 }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key.toLowerCase() === "n") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next]);

  // expose to the global prev/next bar
  useEffect(() => {
    const i = scenarios.findIndex((s) => s.id === activeId);
    const c = Math.max(cursor, 0);
    stepper.stage = {
      label: `Scenario ${i + 1}/${scenarios.length} · step ${c + 1}/${active.steps.length}`,
      next: () => {
        if (c < active.steps.length - 1) { next(); return true; }
        if (i < scenarios.length - 1) { setActiveId(scenarios[i + 1].id); return true; }
        return false;
      },
      prev: () => {
        if (c > 0) { setCursors((cs) => ({ ...cs, [activeId]: c - 1 })); return true; }
        if (i > 0) { setActiveId(scenarios[i - 1].id); return true; }
        return false;
      },
    };
    stepper.notify();
  }, [activeId, cursor, scenarios, active, next]);
  useEffect(() => () => { stepper.stage = null; stepper.notify(); }, []);

  const pct = Math.round(((Math.max(cursor, 0) + 1) / active.steps.length) * 100);
  const done = cursor >= active.steps.length - 1;

  return (
    <div className="proto">
      <div>
        <div className="caption" style={{ textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 600, marginBottom: 10 }}>
          Scenarios
        </div>
        <div className="scn-list">
          {scenarios.map((s, i) => {
            const c = cursors[s.id];
            const finished = c >= s.steps.length - 1;
            return (
              <button key={s.id} className={`scn ${s.id === activeId ? "on" : ""}`} onClick={() => setActiveId(s.id)}>
                <div className="t">
                  <span>{i + 1}. {s.label}</span>
                  {finished ? <span className="pill success" style={{ fontSize: 11, padding: "0 8px" }}>Done</span> : null}
                </div>
                <div className="d">{s.desc}</div>
              </button>
            );
          })}
        </div>
        <div className="ctrl">
          <button className="btn-primary" onClick={next} disabled={done} style={{ opacity: done ? 0.5 : 1 }}>
            Next step ▸
          </button>
          <button className="btn-secondary" onClick={reset}>Reset</button>
        </div>
        <div className="progress"><div style={{ width: `${pct}%` }} /></div>
        <div className="caption" style={{ marginTop: 10 }}>{hint}</div>
      </div>
      <Phone scenario={active} cursor={Math.max(cursor, 0)} onNext={next} brand={brand} />
      {dashboard(cursors, activeId)}
    </div>
  );
}
