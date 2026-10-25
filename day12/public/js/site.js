/* Shared by every page: header and mobile menu, the full menu, bill (cart), WhatsApp forms, Hana chat */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const WA='917099095335';
const FAN='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20L3 9a12 12 0 0 1 18 0z" fill="none" stroke="#E7CF94" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 20L7.5 6.2M12 20V5M12 20l4.5-13.8" stroke="#E7CF94" stroke-width="1.2"/></svg>';

/* ---------- the menu, from their published food menu (prices as listed) ---------- */
/* section: [blurb, image, [[name, 'v'|'n', [[option label, price], ...], description]]] */
const MENU={
 'Veg starters':['Crisp, wok-tossed and made for sharing.','charcoal-dimsum',[
  ['dark mushrooms','v',[['',499]],'trilogy of button, shiitake and black mushrooms'],
  ['chili garlic crispy vegetables','v',[['',399]],'assorted fresh veggies in chili garlic sauce'],
  ['street style cream cheese wonton','v',[['',499]],'cream cheese, spicy kewpie mayo'],
  ['crispy chili lotus stem','v',[['',379]],'tangy sauce, sesame seeds'],
  ['honey chili potatoes','v',[['',379]],'honey and chilli sauce'],
  ['kimchi baby potatoes','v',[['',379]],'kimchi, micro greens, baby potatoes'],
  ['cottage cheese katsu cubes','v',[['',499]],'crumbed cottage cheese in Thai and Japanese flavours'],
  ['classic chili cottage cheese','v',[['',499]],'bell peppers, crispy chili sauce, micro greens'],
  ['crispy salt pepper corn','v',[['',379]],'corn, bell peppers, chilies']]],
 'Meat and seafood starters':['From the wok and the grill.','chicken-leg',[
  ['thai cashew chicken','n',[['',499]],'wok tossed chicken, cashew nuts, spring onions'],
  ['smoked sichuan chili chicken','n',[['',499]],'sichuan peppers, chicken morsels'],
  ['bang bang chicken lollies','n',[['',499]],'bang bang sauce, sesame seeds'],
  ['korean chicken wings','n',[['',499]],'crispy wings in gochujang sauce'],
  ['asian barbeque chicken breast','n',[['',699]],'grilled tender and juicy'],
  ['steamed fish in banana leaf','n',[['',599]],'sea bass, banana leaf, chili sauce'],
  ['chili bean asian fish','n',[['',599]],'chili bean sauce, vietnamese sea bass'],
  ['pork belly','n',[['',699]],'imported belgian pork, twice cooked, black pepper sauce'],
  ['pork ribs','n',[['',799]],'belgian pork ribs, black pepper sauce, broccoli, asparagus'],
  ['chili butter garlic calamari','n',[['',699]],'crispy calamari, bell peppers, chili butter'],
  ['dynamite prawns','n',[['',699]],'crispy prawns in a spicy, creamy dynamite sauce'],
  ['spicy hunan prawns','n',[['',699]],'hunan sauce, bell peppers'],
  ['asian fish fingers','n',[['',599]],'asian spices and herbs, sweet chili sauce']]],
 'Bao':['The great bun bao story. Two open baos with yum yum sauce and spicy mayo.','',[
  ['vegetables and smoky sriracha bao','v',[['',449]]],
  ['chicken katsu bao','n',[['',529]]]]],
 'Dim sum':['Served with chili oil, Shanghai sauce and yum yum sauce. Every colour comes naturally from vegetables, never artificial.','beet-dimsum',[
  ['dim sum platter, veg','v',[['',945]],'a little of everything, every day'],
  ['dim sum platter, non-veg','n',[['',999]],'a little of everything, every day'],
  ['vegetable crystal','v',[['4 pc',499],['6 pc',559]]],
  ['cottage cheese and scallion','v',[['4 pc',499],['6 pc',559]]],
  ['wild mushroom','v',[['4 pc',499],['6 pc',559]]],
  ['new york cheese chili oil','v',[['4 pc',499],['6 pc',559]]],
  ['broccoli water chestnut chili cheese oil','v',[['4 pc',499],['6 pc',559]]],
  ['spicy chicken coriander','n',[['4 pc',559],['6 pc',599]]],
  ['pan fried shanghai chicken','n',[['4 pc',559],['6 pc',599]]],
  ['poached peking chicken','n',[['4 pc',559],['6 pc',599]]],
  ['chicken sui mai','n',[['4 pc',559],['6 pc',599]]],
  ['prawns sui mai','n',[['4 pc',559],['6 pc',599]]],
  ['classic pork','n',[['4 pc',559],['6 pc',599]]]]],
 'Sushi':['Simply sushi, rolled to order.','sashimi',[
  ['asparagus tempura roll','v',[['4 pc',599],['8 pc',699]]],
  ['spicy avocado roll','v',[['4 pc',599],['8 pc',699]]],
  ['rainbow vegetable roll','v',[['4 pc',599],['8 pc',699]]],
  ['cream cheese spicy vegetable roll','v',[['4 pc',599],['8 pc',699]]],
  ['spicy katsu chicken roll','n',[['4 pc',699],['8 pc',799]]],
  ['spicy salmon roll','n',[['4 pc',699],['8 pc',799]]],
  ['tuna sushi with butterfly pea rice','n',[['4 pc',699],['8 pc',799]]],
  ['gunkan maki salmon and crabstick','n',[['4 pc',699],['8 pc',799]]],
  ['ebi tempura roll','n',[['4 pc',699],['8 pc',799]]],
  ['crunchy cream cheese crab meat','n',[['4 pc',699],['8 pc',799]]],
  ['rainbow roll','n',[['4 pc',999],['8 pc',1099]],'salmon, tuna, avocado, cream cheese, japanese mayo, tobiko, crabstick']]],
 'Nigiri and sashimi':['Norwegian salmon and Vietnamese tuna.','',[
  ['norwegian salmon nigiri','n',[['4 pc',799],['8 pc',1299]]],
  ['vietnamese tuna nigiri','n',[['4 pc',799],['8 pc',1299]]],
  ['norwegian salmon sashimi','n',[['4 pc',799],['8 pc',1299]]],
  ['vietnamese tuna sashimi','n',[['4 pc',799],['8 pc',1299]]]]],
 'Hot pot and stone bowls':['Make it yourself at the table, or have it sizzling in stone.','ramen',[
  ['the maroon room signature hot pot','v',[['veg',2999],['non-veg',3499]],'served with rice, glass noodles, kimchi and peanuts'],
  ['sizzling stone bowl','v',[['veg',699],['tofu',699],['chicken',749],['pork',749],['sea food',749]],'choose your rice or noodles and your sauce: sichuan, oyster, black bean, black pepper, xo, thai basil chili or smash korean']]],
 'Rice and noodles':['','',[
  ['burnt garlic fried rice','v',[['veg',459],['egg',549],['chicken',549],['pork',599],['sea food',629]]],
  ['burnt garlic hakka noodles','v',[['veg',459],['egg',549],['chicken',549],['pork',599],['sea food',629]]]]],
 'Signature mains':['The dishes the room is known for.','chicken-leg',[
  ['burmese khow suey','v',[['veg',729],['chicken',799]],'noodles, shallots, coconut curry, burnt garlic'],
  ['korean bibimbap','v',[['veg',729],['chicken',759],['pork',759]],'zucchini, carrot, spinach, shiitake, jasmine rice, bibimbap sauce'],
  ['indonesian nasi','v',[['veg',729],['chicken',749],['pork',759],['sea food',799]],'cracker, peanut sauce, green salad'],
  ['signature thai curry, red or green','v',[['veg',729],['chicken',789],['pork',789],['sea food',789]],'with jasmine rice or imported sticky rice'],
  ['pad thai noodles','v',[['veg',729],['chicken',759],['pork',799],['sea food',899]],'rice noodles, tamarind, crunchy peanuts'],
  ['asian cottage cheese steak','v',[['',699]],'mashed potatoes, assorted vegetables'],
  ['sichuan pepper chicken leg roast','n',[['',799]],'potato mash, fried rice, asian veggies'],
  ['chicken umami curry with butterfly pea rice','n',[['',899]],'chicken stuffed with shrimps, fragrant umami curry'],
  ['japanese katsu','n',[['chicken',759],['pork',799]],'katsu curry, rice, potato mash, fried egg'],
  ['slow cooked sticky pork ribs','n',[['',999]],'indonesian style, fried rice, mashed potato, sambal'],
  ['java grilled fish','n',[['',899]],'basa in a javanese spice blend, rice, sautéed vegetables'],
  ['baked salmon on a bed of blue rice','n',[['',1299]],'norwegian salmon, butterfly pea rice, umami curry, nori cracker']]],
 'Desserts':['A playful parade of velvet, fruit and flair.','',[
  ['blueberry glaze cheesecake','v',[['',529]]],
  ['strawberry velvet semifreddo','v',[['',529]]],
  ['coconut passion fruit éclat','v',[['',529]]],
  ['classic tiramisu','v',[['',529]],'with a subtle hint of Old Monk']]]
};
/* the bar: highlights only; the full bar menu and prices are shared at the table */
const BAR={
 'Signature cocktails':['Crafted by the team behind one of India\'s 100 best bars.','cocktail-gold',[['the maroon room signatures','seasonal, ask your server for tonight\'s list'],['whisky sour','classic, silky foam'],['coastal cocktails','from the coastal festival menu']]],
 'Whisky and spirits':['Region\'s largest bar. 15% off the menu price on three favourites, every day.','dewars',[['hendrick\'s gin','15% off, all days'],['glenfiddich 12 years','15% off, all days'],['monkey shoulder','15% off, all days'],['dewar\'s double double 21','by the glass']]],
 'Wine and beer':['Curated by Apurva Aras, Head of Batches and Blends.','',[['wine by the glass','red, white and rosé'],['beer','draught and bottled']]],
 'Zero proof':['','whisky-sour',[['kimono yuzu lemonade','a guest favourite'],['mocktails','ask for tonight\'s list']]]
};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const ITEMS={};
for(const sec in MENU)for(const [n,t,opts,ds] of MENU[sec][2])for(const [lab,pr] of opts)ITEMS[slug(n+' '+lab)]={n,lab,pr,t};
const rs=n=>'₹'+n.toLocaleString('en-IN');
const vgMark=t=>`<span class="vg${t==='n'?' n':''}" role="img" aria-label="${t==='n'?'Non-veg':'Veg'}"></span>`;

