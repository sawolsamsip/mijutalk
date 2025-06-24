// 1. 기본 공제 항목 정의
const DEFAULT_DEDUCTIONS = {
  taxes: [
    { name: "Federal Withholding", amount: 0 },
    { name: "State Tax (CA)", amount: 0 },
    { name: "OASDI (Social Security)", amount: 0 },
    { name: "Medicare", amount: 0 },
    { name: "CA SDI", amount: 0 }
  ],
  preTax: [
    { name: "401k Traditional", amount: 0 },
    { name: "Medical Premium", amount: 0 },
    { name: "Dental Premium", amount: 0 },
    { name: "Vision Premium", amount: 0 },
    { name: "MSEAP", amount: 0 }
  ],
  postTax: [
    { name: "401k Roth", amount: 0 },
    { name: "Legal Services", amount: 0 },
    { name: "LTD", amount: 0 },
    { name: "Stock Purchase Plan", amount: 0 },
    { name: "AD&D", amount: 0 },
    { name: "Critical Illness", amount: 0 },
    { name: "Accident Insurance", amount: 0 }
  ]
};

// 2. 초기 데이터 구조
const budgetData = {
  income: 0,
  taxes: [],
  preTax: [],
  postTax: [],
  expenses: [],
  categories: [
    { id: 'housing', name: '🏠 주거' },
    { id: 'food', name: '🍔 식비' },
    { id: 'transportation', name: '🚗 교통' },
    { id: 'health', name: '🏥 건강' },
    { id: 'family', name: '👪 가족' },
    { id: 'shopping', name: '🛍️ 쇼핑' },
    { id: 'finance', name: '💳 금융' },
    { id: 'travel', name: '✈️ 여행' },
    { id: 'saving', name: '💰 저축' },
    { id: 'business', name: '💼 업무' }
  ]
};

// Chart instances
let incomeFlowChartInstance = null;
let expenseCategoryChartInstance = null;

// --- 다국어 지원 관련 변수 및 함수 시작 ---
let translations = {}; // 현재 로드된 번역 텍스트를 저장할 객체
let currentLanguage = 'ko'; // 현재 선택된 언어

// 언어 파일을 로드하는 비동기 함수
async function loadTranslations(lang) {
    try {
        // budget.js는 scripts 폴더에 있고, lang 폴더는 scripts 폴더와 같은 레벨에 있으므로 경로가 ../lang/ 입니다.
        const response = await fetch(`../lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}: ${response.statusText}`);
        }
        translations = await response.json();
        currentLanguage = lang;
        console.log(`Translations loaded for ${lang}`);
        updateUILanguage(); // UI 텍스트 업데이트 호출
        updateUI(); // 모든 UI 데이터 및 차트 업데이트
    } catch (error) {
        console.error("Error loading translations:", error);
    }
}

