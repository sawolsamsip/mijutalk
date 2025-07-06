// 0. 전역 변수 및 DOM 요소 선택자 정의
const grossSalaryInput = document.getElementById('gross-salary');
const salaryFrequencySelect = document.getElementById('salary-frequency');
const defaultItemFrequencySelect = document.getElementById('default-item-frequency');

// Summary Displays
const annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');
const grossSalarySummaryDisplay = document.getElementById('gross-salary-summary-display');
const totalTaxesDisplay = document.getElementById('total-taxes-display');
const totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
const totalPostTaxDisplay = document.getElementById('total-post-tax-display');
const netSalaryDisplay = document.getElementById('net-salary-display');
const totalExpensesDisplay = document.getElementById('total-expenses-display');
const remainingBudgetDisplay = document.getElementById('remaining-budget-display');

// Tax Inputs (ID 확인: HTML과 일치해야 함)
const taxInputs = {
    federal: document.getElementById('federal-tax'),
    state: document.getElementById('state-tax'),
    oasdi: document.getElementById('oasdi-tax'),
    medicare: document.getElementById('medicare-tax'),
    casdi: document.getElementById('casdi-tax')
};

// Pre-Tax Deduction Inputs (ID 확인: HTML과 일치해야 함)
const preTaxDeductInputs = {
    medical: document.getElementById('medical-deduction'),
    dental: document.getElementById('dental-deduction'),
    vision: document.getElementById('vision-deduction'),
    // HTML ID와 JS 변수명 매핑 (DOM ID는 그대로 유지)
    fourZeroOneKTrad: document.getElementById('401k-traditional-deduction'),
    traditionalIRA: document.getElementById('traditional-ira-deduction'),
    hsa: document.getElementById('hsa-deduction')
};

// Post-Tax Deduction Inputs (ID 확인: HTML과 일치해야 함)
const postTaxDeductInputs = {
    spp: document.getElementById('spp-deduction'),
    adnd: document.getElementById('adnd-deduction'),
    // HTML ID와 JS 변수명 매핑 (DOM ID는 그대로 유지)
    fourZeroOneKRoth: document.getElementById('401k-roth-deduction'),
    ltd: document.getElementById('ltd-deduction'),
    rothIRA: document.getElementById('roth-ira-deduction'),
    healthInsurance: document.getElementById('health-insurance-deduction'),
    lifeInsurance: document.getElementById('life-insurance-deduction')
};

// Expense Inputs (ID 확인: HTML과 일치해야 함)
const expenseInputs = {
    rent: document.getElementById('rent-expense'),
    utilities: document.getElementById('utilities-expense'),
    internet: document.getElementById('internet-expense'),
    phone: document.getElementById('phone-expense'),
    groceries: document.getElementById('groceries-expense'),
    dining: document.getElementById('dining-expense'),
    transport: document.getElementById('transport-expense'),
    shopping: document.getElementById('shopping-expense'),
    health: document.getElementById('health-expense'),
    entertainment: document.getElementById('entertainment-expense')
};

// Custom Lists
let customTaxList = null;
let customPreTaxDeductList = null;
let customPostTaxDeductList = null;
let customExpenseList = null;

// Buttons & Toggles
const addTaxBtn = document.getElementById('add-tax-btn');
const addPreTaxDeductBtn = document.getElementById('add-pre-tax-deduct-btn');
const addPostTaxDeductBtn = document.getElementById('add-post-tax-deduct-btn');
const addExpenseBtn = document.getElementById('add-expense-btn');
const languageToggleBtn = document.getElementById('language-toggle-btn');
const darkmodeToggleBtn = document.getElementById('darkmode-toggle-btn');

// Data Management Buttons & Inputs
const exportJsonBtn = document.getElementById('export-json-btn');
const importJsonBtn = document.getElementById('import-json-btn');
const importJsonInput = document.getElementById('import-json-input');
const clearAllDataBtn = document.getElementById('clear-all-data-btn');

// AI Report
const aiReportBtn = document.getElementById('ai-report-btn');
const aiReportBox = document.getElementById('ai-report-box');

// Budget Rule Elements
const budgetRuleSelect = document.getElementById('budget-rule-select');
const ruleNeedsDisplay = document.getElementById('rule-needs-display');
const ruleWantsDisplay = document.getElementById('rule-wants-display');
const ruleSavingsDisplay = document.getElementById('rule-savings-display');
const ruleTotalDisplay = document.getElementById('rule-total-display');
const actualNeedsDisplay = document.getElementById('actual-needs-display');
const actualWantsDisplay = document.getElementById('actual-wants-display');
const actualSavingsDisplay = document.getElementById('actual-savings-display');
const actualTotalDisplay = document.getElementById('actual-total-display');
const budgetStatusDisplay = document.getElementById('budget-status-display');

// Chart Instances
let taxChartInstance = null;
let preTaxDeductChartInstance = null;
let postTaxDeductChartInstance = null;
let expensesChartInstance = null;
let budgetDistributionChartInstance = null;


// 1. 데이터 모델
let data = {
    salary: {
        gross: 0,
        frequency: 'monthly'
    },
    taxes: {
        federal: 0,
        state: 0,
        oasdi: 0,
        medicare: 0,
        casdi: 0,
        custom: []
    },
    preTaxDeductions: {
        medical: 0,
        dental: 0,
        vision: 0,
        '401kTrad': 0, // Key changed to match data object naming convention
        traditionalIRA: 0,
        hsa: 0,
        custom: []
    },
    postTaxDeductions: {
        spp: 0,
        adnd: 0,
        '401kRoth': 0, // Key changed to match data object naming convention
        ltd: 0,
        rothIRA: 0,
        healthInsurance: 0,
        lifeInsurance: 0,
        custom: []
    },
    expenses: {
        rent: 0, utilities: 0, internet: 0, phone: 0, groceries: 0, dining: 0, transport: 0,
        shopping: 0, health: 0, entertainment: 0, custom: []
    },
    defaultItemFrequency: 'monthly',
    budgetRule: '50-30-20',
    currentLanguage: 'ko',
    isDarkMode: false
};

