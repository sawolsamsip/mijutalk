// budget.js

// 설정값: 이제 모든 기본 항목에 고유 ID를 부여합니다.
const DEFAULT_DEDUCTIONS = {
    taxes: [
        { id: 'tax-federal', name: "Federal Withholding", amount: 0 },
        { id: 'tax-stateca', name: "State Tax (CA)", amount: 0 },
        { id: 'tax-oasdi', name: "OASDI (Social Security)", amount: 0 },
        { id: 'tax-medicare', name: "Medicare", amount: 0 },
        { id: 'tax-casdi', name: "CA SDI", amount: 0 }
    ],
    preTax: [
        { id: 'pre-401k', name: "401k Traditional", amount: 0 },
        { id: 'pre-medical', name: "Medical Premium", amount: 0 },
        { id: 'pre-dental', name: "Dental Premium", amount: 0 },
        { id: 'pre-vision', name: "Vision Premium", amount: 0 },
        { id: 'pre-mseap', name: "MSEAP", amount: 0 }
    ],
    postTax: [
        { id: 'post-roth', name: "401k Roth", amount: 0 },
        { id: 'post-spp', name: "Stock Purchase Plan", amount: 0 },
        { id: 'post-legal', name: "Legal Services", amount: 0 },
        { id: 'post-ltd', name: "LTD", amount: 0 },
        { id: 'post-add', name: "AD&D", amount: 0 },
        { id: 'post-accident', name: "Accident Insurance", amount: 0 },
        { id: 'post-critical', name: "Critical Illness", amount: 0 }
    ]
};

const budgetData = {
    income: 0,
    taxes: [],
    preTax: [],
    postTax: [],
    expenses: [],
    categories: [], // loadData에서 초기화될 예정
    currentLanguage: 'ko'
};

let incomeFlowChartInstance = null;
let expenseCategoryChartInstance = null;
let editingItem = null;