// UI의 모든 텍스트를 현재 언어에 맞게 업데이트하는 함수
function updateUILanguage() {
    // HTML 요소의 ID를 사용하여 텍스트 업데이트
    // HTML 파일에 ID를 추가했던 모든 요소들을 여기서 업데이트합니다.
    document.title = translations.app_title; // <head> 태그의 title
    document.getElementById('app-title-head').textContent = translations.app_title;
    document.getElementById('app-title').textContent = translations.app_title;

    // 월 수입 섹션
    document.getElementById('income-title').textContent = translations.income_title;
    document.getElementById('income-label').textContent = translations.income_label;
    document.getElementById('income').placeholder = translations.amount_placeholder;

    // 세금 섹션
    document.getElementById('tax-title').textContent = translations.tax_title;
    document.getElementById('tax-type-label').textContent = translations.tax_type_label;
    document.getElementById('tax-select-placeholder').textContent = translations.tax_select_placeholder;
    document.getElementById('tax-option-custom').textContent = translations.custom_input;
    document.getElementById('tax-custom-name-label').textContent = translations.item_name_placeholder; // sr-only label
    document.getElementById('tax-custom-name').placeholder = translations.item_name_placeholder;
    document.getElementById('tax-amount-sr-label').textContent = translations.amount_placeholder; // sr-only label
    document.getElementById('tax-amount-input').placeholder = translations.amount_placeholder;
    document.getElementById('tax-apply-button').textContent = translations.apply_button;

    // 세금 종류 드롭다운의 옵션 텍스트 업데이트 (value는 그대로 유지)
    // 이 부분은 translations 파일의 key 이름과 option value가 일치해야 합니다.
    const taxTypeSelect = document.getElementById('tax-type');
    Array.from(taxTypeSelect.options).forEach(option => {
        if (option.value !== "" && option.value !== "custom") {
            // "Federal Withholding" -> translations.federal_withholding 키로 변환
            const key = option.value.toLowerCase().replace(/ /g, '_').replace(/\(ca\)/g, 'ca'); // 예: "State Tax (CA)" -> "state_tax_ca"
            if (translations[key]) {
                option.textContent = translations[key];
            }
        }
    });


    // 세전 공제 섹션
    document.getElementById('pre-tax-title').textContent = translations.pre_tax_title;
    document.getElementById('pre-tax-type-label').textContent = translations.pre_tax_type;
    document.getElementById('pre-tax-select-placeholder').textContent = translations.tax_select_placeholder; // 재사용
    document.getElementById('pre-tax-option-custom').textContent = translations.custom_input;
    document.getElementById('pre-tax-custom-name-label').textContent = translations.item_name_placeholder;
    document.getElementById('pre-tax-custom-name').placeholder = translations.item_name_placeholder;
    document.getElementById('pre-tax-amount-sr-label').textContent = translations.amount_placeholder;
    document.getElementById('pre-tax-amount-input').placeholder = translations.amount_placeholder;
    document.getElementById('pre-tax-apply-button').textContent = translations.apply_button;

    const preTaxTypeSelect = document.getElementById('pre-tax-type');
    Array.from(preTaxTypeSelect.options).forEach(option => {
        if (option.value !== "" && option.value !== "custom") {
            const key = option.value.toLowerCase().replace(/ /g, '_').replace(/401k/g, 'four_01k'); // 401k와 같은 특수 케이스 처리
            if (translations[key]) {
                option.textContent = translations[key];
            }
        }
    });

    // 세후 공제 섹션
    document.getElementById('post-tax-title').textContent = translations.post_tax_title;
    document.getElementById('post-tax-type-label').textContent = translations.post_tax_type;
    document.getElementById('post-tax-select-placeholder').textContent = translations.tax_select_placeholder; // 재사용
    document.getElementById('post-tax-option-custom').textContent = translations.custom_input;
    document.getElementById('post-tax-custom-name-label').textContent = translations.item_name_placeholder;
    document.getElementById('post-tax-custom-name').placeholder = translations.item_name_placeholder;
    document.getElementById('post-tax-amount-sr-label').textContent = translations.amount_placeholder;
    document.getElementById('post-tax-amount-input').placeholder = translations.amount_placeholder;
    document.getElementById('post-tax-apply-button').textContent = translations.apply_button;

    const postTaxTypeSelect = document.getElementById('post-tax-type');
    Array.from(postTaxTypeSelect.options).forEach(option => {
        if (option.value !== "" && option.value !== "custom") {
            const key = option.value.toLowerCase().replace(/ /g, '_').replace(/401k/g, 'four_01k');
            if (translations[key]) {
                option.textContent = translations[key];
            }
        }
    });

    // 지출 관리 섹션
    document.getElementById('expense-management-title').textContent = translations.expense_management_title;
    document.getElementById('category-label').textContent = translations.category_label;
    document.getElementById('expense-name-label').textContent = translations.item_name_placeholder.replace(' 입력', ''); // "항목명"으로 사용
    document.getElementById('expense-name').placeholder = translations.item_name_expense_placeholder;
    document.getElementById('expense-amount-label').textContent = translations.amount_placeholder.replace(' ($)', ''); // "금액"으로 사용
    document.getElementById('expense-amount').placeholder = translations.amount_placeholder;
    document.getElementById('new-category-label').textContent = translations.new_category_name_placeholder.replace(' 입력', ''); // sr-only label
    document.getElementById('new-category').placeholder = translations.new_category_name_placeholder;
    document.getElementById('add-category-button').textContent = translations.add_button;
    document.getElementById('add-expense-button').textContent = translations.add_expense_button;


    // 월별 재무 현황 섹션 (ID 수정됨: _ -> -)
    document.getElementById('monthly-financial-status-title').textContent = translations.monthly_financial_status_title;
    document.getElementById('gross-income-label').textContent = translations.gross_income_label;
    document.getElementById('pre-tax-deductions-label').textContent = translations.pre_tax_deduction_label;
    document.getElementById('taxable-income-label').textContent = translations.taxable_income_label;
    document.getElementById('tax-total-label').textContent = translations.tax_total_label;
    document.getElementById('post-tax-deductions-label').textContent = translations.post_tax_deduction_label;
    document.getElementById('total-deductions-taxes-label').textContent = translations.total_deductions_taxes_label; // ID 수정됨
    document.getElementById('net-income-label').textContent = translations.net_income_label; // ID 수정됨

    document.getElementById('total-expenses-card-label').textContent = translations.total_expenses_card_label; // ID 수정됨
    document.getElementById('total-expenses-card-sub').textContent = translations.total_expenses_card_sub;
    document.getElementById('remaining-balance-card-label').textContent = translations.remaining_balance_card_label; // ID 수정됨
    document.getElementById('remaining-balance-card-sub').textContent = translations.remaining_balance_card_sub;
    // 이 부분은 총 수입의 X% 와 같이 동적으로 문장이 구성되므로, translations.of 키를 사용합니다.
    document.getElementById('expenses-percentage-text').innerHTML = `${translations.gross_income_label.split('(')[0].trim()} ${translations.of} <span id="expenses-percentage-card" class="highlighted-percentage">${document.getElementById('expenses-percentage-card').textContent}</span>`;
    document.getElementById('remaining-percentage-text').innerHTML = `${translations.gross_income_label.split('(')[0].trim()} ${translations.of} <span id="remaining-percentage-card" class="highlighted-percentage">${document.getElementById('remaining-percentage-card').textContent}</span>`;


    // 재무 분석 차트 섹션 (ID 수정됨: _ -> -)
    document.getElementById('financial-analysis-chart-title').textContent = translations.financial_analysis_chart_title; // ID 수정됨
    document.getElementById('income-flow-chart-title').textContent = translations.income_flow_chart_title; // ID 수정됨
    document.getElementById('expense-category-chart-title').textContent = translations.expense_category_chart_title; // ID 수정됨

    // 유틸리티 버튼
    document.getElementById('save-button').textContent = translations.save_button;
    document.getElementById('load-button').textContent = translations.load_button;
    document.getElementById('print-button').textContent = translations.print_button;
    document.getElementById('reset-button').textContent = translations.reset_button;
}
// --- 다국어 지원 관련 변수 및 함수 끝 ---


