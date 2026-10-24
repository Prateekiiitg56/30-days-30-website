/* Shared by every page: header, menu data, order slip (cart), Baanhi chat */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const WA='918133024155';

/* ---------- menu (sample dishes and prices until the real menu card arrives) ---------- */
/* category: [blurb, [[name, 'v' veg | 'n' non-veg, price, note]]] */
const MENU={
 'Thali':['Full Assamese plates, served on the table.',[
   ['Veg Thali','v',150,'rice, dal, bhaji, pitika, papad, salad'],['Fish Thali','n',220,'with a fish curry of the day'],
   ['Chicken Thali','n',250,'with home-style chicken curry'],['Pork Thali','n',280,'with pork curry']]],
 'House specials':['The dishes this place is about.',[
   ['Pork with Bamboo Shoot','n',280,'slow cooked, Assamese style'],['Fish Tenga','n',240,'light, sour fish curry'],
   ['Duck with Ash Gourd','n',380],['Chicken Curry','n',220],['Paneer Butter Masala','v',200],['Dal Fry','v',100]]],
 'Momos':['Steamed or fried, with red chutney.',[
   ['Veg Momo','v',80,'8 pieces'],['Chicken Momo','n',100,'8 pieces'],['Pork Momo','n',120,'8 pieces'],['Fried Chicken Momo','n',120,'8 pieces']]],
 'Starters':['For the table while you wait.',[
   ['Chilli Chicken','n',199],['Chilli Paneer','v',179],['Chicken Pakora','n',149],['Paneer Pakora','v',139],['French Fries','v',99]]],
 'Chinese':['Wok-tossed, roadside favourites.',[
   ['Veg Chowmein','v',90],['Chicken Chowmein','n',120],['Egg Fried Rice','n',120],['Chicken Fried Rice','n',140]]],
 'Rice and roti':['',[
   ['Plain Rice','v',60],['Jeera Rice','v',90],['Tawa Roti','v',15],['Butter Naan','v',45]]],
 'Drinks':['',[
   ['Lal Saah','v',20,'red tea'],['Milk Tea','v',25],['Fresh Lime Soda','v',60],['Sweet Lassi','v',70],['Cold Drink','v',40]]],
 'Desserts':['',[
   ['Gulab Jamun','v',40,'2 pieces'],['Ice Cream','v',60]]]
};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const ITEMS={};
for(const cat in MENU)for(const [n,t,pr,note] of MENU[cat][1])ITEMS[slug(n)]={n,t,pr,note};
const rs=n=>'₹'+n.toLocaleString('en-IN');
const vgMark=t=>`<span class="vg${t==='n'?' n':''}" role="img" aria-label="${t==='n'?'Non-veg':'Veg'}"></span>`;

/* ---------- header ---------- */
const head=$('.head');
/* on the home page the header stays clear over the film and turns solid once the film is done */
const heroEl=$('#hero');
const solid=()=>head.classList.toggle('solid',heroEl?scrollY>heroEl.offsetHeight-innerHeight*1.1:true);
solid();addEventListener('scroll',solid,{passive:true});

/* ---------- toast ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="toast" role="status"></div>');
function toast(t,action){const e=$('#toast');e.innerHTML='';e.append(t);
  if(action){const b=document.createElement('button');b.textContent=action[0];b.onclick=action[1];e.append(b)}
  e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2600)}

/* ---------- cart: item id -> quantity, kept in this browser so it follows you across pages ---------- */
let cart={};
try{cart=JSON.parse(localStorage.getItem('pragya-cart')||'{}')}catch{}
for(const id in cart)if(!ITEMS[id])delete cart[id];
function setQty(id,q,bump){if(!ITEMS[id])return;if(q>0)cart[id]=q;else delete cart[id];
  try{localStorage.setItem('pragya-cart',JSON.stringify(cart))}catch{}
  renderCart(bump)}