// 2. 다국어 지원을 위한 번역 객체 (translations.js에서 로드된다고 가정)
// 실제 프로젝트에서는 별도의 translations.js 파일이 있을 것입니다.
// 여기서는 예시를 위해 일부만 포함합니다.
const translations = {
    en: {
        app_title: "Budget Planner",
        section_income_title: "Income",
        label_gross_salary: "Gross Salary",
        frequency_monthly: "Monthly",
        frequency_annually: "Annually",
        frequency_weekly: "Weekly",
        frequency_bi_weekly: "Bi-Weekly",
        label_default_item_frequency: "Default Item Frequency",
        annual_summary: "Annual Summary:",
        monthly_gross_salary: "Monthly Gross Salary:",
        section_taxes_title: "Taxes",
        label_federal_tax: "Federal Tax",
        label_state_tax: "State Tax",
        label_oasdi_tax: "OASDI Tax",
        label_medicare_tax: "Medicare Tax",
        label_ca_sdi: "CA SDI Tax",
        label_total_taxes: "Total Taxes:",
        section_pre_tax_title: "Pre-Tax Deductions",
        label_medical: "Medical",
        label_dental: "Dental",
        label_vision: "Vision",
        label_401k_traditional: "401(k) Traditional",
        label_traditional_ira: "Traditional IRA",
        label_hsa: "HSA",
        label_total_pre_tax: "Total Pre-Tax Deductions:",
        section_post_tax_title: "Post-Tax Deductions",
        label_spp: "SPP",
        label_adnd: "AD&D",
        label_401k_roth: "401(k) Roth",
        label_ltd: "LTD",
        label_roth_ira: "Roth IRA",
        label_health_insurance: "Health Insurance",
        label_life_insurance: "Life Insurance",
        label_total_post_tax: "Total Post-Tax Deductions:",
        label_net_salary: "Net Salary:",
        section_expenses_title: "Expenses",
        label_rent: "Rent",
        label_utilities: "Utilities",
        label_internet: "Internet",
        label_phone: "Phone",
        label_groceries: "Groceries",
        label_dining: "Dining Out",
        label_transport: "Transportation",
        label_shopping: "Shopping",
        label_health: "Health",
        label_entertainment: "Entertainment",
        label_total_expenses: "Total Expenses:",
        label_remaining_budget: "Remaining Budget:",
        add_item: "Add Item",
        remove_item: "Remove Item",
        btn_edit_item: "Edit Item",
        btn_save_item_changes: "Save Changes",
        label_new_item: "New Item",
        item_name_placeholder: "Item Name",
        category_needs: "Needs",
        category_wants: "Wants",
        section_budget_rule_title: "Budget Rule",
        needs_label: "Needs",
        wants_label: "Wants",
        savings_label: "Savings",
        label_total: "Total",
        budget_rule_actual: "Actual",
        budget_rule_status: "Status",
        status_over: "Over",
        status_under: "Under",
        status_ok: "On Track",
        label_deficit: "Deficit",
        section_chart_title: "Budget Breakdown",
        section_ai_report_title: "AI Budget Report (Coming Soon)",
        ai_report_placeholder: "AI Report will be generated here.",
        btn_generate_report: "Generate Report",
        data_management_title: "Data Management",
        btn_export_json: "Export JSON",
        btn_import_json: "Import JSON",
        btn_clear_all_data: "Clear All Data",
        alert_json_export_success: "Budget data exported successfully!",
        alert_data_import_success: "Budget data imported successfully!",
        alert_invalid_json: "Invalid JSON file. Please select a valid budget data file.",
        alert_json_parse_error: "Error parsing JSON file: ",
        confirm_clear_data: "Are you sure you want to clear all saved data? This action cannot be undone.",
        alert_data_cleared: "All budget data has been cleared!"
    },
    ko: {
        app_title: "예산 플래너",
        section_income_title: "수입",
        label_gross_salary: "총 급여",
        frequency_monthly: "월별",
        frequency_annually: "연간",
        frequency_weekly: "주간",
        frequency_bi_weekly: "격주",
        label_default_item_frequency: "항목 기본 주기",
        annual_summary: "연간 요약:",
        monthly_gross_salary: "월별 총 급여:",
        section_taxes_title: "세금",
        label_federal_tax: "연방세",
        label_state_tax: "주세",
        label_oasdi_tax: "OASDI 세금",
        label_medicare_tax: "메디케어 세금",
        label_ca_sdi: "CA SDI 세금",
        label_total_taxes: "총 세금:",
        section_pre_tax_title: "세전 공제",
        label_medical: "의료비",
        label_dental: "치과",
        label_vision: "시력",
        label_401k_traditional: "401(k) 전통",
        label_traditional_ira: "개인 퇴직 연금 (전통)",
        label_hsa: "HSA",
        label_total_pre_tax: "총 세전 공제:",
        section_post_tax_title: "세후 공제",
        label_spp: "SPP",
        label_adnd: "AD&D",
        label_401k_roth: "401(k) 로스",
        label_ltd: "LTD",
        label_roth_ira: "개인 퇴직 연금 (로스)",
        label_health_insurance: "건강 보험",
        label_life_insurance: "생명 보험",
        label_total_post_tax: "총 세후 공제:",
        label_net_salary: "순수입:",
        section_expenses_title: "지출",
        label_rent: "월세",
        label_utilities: "공과금",
        label_internet: "인터넷",
        label_phone: "휴대폰",
        label_groceries: "식료품",
        label_dining: "외식",
        label_transport: "교통비",
        label_shopping: "쇼핑",
        label_health: "건강",
        label_entertainment: "오락",
        label_total_expenses: "총 지출:",
        label_remaining_budget: "남은 예산:",
        add_item: "항목 추가",
        remove_item: "항목 삭제",
        btn_edit_item: "편집",
        btn_save_item_changes: "저장",
        label_new_item: "새 항목",
        item_name_placeholder: "항목 이름",
        category_needs: "필수 지출",
        category_wants: "선택 지출",
        section_budget_rule_title: "예산 규칙",
        needs_label: "필수 지출",
        wants_label: "선택 지출",
        savings_label: "저축",
        label_total: "총계",
        budget_rule_actual: "실제",
        budget_rule_status: "상태",
        status_over: "초과",
        status_under: "미달",
        status_ok: "양호",
        label_deficit: "적자",
        section_chart_title: "예산 분석",
        section_ai_report_title: "AI 예산 보고서 (예정)",
        ai_report_placeholder: "AI 보고서는 여기에 생성됩니다.",
        btn_generate_report: "보고서 생성",
        data_management_title: "데이터 관리",
        btn_export_json: "JSON 내보내기",
        btn_import_json: "JSON 가져오기",
        btn_clear_all_data: "모든 데이터 지우기",
        alert_json_export_success: "예산 데이터를 성공적으로 내보냈습니다!",
        alert_data_import_success: "예산 데이터를 성공적으로 가져왔습니다!",
        alert_invalid_json: "유효하지 않은 JSON 파일입니다. 올바른 예산 데이터 파일을 선택해주세요.",
        alert_json_parse_error: "JSON 파일 파싱 오류: ",
        confirm_clear_data: "저장된 모든 데이터를 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.",
        alert_data_cleared: "모든 예산 데이터가 지워졌습니다!"
    }
};

// 3. 초기화 함수 (동일)
function initialize() {
    // 모든 초기화 로직은 loadData()와 DOMContentLoaded에서 처리됩니다.
    // 여기서는 특별히 할 일이 없습니다.
}

// 4. 유틸리티 함수

