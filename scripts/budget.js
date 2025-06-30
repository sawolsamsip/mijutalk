// budget.js

// 설정값: 이 값들은 드롭다운에서 선택할 수 있는 "템플릿" 역할을 합니다.
// budgetData에는 사용자가 선택하거나 사용자 정의한 항목만 추가됩니다.
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

// budgetData는 실제 사용자의 데이터를 저장하는 객체입니다.
// 초기에는 세금 및 공제 배열이 비어 있습니다.
const budgetData = {
    income: 0,
    taxes: [], // 초기에는 빈 배열로 시작
    preTax: [], // 초기에는 빈 배열로 시작
    postTax: [], // 초기에는 빈 배열로 시작
    expenses: [],
    categories: [], // loadData 또는 initDefaultData에서 초기화될 예정
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

    // 버튼 활성/비활성 클래스 토글
    const langKoBtn = document.getElementById('lang-ko');
    const langEnBtn = document.getElementById('lang-en');
    if (langKoBtn) langKoBtn.classList.toggle('active', lang === 'ko');
    if (langEnBtn) langEnBtn.classList.toggle('active', lang === 'en');


    populateCategorySelect(); // 카테고리 셀렉트박스 언어에 맞게 업데이트
    populateCategorizedSelects(); // 세금/공제 드롭다운 언어에 맞게 업데이트
    updateUI(); // UI 전체 업데이트
}

// --- 카테고리 셀렉트박스 채우기 ---
function populateCategorySelect() {
    const select = document.getElementById('category-select');
    if (!select) {
        console.error("Element with ID 'category-select' not found.");
        return;
    }
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
        select.value = budgetData.categories[0] ? budgetData.categories[0].id : '';
    }
}