// --- 유틸리티 함수 ---
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function formatMoney(amount) {
    if (Number.isNaN(amount) || amount === null || amount === undefined) {
        return "0.00";
    }
    return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculatePercentage(value, total) {
    if (total === 0) {
        return "0.0%";
    }
    return ((value / total) * 100).toFixed(1) + '%';
}

// --- 언어 전환 ---
function switchLanguage(lang) {
    budgetData.currentLanguage = lang;
    document.querySelectorAll('[data-lang]').forEach(e => {
        if (e.getAttribute('data-lang') === lang) {
            e.classList.remove('hidden');
        } else {
            e.classList.add('hidden');
        }
    });

    // 플레이스홀더 텍스트 업데이트
    document.querySelectorAll('[data-lang-ko-placeholder]').forEach(el => {
        const koPlaceholder = el.getAttribute('data-lang-ko-placeholder');
        const enPlaceholder = el.getAttribute('data-lang-en-placeholder');
        el.placeholder = (lang === 'ko') ? koPlaceholder : enPlaceholder;
    });

    document.getElementById('lang-ko').classList.toggle('active', lang === 'ko');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');

    populateCategorySelect(); // 카테고리 셀렉트박스 언어에 맞게 업데이트
    updateUI(); // UI 전체 업데이트
}

// --- 카테고리 셀렉트박스 채우기 ---
function populateCategorySelect() {
    const select = document.getElementById('category-select');
    const prev = select.value;
    select.innerHTML = '';

    budgetData.categories.forEach(cat => {
        const o = document.createElement('option');
        o.value = cat.id;
        o.textContent = budgetData.currentLanguage === 'ko' ? cat.name : cat.nameEn || cat.name;
        select.appendChild(o);
    });

    const c = document.createElement('option');
    c.value = 'custom';
    c.textContent = budgetData.currentLanguage === 'ko' ? '✏️ 직접 입력' : '✏️ Custom Category';
    select.appendChild(c);

    if (budgetData.categories.some(cat => cat.id === prev) || prev === 'custom') {
        select.value = prev;
    } else {
        // 카테고리가 없는 경우를 대비한 처리
        select.value = budgetData.categories[0] ? budgetData.categories[0].id : '';
    }
}

// --- 차트 업데이트 ---
function updateCharts(grossIncome, preTaxTotal, taxTotal, postTaxTotal, expensesTotal, remaining) {
    // Chart is not defined 오류를 피하기 위해 Chart 객체 존재 여부 확인
    if (typeof Chart === 'undefined') {
        console.warn("Chart.js library not loaded. Skipping chart updates.");
        return;
    }

    if (incomeFlowChartInstance) incomeFlowChartInstance.destroy();
    if (expenseCategoryChartInstance) expenseCategoryChartInstance.destroy();

    // 수입 분배 차트
    const ctx1 = document.getElementById('incomeFlowChart').getContext('2d');
    incomeFlowChartInstance = new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: [
                budgetData.currentLanguage === 'ko' ? '세전 공제' : 'Pre-Tax Deductions',
                budgetData.currentLanguage === 'ko' ? '세금' : 'Taxes',
                budgetData.currentLanguage === 'ko' ? '세후 공제' : 'Post-Tax Deductions',
                budgetData.currentLanguage === 'ko' ? '총 지출' : 'Total Expenses',
                budgetData.currentLanguage === 'ko' ? '남은 잔액' : 'Remaining Balance'
            ],
            datasets: [{
                data: [preTaxTotal, taxTotal, postTaxTotal, expensesTotal, Math.max(0, remaining)],
                backgroundColor: ['#4895ef', '#f72585', '#4cc9f0', '#f8961e', '#43aa8b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 13 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                            const percentage = total === 0 ? '0.0%' : ((value / total) * 100).toFixed(1) + '%';
                            return `${label}: $${formatMoney(value)} (${percentage})`;
                        }
                    }
                }
            }
        }
    });

    // 지출 카테고리 차트
    const ctx2 = document.getElementById('expenseCategoryChart').getContext('2d');
    const categoryTotals = {};
    budgetData.expenses.forEach(item => {
        const cat = budgetData.categories.find(c => c.id === item.category);
        const label = budgetData.currentLanguage === 'ko' ? (cat?.name || '기타') : (cat?.nameEn || cat?.name || 'Other');
        if (!categoryTotals[label]) {
            categoryTotals[label] = 0;
        }
        categoryTotals[label] += item.amount;
    });

    expenseCategoryChartInstance = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#4895ef', '#f72585', '#4cc9f0', '#f8961e', '#7209b7', '#b5179e', '#43aa8b', '#ffd60a', '#b5ead7', '#ffdac1']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { font: { size: 13 } } },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                            const percentage = total === 0 ? '0.0%' : ((value / total) * 100).toFixed(1) + '%';
                            return `${label}: $${formatMoney(value)} (${percentage})`;
                        }
                    }
                }
            }
        }
    });
}