// 통화 형식 지정
function formatCurrency(amount) {
    const locale = navigator.language || 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * 주어진 금액을 입력된 주기로부터 월별 기준으로 변환합니다.
 * @param {number} amount 변환할 금액
 * @param {string} frequency 금액의 주기 ('monthly', 'annually', 'weekly', 'bi-weekly')
 * @returns {number} 월별로 변환된 금액
 */
function convertToMonthly(amount, frequency) {
    switch (frequency) {
        case 'annually':
            return amount / 12;
        case 'weekly':
            return amount * (52 / 12); // 약 4.33주/월
        case 'bi-weekly':
            return amount * (26 / 12); // 약 2.16 격주/월
        case 'monthly':
        default:
            return amount;
    }
}

// 모든 입력 필드 및 커스텀 항목의 총액을 월별 기준으로 계산 (데이터 객체 사용하도록 수정)
function getTotalMonthly(sectionData) { // sectionData는 data.taxes, data.expenses 등입니다.
    let total = 0;
    // 고정 입력 필드 처리 (data 객체에 저장된 값은 이미 월별이라고 가정)
    for (const key in sectionData) {
        if (key !== 'custom') { // 'custom' 배열은 따로 처리
            const value = parseFloat(sectionData[key]) || 0;
            total += value;
        }
    }
    // 사용자 정의 항목 처리
    sectionData.custom.forEach(item => {
        total += convertToMonthly(item.value, item.frequency || data.defaultItemFrequency);
    });
    return total;
}

// 사용자 정의 항목 렌더링
function renderCustomList(listElement, items, type) {
    if (!listElement) {
        console.warn(`renderCustomList: List element not found for type ${type}`);
        return;
    }
    listElement.innerHTML = ''; // 기존 목록 초기화

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'form-group custom-item';
        itemDiv.dataset.itemId = item.id; // 데이터 ID 설정
        itemDiv.dataset.itemType = type; // 데이터 타입 설정

        // item.name이 없는 경우를 대비하여 기본값 설정
        const itemNameDisplay = item.name || translations[data.currentLanguage].label_new_item;

        // 새로 추가된 항목인지 확인 (ID가 'new-...'로 시작하는 경우)
        // 또는 이름이 기본 '새 항목'이고 값이 0인 경우를 초기 편집 모드로 간주
        const isNewOrEmpty = item.name === translations[data.currentLanguage].label_new_item && item.value === 0;

        itemDiv.innerHTML = `
            <label for="${item.id}-name-input" class="custom-item-label" style="display: ${isNewOrEmpty ? 'none' : 'block'};">${itemNameDisplay}</label>
            <div class="input-container custom-input-container">
                <input type="text" id="${item.id}-name-input" class="form-control custom-item-name-input" value="${item.name || ''}" placeholder="${translations[data.currentLanguage].item_name_placeholder}" ${isNewOrEmpty ? '' : 'readonly'}>
                <input type="number" id="${item.id}-value-input" class="form-control custom-item-value-input" min="0" value="${item.value}" step="0.01" ${isNewOrEmpty ? '' : 'readonly'}>
                <select id="${item.id}-frequency-select" class="form-control custom-item-frequency-select" ${type === 'expense' || type === 'tax' || type === 'pre-tax' || type === 'post-tax' ? '' : 'style="display: none;"'} ${isNewOrEmpty ? '' : 'disabled'}>
                    <option value="monthly" ${item.frequency === 'monthly' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_monthly}</option>
                    <option value="annually" ${item.frequency === 'annually' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_annually}</option>
                    <option value="weekly" ${item.frequency === 'weekly' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_weekly}</option>
                    <option value="bi-weekly" ${item.frequency === 'bi-weekly' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_bi_weekly}</option>
                </select>
                ${type === 'expense' ? `
                <select id="${item.id}-category-select" class="form-control custom-item-category-select" ${isNewOrEmpty ? '' : 'disabled'}>
                    <option value="needs" ${item.category === 'needs' ? 'selected' : ''}>${translations[data.currentLanguage].category_needs}</option>
                    <option value="wants" ${item.category === 'wants' ? 'selected' : ''}>${translations[data.currentLanguage].category_wants}</option>
                </select>` : ''}
                <button class="icon-btn edit-custom-btn" title="${isNewOrEmpty ? translations[data.currentLanguage].btn_save_item_changes : translations[data.currentLanguage].btn_edit_item}"><i class="${isNewOrEmpty ? 'ri-check-line' : 'ri-pencil-line'}"></i></button>
                <button class="icon-btn delete-custom-btn" onclick="deleteCustomItem('${type}', '${item.id}')" title="${translations[data.currentLanguage].remove_item}"><i class="ri-close-line"></i></button>
            </div>
        `;
        listElement.appendChild(itemDiv);

        // 새로 추가된 요소들에 이벤트 리스너를 직접 연결
        const nameInput = itemDiv.querySelector(`#${item.id}-name-input`);
        const valueInput = itemDiv.querySelector(`#${item.id}-value-input`);
        const frequencySelect = itemDiv.querySelector(`#${item.id}-frequency-select`);
        const categorySelect = itemDiv.querySelector(`#${item.id}-category-select`); // expense 타입인 경우
        const editButton = itemDiv.querySelector('.edit-custom-btn');
        const labelElement = itemDiv.querySelector('.custom-item-label');

        // Add event listener to the edit button (using delegation later, but direct for simplicity here)
        // For dynamic items, event delegation in DOMContentLoaded is generally better.
        // However, if renderCustomList replaces all innerHTML, these need to be re-attached.
        // The DOMContentLoaded section uses delegation for edit/delete, which is robust.
        // The following direct attachments are for input/change events which need to be specific to the newly rendered elements.

        nameInput.addEventListener('input', (event) => {
            updateCustomItem(type, item.id, 'name', event.target.value);
            // Label update needs to happen after rendering the item or by specifically updating it.
            // For now, it's updated when edit mode is toggled off.
        });

        valueInput.addEventListener('input', (event) => {
            updateCustomItem(type, item.id, 'value', event.target.value);
        });

        if (frequencySelect) { // frequencySelect가 존재할 때만 리스너 추가
            frequencySelect.addEventListener('change', (event) => {
                updateCustomItem(type, item.id, 'frequency', event.target.value);
            });
        }

        if (categorySelect) { // categorySelect가 존재할 때만 리스너 추가
            categorySelect.addEventListener('change', (event) => {
                updateCustomItem(type, item.id, 'category', event.target.value);
            });
        }
    });
}

// 사용자 정의 항목 추가
function addCustomItem(type) {
    const itemName = translations[data.currentLanguage].label_new_item;
    const itemAmount = 0;
    const itemId = `${type}-${Date.now()}`;

    let targetArray;
    let itemCategory = '';
    if (type === 'tax') targetArray = data.taxes.custom;
    else if (type === 'pre-tax') targetArray = data.preTaxDeductions.custom;
    else if (type === 'post-tax') targetArray = data.postTaxDeductions.custom;
    else if (type === 'expense') {
        targetArray = data.expenses.custom;
        itemCategory = 'needs'; // 지출 항목의 기본 카테고리
    } else {
        console.error("Unknown custom item type:", type);
        return;
    }

    const newItem = {
        id: itemId,
        name: itemName,
        value: itemAmount,
        frequency: data.defaultItemFrequency // 기본 주기를 따름
    };

    if (type === 'expense') {
        newItem.category = itemCategory;
    }

    targetArray.push(newItem);
    updateDisplay(); // updateDisplay를 호출하여 새로운 항목이 DOM에 렌더링되도록 합니다.
    saveData(); // 데이터를 저장합니다.

    // 새로 추가된 항목의 이름 입력 필드에 포커스 주기
    setTimeout(() => { // DOM이 업데이트될 시간을 약간 기다립니다.
        const newItemDiv = document.querySelector(`.custom-item[data-item-id="${itemId}"]`);
        if (newItemDiv) {
            const nameInput = newItemDiv.querySelector(`#${itemId}-name-input`);
            if (nameInput) {
                nameInput.focus();
                nameInput.select(); // 텍스트 전체 선택
            }
        }
    }, 0);
}

// 사용자 정의 항목 제거
function deleteCustomItem(type, itemId) {
    const confirmed = confirm(translations[data.currentLanguage].confirm_remove_item || translations[data.currentLanguage].remove_item); // Use more specific confirmation text if available
    if (!confirmed) return;

    let targetArray;
    if (type === 'tax') targetArray = data.taxes.custom;
    else if (type === 'pre-tax') targetArray = data.preTaxDeductions.custom;
    else if (type === 'post-tax') targetArray = data.postTaxDeductions.custom;
    else if (type === 'expense') targetArray = data.expenses.custom;
    else {
        console.error("Unknown custom item type for deletion:", type);
        return;
    }

    const updatedArray = targetArray.filter(item => item.id !== itemId);

    if (type === 'tax') data.taxes.custom = updatedArray;
    else if (type === 'pre-tax') data.preTaxDeductions.custom = updatedArray;
    else if (type === 'post-tax') data.postTaxDeductions.custom = updatedArray;
    else if (type === 'expense') data.expenses.custom = updatedArray;

    updateDisplay();
    saveData();
}

// 새 함수: `toggleEditMode` - 편집 버튼 클릭 시 모드 전환
function toggleEditMode(button, type, itemId) {
    const itemDiv = button.closest('.custom-item');
    const nameInput = itemDiv.querySelector('.custom-item-name-input');
    const valueInput = itemDiv.querySelector('.custom-item-value-input');
    const frequencySelect = itemDiv.querySelector('.custom-item-frequency-select');
    const categorySelect = itemDiv.querySelector('.custom-item-category-select');
    const label = itemDiv.querySelector('.custom-item-label');
    const icon = button.querySelector('i');

    const isEditing = nameInput.readOnly === false; // readOnly 속성으로 현재 편집 모드인지 확인

    if (!isEditing) { // 현재 읽기 모드 -> 편집 모드로 전환
        nameInput.removeAttribute('readonly');
        valueInput.removeAttribute('readonly');
        if (frequencySelect) frequencySelect.removeAttribute('disabled');
        if (categorySelect) categorySelect.removeAttribute('disabled');

        nameInput.style.display = 'block';
        label.style.display = 'none';

        nameInput.focus();
        nameInput.select(); // 텍스트 전체 선택
        icon.className = 'ri-check-line'; // 아이콘을 저장(체크)으로 변경
        button.title = translations[data.currentLanguage].btn_save_item_changes; // 툴팁 변경
    } else { // 현재 편집 모드 -> 읽기 모드로 전환 (저장)
        nameInput.setAttribute('readonly', 'true');
        valueInput.setAttribute('readonly', 'true');
        if (frequencySelect) frequencySelect.setAttribute('disabled', 'true');
        if (categorySelect) categorySelect.setAttribute('disabled', 'true');

        nameInput.style.display = 'none';
        label.style.display = 'block';
        label.textContent = nameInput.value || translations[data.currentLanguage].label_new_item; // 라벨 업데이트

        icon.className = 'ri-pencil-line'; // 아이콘을 편집(연필)으로 변경
        button.title = translations[data.currentLanguage].btn_edit_item; // 툴팁 변경

        // saveData() 호출. updateDisplay()는 updateCustomItem에서 이미 호출됩니다.
        saveData();
    }
}