// --- 세금/공제 드롭다운 채우기 ---
function populateCategorizedSelects() {
    // "tax-type-select", "pre-tax-type-select", "post-tax-type-select"로 ID 변경
    ['tax', 'pre-tax', 'post-tax'].forEach(prefix => {
        const type = prefix.replace('-', ''); // 'tax', 'preTax', 'postTax' 형태로 변환
        const selectElement = document.getElementById(`${prefix}-type-select`);
        if (!selectElement) {
            console.error(`Element with ID '${prefix}-type-select' not found.`);
            return; // 요소가 없으면 건너뛰기
        }

        const prev = selectElement.value; // 현재 선택된 값 저장
        selectElement.innerHTML = '';

        // "선택" 옵션 추가
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = budgetData.currentLanguage === 'ko' ? '--- 항목 선택 ---' : '--- Select Item ---';
        selectElement.appendChild(defaultOption);

        // DEFAULT_DEDUCTIONS에서 항목 추가
        // DEFAULT_DEDUCTIONS 객체의 키는 'taxes', 'preTax', 'postTax' 이므로 이를 사용
        const deductionTypeKey = type === 'tax' ? 'taxes' : (type === 'preTax' ? 'preTax' : 'postTax');
        DEFAULT_DEDUCTIONS[deductionTypeKey].forEach(item => {
            const option = document.createElement('option');
            option.value = item.id; // value를 id로 설정하여 고유하게 식별
            option.textContent = item.name; // 이름은 DEFAULT_DEDUCTIONS에서 가져옴
            selectElement.appendChild(option);
        });

        // "사용자 정의" 옵션 추가
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = budgetData.currentLanguage === 'ko' ? '✏️ 직접 입력' : '✏️ Custom Input';
        selectElement.appendChild(customOption);

        // 이전에 선택된 값이 있다면 유지
        if (Array.from(selectElement.options).some(opt => opt.value === prev)) {
            selectElement.value = prev;
        } else {
            selectElement.value = ''; // 유효하지 않으면 "선택"으로 초기화
        }
    });
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
    const ctx1 = document.getElementById('incomeFlowChart');
    if (ctx1) {
        incomeFlowChartInstance = new Chart(ctx1.getContext('2d'), {
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
    } else {
        console.warn("Element with ID 'incomeFlowChart' not found. Skipping income flow chart.");
    }


    // 지출 카테고리 차트
    const ctx2 = document.getElementById('expenseCategoryChart');
    if (ctx2) {
        const categoryTotals = {};
        budgetData.expenses.forEach(item => {
            const cat = budgetData.categories.find(c => c.id === item.category);
            const label = budgetData.currentLanguage === 'ko' ? (cat?.name || '기타') : (cat?.nameEn || cat?.name || 'Other');
            if (!categoryTotals[label]) {
                categoryTotals[label] = 0;
            }
            categoryTotals[label] += item.amount;
        });

        expenseCategoryChartInstance = new Chart(ctx2.getContext('2d'), {
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
    } else {
        console.warn("Element with ID 'expenseCategoryChart' not found. Skipping expense category chart.");
    }
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

    // income-input 요소가 존재하는지 확인
    const incomeInput = document.getElementById('income-input');
    if (incomeInput) {
        incomeInput.value = gross;
    } else {
        console.warn("Element with ID 'income-input' not found.");
    }


    // 각 요소가 존재하는지 확인 후 textContent 업데이트
    const elementsToUpdate = {
        'gross-income': formatMoney(gross),
        'pre-tax-deductions': formatMoney(pretax),
        'taxable-income': formatMoney(taxable),
        'tax-total': formatMoney(tax),
        'post-tax-deductions': formatMoney(posttax),
        'total-deductions-taxes': formatMoney(totalDeduct),
        'net-income': formatMoney(net),
        'expenses-total-card': formatMoney(expenses),
        'remaining-balance': formatMoney(remain),
        'expenses-percentage-card': calculatePercentage(expenses, gross),
        'remaining-percentage-card': calculatePercentage(remain, gross)
    };

    for (const id in elementsToUpdate) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = elementsToUpdate[id];
        } else {
            console.warn(`Element with ID '${id}' not found. Cannot update text content.`);
        }
    }


    const remainingBalanceElement = document.getElementById('remaining-balance');
    if (remainingBalanceElement) {
        remainingBalanceElement.className = `card-amount ${remain >= 0 ? 'positive' : 'negative'}`;
    }


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
    if (!container) {
        console.error(`Element with ID '${elementId}' not found.`);
        return;
    }
    const type = elementId.replace('-list', '');

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
    if (!container) {
        console.error("Element with ID 'expenses-list' not found.");
        return;
    }

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
        // `budgetData[type]`이 배열인지 다시 한번 안전하게 확인합니다.
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

        // 중요: 각 배열 속성을 로드할 때, 항상 Array.isArray로 유효성을 확인하고, 없으면 빈 배열로 초기화합니다.
        budgetData.income = parsed.income || 0;
        budgetData.taxes = Array.isArray(parsed.taxes) ? parsed.taxes : [];
        budgetData.preTax = Array.isArray(parsed.preTax) ? parsed.preTax : [];
        budgetData.postTax = Array.isArray(parsed.postTax) ? parsed.postTax : [];
        budgetData.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];

        // 카테고리 로드 또는 기본값 설정
        if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
            budgetData.categories = parsed.categories;
        } else {
            // 카테고리가 없으면 기본값으로 설정
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

    } else {
        console.log("No budgetData found in localStorage, initializing default data.");
        initDefaultData(); // 로컬 스토리지에 데이터가 없으면 기본 데이터로 초기화
    }
    // 데이터 로드 후 UI 업데이트 및 드롭다운 초기화 (DOMContentLoaded에서 호출)
}

function resetData() {
    if (confirm(budgetData.currentLanguage === 'ko' ? '모든 데이터를 초기화할까요? 이 작업은 되돌릴 수 없습니다.' : 'Reset all data? This action cannot be undone.')) {
        localStorage.removeItem('budgetData');
        initDefaultData(); // 로컬 스토리지 삭제 후 기본 데이터로 초기화
        populateCategorizedSelects(); // 드롭다운도 초기화
        updateUI();
    }
}

