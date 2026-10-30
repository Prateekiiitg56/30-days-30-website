/* Shared by every page: header, hero walk, coverflow, mosaic parallax, menu tabs, WhatsApp order cart, forms, Swad chat */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const small=innerWidth<760;
const WA='916003227964';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const inr=n=>'₹'+n.toLocaleString('en-IN');
const SPARK='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3l3.2 9.3L28 14l-7.4 5.4L23.3 29 16 23.4 8.7 29l2.7-9.6L4 14l8.8-1.7z" fill="#FFE2A6"/></svg>';

/* ---------- header ---------- */
const head=$('.head');
const solid=()=>{const w=$('.walk');head.classList.toggle('solid',scrollY>(w?w.offsetHeight-innerHeight*.9:40))};
solid();addEventListener('scroll',solid,{passive:true});
$('#menuBtn').onclick=()=>{const o=document.body.classList.toggle('menu-open');$('#menuBtn').setAttribute('aria-expanded',o)};
$$('.nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

document.body.insertAdjacentHTML('beforeend','<div id="toast" role="status"></div>');
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2800)}

/* ---------- HOME: scroll walk. Each scene holds, then the next opens from the centre like a light switching on ---------- */
const walk=$('.walk');
if(walk){
  const planes=$$('.plane',walk),caps=$$('.cap',walk),ticks=$$('.meter i',walk),title=$('.walk-title',walk),cue=$('.cue',walk);
  const N=planes.length,ease=x=>x*x*(3-2*x);let last=-1,raf=0;
  const frame=()=>{raf=0;
    const r=walk.getBoundingClientRect(),span=walk.offsetHeight-innerHeight;
    const p=clamp(-r.top/span),raw=p*(N-1),i0=Math.min(N-2,Math.floor(raw)),f=raw-i0;
    const t=i0+ease(clamp((f-.32)/.36));
    planes.forEach((pl,i)=>{const d=raw-i;
      const o=i?clamp(t-i+1):1;
      pl.style.visibility=o<.002||i<Math.floor(t)?'hidden':'visible';
      if(o>=1||o<=0){pl.style.webkitMaskImage=pl.style.maskImage='none';pl.style.opacity=o?1:0}
      else{const R=-30+o*170,m=`radial-gradient(ellipse 75% 85% at 50% 58%,#000 ${R.toFixed(1)}%,transparent ${(R+30).toFixed(1)}%)`;
        pl.style.webkitMaskImage=pl.style.maskImage=m;pl.style.opacity=clamp(o*3).toFixed(3)}
      pl.style.transform=`scale(${(1.05+clamp(d,-1,1)*.05).toFixed(4)})`;pl.style.zIndex=i});
    title.style.opacity=clamp(1-p*8);title.style.transform=`translateY(${-p*200}px)`;cue.style.opacity=clamp(1-p*12);
    title.style.visibility=p>.14?'hidden':'visible';
    const k=p<.035?-1:Math.round(t);
    if(k!==last){last=k;caps.forEach((c,i)=>c.classList.toggle('on',i===k));ticks.forEach((x,i)=>x.classList.toggle('on',i===Math.max(0,k)))}};
  const req=()=>{if(!raf)raf=requestAnimationFrame(frame)};
  if(!reduce){frame();addEventListener('scroll',req,{passive:true});addEventListener('resize',req)}
  else{caps[0]?.classList.add('on')}
}

/* ---------- reveal once ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
$$('.rise').forEach(el=>io.observe(el));

/* ---------- mosaic parallax ---------- */
const mos=$$('.mosaic img');
if(mos.length&&!reduce){const par=()=>{for(const im of mos){const r=im.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;
  im.style.setProperty('--py',`${((r.top+r.height/2)/innerHeight-.5)*-34-16}px`)}};par();addEventListener('scroll',()=>requestAnimationFrame(par),{passive:true})}

