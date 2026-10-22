# 🐟 Bong Fish — মাছে ভাতে বাঙালি

> **Day 4** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[bongfish-demo.vercel.app](https://bongfish-demo.vercel.app)**

A demo website for Bong Fish, a Bengali fish restaurant in Khanapara, Guwahati. The look borrows from Kolkata: taxi yellow, checker strips, a green menu board and newspaper paper bags.

---

## ✨ Features

- 🎬 **Animated thali hero** — Bengali dishes land on a banana leaf when the page opens, the steam keeps looping, and the dishes slide away as you scroll (and come back when you scroll up).
- 🍽️ **Thali picker** — eight signature dishes arranged as bowls around a brass plate.
- 🔤 **Bengali with English on hover** — Bengali words switch to English on hover, focus or tap.
- 📸 **Photo stack** — tap through photos of the dining room.
- 🧾 **Menu board and paper-bag order** — a green chalk-style menu board; the order is packed into a newspaper "thonga" and sent on WhatsApp.
- 🤖 **Ilish, the AI host** — answers questions about fish, the thali and timings, and takes table bookings.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, Rozha One + Galada + Hind Siliguri fonts, Phosphor icons inlined at build time
- Vercel serverless function `api/chat.js` (OpenRouter, OpenAI-compatible) with a `capture_reservation` tool
- Hero video from Google Flow, prepared with ffmpeg (watermark removal, short GOP for smooth scroll scrubbing, seamless steam loop)

## 🚀 Run locally

```bash
python build.py          # src/index.src.html -> public/index.html
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file.

## 📁 Structure

```
day4/
├── api/chat.js          # Ilish assistant
├── public/              # built site, images, hero videos
├── src/index.src.html   # page source (src/index.v1.html is the first version)
├── build.py
└── VIDEO_PROMPTS.md
```

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to Bong Fish.
