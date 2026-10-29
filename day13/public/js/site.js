/* Shared by every page: header, night walk, fireflies, tilt, coverflow, menu picks, WhatsApp forms, Sabuj chat */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover: hover) and (pointer: fine)').matches;
const small=innerWidth<760;
const WA='919365773300';
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const LEAF='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 29C9 25 5 19 6 11c6-1 12 2 14 8 1-6-1-11-6-15 9 1 14 7 13 15-1 6-5 9-11 10z" fill="#9BF2B8" opacity=".9"/><path d="M16 29c0-8 2-14 7-20" stroke="#E8CD8F" stroke-width="1.4" fill="none"/></svg>';

/* ---------- header: clear over dark heroes, solid once you scroll ---------- */
const head=$('.head');
const solid=()=>{const w=$('.walk');head.classList.toggle('solid',scrollY>(w?w.offsetHeight-innerHeight*.9:60))};
solid();addEventListener('scroll',solid,{passive:true});
$('#menuBtn').onclick=()=>{const o=document.body.classList.toggle('menu-open');$('#menuBtn').setAttribute('aria-expanded',o)};
$$('.nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

/* ---------- toast ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="toast" role="status"></div>');
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2800)}

/* ---------- fireflies: soft green-gold lights drifting over night scenes ---------- */
$$('canvas.flies').forEach(cv=>{
  if(reduce)return;
  const ctx=cv.getContext('2d');let W,H,dpr=Math.min(devicePixelRatio||1,2),run=false;
  const N=small?24:46,P=[];
  const size=()=>{W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};
  size();addEventListener('resize',size);
  for(let i=0;i<N;i++)P.push({x:Math.random(),y:.25+Math.random()*.75,r:1+Math.random()*2.2,s:.2+Math.random()*.6,a:Math.random()*6.28,g:Math.random()<.3});
  const draw=t=>{if(!run)return;ctx.clearRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
    for(const p of P){p.a+=.006*p.s;p.x+=Math.cos(p.a*1.3)*.0004*p.s;p.y+=Math.sin(p.a)*.0003*p.s-.00012;if(p.y<.15)p.y=1;if(p.x<0)p.x=1;if(p.x>1)p.x=0;
      const x=p.x*W,y=p.y*H,b=.35+.65*Math.abs(Math.sin(t/900*p.s+p.a)),R=p.r*3.6;
      const gr=ctx.createRadialGradient(x,y,0,x,y,R);const c=p.g?'232,205,143':'155,242,184';
      gr.addColorStop(0,`rgba(${c},${.9*b})`);gr.addColorStop(.3,`rgba(${c},${.35*b})`);gr.addColorStop(1,`rgba(${c},0)`);
      ctx.fillStyle=gr;ctx.beginPath();ctx.arc(x,y,R,0,6.28);ctx.fill()}
    requestAnimationFrame(draw)};
  new IntersectionObserver(([e])=>{const was=run;run=e.isIntersecting;if(run&&!was)requestAnimationFrame(draw)}).observe(cv);
});

/* ---------- HOME: the night walk. Scrolling moves a camera forward through lit photos of the grounds ---------- */
const walk=$('.walk');
if(walk){
  const planes=$$('.plane',walk),caps=$$('.cap',walk),ticks=$$('.meter i',walk),title=$('.walk-title',walk),cue=$('.cue',walk);
  const D=small?1300:1600,N=planes.length;let last=-1,raf=0;
  const frame=()=>{raf=0;
    const r=walk.getBoundingClientRect(),span=walk.offsetHeight-innerHeight;
    const p=clamp(-r.top/span),cam=p*(N-1)*D;
    planes.forEach((pl,i)=>{const z=cam-i*D;
      const o=z>0?clamp(1-z/(D*.32)):clamp((z+D*1.6)/(D*.8));
      pl.style.transform=`translate(-50%,-50%) translateZ(${z.toFixed(1)}px)`;pl.style.opacity=o.toFixed(3);
      pl.style.visibility=o<.01?'hidden':'visible'});
    title.style.opacity=clamp(1-p*9);title.style.transform=`translateY(${-p*240}px)`;cue.style.opacity=clamp(1-p*12);
    const k=p<.04?-1:Math.min(N-1,Math.round(cam/D));
    if(k!==last){last=k;caps.forEach((c,i)=>c.classList.toggle('on',i===k));ticks.forEach((t,i)=>t.classList.toggle('on',i===Math.max(0,k)))}};
  const req=()=>{if(!raf)raf=requestAnimationFrame(frame)};
  if(!reduce){frame();addEventListener('scroll',req,{passive:true});addEventListener('resize',req)}
  else{caps[0]?.classList.add('on')}
}

/* ---------- reveal headings once, as they arrive ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
$$('.rise').forEach(el=>io.observe(el));

/* ---------- cards lean toward the pointer (desktop only) ---------- */
if(fine&&!reduce)$$('[data-tilt]').forEach(el=>{
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    el.style.transform=`rotateY(${x*8}deg) rotateX(${-y*8}deg) translateZ(0)`});
  el.addEventListener('pointerleave',()=>el.style.transform='')});

