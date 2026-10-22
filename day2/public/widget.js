/*
 * TAMM Real Estate AI assistant widget.
 * Embed: <script src="https://YOUR-HOST/widget.js" defer></script>
 * Optional: data-api="https://YOUR-HOST" when the script is served from another origin.
 */
(function () {
  if (window.TammAssistant) return;

  const script = document.currentScript;
  const API = (script && script.dataset.api) || (script ? new URL(script.src).origin : '');
  const WHATSAPP = '971506285858';
  const LOGO = 'https://tammrealestate.ae/wp-content/uploads/2026/09/Untitled-design-1.png';
  const STORE_KEY = 'tamm-assistant-v1';

  const T = {
    en: {
      title: 'TAMM Assistant',
      status: 'Online now',
      welcome:
        "Hello and welcome to **TAMM Real Estate**. I can help you explore off-plan projects in Dubai and Abu Dhabi, compare payment plans, and arrange a call with an advisor.\n\nWhat are you looking for today?",
      chips: ['Off-plan under AED 2M', 'Villas with a payment plan', 'Best for investment?', 'Is my money safe off-plan?', 'Talk to an advisor'],
      placeholder: 'Type your message…',
      send: 'Send',
      teaser: 'Looking for off-plan in Dubai? Ask me anything.',
      open: 'Open chat',
      close: 'Close chat',
      wa: 'Continue on WhatsApp',
      reset: 'New conversation',
      lang: 'العربية',
      from: 'From',
      onRequest: 'Price on request',
      view: 'View project',
      ask: 'Ask about this',
      handover: 'Handover',
      leadSaved: 'Details sent to a TAMM advisor',
      error: "Sorry, I couldn't reply just now. Please try again or message us on WhatsApp.",
      powered: 'AI assistant · answers may need advisor confirmation',
      waText: "Hello TAMM, I'd like more information about your off-plan projects."
    },
    ar: {
      title: 'مساعد تمام',
      status: 'متصل الآن',
      welcome:
        'أهلاً بك في **تمام للعقارات**. أستطيع مساعدتك في استكشاف مشاريع على الخارطة في دبي وأبوظبي، ومقارنة خطط الدفع، وترتيب مكالمة مع مستشار.\n\nعن ماذا تبحث اليوم؟',
      chips: ['مشاريع أقل من 2 مليون درهم', 'فلل مع خطة دفع', 'الأفضل للاستثمار؟', 'هل أموالي آمنة؟', 'التحدث مع مستشار'],
      placeholder: 'اكتب رسالتك…',
      send: 'إرسال',
      teaser: 'تبحث عن عقار على الخارطة في دبي؟ اسألني.',
      open: 'فتح المحادثة',
      close: 'إغلاق المحادثة',
      wa: 'تابع عبر واتساب',
      reset: 'محادثة جديدة',
      lang: 'English',
      from: 'يبدأ من',
      onRequest: 'السعر عند الطلب',
      view: 'عرض المشروع',
      ask: 'اسأل عن هذا',
      handover: 'التسليم',
      leadSaved: 'تم إرسال بياناتك إلى مستشار تمام',
      error: 'عذراً، لم أتمكن من الرد الآن. حاول مرة أخرى أو راسلنا عبر واتساب.',
      powered: 'مساعد ذكي · قد تحتاج الإجابات إلى تأكيد من مستشار',
      waText: 'مرحباً تمام، أود الحصول على معلومات عن مشاريعكم على الخارطة.'
    }
  };

  const state = loadState() || { lang: 'en', messages: [], leadCaptured: false };
  let listings = [];
  let busy = false;
  let isOpen = false;

  const host = document.createElement('div');
  host.id = 'tamm-assistant';
  const root = host.attachShadow({ mode: 'open' });
  root.innerHTML = `<style>${css()}</style>
    <div class="teaser" part="teaser" hidden>
      <button class="teaser-close" aria-label="Dismiss">×</button>
      <span class="teaser-text"></span>
    </div>
    <button class="launcher" aria-haspopup="dialog" aria-expanded="false">
      <svg class="ic-chat" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.2 3.6c-.5.4-1.3.1-1.3-.6V16A2.5 2.5 0 0 1 4 13.5z"/></svg>
      <svg class="ic-close" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      <span class="dot" aria-hidden="true"></span>
    </button>
    <section class="panel" role="dialog" aria-modal="false" aria-labelledby="tamm-title" hidden>
      <header>
        <div class="brand">
          <div class="avatar"><img src="${LOGO}" alt="" onerror="this.remove()"><span>T</span></div>
          <div>
            <h2 id="tamm-title"></h2>
            <p class="status"><i></i><span></span></p>
          </div>
        </div>
        <div class="actions">
          <button class="icon lang" title=""></button>
          <a class="icon wa" target="_blank" rel="noopener" title="">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.3-.5-.4z"/></svg>
          </a>
          <button class="icon reset" title="">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5"/></svg>
          </button>
          <button class="icon close" title="">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
          </button>
        </div>
      </header>
      <div class="log" role="log" aria-live="polite"></div>
      <div class="chips"></div>
      <form class="composer">
        <textarea rows="1" maxlength="1000"></textarea>
        <button type="submit" class="send" aria-label="">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5z"/></svg>
        </button>
      </form>
      <p class="powered"></p>
    </section>`;
  document.body.appendChild(host);

  const $ = (s) => root.querySelector(s);
  const panel = $('.panel');
  const launcher = $('.launcher');
  const log = $('.log');
  const chips = $('.chips');
  const input = $('textarea');
  const form = $('.composer');
  const teaser = $('.teaser');

  launcher.addEventListener('click', () => (isOpen ? close() : open()));
  $('.close').addEventListener('click', close);
  $('.lang').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    saveState();
    applyLang();
    render();
  });
  $('.reset').addEventListener('click', () => {
    state.messages = [];
    state.leadCaptured = false;
    saveState();
    render();
    input.focus();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(input.value);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input.value);
    }
  });
  input.addEventListener('input', autoGrow);
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) close();
  });
  teaser.querySelector('.teaser-close').addEventListener('click', (e) => {
    e.stopPropagation();
    teaser.hidden = true;
    sessionStorageSet('tamm-teaser-dismissed', '1');
  });
  teaser.addEventListener('click', () => open());

  applyLang();
  render();
  fetch(API + '/api/listings')
    .then((r) => r.json())
    .then((data) => {
      listings = data;
      render();
    })
    .catch(() => {});

  setTimeout(() => {
    if (!isOpen && !state.messages.length && !sessionStorageGet('tamm-teaser-dismissed')) teaser.hidden = false;
  }, 3500);

  window.TammAssistant = {
    open(message) {
      open();
      if (message) send(message);
    },
    close
  };

  function open() {
    isOpen = true;
    panel.hidden = false;
    teaser.hidden = true;
    launcher.classList.add('active');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', t().close);
    requestAnimationFrame(() => panel.classList.add('in'));
    scrollDown();
    setTimeout(() => input.focus(), 150);
  }

  function close() {
    isOpen = false;
    panel.classList.remove('in');
    launcher.classList.remove('active');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', t().open);
    setTimeout(() => {
      if (!isOpen) panel.hidden = true;
    }, 200);
    launcher.focus();
  }

  async function send(text) {
    text = (text || '').trim();
    if (!text || busy) return;
    input.value = '';
    autoGrow();
    state.messages.push({ role: 'user', content: text });
    saveState();
    render();
    setBusy(true);

    try {
      const res = await fetch(API + '/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages(), lang: state.lang })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) throw new Error(data.error || 'error');
      state.messages.push({ role: 'assistant', content: data.reply });
      if (data.leadCaptured) {
        state.leadCaptured = true;
        state.messages.push({ role: 'system', content: t().leadSaved });
      }
    } catch (err) {
      state.messages.push({ role: 'error', content: err.message && err.message !== 'error' ? err.message : t().error });
    }
    setBusy(false);
    saveState();
    render();
  }

  // Chat history for the API: only user/assistant turns, consecutive same-role turns merged,
  // starting with the visitor (the welcome message is UI only).
  function apiMessages() {
    const out = [];
    for (const m of state.messages) {
      if (m.role !== 'user' && m.role !== 'assistant') continue;
      const last = out[out.length - 1];
      if (last && last.role === m.role) last.content += '\n' + m.content;
      else out.push({ role: m.role, content: m.content });
    }
    const recent = out.slice(-30);
    while (recent.length && recent[0].role !== 'user') recent.shift();
    return recent;
  }

  function setBusy(v) {
    busy = v;
    $('.send').disabled = v;
    const typing = log.querySelector('.typing');
    if (v && !typing) {
      const el = document.createElement('div');
      el.className = 'row bot typing';
      el.innerHTML = '<div class="bubble"><span></span><span></span><span></span></div>';
      log.appendChild(el);
      scrollDown();
    } else if (!v && typing) typing.remove();
  }

  function render() {
    log.innerHTML = '';
    log.appendChild(messageEl('assistant', t().welcome));
    for (const m of state.messages) log.appendChild(messageEl(m.role, m.content));
    chips.innerHTML = '';
    if (!state.messages.length) {
      for (const c of t().chips) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = c;
        b.addEventListener('click', () => send(c));
        chips.appendChild(b);
      }
    }
    chips.hidden = !!state.messages.length;
    scrollDown();
  }

  function messageEl(role, content) {
    const row = document.createElement('div');
    if (role === 'system') {
      row.className = 'notice';
      row.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>${esc(content)}`;
      return row;
    }
    if (role === 'error') {
      row.className = 'row bot';
      row.innerHTML = `<div class="bubble error">${esc(content)}</div>`;
      return row;
    }
    row.className = 'row ' + (role === 'user' ? 'me' : 'bot');
    if (role === 'user') {
      row.innerHTML = `<div class="bubble">${esc(content)}</div>`;
      return row;
    }

    const ids = [];
    const text = content.replace(/\[\[property:([a-z0-9-]+)\]\]/gi, (_, id) => {
      ids.push(id.toLowerCase());
      return '';
    });
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = markdown(text.trim());
    row.appendChild(bubble);

    const cards = [...new Set(ids)].map((id) => listings.find((l) => l.id === id)).filter(Boolean);
    if (cards.length) {
      const wrap = document.createElement('div');
      wrap.className = 'cards';
      for (const l of cards) wrap.appendChild(cardEl(l));
      row.appendChild(wrap);
    }
    return row;
  }

  function cardEl(l) {
    const el = document.createElement('article');
    el.className = 'card';
    const price = l.priceFrom
      ? `${t().from} <b>AED ${Number(l.priceFrom).toLocaleString('en-US')}</b>`
      : `<b>${t().onRequest}</b>`;
    el.innerHTML = `
      <div class="img" style="background-image:url('${encodeURI(l.image)}')"><span class="tag">${esc(l.status)}</span></div>
      <div class="body">
        <h3>${esc(l.name)}</h3>
        <p class="loc">${esc(l.area)}</p>
        <p class="price">${price}</p>
        <p class="meta">${[l.type, l.bedrooms, l.handover && `${t().handover} ${l.handover}`].filter(Boolean).map(esc).join(' · ')}</p>
        <div class="btns">
          <a href="${encodeURI(l.url)}" target="_blank" rel="noopener">${t().view}</a>
          <button type="button">${t().ask}</button>
        </div>
      </div>`;
    el.querySelector('button').addEventListener('click', () =>
      send(state.lang === 'ar' ? `أخبرني المزيد عن ${l.name}` : `Tell me more about ${l.name}`)
    );
    return el;
  }

  function applyLang() {
    const s = t();
    panel.dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    teaser.dir = panel.dir;
    $('#tamm-title').textContent = s.title;
    $('.status span').textContent = s.status;
    $('.teaser-text').textContent = s.teaser;
    input.placeholder = s.placeholder;
    input.setAttribute('aria-label', s.placeholder);
    $('.send').setAttribute('aria-label', s.send);
    $('.lang').textContent = state.lang === 'en' ? 'عربي' : 'EN';
    $('.lang').title = s.lang;
    $('.lang').setAttribute('aria-label', s.lang);
    const wa = $('.wa');
    wa.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(s.waText)}`;
    wa.title = s.wa;
    wa.setAttribute('aria-label', s.wa);
    $('.reset').title = s.reset;
    $('.reset').setAttribute('aria-label', s.reset);
    $('.close').title = s.close;
    $('.close').setAttribute('aria-label', s.close);
    launcher.setAttribute('aria-label', isOpen ? s.close : s.open);
    $('.powered').textContent = s.powered;
  }

  function t() {
    return T[state.lang] || T.en;
  }

  function markdown(s) {
    const lines = esc(s).split('\n');
    let html = '';
    let inList = false;
    for (const raw of lines) {
      const line = raw.trim();
      const bullet = line.match(/^[-*•]\s+(.*)/);
      if (bullet) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        html += `<li>${inline(bullet[1])}</li>`;
        continue;
      }
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      if (line) html += `<p>${inline(line)}</p>`;
    }
    if (inList) html += '</ul>';
    return html;
  }

  function inline(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s<]+[^\s<.,)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')
      .replace(/(\+971[\d\s]{8,13}\d)/g, (m) => `<a href="https://wa.me/${m.replace(/\D/g, '')}" target="_blank" rel="noopener">${m}</a>`);
  }

  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function autoGrow() {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  }

  function scrollDown() {
    requestAnimationFrame(() => (log.scrollTop = log.scrollHeight));
  }

  function loadState() {
    try {
      return JSON.parse(sessionStorage.getItem(STORE_KEY));
    } catch {
      return null;
    }
  }

  function saveState() {
    sessionStorageSet(STORE_KEY, JSON.stringify(state));
  }

  function sessionStorageGet(k) {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  }

  function sessionStorageSet(k, v) {
    try {
      sessionStorage.setItem(k, v);
    } catch {}
  }

  function css() {
    return `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: "Inter", "Segoe UI", system-ui, -apple-system, "Noto Sans Arabic", sans-serif; }
    [hidden] { display: none !important; }
    :host {
      --navy: #0d1b2a; --navy-2: #1b2d44; --gold: #c9a24b; --gold-2: #e3c27a;
      --bg: #f6f4ef; --card: #ffffff; --text: #1d2430; --muted: #6b7380; --line: #e7e2d8;
    }
    .launcher {
      position: fixed; right: 24px; bottom: 24px; z-index: 2147483000;
      width: 62px; height: 62px; border-radius: 50%; border: 0; cursor: pointer;
      background: linear-gradient(145deg, var(--gold-2), var(--gold)); color: var(--navy);
      box-shadow: 0 10px 30px rgba(13,27,42,.35); display: grid; place-items: center;
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .launcher:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 14px 36px rgba(13,27,42,.42); }
    .launcher:focus-visible, button:focus-visible, a:focus-visible, textarea:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
    .launcher svg { width: 28px; height: 28px; position: absolute; transition: opacity .2s, transform .2s; }
    .ic-chat { fill: var(--navy); }
    .ic-close { fill: none; stroke: var(--navy); stroke-width: 2.4; stroke-linecap: round; opacity: 0; transform: rotate(-90deg); }
    .launcher.active .ic-chat { opacity: 0; transform: rotate(90deg); }
    .launcher.active .ic-close { opacity: 1; transform: none; }
    .dot { position: absolute; top: 4px; right: 4px; width: 14px; height: 14px; border-radius: 50%; background: #22c55e; border: 2px solid #fff; }
    .launcher.active .dot { display: none; }

    .teaser {
      position: fixed; right: 24px; bottom: 98px; z-index: 2147483000; max-width: 260px;
      background: #fff; color: var(--text); padding: 14px 34px 14px 16px; border-radius: 14px 14px 4px 14px;
      font-size: 14px; line-height: 1.45; box-shadow: 0 10px 30px rgba(13,27,42,.18); cursor: pointer;
      animation: pop .35s ease;
    }
    .teaser-close { position: absolute; top: 6px; right: 8px; border: 0; background: none; font-size: 18px; color: var(--muted); cursor: pointer; }

    .panel {
      position: fixed; right: 24px; bottom: 100px; z-index: 2147483000;
      width: 390px; height: min(640px, calc(100vh - 130px));
      display: flex; flex-direction: column; overflow: hidden;
      background: var(--bg); border-radius: 20px; box-shadow: 0 24px 60px rgba(13,27,42,.30);
      opacity: 0; transform: translateY(16px) scale(.98); transform-origin: bottom right;
      transition: opacity .2s ease, transform .2s ease;
    }
    .panel.in { opacity: 1; transform: none; }

    header {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 16px 14px 16px 16px; color: #fff;
      background: radial-gradient(circle at 0% 0%, var(--navy-2), var(--navy) 70%);
      border-bottom: 2px solid var(--gold);
    }
    .brand { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
    .brand > div:last-child { min-width: 0; }
    .avatar { position: relative; width: 42px; height: 42px; border-radius: 12px; background: #fff; display: grid; place-items: center; overflow: hidden; flex: none; }
    .avatar img { width: 100%; height: 100%; object-fit: contain; position: absolute; inset: 0; background: #fff; }
    .avatar span { font-weight: 700; color: var(--navy); }
    h2 { margin: 0; font-size: 15px; font-weight: 650; letter-spacing: .2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .status { margin: 3px 0 0; font-size: 12px; color: #c8d0db; display: flex; align-items: center; gap: 6px; white-space: nowrap; }
    .status i { flex: none; }
    .status span { overflow: hidden; text-overflow: ellipsis; }
    .status i { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,.25); }
    .actions { display: flex; gap: 2px; flex: none; }
    .icon {
      width: 34px; height: 34px; border-radius: 10px; border: 0; background: transparent; color: #fff;
      display: grid; place-items: center; cursor: pointer; font-size: 15px; font-weight: 600; text-decoration: none;
    }
    .icon:hover { background: rgba(255,255,255,.12); }
    .icon.lang {
      width: auto; min-width: 44px; height: 30px; align-self: center; padding: 0 10px; margin-inline-end: 4px;
      border: 1px solid rgba(227,194,122,.6); border-radius: 999px; color: var(--gold-2);
      font-size: 13px; line-height: 1; white-space: nowrap;
    }
    .icon svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
    .wa svg { fill: #25d366; stroke: none; width: 21px; height: 21px; }

    .log { flex: 1; overflow-y: auto; padding: 18px 14px 8px; display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth; }
    .row { display: flex; flex-direction: column; max-width: 88%; animation: rise .25s ease; }
    .row.bot { align-self: flex-start; }
    .row.me { align-self: flex-end; align-items: flex-end; }
    .bubble { padding: 11px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; color: var(--text); word-wrap: break-word; }
    .bot .bubble { background: var(--card); border: 1px solid var(--line); border-start-start-radius: 4px; }
    .me .bubble { background: var(--navy); color: #fff; border-start-end-radius: 4px; white-space: pre-wrap; }
    .bubble p { margin: 0 0 8px; } .bubble p:last-child { margin: 0; }
    .bubble ul { margin: 4px 0 8px; padding-inline-start: 18px; } .bubble li { margin: 3px 0; }
    .bubble strong { color: var(--navy); font-weight: 650; }
    .bubble a { color: #9a7524; }
    .bubble.error { background: #fff4f2; border-color: #f3c9c0; color: #8a2b1b; }

    .typing .bubble { display: flex; gap: 4px; padding: 14px 16px; }
    .typing span { width: 7px; height: 7px; border-radius: 50%; background: var(--gold); animation: blink 1.2s infinite ease-in-out; }
    .typing span:nth-child(2) { animation-delay: .15s; } .typing span:nth-child(3) { animation-delay: .3s; }

    .notice { align-self: center; display: flex; align-items: center; gap: 6px; font-size: 12px; color: #166534; background: #e9f8ee; border: 1px solid #bfe8cc; padding: 6px 12px; border-radius: 999px; }
    .notice svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 2.6; stroke-linecap: round; }

    .cards { display: flex; gap: 10px; overflow-x: auto; margin-top: 8px; padding-bottom: 4px; scroll-snap-type: x mandatory; max-width: 100%; }
    .card { flex: 0 0 232px; scroll-snap-align: start; background: var(--card); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; }
    .card .img { position: relative; height: 120px; background: #d9d4c8 center/cover no-repeat; }
    .tag { position: absolute; top: 8px; inset-inline-start: 8px; background: rgba(13,27,42,.85); color: var(--gold-2); font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 999px; letter-spacing: .3px; }
    .card .body { padding: 10px 12px 12px; }
    .card h3 { margin: 0; font-size: 14px; color: var(--navy); line-height: 1.3; }
    .card .loc { margin: 3px 0 6px; font-size: 12px; color: var(--muted); }
    .card .price { margin: 0; font-size: 13px; color: var(--text); }
    .card .price b { color: #9a7524; }
    .card .meta { margin: 4px 0 10px; font-size: 11.5px; color: var(--muted); }
    .btns { display: flex; gap: 6px; }
    .btns a, .btns button { flex: 1; text-align: center; font-size: 12px; font-weight: 600; padding: 7px 6px; border-radius: 9px; cursor: pointer; text-decoration: none; }
    .btns a { border: 1px solid var(--navy); color: var(--navy); background: #fff; }
    .btns button { border: 1px solid var(--gold); background: var(--gold); color: var(--navy); }

    .chips { display: flex; flex-wrap: wrap; gap: 6px; padding: 4px 14px 10px; }
    .chips button { border: 1px solid var(--gold); background: #fff; color: var(--navy); font-size: 12.5px; padding: 7px 12px; border-radius: 999px; cursor: pointer; transition: background .15s; }
    .chips button:hover { background: #fbf4e4; }

    .composer { display: flex; align-items: flex-end; gap: 8px; margin: 0 12px; padding: 8px 8px 8px 14px; background: #fff; border: 1px solid var(--line); border-radius: 16px; }
    .composer:focus-within { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,162,75,.18); }
    textarea { flex: 1; border: 0; outline: none; resize: none; font-size: 14px; line-height: 1.45; max-height: 120px; padding: 6px 0; background: transparent; color: var(--text); }
    .send { width: 38px; height: 38px; flex: none; border: 0; border-radius: 12px; cursor: pointer; background: var(--navy); color: var(--gold-2); display: grid; place-items: center; }
    .send:disabled { opacity: .5; cursor: default; }
    .send svg { width: 18px; height: 18px; fill: currentColor; }
    [dir="rtl"] .send svg { transform: scaleX(-1); }
    .powered { margin: 6px 0 10px; text-align: center; font-size: 10.5px; color: var(--muted); }

    @keyframes rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes pop { from { opacity: 0; transform: translateY(8px) scale(.96); } to { opacity: 1; transform: none; } }
    @keyframes blink { 0%, 80%, 100% { opacity: .25; transform: scale(.85); } 40% { opacity: 1; transform: scale(1); } }

    @media (max-width: 480px) {
      .panel { right: 0; bottom: 0; width: 100vw; height: 100dvh; border-radius: 0; }
      .launcher { right: 16px; bottom: 16px; }
      .launcher.active { display: none; }
      header { padding: 12px 8px 12px 12px; }
      .icon { width: 32px; }
      .teaser { right: 16px; bottom: 90px; }
    }
    @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
    `;
  }
})();