/* ---------- 3D coverflow ---------- */
$$('.flow').forEach(flow=>{
  const items=$$('figure',flow);let act=Math.floor(items.length/2),timer;
  const set=i=>{act=(i+items.length)%items.length;items.forEach((f,k)=>{let d=k-act;if(d>items.length/2)d-=items.length;if(d<-items.length/2)d+=items.length;
    const a=Math.abs(d),s=Math.sign(d);
    f.style.transform=`translateX(${d*(small?52:62)}%) translateZ(${-a*(small?120:170)}px) rotateY(${-s*Math.min(a,1)*38}deg)`;
    f.style.opacity=a>3?0:1-a*.18;f.style.zIndex=10-a;f.style.filter=a?`brightness(${1-a*.16})`:'none'})};
  const auto=()=>{clearInterval(timer);if(!reduce)timer=setInterval(()=>set(act+1),4200)};
  items.forEach((f,k)=>f.onclick=()=>{set(k);auto()});
  const nav=flow.nextElementSibling;if(nav?.classList.contains('flow-nav')){$('[data-d="-1"]',nav).onclick=()=>{set(act-1);auto()};$('[data-d="1"]',nav).onclick=()=>{set(act+1);auto()}}
  let x0=null;flow.addEventListener('pointerdown',e=>x0=e.clientX);
  flow.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){set(act+(dx<0?1:-1));auto()}});
  set(act);auto();
});

/* ---------- menu tabs ---------- */
const tabs=$('.tabs');
if(tabs){const bs=$$('button',tabs);const show=id=>{bs.forEach(x=>x.setAttribute('aria-selected',x.dataset.board===id));$$('.board').forEach(bd=>bd.hidden=bd.id!==id)};
  bs.forEach(b=>b.onclick=()=>{show(b.dataset.board);history.replaceState(null,'','#'+b.dataset.board);scrollTo({top:$('.tabs').offsetTop-72+2,behavior:'smooth'})});
  const h=location.hash.slice(1);show(bs.some(b=>b.dataset.board===h)?h:bs[0].dataset.board)}

