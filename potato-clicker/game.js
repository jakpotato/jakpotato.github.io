'use strict';
const IMG = 'assets/potato-big.png';
const SAVE_KEY = 'spudFarm.v1';
const WIN_AT = 1e12;
const GROWTH = 1.15;

// name, icon, base cost, potatoes/sec each, blurb
const BUILDINGS = [
  ['Farmhand','🧑‍🌾',15,0.1,'Digs when nobody is looking.'],
  ['Seed bag','🌱',100,1,'Plant more, dig more.'],
  ['Wheelbarrow','🛒',1100,8,'Hauls spuds to the barn.'],
  ['Tractor','🚜',12e3,47,'Rows and rows, done by noon.'],
  ['Irrigation','💧',130e3,260,'Happy roots, fat potatoes.'],
  ['Greenhouse','🏡',1.4e6,1400,'Potatoes in every season.'],
  ['Potato mill','🏭',20e6,7800,'Grinds out spuds around the clock.'],
  ['Spud factory','⚙️',330e6,44e3,'Assembly line of tubers.'],
  ['Moon farm','🌙',5.1e9,260e3,'Low gravity, big harvests.'],
  ['Potato portal','🌀',75e9,1.6e6,'Pulls potatoes from other fields.'],
].map(([name,icon,base,rate,blurb],i)=>({i,name,icon,base,rate,blurb}));

// One-time upgrades: tap power and per-crew multipliers
const UPGRADES = [];
[100,1e3,1e4,1e5,1e6,1e7,1e8,1e9].forEach((cost,k)=>UPGRADES.push({
  id:'c'+k, icon:['🥄','⛏️','🔱','🧤','🦾','🪄','🚀','👑'][k], cost, name:['Better spoon','Sturdy shovel','Pitchfork','Grippy gloves','Robo-arm','Spud wand','Rocket hoe','Crown of soil'][k],
  desc:'Tapping is twice as strong.', show:s=>s.total>=cost*0.5, tap:true}));
const TIERS=[[1,10],[10,50],[25,500],[50,5e3],[100,5e4]];
BUILDINGS.forEach(b=>TIERS.forEach(([n,m],t)=>UPGRADES.push({
  id:`b${b.i}_${t}`, icon:b.icon, cost:b.base*m, name:`${b.name} training ${'I'.repeat(t+1)}`,
  desc:`${b.name} makes twice as many potatoes.`, show:s=>s.b[b.i]>=n, b:b.i})));

const $ = s => document.querySelector(s);
let S = load();

function fresh(){ return {p:0,total:0,taps:0,b:BUILDINGS.map(()=>0),u:[],won:false}; }
function load(){
  try{ const d=JSON.parse(localStorage.getItem(SAVE_KEY)); if(d&&d.b&&d.b.length===BUILDINGS.length) return Object.assign(fresh(),d); }catch(e){}
  return fresh();
}
function save(){ try{ localStorage.setItem(SAVE_KEY,JSON.stringify(S)); }catch(e){} }

const has = id => S.u.includes(id);
const bMult = i => Math.pow(2, UPGRADES.filter(u=>u.b===i&&has(u.id)).length);
const perTap = () => Math.pow(2, UPGRADES.filter(u=>u.tap&&has(u.id)).length);
const perSec = () => BUILDINGS.reduce((t,b)=>t+S.b[b.i]*b.rate*bMult(b.i),0);
const costOf = b => Math.ceil(b.base*Math.pow(GROWTH,S.b[b.i]));

function fmt(n,d=0){
  if(n<1e3) return d&&n%1?n.toFixed(d):Math.floor(n).toString();
  const u=['K','M','B','T','Qa','Qi','Sx','Sp'];let i=-1;
  while(n>=1e3&&i<u.length-1){n/=1e3;i++}
  return n.toFixed(n<10?2:n<100?1:0)+u[i];
}

// ---------- Field & popping potatoes ----------
const field=$('#field'), hint=$('#hint');
function rnd(a,b){return a+Math.random()*(b-a)}
function pop(x,y){
  if(field.querySelectorAll('.pop').length>60) return;
  const el=document.createElement('img');
  el.src=IMG; el.alt=''; el.className='pop'; el.draggable=false;
  el.onerror=()=>{const s=document.createElement('span');s.className='pop';s.style.cssText=el.style.cssText;s.textContent='🥔';el.replaceWith(s);setTimeout(()=>s.remove(),1000)};
  el.style.cssText=`left:${x}px;top:${y}px;--dx:${rnd(-70,70)}px;--dy:${rnd(-110,-60)}px;--r:${rnd(-200,200)}deg`;
  field.appendChild(el); setTimeout(()=>el.remove(),1000);
}
function plus(x,y,n){
  const el=document.createElement('div'); el.className='plus'; el.textContent='+'+fmt(n,1);
  el.style.left=x+'px'; el.style.top=y+'px'; field.appendChild(el); setTimeout(()=>el.remove(),800);
}
function tap(x,y){
  const n=perTap(); S.p+=n; S.total+=n; S.taps++;
  const c=Math.min(3,1+Math.floor(Math.log10(n)/2));
  for(let i=0;i<c;i++) pop(x,y);
  plus(x,y-10,n); hint.style.opacity=0;
}
field.addEventListener('pointerdown',e=>{
  const r=field.getBoundingClientRect(); tap(e.clientX-r.left,e.clientY-r.top);
});
field.addEventListener('keydown',e=>{
  if(e.key===' '||e.key==='Enter'){e.preventDefault();tap(field.clientWidth/2+rnd(-60,60),field.clientHeight/2+rnd(-40,40))}
});

