# ✨ Eighteenth South — restaurant website + Archie, AI host

> **Day 7** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[eighteensouth-demo.vercel.app](https://eighteensouth-demo.vercel.app)**

A website demo for Eighteenth South, a restaurant and cafe on Lokhra Road, Kala Pahar, Guwahati. The design comes from their own room: white panelled walls, lit arches with their wall lines ("When food is flirting on you", "Sorry! Diet na ho payega"), emerald velvet chairs, red tufted booths and marble tables.

---

## ✨ Features

- 🏛️ **3D walk through the arches** — the hero is a CSS 3D corridor of lit arches; scrolling walks you through it, past framed photos on the walls and mirrored ceiling lights, to the dining room.
- 🖼️ **Arch motif everywhere** — photos sit in arch frames with 3D pointer tilt.
- 🍕 **Menu board** — tabbed categories (pizzas, sizzlers, pasta, continental, omelettes, drinks, desserts) with veg/non-veg marks.
- 🎈 **Parties** — a tufted red-velvet section for birthdays and groups.
- 📅 **Book a table** — form sends a ready-made booking message to the restaurant's WhatsApp.
- 🤖 **Archie, the AI host** — answers 24/7 from the restaurant's facts and menu, never invents prices, and takes table bookings.
- 📱 Responsive, reduced-motion friendly.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript (one page), Bodoni Moda + Figtree
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file (optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`).

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to Eighteenth South.
