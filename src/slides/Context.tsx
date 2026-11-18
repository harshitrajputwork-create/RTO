import { Slide, Logo, ChannelTag, type SlideProps } from "./Slide";

/* 01 — Title */
export function TitleSlide({ page, total }: SlideProps) {
  return (
    <section className="slide dark" style={{ justifyContent: "center" }}>
      <div style={{ position: "absolute", top: 64, left: 96 }}>
        <Logo light size={34} />
      </div>
      <div className="fade-up" style={{ maxWidth: 1100 }}>
        <div className="eyebrow">Product Manager Assignment · Round 1</div>
        <h1 style={{ fontSize: 72, lineHeight: "82px", fontWeight: 700, letterSpacing: "-0.01em" }}>
          Cutting RTO for
          <br />
          Shopify merchants
        </h1>
        <p style={{ fontSize: 26, lineHeight: "38px", marginTop: 24, color: "rgba(255,255,255,.88)" }}>
          A 6-month plan using WhatsApp + voice.
        </p>
        <div
          style={{
            marginTop: 48, display: "inline-flex", gap: 14, alignItems: "center", padding: "14px 22px",
            borderRadius: 16, border: "1px solid rgba(255,255,255,.3)", background: "rgba(255,255,255,.08)",
            fontSize: 20, fontWeight: 500,
          }}
        >
          Fix the biggest leak first <span style={{ opacity: 0.6 }}>→</span> prove it{" "}
          <span style={{ opacity: 0.6 }}>→</span> then scale
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 64, left: 96, fontSize: 15, color: "rgba(255,255,255,.75)" }}>
        Relay — a WhatsApp API + voice platform for marketing, sales and support
      </div>
      <footer className="slide-footer">
        <span />
        <span>{String(page).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </footer>
    </section>
  );
}

