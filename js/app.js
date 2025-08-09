
async function loadJSON(p){const r=await fetch(p+'?_='+(Date.now()));return r.json();}
function fmt(n){return new Intl.NumberFormat('no-NO').format(Math.round(n));}
function kr(n){return fmt(n)+' kr';}
async function hydrate(){
  const d = await loadJSON('data/data.json');
  const debt = d.loans.reduce((a,b)=>a+b.balance,0);
  const assets = d.assets.reduce((a,b)=>a+b.value,0);
  document.querySelector('[data-tile="buffer"] .value').textContent = kr(d.buffer);
  document.querySelector('[data-tile="debt"] .value').textContent = kr(debt);
  document.querySelector('[data-tile="income"] .value').textContent = kr(d.income_month);
  document.querySelector('[data-tile="expense"] .value').textContent = kr(d.expense_month);
  const goal = d.goals.find(g=>g.id==='G1');
  if(goal){
    const p = Math.min(100, Math.round(goal.current/goal.target*100));
    const dash = 2*Math.PI*72;
    const fg = document.querySelector('.fg'); fg.setAttribute('stroke-dasharray', dash); fg.setAttribute('stroke-dashoffset', dash*(1-p/100));
    document.querySelector('.ring-value').textContent = p+'%';
    document.querySelector('.now').textContent = kr(goal.current);
    document.getElementById('nettoverdi').textContent = kr(assets - debt);
  }
}
document.addEventListener('DOMContentLoaded', hydrate);
window.manualRefresh = ()=>hydrate();