// 새 함수: `updateCustomItem` - 사용자 정의 항목의 이름 또는 값 업데이트
function updateCustomItem(type, itemId, field, newValue) {
    let targetArray;
    if (type === 'tax') targetArray = data.taxes.custom;
    else if (type === 'pre-tax') targetArray = data.preTaxDeductions.custom;
    else if (type === 'post-tax') targetArray = data.postTaxDeductions.custom;
    else if (type === 'expense') targetArray = data.expenses.custom;
    else {
        console.error("Unknown custom item type for update:", type);
        return;
    }

    const itemToUpdate = targetArray.find(item => item.id === itemId);
    if (itemToUpdate) {
        if (field === 'name') {
            itemToUpdate.name = newValue;
        } else if (field === 'value') {
            itemToUpdate.value = parseFloat(newValue) || 0;
        } else if (field === 'frequency') {
            itemToUpdate.frequency = newValue;
        } else if (field === 'category') {
            itemToUpdate.category = newValue;
        }
    }
    updateDisplay(); // 데이터 변경 후 화면 업데이트 (저장은 toggleEditMode에서 일괄 처리)
}

// 5. 언어 적용
function applyLanguage(lang) {
    data.currentLanguage = lang;
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[data.currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[data.currentLanguage][key];
            } else if (element.tagName === 'OPTION') {
                element.textContent = translations[data.currentLanguage][key];
            } else if (element.tagName === 'BUTTON' && element.classList.contains('delete-custom-btn')) {
                element.title = translations[data.currentLanguage].remove_item; // 또는 confirm_remove_item
            } else if (element.tagName === 'BUTTON' && element.classList.contains('edit-custom-btn')) {
                // 편집 버튼의 툴팁은 토글 모드에 따라 변경되므로 여기서 직접 설정하지 않습니다.
                // toggleEditMode 함수에서 처리됩니다.
            }
             else {
                element.textContent = translations[data.currentLanguage][key];
            }
        }
    });

    if (languageToggleBtn) {
        languageToggleBtn.textContent = data.currentLanguage === 'ko' ? 'EN' : 'KO';
    }

    // 예산 규칙 섹션 라벨 수동 업데이트 (HTML에 data-i18n-key를 추가하는 것이 더 좋습니다)
    // HTML에 `data-i18n-key`를 추가하는 것을 권장하지만, 현재 구조에 맞춰 수동 업데이트
    const needsLabelEl = document.querySelector('[data-i18n-key="needs_label"]');
    if (needsLabelEl) needsLabelEl.textContent = translations[data.currentLanguage].needs_label + ':';
    const wantsLabelEl = document.querySelector('[data-i18n-key="wants_label"]');
    if (wantsLabelEl) wantsLabelEl.textContent = translations[data.currentLanguage].wants_label + ':';
    const savingsLabelEl = document.querySelector('[data-i18n-key="savings_label"]');
    if (savingsLabelEl) savingsLabelEl.textContent = translations[data.currentLanguage].savings_label + ':';
    const totalLabelEl = document.querySelector('[data-i18n-key="label_total_rule_breakdown"]'); // Changed key to be more specific
    if (totalLabelEl) totalLabelEl.textContent = translations[data.currentLanguage].label_total + ':';

    const actualLabelEl = document.querySelector('[data-i18n-key="budget_rule_actual"]');
    if (actualLabelEl) actualLabelEl.textContent = translations[data.currentLanguage].budget_rule_actual;
    const statusLabelEl = document.querySelector('[data-i18n-key="budget_rule_status"]');
    if (statusLabelEl) statusLabelEl.textContent = translations[data.currentLanguage].budget_rule_status;


    if (aiReportBox) {
        const aiReportPlaceholderP = aiReportBox.querySelector('p');
        if (aiReportPlaceholderP) {
            aiReportPlaceholderP.textContent = translations[data.currentLanguage].ai_report_placeholder;
        }
    }

    updateDisplay(); // 언어 변경 시 사용자 정의 항목의 기본 이름 (새 항목)도 다시 렌더링되도록
}

// 6. 다크 모드 적용
function applyDarkMode(enable) {
    data.isDarkMode = enable;
    document.body.classList.toggle('dark-mode', data.isDarkMode);
    if (darkmodeToggleBtn) {
        darkmodeToggleBtn.innerHTML = data.isDarkMode ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
    }
    updateDisplay(); // 차트 색상 업데이트를 위해 updateDisplay 호출
}

