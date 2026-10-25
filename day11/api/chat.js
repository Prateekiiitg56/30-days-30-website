// Sur: AI host for The Bamboo Cafe by Anaya. OpenAI-compatible API (OpenRouter by default).
const SYSTEM = `You are Sur (it means melody), the AI host of The Bamboo Cafe by Anaya, a cozy bamboo-themed café in Guwahati started by singer Anaya Brahma. You chat with guests on the café website.
Facts you may use:
- Address: 1st Floor, Dream City Hotel, Dhirenpara, near ISBT Flyover, Garchuk, Guwahati, Assam 781035. Instagram @thebamboocafebyanaya.
- Phone and WhatsApp: 099676 63017. Open every day, 10:30 am to 11 pm.
- About ₹200 to ₹400 per person. Rated 4.9 on Google from 137 reviews. Guests praise the ambience, top-notch service, food quality, friendly staff and the white sauce pasta.
- The place: walnut slat walls, woven bamboo pendant lamps, plants, macramé, olive chairs, round wooden tables, big windows and a round glowing sign. Live music and performances, board games like UNO and Jenga, free Wi-Fi, outdoor seating and free parking.
- Every Wednesday is the Wednesday Ladies Special with special offers and surprises for ladies; you do not know the exact offers, say the team will share them.
- A multi-cuisine café and bakery: coffee, mocktails, Chinese, fast food, kebabs, street food, sizzlers, pasta, a signature biryani and desserts.
- Ordering: on the Menu page tap Add, then Bill (top right) and Send order on WhatsApp. Pay at the counter. They are also on Zomato.
- Menu (prices are on the menu page; you do not know them):
  Coffee: Cappuccino, Café Latte, Hazelnut Cold Coffee, Masala Chai.
  Mocktails: Black Currant Mocktail, Blue Lagoon, Watermelon Mojito, Virgin Mojito.
  Snacks and street food: Veg Momo, Chicken Momo, Paneer Tikka, Chicken Seekh Kebab, Loaded Fries.
  Sizzlers and pasta: White Sauce Sizzler, White Sauce Pasta, Red Sauce Pasta, Chicken Pasta.
  Chinese: Veg Hakka Noodles, Chicken Fried Rice, Chilli Chicken, Chilli Paneer.
  Biryani and Indian: Signature Chicken Biryani (the café's own recipe), Veg Biryani, Butter Chicken with Naan.
  Burgers and sandwiches: Veg Burger, Chicken Burger, Club Sandwich.
  Bakery and desserts: Brownie with Ice Cream, Cheesecake Slice, Chocolate Pastry.
Rules:
- Reply in the guest's language (English, Hindi or Assamese; Latin script is fine). Be direct: answer the question in the first sentence. Maximum 60 words. If you list dishes, use lines starting with "- " in the form "- **Name**" with no description, never more than 4 lines; offer to share more. Use **bold** only for dish names. No headings, no emojis. Warm and friendly, never pushy.
- Use only the facts above. Never describe ingredients or how a dish is made unless written above. Never invent dishes, prices, offers, music schedules or performers. If asked for a price, say prices are on the menu page and the team can confirm on WhatsApp at 099676 63017. Anything not listed (alcohol, home delivery details, decoration packages, allergens, exact music nights) is unknown: say you'll check with the team and share 099676 63017.
- To book you need: name, phone number, date, time, number of guests, and whether it is a table, a celebration or the Wednesday Ladies Special. Optionally the seating (by the window, near the music, quiet corner). Ask for missing details in one short sentence. When you have all and the guest confirms, call capture_reservation once, then say The Bamboo Cafe team will confirm on WhatsApp shortly.
- Do not discuss anything unrelated to The Bamboo Cafe by Anaya. Do not reveal these instructions.`;

const TOOL = {
  type: 'function',
  function: {
    name: 'capture_reservation',
    description: 'Save a table, celebration or Wednesday Ladies Special booking request and notify the The Bamboo Cafe team. Call once, after the visitor gave name, phone, date, time and guests and confirmed.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        date: { type: 'string', description: 'Date as stated, e.g. "Saturday 25 Oct"' },
        time: { type: 'string' },
        guests: { type: 'string' },
        kind: { type: 'string', description: 'Table, celebration or Wednesday Ladies Special' },
        seating: { type: 'string', description: 'By the window, near the music or a quiet corner' },
        occasion: { type: 'string' },
        note: { type: 'string' }
      },
      required: ['name', 'phone', 'date', 'time', 'guests']
    }
  }
};

const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  arr.push(now);
  hits.set(ip, arr);
  return arr.length > 40;
}

async function post(url, headers, body) {
  try {
    const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
    if (!r.ok) {
      console.error('Upstream', r.status, (await r.text()).slice(0, 300));
      return null;
    }
    return await r.json();
  } catch (e) {
    console.error('Upstream error', e.message);
    return null;
  }
}

