import { useEffect, useRef, useState } from "react";
import type { Scenario, Step } from "./engine";
import "./phone.css";

type Props = {
  scenario: Scenario;
  cursor: number;
  onNext: () => void;
  brand: string;
};

export function Phone({ scenario, cursor, onNext, brand }: Props) {
  const steps = scenario.steps.slice(0, cursor + 1);
  const next: Step | undefined = scenario.steps[cursor + 1];
  const current = scenario.steps[cursor];
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [cursor, scenario.id]);

  const typed = next?.kind === "user" && !next.viaButton ? next.text : "";

  return (
    <div className="phone">
      <div className="phone-notch" />
      <div className="wa-header">
        <div className="wa-avatar">{brand[0]}</div>
        <div style={{ flex: 1 }}>
          <div className="wa-name">
            {brand} <span className="wa-verified">✓</span>
          </div>
          <div className="wa-sub">Business account · via Relay</div>
        </div>
        <span style={{ opacity: 0.9 }}>⋮</span>
      </div>

      <div className="wa-body" ref={scroller}>
        <div className="wa-day">Today</div>
        {steps.map((st, i) => {
          const isLastBot = st.kind === "bot" && i === steps.length - 1;
          if (st.kind === "sys") return <div key={i} className="wa-sys">{st.text}</div>;
          if (st.kind === "call")
            return (
              <div key={i} className="wa-callcard">
                <span className="wa-callicon">📞</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Voice call · AI agent</div>
                  <div style={{ fontSize: 11.5, color: "#667085" }}>Summary sent below · {st.lines?.length ?? 0} turns</div>
                </div>
              </div>
            );
          const mine = st.kind === "user";
          return (
            <div key={i} className={`wa-row ${mine ? "me" : ""}`}>
              <div className={`wa-bubble ${mine ? "me" : ""}`}>
                <div style={{ whiteSpace: "pre-line" }}>{st.text}</div>
                <div className="wa-time">{st.time ?? ""}{mine ? " ✓✓" : ""}</div>
                {st.buttons && (
                  <div className="wa-buttons">
                    {st.buttons.map((b) => {
                      const hot = isLastBot && next?.kind === "user" && next.viaButton && next.text === b;
                      return (
                        <button key={b} className={`wa-btn ${hot ? "hot" : ""}`} onClick={hot ? onNext : undefined}>
                          {b}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="wa-composer">
        <div className={`wa-input ${typed ? "typed" : ""}`}>{typed || "Message"}</div>
        <button className={`wa-send ${typed ? "hot" : ""}`} onClick={typed ? onNext : undefined}>➤</button>
      </div>

      {current?.kind === "call" && <CallOverlay key={`${scenario.id}-${cursor}`} lines={current.lines ?? []} brand={brand} />}
    </div>
  );
}

function CallOverlay({ lines, brand }: { lines: NonNullable<Step["lines"]>; brand: string }) {
  const [shown, setShown] = useState(0);
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setShown((n) => Math.min(lines.length, n + 1)), 1700);
    const c = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => { clearInterval(t); clearInterval(c); };
  }, [lines.length]);
  const ended = shown >= lines.length;
  return (
    <div className="call-overlay">
      <div className="call-top">
        <div className="call-ring">{brand[0]}</div>
        <div className="call-name">{brand}</div>
        <div className="call-state">{ended ? "Call ended · summary sent" : `AI voice agent · 0:${String(secs).padStart(2, "0")}`}</div>
      </div>
      <div className="call-lines">
        {lines.slice(0, shown).map((l, i) => (
          <div key={i} className={`call-line ${l.who}`}>
            <span className="call-who">{l.who === "ai" ? "AI agent" : "Customer"}</span>
            {l.text}
          </div>
        ))}
        {!ended && (
          <div className="call-typing"><span /><span /><span /></div>
        )}
      </div>
      <div className="call-actions">
        <span className="call-btn">🔇</span>
        <span className="call-btn end">✕</span>
        <span className="call-btn">🔊</span>
      </div>
    </div>
  );
}

export type StaticMsg = { me?: boolean; text: string; buttons?: string[]; time?: string; sys?: boolean };

/** Read-only phone used for template previews. */
export function StaticPhone({ brand, messages, height = 640 }: { brand: string; messages: StaticMsg[]; height?: number }) {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight });
  }, [messages]);
  return (
    <div className="phone" style={{ height }}>
      <div className="phone-notch" />
      <div className="wa-header">
        <div className="wa-avatar">{brand[0]}</div>
        <div style={{ flex: 1 }}>
          <div className="wa-name">{brand} <span className="wa-verified">✓</span></div>
          <div className="wa-sub">Business account · via Relay</div>
        </div>
        <span style={{ opacity: 0.9 }}>⋮</span>
      </div>
      <div className="wa-body" ref={body}>
        <div className="wa-day">Preview</div>
        {messages.map((m, i) =>
          m.sys ? (
            <div key={i} className="wa-sys">{m.text}</div>
          ) : (
            <div key={i} className={`wa-row ${m.me ? "me" : ""}`}>
              <div className={`wa-bubble ${m.me ? "me" : ""}`}>
                <div style={{ whiteSpace: "pre-line" }}>{m.text}</div>
                <div className="wa-time">{m.time ?? "10:02"}</div>
                {m.buttons && (
                  <div className="wa-buttons">
                    {m.buttons.map((b) => <span key={b} className="wa-btn" style={{ textAlign: "center" }}>{b}</span>)}
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
      <div className="wa-composer">
        <div className="wa-input">Message</div>
        <span className="wa-send" style={{ display: "grid", placeItems: "center" }}>➤</span>
      </div>
    </div>
  );
}
