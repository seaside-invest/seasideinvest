
const state = {
  data: null,
  profile: "sondre",
  boostIndex: 0,
};

async function loadData() {
  const res = await fetch('assets/data/dummy.json');
  state.data = await res.json();
  if (!localStorage.getItem('seaside_profile')) {
    localStorage.setItem('seaside_profile', 'sondre');
  }
  state.profile = localStorage.getItem('seaside_profile');
  setProfile(state.profile);
  route();
}

function setProfile(id) {
  state.profile = id;
  localStorage.setItem('seaside_profile', id);
  const p = state.data.profiles.find(x => x.id === id) || state.data.profiles[0];
  document.getElementById('avatar').src = 'assets/img/avatar-' + p.id + '.png';
  document.getElementById('prof-name').textContent = p.name;
  document.getElementById('prof-role').textContent = (id === 'sondre' ? 'Investor' : 'CFO hjemme');
}

window.addEventListener('hashchange', route);

function route() {
  const hash = location.hash || '#/dashboard';
  document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
  const id = 'nav-' + (hash.split('/')[1] || 'dashboard');
  const el = document.getElementById(id);
  if (el) el.classList.add('active');

  if (hash.startsWith('#/switch/')) {
    const who = hash.split('/')[2];
    setProfile(who);
    location.hash = '#/dashboard';
    return;
  }

  const view = document.getElementById('view');
  switch (hash) {
    case '#/dashboard': renderDashboard(view); break;
    case '#/assets': renderAssets(view); break;
    case '#/loans': renderLoans(view); break;
    case '#/rentals': renderRentals(view); break;
    case '#/budget': renderBudget(view); break;
    case '#/goals': renderGoals(view); break;
    case '#/health': renderHealth(view); break;
    case '#/boost': renderBoost(view); break;
    default: renderDashboard(view); break;
  }
}

function kr(n) {
  return new Intl.NumberFormat('no-NO', { style: 'currency', currency: 'NOK', maximumFractionDigits: 0 }).format(n);
}