// 7. 데이터 저장 및 로드
function saveData() {
    // 모든 입력 필드의 현재 값을 data 객체에 저장
    if (grossSalaryInput) data.salary.gross = parseFloat(grossSalaryInput.value) || 0;
    if (salaryFrequencySelect) data.salary.frequency = salaryFrequencySelect.value;
    if (defaultItemFrequencySelect) data.defaultItemFrequency = defaultItemFrequencySelect.value;
    if (budgetRuleSelect) data.budgetRule = budgetRuleSelect.value;

    for (const key in taxInputs) {
        if (taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    }
    
    // DOM ID와 data 객체 키 불일치 매핑 처리
    if (preTaxDeductInputs.medical) data.preTaxDeductions.medical = parseFloat(preTaxDeductInputs.medical.value) || 0;
    if (preTaxDeductInputs.dental) data.preTaxDeductions.dental = parseFloat(preTaxDeductInputs.dental.value) || 0;
    if (preTaxDeductInputs.vision) data.preTaxDeductions.vision = parseFloat(preTaxDeductInputs.vision.value) || 0;
    if (preTaxDeductInputs.fourZeroOneKTrad) data.preTaxDeductions['401kTrad'] = parseFloat(preTaxDeductInputs.fourZeroOneKTrad.value) || 0;
    if (preTaxDeductInputs.traditionalIRA) data.preTaxDeductions.traditionalIRA = parseFloat(preTaxDeductInputs.traditionalIRA.value) || 0;
    if (preTaxDeductInputs.hsa) data.preTaxDeductions.hsa = parseFloat(preTaxDeductInputs.hsa.value) || 0;

    if (postTaxDeductInputs.spp) data.postTaxDeductions.spp = parseFloat(postTaxDeductInputs.spp.value) || 0;
    if (postTaxDeductInputs.adnd) data.postTaxDeductions.adnd = parseFloat(postTaxDeductInputs.adnd.value) || 0;
    if (postTaxDeductInputs.fourZeroOneKRoth) data.postTaxDeductions['401kRoth'] = parseFloat(postTaxDeductInputs.fourZeroOneKRoth.value) || 0;
    if (postTaxDeductInputs.ltd) data.postTaxDeductions.ltd = parseFloat(postTaxDeductInputs.ltd.value) || 0;
    if (postTaxDeductInputs.rothIRA) data.postTaxDeductions.rothIRA = parseFloat(postTaxDeductInputs.rothIRA.value) || 0;
    if (postTaxDeductInputs.healthInsurance) data.postTaxDeductions.healthInsurance = parseFloat(postTaxDeductInputs.healthInsurance.value) || 0;
    if (postTaxDeductInputs.lifeInsurance) data.postTaxDeductions.lifeInsurance = parseFloat(postTaxDeductInputs.lifeInsurance.value) || 0;

    for (const key in expenseInputs) {
        if (expenseInputs[key]) data.expenses[key] = parseFloat(expenseInputs[key].value) || 0;
    }

    localStorage.setItem('budgetAppData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('budgetAppData');
    if (savedData) {
        // 깊은 복사 대신 Object.assign을 사용하여 최상위 속성만 복사하고,
        // 중첩된 객체는 참조를 유지하면서 속성을 덮어쓰도록 합니다.
        // 또는 JSON.parse(JSON.stringify(data))를 사용하여 깊은 복사를 할 수 있지만,
        // 여기서는 데이터 구조가 비교적 고정적이므로 Object.assign으로 충분합니다.
        const parsedData = JSON.parse(savedData);
        // 새로운 속성이 추가될 경우를 대비하여 기존 data 객체에 새 속성을 유지하면서 로드된 값을 덮어씁니다.
        // 이는 data 객체의 기본 구조가 확장될 때 유용합니다.
        data = { ...data, ...parsedData };
        data.salary = { ...data.salary, ...parsedData.salary };
        data.taxes = { ...data.taxes, ...parsedData.taxes };
        data.preTaxDeductions = { ...data.preTaxDeductions, ...parsedData.preTaxDeductions };
        data.postTaxDeductions = { ...data.postTaxDeductions, ...parsedData.postTaxDeductions };
        data.expenses = { ...data.expenses, ...parsedData.expenses };

        // DOM 업데이트
        if (grossSalaryInput) grossSalaryInput.value = data.salary.gross;
        if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;

        // 고정 입력 필드 로드 및 DOM 업데이트 (null check 강화)
        for (const key in taxInputs) {
            if (taxInputs[key] && typeof data.taxes[key] !== 'undefined') taxInputs[key].value = data.taxes[key];
        }
        
        // DOM ID와 data 객체 키 매핑 처리
        if (preTaxDeductInputs.medical && typeof data.preTaxDeductions.medical !== 'undefined') preTaxDeductInputs.medical.value = data.preTaxDeductions.medical;
        if (preTaxDeductInputs.dental && typeof data.preTaxDeductions.dental !== 'undefined') preTaxDeductInputs.dental.value = data.preTaxDeductions.dental;
        if (preTaxDeductInputs.vision && typeof data.preTaxDeductions.vision !== 'undefined') preTaxDeductInputs.vision.value = data.preTaxDeductions.vision;
        if (preTaxDeductInputs.fourZeroOneKTrad && typeof data.preTaxDeductions['401kTrad'] !== 'undefined') preTaxDeductInputs.fourZeroOneKTrad.value = data.preTaxDeductions['401kTrad'];
        if (preTaxDeductInputs.traditionalIRA && typeof data.preTaxDeductions.traditionalIRA !== 'undefined') preTaxDeductInputs.traditionalIRA.value = data.preTaxDeductions.traditionalIRA;
        if (preTaxDeductInputs.hsa && typeof data.preTaxDeductions.hsa !== 'undefined') preTaxDeductInputs.hsa.value = data.preTaxDeductions.hsa;

        if (postTaxDeductInputs.spp && typeof data.postTaxDeductions.spp !== 'undefined') postTaxDeductInputs.spp.value = data.postTaxDeductions.spp;
        if (postTaxDeductInputs.adnd && typeof data.postTaxDeductions.adnd !== 'undefined') postTaxDeductInputs.adnd.value = data.postTaxDeductions.adnd;
        if (postTaxDeductInputs.fourZeroOneKRoth && typeof data.postTaxDeductions['401kRoth'] !== 'undefined') postTaxDeductInputs.fourZeroOneKRoth.value = data.postTaxDeductions['401kRoth'];
        if (postTaxDeductInputs.ltd && typeof data.postTaxDeductions.ltd !== 'undefined') postTaxDeductInputs.ltd.value = data.postTaxDeductions.ltd;
        if (postTaxDeductInputs.rothIRA && typeof data.postTaxDeductions.rothIRA !== 'undefined') postTaxDeductInputs.rothIRA.value = data.postTaxDeductions.rothIRA;
        if (postTaxDeductInputs.healthInsurance && typeof data.postTaxDeductions.healthInsurance !== 'undefined') postTaxDeductInputs.healthInsurance.value = data.postTaxDeductions.healthInsurance;
        if (postTaxDeductInputs.lifeInsurance && typeof data.postTaxDeductions.lifeInsurance !== 'undefined') postTaxDeductInputs.lifeInsurance.value = data.postTaxDeductions.lifeInsurance;

        for (const key in expenseInputs) {
            if (expenseInputs[key] && typeof data.expenses[key] !== 'undefined') expenseInputs[key].value = data.expenses[key];
        }

        if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

        // Custom lists need to be re-rendered to reflect loaded data
        renderCustomList(customTaxList, data.taxes.custom, 'tax');
        renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
        renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
        renderCustomList(customExpenseList, data.expenses.custom, 'expense');

        // Apply language and dark mode from loaded data
        applyLanguage(data.currentLanguage);
        applyDarkMode(data.isDarkMode);

        updateDisplay(); // Ensures all calculations and UI are up-to-date
    } else {
        // 저장된 데이터가 없는 경우, DOM 요소를 0으로 초기화
        // data 객체는 이미 초기값으로 설정되어 있으므로, DOM에 반영만 하면 됨
        if (grossSalaryInput) grossSalaryInput.value = 0;
        if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;
        if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

        [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs].forEach(inputsGroup => {
            for (const key in inputsGroup) {
                if (inputsGroup[key]) inputsGroup[key].value = 0;
            }
        });

        // Clear custom lists in DOM
        if (customTaxList) customTaxList.innerHTML = '';
        if (customPreTaxDeductList) customPreTaxDeductList.innerHTML = '';
        if (customPostTaxDeductList) customPostTaxDeductList.innerHTML = '';
        if (customExpenseList) customExpenseList.innerHTML = '';

        applyLanguage(data.currentLanguage);
        applyDarkMode(data.isDarkMode);
        updateDisplay();
    }
}


// 8. 차트 관리 (Chart.js)
function initializeCharts() {
    const taxCtx = document.getElementById('tax-chart')?.getContext('2d');
    const preTaxCtx = document.getElementById('pre-tax-deduct-chart')?.getContext('2d');
    const postTaxCtx = document.getElementById('post-tax-deduct-chart')?.getContext('2d');
    const expensesCtx = document.getElementById('expenses-chart')?.getContext('2d');
    const budgetDistributionCtx = document.getElementById('budget-distribution-chart')?.getContext('2d');

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: data.isDarkMode ? '#fff' : '#333'
                }
            }
        }
    };

    // 기존 차트 인스턴스가 있으면 파괴하고 새로 생성
    if (taxChartInstance) taxChartInstance.destroy();
    if (preTaxDeductChartInstance) preTaxDeductChartInstance.destroy();
    if (postTaxDeductChartInstance) postTaxDeductChartInstance.destroy();
    if (expensesChartInstance) expensesChartInstance.destroy();
    if (budgetDistributionChartInstance) budgetDistributionChartInstance.destroy();


    if (taxCtx) {
        taxChartInstance = new Chart(taxCtx, {
            type: 'pie',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            options: chartOptions
        });
    }
    if (preTaxCtx) {
        preTaxDeductChartInstance = new Chart(preTaxCtx, {
            type: 'pie',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            options: chartOptions
        });
    }
    if (postTaxCtx) {
        postTaxDeductChartInstance = new Chart(postTaxCtx, {
            type: 'pie',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            options: chartOptions
        });
    }
    if (expensesCtx) {
        expensesChartInstance = new Chart(expensesCtx, {
            type: 'pie',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            options: chartOptions
        });
    }
    if (budgetDistributionCtx) {
        budgetDistributionChartInstance = new Chart(budgetDistributionCtx, {
            type: 'doughnut',
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            options: chartOptions
        });
    }
}

