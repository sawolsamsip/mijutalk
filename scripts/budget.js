// 기존 코드 생략, 아래는 입력내역 기록 부분만 추가/수정

// 세금 입력 내역 저장 및 표시
let taxHistory = JSON.parse(localStorage.getItem('budget.taxHistory') || '[]');
function renderTaxHistory() {
  document.getElementById('tax-hist-list').innerHTML = 
    taxHistory.length === 0 ?
    "<div style='color:#888;'>세금 내역이 없습니다.</div>" :
    taxHistory.map((item, i) =>
      `<div style="margin-bottom:7px;">
        <b>${item.name}</b> <span style="color:#1976d2;margin-left:8px;">${Number(item.amount).toLocaleString()}</span>
        <span style="color:#888;margin-left:8px;font-size:0.95em;">${item.date||''}</span>
        <button onclick="removeTaxHistory(${i})" style="margin-left:10px;">삭제</button>
      </div>`
    ).join('');
}
function addTaxHistory(item) {
  taxHistory.push(item);
  localStorage.setItem('budget.taxHistory', JSON.stringify(taxHistory));
  renderTaxHistory();
}
function removeTaxHistory(idx) {
  taxHistory.splice(idx,1);
  localStorage.setItem('budget.taxHistory', JSON.stringify(taxHistory));
  renderTaxHistory();
}
document.getElementById('tax-add-form').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('tax-item-name').value.trim();
  const amount = Number(document.getElementById('tax-item-amount').value);
  if(!name || !amount) return;
  addTaxHistory({name, amount, date: new Date().toISOString().slice(0,10)});
  document.getElementById('tax-item-name').value = '';
  document.getElementById('tax-item-amount').value = '';
};
renderTaxHistory();
window.removeTaxHistory = removeTaxHistory;

// 세전 공제 입력 내역
let preTaxHistory = JSON.parse(localStorage.getItem('budget.preTaxHistory') || '[]');
function renderPreTaxHistory() {
  document.getElementById('pre-tax-hist-list').innerHTML = 
    preTaxHistory.length === 0 ?
    "<div style='color:#888;'>세전 공제 내역이 없습니다.</div>" :
    preTaxHistory.map((item, i) =>
      `<div style="margin-bottom:7px;">
        <b>${item.name}</b> <span style="color:#1976d2;margin-left:8px;">${Number(item.amount).toLocaleString()}</span>
        <span style="color:#888;margin-left:8px;font-size:0.95em;">${item.date||''}</span>
        <button onclick="removePreTaxHistory(${i})" style="margin-left:10px;">삭제</button>
      </div>`
    ).join('');
}
function addPreTaxHistory(item) {
  preTaxHistory.push(item);
  localStorage.setItem('budget.preTaxHistory', JSON.stringify(preTaxHistory));
  renderPreTaxHistory();
}
function removePreTaxHistory(idx) {
  preTaxHistory.splice(idx,1);
  localStorage.setItem('budget.preTaxHistory', JSON.stringify(preTaxHistory));
  renderPreTaxHistory();
}
document.getElementById('pre-tax-add-form').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('pre-tax-item-name').value.trim();
  const amount = Number(document.getElementById('pre-tax-item-amount').value);
  if(!name || !amount) return;
  addPreTaxHistory({name, amount, date: new Date().toISOString().slice(0,10)});
  document.getElementById('pre-tax-item-name').value = '';
  document.getElementById('pre-tax-item-amount').value = '';
};
renderPreTaxHistory();
window.removePreTaxHistory = removePreTaxHistory;

// 세후 공제 입력 내역
let postTaxHistory = JSON.parse(localStorage.getItem('budget.postTaxHistory') || '[]');
function renderPostTaxHistory() {
  document.getElementById('post-tax-hist-list').innerHTML = 
    postTaxHistory.length === 0 ?
    "<div style='color:#888;'>세후 공제 내역이 없습니다.</div>" :
    postTaxHistory.map((item, i) =>
      `<div style="margin-bottom:7px;">
        <b>${item.name}</b> <span style="color:#1976d2;margin-left:8px;">${Number(item.amount).toLocaleString()}</span>
        <span style="color:#888;margin-left:8px;font-size:0.95em;">${item.date||''}</span>
        <button onclick="removePostTaxHistory(${i})" style="margin-left:10px;">삭제</button>
      </div>`
    ).join('');
}
function addPostTaxHistory(item) {
  postTaxHistory.push(item);
  localStorage.setItem('budget.postTaxHistory', JSON.stringify(postTaxHistory));
  renderPostTaxHistory();
}
function removePostTaxHistory(idx) {
  postTaxHistory.splice(idx,1);
  localStorage.setItem('budget.postTaxHistory', JSON.stringify(postTaxHistory));
  renderPostTaxHistory();
}
document.getElementById('post-tax-add-form').onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById('post-tax-item-name').value.trim();
  const amount = Number(document.getElementById('post-tax-item-amount').value);
  if(!name || !amount) return;
  addPostTaxHistory({name, amount, date: new Date().toISOString().slice(0,10)});
  document.getElementById('post-tax-item-name').value = '';
  document.getElementById('post-tax-item-amount').value = '';
};
renderPostTaxHistory();
window.removePostTaxHistory = removePostTaxHistory;

// 지출 입력 내역은 기존 코드 그대로 (expenses-list 등)
