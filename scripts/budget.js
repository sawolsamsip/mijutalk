// ----------------------- 기본 데이터/상수 -----------------------
const CATEGORIES = [
  { id: 'food', label: { ko: '식비' }, icon: '🍚', color: '#f76d6d' },
  { id: 'cafe', label: { ko: '카페/간식' }, icon: '☕', color: '#ffb86b' },
  { id: 'mart', label: { ko: '마트/생필' }, icon: '🛒', color: '#7ed6df' },
  { id: 'health', label: { ko: '의료/건강' }, icon: '💊', color: '#70a1ff' },
  { id: 'transport', label: { ko: '교통/차량' }, icon: '🚗', color: '#f8c291' },
  { id: 'life', label: { ko: '생활/공과금' }, icon: '💡', color: '#6ab04c' },
  { id: 'shopping', label: { ko: '쇼핑' }, icon: '🛍️', color: '#a29bfe' },
  { id: 'hobby', label: { ko: '취미/여가' }, icon: '🎮', color: '#f3a683' },
  { id: 'child', label: { ko: '육아/교육' }, icon: '👶', color: '#f7b731' },
  { id: 'etc', label: { ko: '기타' }, icon: '📝', color: '#b2bec3' }
];
let currentLang = 'ko';
let expenses = JSON.parse(localStorage.getItem('budget.expenses') || '[]');
let categoryLimits = JSON.parse(localStorage.getItem('budget.limits') || '{}');
let currentCurrency = localStorage.getItem('budget.currency') || 'KRW';
let fxRates = JSON.parse(localStorage.getItem('budget.fxRates') || '{"USD":1,"KRW":1300,"JPY":150,"EUR":1.1}');
let sharedKey = localStorage.getItem('budget.sharedKey') || null;
let sharedUsers = JSON.parse(localStorage.getItem('budget.sharedUsers')||'[]');
let budgetGoal = JSON.parse(localStorage.getItem('budget.goal') || '{"expense":0,"saving":0}');

// ----------------------- 다크모드 -----------------------
const darkPref = localStorage.getItem('budget.darkmode')==='1';
if(darkPref) document.body.classList.add('dark');
document.getElementById('darkmode-toggle').onclick = function() {
  document.body.classList.toggle('dark');
  localStorage.setItem('budget.darkmode', document.body.classList.contains('dark')?'1':'0');
};

// ----------------------- 예산/지출 입력 폼 초기화 -----------------------
function populateCategorySelect() {
  const sel = document.getElementById('expense-category');
  sel.innerHTML = '';
  CATEGORIES.forEach(cat=>{
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.icon + ' ' + cat.label[currentLang];
    sel.appendChild(opt);
  });
}
populateCategorySelect();

// ----------------------- 환율 기능 -----------------------
function renderFX() {
  document.getElementById('currency-select').value = currentCurrency;
  let info = '';
  for(const k in fxRates) {
    if(k !== currentCurrency) info += `1 ${k} ≈ ${fxRates[k]} ${currentCurrency}&nbsp;&nbsp;`;
  }
  document.getElementById('fx-info').innerHTML = info;
}
function fetchFXRates() {
  fetch('https://api.exchangerate.host/latest?base=USD&symbols=KRW,JPY,EUR,USD')
    .then(r=>r.json()).then(data=>{
      fxRates = data.rates;
      localStorage.setItem('budget.fxRates', JSON.stringify(fxRates));
      renderFX();
    });
}
document.getElementById('fx-refresh').onclick = fetchFXRates;
document.getElementById('currency-select').onchange = function() {
  currentCurrency = this.value;
  localStorage.setItem('budget.currency', currentCurrency);
  renderFX();
  rerenderAllCurrency();
};
renderFX();