function qtyHTML(id){const q=cart[id]||0;return q?`<button data-d="-1" aria-label="Remove one">−</button><b>${q}</b><button data-d="1" aria-label="Add one">+</button>`:`<button class="add" data-d="1">Add</button>`}
function paintQty(){$$('.qty[data-id]').forEach(s=>{s.innerHTML=qtyHTML(s.dataset.id);s.classList.toggle('on',!!cart[s.dataset.id])})}
document.addEventListener('click',e=>{const b=e.target.closest('.qty[data-id] button');if(!b)return;const id=b.parentElement.dataset.id,d=+b.dataset.d;
  const q=(cart[id]||0)+d;setQty(id,q,d>0);if(d>0&&q===1)toast(`${ITEMS[id].n} added`,['View order',openCart])});

document.body.insertAdjacentHTML('beforeend',`
<div id="cart" aria-hidden="true">
  <div class="scrim" data-close></div>
  <div class="sheet" role="dialog" aria-label="Your order">
    <div class="sh"><h3>Your order</h3><button class="x" data-close aria-label="Close">✕</button></div>
    <div class="sb">
      <div class="slot"></div>
      <div class="feed"><div class="paper" id="paper">
        <div class="c"><div class="shop">PRAGYA BAMBOO<br>RESTAURANT</div><div class="sm">NH 15, near Gas Agency, Dangiyapar<br>Madhabpur, Assam 784164<br>Ph: 081330 24155</div></div>
        <hr>
        <div class="meta"><span>Bill No: <b id="bno"></b></span><span id="bdate"></span><span>Order: <b id="btype">TAKEAWAY</b></span><span id="btime"></span></div>
        <hr>
        <div class="th"><span>ITEM</span><span>QTY</span><span>AMT</span></div>
        <hr>
        <div id="clist"></div>
        <hr class="dbl">
        <div class="row2 grand"><span>TOTAL</span><span id="ctot">₹0</span></div>
        <div class="row2" style="align-items:center"><span class="sm" id="bcount"></span><span class="stamp">UNPAID</span></div>
        <hr>
        <form id="ofrm"><fieldset>
          <div class="ty" role="radiogroup" aria-label="Order type"><label><input type="radio" name="type" value="Takeaway" checked>TAKEAWAY</label><label><input type="radio" name="type" value="Dine-in">DINE-IN</label></div>
          <label class="fl"><span>NAME:</span><input name="n" required autocomplete="name"></label>
          <label class="fl"><span>PHONE:</span><input name="p" required type="tel" inputmode="tel" autocomplete="tel"></label>
          <label class="fl"><span id="tlabel">PICKUP AT:</span><input name="t" type="time"></label>
          <label class="fl"><span>NOTE:</span><textarea name="note" placeholder="less spicy, extra chutney"></textarea></label>
        </fieldset></form>
        <hr>
        <div class="c"><div class="bye">THANK YOU! COME AGAIN</div><div class="sm">Bamboo, thatch and good food on NH 15</div><div class="bar" aria-hidden="true"></div><div class="sm" id="bcode"></div></div>
      </div></div>
    </div>
    <div class="sf"><button class="btn" form="ofrm" type="submit">Send order on WhatsApp</button><small>Pay at the counter. The team confirms your order on WhatsApp.</small></div>
  </div>
</div>`);

const cartEl=$('#cart'),cartBtn=$('#cartBtn');
const billNo=String(Math.floor(1000+Math.random()*9000));
function totals(){let n=0,sum=0;for(const id in cart){n+=cart[id];sum+=cart[id]*ITEMS[id].pr}return{n,sum}}
function renderCart(bump){
  const {n,sum}=totals();
  $('i',cartBtn).textContent=n;
  if(bump&&!reduce){cartBtn.classList.remove('bump');void cartBtn.offsetWidth;cartBtn.classList.add('bump')}
  $('#clist').innerHTML=n?Object.keys(cart).map(id=>{const it=ITEMS[id];return `<div class="tr"><span class="it">${it.n}<small>@ ${rs(it.pr)}</small></span><span class="qty on" data-id="${id}"></span><span>${it.pr*cart[id]}.00</span></div>`}).join(''):'<p class="empty">Nothing here yet.<br>Add dishes from the menu.</p>';
  $('#ctot').textContent=rs(sum);
  $('#bcount').textContent=n?`Items: ${Object.keys(cart).length}   Qty: ${n}`:'';
  paintQty();
}
function stampTime(){const d=new Date();
  $('#bno').textContent=billNo;$('#bcode').textContent=`*PB${billNo}${String(d.getDate()).padStart(2,'0')}*`;
  $('#bdate').textContent=d.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'2-digit'});
  $('#btime').textContent=d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}).toUpperCase()}
