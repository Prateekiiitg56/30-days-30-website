# 🌙 Levitate Rooftop — Skye, AI concierge

> **Day 6** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[levitate-concierge.vercel.app](https://levitate-concierge.vercel.app)**

An AI concierge demo for Levitate, a rooftop restaurant and bar on GS Road, Guwahati. Levitate already has a strong website, so this demo doesn't replace it: it shows their live site with **Skye**, a concierge chat, sitting on top, styled in Levitate's own fonts and colours so it looks native.

---

## ✨ Features

- 🌐 **Runs on the real site** — the restaurant's live website loads underneath, so the owner sees exactly how the concierge would look on it.
- 🌙 **Skye, the AI concierge** — answers 24/7 from Levitate's real menu, prices, offers, décor and group packages, live music nights, parking and timings.
- 📅 **Bookings** — collects name, phone, date, time, guests, occasion and décor package, then hands the request to the team.
- 🎉 **Celebrations, groups and corporate** — knows the décor packages, per-head food packages and group discounts.
- 💬 **Quick replies** — sunset table, 1+1 offer, birthday décor, group dinner, veg picks, weekend live music.
- 🗣️ **Languages** — English, Hindi or Assamese.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript (one page), Cormorant Garamond + Hanken Grotesk + DM Mono to match the restaurant's brand
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file (optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`).

> Demo built by [Unbias.xai](https://unbiasxai.xyz). The website shown underneath belongs to Levitate Rooftop.
