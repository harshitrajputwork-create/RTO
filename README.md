# Relay · Cutting RTO for Shopify Merchants

PM assignment deck + clickable prototype (Vite + React).

## Run locally
```bash
npm install
npm run dev   # http://localhost:4321
```

## Presenting
- `→` / `←` — next / previous slide
- `Space` — next step inside a prototype
- `H` — hide the nav bar (for recording)
- `F` — fullscreen
- `#8` in the URL jumps to slide 8

## Where to edit
- `src/slides/Context.tsx` — slides 1–6 (problem, users, root causes, prioritisation, roadmap)
- `src/slides/Initiatives.tsx` — slides 7–12 (initiatives, prototypes, metrics, close)
- `src/proto/ConfirmProto.tsx` / `RescueProto.tsx` — chat scripts + merchant dashboards
- `src/styles.css` — brand tokens

## Deploy
Import the repo in Vercel → framework "Vite" is auto-detected → Deploy. Every push to `main` redeploys.