/* ---------- order cart: add, remove, send to Flav's WhatsApp ---------- */
if($('#cart')){
  const cart=new Map();
  try{JSON.parse(sessionStorage.getItem('flavcart')||'[]').forEach(x=>cart.set(x.k,x))}catch{}
  const save=()=>{try{sessionStorage.setItem('flavcart',JSON.stringify([...cart.values()]))}catch{}};
  const total=()=>[...cart.values()].reduce((a,x)=>a+x.p*x.q,0),count=()=>[...cart.values()].reduce((a,x)=>a+x.q,0);
  const draw=()=>{const c=count();$('#bar').classList.toggle('on',c>0);$('#bar').innerHTML=`View order <span>${c} item${c>1?'s':''}</span> ${inr(total())}`;
    $('#lines').innerHTML=c?[...cart.values()].map(x=>`<div class="line"><b>${x.n}</b><div class="qty"><button data-k="${x.k}" data-d="-1" aria-label="Remove one ${x.n}">−</button><span>${x.q}</span><button data-k="${x.k}" data-d="1" aria-label="Add one ${x.n}">+</button></div><small>${x.v?x.v+' · ':''}${inr(x.p)} each</small></div>`).join(''):'<div class="empty">Your order is empty.<br>Pick dishes from the menu.</div>';
    $('#sum').textContent=inr(total());$('#send').disabled=!c;save()};
  const bump=(k,d)=>{const x=cart.get(k);if(!x)return;x.q+=d;if(x.q<=0)cart.delete(k);draw()};
  $$('.vars button').forEach(b=>b.onclick=()=>{const k=b.dataset.n+'|'+(b.dataset.v||''),x=cart.get(k);
    if(x)x.q++;else cart.set(k,{k,n:b.dataset.n,v:b.dataset.v||'',p:+b.dataset.p,q:1});
    b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');draw();toast(`${b.dataset.n} added`)});
  $('#lines').onclick=e=>{const b=e.target.closest('button[data-k]');if(b)bump(b.dataset.k,+b.dataset.d)};
  const open=o=>{$('#cart').classList.toggle('on',o);$('#scrim').classList.toggle('on',o)};
  $('#bar').onclick=()=>open(true);$('#cartX').onclick=()=>open(false);$('#scrim').onclick=()=>open(false);
  $('#send').onclick=()=>{const f=$('#cartForm');if(!f.reportValidity())return;
    const lines=[...cart.values()].map(x=>`${x.q} x ${x.n}${x.v?' ('+x.v+')':''} = ${inr(x.p*x.q)}`).join('\n');
    const msg=`*New order from the Flav website*\n\n${lines}\n\n*Total: ${inr(total())}* (before any taxes)\nType: ${f.type.value}\nName: ${f.cname.value}\nPhone: ${f.cphone.value}${f.cnote.value.trim()?'\nNote: '+f.cnote.value.trim():''}`;
    open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener');toast('Opening WhatsApp with your order')};
  draw();
}

/* ---------- table / party requests go straight to Flav's WhatsApp ---------- */
const today=new Date().toLocaleDateString('en-CA');
$$('input[type="date"]').forEach(i=>i.min=today);
const nice=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)?new Date(v+'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}):v;
$$('form[data-wa]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;
  const lines=$$('input,select,textarea',f).filter(x=>x.name&&x.value.trim()).map(x=>`${x.name}: ${nice(x.value.trim())}`);
  const msg=`*${f.dataset.wa}*\nFlav website\n\n${lines.join('\n')}`;
  open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener');toast('Opening WhatsApp with your request')}));

/* ---------- Swad, the AI host (swad means taste) ---------- */
document.body.insertAdjacentHTML('beforeend',`
<button id="fab" aria-label="Chat with Swad"><span class="av">${SPARK}</span>Ask Swad</button>
<div id="chat" role="dialog" aria-label="Chat with Swad">
  <div class="ch"><span class="av">${SPARK}</span><div><b>Swad</b><small>AI host, Flav Restaurant</small></div><button class="x" id="chatX" aria-label="Close chat">✕</button></div>
  <div id="msgs" aria-live="polite"></div>
  <div id="sug"><button>What should I try first?</button><button>Any veg options?</button><button>Book a table for 4 tonight</button><button>How do I reach you?</button></div>
  <form id="cf"><input id="ci" placeholder="Ask about the menu, a table, an order…" autocomplete="off" aria-label="Message"><button>Send</button></form>
</div>`);
const hist=[];let busy=false;
function fmt(t){const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'$1');
  const out=[];let list=null;for(const raw of String(t).replace(/\r/g,'').split('\n')){const l=raw.trim();const m=l.match(/^(?:[-*•]|\d+[.)])\s+(.*)/);
  if(m){if(!list){list=[];out.push(list)}list.push(m[1])}else{list=null;if(l)out.push(l)}}
  return out.map(x=>Array.isArray(x)?'<ul>'+x.map(i=>'<li>'+bold(i)+'</li>').join('')+'</ul>':'<p>'+bold(x)+'</p>').join('')}
function addMsg(t,w){const d=document.createElement('div');d.className='m '+w;if(w==='b')d.innerHTML=fmt(t);else d.textContent=t;$('#msgs').append(d);$('#msgs').scrollTop=1e9}
function openChat(){$('#chat').classList.add('on');$('#fab').style.visibility='hidden';
  if(!$('#msgs').children.length)addMsg("Hi! I'm **Swad**, the AI host at Flav. Ask me about the menu, a table, or an order, any time of day.",'b');
  $('#ci').focus()}
function closeChat(){$('#chat').classList.remove('on');$('#fab').style.visibility='';$('#fab').focus({preventScroll:true})}
$('#fab').onclick=openChat;$('#chatX').onclick=closeChat;$$('[data-chat]').forEach(b=>b.onclick=e=>{e.preventDefault();openChat()});
$('#sug').onclick=e=>{if(e.target.tagName==='BUTTON')send(e.target.textContent)};
$('#cf').onsubmit=e=>{e.preventDefault();const v=$('#ci').value.trim();if(v){$('#ci').value='';send(v)}};
addEventListener('keydown',e=>{if(e.key!=='Escape')return;if($('#chat').classList.contains('on'))closeChat();else document.body.classList.remove('menu-open')});
async function send(t){if(busy)return;busy=true;$('#sug').style.display='none';addMsg(t,'u');hist.push({role:'user',content:t});
  const ty=document.createElement('div');ty.className='m b typing';ty.innerHTML='<i></i><i></i><i></i>';$('#msgs').append(ty);$('#msgs').scrollTop=1e9;
  try{const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:hist})});const j=await r.json();ty.remove();
    const reply=j.reply||'Swad could not answer. Please try again in a moment.';addMsg(reply,'b');if(j.reply)hist.push({role:'assistant',content:reply});if(j.booked)toast('Request sent to the Flav team')}
  catch{ty.remove();addMsg('No connection. Check your internet and try again.','b')}busy=false}
