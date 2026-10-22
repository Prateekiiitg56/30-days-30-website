# 🌅 Guwahati Greens — Dinner on the Brahmaputra

> **Day 5** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[guwahatigreens-demo.vercel.app](https://guwahatigreens-demo.vercel.app)**

A demo website for Guwahati Greens, a riverside restaurant in Amingaon on the north bank of the Brahmaputra. It is built around the restaurant's dusk deck, bamboo lanterns and Assamese kitchen, with an AI host named Luit (the Assamese name for the Brahmaputra).

---

## ✨ Features

- 🎬 **Scroll-driven hero** — a looping dusk video of the river deck. As you scroll, it turns in 3D and folds into an arched window looking out over the river, then unfolds again on the way back up. Phones get their own framing so the arch ends on the river and the sunset.
- ☀️ **Noon to lantern light** — drag a sun across the opening hours (11 am to 10 pm) and the photos change from the daytime river to the lantern-lit hall.
- 🍛 **Assamese menu** — the real menu with prices, in sections that open on tap. Farm or local chicken, and fish options, are buttons.
- 🎟️ **Ferry-ticket order** — dishes go on a ticket styled like a Brahmaputra ferry ticket, and the order is sent to the restaurant on WhatsApp.
- 🍹 **Juice bar and coffee** — a photo mosaic of the drinks counter.
- 🎉 **Celebrations** — birthdays, engagements and family events, booked through the assistant.
- 🤖 **Luit, the AI host** — answers questions about the menu, prices and timings, and takes table and celebration bookings (English, Hindi or Assamese).
- 🧵 **Gamosa border** — the red-and-white Assamese gamosa weave is used as the page divider.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript (no framework), Gloock + Onest fonts, Phosphor icons inlined at build time
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool
- Hero video prepared with ffmpeg (seamless crossfade loop, 1.2 MB desktop / 430 KB phone)

## 🚀 Run locally

```bash
python build.py          # inlines icons: src/index.src.html -> public/index.html
npx vercel dev           # serves public/ and api/chat.js
```

Set `OPENROUTER_API_KEY` in a `.env` file (optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`).

## 📁 Structure

```
day5/
├── api/chat.js          # Luit assistant (prompt, menu facts, booking tool)
├── public/              # built site, images, hero videos
├── src/index.src.html   # page source with {{icon}} placeholders
├── build.py             # icon inliner
└── VIDEO_PROMPTS.md     # Google Flow prompts used for the hero video
```

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to Guwahati Greens.