// --- UI 전체 업데이트 ---
function updateUI() {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));

    const gross = budgetData.income;
    const pretax = budgetData.preTax.reduce((s, i) => s + i.amount, 0);
    const tax = budgetData.taxes.reduce((s, i) => s + i.amount, 0);
    const posttax = budgetData.postTax.reduce((s, i) => s + i.amount, 0);

    const totalDeduct = pretax + tax + posttax;
    const taxable = gross - pretax;
    const net = taxable - tax - posttax;
    const expenses = budgetData.expenses.reduce((s, i) => s + i.amount, 0);
    const remain = net - expenses;

    document.getElementById('income-input').value = gross;

    document.getElementById('gross-income').textContent = formatMoney(gross);
    document.getElementById('pre-tax-deductions').textContent = formatMoney(pretax);
    document.getElementById('taxable-income').textContent = formatMoney(taxable);
    document.getElementById('tax-total').textContent = formatMoney(tax);
    document.getElementById('post-tax-deductions').textContent = formatMoney(posttax);
    document.getElementById('total-deductions-taxes').textContent = formatMoney(totalDeduct);
    document.getElementById('net-income').textContent = formatMoney(net);

    document.getElementById('expenses-total-card').textContent = formatMoney(expenses);
    document.getElementById('remaining-balance').textContent = formatMoney(remain);

    const remainingBalanceElement = document.getElementById('remaining-balance');
    remainingBalanceElement.className = `card-amount ${remain >= 0 ? 'positive' : 'negative'}`;

    document.getElementById('expenses-percentage-card').textContent = calculatePercentage(expenses, gross);
    document.getElementById('remaining-percentage-card').textContent = calculatePercentage(remain, gross);

    // 각 리스트를 렌더링하고, 항목이 있으면 보이게, 없으면 숨기게 처리
    renderList('tax-list', budgetData.taxes);
    renderList('pre-tax-list', budgetData.preTax);
    renderList('post-tax-list', budgetData.postTax);
    renderExpenses();

    populateCategorySelect();
    updateCharts(gross, pretax, tax, posttax, expenses, remain);
}

// --- 목록 렌더링 함수 (세금, 세전/세후 공제) ---
function renderList(elementId, items) {
    const container = document.getElementById(elementId);
    const type = elementId.replace('-list', ''); // 'tax-list' -> 'tax', 'pre-tax-list' -> 'pre-tax'

    // 항목이 하나라도 있으면 리스트를 보이게 하고, 없으면 숨깁니다.
    if (items.length > 0) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }

    container.innerHTML = items.map(item => `
        <div class="list-item" data-id="${item.id}" data-type="${type}">
            ${editingItem && editingItem.id === item.id ?
                `<div class="list-item-content">
                    <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '항목명' : 'Item name'}">
                    <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '금액' : 'Amount'}">
                </div>
                <div class="list-item-actions">
                    <button onclick="saveEdit('${type}','${item.id}')" class="btn-success">${budgetData.currentLanguage === 'ko' ? '저장' : 'Save'}</button>
                    <button onclick="cancelEdit()" class="btn-warning">${budgetData.currentLanguage === 'ko' ? '취소' : 'Cancel'}</button>
                </div>`
                :
                `<div class="list-item-content">
                    <span>${item.name}: $${formatMoney(item.amount)}</span>
                </div>
                <div class="list-item-actions">
                    <button onclick="editItem('${type}','${item.id}')" class="btn-info">${budgetData.currentLanguage === 'ko' ? '수정' : 'Edit'}</button>
                    <button onclick="deleteItem('${type}','${item.id}')" class="btn-danger">${budgetData.currentLanguage === 'ko' ? '삭제' : 'Delete'}</button>
                </div>`
            }
        </div>
    `).join('');
}