// updateCharts 함수 수정: 이제 data 객체에서 값을 가져오고, custom 항목 처리 개선
function updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions) {
    const defaultColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#A0B0C0', '#C0A0B0', '#B0C0A0'
    ];
    const darkColors = [
        '#E0567A', '#2A8CD9', '#E6B830', '#3FAAAA', '#8040E0', '#E08020', '#C0C2C4', '#8090A0', '#A08090', '#90A080'
    ];
    const colors = data.isDarkMode ? darkColors : defaultColors;

    // Helper to update individual chart
    const updateChartData = (chartInstance, dataSection, titlePrefix = '', excludeZero = true) => {
        if (!chartInstance) return;

        let labels = [];
        let chartValues = [];
        let backgroundColors = [];
        let currentColorIndex = 0;

        // 고정 입력 필드 처리
        for (const key in dataSection) {
            if (key !== 'custom') {
                const value = parseFloat(dataSection[key]) || 0;
                if (value > 0 || !excludeZero) {
                    // 키 이름을 번역 키에 맞게 조정
                    let labelKey = '';
                    if (key === '401kTrad') {
                        labelKey = 'label_401k_traditional';
                    } else if (key === '401kRoth') {
                        labelKey = 'label_401k_roth';
                    } else if (key === 'casdi') {
                        labelKey = 'label_ca_sdi';
                    } else if (key === 'spp') {
                        labelKey = 'label_spp';
                    } else if (key === 'adnd') {
                        labelKey = 'label_adnd';
                    } else if (key === 'ltd') {
                        labelKey = 'label_ltd';
                    } else {
                        // 일반적인 경우: key를 snake_case로 변환하여 label_ 접두사 붙임
                        labelKey = `label_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`;
                    }
                    labels.push(translations[data.currentLanguage][labelKey] || key);
                    chartValues.push(value);
                    backgroundColors.push(colors[currentColorIndex % colors.length]);
                    currentColorIndex++;
                }
            }
        }

        // 사용자 정의 항목 처리
        dataSection.custom.forEach(item => {
            // 사용자 정의 항목의 값은 이미 월별로 저장되어 있다고 가정하거나,
            // renderCustomList에서 frequency를 고려하여 월별로 변환된 값이 입력 필드에 반영되어야 합니다.
            // 여기서는 data.expenses.custom에 저장된 값이 월별이라고 가정하고, chartValues.push(item.value)로 처리합니다.
            // 만약 custom item이 입력 시 주기에 따라 월별로 변환되어 data에 저장되지 않는다면,
            // getTotalMonthly와 동일하게 convertToMonthly를 적용해야 합니다.
            // 현재 getTotalMonthly에서 이미 custom item의 frequency를 처리하므로, 여기서는 단순히 item.value를 사용합니다.
            const itemValueInMonthly = convertToMonthly(item.value, item.frequency || data.defaultItemFrequency);
            if (itemValueInMonthly > 0 || !excludeZero) {
                labels.push(item.name);
                chartValues.push(itemValueInMonthly);
                backgroundColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        });

        if (chartValues.every(val => val === 0)) { // 모든 값이 0이면 차트 숨김
            chartInstance.data.labels = [];
            chartInstance.data.datasets[0].data = [];
            chartInstance.data.datasets[0].backgroundColor = [];
        } else {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = chartValues;
            chartInstance.data.datasets[0].backgroundColor = backgroundColors;
        }

        if (chartInstance.options.plugins.legend.labels) {
            chartInstance.options.plugins.legend.labels.color = data.isDarkMode ? '#fff' : '#333';
        }
        chartInstance.update();
    };

    updateChartData(taxChartInstance, data.taxes, translations[data.currentLanguage].section_taxes_title);
    updateChartData(preTaxDeductChartInstance, data.preTaxDeductions, translations[data.currentLanguage].section_pre_tax_title);
    updateChartData(postTaxDeductChartInstance, data.postTaxDeductions, translations[data.currentLanguage].section_post_tax_title);
    updateChartData(expensesChartInstance, data.expenses, translations[data.currentLanguage].section_expenses_title);

    // Update budget distribution chart (Doughnut chart)
    if (budgetDistributionChartInstance) {
        const budgetLabels = [
            translations[data.currentLanguage].label_total_taxes,
            translations[data.currentLanguage].label_total_pre_tax,
            translations[data.currentLanguage].label_total_post_tax,
            translations[data.currentLanguage].label_total_expenses,
            translations[data.currentLanguage].label_remaining_budget
        ];

        const budgetData = [
            totalTaxes,
            totalPreTaxDeductions,
            totalPostTaxDeductions,
            totalExpenses,
            remainingBudget
        ];

        const filteredBudgetLabels = [];
        const filteredBudgetData = [];
        const filteredBudgetColors = [];
        let currentColorIndex = 0;

        for (let i = 0; i < budgetData.length; i++) {
            // 남은 예산은 음수일 수 있으므로 0보다 작은 경우에도 포함
            if (budgetData[i] !== 0) { // 0이 아닌 값만 차트에 포함
                filteredBudgetLabels.push(budgetLabels[i]);
                filteredBudgetData.push(Math.abs(budgetData[i])); // 차트 표시는 절대값으로
                filteredBudgetColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        }
        
        // 모든 값이 0인 경우를 대비하여 빈 차트 설정
        if (filteredBudgetData.length === 0 && budgetDistributionChartInstance) {
            budgetDistributionChartInstance.data.labels = [];
            budgetDistributionChartInstance.data.datasets[0].data = [];
            budgetDistributionChartInstance.data.datasets[0].backgroundColor = [];
        } else if (budgetDistributionChartInstance) {
            budgetDistributionChartInstance.data.labels = filteredBudgetLabels;
            budgetDistributionChartInstance.data.datasets[0].data = filteredBudgetData;
            budgetDistributionChartInstance.data.datasets[0].backgroundColor = filteredBudgetColors;
        }

        if (budgetDistributionChartInstance.options.plugins.legend.labels) {
            budgetDistributionChartInstance.options.plugins.legend.labels.color = data.isDarkMode ? '#fff' : '#333';
        }
        budgetDistributionChartInstance.update();
    }
}

// 9. 디스플레이 업데이트 (계산 및 UI 갱신)
function updateDisplay() {
    // 모든 입력 필드의 현재 값을 data 객체에 반영 (saveData에서 저장 로직과 중복될 수 있으나,
    // input 이벤트에서 바로 UI를 업데이트하기 위해 여기서도 값을 반영)
    if (grossSalaryInput) data.salary.gross = parseFloat(grossSalaryInput.value) || 0;
    if (salaryFrequencySelect) data.salary.frequency = salaryFrequencySelect.value;
    if (defaultItemFrequencySelect) data.defaultItemFrequency = defaultItemFrequencySelect.value;
    if (budgetRuleSelect) data.budgetRule = budgetRuleSelect.value;

    for (const key in taxInputs) {
        if (taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    }
    // DOM 키와 data 객체 키 매핑 (401k, IRA, HSA, Health/Life Insurance 등)
    if (preTaxDeductInputs.medical) data.preTaxDeductions.medical = parseFloat(preTaxDeductInputs.medical.value) || 0;
    if (preTaxDeductInputs.dental) data.preTaxDeductions.dental = parseFloat(preTaxDeductInputs.dental.value) || 0;
    if (preTaxDeductInputs.vision) data.preTaxDeductions.vision = parseFloat(preTaxDeductInputs.vision.value) || 0;
    if (preTaxDeductInputs.fourZeroOneKTrad) data.preTaxDeductions['401kTrad'] = parseFloat(preTaxDeductInputs.fourZeroOneKTrad.value) || 0;
    if (preTaxDeductInputs.traditionalIRA) data.preTaxDeductions.traditionalIRA = parseFloat(preTaxDeductInputs.traditionalIRA.value) || 0;
    if (preTaxDeductInputs.hsa) data.preTaxDeductions.hsa = parseFloat(preTaxDeductInputs.hsa.value) || 0;

    if (postTaxDeductInputs.spp) data.postTaxDeductions.spp = parseFloat(postTaxDeductInputs.spp.value) || 0;
    if (postTaxDeductInputs.adnd) data.postTaxDeductions.adnd = parseFloat(postTaxDeductInputs.adnd.value) || 0;
    if (postTaxDeductInputs.fourZeroOneKRoth) data.postTaxDeductions['401kRoth'] = parseFloat(postTaxDeductInputs.fourZeroOneKRoth.value) || 0;
    if (postTaxDeductInputs.ltd) data.postTaxDeductions.ltd = parseFloat(postTaxDeductInputs.ltd.value) || 0;
    if (postTaxDeductInputs.rothIRA) data.postTaxDeductions.rothIRA = parseFloat(postTaxDeductInputs.rothIRA.value) || 0;
    if (postTaxDeductInputs.healthInsurance) data.postTaxDeductions.healthInsurance = parseFloat(postTaxDeductInputs.healthInsurance.value) || 0;
    if (postTaxDeductInputs.lifeInsurance) data.postTaxDeductions.lifeInsurance = parseFloat(postTaxDeductInputs.lifeInsurance.value) || 0;

    for (const key in expenseInputs) {
        if (expenseInputs[key]) data.expenses[key] = parseFloat(expenseInputs[key].value) || 0;
    }

    let monthlyGrossSalaryForCalculation = convertToMonthly(data.salary.gross, data.salary.frequency);

    if (annualSalarySummaryDisplay) annualSalarySummaryDisplay.textContent = formatCurrency(monthlyGrossSalaryForCalculation * 12);
    if (grossSalarySummaryDisplay) grossSalarySummaryDisplay.textContent = formatCurrency(monthlyGrossSalaryForCalculation);

    renderCustomList(customTaxList, data.taxes.custom, 'tax');
    renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
    renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
    renderCustomList(customExpenseList, data.expenses.custom, 'expense');

    const totalTaxes = getTotalMonthly(data.taxes);
    const totalPreTaxDeductions = getTotalMonthly(data.preTaxDeductions);
    const totalPostTaxDeductions = getTotalMonthly(data.postTaxDeductions);
    const totalExpenses = getTotalMonthly(data.expenses);

    const netSalary = monthlyGrossSalaryForCalculation - totalTaxes - totalPreTaxDeductions - totalPostTaxDeductions;
    const remainingBudget = netSalary - totalExpenses;

    if (totalTaxesDisplay) totalTaxesDisplay.textContent = formatCurrency(totalTaxes);
    if (totalPreTaxDisplay) totalPreTaxDisplay.textContent = formatCurrency(totalPreTaxDeductions);
    if (totalPostTaxDisplay) totalPostTaxDisplay.textContent = formatCurrency(totalPostTaxDeductions);
    if (netSalaryDisplay) netSalaryDisplay.textContent = formatCurrency(netSalary);
    if (totalExpensesDisplay) totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
    if (remainingBudgetDisplay) remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);

    applyBudgetRule(netSalary, totalExpenses, totalTaxes, totalPreTaxDeductions, totalPostTaxDeductions);

    updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions);

    saveData();
}