/* 02 — Problem */
export function ProblemSlide(p: SlideProps) {
  const costs = [
    { label: "Forward shipping", v: 80 },
    { label: "Reverse shipping", v: 80 },
    { label: "Packaging + handling", v: 30 },
    { label: "Ad spend to win the order", v: 150 },
  ];
  const total = costs.reduce((a, c) => a + c.v, 0);
  return (
    <Slide {...p} eyebrow="The problem" title={<>RTO is a <span className="grad-text">COD problem</span> — and a silent margin killer</>}
      footerNote="Industry estimates: ClickPost FY26, Meesho DRHP · costs illustrative">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr 0.9fr", gap: 32, height: "100%" }}>
        {/* Bars */}
        <div className="card brand" style={{ display: "flex", flexDirection: "column" }}>
          <div className="h4">RTO rate by payment mode</div>
          <div className="caption" style={{ marginTop: 4 }}>% of shipped orders returned</div>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 48, padding: "24px 24px 0", borderBottom: "1px solid var(--line)" }}>
            {[
              { k: "COD", v: 35, c: "var(--blue)" },
              { k: "Prepaid", v: 5, c: "var(--blue-20)" },
            ].map((b) => (
              <div key={b.k} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 40, fontWeight: 700, color: "var(--navy)" }}>~{b.v}%</div>
                <div style={{ height: b.v * 9, background: b.c, borderRadius: "6px 6px 0 0", marginTop: 8 }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 48, padding: "10px 24px 0" }}>
            <div style={{ flex: 1, textAlign: "center" }} className="small">COD</div>
            <div style={{ flex: 1, textAlign: "center" }} className="small">Prepaid</div>
          </div>
        </div>

        {/* Cost */}
        <div className="card brand">
          <div className="h4">What one RTO costs (₹1,000 COD order)</div>
          <div style={{ marginTop: 22, display: "grid", gap: 14 }}>
            {costs.map((c) => (
              <div key={c.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, color: "var(--slate)" }}>
                  <span>{c.label}</span><span className="num">₹{c.v}</span>
                </div>
                <div style={{ height: 10, borderRadius: 5, background: "var(--mist)", marginTop: 6 }}>
                  <div style={{ width: `${(c.v / 150) * 100}%`, height: "100%", borderRadius: 5, background: "var(--blue-40)" }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 26, padding: "16px 18px", borderRadius: 12, background: "var(--pale)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="h4">≈ ₹{total} lost per RTO</span>
            <span className="pill navy">+ stock stuck 7–15 days</span>
          </div>
        </div>

        {/* So what */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card" style={{ background: "var(--g3)", color: "#fff", border: "none" }}>
            <div style={{ fontSize: 15, opacity: 0.8 }}>For a 10K orders/month brand, 60% COD</div>
            <div style={{ fontSize: 44, fontWeight: 700, marginTop: 6 }}>₹6–7L</div>
            <div style={{ fontSize: 15, opacity: 0.85 }}>burnt on RTO every month</div>
          </div>
          <ul className="bullets" style={{ marginTop: 8 }}>
            <li>Worst in fashion, beauty, accessories, home</li>
            <li>Tier 2/3 heavy — COD is the default</li>
            <li>Merchants react late, at failed delivery</li>
          </ul>
        </div>
      </div>
    </Slide>
  );
}

/* 03 — Users */
export function UsersSlide(p: SlideProps) {
  const segments = [
    { name: "Early-stage", orders: "< 1K orders/mo", note: "Founder does everything. Low budget.", pick: false },
    { name: "Growth D2C", orders: "1K–30K orders/mo", note: "Small ops team. RTO hurts most. Decides fast.", pick: true },
    { name: "Large D2C", orders: "30K+ orders/mo", note: "Custom stack. Long sales cycle.", pick: false },
  ];
  const personas = [
    { who: "Founder", role: "Buyer", need: "“What is RTO really costing me?”" },
    { who: "Ops manager", role: "Daily user", need: "“Too many failed deliveries to chase.”" },
    { who: "CX agent", role: "Daily user", need: "“I call 200 customers. Half don't pick up.”" },
    { who: "Growth lead", role: "Can block", need: "“Don't add friction. Don't kill conversion.”" },
    { who: "Shopper", role: "End user", need: "“Wrong address? Not home? Just tell me.”" },
  ];
  return (
    <Slide {...p} eyebrow="Users" title="Who we are building for">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: 40, height: "100%" }}>
        <div>
          <div className="h4" style={{ marginBottom: 14 }}>Shopify merchant segments</div>
          <div style={{ display: "grid", gap: 14 }}>
            {segments.map((s) => (
              <div key={s.name} className={`card ${s.pick ? "raised" : ""}`}
                style={{ padding: "18px 22px", borderColor: s.pick ? "var(--blue)" : undefined, borderWidth: s.pick ? 2 : 1, background: s.pick ? "#fff" : "var(--mist)", opacity: s.pick ? 1 : 0.75 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="h4">{s.name}</div>
                  {s.pick ? <span className="pill solid">We start here</span> : <span className="caption">{s.orders}</span>}
                </div>
                {s.pick && <div className="caption" style={{ marginTop: 2 }}>{s.orders} · COD-heavy</div>}
                <div className="small" style={{ marginTop: 6 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="h4" style={{ marginBottom: 14 }}>People who touch the problem</div>
          <div style={{ display: "grid", gap: 12 }}>
            {personas.map((x, i) => (
              <div key={x.who} className="card" style={{ padding: "14px 20px", display: "grid", gridTemplateColumns: "44px 170px 1fr", alignItems: "center", gap: 14, background: i === 4 ? "var(--pale)" : "#fff" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: i === 4 ? "var(--g1)" : "var(--blue-10)", color: i === 4 ? "#fff" : "var(--blue)", display: "grid", placeItems: "center", fontWeight: 600 }}>
                  {x.who[0]}
                </div>
                <div>
                  <div className="h4" style={{ fontSize: 17 }}>{x.who}</div>
                  <div className="caption">{x.role}</div>
                </div>
                <div style={{ fontSize: 16, color: "var(--slate)" }}>{x.need}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* 04 — Why RTO happens (animated, 7 builds) */
export function WhySlide(p: SlideProps) {
  const step = p.step ?? 0;
  const stages = ["Discovery", "Checkout", "Post-order", "Dispatch", "In transit", "Delivery", "Failed delivery", "RTO"];
  const sub = ["Ad / Instagram", "Picks COD", "First 24h", "Courier pickup", "2–7 days", "Doorstep", "NDR · 24–48h", "Loss"];
  const causes = [
    { t: "Bad address / contact", d: "“Near temple”, wrong pincode, wrong number", cols: [2, 3], n: 10, pr: "now" },
    { t: "Not reachable at the door", d: "Not home, not picking calls, no cash", cols: [6, 7], n: 8, pr: "now" },
    { t: "Weak or changed intent", d: "Impulse buy, regret, ordered elsewhere", cols: [1, 5], n: 7, pr: "later" },
    { t: "Slow + silent journey", d: "No updates, intent fades by day 5", cols: [4, 5], n: 2, pr: "later" },
    { t: "Fake / fraud orders", d: "Pranks, serial refusers", cols: [2, 2], n: 3, pr: "parked" },
  ];
  const shown = causes.slice(0, Math.min(step, causes.length));
  const tally = shown.reduce((a, c) => a + c.n, 0);
  const lit = step >= 6;
  const touch: Record<number, "wa" | "voice" | "both" | undefined> = { 3: "both", 6: "wa", 7: "both" };
  const dots = Array.from({ length: 14 });
  const redCount = Math.round((tally / 100) * dots.length);
  const cols = "repeat(8, 1fr) 200px";

  return (
    <Slide {...p} eyebrow="Root causes" title={<>RTO risk is created <span className="grad-text">early</span> — but shows up <span className="grad-text">late</span></>}
      footerNote="Illustrative split of a ~30% COD RTO · address + refusal ≈ half of RTO (industry data)">
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 8, alignItems: "start" }}>
        <div style={{ gridColumn: "1 / 9", position: "relative" }}>
          <div style={{ position: "absolute", left: "6.25%", right: "6.25%", top: 28, height: 2, background: "var(--blue-20)" }}>
            {dots.map((_, i) => (
              <span key={i} className="order-dot" style={{
                animationDuration: "7s", animationDelay: `${-(i * 7) / dots.length}s`,
                background: i < redCount ? "var(--error)" : "var(--blue)", opacity: i < redCount ? 0.9 : 0.55,
              }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 8 }}>
            {stages.map((st, i) => {
              const isTouch = lit && touch[i + 1];
              return (
                <div key={st} style={{ textAlign: "center", position: "relative" }}>
                  <div style={{
                    width: 56, height: 56, margin: "0 auto", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 18,
                    background: i === 7 ? "var(--error)" : isTouch ? "var(--g1)" : "#fff",
                    color: i === 7 || isTouch ? "#fff" : "var(--navy)", border: isTouch || i === 7 ? "none" : "2px solid var(--blue-20)",
                    transition: "all .4s", position: "relative", zIndex: 1,
                  }}>{i + 1}</div>
                  <div className="h4" style={{ fontSize: 15.5, marginTop: 8 }}>{st}</div>
                  <div className="caption">{sub[i]}</div>
                  <div style={{ height: 28, marginTop: 6 }} className={`reveal ${isTouch ? "" : "hide"}`}>{touch[i + 1] && <ChannelTag kind={touch[i + 1]!} />}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card" style={{ background: "var(--g3)", color: "#fff", border: "none", padding: "16px 18px", textAlign: "center" }}>
          <div style={{ fontSize: 13, opacity: 0.8 }}>Out of 100 COD orders</div>
          <div key={tally} className="tally-pop" style={{ fontSize: 52, fontWeight: 700, lineHeight: "60px" }}>{tally}</div>
          <div style={{ fontSize: 13, opacity: 0.85 }}>{step === 0 ? "orders flowing… press →" : "come back as RTO"}</div>
        </div>
      </div>

      <div style={{ marginTop: 12, display: "grid", gap: 4 }}>
        {causes.map((c, i) => {
          const on = i < step;
          const color = c.pr === "now" ? "var(--blue)" : c.pr === "later" ? "var(--sky)" : "var(--border)";
          const right = c.cols[1] >= 5;
          return (
            <div key={c.t} className={`reveal ${on ? "" : "hide"}`} style={{ display: "grid", gridTemplateColumns: cols, gap: 8, alignItems: "center", padding: "7px 0", borderTop: "1px solid var(--line)" }}>
              <div style={{ gridColumn: `${c.cols[0]} / ${c.cols[1] + 1}`, gridRow: 1, height: 10, borderRadius: 5, background: color }} />
              <div style={{ gridColumn: right ? "1 / 6" : `${c.cols[1] + 1} / 9`, gridRow: 1, display: "flex", alignItems: "center", gap: 10, justifyContent: right ? "flex-end" : "flex-start", padding: "0 10px" }}>
                <span className="h4" style={{ fontSize: 16 }}>{c.t}</span>
                <span className="small" style={{ fontSize: 13.5 }}>{c.d}</span>
                <span className={`pill ${c.pr === "now" ? "blue" : "grey"}`} style={{ fontSize: 11, padding: "0 8px" }}>
                  {c.pr === "now" ? "Fix first" : c.pr === "later" ? "Growth stage" : "Parked"}
                </span>
              </div>
              <div style={{ gridColumn: 9, gridRow: 1, textAlign: "center", fontSize: 20, fontWeight: 700, color: c.pr === "now" ? "var(--blue)" : "var(--grey)" }}>+{c.n}</div>
            </div>
          );
        })}
      </div>

      <div className={`reveal ${lit ? "" : "hide"}`} style={{ marginTop: 12 }}>
        <div className="card" style={{ padding: "12px 20px", background: "var(--pale)", border: "none", display: "flex", alignItems: "center", gap: 14 }}>
          <span className="pill solid">18 of 30</span>
          <span className="h4" style={{ fontSize: 16.5 }}>start with bad data or an unreachable shopper.</span>
          <span className="small">Both are reachable on WhatsApp + voice. We can't control the courier, so we fix the shopper side.</span>
        </div>
      </div>
    </Slide>
  );
}

/* 05 — Prioritisation */
export function PrioritySlide(p: SlideProps) {
  const step = p.step ?? 0;
  const rows = [
    { name: "COD confirm + address fix", ch: "both" as const, i: 5, c: 5, e: 2, when: "M1 · MVP", tone: "solid" },
    { name: "Failed-delivery (NDR) rescue", ch: "both" as const, i: 4, c: 4, e: 3, when: "M3", tone: "blue" },
    { name: "Delivery-day heads-up", ch: "wa" as const, i: 3, c: 4, e: 1, when: "M3 · quick win", tone: "blue" },
    { name: "RTO insights + risk rules", ch: undefined, i: 4, c: 3, e: 3, when: "M4", tone: "navy" },
    { name: "Smart COD → prepaid nudge", ch: "wa" as const, i: 5, c: 3, e: 3, when: "M5", tone: "navy" },
    { name: "In-transit intent nudges", ch: "wa" as const, i: 2, c: 2, e: 2, when: "M5", tone: "navy" },
    { name: "Cross-merchant fraud network", ch: undefined, i: 4, c: 2, e: 5, when: "Parked", tone: "grey" },
    { name: "Courier allocation by pincode", ch: undefined, i: 3, c: 3, e: 5, when: "Parked · partner", tone: "grey" },
  ];
  const Dots = ({ n, inv = false }: { n: number; inv?: boolean }) => (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((k) => (
        <span key={k} style={{ width: 12, height: 12, borderRadius: 3, background: k <= n ? (inv ? "var(--magenta)" : "var(--blue)") : "var(--line)" }} />
      ))}
    </div>
  );
  return (
    <Slide {...p} eyebrow="Prioritisation" title="What we build first — and why">
      <div style={{ display: "grid", gridTemplateColumns: "1.75fr 1fr", gap: 32, height: "100%" }}>
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1.1fr 0.9fr 0.9fr 0.9fr 1.1fr", padding: "12px 20px", background: "var(--mist)", fontSize: 13, fontWeight: 600, color: "var(--slate)", textTransform: "uppercase", letterSpacing: ".06em" }}>
            <span>Initiative</span><span>Channel</span><span>Impact</span><span>Confidence</span><span>Effort</span><span>When</span>
          </div>
          {rows.map((r, idx) => (
            <div key={r.name} style={{
              display: "grid", gridTemplateColumns: "2.2fr 1.1fr 0.9fr 0.9fr 0.9fr 1.1fr", padding: "15px 20px", alignItems: "center",
              borderTop: "1px solid var(--line)", background: idx === 0 && step >= 1 ? "var(--pale)" : "#fff", opacity: r.tone === "grey" ? 0.6 : step >= 1 && idx > 2 ? 0.75 : 1, transition: "all .4s",
            }}>
              <span style={{ fontSize: 16, fontWeight: idx < 2 ? 600 : 500, color: "var(--navy)" }}>{r.name}</span>
              <span>{r.ch ? <span className="pill grey" style={{ fontSize: 12 }}>{r.ch === "both" ? "WA + Voice" : "WhatsApp"}</span> : <span className="caption">Platform</span>}</span>
              <Dots n={r.i} /><Dots n={r.c} /><Dots n={r.e} inv />
              <span><span className={`pill ${r.tone}`} style={{ fontSize: 12 }}>{r.when}</span></span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className={`card brand reveal ${step >= 1 ? "" : "hide"}`}>
            <div className="h4">How I scored</div>
            <ul className="bullets" style={{ marginTop: 10 }}>
              <li><b>Impact</b> — share of RTO it can remove</li>
              <li><b>Confidence</b> — proven pattern, low conversion risk</li>
              <li><b>Effort</b> — new integrations + build time</li>
            </ul>
          </div>
          <div className={`card brand reveal ${step >= 2 ? "" : "hide"}`}>
            <div className="h4">Two rules on top</div>
            <ul className="bullets" style={{ marginTop: 10 }}>
              <li><b>Data first:</b> insights + prepaid nudges need 2–3 months of our own data</li>
              <li><b>Never trade conversion for RTO</b> — prepaid push waits till we know whom to nudge</li>
            </ul>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* 06 — Roadmap */
export function RoadmapSlide(p: SlideProps) {
  const step = p.step ?? 0;
  const phases = [
    { m: "M1", name: "Discover + MVP", goal: "Catch bad orders before they ship", items: ["10–15 merchant interviews + baseline", "COD confirm on WhatsApp", "Address fix in chat", "Voice fallback", "Shopify order tags"], tag: "Support", color: "var(--blue)" },
    { m: "M2", name: "Validate", goal: "Prove it without killing sales", items: ["15–20 beta merchants", "Holdout group vs Relay", "Track RTO + genuine-order drop", "Go / no-go gate"], tag: "Support", color: "var(--blue)" },
    { m: "M3", name: "Iterate + Rescue", goal: "Save orders failing at the door", items: ["Tune timing, copy, languages", "NDR rescue on WA + voice", "Delivery-day heads-up"], tag: "Support", color: "var(--blue)" },
    { m: "M4", name: "Insights", goal: "Show where RTO comes from", items: ["RTO by pincode, product, ad source", "Repeat-refuser flags", "Merchant risk rules", "Courier fake-attempt view"], tag: "Platform", color: "var(--navy-light)" },
    { m: "M5", name: "Grow", goal: "Cut RTO at the root", items: ["Prepaid nudge for risky orders only", "Pay link inside WhatsApp", "Pincode-targeted campaigns", "Win back cancelled orders"], tag: "Marketing + Sales", color: "var(--magenta)" },
    { m: "M6", name: "Scale", goal: "From beta to every merchant", items: ["Self-serve Shopify setup", "Monthly ROI report", "Case studies for sales", "Outcome-based pricing"], tag: "Sales", color: "var(--magenta)" },
  ];
  return (
    <Slide {...p} eyebrow="6-month roadmap" title={<>Stop the loss <span style={{ color: "var(--grey)" }}>→</span> rescue <span style={{ color: "var(--grey)" }}>→</span> learn <span style={{ color: "var(--grey)" }}>→</span> <span className="grad-text">grow</span></>}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 12, height: "100%" }}>
        {phases.map((ph, i) => (
          <div key={ph.m} className={`reveal ${i <= step ? "" : "off"}`} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ height: 6, flex: 1, borderRadius: 3, background: ph.color }} />
              {i === 1 ? <span title="Gate" style={{ fontSize: 12, fontWeight: 600, color: "var(--warning)" }}>◆ gate</span> : null}
            </div>
            <div style={{ marginTop: 14 }}>
              <span className="pill grey">{ph.m}</span>
              <div className="h3" style={{ fontSize: 21, marginTop: 8 }}>{ph.name}</div>
              <div className="small" style={{ fontSize: 14, minHeight: 46 }}>{ph.goal}</div>
            </div>
            <div className="card" style={{ marginTop: 10, flex: 1, padding: 16, background: i === 0 ? "var(--pale)" : "#fff", borderColor: i === 0 ? "var(--blue)" : undefined }}>
              <div style={{ display: "grid", gap: 9 }}>
                {ph.items.map((it) => (
                  <div key={it} style={{ fontSize: 14.5, lineHeight: "21px", color: "var(--ink)", display: "flex", gap: 8 }}>
                    <span style={{ color: ph.color, fontWeight: 700 }}>•</span>{it}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 10 }}><span className="caption" style={{ color: ph.color, fontWeight: 600 }}>{ph.tag}</span></div>
          </div>
        ))}
      </div>
    </Slide>
  );
}
