export type CallLine = { who: "ai" | "cust"; text: string };

export type Step = {
  kind: "bot" | "user" | "sys" | "call";
  text?: string;
  buttons?: string[];
  /** user step: tapped a quick-reply button (true) or typed (false) */
  viaButton?: boolean;
  lines?: CallLine[];
  time?: string;
  /** merchant-side order patch applied when this step is reached */
  patch?: Record<string, string | number | boolean>;
  /** merchant activity log line */
  event?: string;
};

export type Scenario = {
  id: string;
  label: string;
  desc: string;
  customer: string;
  steps: Step[];
};

/** Merge patches up to (and including) the cursor. */
export function stateAt(s: Scenario, cursor: number) {
  const out: Record<string, string | number | boolean> = {};
  const events: { time: string; text: string }[] = [];
  s.steps.slice(0, cursor + 1).forEach((st) => {
    if (st.patch) Object.assign(out, st.patch);
    if (st.event) events.push({ time: st.time ?? "", text: st.event });
  });
  return { state: out, events, done: cursor >= s.steps.length - 1 };
}
