# 🏮 Qasbah Lounge & Restro

> **Day 3** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[qasbah-lounge.vercel.app](https://qasbah-lounge.vercel.app)**

A rebuilt website for Qasbah, a Middle Eastern lounge and restaurant in Milan Nagar, Guwahati. Dark maroon and gold, with 3D lanterns and an AI host named Noor.

---

## ✨ Features

- 🏮 **3D lantern hero** — floating lanterns rendered with three.js.
- 🖼️ **Lounge slideshow** — tap to move through photos of the lounge.
- 🍢 **Most loved dishes** — a dish viewer with cut-out food photos.
- 🧾 **Printed menu and receipt ordering** — build an order on a printed-style menu card; it is sent to WhatsApp as a receipt.
- 🚗 **Dine your way** — dine-in, drive-through pickup, delivery and celebrations.
- 🤖 **Noor, the AI host** — recommends dishes and takes table bookings (English, Hindi or Assamese).

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, GSAP + ScrollTrigger, three.js r160, Phosphor icons
- Vercel serverless function `api/chat.js` (OpenRouter, OpenAI-compatible) with a `capture_reservation` tool

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file.

## 📁 Structure

```
day3/
├── api/chat.js          # Noor assistant
├── public/index.html    # the whole site
├── public/img/          # lounge and dish photos
└── IMAGE_PROMPTS.md
```

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to Qasbah Lounge & Restro.