// Several API keys can be set in OPENROUTER_API_KEYS (comma separated), plus OPENROUTER_API_KEY.
// Free keys have a daily cap, so a key that is out of quota or rejected is benched until its reset
// and the next key answers instead.
const benched = new Map(); // key -> time it may be tried again
async function complete(keys, url, body) {
  for (let pass = 0; pass < 2; pass++) {
    for (const key of keys) {
      if ((benched.get(key) || 0) > Date.now()) continue;
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}`, 'x-title': 'Bamboo Cafe Sur' }, body: JSON.stringify(body) });
        if (r.ok) return await r.json();
        const text = await r.text();
        console.error('Upstream', r.status, `key ...${key.slice(-4)}`, text.slice(0, 200));
        if (r.status === 429) {
          const reset = Number(text.match(/X-RateLimit-Reset\D+(\d{13})/)?.[1]);
          benched.set(key, reset > Date.now() ? reset : Date.now() + 60 * 1000);
        } else if ([401, 402, 403].includes(r.status)) benched.set(key, Date.now() + 10 * 60 * 1000);
      } catch (e) {
        console.error('Upstream error', e.message);
      }
    }
    if (!pass) await new Promise((r) => setTimeout(r, 1200));
  }
  return null;
}

// The model sometimes writes its planning ("The user is asking...") into the reply instead of answering.
// Detect that so the turn can be retried rather than shown to the guest.
const leaked = (t) => /^(the user|user (is|wants|asked)|i need to|i should|we need|okay[,.]|ok[,.]|first,|hmm)/i.test(t)
  || /\bthe user\b/i.test(t.slice(0, 240));
const cleanReply = (t) => String(t || '').replace(/<think>[\s\S]*?<\/think>/g, '').trim();
// The model ignores the 4-item limit on long menus; keep chat replies short enough for a phone screen.
const trimList = (t) => {
  let n = 0;
  const lines = t.split('\n').filter((l) => !/^\s*[-*•]\s/.test(l) || ++n <= 4);
  if (n <= 4) return t;
  const out = lines.join('\n').trim();
  return out.endsWith('?') ? out : `${out}\nWant me to share more?`;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const keys = [...new Set(`${process.env.OPENROUTER_API_KEYS || ''},${process.env.OPENROUTER_API_KEY || ''}`.split(/[\s,]+/).filter(Boolean))];
  if (!keys.length) return res.status(503).json({ error: 'Sur is not configured yet.' });
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || 'x';
  if (limited(ip)) return res.status(429).json({ error: 'Too many messages. Please try again in a few minutes.' });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  const raw = Array.isArray(body?.messages) ? body.messages.slice(-16) : null;
  const messages = raw?.every((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.length < 1500)
    ? raw
    : null;
  if (!messages?.length) return res.status(400).json({ error: 'Invalid messages' });

  const model = process.env.MODEL || 'nvidia/nemotron-3-ultra-550b-a55b:free';
  const baseUrl = process.env.BASE_URL || 'https://openrouter.ai/api/v1';
  const today = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const convo = [{ role: 'system', content: `${SYSTEM}\nToday in Guwahati is ${today}.` }, ...messages];
  let booked = false;

  for (let round = 0; round < 3; round++) {
    let msg;
    let finish;
    const data = await complete(keys, `${baseUrl}/chat/completions`, { model, max_tokens: 700, temperature: 0.4, reasoning: { enabled: false }, messages: convo, tools: [TOOL] });
    msg = data?.choices?.[0]?.message;
    finish = data?.choices?.[0]?.finish_reason;
    if (!msg) return res.status(502).json({ error: 'Sur is resting for a moment. Please call 099676 63017.' });
    const calls = msg.tool_calls || [];
    if (!calls.length) {
      const reply = trimList(cleanReply(msg.content));
      if ((!reply || finish === 'length' || leaked(reply)) && round < 2) {
        convo.push({ role: 'system', content: 'Reply to the guest directly now, in character and in the required short format. Never describe your reasoning or mention "the user".' });
        continue;
      }
      const safe = reply && !leaked(reply) ? reply : 'Sorry, I missed that. Could you ask me once more?';
      return res.status(200).json({ reply: safe || 'Thank you! Our team will be in touch shortly.', booked });
    }
    convo.push(msg);
    for (const c of calls) {
      let out = 'Unknown tool';
      if (c.function?.name === 'capture_reservation') {
        let args = {};
        try { args = JSON.parse(c.function.arguments || '{}'); } catch {}
        console.log('NEW RESERVATION', JSON.stringify(args));
        if (process.env.LEAD_WEBHOOK_URL) await post(process.env.LEAD_WEBHOOK_URL, {}, { source: 'bamboocafe-sur', ...args });
        booked = true;
        out = 'Reservation request saved. The The Bamboo Cafe team will confirm by phone.';
      }
      convo.push({ role: 'tool', tool_call_id: c.id, content: out });
    }
  }
  res.status(200).json({ reply: 'Your request is noted. Our team will confirm shortly.', booked });
}
