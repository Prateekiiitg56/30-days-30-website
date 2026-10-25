# ✨ Uttsah by Sachika — website + Mayur, AI host

> **Day 9** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[uttsah-demo.vercel.app](https://uttsah-demo.vercel.app)**

A website demo for Uttsah by Sachika, the pure vegetarian and Jain restaurant of Sachika Hotels on NH 31, Amingaon, North Guwahati. The design comes from their own room: the black-and-white diamond floor, teal banquettes, walnut tables, lattice screens, Assamese japi and the travertine wall with the bronze Sachika mark.

---

## ✨ Features

- 🔷 **Their floor becomes the room** — the hero opens on the restaurant's diamond floor pattern with a travertine plaque; scrolling tilts the floor back into 3D perspective and it dissolves into the real dining room, where the same floor continues.
- 🎠 **3D photo ring** — the room's photos sit on a rotating 3D ring, turned by scroll, drag or arrows, with captions for each view.
- 💠 **Diamond page transitions** — Home, Menu and Reserve open into each other through a growing diamond, like a floor tile (cross-document View Transitions).
- 🥗 **Pure veg menu with Jain marks** — dishes from their Google listing, a sticky category list, and a cart that follows you across pages.
- 🧾 **Restaurant bill on WhatsApp** — printed-receipt bill with CGST/SGST, takeaway or dine-in, sent to the restaurant's WhatsApp.
- 🎉 **Reserve** — a table, the weekend buffet or a celebration, with a Jain food option, sent to WhatsApp.
- 🦚 **Mayur, the AI host** — named after the peacock feather in the Sachika mark; answers 24/7, stays pure veg, never invents prices, and takes bookings.
- 📱 Responsive, reduced-motion friendly.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, Bodoni Moda + Jost
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file, or several keys comma separated in `OPENROUTER_API_KEYS` (a key that runs out of free quota is skipped until it resets). Optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`.

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos belong to Uttsah by Sachika / Sachika Hotels. Menu prices are samples.