// Helper to generate unique IDs
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 3. 기본 데이터 초기화 함수
function initDefaultData() {
  budgetData.taxes = DEFAULT_DEDUCTIONS.taxes.map(item => ({
    ...item,
    id: generateUniqueId(),
    type: 'taxes'
  }));

  budgetData.preTax = DEFAULT_DEDUCTIONS.preTax.map(item => ({
    ...item,
    id: generateUniqueId(),
    type: 'preTax'
  }));

  budgetData.postTax = DEFAULT_DEDUCTIONS.postTax.map(item => ({
    ...item,
    id: generateUniqueId(),
    type: 'postTax'
  }));

  budgetData.income = 0;
  budgetData.expenses = [];
  // 카테고리도 초기화 시 언어 파일에서 이름을 가져올 수 있도록 id와 name 그대로 유지 (이름은 번역되지 않은 기본값)
  budgetData.categories = [
    { id: 'housing', name: '🏠 주거' },
    { id: 'food', name: '🍔 식비' },
    { id: 'transportation', name: '🚗 교통' },
    { id: 'health', name: '🏥 건강' },
    { id: 'family', name: '👪 가족' },
    { id: 'shopping', name: '🛍️ 쇼핑' },
    { id: 'finance', name: '💳 금융' },
    { id: 'travel', name: '✈️ 여행' },
    { id: 'saving', name: '💰 저축' },
    { id: 'business', name: '💼 업무' }
  ];

  localStorage.setItem('budgetData', JSON.stringify(budgetData));
  console.log("✅ 기본 항목 생성됨"); // 이 메시지도 나중에는 번역될 수 있습니다.
}

