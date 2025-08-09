
async function loadJSON(path){const r=await fetch(path+'?_='+(Date.now()));return r.json();}
function fmt(n){return new Intl.NumberFormat('no-NO').format(Math.round(n));}
function kr(n){return fmt(n)+' kr';}

async function hydrate(){
  const data = await loadJSON('data/data.json');
  const set = (sel,val)=>{const el=document.querySelector(sel); if(el) el.textContent = val;};

  // Tiles
  const debtTotal = data.loans.reduce((a,b)=>a+b.balance,0);
  set('[data-tile="buffer"] .value', kr(data.buffer));
  set('[data-tile="debt"] .value', kr(debtTotal));
  set('[data-tile="income"] .value', kr(data.income_month));
  set('[data-tile="expense"] .value', kr(data.expense_month));

  // Goal ring
  const million = data.goals.find(g=>g.id==='G1');
  if(million){
    const p = Math.min(100, Math.round((million.current / million.target)*100));
    const dash = 2*Math.PI*78;
    const fg = document.querySelector('.ring .fg');
    if(fg){ fg.setAttribute('stroke-dasharray', dash); fg.setAttribute('stroke-dashoffset', dash*(1-p/100)); }
    set('.ring-value', p + '%'); set('.hero-meta .now', kr(million.current));
  }

  // Net worth
  const assets = data.assets.reduce((a,b)=>a+b.value,0);
  set('#nettoverdi', kr(assets - debtTotal));

  // Motivation (tabs: Sondre/Stine)
  const sondreBtn = document.querySelector('#tab-sondre');
  const stineBtn  = document.querySelector('#tab-stine');
  const msgEl = document.querySelector('.motivation .msg');
  const nextBtn = document.querySelector('.motivation .next');
  let active = 'sondre', bank = {sondre:[], stine:[]};

  async function loadMsgs(){
    bank.sondre = await loadJSON('data/sondre_msgs.json');
    bank.stine  = await loadJSON('data/stine_msgs.json');
  }
  function showRandom(){
    const pool = bank[active] || [];
    if(pool.length){ msgEl.textContent = pool[Math.floor(Math.random()*pool.length)]; }
  }
  await loadMsgs(); showRandom();
  nextBtn?.addEventListener('click', showRandom);
  sondreBtn?.addEventListener('click', ()=>{ active='sondre'; document.body.dataset.user='sondre'; showRandom(); });
  stineBtn?.addEventListener('click', ()=>{ active='stine'; document.body.dataset.user='stine'; showRandom(); });

  // simple bar chart (pure canvas) for expenses vs income
  const c = document.querySelector('#cashChart');
  if(c && c.getContext){
    const ctx=c.getContext('2d'); const w=c.width = c.offsetWidth; const h=c.height = 180;
    const vals=[data.income_month, data.expense_month]; const max=Math.max(...vals)*1.2;
    const labels=['Inntekt','Utgifter'];
    vals.forEach((v,i)=>{
      const bw = 90, gap=60, x = 60 + i*(bw+gap), y = h-24, bh = Math.round((v/max)*(h-60));
      ctx.fillStyle = i===0?'#67a3ff':'#ff6fa3';
      ctx.fillRect(x, y-bh, bw, bh);
      ctx.fillStyle='#9fb0cc'; ctx.fillText(labels[i], x, h-8); ctx.fillText(kr(v), x, y-bh-6);
    });
  }
}

document.addEventListener('DOMContentLoaded', hydrate);
window.manualRefresh = hydrate;