/* ---------- header: clear over the home hero and page headers, solid once you scroll ---------- */
const head=$('.head'), heroEl=$('#hero');
const solid=()=>head.classList.toggle('solid',heroEl?scrollY>heroEl.offsetHeight-innerHeight*.9:scrollY>40);
solid();addEventListener('scroll',solid,{passive:true});
$('#menuBtn').onclick=()=>{const o=document.body.classList.toggle('menu-open');$('#menuBtn').setAttribute('aria-expanded',o)};
$$('.nav a').forEach(a=>a.addEventListener('click',()=>document.body.classList.remove('menu-open')));

/* ---------- toast ---------- */
document.body.insertAdjacentHTML('beforeend','<div id="toast" role="status"></div>');
function toast(t,action){const e=$('#toast');e.innerHTML='';e.append(t);
  if(action){const b=document.createElement('button');b.textContent=action[0];b.onclick=action[1];e.append(b)}
  e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(()=>e.classList.remove('on'),2600)}

/* ---------- cart: item id -> quantity, kept in this browser so it follows you across pages ---------- */
let cart={};
try{cart=JSON.parse(localStorage.getItem('tmr-cart')||'{}')}catch{}
for(const id in cart)if(!ITEMS[id])delete cart[id];
function setQty(id,q,bump){if(!ITEMS[id])return;if(q>0)cart[id]=q;else delete cart[id];
  try{localStorage.setItem('tmr-cart',JSON.stringify(cart))}catch{}
  renderCart(bump)}