/* ---------- horizontal rail arrows ---------- */
$$('[data-rail]').forEach(b=>b.onclick=()=>{const r=$(b.dataset.rail);r.scrollBy({left:(b.dataset.dir==='1'?1:-1)*Math.min(660,r.clientWidth*.8),behavior:'smooth'})});

/* ---------- night mosaic parallax ---------- */
const mos=$$('.mosaic img');
if(mos.length&&!reduce){const par=()=>{for(const im of mos){const r=im.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;
  im.style.setProperty('--py',`${((r.top+r.height/2)/innerHeight-.5)*-34-16}px`)}};par();addEventListener('scroll',()=>requestAnimationFrame(par),{passive:true})}

/* ---------- celebrate: 3D coverflow ---------- */
$$('.flow').forEach(flow=>{
  const items=$$('figure',flow);let act=Math.floor(items.length/2),timer;
  const set=i=>{act=(i+items.length)%items.length;items.forEach((f,k)=>{let d=k-act;if(d>items.length/2)d-=items.length;if(d<-items.length/2)d+=items.length;
    const a=Math.abs(d),s=Math.sign(d);
    f.style.transform=`translateX(${d*(small?46:58)}%) translateZ(${-a*(small?120:170)}px) rotateY(${-s*Math.min(a,1)*38}deg)`;
    f.style.opacity=a>3?0:1-a*.18;f.style.zIndex=10-a;f.style.filter=a?`brightness(${1-a*.16})`:'none';f.setAttribute('aria-hidden',a?'true':'false')})};
  const auto=()=>{clearInterval(timer);if(!reduce)timer=setInterval(()=>set(act+1),4200)};
  items.forEach((f,k)=>f.onclick=()=>{set(k);auto()});
  const nav=flow.nextElementSibling;if(nav?.classList.contains('flow-nav')){$('[data-d="-1"]',nav).onclick=()=>{set(act-1);auto()};$('[data-d="1"]',nav).onclick=()=>{set(act+1);auto()}}
  let x0=null;flow.addEventListener('pointerdown',e=>x0=e.clientX);
  flow.addEventListener('pointerup',e=>{if(x0===null)return;const dx=e.clientX-x0;x0=null;if(Math.abs(dx)>40){set(act+(dx<0?1:-1));auto()}});
  set(act);auto();
});

/* ---------- dine: menu tabs and dish picks for a pre-order ---------- */
const tabs=$('.tabs');
if(tabs){const bs=$$('button',tabs);bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>x.setAttribute('aria-selected',x===b));$$('.board').forEach(bd=>bd.hidden=bd.id!==b.dataset.board)})}
const picked=new Set();
$$('.pick').forEach(b=>b.onclick=()=>{const n=b.dataset.dish,on=!picked.has(n);on?picked.add(n):picked.delete(n);b.setAttribute('aria-pressed',on);b.textContent=on?'Added':'Add';
  const out=$('#picked'),hid=$('#dishes');if(out)out.textContent=picked.size?`Your list: ${[...picked].join(', ')}`:'';if(hid)hid.value=[...picked].join(', ');
  if(on)toast(`${n} added to your pre-order`)});

