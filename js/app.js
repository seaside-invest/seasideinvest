
async function loadJSON(p){const r=await fetch(p+'?_='+(Date.now()));return r.json();}
function fmt(n){return new Intl.NumberFormat('no-NO').format(Math.round(n));}
function kr(n){return fmt(n)+' kr';}
async function hydrate(){
  const d = await loadJSON('data/data.json');
  const debt = d.loans.reduce((a,b)=>a+b.balance,0);
  document.querySelector('[data-tile="buffer"] .value').textContent = kr(d.buffer);
  document.querySelector('[data-tile="debt"] .value').textContent = kr(debt);
  document.querySelector('[data-tile="income"] .value').textContent = kr(d.income_month);
  document.querySelector('[data-tile="expense"] .value').textContent = kr(d.expense_month);
}
document.addEventListener('DOMContentLoaded', hydrate);