function qtyHTML(id){const q=cart[id]||0;return q?`<button data-d="-1" aria-label="Remove one">−</button><b>${q}</b><button data-d="1" aria-label="Add one">+</button>`:`<button class="add" data-d="1">ADD</button>`}
function paintQty(){$$('.qty[data-id]').forEach(s=>{s.innerHTML=qtyHTML(s.dataset.id);s.classList.toggle('on',!!cart[s.dataset.id])})}
const label=it=>it.n+(it.lab?` (${it.lab})`:'');
document.addEventListener('click',e=>{const b=e.target.closest('.qty[data-id] button');if(!b)return;const id=b.parentElement.dataset.id,d=+b.dataset.d;
  const q=(cart[id]||0)+d;setQty(id,q,d>0);if(d>0&&q===1)toast(`${label(ITEMS[id])} added`,['View bill',openCart])});

document.body.insertAdjacentHTML('beforeend',`
<div id="cart" aria-hidden="true">
  <div class="scrim" data-close></div>
  <div class="sheet" role="dialog" aria-label="Your bill">
    <div class="sh"><h3>Your bill</h3><button class="x" data-close aria-label="Close">✕</button></div>
    <div class="sb">
      <div class="slot"></div>
      <div class="feed"><div class="paper" id="paper">
        <div class="c"><div class="shop">THE MAROON ROOM</div><div class="sm">Pan-Asian Fine Dining<br>5th Floor, Aurus Mall, GS Road, Dispur<br>Guwahati 781006<br>Ph: 070990 95335</div></div>
        <hr>
        <div class="meta"><span>Bill No: <b id="bno"></b></span><span id="bdate"></span><span>Order: <b id="btype">TAKEAWAY</b></span><span id="btime"></span></div>
        <hr>
        <div class="th"><span>ITEM</span><span>QTY</span><span>AMT</span></div>
        <hr>
        <div id="clist"></div>
        <hr>
        <div class="row2"><span>Sub-total</span><span id="bsub">₹0</span></div>
        <div class="row2 sm"><span>CGST @2.5%</span><span id="bcg">₹0</span></div>
        <div class="row2 sm"><span>SGST @2.5%</span><span id="bsg">₹0</span></div>
        <hr class="dbl">
        <div class="row2 grand"><span>GRAND TOTAL</span><span id="ctot">₹0</span></div>
        <div class="row2" style="align-items:center"><span class="sm" id="bcount"></span><span class="stamp">UNPAID</span></div>
        <hr>
        <form id="ofrm"><fieldset>
          <div class="ty" role="radiogroup" aria-label="Order type"><label><input type="radio" name="type" value="Takeaway" checked>TAKEAWAY</label><label><input type="radio" name="type" value="Dine-in">DINE-IN</label></div>
          <label class="fl"><span>NAME:</span><input name="n" required autocomplete="name"></label>
          <label class="fl"><span>PHONE:</span><input name="p" required type="tel" inputmode="tel" autocomplete="tel"></label>
          <label class="fl"><span id="tlabel">PICKUP AT:</span><input name="t" type="time"></label>
          <label class="fl"><span>NOTE:</span><textarea name="note" placeholder="less spicy, no peanuts"></textarea></label>
        </fieldset></form>
        <hr>
        <div class="c"><div class="bye">THANK YOU! SEE YOU AT THE STAGE</div><div class="sm">Live music every weekend</div><div class="bar" aria-hidden="true"></div><div class="sm" id="bcode"></div></div>
      </div></div>
    </div>
    <div class="sf"><button class="btn" form="ofrm" type="submit">SEND ORDER ON WHATSAPP</button><small>Pay at the counter. The team confirms your order on WhatsApp.</small></div>
  </div>
</div>`);