// 10. 예산 규칙 정의
const BUDGET_RULES = {
    "50-30-20": { needs: 0.5, wants: 0.3, savings: 0.2 },
    "70-20-10": { needs: 0.7, wants: 0.2, savings: 0.1 },
    "80-20": { needs: 0.8, wants: 0.0, savings: 0.2 }
};

// 11. 예산 규칙 적용 함수
function applyBudgetRule(netSalary, totalExpenses, totalTaxes, totalPreTaxDeductions, totalPostTaxDeductions) {
    if (!ruleNeedsDisplay || !ruleWantsDisplay || !ruleSavingsDisplay || !ruleTotalDisplay ||
        !actualNeedsDisplay || !actualWantsDisplay || !actualSavingsDisplay || !actualTotalDisplay || !budgetStatusDisplay) {
        console.warn("One or more budget rule display elements are missing from the DOM.");
        return;
    }

    const selectedRule = data.budgetRule;
    const rule = BUDGET_RULES[selectedRule];

    if (!rule) {
        ruleNeedsDisplay.textContent = formatCurrency(0);
        ruleWantsDisplay.textContent = formatCurrency(0);
        ruleSavingsDisplay.textContent = formatCurrency(0);
        ruleTotalDisplay.textContent = formatCurrency(0);
        actualNeedsDisplay.textContent = formatCurrency(0);
        actualWantsDisplay.textContent = formatCurrency(0);
        actualSavingsDisplay.textContent = formatCurrency(0);
        actualTotalDisplay.textContent = formatCurrency(0);
        budgetStatusDisplay.textContent = "";
        return;
    }

    // 1. Calculate budget based on the rule (based on net salary)
    const ruleNeeds = netSalary * rule.needs;
    const ruleWants = netSalary * rule.wants;
    const ruleSavings = netSalary * rule.savings;
    const ruleTotal = ruleNeeds + ruleWants + ruleSavings;

    ruleNeedsDisplay.textContent = formatCurrency(ruleNeeds);
    ruleWantsDisplay.textContent = formatCurrency(ruleWants);
    ruleSavingsDisplay.textContent = formatCurrency(ruleSavings);
    ruleTotalDisplay.textContent = formatCurrency(ruleTotal);

    // 2. Calculate actual spending based on user inputs
    let actualNeeds = 0;
    let actualWants = 0;
    let actualSavingsFromDeductions = 0; // Explicit savings from deductions (e.g., 401k)

    // 고정 지출 항목들에서 needs와 wants 분류 (data.expenses에서 값 가져오기)
    actualNeeds += data.expenses.rent || 0;
    actualNeeds += data.expenses.utilities || 0;
    actualNeeds += data.expenses.internet || 0;
    actualNeeds += data.expenses.phone || 0;
    actualNeeds += data.expenses.groceries || 0;
    actualNeeds += data.expenses.transport || 0;
    actualNeeds += data.expenses.health || 0;

    actualWants += data.expenses.dining || 0;
    actualWants += data.expenses.shopping || 0;
    actualWants += data.expenses.entertainment || 0;

    // 사용자 정의 지출 항목들에서 'category' 기반 분류
    data.expenses.custom.forEach(item => {
        const monthlyAmount = convertToMonthly(item.value, item.frequency || data.defaultItemFrequency);
        if (item.category === 'needs') {
            actualNeeds += monthlyAmount;
        } else if (item.category === 'wants') {
            actualWants += monthlyAmount;
        } else {
            actualNeeds += monthlyAmount; // Default to needs if category is missing
        }
    });

    // Explicitly add 401kTrad, 401kRoth, Traditional IRA, Roth IRA, HSA to savings if desired
    // This depends on how "savings" is defined for the budget rule.
    // For this example, let's assume 401k/IRA/HSA are part of "savings"
    actualSavingsFromDeductions += (data.preTaxDeductions['401kTrad'] || 0);
    actualSavingsFromDeductions += (data.preTaxDeductions['traditionalIRA'] || 0);
    actualSavingsFromDeductions += (data.preTaxDeductions['hsa'] || 0);
    actualSavingsFromDeductions += (data.postTaxDeductions['401kRoth'] || 0);
    actualSavingsFromDeductions += (data.postTaxDeductions['rothIRA'] || 0);
    
    // Actual Savings: Net salary minus needs and wants, plus explicit savings from deductions
    const actualSavings = netSalary - actualNeeds - actualWants; // This is remaining AFTER needs/wants
    // If you want to strictly define "savings" as what's left AND what's explicitly saved:
    const finalActualSavings = actualSavings + actualSavingsFromDeductions;


    actualNeedsDisplay.textContent = formatCurrency(actualNeeds);
    actualWantsDisplay.textContent = formatCurrency(actualWants);
    actualSavingsDisplay.textContent = formatCurrency(finalActualSavings); // Display final combined savings

    actualTotalDisplay.textContent = formatCurrency(actualNeeds + actualWants + finalActualSavings);

    // 3. Evaluate budget status
    let statusText = "";
    let statusColor = "var(--summary-text-color)"; // Default color for 'On Track'

    // Check Needs
    if (actualNeeds > ruleNeeds) {
        statusText += `${translations[data.currentLanguage].needs_label} ${translations[data.currentLanguage].status_over}. `;
        statusColor = "var(--danger-color)";
    }

    // Check Wants (only if the rule has a Wants component)
    if (rule.wants > 0 && actualWants > ruleWants) {
        statusText += `${translations[data.currentLanguage].wants_label} ${translations[data.currentLanguage].status_over}. `;
        statusColor = "var(--danger-color)"; // Wants being over sets danger
    }

    // Check Savings (if actual savings are less than what the rule recommends)
    // Here we compare the total "savings bucket" (explicit savings + remaining income) against the rule's savings target
    if (finalActualSavings < ruleSavings) {
        statusText += `${translations[data.currentLanguage].savings_label} ${translations[data.currentLanguage].status_under}. `;
        if (statusColor !== "var(--danger-color)") { // Don't override danger with warning, but warning is less severe
            statusColor = "var(--warning-color)";
        }
    }

    // Overall deficit check
    if (netSalary - (actualNeeds + actualWants + actualSavingsFromDeductions) < 0) { // If overall spending + explicit savings exceeds net income
        statusText = translations[data.currentLanguage].status_over + " (" + translations[data.currentLanguage].label_deficit + ")";
        statusColor = "var(--danger-color)";
    } else if (statusText.trim() === "") { // If no specific over/under issues, then it's on track
        statusText = translations[data.currentLanguage].status_ok;
        statusColor = "var(--summary-text-color)";
    } else { // If there were some issues (e.g., savings under), but not an overall deficit, keep the warning or danger
        if (statusColor !== "var(--danger-color)") {
            statusColor = "var(--warning-color)";
        }
    }

    budgetStatusDisplay.textContent = statusText;
    budgetStatusDisplay.style.color = statusColor;
}