// 앱이 처음 로드되거나 '데이터 초기화' 시 호출
function initDefaultData() {
    budgetData.income = 0;
    // 중요: 기본 공제/세금 항목 배열을 빈 배열로 초기화합니다.
    // 사용자가 드롭다운에서 선택할 때만 해당 항목이 budgetData에 추가됩니다.
    budgetData.taxes = [];
    budgetData.preTax = [];
    budgetData.postTax = [];
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

// DOMContentLoaded 이벤트 리스너 추가: 모든 HTML이 로드된 후 스크립트 실행
// 이 부분이 가장 중요합니다. HTML 요소들이 완전히 로드된 후에 JavaScript가 실행되어야 합니다.
document.addEventListener('DOMContentLoaded', function() {
    loadData(); // 데이터 로드
    populateCategorizedSelects(); // 드롭다운 채우기
    switchLanguage(budgetData.currentLanguage); // 언어 설정
    updateUI(); // UI 업데이트

    // 초기 로드 시 관련 요소들이 모두 존재하면 이벤트 리스너를 추가
    const langKoBtn = document.getElementById('lang-ko');
    const langEnBtn = document.getElementById('lang-en');
    const incomeInput = document.getElementById('income-input');
    const categorySelect = document.getElementById('category-select');

    if (langKoBtn) langKoBtn.onclick = () => switchLanguage('ko');
    if (langEnBtn) langEnBtn.onclick = () => switchLanguage('en');

    if (incomeInput) {
        incomeInput.addEventListener('input', function(e) {
            budgetData.income = parseFloat(e.target.value) || 0;
            updateUI();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', function () {
            const container = document.getElementById('category-input-container');
            if (container) { // 컨테이너 존재 여부 확인
                if (this.value === 'custom') {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            } else {
                console.warn("Element with ID 'category-input-container' not found.");
            }
        });
    }

    // 세금/공제 드롭다운 선택 시 동작 (사용자 정의 필드 표시/숨기기 및 자동 추가/업데이트)
    // 드롭다운의 change 이벤트는 사용자가 값을 변경할 때마다 발생합니다.
    // 'custom'을 선택하면 입력 필드를 보여주고, 다른 미리 정의된 항목을 선택하면 자동으로 추가/업데이트합니다.
    ['tax', 'pre-tax', 'post-tax'].forEach(prefix => {
        const typeKey = prefix.replace('-', ''); // 'taxes', 'preTax', 'postTax' 형태로 변환
        const selectElement = document.getElementById(`${prefix}-type-select`);
        const customContainer = document.getElementById(`${prefix}-custom-container`);
        const amountInput = document.getElementById(`${prefix}-amount-input`);
        const nameInput = document.getElementById(`${prefix}-custom-name-input`);

        if (selectElement) { // selectElement가 존재하는지 확인
            selectElement.addEventListener('change', function () {
                if (this.value === 'custom') {
                    if (customContainer) customContainer.classList.remove('hidden');
                    if (amountInput) amountInput.value = ''; // 금액 초기화
                    if (nameInput) nameInput.value = ''; // 이름 초기화
                } else {
                    if (customContainer) customContainer.classList.add('hidden');
                    // 'addCategorizedItem' 호출 시 'isCustom'을 false로 명시적으로 전달
                    // 금액 입력 필드에 값이 있을 때만 자동으로 추가/업데이트되도록 변경
                    if (this.value !== '' && amountInput && !isNaN(parseFloat(amountInput.value)) && parseFloat(amountInput.value) >= 0) {
                        addCategorizedItem(typeKey, false); // typeKey를 사용 (예: 'taxes')
                    } else if (this.value !== '') { // 선택은 했지만 금액이 유효하지 않은 경우
                        // 경고 메시지는 addCategorizedItem 내부에서 처리되므로 여기서는 추가하지 않습니다.
                    }
                }
            });
        }
    });
});


// 지출 추가 함수
function addExpense() {
    const categorySelect = document.getElementById('category-select');
    const nameInput = document.getElementById('expense-name-input');
    const amountInput = document.getElementById('expense-amount-input-main');

    if (!categorySelect || !nameInput || !amountInput) {
        console.error("One or more expense input elements not found.");
        return;
    }

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
    if (!newCategoryInput) {
        console.error("Element with ID 'new-category-input' not found.");
        return;
    }
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
    const categoryInputContainer = document.getElementById('category-input-container');
    if (categoryInputContainer) categoryInputContainer.classList.add('hidden');
    const categorySelect = document.getElementById('category-select');
    if (categorySelect) categorySelect.value = id; // 새로 추가된 카테고리 자동 선택
    updateUI();
}

/**
 * 세금/공제 항목 추가 함수 (taxes, preTax, postTax)
 * @param {string} type - 'taxes', 'preTax', 'postTax' 중 하나
 * @param {boolean} isCustom - '사용자 정의' 버튼을 통해 호출되었는지 여부
 */
function addCategorizedItem(type, isCustom = false) {
    let nameInput, amountInput, selectElement, defaultItemsList;

    // HTML ID prefix와 budgetData의 type 키를 매핑
    let prefix;
    if (type === 'taxes') {
        prefix = 'tax';
        defaultItemsList = DEFAULT_DEDUCTIONS.taxes;
    } else if (type === 'preTax') {
        prefix = 'pre-tax';
        defaultItemsList = DEFAULT_DEDUCTIONS.preTax;
    } else if (type === 'postTax') {
        prefix = 'post-tax';
        defaultItemsList = DEFAULT_DEDUCTIONS.postTax;
    } else {
        console.error("Invalid type for addCategorizedItem:", type);
        return;
    }

    selectElement = document.getElementById(`${prefix}-type-select`);
    nameInput = document.getElementById(`${prefix}-custom-name-input`);
    amountInput = document.getElementById(`${prefix}-amount-input`);

    // 요소들이 모두 존재하는지 먼저 확인
    if (!selectElement || !amountInput || (isCustom && !nameInput)) {
        console.error(`One or more input elements for type '${type}' not found.`);
        return;
    }

    const selectedValue = selectElement.value; // 이제 value는 id입니다.
    let name = '';
    let amount = parseFloat(amountInput.value);

    // 금액 유효성 검사: NaN이거나 0 미만인 경우
    // 미리 정의된 항목의 경우, 금액이 0이더라도 추가될 수 있도록 허용 (처음부터 0으로 설정되어 있으므로)
    if (isNaN(amount) || amount < 0) {
        // '사용자 정의'가 아니면서 "항목 선택"도 아닌 경우에만 경고
        if (!isCustom && selectedValue !== '') {
            alert(budgetData.currentLanguage === 'ko' ? '유효한 금액을 입력해야 항목이 추가/업데이트됩니다.' : 'A valid amount must be entered for the item to be added/updated.');
        }
        return; // 유효하지 않은 금액이면 함수 종료
    }


    if (isCustom || selectedValue === 'custom') { // '사용자 정의' 버튼을 눌렀거나, 드롭다운에서 'custom'을 선택했을 때
        name = nameInput.value.trim();
        if (!name) {
            alert(budgetData.currentLanguage === 'ko' ? '이름을 입력하세요.' : 'Enter a name.');
            return;
        }

        // 사용자 정의 항목은 이름 중복 검사 (대소문자 무시)
        const existingItem = budgetData[type].find(item => item.name.toLowerCase() === name.toLowerCase());
        if (existingItem) {
            alert(budgetData.currentLanguage === 'ko' ? '이미 존재하는 항목입니다. 수정하려면 목록에서 선택하거나 이름을 변경하세요.' : 'This item already exists. To modify, select it from the list or change the name.');
            return;
        }
        budgetData[type].push({ id: generateUniqueId(), name, amount, type }); // 사용자 정의 항목은 새로운 고유 ID 부여

    } else { // 드롭다운에서 미리 정의된 항목을 선택했을 때 (selectedValue가 'custom'이 아님)
        if (selectedValue === '') { // "선택" 옵션을 그대로 둔 경우
            return;
        }

        // 선택된 기본 항목 찾기 (이제 value가 id이므로 id로 찾습니다)
        const defaultItem = defaultItemsList.find(item => item.id === selectedValue);
        if (!defaultItem) {
            console.error("Default item not found with ID:", selectedValue);
            return;
        }

        name = defaultItem.name; // 미리 정의된 이름 사용

        // budgetData에 이미 해당 ID의 기본 항목이 있는지 확인 (중복 추가 방지)
        const existingInBudgetData = budgetData[type].find(item => item.id === defaultItem.id);

        if (existingInBudgetData) {
            // 이미 존재하는 기본 항목이면 금액만 업데이트
            existingInBudgetData.amount = amount;
        } else {
            // 존재하지 않으면 새로 추가 (id는 DEFAULT_DEDUCTIONS에서 가져온 id 사용)
            budgetData[type].push({ id: defaultItem.id, name, amount, type });
        }
    }

    if (nameInput) nameInput.value = ''; // 이름 입력 필드 초기화
    if (amountInput) amountInput.value = ''; // 금액 입력 필드 초기화
    if (selectElement) selectElement.value = ''; // 드롭다운 선택 초기화 (선택을 '--- 항목 선택 ---'으로 돌려놓기)
    const customContainer = document.getElementById(`${prefix}-custom-container`);
    if (customContainer) customContainer.classList.add('hidden'); // 사용자 정의 입력 필드 숨김

    updateUI();
}