const cartEl=$('#cart'),cartBtn=$('#cartBtn');
const TAX=.025, billNo=String(Math.floor(1000+Math.random()*9000));
const money=n=>'₹'+(Math.round(n*100)/100).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
function totals(){let n=0,sum=0;for(const id in cart){n+=cart[id];sum+=cart[id]*ITEMS[id].pr}return{n,sum}}
function bill(){const {n,sum}=totals(),tax=sum*TAX;return{n,sum,tax,grand:Math.round(sum+2*tax)}}
function renderCart(bump){
  const {n,sum,tax,grand}=bill();
  $('i',cartBtn).textContent=n;
  if(bump&&!reduce){cartBtn.classList.remove('bump');void cartBtn.offsetWidth;cartBtn.classList.add('bump')}
  $('#clist').innerHTML=n?Object.keys(cart).map(id=>{const it=ITEMS[id];return `<div class="tr"><span class="it">${it.n}<small>${it.lab?it.lab+', ':''}@ ${rs(it.pr)}</small></span><span class="qty on" data-id="${id}"></span><span>${it.pr*cart[id]}.00</span></div>`}).join(''):'<p class="empty">Nothing here yet.<br>Add dishes from the menu.</p>';
  $('#bsub').textContent=money(sum);$('#bcg').textContent=money(tax);$('#bsg').textContent=money(tax);
  $('#ctot').textContent=rs(grand);
  $('#bcount').textContent=n?`Items: ${Object.keys(cart).length}   Qty: ${n}   (rounded off)`:'';
  paintQty();
}
function stampTime(){const d=new Date();
  $('#bno').textContent=billNo;$('#bcode').textContent=`*TMR${billNo}${String(d.getDate()).padStart(2,'0')}*`;
  $('#bdate').textContent=d.toLocaleDateString('en-GB',{day:'2-digit',month:'2-digit',year:'2-digit'});
  $('#btime').textContent=d.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}).toUpperCase()}
