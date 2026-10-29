# 🌿 Kumar's Green Resort — resort, restaurant and wedding lawn website + Sabuj, AI concierge

> **Day 13** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[kumarsgreen-demo.vercel.app](https://kumarsgreen-demo.vercel.app)**

A demo website for Kumar's Green Resort & Wedding Lawn on NH-37, opposite Nezone, Guwahati: rooms, a restaurant and coffee cafe, a wedding lawn and banquet hall, and a children's park. The design comes from the resort at night, when every palm, fountain and path is lit green, and from the deep green and gold of their own menu posters.

---

## ✨ Features

- 🌙 **The night walk** — a scroll-driven 3D camera moves down the lit garden path through real night photos of the grounds (drive, water channels, pavilion, fountains, villa), with fireflies drifting over it.
- 🍃 **Garden-light page transitions** — every page opens like light spreading through the garden (cross-document View Transitions).
- 🛏️ **Stay** — room gallery with second angles on hover, amenities, house rules, and a room request that goes straight to WhatsApp.
- 🍽️ **Dine** — their real specials, festive and continental menus in tabs, a pre-order list, the 5% review offer, and the Bihu mural hall with a walk-through video.
- 💍 **Celebrate** — a 3D coverflow of real stages, mandaps and birthdays, occasions, and an event enquiry to WhatsApp.
- 📍 **Visit** — map, directions, timings and FAQs.
- 🤖 **Sabuj, the AI concierge** — knows the rooms, menu, events and policies, answers in English, Hindi, Assamese or Bengali, and takes room, table and event requests.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, Fraunces + Plus Jakarta Sans
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_request` tool and multi-key, multi-model fallback

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file, or several keys comma separated in `OPENROUTER_API_KEYS`. Optional: `MODELS`, `BASE_URL`, `LEAD_WEBHOOK_URL`.

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos and menu belong to Kumar's Green Resort.