function openCart(){stampTime();$('#cart .sb').scrollTop=0;cartEl.classList.add('on');cartEl.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  const pp=$('#paper');pp.classList.remove('print');void pp.offsetWidth;pp.classList.add('print');$('#cart .x').focus({preventScroll:true})}
function closeCart(){cartEl.classList.remove('on');cartEl.setAttribute('aria-hidden','true');document.body.style.overflow='';cartBtn.focus({preventScroll:true})}
cartBtn.onclick=openCart;
cartEl.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeCart()});
$('#ofrm').addEventListener('change',e=>{if(e.target.name!=='type')return;const dine=e.target.value==='Dine-in';
  $('#btype').textContent=dine?'DINE-IN':'TAKEAWAY';$('#tlabel').textContent=dine?'ARRIVING AT:':'PICKUP AT:'});
$('#ofrm').onsubmit=e=>{e.preventDefault();const {n,sum}=totals();if(!n){toast('Add something to your order first');return}
  const f=new FormData(e.target),t=f.get('t');
  const lines=Object.keys(cart).map(id=>`${cart[id]} x ${ITEMS[id].n} = ${rs(ITEMS[id].pr*cart[id])}`).join('\n');
  const at=t?`, ${f.get('type')==='Dine-in'?'arriving':'pickup'} at ${new Date('2000-01-01T'+t).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit',hour12:true})}`:'';
  const msg=`*New order, Bill No ${billNo}*\n${$('#bdate').textContent}, ${$('#btime').textContent}\n\n${lines}\n\n*Total: ${rs(sum)}*\n\nOrder: ${f.get('type')}${at}\nName: ${f.get('n')}\nPhone: ${f.get('p')}${f.get('note')?`\nNote: ${f.get('note')}`:''}`;
  open(`https://wa.me/${WA}?text=`+encodeURIComponent(msg),'_blank','noopener')};
renderCart();

/* ---------- Baanhi, the AI host (baanhi is the Assamese bamboo flute) ---------- */
document.body.insertAdjacentHTML('beforeend',`
<button id="fab" aria-label="Chat with Baanhi"><span class="av">B</span>Ask Baanhi</button>
<div id="chat" role="dialog" aria-label="Chat with Baanhi">
  <div class="ch"><span class="av">B</span><div><b>Baanhi</b><small>AI host, Pragya Bamboo Restaurant</small></div><button class="x" id="chatX" aria-label="Close chat">✕</button></div>
  <div id="msgs" aria-live="polite"></div>
  <div id="sug"><button>What's good here?</button><button>Book the cabin</button><button>Are you open now?</button><button>Veg options?</button></div>
  <form id="cf"><input id="ci" placeholder="Ask about food, timings, the cabin…" autocomplete="off" aria-label="Message"><button>Send</button></form>
</div>`);
const hist=[];let busy=false;
/* Render the reply as clean HTML: escape everything, then allow **bold**, "- " lists and paragraphs */
function fmt(t){const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'$1');
  const out=[];let list=null;for(const raw of String(t).replace(/\r/g,'').split('\n')){const l=raw.trim();const m=l.match(/^(?:[-*•]|\d+[.)])\s+(.*)/);
  if(m){if(!list){list=[];out.push(list)}list.push(m[1])}else{list=null;if(l)out.push(l)}}
  return out.map(x=>Array.isArray(x)?'<ul>'+x.map(i=>'<li>'+bold(i)+'</li>').join('')+'</ul>':'<p>'+bold(x)+'</p>').join('')}
function addMsg(t,w){const d=document.createElement('div');d.className='m '+w;if(w==='b')d.innerHTML=fmt(t);else d.textContent=t;$('#msgs').append(d);$('#msgs').scrollTop=1e9}
function openChat(){$('#chat').classList.add('on');$('#fab').style.visibility='hidden';
  if(!$('#msgs').children.length)addMsg("Namaskar! I'm **Baanhi**, the AI host at Pragya Bamboo Restaurant. Ask me about the food, or I can book the cabin for you.",'b');
  $('#ci').focus()}