/* ---------- every request form goes straight to the resort's WhatsApp ---------- */
const today=new Date().toLocaleDateString('en-CA');
$$('input[type="date"]').forEach(i=>i.min=today);
const nice=v=>/^\d{4}-\d{2}-\d{2}$/.test(v)?new Date(v+'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short',year:'numeric'}):v;
$$('form[data-wa]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;
  const lines=$$('input,select,textarea',f).filter(x=>x.name&&x.value.trim()).map(x=>`${x.name}: ${nice(x.value.trim())}`);
  const msg=`*${f.dataset.wa}*\nKumar's Green Resort website\n\n${lines.join('\n')}`;
  open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank','noopener');toast('Opening WhatsApp with your request')}));

/* ---------- Sabuj, the AI concierge (sabuj means green) ---------- */
document.body.insertAdjacentHTML('beforeend',`
<button id="fab" aria-label="Chat with Sabuj"><span class="av">${LEAF}</span>Ask Sabuj</button>
<div id="chat" role="dialog" aria-label="Chat with Sabuj">
  <div class="ch"><span class="av">${LEAF}</span><div><b>Sabuj</b><small>AI concierge, Kumar's Green Resort</small></div><button class="x" id="chatX" aria-label="Close chat">✕</button></div>
  <div id="msgs" aria-live="polite"></div>
  <div id="sug"><button>Room rates for this weekend?</button><button>What's special on the menu?</button><button>Plan a birthday on the lawn</button><button>How do I reach you?</button></div>
  <form id="cf"><input id="ci" placeholder="Ask about rooms, food, events…" autocomplete="off" aria-label="Message"><button>Send</button></form>
</div>`);
const hist=[];let busy=false;
/* Render the reply as clean HTML: escape everything, then allow **bold**, "- " lists and paragraphs */
function fmt(t){const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'$1');
  const out=[];let list=null;for(const raw of String(t).replace(/\r/g,'').split('\n')){const l=raw.trim();const m=l.match(/^(?:[-*•]|\d+[.)])\s+(.*)/);
  if(m){if(!list){list=[];out.push(list)}list.push(m[1])}else{list=null;if(l)out.push(l)}}
  return out.map(x=>Array.isArray(x)?'<ul>'+x.map(i=>'<li>'+bold(i)+'</li>').join('')+'</ul>':'<p>'+bold(x)+'</p>').join('')}
function addMsg(t,w){const d=document.createElement('div');d.className='m '+w;if(w==='b')d.innerHTML=fmt(t);else d.textContent=t;$('#msgs').append(d);$('#msgs').scrollTop=1e9}
function openChat(){$('#chat').classList.add('on');$('#fab').style.visibility='hidden';
  if(!$('#msgs').children.length)addMsg("Namaskar! I'm **Sabuj**, the AI concierge at Kumar's Green Resort. Ask me about rooms, the menu or the wedding lawn, or I can send your request to the team.",'b');
  $('#ci').focus()}
function closeChat(){$('#chat').classList.remove('on');$('#fab').style.visibility='';$('#fab').focus({preventScroll:true})}
$('#fab').onclick=openChat;$('#chatX').onclick=closeChat;$$('[data-chat]').forEach(b=>b.onclick=e=>{e.preventDefault();openChat()});
$('#sug').onclick=e=>{if(e.target.tagName==='BUTTON')send(e.target.textContent)};
$('#cf').onsubmit=e=>{e.preventDefault();const v=$('#ci').value.trim();if(v){$('#ci').value='';send(v)}};
addEventListener('keydown',e=>{if(e.key!=='Escape')return;if($('#chat').classList.contains('on'))closeChat();else document.body.classList.remove('menu-open')});
async function send(t){if(busy)return;busy=true;$('#sug').style.display='none';addMsg(t,'u');hist.push({role:'user',content:t});
  const ty=document.createElement('div');ty.className='m b typing';ty.innerHTML='<i></i><i></i><i></i>';$('#msgs').append(ty);$('#msgs').scrollTop=1e9;
  try{const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:hist})});const j=await r.json();ty.remove();
    const reply=j.reply||'Sabuj could not answer. Please try again in a moment.';addMsg(reply,'b');if(j.reply)hist.push({role:'assistant',content:reply});if(j.booked)toast('Request sent to the team')}
  catch{ty.remove();addMsg('No connection. Check your internet and try again.','b')}busy=false}