// ----------------------- 세전 월급/세금/공제 실수령액 계산 -----------------------
function getCustomListSum(type) {
  // type: 'tax', 'pre-tax', 'post-tax'
  const names = Array.from(document.querySelectorAll(`.${type}-custom-name`));
  const amounts = Array.from(document.querySelectorAll(`.${type}-custom-amount`));
  let sum = 0;
  for(let i=0;i<amounts.length;i++) {
    const name = names[i].value.trim();
    const val = Number(amounts[i].value||0);
    if(name && val) sum += val;
  }
  return sum;
}
function getTotalTax() {
  let sum = 0;
  sum += Number(document.getElementById('tax-federal')?.value||0);
  sum += Number(document.getElementById('tax-state')?.value||0);
  sum += Number(document.getElementById('tax-oasdi')?.value||0);
  sum += Number(document.getElementById('tax-medicare')?.value||0);
  sum += Number(document.getElementById('tax-casdi')?.value||0);
  sum += getCustomListSum('tax');
  return sum;
}
function getTotalPreTaxDeduction() {
  let sum = 0;
  sum += Number(document.getElementById('deduct-medical')?.value||0);
  sum += Number(document.getElementById('deduct-dental')?.value||0);
  sum += Number(document.getElementById('deduct-vision')?.value||0);
  sum += Number(document.getElementById('deduct-mseap')?.value||0);
  sum += Number(document.getElementById('deduct-401k-trad')?.value||0);
  sum += getCustomListSum('pre-tax');
  return sum;
}
function getTotalPostTaxDeduction() {
  let sum = 0;
  sum += Number(document.getElementById('deduct-spp')?.value||0);
  sum += Number(document.getElementById('deduct-adnd')?.value||0);
  sum += Number(document.getElementById('deduct-critical')?.value||0);
  sum += Number(document.getElementById('deduct-accident')?.value||0);
  sum += Number(document.getElementById('deduct-401k-roth')?.value||0);
  sum += Number(document.getElementById('deduct-legal')?.value||0);
  sum += Number(document.getElementById('deduct-ltd')?.value||0);
  sum += getCustomListSum('post-tax');
  return sum;
}
function calcNetSalary() {
  const gross = Number(document.getElementById('salary-gross')?.value||0);
  const preTax = getTotalPreTaxDeduction();
  const tax = getTotalTax();
  const postTax = getTotalPostTaxDeduction();
  const taxableIncome = gross - preTax;
  const net = taxableIncome - tax - postTax;
  return {
    gross, preTax, tax, postTax, taxableIncome, net
  };
}
function renderSalarySummary() {
  const {gross, preTax, tax, postTax, taxableIncome, net} = calcNetSalary();
  document.getElementById('salary-summary').innerHTML = `
    <b>세전 월급:</b> ${gross.toLocaleString()}<br>
    <b>세전 공제 총합:</b> ${preTax.toLocaleString()}<br>
    <b>과세소득(세전-공제):</b> ${taxableIncome.toLocaleString()}<br>
    <b>세금 총합:</b> ${tax.toLocaleString()}<br>
    <b>세후 공제 총합:</b> ${postTax.toLocaleString()}<br>
    <b>실수령액:</b> <span style="color:#1976d2;font-size:1.18em;">${net.toLocaleString()}</span>
  `;
}
document.getElementById('salary-form').onsubmit = function(e) {
  e.preventDefault();
  renderSalarySummary();
};
['tax-form','pre-tax-deduction-form','post-tax-deduction-form'].forEach(formId => {
  document.getElementById(formId).oninput = renderSalarySummary;
});
document.addEventListener('input',function(e){
  if(
    e.target.classList.contains('tax-custom-name') ||
    e.target.classList.contains('tax-custom-amount') ||
    e.target.classList.contains('pre-tax-custom-name') ||
    e.target.classList.contains('pre-tax-custom-amount') ||
    e.target.classList.contains('post-tax-custom-name') ||
    e.target.classList.contains('post-tax-custom-amount')
  ){
    renderSalarySummary();
  }
});
window.addEventListener('DOMContentLoaded',renderSalarySummary);

// ----------------------- 예산/지출 저장/표시 등 기존 가계부 코드 -----------------------
// 금액, 통화 변환
function formatCurrency(val) {
  if(!val && val!==0) return '';
  let v = val;
  if(currentCurrency !== 'KRW') v = Math.round(val / fxRates['KRW'] * fxRates[currentCurrency]);
  return v.toLocaleString() + ' ' + currentCurrency;
}

