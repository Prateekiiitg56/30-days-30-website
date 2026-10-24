# ✨ Pragya Bamboo Restaurant — website + Baanhi, AI host

> **Day 8** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[pragya-bamboo.vercel.app](https://pragya-bamboo.vercel.app)**

A website demo for Pragya Bamboo Restaurant, a thatched bamboo restaurant on NH 15 in Madhabpur, Assam. The design comes from the place itself: bamboo and thatch under tall trees by day, a bamboo hall lit with green and violet neon by night, and a private bamboo cabin on stilts.

---

## ✨ Features

- 🌗 **Scroll through afternoon to neon night** — scrolling plays the restaurant's film frame by frame (forwards and backwards); the neon "Pragya" sign switches on exactly when the restaurant's lights do, and the address, timings, rating and booking buttons come in one at a time on cue.
- 🎞️ **Smooth page transitions** — three pages (Home, Menu, Cabin) with cross-document View Transitions: the next page rolls down like a bamboo blind.
- ↔️ **Day / night slider** — drag between the thatched front by day and the neon hall by night.
- 🎋 **Bamboo details** — reviews hang from a bamboo pole, the menu categories sit on a bamboo stalk rail.
- 🛒 **Order on WhatsApp** — full menu with veg/non-veg marks, a cart that follows you across pages, and a printed restaurant bill (bill no, total, takeaway or dine-in) sent to the restaurant's WhatsApp.
- 🛖 **Book the cabin** — pick the cabin, the neon hall or a seat under the thatch; the booking goes to WhatsApp.
- 🤖 **Baanhi, the AI host** — named after the Assamese bamboo flute; answers 24/7 from the restaurant's facts, never invents prices, and takes bookings.
- 📱 Responsive with a separate vertical video for phones, reduced-motion friendly.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, Fraunces + Manrope
- Hero videos generated with Google Flow (Veo) from the restaurant's own photo, denoised and colour graded with ffmpeg, plus CSS grading layers (vignette, colour wash, film grain, slow camera push)
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file, or several keys comma separated in `OPENROUTER_API_KEYS` (a key that runs out of free quota is skipped until it resets). Optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`.

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to Pragya Bamboo Restaurant. Menu prices are samples.