// --- 지출 목록 렌더링 함수 ---
function renderExpenses() {
    const container = document.getElementById('expenses-list');

    // 항목이 하나라도 있으면 리스트를 보이게 하고, 없으면 숨깁니다.
    if (budgetData.expenses.length > 0) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }

    container.innerHTML = budgetData.expenses.map(item => {
        const category = budgetData.categories.find(cat => cat.id === item.category);
        const categoryName = budgetData.currentLanguage === 'ko' ? category?.name : category?.nameEn || category?.name || 'Other';
        return `
            <div class="list-item" data-id="${item.id}" data-type="expenses">
                ${editingItem && editingItem.id === item.id ?
                    `<div class="list-item-content">
                        <select id="edit-category-${item.id}" style="margin-right:7px;">
                            ${budgetData.categories.map(cat => `
                                <option value="${cat.id}" ${cat.id === item.category ? 'selected' : ''}>
                                    ${budgetData.currentLanguage === 'ko' ? cat.name : cat.nameEn || cat.name}
                                </option>
                            `).join('')}
                        </select>
                        <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '항목명' : 'Item name'}">
                        <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '금액' : 'Amount'}">
                    </div>
                    <div class="list-item-actions">
                        <button onclick="saveEdit('expenses','${item.id}')" class="btn-success">${budgetData.currentLanguage === 'ko' ? '저장' : 'Save'}</button>
                        <button onclick="cancelEdit()" class="btn-warning">${budgetData.currentLanguage === 'ko' ? '취소' : 'Cancel'}</button>
                    </div>`
                    :
                    `<div class="list-item-content">
                        <span class="badge">${categoryName || '📌 ' + (budgetData.currentLanguage === 'ko' ? '기타' : 'Other')}</span>
                        <span>${item.name}</span>
                    </div>
                    <span class="list-item-amount">$${formatMoney(item.amount)}</span>
                    <div class="list-item-actions">
                        <button onclick="editItem('expenses','${item.id}')" class="btn-info">${budgetData.currentLanguage === 'ko' ? '수정' : 'Edit'}</button>
                        <button onclick="deleteItem('expenses','${item.id}')" class="btn-danger">${budgetData.currentLanguage === 'ko' ? '삭제' : 'Delete'}</button>
                    </div>`
                }
            </div>
        `;
    }).join('');
}

// --- CRUD 함수 ---
function deleteItem(type, id) {
    if (confirm(budgetData.currentLanguage === 'ko' ? '정말로 삭제하시겠습니까?' : 'Are you sure you want to delete this item?')) {
        if (Array.isArray(budgetData[type])) {
            budgetData[type] = budgetData[type].filter(item => item.id !== id);
            updateUI();
        } else {
            console.error(`Error: budgetData.${type} is not an array. Cannot delete item.`);
            alert(budgetData.currentLanguage === 'ko' ? `오류: '${type}' 데이터가 손상되었습니다. 항목을 삭제할 수 없습니다.` : `Error: Data for '${type}' is corrupted. Cannot delete item.`);
        }
    }
}

function editItem(type, id) {
    cancelEdit(); // 다른 편집 중인 항목이 있다면 취소
    if (Array.isArray(budgetData[type])) {
        const item = budgetData[type].find(item => item.id === id);
        if (item) {
            editingItem = { ...item, type: type }; // 현재 편집 중인 항목 정보 저장
            updateUI();
        } else {
            console.error(`Item with ID ${id} not found in budgetData.${type}`);
        }
    } else {
        console.error(`Error: budgetData.${type} is not an array. Cannot edit item.`);
        alert(budgetData.currentLanguage === 'ko' ? `오류: '${type}' 데이터가 손상되었습니다. 항목을 수정할 수 없습니다.` : `Error: Data for '${type}' is corrupted. Cannot edit item.`);
    }
}

function saveEdit(type, id) {
    if (!Array.isArray(budgetData[type])) {
        console.error(`Error: budgetData.${type} is not an array. Cannot save item.`);
        alert(budgetData.currentLanguage === 'ko' ? `오류: '${type}' 데이터가 손상되었습니다. 항목을 저장할 수 없습니다.` : `Error: Data for '${type}' is corrupted. Cannot save item.`);
        return;
    }

    const idx = budgetData[type].findIndex(item => item.id === id);
    if (idx === -1) {
        console.error(`Item with ID ${id} not found for saving.`);
        return;
    }

    const newNameInput = document.getElementById(`edit-name-${id}`);
    const newAmountInput = document.getElementById(`edit-amount-${id}`);

    const newName = newNameInput ? newNameInput.value.trim() : '';
    const newAmount = parseFloat(newAmountInput ? newAmountInput.value : '');

    if (!newName) {
        alert(budgetData.currentLanguage === 'ko' ? '항목명은 비워둘 수 없습니다.' : 'Item name cannot be empty.');
        return;
    }
    if (isNaN(newAmount)) {
        alert(budgetData.currentLanguage === 'ko' ? '유효한 금액을 입력해주세요.' : 'Please enter a valid amount.');
        return;
    }

    budgetData[type][idx].name = newName;
    budgetData[type][idx].amount = newAmount;

    if (type === 'expenses') {
        const newCategorySelect = document.getElementById(`edit-category-${id}`);
        const newCategory = newCategorySelect ? newCategorySelect.value : '';
        budgetData[type][idx].category = newCategory;
    }
    editingItem = null; // 편집 완료 상태 초기화
    updateUI();
}