// 4. 공통 함수들
function formatMoney(amount) {
  if (isNaN(amount) || amount === null) return "0.00";
  return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculatePercentage(value, totalIncome) {
    if (totalIncome === 0) return "0.0%"; // Avoid division by zero
    return ((value / totalIncome) * 100).toFixed(1) + '%';
}

// Function to generate distinct colors for charts
function generateColors(num) {
    const colors = [
      '#42A5F5', '#66BB6A', '#FFCA28', '#EF5350', '#AB47BC', '#78909C', '#26A69A', '#FF7043',
      '#7E57C2', '#BDBDBD', '#FFEE58', '#8D6E63', '#9CCC65', '#29B6F6', '#FFAB91', '#AFB42B'
    ];
    // Cycle through or pick distinct colors if more are needed
    return Array.from({ length: num }, (_, i) => colors[i % num]);
}

function updateUI() {
  // Save data immediately
  localStorage.setItem('budgetData', JSON.stringify(budgetData));

  // Calculations
  const grossIncome = budgetData.income;
  const preTaxTotal = budgetData.preTax.reduce((sum, item) => sum + item.amount, 0);
  const taxTotal = budgetData.taxes.reduce((sum, item) => sum + item.amount, 0);
  const postTaxTotal = budgetData.postTax.reduce((sum, item) => sum + item.amount, 0);
  const totalDeductionsAndTaxes = preTaxTotal + taxTotal + postTaxTotal; // New calculation
  const taxableIncome = grossIncome - preTaxTotal;
  const netIncome = taxableIncome - taxTotal - postTaxTotal;
  const expensesTotal = budgetData.expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = netIncome - expensesTotal;

  // Update income input
  document.getElementById('income').value = grossIncome;

  // Update flow section
  document.getElementById('gross-income').textContent = formatMoney(grossIncome);

  document.getElementById('pre-tax-deductions').innerHTML =
    `${formatMoney(preTaxTotal)} <em class="percentage highlighted-percentage">(${calculatePercentage(preTaxTotal, grossIncome)})</em>`;

  document.getElementById('taxable-income').innerHTML =
    `${formatMoney(taxableIncome)} <em class="percentage highlighted-percentage">(${calculatePercentage(taxableIncome, grossIncome)})</em>`;

  document.getElementById('tax-total').innerHTML =
    `${formatMoney(taxTotal)} <em class="percentage highlighted-percentage">(${calculatePercentage(taxTotal, grossIncome)})</em>`;

  document.getElementById('post-tax-deductions').innerHTML =
    `${formatMoney(postTaxTotal)} <em class="percentage highlighted-percentage">(${calculatePercentage(postTaxTotal, grossIncome)})</em>`;

  // Update new total deductions and taxes
  document.getElementById('total-deductions-taxes').innerHTML =
    `${formatMoney(totalDeductionsAndTaxes)} <em class="percentage highlighted-percentage">(${calculatePercentage(totalDeductionsAndTaxes, grossIncome)})</em>`;

  document.getElementById('net-income').innerHTML =
    `${formatMoney(netIncome)} <em class="percentage highlighted-percentage">(${calculatePercentage(netIncome, grossIncome)})</em>`;

  // Update summary cards
  document.getElementById('expenses-total-card').textContent = formatMoney(expensesTotal);
  document.getElementById('remaining-balance').textContent = formatMoney(remaining);

  const remainingElement = document.getElementById('remaining-balance');
  remainingElement.textContent = formatMoney(remaining);
  remainingElement.className = `card-amount ${remaining >= 0 ? 'positive' : 'negative'}`; // Set class based on remaining amount

  // Update percentages on summary cards
  document.getElementById('expenses-percentage-card').textContent = calculatePercentage(expensesTotal, grossIncome);
  document.getElementById('remaining-percentage-card').textContent = calculatePercentage(remaining, grossIncome);

  // Render lists
  renderList('tax-list', budgetData.taxes, grossIncome);
  renderList('pre-tax-list', budgetData.preTax, grossIncome);
  renderList('post-tax-list', budgetData.postTax, grossIncome);
  renderExpenses(grossIncome);
  populateCategorySelect();
  
  // Update Charts
  updateCharts(grossIncome, preTaxTotal, taxTotal, postTaxTotal, expensesTotal, remaining);
}

let editingItem = null;

function renderList(elementId, items, totalIncome) {
  const container = document.getElementById(elementId);
  const type = elementId.replace('-list', '');

  // 금액이 0이 아닌 항목들만 필터링
  const nonZeroItems = items.filter(item => item.amount !== 0);
  const total = items.reduce((sum, item) => sum + item.amount, 0); // Always calculate total based on ALL items

  // 부모 카드 엘리먼트를 찾아서 항상 보이도록 설정합니다.
  const parentCard = container.closest('.card');
  if (parentCard) parentCard.style.display = '';

  container.innerHTML = `
    ${nonZeroItems.map(item => `
      <div class="expense-item" data-id="${item.id}" data-type="${type}">
        ${editingItem && editingItem.id === item.id ?
          `<div class="expense-item-content">
             <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="${translations.item_name_placeholder}">
             <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="${translations.amount_placeholder}">
           </div>
           <div class="expense-item-actions">
             <button onclick="saveEdit('${type}', '${item.id}')" class="save-edit-btn">${translations.save_button.replace('💾 ', '')}</button>
             <button onclick="cancelEdit()" class="cancel-edit-btn">${translations.cancel_button || 'Cancel'}</button>
           </div>`
          :
          `<div class="expense-item-content">
             <span>${item.name}: $${formatMoney(item.amount)}</span>
           </div>
           <div class="expense-item-actions">
             <button onclick="editItem('${type}', '${item.id}')" class="edit-btn">${translations.edit_button || 'Edit'}</button>
             <button onclick="deleteItem('${type}', '${item.id}')" class="delete-btn">${translations.delete_button || 'Delete'}</button>
           </div>`
        }
      </div>
    `).join('')}
    <div class="total-summary">
      <div class="summary-row">
        <span class="summary-label">${translations[`total_${type}_label`] || `Total ${getTypeName(type)}`}</span>
        <span class="summary-value">$${formatMoney(total)} <span class="percentage">(${calculatePercentage(total, totalIncome)})</span></span>
      </div>
    </div>
  `;
}

function renderExpenses(totalIncome) {
  const container = document.getElementById('expenses-list');
  
  // 금액이 0이 아닌 지출 항목들만 필터링
  const nonZeroExpenses = budgetData.expenses.filter(item => item.amount !== 0);
  const total = nonZeroExpenses.reduce((sum, item) => sum + item.amount, 0);

  // 유효한 지출 항목이 없으면 전체 섹션을 숨김
  const parentCard = container.closest('.card');
  if (nonZeroExpenses.length === 0) {
    if (parentCard) parentCard.style.display = 'none';
    return;
  } else {
    if (parentCard) parentCard.style.display = '';
  }

  container.innerHTML = `
    ${nonZeroExpenses.map(item => {
      const category = budgetData.categories.find(cat => cat.id === item.category);
      // 카테고리 이름도 번역본에서 가져오기
      const displayCategoryName = translations[`category_${item.category}`] || category?.name || translations.other_category;
      return `
        <div class="expense-item" data-id="${item.id}" data-type="expenses">
          ${editingItem && editingItem.id === item.id ?
            `<div class="expense-item-content">
               <select id="edit-category-${item.id}" style="width: auto; margin-right: 5px;">
                 ${budgetData.categories.map(cat => `<option value="${cat.id}" ${cat.id === item.category ? 'selected' : ''}>${translations[`category_${cat.id}`] || cat.name}</option>`).join('')}
               </select>
               <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="${translations.item_name_placeholder}">
               <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="${translations.amount_placeholder}">
             </div>
             <div class="expense-item-actions">
               <button onclick="saveEdit('expenses', '${item.id}')" class="save-edit-btn">${translations.save_button.replace('💾 ', '')}</button>
               <button onclick="cancelEdit()" class="cancel-edit-btn">${translations.cancel_button || 'Cancel'}</button>
             </div>`
            :
            `<div class="expense-item-content">
               <span class="badge">${displayCategoryName}</span>
               <span>${item.name}</span>
             </div>
             <span class="expense-item-amount">$${formatMoney(item.amount)}</span>
             <div class="expense-item-actions">
               <button onclick="editItem('expenses', '${item.id}')" class="edit-btn">${translations.edit_button || 'Edit'}</button>
               <button onclick="deleteItem('expenses', '${item.id}')" class="delete-btn">${translations.delete_button || 'Delete'}</button>
             </div>`
          }
        </div>
      `;
    }).join('')}
    <div class="total-summary">
      <div class="summary-row">
        <span class="summary-label">${translations.total_expenses_type}</span>
        <span class="summary-value">$${formatMoney(total)} <span class="percentage">(${calculatePercentage(total, totalIncome)})</span></span>
      </div>
    </div>
  `;
}

function getTypeName(type) {
  const names = {
    'taxes': translations.taxes_type || '세금',
    'preTax': translations.pre_tax_type || '세전 공제',
    'postTax': translations.post_tax_type || '세후 공제',
    'expenses': translations.total_expenses_type || '지출'
  };
  return names[type] || type;
}

function populateCategorySelect() {
  const select = document.getElementById('category');
  const currentSelected = select.value;
  select.innerHTML = '';

  budgetData.categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = translations[`category_${cat.id}`] || cat.name; // 번역된 카테고리 이름 사용
    select.appendChild(option);
  });

  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent = translations.custom_input;
  select.appendChild(customOption);

  if (budgetData.categories.some(cat => cat.id === currentSelected) || currentSelected === 'custom') {
    select.value = currentSelected;
  } else {
    select.value = budgetData.categories[0] ? budgetData.categories[0].id : '';
  }
}