function closeChat(){$('#chat').classList.remove('on');$('#fab').style.visibility='';$('#fab').focus({preventScroll:true})}
$('#fab').onclick=openChat;$('#chatX').onclick=closeChat;
$('#sug').onclick=e=>{if(e.target.tagName==='BUTTON')send(e.target.textContent)};
$('#cf').onsubmit=e=>{e.preventDefault();const v=$('#ci').value.trim();if(v){$('#ci').value='';send(v)}};
addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(cartEl.classList.contains('on'))closeCart();else if($('#chat').classList.contains('on'))closeChat()});
async function send(t){if(busy)return;busy=true;$('#sug').style.display='none';addMsg(t,'u');hist.push({role:'user',content:t});
  const ty=document.createElement('div');ty.className='m b typing';ty.innerHTML='<i></i><i></i><i></i>';$('#msgs').append(ty);$('#msgs').scrollTop=1e9;
  try{const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:hist})});const j=await r.json();ty.remove();
    const reply=j.reply||j.error||'Baanhi could not answer. Please try again in a moment.';addMsg(reply,'b');if(j.reply)hist.push({role:'assistant',content:reply});if(j.booked)toast('Booking request sent to the team')}
  catch{ty.remove();addMsg('No connection. Check your internet and try again.','b')}busy=false}

/* ---------- 3D tilt that follows the mouse (desktop only) ---------- */
function tilt(box,target,amt){box.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||reduce)return;const r=box.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
  target.style.transform=`rotateY(${x*amt}deg) rotateX(${-y*amt}deg)`});box.addEventListener('pointerleave',()=>target.style.transform='')}
$$('[data-tilt]').forEach(b=>tilt(b,b.firstElementChild,+b.dataset.tilt||10));

/* ---------- menu page: full menu with a bamboo-stalk category rail ---------- */
const mlist=$('#mlist');
if(mlist){
  mlist.innerHTML=Object.entries(MENU).map(([cat,[blurb,items]])=>`<section class="mcat" id="${slug(cat)}" aria-labelledby="h-${slug(cat)}">
    <h2 id="h-${slug(cat)}">${cat}</h2>${blurb?`<p>${blurb}</p>`:''}
    <ul class="items">${items.map(([n,t,pr,note])=>`<li>${vgMark(t)}<span class="nm">${n}${note?`<small>${note}</small>`:''}</span><span class="pr">${rs(pr)}</span><span class="qty" data-id="${slug(n)}"></span></li>`).join('')}</ul></section>`).join('');
  const rail=$('#stalk');
  rail.innerHTML=Object.keys(MENU).map(c=>`<a href="#${slug(c)}">${c}</a>`).join('');
  const links=$$('a',rail);
  let last=null;
  const spy=()=>{let cur=links[0];for(const a of links){const s=$(a.getAttribute('href'));if(s.getBoundingClientRect().top<innerHeight*.35)cur=a}
    if(cur===last)return;last=cur;
    links.forEach(a=>a.classList.toggle('on',a===cur));
    if(innerWidth<=860)rail.scrollTo({left:cur.offsetLeft-16,behavior:reduce?'auto':'smooth'})};
  addEventListener('scroll',spy,{passive:true});spy();
  paintQty();
}
/* home page favourites */
$$('.qty[data-id]').length&&paintQty();

/* ---------- cabin page: booking to WhatsApp ---------- */
const bf=$('#bookf');
if(bf){
  const dIn=$('[name=d]',bf);dIn.min=new Date().toISOString().slice(0,10);dIn.value=dIn.min;
  const want=new URLSearchParams(location.search).get('spot');if(want){const r=$(`[name=spot][value="${want}"]`);if(r)r.checked=true}
  bf.onsubmit=e=>{e.preventDefault();const f=new FormData(bf);
    const d=new Date(f.get('d')+'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
    const t=new Date('2000-01-01T'+f.get('t')).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit',hour12:true});
    const msg=`Hi Pragya Bamboo Restaurant, I'd like to book.\nPlace: ${f.get('spot')}\nName: ${f.get('n')}\nPhone: ${f.get('p')}\nDate: ${d}\nTime: ${t}\nGuests: ${f.get('g')}\nOccasion: ${f.get('o')}`;
    open(`https://wa.me/${WA}?text=`+encodeURIComponent(msg),'_blank','noopener')};
}