function cancelEdit() {
    editingItem = null; // 편집 취소 상태 초기화
    updateUI();
}

// --- 데이터 저장/불러오기/초기화 ---
function saveData() {
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
    alert(budgetData.currentLanguage === 'ko' ? '데이터가 저장되었습니다!' : 'Data saved!');
}

function loadData() {
    const d = localStorage.getItem('budgetData');
    if (d) {
        const parsed = JSON.parse(d);

        budgetData.income = parsed.income || 0;
        // 각 배열 속성이 유효한 배열인지 확인하고, 아니면 빈 배열로 초기화
        budgetData.taxes = Array.isArray(parsed.taxes) ? parsed.taxes : [];
        budgetData.preTax = Array.isArray(parsed.preTax) ? parsed.preTax : [];
        budgetData.postTax = Array.isArray(parsed.postTax) ? parsed.postTax : [];
        budgetData.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];

        // 카테고리 로드 또는 기본값 설정
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
            budgetData.categories = parsed.categories;
        } else {
            budgetData.categories = [
                { id: 'housing', name: '🏠 주거', nameEn: '🏠 Housing' },
                { id: 'food', name: '🍔 식비', nameEn: '🍔 Food' },
                { id: 'transportation', name: '🚗 교통', nameEn: '🚗 Transportation' },
                { id: 'health', name: '🏥 건강', nameEn: '🏥 Health' },
                { id: 'family', name: '👪 가족', nameEn: '👪 Family' },
                { id: 'shopping', name: '🛍️ 쇼핑', nameEn: '🛍️ Shopping' },
                { id: 'finance', name: '💳 금융', nameEn: '💳 Finance' },
                { id: 'travel', name: '✈️ 여행', nameEn: '✈️ Travel' },
                { id: 'saving', name: '💰 저축', nameEn: '💰 Saving' },
                { id: 'business', name: '💼 업무', nameEn: '💼 Business' }
            ];
        }

        budgetData.currentLanguage = parsed.currentLanguage || 'ko';

        // DEFAULT_DEDUCTIONS 항목들을 budgetData에 통합 (기존 값 덮어쓰기 또는 추가)
        ['taxes', 'preTax', 'postTax'].forEach(type => {
            DEFAULT_DEDUCTIONS[type].forEach(defaultItem => {
                const existingItemIndex = budgetData[type].findIndex(item => item.id === defaultItem.id);
                if (existingItemIndex > -1) {
                    // 이미 존재하는 기본 항목이면, 이름만 덮어쓰고 금액은 로컬 스토리지 값을 유지합니다.
                    // 금액을 0으로 초기화하려면 다음 줄의 주석을 해제하세요.
                    // budgetData[type][existingItemIndex].name = defaultItem.name;
                    // budgetData[type][existingItemIndex].amount = 0; // 초기화 시 0으로 설정
                } else {
                    // 존재하지 않는 기본 항목이면 새로 추가 (초기 로드 시)
                    budgetData[type].push({ ...defaultItem, id: defaultItem.id || generateUniqueId() });
                }
            });
        });

    } else {
        console.log("No budgetData found in localStorage, initializing default data.");
        initDefaultData(); // 로컬 스토리지에 데이터가 없으면 기본 데이터로 초기화
    }
    updateUI(); // loadData 후 반드시 UI 업데이트
    switchLanguage(budgetData.currentLanguage); // 언어 설정도 로드 후 적용
}