// 12. 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    customTaxList = document.getElementById('custom-tax-list');
    customPreTaxDeductList = document.getElementById('custom-pre-tax-deduct-list');
    customPostTaxDeductList = document.getElementById('custom-post-tax-deduct-list');
    customExpenseList = document.getElementById('custom-expense-list');
    
    loadData(); // DOM 로드 후 저장된 데이터 로드
    initializeCharts(); // 차트 초기화 (데이터 로드 후)
    // updateDisplay()는 loadData() 내부에서 이미 호출되므로 중복 호출 제거.

    // 급여 양식 입력 변경 시
    if (grossSalaryInput) {
        grossSalaryInput.addEventListener('input', updateDisplay);
    }
    if (salaryFrequencySelect) {
        salaryFrequencySelect.addEventListener('change', (e) => {
            data.salary.frequency = e.target.value;
            updateDisplay();
        });
    }

    // 기본 항목 주기 변경 시
    if (defaultItemFrequencySelect) {
        defaultItemFrequencySelect.addEventListener('change', (e) => {
            data.defaultItemFrequency = e.target.value;
            updateDisplay();
            saveData();
        });
    }

    // 고정 입력 필드 변경 시 (data 객체에 직접 반영)
    const allInputGroups = [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs];
    allInputGroups.forEach(group => {
        for (const key in group) {
            // key가 undefined일 수 있으므로 null check
            if (group[key]) {
                group[key].addEventListener('input', () => {
                    updateDisplay(); // input 이벤트 발생 시 바로 display 업데이트 (saveData는 updateDisplay에서 처리)
                });
            }
        }
    });

    // 커스텀 항목 추가 버튼
    document.querySelectorAll('.add-custom-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            addCustomItem(type);
        });
    });

    // Custom Item Delete Buttons (Event Delegation)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-custom-btn') || e.target.closest('.delete-custom-btn')) {
            const btn = e.target.closest('.delete-custom-btn');
            const itemDiv = btn.closest('.custom-item');
            const type = itemDiv.dataset.itemType;
            const itemId = itemDiv.dataset.itemId;
            deleteCustomItem(type, itemId);
        }
    });

    // Custom Item Edit Buttons (Event Delegation)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-custom-btn') || e.target.closest('.edit-custom-btn')) {
            const btn = e.target.closest('.edit-custom-btn');
            const itemDiv = btn.closest('.custom-item');
            const type = itemDiv.dataset.itemType;
            const itemId = itemDiv.dataset.itemId;
            toggleEditMode(btn, type, itemId);
        }
    });

    // Language Toggle
    if (languageToggleBtn) {
        languageToggleBtn.addEventListener('click', () => {
            const newLang = data.currentLanguage === 'ko' ? 'en' : 'ko';
            applyLanguage(newLang);
            saveData();
        });
    }

    // Dark Mode Toggle
    if (darkmodeToggleBtn) {
        darkmodeToggleBtn.addEventListener('click', () => {
            applyDarkMode(!data.isDarkMode);
            saveData();
        });
    }

    // Data Management: Export JSON
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            saveData(); // Ensure data object is up-to-date before export
            const jsonData = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'budget_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert(translations[data.currentLanguage].alert_json_export_success);
        });
    }

    // Data Management: Import JSON
    if (importJsonBtn && importJsonInput) {
        importJsonBtn.addEventListener('click', () => {
            importJsonInput.click();
        });

        importJsonInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        // 기본적인 유효성 검사: salary.gross와 taxes 속성이 있는지 확인
                        if (importedData && typeof importedData.salary?.gross !== 'undefined' && importedData.taxes) {
                            localStorage.setItem('budgetAppData', JSON.stringify(importedData));
                            loadData(); // This will also call updateDisplay()
                            alert(translations[data.currentLanguage].alert_data_import_success);
                        } else {
                            alert(translations[data.currentLanguage].alert_invalid_json);
                        }
                    } catch (error) {
                        alert(translations[data.currentLanguage].alert_json_parse_error + error.message);
                        console.error('Error parsing JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Data Management: Clear All Data
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', () => {
            if (confirm(translations[data.currentLanguage].confirm_clear_data)) {
                localStorage.removeItem('budgetAppData');

                // data 객체를 초기 상태로 되돌립니다.
                data = {
                    salary: {
                        gross: 0,
                        frequency: 'monthly'
                    },
                    taxes: {
                        federal: 0,
                        state: 0,
                        oasdi: 0,
                        medicare: 0,
                        casdi: 0,
                        custom: []
                    },
                    preTaxDeductions: {
                        medical: 0,
                        dental: 0,
                        vision: 0,
                        '401kTrad': 0,
                        traditionalIRA: 0,
                        hsa: 0,
                        custom: []
                    },
                    postTaxDeductions: {
                        spp: 0,
                        adnd: 0,
                        '401kRoth': 0,
                        ltd: 0,
                        rothIRA: 0,
                        healthInsurance: 0,
                        lifeInsurance: 0,
                        custom: []
                    },
                    expenses: {
                        rent: 0, utilities: 0, internet: 0, phone: 0, groceries: 0, dining: 0, transport: 0,
                        shopping: 0, health: 0, entertainment: 0, custom: []
                    },
                    defaultItemFrequency: 'monthly',
                    budgetRule: '50-30-20',
                    currentLanguage: 'ko',
                    isDarkMode: false
                };

                // DOM 요소도 초기값으로 재설정 (data 객체와 동기화)
                if (grossSalaryInput) grossSalaryInput.value = data.salary.gross;
                if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
                if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;
                if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

                [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs].forEach(inputsGroup => {
                    for (const key in inputsGroup) {
                        if (inputsGroup[key]) inputsGroup[key].value = 0;
                    }
                });

                if (customTaxList) customTaxList.innerHTML = '';
                if (customPreTaxDeductList) customPreTaxDeductList.innerHTML = '';
                if (customPostTaxDeductList) customPostTaxDeductList.innerHTML = '';
                if (customExpenseList) customExpenseList.innerHTML = '';

                applyLanguage(data.currentLanguage); // 기본 언어 다시 적용
                applyDarkMode(data.isDarkMode); // 기본 다크모드 다시 적용

                updateDisplay();
                alert(translations[data.currentLanguage].alert_data_cleared);
            }
        });
    }

    // AI Report Generation (Placeholder)
    if (aiReportBtn && aiReportBox) {
        aiReportBtn.addEventListener('click', () => {
            aiReportBox.innerHTML = `<p>${translations[data.currentLanguage].ai_report_placeholder}</p>`;
        });
    }

    // Budget Rule Select Listener
    if (budgetRuleSelect) {
        budgetRuleSelect.addEventListener("change", () => {
            data.budgetRule = budgetRuleSelect.value;
            updateDisplay();
        });
    }
});
