# ✨ The Bamboo Cafe by Anaya — café website + Sur, AI host

> **Day 11** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[bamboocafe-demo.vercel.app](https://bamboocafe-demo.vercel.app)**

A website demo for The Bamboo Cafe by Anaya, a cozy café near the ISBT flyover in Garchuk, Guwahati, started by singer Anaya Brahma. The design comes from the café itself: walnut slat walls, woven bamboo pendant lamps, a sage-green counter wall, olive chairs and the round glowing sign.

---

## ✨ Features

- 🏮 **Fly through the bamboo lamps** — the hero is a 3D field of CSS-drawn woven bamboo lamps swaying on their cords in front of a walnut slat wall; scrolling flies the camera past them into the café's round glowing sign, which opens like a window onto the real café.
- 🖼️ **A room with depth** — photos sit in a mosaic and drift at different speeds as you scroll.
- 🎵 **A café with a song in it** — a section for the singer-owner, live music and board games, with the glowing sign spinning like a record.
- 💡 **Page transitions** — Home, Menu and Book open into each other from the top like a lamp switching on (cross-document View Transitions).
- 🛒 **Order on WhatsApp** — menu from their Zomato listing and reviews (guest picks marked), a cart that follows you across pages, and a printed restaurant bill with CGST/SGST sent to WhatsApp.
- 🌸 **Book** — a table, a celebration or the Wednesday Ladies Special, with seating choice, sent to WhatsApp.
- 🤖 **Sur, the AI host** — "sur" means melody; answers 24/7, never invents prices, and takes bookings.
- ⚡ Plain HTML/CSS/JS, compressed WebP photos, no frameworks. Responsive and reduced-motion friendly.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, Marcellus + Outfit, Parisienne for the script in the sign
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool and multi-key fallback

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file, or several keys comma separated in `OPENROUTER_API_KEYS` (a key that runs out of free quota is skipped until it resets). Optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`.

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to The Bamboo Cafe by Anaya. Most menu prices are samples.