// Helper: Convert "Federal Withholding" to "federal_withholding" for translation key
function textToKey(text) {
    return text.toLowerCase().replace(/ /g, '_').replace(/\(|\)/g, '').replace(/\&/g, 'and');
}


// 5. CRUD 함수들 (alert/confirm 메시지 번역 적용)
function deleteItem(type, id) {
  // Use a custom modal for confirmation instead of alert/confirm
  // For now, using confirm as per previous setup.
  if (confirm(translations.confirm_delete)) {
    budgetData[type] = budgetData[type].filter(item => item.id !== id);
    updateUI();
  }
}

function editItem(type, id) {
  cancelEdit(); // 기존 수정 모드 해제
  const item = budgetData[type].find(item => item.id === id);
  if (item) {
    editingItem = { ...item, type: type };
    updateUI(); // UI를 다시 그려서 수정 모드를 반영
  }
}

function saveEdit(type, id) {
  const itemIndex = budgetData[type].findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  const newName = document.getElementById(`edit-name-${id}`).value.trim();
  const newAmount = parseFloat(document.getElementById(`edit-amount-${id}`).value);

  if (!newName) {
    alert(translations.item_name_cannot_be_empty);
    return;
  }
  if (isNaN(newAmount)) {
    alert(translations.enter_valid_amount);
    return;
  }

  budgetData[type][itemIndex].name = newName; // 이름은 그대로 유지 (번역 키로 사용)
  budgetData[type][itemIndex].amount = newAmount;

  if (type === 'expenses') {
    const newCategory = document.getElementById(`edit-category-${id}`).value;
    budgetData[type][itemIndex].category = newCategory;
  }

  editingItem = null; // 수정 상태 해제
  updateUI();
}

function cancelEdit() {
  if (editingItem) {
    editingItem = null;
    updateUI(); // 수정 모드 해제 후 UI 다시 그리기
  }
}

function updateCategorizedItem(type) {
  const prefix = type === 'taxes' ? 'tax' : (type === 'preTax' ? 'pre-tax' : 'post-tax');
  const selectElement = document.getElementById(`${prefix}-type`);
  const inputAmountElement = document.getElementById(`${prefix}-amount-input`); // ID 변경
  const customNameInput = document.getElementById(`${prefix}-custom-name`); // input 변수명 변경

  let name = selectElement.value;
  const amount = parseFloat(inputAmountElement.value);

  if (name === 'custom') {
    name = customNameInput.value.trim();
    if (!name) {
      alert(translations.enter_custom_item_name);
      return;
    }
  }

  if (!name || isNaN(amount)) {
    alert(translations.enter_item_and_amount);
    return;
  }

  let item = budgetData[type].find(item => item.name === name);

  if (item) {
    item.amount = amount;
  } else {
    budgetData[type].push({
      id: generateUniqueId(),
      type: type,
      name,
      amount
    });
  }

  updateUI();
  inputAmountElement.value = '0';
  customNameInput.value = '';
  selectElement.value = '';
  document.getElementById(`${prefix}-custom-container`).style.display = 'none';
}

function addExpense() {
  const category = document.getElementById('category').value;
  const name = document.getElementById('expense-name').value.trim();
  const amount = parseFloat(document.getElementById('expense-amount').value);

  if (!name || isNaN(amount)) {
    alert(translations.enter_item_and_amount); // 지출도 동일한 메시지 사용
    return;
  }

  budgetData.expenses.push({
    id: generateUniqueId(),
    type: 'expenses',
    category,
    name,
    amount
  });

  updateUI();
  document.getElementById('expense-name').value = '';
  document.getElementById('expense-amount').value = '';
}