function openCart(){stampTime();$('#cart .sb').scrollTop=0;cartEl.classList.add('on');cartEl.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  const pp=$('#paper');pp.classList.remove('print');void pp.offsetWidth;pp.classList.add('print');$('#cart .x').focus({preventScroll:true})}
function closeCart(){cartEl.classList.remove('on');cartEl.setAttribute('aria-hidden','true');document.body.style.overflow='';cartBtn.focus({preventScroll:true})}
cartBtn.onclick=openCart;
cartEl.addEventListener('click',e=>{if(e.target.closest('[data-close]'))closeCart()});
$('#ofrm').addEventListener('change',e=>{if(e.target.name!=='type')return;const dine=e.target.value==='Dine-in';
  $('#btype').textContent=dine?'DINE-IN':'TAKEAWAY';$('#tlabel').textContent=dine?'ARRIVING AT:':'PICKUP AT:'});
$('#ofrm').onsubmit=e=>{e.preventDefault();const {n,sum,tax,grand}=bill();if(!n){toast('Add something to your order first');return}
  const f=new FormData(e.target),t=f.get('t');
  const lines=Object.keys(cart).map(id=>`${cart[id]} x ${label(ITEMS[id])} = ${rs(ITEMS[id].pr*cart[id])}`).join('\n');
  const at=t?`, ${f.get('type')==='Dine-in'?'arriving':'pickup'} at ${new Date('2000-01-01T'+t).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit',hour12:true})}`:'';
  const msg=`*New order, Bill No ${billNo}*\n${$('#bdate').textContent}, ${$('#btime').textContent}\n\n${lines}\n\nSub-total: ${money(sum)}\nCGST + SGST (5%): ${money(2*tax)}\n*Grand total: ${rs(grand)}*\n\nOrder: ${f.get('type')}${at}\nName: ${f.get('n')}\nPhone: ${f.get('p')}${f.get('note')?`\nNote: ${f.get('note')}`:''}`;
  open(`https://wa.me/${WA}?text=`+encodeURIComponent(msg),'_blank','noopener')};
renderCart();