function resetData() {
    if (confirm(budgetData.currentLanguage === 'ko' ? '모든 데이터를 초기화할까요? 이 작업은 되돌릴 수 없습니다.' : 'Reset all data? This action cannot be undone.')) {
        localStorage.removeItem('budgetData');
        initDefaultData(); // 로컬 스토리지 삭제 후 기본 데이터로 초기화
        updateUI();
    }
}

// 앱이 처음 로드되거나 '데이터 초기화' 시 호출
function initDefaultData() {
    budgetData.income = 0;
    // 기본 공제/세금 항목에 고유 ID를 부여하여 초기화
    budgetData.taxes = DEFAULT_DEDUCTIONS.taxes.map(item => ({ ...item, id: item.id || generateUniqueId(), type: 'taxes' }));
    budgetData.preTax = DEFAULT_DEDUCTIONS.preTax.map(item => ({ ...item, id: item.id || generateUniqueId(), type: 'preTax' }));
    budgetData.postTax = DEFAULT_DEDUCTIONS.postTax.map(item => ({ ...item, id: item.id || generateUniqueId(), type: 'postTax' }));
    budgetData.expenses = [];
    budgetData.categories = [
        { id: 'housing', name: '🏠 주거', nameEn: '🏠 Housing' },
        { id: 'food', name: '🍔 식비', nameEn: '🍔 Food' },
        { id: 'transportation', name: '🚗 교통', nameEn: '🚗 Transportation' },
        { id: 'health', name: '🏥 건강', nameEn: '🏥 Health' },
        { id: 'family', name: '👪 가족', nameEn: '👪 Family' },
        { id: 'shopping', name: '🛍️ 쇼핑', nameEn: '🛍️ Shopping' },
        { id: 'finance', name: '💳 금융', nameEn: '💳 Finance' },
        { id: 'travel', name: '✈️ 여행', nameEn: '✈️ Travel' },
        { id: 'saving', name: '💰 저축', nameEn: '💰 Saving' },
        { id: 'business', name: '💼 업무', nameEn: '💼 Business' }
    ];
    budgetData.currentLanguage = 'ko';
    localStorage.setItem('budgetData', JSON.stringify(budgetData));
}

// --- 이벤트 리스너 ---
document.getElementById('lang-ko').onclick = () => switchLanguage('ko');
document.getElementById('lang-en').onclick = () => switchLanguage('en');

window.onload = function() {
    loadData();
    // loadData 함수 내에서 switchLanguage를 호출하므로 여기서 다시 호출할 필요 없음
};

document.getElementById('income-input').addEventListener('input', function(e) {
    budgetData.income = parseFloat(e.target.value) || 0;
    updateUI();
});

// 지출 추가 함수
function addExpense() {
    const categorySelect = document.getElementById('category-select');
    const nameInput = document.getElementById('expense-name-input');
    const amountInput = document.getElementById('expense-amount-input-main');

    const category = categorySelect.value;
    const name = nameInput.value.trim();
    const amount = parseFloat(amountInput.value);

    if (category === 'custom') {
        alert(budgetData.currentLanguage === 'ko' ? '먼저 새 카테고리를 추가하거나 기존 카테고리를 선택하세요.' : 'Please add a new category or select an existing one first.');
        return;
    }
    if (!name) {
        alert(budgetData.currentLanguage === 'ko' ? '지출 항목 이름을 입력하세요.' : 'Enter expense name.');
        return;
    }
    if (isNaN(amount) || amount <= 0) { // 금액이 유효한 숫자인지 및 0보다 큰지 확인
        alert(budgetData.currentLanguage === 'ko' ? '유효한 금액을 입력하세요.' : 'Enter a valid amount.');
        return;
    }

    budgetData.expenses.push({
        id: generateUniqueId(),
        name,
        amount,
        category
    });

    nameInput.value = '';
    amountInput.value = '';
    categorySelect.value = budgetData.categories[0]?.id || ''; // 첫 번째 카테고리로 초기화

    updateUI();
}