function addCategory() {
  const newCategoryName = document.getElementById('new-category').value.trim();
  if (!newCategoryName) {
    alert(translations.enter_category_name);
    return;
  }

  const emoji = prompt(translations.emoji_prompt, '📌'); // prompt도 번역
  const id = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  if (budgetData.categories.some(cat => cat.id === id)) {
    alert(translations.category_already_exists);
    return;
  }

  budgetData.categories.push({
    id: id,
    name: `${emoji || '�'} ${newCategoryName}` // 이모지 + 원본 이름 저장. 표시 시 번역 사용.
  });

  populateCategorySelect();
  document.getElementById('category').value = id;

  document.getElementById('new-category').value = '';
  document.getElementById('category-input-container').style.display = 'none';

  updateUI();
}

// Chart Functions (차트 레이블도 번역 적용)
function updateCharts(grossIncome, preTaxTotal, taxTotal, postTaxTotal, expensesTotal, remaining) {
    // --- 1. Income Flow Chart (총 수입 대비 배분) ---
    let incomeFlowLabels = [];
    let incomeFlowData = [];
    let incomeFlowColors = [];
    const baseColors = generateColors(5); // Enough for common categories

    if (grossIncome <= 0) {
        incomeFlowLabels = [translations.no_income];
        incomeFlowData = [1]; // Use a dummy value to make the pie chart visible
        incomeFlowColors = ['#DCDCDC'];
    } else {
        if (preTaxTotal > 0) {
            incomeFlowLabels.push(translations.pre_tax_type);
            incomeFlowData.push(preTaxTotal);
            incomeFlowColors.push(baseColors[0]);
        }
        if (taxTotal > 0) {
            incomeFlowLabels.push(translations.taxes_type);
            incomeFlowData.push(taxTotal);
            incomeFlowColors.push(baseColors[1]);
        }
        if (postTaxTotal > 0) {
            incomeFlowLabels.push(translations.post_tax_type);
            incomeFlowData.push(postTaxTotal);
            incomeFlowColors.push(baseColors[2]);
        }
        
        let effectiveExpenses = expensesTotal;
        let effectiveRemaining = remaining;

        // If remaining is negative, treat it as part of "total expenses"
        // for chart visualization. Pie charts don't handle negative values well.
        if (remaining < 0) {
            effectiveExpenses += Math.abs(remaining);
            effectiveRemaining = 0; // Set remaining to 0 for the chart
        }

        if (effectiveExpenses > 0) {
            incomeFlowLabels.push(translations.total_expenses_type);
            incomeFlowData.push(effectiveExpenses);
            incomeFlowColors.push(baseColors[3]);
        }
        if (effectiveRemaining > 0) { // Only add positive remaining to the chart
            incomeFlowLabels.push(translations.remaining_balance_type);
            incomeFlowData.push(effectiveRemaining);
            incomeFlowColors.push(baseColors[4]);
        }
        
        // If all values are zero but gross income is positive, show it as 'Remaining'
        if (incomeFlowData.reduce((a, b) => a + b, 0) === 0 && grossIncome > 0) {
            incomeFlowLabels = [translations.remaining_balance_type];
            incomeFlowData = [grossIncome];
            incomeFlowColors = ['#2ecc71']; // Green for remaining
        }
    }

    const incomeFlowCtx = document.getElementById('incomeFlowChart').getContext('2d');
    if (incomeFlowChartInstance) {
        incomeFlowChartInstance.destroy(); // Destroy existing chart
    }
    incomeFlowChartInstance = new Chart(incomeFlowCtx, {
        type: 'pie',
        data: {
            labels: incomeFlowLabels,
            datasets: [{
                data: incomeFlowData,
                backgroundColor: incomeFlowColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow charts to resize within their containers
            plugins: {
                legend: {
                    position: 'bottom', // 항상 하단에 배치
                    labels: {
                        boxWidth: 12, // 레이블 색상 상자 크기 조정
                        padding: 10,
                        font: {
                            size: 14
                        },
                        // 범례에 항목명과 퍼센테지만 표시
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                                return data.labels.map(function(label, i) {
                                    const value = data.datasets[0].data[i];
                                    const percentage = total === 0 ? '0.0' : (value / total * 100).toFixed(1);
                                    let text = `${label} (${percentage}%)`; // 금액 제거
                                    return {
                                        text: text,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor ? data.datasets[0].borderColor[i] : data.datasets[0].backgroundColor[i],
                                        lineWidth: 1,
                                        hidden: isNaN(value) || value === 0,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed;
                            const sum = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = sum === 0 ? '0.0' : (value / sum * 100).toFixed(1);
                            return `${label}$${formatMoney(value)} (${percentage}%)`; // 툴팁에서는 금액 유지
                        }
                    }
                },
                datalabels: false // 차트 내부 퍼센티지 표시를 완전히 비활성화합니다.
            }
        }
    });

    // --- 2. Expense Category Chart (총 지출 대비 비중) ---
    const expenseCategoryMap = new Map();
    budgetData.expenses.forEach(expense => {
        // 카테고리 이름 번역 적용
        const categoryName = translations[`category_${expense.category}`] || budgetData.categories.find(cat => cat.id === expense.category)?.name || translations.other_category;
        expenseCategoryMap.set(categoryName, (expenseCategoryMap.get(categoryName) || 0) + expense.amount);
    });

    let expenseCategoryLabels = Array.from(expenseCategoryMap.keys());
    let expenseCategoryData = Array.from(expenseCategoryMap.values());
    let expenseCategoryColors = generateColors(expenseCategoryLabels.length);

    // Handle case where total expenses are zero
    if (expenseCategoryData.reduce((sum, val) => sum + val, 0) === 0) {
        expenseCategoryLabels = [translations.no_expenses];
        expenseCategoryData = [1]; // Dummy value to show an empty pie chart visually
        expenseCategoryColors = ['#DCDCDC']; // Gray for no expenses
    }

    const expenseCategoryCtx = document.getElementById('expenseCategoryChart').getContext('2d');
    if (expenseCategoryChartInstance) {
        expenseCategoryChartInstance.destroy(); // Destroy existing chart
    }
    expenseCategoryChartInstance = new Chart(expenseCategoryCtx, {
        type: 'pie',
        data: {
            labels: expenseCategoryLabels,
            datasets: [{
                data: expenseCategoryData,
                backgroundColor: expenseCategoryColors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Allow charts to resize within their containers
            plugins: {
                legend: {
                    position: 'bottom', // 항상 하단에 배치
                    labels: {
                        font: {
                            size: 14
                        },
                        // 범례에 항목명과 퍼센테지만 표시
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
                                return data.labels.map(function(label, i) {
                                    const value = data.datasets[0].data[i];
                                    const percentage = total === 0 ? '0.0' : (value / total * 100).toFixed(1);
                                    let text = `${label} (${percentage}%)`; // 금액 제거
                                    return {
                                        text: text,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        strokeStyle: data.datasets[0].borderColor ? data.datasets[0].borderColor[i] : data.datasets[0].backgroundColor[i],
                                        lineWidth: 1,
                                        hidden: isNaN(value) || value === 0,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            const value = context.parsed;
                            const sum = context.dataset.data.reduce((a, b) => a + b, 0);
                            // Handle sum of 0 to prevent NaN for percentage
                            const percentage = sum === 0 ? '0.0' : (value / sum * 100).toFixed(1);
                            return `${label}$${formatMoney(value)} (${percentage}%)`; // 툴팁에서는 금액 유지
                        }
                    }
                },
                datalabels: false // 차트 내부 퍼센티지 표시를 완전히 비활성화합니다.
            }
        }
    });
}

// 6. 유틸리티 함수들 (alert/confirm 메시지 번역 적용)
function saveData() {
  try {
    updateUI();

    const dataStr = JSON.stringify(budgetData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `budget_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert(translations.data_saved_successfully);
    }, 1000);
  } catch (error) {
    console.error(translations.error_saving_data, error);
    alert(`${translations.error_saving_data} ${error.message}`);
  }
}

function loadData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileContent = await readFileAsText(file);
      const loadedData = JSON.parse(fileContent);

      if (!loadedData ||
          !Array.isArray(loadedData.taxes) ||
          !Array.isArray(loadedData.preTax) ||
          !Array.isArray(loadedData.postTax) ||
          !Array.isArray(loadedData.expenses)) {
        throw new Error(translations.invalid_data_format);
      }

      Object.assign(budgetData, {
        income: loadedData.income !== undefined ? loadedData.income : 0,
        taxes: loadedData.taxes,
        preTax: loadedData.preTax,
        postTax: loadedData.postTax,
        expenses: loadedData.expenses
      });

      if (Array.isArray(loadedData.categories)) {
        const currentCategoryIds = new Set(budgetData.categories.map(c => c.id));
        loadedData.categories.forEach(newCat => {
          if (!currentCategoryIds.has(newCat.id)) {
            budgetData.categories.push(newCat);
          }
        });
      }

      DEFAULT_DEDUCTIONS.taxes.forEach(defaultItem => {
          if (!budgetData.taxes.some(item => item.name === defaultItem.name)) {
              budgetData.taxes.push({ ...defaultItem, id: generateUniqueId(), type: 'taxes' });
          }
      });
      DEFAULT_DEDUCTIONS.preTax.forEach(defaultItem => {
          if (!budgetData.preTax.some(item => item.name === defaultItem.name)) {
              budgetData.preTax.push({ ...defaultItem, id: generateUniqueId(), type: 'preTax' });
          }
      });
      DEFAULT_DEDUCTIONS.postTax.forEach(defaultItem => {
          if (!budgetData.postTax.some(item => item.name === defaultItem.name)) {
              budgetData.postTax.push({ ...defaultItem, id: generateUniqueId(), type: 'postTax' });
          }
      });

      updateUI();
      alert(translations.data_loaded_successfully);
    } catch (error) {
      console.error(translations.error_loading_file, error);
      alert(`${translations.error_loading_file}${error.message}`);
    }
  };

  input.click();
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = event => resolve(event.target.result);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
}

function resetData() {
  if (confirm(translations.confirm_reset)) {
    localStorage.removeItem('budgetData');
    initDefaultData();
    updateUI();
    alert(translations.data_reset_successfully);
  }
}

// 7. 초기화 및 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', function() {
  // ChartDataLabels 플러그인 등록
  if (typeof ChartDataLabels !== 'undefined') {
      Chart.register(ChartDataLabels);
  } else {
      console.warn("ChartDataLabels is not defined. Data labels might not work.");
  }

  // 로컬 스토리지에서 마지막으로 선택된 언어 불러오기 (없으면 'ko')
  currentLanguage = localStorage.getItem('appLanguage') || 'ko';

  // Load saved data or initialize default data
  if (!localStorage.getItem('budgetData')) {
    initDefaultData();
  } else {
    const savedData = JSON.parse(localStorage.getItem('budgetData'));
    // Deep copy to ensure original objects are not mutated
    budgetData.income = savedData.income || 0;
    budgetData.taxes = savedData.taxes ? savedData.taxes.map(item => ({...item})) : [];
    budgetData.preTax = savedData.preTax ? savedData.preTax.map(item => ({...item})) : [];
    budgetData.postTax = savedData.postTax ? savedData.postTax.map(item => ({...item})) : [];
    budgetData.expenses = savedData.expenses ? savedData.expenses.map(item => ({...item})) : [];
    // 카테고리 로딩 시 언어에 맞는 이름으로 설정되지 않도록 id와 원래 이름만 저장하고 표시될때 번역하도록
    budgetData.categories = savedData.categories ? savedData.categories.map(item => ({id: item.id, name: item.name})) : [
      { id: 'housing', name: '🏠 주거' }, { id: 'food', name: '🍔 식비' },
      { id: 'transportation', name: '🚗 교통' }, { id: 'health', name: '🏥 건강' },
      { id: 'family', name: '👪 가족' }, { id: 'shopping', name: '🛍️ 쇼핑' },
      { id: 'finance', name: '💳 금융' }, { id: 'travel', name: '✈️ 여행' },
      { id: 'saving', name: '💰 저축' }, { id: 'business', name: '💼 업무' }
    ];

    DEFAULT_DEDUCTIONS.taxes.forEach(defaultItem => {
        if (!budgetData.taxes.some(item => item.name === defaultItem.name)) {
            budgetData.taxes.push({ ...defaultItem, id: generateUniqueId(), type: 'taxes' });
        }
    });
    DEFAULT_DEDUCTIONS.preTax.forEach(defaultItem => {
        if (!budgetData.preTax.some(item => item.name === defaultItem.name)) {
            budgetData.preTax.push({ ...defaultItem, id: generateUniqueId(), type: 'preTax' });
        }
    });
    DEFAULT_DEDUCTIONS.postTax.forEach(defaultItem => {
        if (!budgetData.postTax.some(item => item.name === defaultItem.name)) {
            budgetData.postTax.push({ ...defaultItem, id: generateUniqueId(), type: 'postTax' });
        }
    });
  }

  // 언어 선택 드롭다운에 이벤트 리스너 추가
  const langSelect = document.getElementById('language-select');
  if (langSelect) {
    // 옵션 텍스트를 언어 파일에서 가져오도록 업데이트 (초기 로드 시)
    // HTML에 하드코딩된 옵션 텍스트는 이 함수를 통해 번역될 것임.
    // 이모티콘은 그대로 유지됩니다.
    const updateSelectOptions = () => {
        Array.from(langSelect.options).forEach(option => {
            const langCode = option.value;
            let displayString = '';
            if (langCode === 'ko') displayString = '🇰🇷 한국어';
            else if (langCode === 'en') displayString = '🇺🇸 English';
            else if (langCode === 'zh') displayString = '🇨🇳 简体中文';
            option.textContent = displayString;
        });
    };
    updateSelectOptions(); // 초기 로드 시 옵션 텍스트 업데이트

    langSelect.value = currentLanguage; // 로컬 스토리지에서 불러온 언어로 설정
    langSelect.addEventListener('change', function() {
      localStorage.setItem('appLanguage', this.value); // 선택된 언어 로컬 스토리지에 저장
      loadTranslations(this.value); // 선택된 언어로 번역 로드
    });
  }

  // 초기 언어 로드 및 UI 업데이트
  loadTranslations(currentLanguage);

  // 나머지 기존 이벤트 리스너들은 그대로 유지합니다.
  // Event listeners for select boxes to show/hide custom input
  document.querySelectorAll('select[id$="-type"]').forEach(select => {
    select.addEventListener('change', function() {
      const type = this.id.replace('-type', '');
      const container = document.getElementById(`${type}-custom-container`);
      const customNameInput = document.getElementById(`${type}-custom-name`);
      const amountInput = document.getElementById(`${type}-amount-input`);

      if (this.value === 'custom') {
        container.style.display = 'flex';
        customNameInput.focus();
      } else {
        container.style.display = 'none';
        const existingItem = budgetData[type].find(item => item.name === this.value);
        amountInput.value = existingItem ? existingItem.amount : '0';
        amountInput.focus();
      }
    });
  });

  document.getElementById('category').addEventListener('change', function() {
    const container = document.getElementById('category-input-container');
    if (this.value === 'custom') {
      container.style.display = 'flex';
      document.getElementById('new-category').focus();
    } else {
      container.style.display = 'none';
    }
  });

  document.getElementById('income').addEventListener('input', function() {
    budgetData.income = parseFloat(this.value) || 0;
    updateUI();
  });

  // Event listeners for 'Enter' key to apply input
  document.getElementById('tax-amount-input').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('taxes'); });
  document.getElementById('pre-tax-amount-input').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('preTax'); });
  document.getElementById('post-tax-amount-input').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('postTax'); });
  document.getElementById('expense-amount').addEventListener('keypress', function(e) { if (e.key === 'Enter') addExpense(); });
});
