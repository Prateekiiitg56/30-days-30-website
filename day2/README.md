# 🏙️ TAMM Real Estate AI Assistant

> **Day 2** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[tamm-assistant-demo.vercel.app](https://tamm-assistant-demo.vercel.app)**

Website chat widget that answers buyer questions from TAMM's listings, qualifies the lead, and saves it.

## Run locally
1. Copy `.env.example` to `.env` and set `OPENROUTER_API_KEY` (free Nemotron 3 Ultra by default). Set `PROVIDER=anthropic` and `ANTHROPIC_API_KEY` to use Claude instead.
2. `npm start` (Node 18+, no dependencies).
3. Open http://localhost:3000

## Files
- `lib/assistant.js`: assistant logic (prompt, OpenRouter/OpenAI-compatible or Claude, `capture_lead` tool, webhook).
- `api/`: Vercel functions. `server.js`: local server with rate limit and CSV lead log.
- `data/listings.json`: project facts. Edit this to add or update listings. The assistant uses only these facts.
- `data/leads.csv`: captured leads (created on first lead).
- `public/widget.js`: the embeddable widget. English and Arabic (RTL), property cards, WhatsApp handoff.
- `public/index.html`: demo landing page.

## Lead alerts (optional)
Set `LEAD_WEBHOOK_URL` to an n8n, Make or Zapier webhook. Each lead is POSTed as JSON with an `alert_text` field ready to forward to WhatsApp or email.

## Embed on the real site
```html
<script src="https://YOUR-HOST/widget.js" defer></script>
```

## Deploy (Vercel)
Import the repo at vercel.com/new (framework: Other, no build command). Add `OPENROUTER_API_KEY` (and optionally `LEAD_WEBHOOK_URL`) under Environment Variables.
- `api/chat.js` and `api/listings.js` are serverless functions; `public/` is served as static files.
- Vercel's disk is read-only: leads go to the webhook and appear in the function logs ("NEW LEAD").
- `server.js` is only for local runs.

Do not commit `.env` or `data/leads.csv`.