// ---------- Shop ----------
const bEl=$('#buildings'), uEl=$('#upgrades');
let shopSig='', bRefs=[], uRefs=[];
function visibleB(){ // owned ones + next locked teaser
  const out=[]; let teased=false;
  BUILDINGS.forEach(b=>{
    if(S.b[b.i]>0||S.total>=b.base*0.6) out.push([b,false]);
    else if(!teased){out.push([b,true]);teased=true}
  });
  return out;
}
function buildShop(){
  const vb=visibleB(), vu=UPGRADES.filter(u=>!has(u.id)&&u.show(S));
  shopSig=vb.map(([b,l])=>b.i+(l?'L':'')).join()+'|'+vu.map(u=>u.id).join();
  bEl.innerHTML=''; uEl.innerHTML=''; bRefs=[]; uRefs=[];
  if(!vu.length) uEl.innerHTML='<small style="opacity:.6;padding:0 4px">Keep digging to unlock upgrades.</small>';
  vu.forEach(u=>{
    const el=document.createElement('button'); el.className='upg'; el.textContent=u.icon;
    el.title=`${u.name}: ${u.desc} Cost ${fmt(u.cost)}`;
    el.onclick=()=>{ if(S.p>=u.cost){S.p-=u.cost;S.u.push(u.id);buildShop();refresh()} };
    el.onpointerenter=()=>tip(el,`<b>${u.name}</b><br>${u.desc}<br>Cost: ${fmt(u.cost)}`);
    el.onpointerleave=untip;
    uEl.appendChild(el); uRefs.push([u,el]);
  });
  vb.forEach(([b,locked])=>{
    const el=document.createElement('button'); el.className='item'+(locked?' locked':'');
    if(locked){ el.innerHTML=`<span class="ico">❓</span><span class="info"><b>???</b><small>Keep digging to unlock</small></span>`; el.disabled=true; }
    else{
      el.innerHTML=`<span class="ico">${b.icon}</span><span class="info"><b>${b.name}</b><small class="rate"></small><span class="cost"></span></span><span class="own"></span>`;
      el.onclick=()=>{ const c=costOf(b); if(S.p>=c){S.p-=c;S.b[b.i]++;buildShop();refresh()} };
      bRefs.push([b,el]);
    }
    bEl.appendChild(el);
  });
}
function tip(el,html){ untip(); const t=document.createElement('div'); t.className='tip'; t.id='tip'; t.innerHTML=html; document.body.appendChild(t);
  const r=el.getBoundingClientRect(); t.style.top=(r.bottom+6)+'px'; t.style.left=Math.min(r.left,innerWidth-230)+'px'; }
function untip(){ const t=$('#tip'); if(t) t.remove(); }

function refresh(){
  const pps=perSec();
  $('#count').textContent=fmt(S.p);
  $('#pps').textContent=fmt(pps,1)+' per second';
  $('#ppc').textContent=fmt(perTap())+' per tap';
  document.title=fmt(S.p)+' potatoes - Spud Farm';
  bRefs.forEach(([b,el])=>{
    const c=costOf(b);
    el.classList.toggle('ok',S.p>=c);
    el.querySelector('.rate').textContent=`Makes ${fmt(b.rate*bMult(b.i),1)}/s each · ${b.blurb}`;
    el.querySelector('.cost').textContent='🥔 '+fmt(c);
    el.querySelector('.own').textContent=S.b[b.i]||'';
  });
  uRefs.forEach(([u,el])=>el.classList.toggle('ok',S.p>=u.cost));
}

// ---------- Main loop ----------
let last=performance.now(), ambient=0, sigTimer=0;
function frame(now){
  const dt=Math.min((now-last)/1000,1); last=now;
  const pps=perSec(), gain=pps*dt;
  S.p+=gain; S.total+=gain;
  if(!document.hidden){
    ambient+=Math.min(pps,10)*dt;
    while(ambient>=1){ambient--;pop(rnd(30,field.clientWidth-30),rnd(field.clientHeight*.3,field.clientHeight-30))}
  }
  sigTimer+=dt;
  if(sigTimer>0.4){
    sigTimer=0;
    const vb=visibleB(), vu=UPGRADES.filter(u=>!has(u.id)&&u.show(S));
    const sig=vb.map(([b,l])=>b.i+(l?'L':'')).join()+'|'+vu.map(u=>u.id).join();
    if(sig!==shopSig) buildShop();
  }
  if(!S.won&&S.total>=WIN_AT){S.won=true;$('#win').hidden=false;save()}
  refresh();
  requestAnimationFrame(frame);
}
$('#keep').onclick=()=>{$('#win').hidden=true};
$('#reset').onclick=()=>{ if(confirm('Reset all progress? This cannot be undone.')){S=fresh();save();buildShop();refresh()} };
setInterval(save,10000);
addEventListener('beforeunload',save);
document.addEventListener('visibilitychange',()=>{ if(document.hidden) save(); else last=performance.now(); });

buildShop(); refresh(); requestAnimationFrame(frame);
if(S.total>0) hint.style.opacity=0;