/* ---------- Hana, the AI host (hana means flower) ---------- */
document.body.insertAdjacentHTML('beforeend',`
<button id="fab" aria-label="Chat with Hana"><span class="av">${FAN}</span>Ask Hana</button>
<div id="chat" role="dialog" aria-label="Chat with Hana">
  <div class="ch"><span class="av">${FAN}</span><div><b>Hana</b><small>AI host, The Maroon Room</small></div><button class="x" id="chatX" aria-label="Close chat">✕</button></div>
  <div id="msgs" aria-live="polite"></div>
  <div id="sug"><button>Who's playing this weekend?</button><button>Best sushi and dim sum?</button><button>Book a table for 4</button><button>Private party</button></div>
  <form id="cf"><input id="ci" placeholder="Ask about the menu, music, bookings…" autocomplete="off" aria-label="Message"><button>Send</button></form>
</div>`);
const hist=[];let busy=false;
/* Render the reply as clean HTML: escape everything, then allow **bold**, "- " lists and paragraphs */
function fmt(t){const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');const bold=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\*(.+?)\*/g,'$1');
  const out=[];let list=null;for(const raw of String(t).replace(/\r/g,'').split('\n')){const l=raw.trim();const m=l.match(/^(?:[-*•]|\d+[.)])\s+(.*)/);
  if(m){if(!list){list=[];out.push(list)}list.push(m[1])}else{list=null;if(l)out.push(l)}}
  return out.map(x=>Array.isArray(x)?'<ul>'+x.map(i=>'<li>'+bold(i)+'</li>').join('')+'</ul>':'<p>'+bold(x)+'</p>').join('')}
function addMsg(t,w){const d=document.createElement('div');d.className='m '+w;if(w==='b')d.innerHTML=fmt(t);else d.textContent=t;$('#msgs').append(d);$('#msgs').scrollTop=1e9}
function openChat(){$('#chat').classList.add('on');$('#fab').style.visibility='hidden';
  if(!$('#msgs').children.length)addMsg("Good evening. I'm **Hana**, the AI host at The Maroon Room. Ask me about the menu, this week's music, or I can reserve your table.",'b');
  $('#ci').focus()}
function closeChat(){$('#chat').classList.remove('on');$('#fab').style.visibility='';$('#fab').focus({preventScroll:true})}
$('#fab').onclick=openChat;$('#chatX').onclick=closeChat;
$('#sug').onclick=e=>{if(e.target.tagName==='BUTTON')send(e.target.textContent)};
$('#cf').onsubmit=e=>{e.preventDefault();const v=$('#ci').value.trim();if(v){$('#ci').value='';send(v)}};
addEventListener('keydown',e=>{if(e.key!=='Escape')return;if(cartEl.classList.contains('on'))closeCart();else if($('#chat').classList.contains('on'))closeChat();else document.body.classList.remove('menu-open')});
async function send(t){if(busy)return;busy=true;$('#sug').style.display='none';addMsg(t,'u');hist.push({role:'user',content:t});
  const ty=document.createElement('div');ty.className='m b typing';ty.innerHTML='<i></i><i></i><i></i>';$('#msgs').append(ty);$('#msgs').scrollTop=1e9;
  try{const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({messages:hist})});const j=await r.json();ty.remove();
    const reply=j.reply||j.error||'Hana could not answer. Please try again in a moment.';addMsg(reply,'b');if(j.reply)hist.push({role:'assistant',content:reply});if(j.booked)toast('Booking request sent to the team')}
  catch{ty.remove();addMsg('No connection. Check your internet and try again.','b')}busy=false}

