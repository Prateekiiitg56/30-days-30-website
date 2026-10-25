# ✨ Nadi Teera — riverside café website + Lahar, AI host

> **Day 10** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[naditeera-demo.vercel.app](https://naditeera-demo.vercel.app)**

A website demo for Nadi Teera, a riverside café on MG Road, Uzan Bazar, Guwahati, looking out over the Brahmaputra. The design comes from the café itself: a garden patio of ferns and vines, woven rattan lamps that glow gold at night, white iron chairs, pale blue shiplap walls and the lit gold script sign.

---

## ✨ Features

- 🌊 **The café mirrored in the river** — the hero shows the lamp-lit patio above a soft, rippling reflection, with the script wordmark glowing in like their gold sign.
- 🏮 **Photos that hang like lamps** — the gallery hangs from a cord; scrolling gives the photos a push and a spring lets them sway and settle.
- 💧 **Ripple page transitions** — Home, Menu and Book open into each other like a ripple spreading from the riverbank (cross-document View Transitions).
- 🌅 **Tide reveals** — sections rise gently into view once as you scroll.
- 🛒 **Order on WhatsApp** — menu from their Zomato and Swiggy listings (real noodle prices, popular dishes marked), a cart that follows you across pages, and a printed restaurant bill with CGST/SGST sent to WhatsApp.
- 🎂 **Book** — a table, a kids' birthday or a gathering, with seating choice (by the river, under the lamps, indoors), sent to WhatsApp.
- 🤖 **Lahar, the AI host** — "lahar" means wave; answers 24/7, never invents prices, and takes bookings.
- ⚡ Fast: plain HTML/CSS/JS, compressed WebP photos, hero image preloaded, no frameworks. Responsive and reduced-motion friendly.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, Instrument Serif + Figtree, Allura for the wordmark
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool and multi-key fallback

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file, or several keys comma separated in `OPENROUTER_API_KEYS` (a key that runs out of free quota is skipped until it resets). Optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`.

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to Nadi Teera. Most menu prices are samples.