function svgSpark(data, color='var(--accent)') {
  const w = 280, h = 80, pad = 8;
  const min = Math.min(...data), max = Math.max(...data);
  const points = data.map((v,i) => {
    const x = pad + i * ((w-2*pad)/(data.length-1));
    const y = h - pad - ((v - min) / (max - min || 1)) * (h-2*pad);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>
  </svg>`;
}

function svgBar(labels, values) {
  const w = 680, h = 220, pad = 28;
  const max = Math.max(...values) * 1.1;
  const bw = (w - 2*pad) / values.length - 12;
  let bars = '', xticks = '';
  values.forEach((v,i)=>{
    const x = pad + i * (bw+12);
    const bh = (v/max)*(h-2*pad);
    const y = h - pad - bh;
    bars += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="6" ry="6" fill="url(#grad)"/>`;
    xticks += `<text x="${x + bw/2}" y="${h - pad + 16}" fill="#8a93a6" font-size="11" text-anchor="middle">${labels[i]}</text>`;
  });
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="var(--accent)"/>
        <stop offset="100%" stop-color="var(--accent-2)"/>
      </linearGradient>
    </defs>
    <rect x="${pad}" y="${pad}" width="${w-2*pad}" height="${h-2*pad}" fill="none" stroke="rgba(255,255,255,.12)"/>
    ${bars}
    ${xticks}
  </svg>`;
}

function renderDashboard(root) {
  const d = state.data;
  const totalAssets = [...d.assets.real_estate, ...d.assets.vehicles].reduce((a,b)=>a+b.value,0);
  const totalDebt = d.loans.mortgages.reduce((a,b)=>a+b.balance,0) +
                    d.loans.car_loans.reduce((a,b)=>a+b.balance,0) +
                    d.loans.student_loans.reduce((a,b)=>a+b.balance,0);
  const netWorth = totalAssets - totalDebt;
  const cfIn = d.cashflow.in[d.cashflow.in.length-1];
  const cfOut = d.cashflow.out[d.cashflow.out.length-1];

  root.innerHTML = `
    <div class="grid kpis">
      <div class="tile" style="grid-column: span 3">
        <h3>Formue (brutto)</h3>
        <div class="value">${kr(totalAssets)}</div>
      </div>
      <div class="tile" style="grid-column: span 3">
        <h3>Gjeld</h3>
        <div class="value">${kr(totalDebt)}</div>
      </div>
      <div class="tile" style="grid-column: span 3">
        <h3>Netto</h3>
        <div class="value">${kr(netWorth)}</div>
      </div>
      <div class="tile" style="grid-column: span 3">
        <h3>Buffer</h3>
        <div class="value">${kr(d.buffer.current)} <span class="badge" style="margin-left:8px">${Math.round((d.buffer.current/d.buffer.goal)*100)}%</span></div>
        <div class="progress" style="margin-top:8px"><span style="width:${Math.min(100,(d.buffer.current/d.buffer.goal)*100)}%"></span></div>
      </div>
    </div>

    <div class="grid" style="margin-top:8px">
      <div class="tile" style="grid-column: span 7">
        <div class="section-title">Cashflow (siste 12 mnd)</div>
        <div>${svgBar(d.cashflow.months, d.cashflow.in)}</div>
        <div style="margin-top:12px; color:var(--muted); font-size:12px">Inntekter vist. Utgifter: ${kr(cfOut)} forrige mnd</div>
      </div>
      <div class="tile" style="grid-column: span 5">
        <div class="section-title">Mål – fremdrift</div>
        ${d.goals.map(g => `
          <div style="margin:10px 0">
            <div style="display:flex; align-items:center; justify-content:space-between">
              <div>${g.label}</div>
              <div class="badge">${Math.round((g.current/g.target)*100)}%</div>
            </div>
            <div class="progress" style="margin-top:6px"><span style="width:${Math.min(100,(g.current/g.target)*100)}%"></span></div>
            <div style="color:var(--muted); font-size:12px; margin-top:4px">${kr(g.current)} / ${kr(g.target)} – frist ${g.deadline}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAssets(root) {
  const d = state.data;
  const re = d.assets.real_estate.map(x=>`<div class="card-ghost"><strong>${x.label}</strong><br>${kr(x.value)}</div>`).join('');
  const ve = d.assets.vehicles.map(x=>`<div class="card-ghost"><strong>${x.label}</strong><br>${kr(x.value)}</div>`).join('');
  root.innerHTML = `
    <div class="section-title">Eiendomsverdier</div>
    <div class="cards">${re}</div>
    <div class="section-title" style="margin-top:16px">Kjøretøy</div>
    <div class="cards">${ve}</div>
  `;
}

function renderLoans(root) {
  const d = state.data;
  const mort = d.loans.mortgages.map(x=>`<div class="card-ghost"><strong>${x.label}</strong><br>Balanse: ${kr(x.balance)}<br>Rente: ${(x.rate*100).toFixed(2)}%<br>Forfall: 20. hver mnd</div>`).join('');
  const car = d.loans.car_loans.map(x=>`<div class="card-ghost"><strong>${x.label}</strong><br>Balanse: ${kr(x.balance)}<br>Mnd kostnad: ${kr(x.monthly_cost)}<br>Rente: ${(x.rate*100).toFixed(2)}%</div>`).join('');
  const stu = d.loans.student_loans.map(x=>`<div class="card-ghost"><strong>${x.label}</strong><br>Balanse: ${kr(x.balance)}<br>Rente: ${(x.rate*100).toFixed(2)}%</div>`).join('');
  root.innerHTML = `
    <div class="section-title">Boliglån</div>
    <div class="cards">${mort}</div>
    <div class="section-title" style="margin-top:16px">Billån</div>
    <div class="cards">${car}</div>
    <div class="section-title" style="margin-top:16px">Studielån</div>
    <div class="cards">${stu}</div>
  `;
}

function renderRentals(root) {
  const d = state.data;
  const labels = d.income.rentals_monthly.map(x=>x.label);
  const values = d.income.rentals_monthly.map(x=>x.value);
  root.innerHTML = `
    <div class="section-title">Utleieinntekter (måned)</div>
    <div class="tile">${svgBar(labels, values)}</div>
  `;
}

function renderBudget(root) {
  const d = state.data;
  const fixed = d.budget.fixed_costs.map(x=>`<div class="card-ghost"><strong>${x.label}</strong><br>${kr(x.value)}</div>`).join('');
  root.innerHTML = `
    <div class="section-title">Faste utgifter</div>
    <div class="cards">${fixed}</div>
    <div class="section-title" style="margin-top:16px">Budsjett (variabelt + personlig)</div>
    <div class="cards">
      <div class="card-ghost"><strong>Variabelt</strong><br>${kr(d.budget.variable_budget)}</div>
      <div class="card-ghost"><strong>Personlig – Sondre</strong><br>${kr(d.budget.personal_spend_each)}</div>
      <div class="card-ghost"><strong>Personlig – Stine</strong><br>${kr(d.budget.personal_spend_each)}</div>
    </div>
  `;
}

function renderGoals(root) {
  const d = state.data;
  renderDashboard(root);
}

async function fetchBoost() {
  const r = await fetch('assets/data/boost.json');
  const j = await r.json();
  return j.messages;
}

async function renderBoost(root) {
  const msgs = await fetchBoost();
  const msg = msgs[state.boostIndex % msgs.length];
  root.innerHTML = `
    <div class="tile">
      <div class="section-title">⚡ Boost motivator</div>
      <div style="font-size:22px; line-height:1.4; margin:10px 0 16px">${msg}</div>
      <button id="nextBoost" style="padding:10px 14px; border-radius:12px; border:1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04); color: var(--text)">Ny boost</button>
      <div class="footer-note">100 meldinger – random/sekvensielt (demo)</div>
    </div>
  `;
  document.getElementById('nextBoost').addEventListener('click', ()=>{
    state.boostIndex++;
    renderBoost(root);
  });
}

function renderHealth(root) {
  const d = state.data.health;
  const meals = d.week_meal_plan.map(x=>`<div class="card-ghost"><strong>${x.day}</strong><br>Lunsj: ${x.lunsj}<br>Middag: ${x.middag}</div>`).join('');
  const tr = d.training_plan.map(x=>`<div class="card-ghost"><strong>${x.day}</strong><br>${x.type}<br>${x.duration_min} min</div>`).join('');
  const ov = d.overview;
  root.innerHTML = `
    <div class="grid">
      <div class="tile" style="grid-column: span 6">
        <div class="section-title">Matplan (uke)</div>
        <div class="cards">${meals}</div>
      </div>
      <div class="tile" style="grid-column: span 6">
        <div class="section-title">Trening</div>
        <div class="cards">${tr}</div>
      </div>
      <div class="tile" style="grid-column: span 12">
        <div class="section-title">Helseoversikt</div>
        <div class="cards">
          <div class="card-ghost"><strong>Søvn</strong><br>${ov.sleep_avg_h} t</div>
          <div class="card-ghost"><strong>Hvilepuls</strong><br>${ov.hr_rest} bpm</div>
          <div class="card-ghost"><strong>Skritt (snitt)</strong><br>${ov.steps_avg}</div>
          <div class="card-ghost"><strong>Væske</strong><br>${ov.hydration_l} L</div>
        </div>
      </div>
    </div>
  `;
}

function navTo(href) {
  location.hash = href;
}

loadData();