document.getElementById('expense-form').onsubmit = function(e) {
  e.preventDefault();
  const catId = document.getElementById('expense-category').value;
  const desc = document.getElementById('expense-desc').value.trim();
  const value = Number(document.getElementById('expense-value').value);
  const tagStr = document.getElementById('expense-tags').value.trim();
  const tags = tagStr ? tagStr.split(',').map(t=>t.trim()).filter(t=>t) : [];
  const memo = document.getElementById('expense-memo').value.trim();
  const date = new Date().toISOString().slice(0,10);
  let imgUrl = '';
  const imgInput = document.getElementById('expense-image');
  if(imgInput.files && imgInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e2) {
      imgUrl = e2.target.result;
      addExpense({catId, desc, value, tags, memo, imgUrl, date});
    };
    reader.readAsDataURL(imgInput.files[0]);
    return;
  }
  addExpense({catId, desc, value, tags, memo, imgUrl, date});
};
function addExpense(e) {
  expenses.push(e);
  localStorage.setItem('budget.expenses', JSON.stringify(expenses));
  renderExpenses();
  rerenderAllCurrency();
  renderGoalProgress();
  checkBudgetAlerts();
}

// ----------------------- 지출 내역 리스트 -----------------------
function renderExpenses() {
  let html = '';
  expenses.slice().reverse().forEach((e,idx)=>{
    const cat = CATEGORIES.find(c=>c.id===e.catId)||{icon:'',label:{ko:'기타'}};
    html += `
      <div style="margin-bottom:13px;border-bottom:1px solid #e3e3e3;padding-bottom:7px;">
        <span title="${cat.label.ko}">${cat.icon}</span>
        <b style="margin-left:6px;">${e.desc}</b>
        <span style="color:#1976d2;margin-left:8px;">${formatCurrency(e.value)}</span>
        <span style="color:#888;margin-left:8px;font-size:0.95em;">${e.date||''}</span>
        ${e.tags&&e.tags.length?e.tags.map(t=>`<span class="tag">#${t}</span>`).join(''):''}
        ${e.memo?`<span class="memo-box" title="메모">${e.memo}</span>`:''}
        ${e.imgUrl?`<span class="receipt-thumb" onclick="showReceipt('${e.imgUrl.replace(/'/g,'\\\'')}')">🧾</span>`:''}
      </div>
    `;
  });
  document.getElementById('expenses-list').innerHTML = html || "<div style='color:#888;'>지출 내역이 없습니다.</div>";
  checkBudgetAlerts();
}
function showReceipt(imgUrl) {
  let modal = document.createElement('div');
  modal.style = "position:fixed;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:2000;display:flex;align-items:center;justify-content:center;";
  modal.onclick = ()=>document.body.removeChild(modal);
  modal.innerHTML = `<img src="${imgUrl}" style="max-width:85vw;max-height:82vh;border-radius:12px;">`;
  document.body.appendChild(modal);
}
renderExpenses();

// ----------------------- 차트(월별, 카테고리별) -----------------------
let monthlyChart, categoryChart;
function renderCharts() {
  // 월별 합계
  const byMonth = {};
  expenses.forEach(e=>{
    const ym = (e.date||'').slice(0,7);
    byMonth[ym] = (byMonth[ym]||0) + e.value;
  });
  const months = Object.keys(byMonth).sort();
  const vals = months.map(m=>byMonth[m]);
  if(monthlyChart) monthlyChart.destroy();
  monthlyChart = new Chart(document.getElementById('monthly-chart').getContext('2d'), {
    type:'bar',
    data: { labels: months, datasets: [{label:'월별합계',data:vals,backgroundColor:'#1976d2'}] },
    options:{responsive:true,plugins:{legend:{display:false}}}
  });
  // 카테고리별 합계
  const byCat = {};
  expenses.forEach(e=>{
    byCat[e.catId] = (byCat[e.catId]||0) + e.value;
  });
  const cats = Object.keys(byCat);
  const catLabels = cats.map(cid=>{
    const c = CATEGORIES.find(c=>c.id===cid);
    return c?c.icon+' '+c.label.ko:cid;
  });
  const catColors = cats.map(cid=>{
    const c = CATEGORIES.find(c=>c.id===cid); return c?c.color:'#aaa';
  });
  const catVals = cats.map(cid=>byCat[cid]);
  if(categoryChart) categoryChart.destroy();
  categoryChart = new Chart(document.getElementById('category-chart').getContext('2d'), {
    type:'doughnut',
    data: { labels: catLabels, datasets: [{data:catVals,backgroundColor:catColors}] },
    options:{plugins:{legend:{position:'bottom'}}}
  });
}
function rerenderAllCurrency() {
  renderExpenses();
  renderCharts();
  renderGoalProgress();
}
rerenderAllCurrency();

// ----------------------- 알림/위젯 -----------------------
let alertQueue = [];
function addAlert(msg, type='warn') {
  alertQueue.push({msg, type});
  renderAlerts();
}
function renderAlerts() {
  const bar = document.getElementById('alert-bar');
  bar.innerHTML = '';
  alertQueue.forEach((a, idx)=>{
    bar.innerHTML += `<div class="alert-msg alert-${(a.type==='ok'?'ok':(a.type==='danger'?'danger':'warn'))}">
      ${a.msg}
      <span class="alert-close" onclick="closeAlert(${idx})">&times;</span>
    </div>`;
  });
}
window.closeAlert = function(idx) {
  alertQueue.splice(idx,1);
  renderAlerts();
};
function checkBudgetAlerts() {
  alertQueue = [];
  // 한도 경고
  CATEGORIES.forEach(cat => {
    const limit = categoryLimits[cat.id];
    if(!limit) return;
    const spent = expenses.filter(e=>e.catId===cat.id).reduce((a,b)=>a+b.value,0);
    if(spent > limit) {
      addAlert(`${cat.icon} <b>${cat.label.ko}</b> 카테고리 한도 <b>초과</b>! (${formatCurrency(spent)} > ${formatCurrency(limit)})`, 'danger');
    } else if(spent > 0.8*limit) {
      addAlert(`${cat.icon} <b>${cat.label.ko}</b> 한도 <b>80%</b> 이상 사용! (${formatCurrency(spent)} / ${formatCurrency(limit)})`, 'warn');
    }
  });
  // 목표 관련
  const nowYM = new Date().toISOString().slice(0,7);
  const monthExpenses = expenses.filter(e=>(e.date||'').slice(0,7)===nowYM).reduce((a,b)=>a+b.value,0);
  const monthIncomes = (window.incomes||[]).filter(e=>(e.date||'').slice(0,7)===nowYM).reduce((a,b)=>a+b.value,0);
  const saving = Math.max(monthIncomes - monthExpenses, 0);
  if(budgetGoal.expense && monthExpenses > budgetGoal.expense) {
    addAlert(`이달 지출이 <b>목표(${formatCurrency(budgetGoal.expense)})</b>를 초과했습니다!`, 'danger');
  } else if(budgetGoal.expense && monthExpenses > 0.8*budgetGoal.expense) {
    addAlert(`이달 지출이 목표의 80% 이상입니다.`, 'warn');
  }
  if(budgetGoal.saving && saving >= budgetGoal.saving) {
    addAlert(`이달 저축 목표 <b>${formatCurrency(budgetGoal.saving)}</b> 달성!`, 'ok');
  }
}

// ----------------------- 카테고리/태그별 상세 리포트 -----------------------
function populateReportCategory() {
  const sel = document.getElementById('report-category');
  sel.innerHTML = '<option value="">카테고리 전체</option>';
  CATEGORIES.forEach(cat=>{
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.icon + ' ' + cat.label[currentLang];
    sel.appendChild(opt);
  });
}
let detailLineChart, detailPieChart;
document.getElementById('detail-report-form').onsubmit = function(e) {
  e.preventDefault();
  updateDetailReport();
};
function updateDetailReport() {
  const catId = document.getElementById('report-category').value;
  const tag = document.getElementById('report-tag').value.trim().toLowerCase();
  const from = document.getElementById('report-from').value;
  const to = document.getElementById('report-to').value;
  // 1. 필터링
  let filtered = expenses.slice();
  if(catId) filtered = filtered.filter(e=>e.catId===catId);
  if(tag) filtered = filtered.filter(e=>e.tags && e.tags.map(t=>t.toLowerCase()).includes(tag));
  if(from) filtered = filtered.filter(e=>(e.date||'').slice(0,7) >= from);
  if(to) filtered = filtered.filter(e=>(e.date||'').slice(0,7) <= to);
  // 2. 월별 합계 (라인차트)
  const monthly = {};
  filtered.forEach(e=>{
    const ym = (e.date||'').slice(0,7);
    if(!monthly[ym]) monthly[ym]=0;
    monthly[ym]+=e.value;
  });
  const labels = Object.keys(monthly).sort();
  const values = labels.map(ym=>monthly[ym]);
  if(detailLineChart) detailLineChart.destroy();
  detailLineChart = new Chart(document.getElementById('detail-line-chart').getContext('2d'), {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: '월별 합계',
        data: values,
        borderColor: '#00b894',
        backgroundColor: 'rgba(0,184,148,0.08)',
        tension: 0.28,
        pointRadius: 4
      }]
    },
    options: {responsive:true, plugins:{legend:{display:true}}}
  });
  // 3. 태그/카테고리별 비율 (파이차트)
  let groupField, groupData, groupLabels, groupColors;
  if(catId || tag) {
    // 태그 모드면 카테고리별, 카테고리 모드면 태그별
    if(tag) {
      groupField = 'catId';
      groupData = {};
      filtered.forEach(e=>{
        if(!groupData[e.catId]) groupData[e.catId]=0;
        groupData[e.catId]+=e.value;
      });
      groupLabels = Object.keys(groupData).map(cid=>{
        const cat=CATEGORIES.find(c=>c.id===cid);
        return cat?cat.label[currentLang]:cid;
      });
      groupColors = Object.keys(groupData).map(cid=>CATEGORIES.find(c=>c.id===cid)?CATEGORIES.find(c=>c.id===cid).color:'#00b894');
    } else {
      groupField = 'tags';
      groupData = {};
      filtered.forEach(e=>{
        (e.tags||[]).forEach(t=>{
          if(!groupData[t]) groupData[t]=0;
          groupData[t]+=e.value;
        });
      });
      groupLabels = Object.keys(groupData);
      groupColors = groupLabels.map((_,i)=>`hsl(${i*40%360},70%,65%)`);
    }
  } else {
    // 전체 모드: 카테고리별 비율
    groupField = 'catId';
    groupData = {};
    filtered.forEach(e=>{
      if(!groupData[e.catId]) groupData[e.catId]=0;
      groupData[e.catId]+=e.value;
    });
    groupLabels = Object.keys(groupData).map(cid=>{
      const cat=CATEGORIES.find(c=>c.id===cid);
      return cat?cat.label[currentLang]:cid;
    });
    groupColors = Object.keys(groupData).map(cid=>CATEGORIES.find(c=>c.id===cid)?CATEGORIES.find(c=>c.id===cid).color:'#00b894');
  }
  if(detailPieChart) detailPieChart.destroy();
  detailPieChart = new Chart(document.getElementById('detail-pie-chart').getContext('2d'), {
    type: 'doughnut',
    data: {
      labels: groupLabels,
      datasets: [{data:Object.values(groupData), backgroundColor: groupColors}]
    },
    options: {plugins:{legend:{position:'bottom'}}}
  });
  // 4. 요약
  const total = filtered.reduce((a,b)=>a+b.value,0);
  document.getElementById('detail-summary').innerHTML =
    `총 ${filtered.length}건, 합계: <b>${formatCurrency(total)}</b>`;
}
window.addEventListener('DOMContentLoaded', ()=>{
  populateReportCategory();
  updateDetailReport();
});

// ----------------------- 목표 예산/저축 관리 -----------------------
function saveBudgetGoal() {
  localStorage.setItem('budget.goal', JSON.stringify(budgetGoal));
}
document.getElementById('goal-form').onsubmit = function(e) {
  e.preventDefault();
  budgetGoal.expense = Number(document.getElementById('goal-expense').value) || 0;
  budgetGoal.saving = Number(document.getElementById('goal-saving').value) || 0;
  saveBudgetGoal();
  renderGoalProgress();
  checkBudgetAlerts();
};
function renderGoalProgress() {
  const nowYM = new Date().toISOString().slice(0,7);
  const monthExpenses = expenses.filter(e=>(e.date||'').slice(0,7)===nowYM).reduce((a,b)=>a+b.value,0);
  const monthIncomes = (window.incomes||[]).filter(e=>(e.date||'').slice(0,7)===nowYM).reduce((a,b)=>a+b.value,0);
  const saving = Math.max(monthIncomes - monthExpenses, 0);
  const expGoal = budgetGoal.expense||1;
  const savGoal = budgetGoal.saving||1;
  const expP = Math.min(monthExpenses/expGoal*100, 999);
  const savP = Math.min(saving/savGoal*100, 999);
  document.getElementById('goal-progress-box').innerHTML = `
    <div>이달 지출: <b>${formatCurrency(monthExpenses)}</b> / 목표 <b>${formatCurrency(budgetGoal.expense)}</b>
      <div class="progress-bar"><div class="progress-inner" style="width:${Math.min(expP,100)}%;background:#e17055"></div></div>
      <span>${expP.toFixed(1)}%</span>
    </div>
    <div style="margin-top:10px;">이달 저축: <b>${formatCurrency(saving)}</b> / 목표 <b>${formatCurrency(budgetGoal.saving)}</b>
      <div class="progress-bar"><div class="progress-inner" style="width:${Math.min(savP,100)}%;background:#00b894"></div></div>
      <span>${savP.toFixed(1)}%</span>
    </div>
  `;
}
window.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('goal-expense').value = budgetGoal.expense||'';
  document.getElementById('goal-saving').value = budgetGoal.saving||'';
  renderGoalProgress();
});

// ----------------------- AI 소비 리포트/팁 -----------------------
document.getElementById('ai-report-btn').onclick = function() {
  renderAIReport();
};
function renderAIReport() {
  const now = new Date();
  const months = [];
  for(let i=5; i>=0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    months.push(d.toISOString().slice(0,7));
  }
  let report = '<ul>';
  const catTrends = {};
  CATEGORIES.forEach(cat=>{
    catTrends[cat.id] = months.map(mon=>
      expenses.filter(e=>e.catId===cat.id && (e.date||'').slice(0,7)===mon)
              .reduce((a,b)=>a+b.value,0)
    );
  });
  let alerts = [], tips = [], kudos = [];
  CATEGORIES.forEach(cat=>{
    const arr = catTrends[cat.id];
    const avg = arr.reduce((a,b)=>a+b,0)/arr.length;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const last = arr[arr.length-1];
    const prev = arr[arr.length-2];
    if(last > prev*1.5 && last>10000) alerts.push(`"${cat.label.ko}" 지출이 최근 급증했어요!`);
    if(last > avg*1.8 && last>20000) alerts.push(`"${cat.label.ko}" 이번달 지출이 평소보다 매우 많아요.`);
    if(last < avg*0.6 && avg>0) kudos.push(`"${cat.label.ko}"에서 절약을 잘 하고 계세요!`);
    if(last > 0.5*max && cat.label.ko.match(/외식|쇼핑|취미/)) tips.push(`"${cat.label.ko}"는 할인쿠폰, 미리 예산 설정 등으로 관리해보세요.`);
  });
  const total = months.map((mon,i)=>expenses.filter(e=>(e.date||'').slice(0,7)===mon).reduce((a,b)=>a+b.value,0));
  const totalAvg = total.reduce((a,b)=>a+b,0)/months.length;
  report += `<li>최근 6개월 월평균 총 지출: <b>${formatCurrency(totalAvg)}</b></li>`;
  const stddev = Math.sqrt(total.map(v=>Math.pow(v-totalAvg,2)).reduce((a,b)=>a+b,0)/months.length);
  if(stddev > totalAvg*0.5) alerts.push('지출 변동폭이 크니 매달 예산 점검을 추천합니다.');
  else kudos.push('매달 일정하게 예산을 잘 관리하고 계세요!');
  report += alerts.map(a=>`<li style="color:#d90429;">⚠️ ${a}</li>`).join('');
  report += kudos.map(a=>`<li style="color:#0a7a0a;">🌱 ${a}</li>`).join('');
  report += tips.map(a=>`<li style="color:#0072c2;">💡 ${a}</li>`).join('');
  report += '</ul>';
  document.getElementById('ai-report-box').innerHTML = report;
}

// ----------------------- 도움말/튜토리얼 팝업 -----------------------
document.getElementById('help-btn').onclick = function() {
  document.getElementById('help-modal').style.display = 'block';
  document.getElementById('help-modal').innerHTML = `
    <div style="background:#fff;padding:22px 18px 18px 18px;border-radius:14px;max-width:410px;margin:80px auto;color:#222;position:relative;">
      <button onclick="document.getElementById('help-modal').style.display='none'" style="position:absolute;right:12px;top:10px;">✖️</button>
      <h2 style="margin-top:0;">도움말</h2>
      <ul>
        <li>예산/지출 입력, 카테고리, 태그, 메모, 사진 첨부 등 다양한 기능 이용</li>
        <li>다크모드/라이트모드 즉시 전환 지원</li>
        <li>내보내기/가져오기, 목표 설정, AI 리포트 등 다양한 고급기능</li>
        <li>(상세 가이드와 FAQ는 <a href="https://github.com/sawolsamsip/mijutalk/wiki" target="_blank">프로젝트 위키</a> 참고)</li>
      </ul>
    </div>
  `;
};