// 카테고리 추가 함수
function addCategory() {
    const newCategoryInput = document.getElementById('new-category-input');
    const name = newCategoryInput.value.trim();
    if (!name) {
        alert(budgetData.currentLanguage === 'ko' ? '카테고리 이름을 입력하세요.' : 'Enter category name.');
        return;
    }

    const existingCategory = budgetData.categories.find(
        cat => cat.name.toLowerCase() === name.toLowerCase() || cat.nameEn?.toLowerCase() === name.toLowerCase()
    );
    if (existingCategory) {
        alert(budgetData.currentLanguage === 'ko' ? '이미 존재하는 카테고리입니다.' : 'Category already exists.');
        return;
    }

    const id = generateUniqueId();
    const catObj = { id, name: name, nameEn: name }; // 초기에는 영어 이름도 한글 이름으로 설정
    budgetData.categories.push(catObj);
    newCategoryInput.value = '';
    populateCategorySelect();
    document.getElementById('category-input-container').classList.add('hidden');
    document.getElementById('category-select').value = id; // 새로 추가된 카테고리 자동 선택
    updateUI();
}

/**
 * 세금/공제 항목 추가 함수 (taxes, preTax, postTax)
 * @param {string} type - 'taxes', 'preTax', 'postTax' 중 하나
 * @param {boolean} isCustom - '사용자 정의' 버튼을 통해 호출되었는지 여부
 */
function addCategorizedItem(type, isCustom = false) {
    let nameInput, amountInput, selectElement, defaultItemsList;

    if (type === 'taxes') {
        selectElement = document.getElementById('tax-type-select');
        nameInput = document.getElementById('tax-custom-name-input');
        amountInput = document.getElementById('tax-amount-input');
        defaultItemsList = DEFAULT_DEDUCTIONS.taxes;
    } else if (type === 'preTax') {
        selectElement = document.getElementById('pre-tax-type-select');
        nameInput = document.getElementById('pre-tax-custom-name-input');
        amountInput = document.getElementById('pre-tax-amount-input');
        defaultItemsList = DEFAULT_DEDUCTIONS.preTax;
    } else if (type === 'postTax') {
        selectElement = document.getElementById('post-tax-type-select');
        nameInput = document.getElementById('post-tax-custom-name-input');
        amountInput = document.getElementById('post-tax-amount-input');
        defaultItemsList = DEFAULT_DEDUCTIONS.postTax;
    } else {
        console.error("Invalid type for addCategorizedItem:", type);
        return;
    }

    const selectedValue = selectElement.value;
    let name = '';
    let amount = parseFloat(amountInput.value);

    // 금액이 유효한지 먼저 확인 (0보다 크거나 같은 경우 허용)
    // 미리 정의된 항목의 경우, 금액이 0이더라도 추가될 수 있도록 허용 (처음부터 0으로 설정되어 있으므로)
    if (isNaN(amount) || amount < 0) {
        // '사용자 정의'가 아니면서 금액 입력이 필수적인 경우에만 알림
        if (!isCustom && selectedValue !== 'custom' && selectedValue !== '') {
            alert(budgetData.currentLanguage === 'ko' ? '유효한 금액을 입력해야 항목이 추가/업데이트됩니다.' : 'A valid amount must be entered for the item to be added/updated.');
        }
        return; // 유효하지 않은 금액이면 함수 종료
    }


    if (isCustom) { // '사용자 정의' 버튼을 눌렀을 때
        name = nameInput.value.trim();
        if (!name) {
            alert(budgetData.currentLanguage === 'ko' ? '이름을 입력하세요.' : 'Enter a name.');
            return;
        }

        // 사용자 정의 항목은 이름 중복 검사
        const existingItem = budgetData[type].find(item => item.name.toLowerCase() === name.toLowerCase());
        if (existingItem) {
            alert(budgetData.currentLanguage === 'ko' ? '이미 존재하는 항목입니다. 수정하려면 목록에서 선택하세요.' : 'This item already exists. To modify, select it from the list.');
            return;
        }
        budgetData[type].push({ id: generateUniqueId(), name, amount, type });

    } else { // 드롭다운에서 미리 정의된 항목을 선택했을 때 (selectedValue가 'custom'이 아님)
        if (selectedValue === '' || selectedValue === 'custom') { // "선택" 또는 "사용자 정의" 선택 시에는 직접 추가 로직 아님
            return;
        }

        // 선택된 기본 항목 찾기 (이름으로 찾습니다)
        const defaultItem = defaultItemsList.find(item => item.name === selectedValue);
        if (!defaultItem) {
            console.error("Default item not found:", selectedValue);
            return;
        }

        name = defaultItem.name; // 미리 정의된 이름 사용
        // 금액은 사용자가 입력한 값 (amountInput.value)을 우선 사용
        // 이미 위에서 금액 유효성 검사를 했으므로 그대로 사용

        // budgetData에 이미 해당 이름의 기본 항목이 있는지 확인 (ID 기반으로 확인)
        const existingInBudgetData = budgetData[type].find(item => item.id === defaultItem.id);

        if (existingInBudgetData) {
            // 이미 존재하는 기본 항목이면 금액만 업데이트
            existingInBudgetData.amount = amount;
        } else {
            // 존재하지 않으면 새로 추가 (id는 DEFAULT_DEDUCTIONS에서 가져온 id 사용)
            budgetData[type].push({ id: defaultItem.id, name, amount, type });
        }
    }

    nameInput.value = ''; // 이름 입력 필드 초기화
    amountInput.value = ''; // 금액 입력 필드 초기화
    selectElement.value = ''; // 드롭다운 선택 초기화
    document.getElementById(`${type}-custom-container`).classList.add('hidden'); // 사용자 정의 입력 필드 숨김

    updateUI();
}


