# ✨ The Maroon Room — Pan-Asian fine dining website + Hana, AI host

> **Day 12** of the [30 Days, 30 Websites](https://github.com/Prateekiiitg56/30-days-30-website) challenge.

### 🔗 Live demo: **[maroonroom-demo.vercel.app](https://maroonroom-demo.vercel.app)**

A redesign demo for The Maroon Room, Guwahati's award-winning Pan-Asian fine dining restaurant and bar with live music at Aurus Mall, GS Road. The design comes from the room itself: maroon lacquer walls, antique gold lattice doors, paper lanterns, geisha murals and the fibre-optic ceiling. It keeps every page of their current site.

---

## ✨ Features

- 🏮 **Through the lattice doors** — a 3D hero of paper lanterns at different depths and twinkling fibre-optic strands; scrolling walks you past the lanterns while the gold lattice doors swing open onto the stage.
- ✂️ **Cut-out photography** — dishes, bottles and cocktails were cut out of their backgrounds (rembg, locally) so they float on lacquer; on scroll, the real bar photo blurs into place behind the bottles and golden deer.
- 🚪 **Door page transitions** — every page opens from the middle like the lattice doors (cross-document View Transitions).
- 📜 **All their pages** — Home, Menus, Offers, Events, Private Dining and Catering, Journal, FAQ and Reserve.
- 🍣 **Their full food menu with real prices** — dim sum, sushi, nigiri, sashimi, bao, hot pot, stone bowls, signature mains and desserts, with piece and protein options, plus bar highlights.
- 🧾 **Order on WhatsApp** — cart across pages and a printed restaurant bill with CGST/SGST.
- 🎤 **Events** — weekly rhythm (karaoke Fridays, live bands Saturdays, Roots and Rhythms Sundays), upcoming nights that drop off automatically once they pass, and RSVP to WhatsApp.
- 🥂 **Private dining, catering and reservations** — enquiry and booking forms that send tidy WhatsApp messages.
- 🤖 **Hana, the AI host** — knows the full menu and prices, this week's line-up and the house policies, and takes reservations.

## 🛠️ Stack

- Plain HTML, CSS and JavaScript, Cormorant Garamond + Hanken Grotesk, Poiret One for the art-deco wordmark
- Vercel serverless function `api/chat.js` calling an OpenAI-compatible API (OpenRouter by default) with a `capture_reservation` tool and multi-key fallback

## 🚀 Run locally

```bash
npx vercel dev
```

Set `OPENROUTER_API_KEY` in a `.env` file, or several keys comma separated in `OPENROUTER_API_KEYS`. Optional: `MODEL`, `BASE_URL`, `LEAD_WEBHOOK_URL`.

> Demo built by [Unbias.xai](https://unbiasxai.xyz). Photos and menu belong to The Maroon Room.