/* ---------- menus page: food with options, then the bar ---------- */
const mlist=$('#mlist');
if(mlist){
  const sec=(name,blurb,img,body)=>`<section class="mcat" id="${slug(name)}" aria-labelledby="h-${slug(name)}"><div class="mh"><div><h2 id="h-${slug(name)}">${name}</h2>${blurb?`<p>${blurb}</p>`:''}</div>${img?`<img class="cut" src="img/cut/${img}.webp" alt="" loading="lazy">`:''}</div>${body}</section>`;
  const food=Object.entries(MENU).map(([name,[blurb,img,items]])=>sec(name,blurb,img,`<ul class="items">${items.map(([n,t,opts,ds])=>`<li>${vgMark(t)}<span class="nm">${n}${ds?`<span class="ds">${ds}</span>`:''}</span><div class="opts">${opts.map(([lab,pr])=>`<div class="opt">${lab?`<span>${lab}</span>`:''}<b>${rs(pr)}</b><span class="qty" data-id="${slug(n+' '+lab)}"></span></div>`).join('')}</div></li>`).join('')}</ul>`)).join('');
  const bar=Object.entries(BAR).map(([name,[blurb,img,items]])=>sec(name,blurb,img,`<ul class="items drinks">${items.map(([n,ds])=>`<li><span class="nm">${n}<span class="ds">${ds}</span></span><span class="ask">at the bar</span></li>`).join('')}</ul>`)).join('');
  mlist.innerHTML=food+`<div id="bar-menu" style="scroll-margin-top:100px"></div>`+bar;
  $('#mnav').innerHTML='<b>FOOD</b>'+Object.keys(MENU).map(c=>`<a href="#${slug(c)}">${c}</a>`).join('')+'<b>BAR</b>'+Object.keys(BAR).map(c=>`<a href="#${slug(c)}">${c}</a>`).join('');
  const rail=$('#mnav'),links=$$('a',rail);let last=null;
  const spy=()=>{let cur=links[0];for(const a of links){const s=$(a.getAttribute('href'));if(s.getBoundingClientRect().top<innerHeight*.35)cur=a}
    if(cur===last)return;last=cur;links.forEach(a=>a.classList.toggle('on',a===cur));
    if(innerWidth<=900)rail.scrollTo({left:cur.offsetLeft-16,behavior:reduce?'auto':'smooth'})};
  addEventListener('scroll',spy,{passive:true});spy();
}
paintQty();

/* ---------- every booking-style form sends a tidy WhatsApp message: data-wa holds the heading ---------- */
$$('form[data-wa]').forEach(f=>{
  const d=$('[type=date]',f);if(d){d.min=new Date().toISOString().slice(0,10);if(!d.value)d.value=d.min}
  const q=new URLSearchParams(location.search);
  for(const [k,v] of q){const r=$(`[name="${k}"][value="${v}"]`,f);if(r)r.checked=true;else{const el=$(`[name="${k}"]`,f);if(el&&el.type!=='radio')el.value=v}}
  f.onsubmit=e=>{e.preventDefault();const lines=[];
    for(const el of $$('input,select,textarea',f)){if(!el.name||(el.type==='radio'&&!el.checked)||!el.value)continue;
      let v=el.value;
      if(el.type==='date')v=new Date(v+'T00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'});
      if(el.type==='time')v=new Date('2000-01-01T'+v).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit',hour12:true});
      lines.push(`${el.dataset.l||el.name}: ${v}`)}
    open(`https://wa.me/${WA}?text=`+encodeURIComponent(`Hi The Maroon Room, ${f.dataset.wa}\n`+lines.join('\n')),'_blank','noopener')};
});
/* RSVP buttons on the events page fill the event into the form */
$$('[data-rsvp]').forEach(b=>b.addEventListener('click',()=>{const f=$('#rsvpf');if(!f)return;$('[name=event]',f).value=b.dataset.rsvp;f.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})}));

/* ---------- cut-out photos: as the frame scrolls up, the real background fades in behind the subject ---------- */
const asm=$$('.assemble');
if(asm.length){let raf=0;
  const paint=()=>{raf=0;asm.forEach(a=>{const r=a.getBoundingClientRect();a.style.setProperty('--k',reduce?1:clamp((innerHeight*.95-r.top)/(innerHeight*.8)).toFixed(3))})};
  addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(paint)},{passive:true});paint()}

/* ---------- dated events: past nights drop off the upcoming lists, tonight gets a tag ---------- */
{const today=new Date().toLocaleDateString('en-CA');
 $$('.ev[data-date]').forEach(ev=>{const d=ev.dataset.date;if(d<today)ev.remove();else if(d===today){ev.classList.add('today');$('h3',ev).insertAdjacentHTML('beforeend',' <span class="tag">TONIGHT</span>')}})}

/* ---------- content rises into view once ---------- */
const riseIO=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');riseIO.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});
$$('.rise').forEach(el=>riseIO.observe(el));