document.getElementById('category-select').addEventListener('change', function () {
    const container = document.getElementById('category-input-container');
    if (this.value === 'custom') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
});

// 세금/공제 드롭다운 선택 시 동작 (사용자 정의 필드 표시/숨기기 및 자동 추가/업데이트)
document.getElementById('tax-type-select').addEventListener('change', function () {
    const customContainer = document.getElementById('tax-custom-container');
    if (this.value === 'custom') {
        customContainer.classList.remove('hidden');
        document.getElementById('tax-amount-input').value = ''; // 금액 초기화
        document.getElementById('tax-custom-name-input').value = ''; // 이름 초기화
    } else { // 미리 정의된 항목 선택 시
        customContainer.classList.add('hidden');
        addCategorizedItem('taxes'); // 금액 유효성 검사는 addCategorizedItem 내부에서 진행
    }
});
document.getElementById('pre-tax-type-select').addEventListener('change', function () {
    const customContainer = document.getElementById('pre-tax-custom-container');
    if (this.value === 'custom') {
        customContainer.classList.remove('hidden');
        document.getElementById('pre-tax-amount-input').value = '';
        document.getElementById('pre-tax-custom-name-input').value = '';
    } else {
        customContainer.classList.add('hidden');
        addCategorizedItem('preTax');
    }
});
document.getElementById('post-tax-type-select').addEventListener('change', function () {
    const customContainer = document.getElementById('post-tax-custom-container');
    if (this.value === 'custom') {
        customContainer.classList.remove('hidden');
        document.getElementById('post-tax-amount-input').value = '';
        document.getElementById('post-tax-custom-name-input').value = '';
    } else {
        customContainer.classList.add('hidden');
        addCategorizedItem('postTax');
    }
});
