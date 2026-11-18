import type { ReactNode } from "react";

export type SlideProps = { page: number; total: number };

type Props = SlideProps & {
  eyebrow?: string;
  title?: ReactNode;
  lead?: ReactNode;
  variant?: "light" | "soft" | "dark" | "navy";
  children?: ReactNode;
  footerNote?: string;
};

export function Slide({ eyebrow, title, lead, variant = "light", children, page, total, footerNote }: Props) {
  return (
    <section className={`slide ${variant === "light" ? "" : variant}`}>
      {variant === "light" || variant === "soft" ? <div className="accent-strip" /> : null}
      {eyebrow && <div className="eyebrow fade-up">{eyebrow}</div>}
      {title && <h1 className="title fade-up">{title}</h1>}
      {lead && <p className="lead fade-up">{lead}</p>}
      <div className="body fade-up" style={{ animationDelay: ".08s" }}>{children}</div>
      <footer className="slide-footer">
        <span>Relay · RTO mandate{footerNote ? ` · ${footerNote}` : ""}</span>
        <span>{String(page).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
      </footer>
    </section>
  );
}

export function Logo({ light = false, size = 28 }: { light?: boolean; size?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <svg width={size} height={size} viewBox="0 0 32 32">
        <defs>
          <linearGradient id="lg" x1="0" x2="1">
            <stop offset="0" stopColor="#0056A5" />
            <stop offset="1" stopColor="#A74091" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill={light ? "#fff" : "url(#lg)"} />
        <path
          d="M10 22V10h7a4 4 0 0 1 0 8h-3l5 4"
          fill="none"
          stroke={light ? "#0056A5" : "#fff"}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={{ fontWeight: 600, fontSize: size * 0.75, color: light ? "#fff" : "var(--navy)" }}>relay</span>
    </div>
  );
}

export function ChannelTag({ kind }: { kind: "wa" | "voice" | "both" }) {
  if (kind === "both")
    return (
      <span style={{ display: "inline-flex", gap: 6 }}>
        <ChannelTag kind="wa" />
        <ChannelTag kind="voice" />
      </span>
    );
  return kind === "wa" ? (
    <span className="pill blue">
      <WaIcon /> WhatsApp
    </span>
  ) : (
    <span className="pill mag">
      <PhoneIcon /> Voice
    </span>
  );
}

export function WaIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
    </svg>
  );
}

export function PhoneIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
