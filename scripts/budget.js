// budget.js

// 1. 전역 변수 및 DOM 요소 캐싱 (기존과 동일하거나 일부 수정)
const grossSalaryInput = document.getElementById('salary-gross');
const salaryFrequencySelect = document.getElementById('salary-frequency-select');
const annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');

const defaultItemFrequencySelect = document.getElementById('default-item-frequency-select');

// 세금 입력 필드
const taxInputs = {
    federal: document.getElementById('tax-federal-1'),
    state: document.getElementById('tax-state-1'),
    oasdi: document.getElementById('tax-oasdi-1'),
    medicare: document.getElementById('tax-medicare-1'),
    casdi: document.getElementById('tax-casdi-1')
};

// 세전 공제 입력 필드
const preTaxDeductInputs = {
    medical: document.getElementById('deduct-medical-1'),
    dental: document.getElementById('deduct-dental-1'),
    vision: document.getElementById('deduct-vision-1'),
    fourZeroOneKTrad: document.getElementById('deduct-401k-trad-1')
};

// 세후 공제 입력 필드
const postTaxDeductInputs = {
    spp: document.getElementById('deduct-spp-1'),
    adnd: document.getElementById('deduct-adnd-1'),
    fourZeroOneKRoth: document.getElementById('deduct-401k-roth-1'),
    ltd: document.getElementById('deduct-ltd-1')
};

// 지출 입력 필드
const expenseInputs = {
    rent: document.getElementById('exp-rent-1'),
    utilities: document.getElementById('exp-utilities-1'),
    internet: document.getElementById('exp-internet-1'),
    phone: document.getElementById('exp-phone-1'),
    groceries: document.getElementById('exp-groceries-1'),
    dining: document.getElementById('exp-dining-1'),
    transport: document.getElementById('exp-transport-1'),
    shopping: document.getElementById('exp-shopping-1'),
    health: document.getElementById('exp-health-1'),
    entertainment: document.getElementById('exp-entertainment-1')
};

// 요약 디스플레이 요소
const grossSalarySummaryDisplay = document.getElementById('gross-salary-summary-display');
const totalTaxesDisplay = document.getElementById('total-taxes-display');
const totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
const totalPostTaxDisplay = document.getElementById('total-post-tax-display');
const netSalaryDisplay = document.getElementById('net-salary-display');
const totalExpensesDisplay = document.getElementById('total-expenses-display');
const remainingBudgetDisplay = document.getElementById('remaining-budget-display');

// 커스텀 항목 목록 컨테이너 (이전과 동일)
const customTaxList = document.getElementById('tax-custom-list');
const customPreTaxDeductList = document.getElementById('pre-tax-custom-list');
const customPostTaxDeductList = document.getElementById('post-tax-custom-list');
const customExpenseList = document.getElementById('expenses-custom-list');

// 헤더 컨트롤
const languageToggleBtn = document.getElementById('language-toggle');
const darkmodeToggleBtn = document.getElementById('darkmode-toggle');

// 데이터 관리 버튼/입력
const exportJsonBtn = document.getElementById('export-json-btn');
const importJsonBtn = document.getElementById('import-json-btn');
const importJsonInput = document.getElementById('import-json-input');
const clearAllDataBtn = document.getElementById('clear-all-data-btn');

// AI 보고서 요소
const aiReportBtn = document.getElementById('ai-report-btn');
const aiReportBox = document.getElementById('ai-report-box');

// 예산 규칙 요소
const budgetRuleSelect = document.getElementById('budget-rule-select');
const ruleNeedsDisplay = document.getElementById('rule-needs');
const ruleWantsDisplay = document.getElementById('rule-wants');
const ruleSavingsDisplay = document.getElementById('rule-savings');
const ruleTotalDisplay = document.getElementById('rule-total');
const actualNeedsDisplay = document.getElementById('actual-needs');
const actualWantsDisplay = document.getElementById('actual-wants');
const actualSavingsDisplay = document.getElementById('actual-savings');
const actualTotalDisplay = document.getElementById('actual-total');
const budgetStatusDisplay = document.getElementById('budget-status');


// 2. 전역 상태 변수 (data 객체로 통합 및 구조 변경)
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
        custom: [] // [{id: 't-1', name: 'Other Tax', value: 0}]
    },
    preTaxDeductions: {
        medical: 0,
        dental: 0,
        vision: 0,
        '401kTrad': 0, // '401kTrad'로 키 이름 통일
        custom: [] // [{id: 'ptd-1', name: 'HSA', value: 0}]
    },
    postTaxDeductions: {
        spp: 0,
        adnd: 0,
        '401kRoth': 0, // '401kRoth'로 키 이름 통일
        ltd: 0,
        custom: [] // [{id: 'potd-1', name: 'Life Insurance', value: 0}]
    },
    expenses: {
        rent: 0,
        utilities: 0,
        internet: 0,
        phone: 0,
        groceries: 0,
        dining: 0,
        transport: 0,
        shopping: 0,
        health: 0,
        entertainment: 0,
        custom: [] // [{id: 'e-1', name: 'Gym Membership', value: 0, category: 'needs/wants'}]
    },
    defaultItemFrequency: 'monthly',
    budgetRule: '50-30-20', // 초기 규칙 설정
    currentLanguage: 'ko', // 언어 설정도 data 객체 안으로
    isDarkMode: false // 다크 모드 설정도 data 객체 안으로
};

// 기존의 개별 전역 배열 변수들은 이제 필요 없으므로 제거합니다.
// let currentSalaryFrequency = 'monthly';
// let defaultItemFrequency = 'monthly';
// let currentLanguage = 'ko';
// let isDarkMode = false;
// let customTaxes = [];
// let customPreTaxDeductions = [];
// let customPostTaxDeductions = [];
// let customExpenses = [];

// Chart.js 인스턴스 (이 부분은 유지합니다.)
let taxChartInstance;
let preTaxDeductChartInstance;
let postTaxDeductChartInstance;
let expensesChartInstance;
let budgetDistributionChartInstance;


// 3. 번역 객체 (기존과 동일)
const translations = {
    en: {
        app_title: "Budget Management Tool",
        section_salary_title: "Monthly Gross Salary",
        label_gross_salary: "Gross Salary",
        frequency_monthly: "Monthly",
        frequency_annually: "Annually",
        frequency_weekly: "Weekly",
        frequency_bi_weekly: "Bi-Weekly",
        btn_save: "Save",
        label_annual_salary: "Annual Gross Salary:",
        section_default_frequency_title: "Default Item Frequency Setting",
        label_default_item_frequency: "Default Expense/Deduction Frequency:",
        section_taxes_title: "Taxes",
        label_federal_withholding: "Federal Withholding",
        label_state_tax: "State Tax",
        label_oasdi: "OASDI",
        label_medicare: "Medicare",
        label_ca_sdi: "CA SDI",
        btn_add_item: "Add Item", // 일관성을 위해 HTML의 data-i18n-key와 맞춤
        section_pre_tax_title: "Pre-Tax Deductions",
        label_medical_premium: "Medical Premium",
        label_dental_premium: "Dental Premium",
        label_vision_premium: "Vision Premium",
        label_401k_traditional: "401k Traditional",
        section_post_tax_title: "Post-Tax Deductions",
        label_spp: "Stock Purchase Plan",
        label_adnd: "AD&D",
        label_401k_roth: "401k Roth",
        label_ltd: "Long Term Disability",
        section_expenses_title: "Expense Management",
        label_rent_mortgage: "Rent/Mortgage",
        label_utilities: "Utilities",
        label_internet: "Internet",
        label_phone: "Phone Bill",
        label_groceries: "Groceries",
        label_dining_out: "Dining Out",
        label_transportation: "Transportation",
        label_shopping: "Shopping",
        label_health_wellness: "Health/Wellness",
        label_entertainment: "Entertainment",
        section_summary_title: "Budget Summary",
        section_budget_rule_title: "Budget Rule Application (Budget Rules)",
        label_budget_rule_select: "Select Budget Rule:",
        rule_50_30_20: "50/30/20 (Needs/Wants/Savings)",
        rule_70_20_10: "70/20/10 (Needs/Wants/Savings)",
        rule_80_20: "80/20 (Needs/Savings)",
        label_total_budget: "Total Budget",
        label_budget_status: "Budget Status",
        label_total_taxes: "Total Taxes:",
        label_total_pre_tax: "Total Pre-Tax Deductions:",
        label_total_post_tax: "Total Post-Tax Deductions:",
        label_net_salary: "Net Monthly Salary:",
        label_total_expenses: "Total Expenses:",
        label_remaining_budget: "Remaining Budget:",
        section_ai_title: "AI Expense Report",
        btn_ai_report: "Generate AI Report",
        ai_report_placeholder: "Click 'Generate AI Report' to get insights into your spending habits.",
        section_data_title: "Data Management",
        btn_export: "Export JSON",
        btn_import: "Import JSON",
        btn_clear_all_data: "Clear All Data",
        remove_item: "Are you sure you want to remove this item",
        add_item_title: "Add Custom Item",
        item_name_placeholder: "Item Name",
        item_amount_placeholder: "Amount",
        item_category_label: "Category (for expenses)",
        category_needs: "Needs",
        category_wants: "Wants",
        alert_json_export_success: "Budget data successfully exported!",
        alert_invalid_json: "Invalid JSON file format.",
        alert_json_parse_error: "Error parsing JSON file: ",
        alert_data_import_success: "Data successfully imported!",
        confirm_clear_data: "Are you sure you want to clear all saved data? This action cannot be undone.",
        alert_data_cleared: "All data has been cleared.",
        // Budget Rule Specific
        needs_label: "Needs",
        wants_label: "Wants",
        savings_label: "Savings",
        status_over: "Over Budget",
        status_under: "Under Budget",
        status_ok: "On Track",
        label_deficit: "Deficit",
        label_rule: "Rule",
        label_actual: "Actual",
        label_total: "Total" // Added for budget rule section
    },
    ko: {
        app_title: "예산 관리 도구",
        section_salary_title: "월별 총 급여",
        label_gross_salary: "총 급여",
        frequency_monthly: "월별",
        frequency_annually: "연간",
        frequency_weekly: "주별",
        frequency_bi_weekly: "2주별",
        btn_save: "저장",
        label_annual_salary: "연간 총 급여:",
        section_default_frequency_title: "기본 항목 주기 설정",
        label_default_item_frequency: "기본 지출/공제 주기:",
        section_taxes_title: "세금",
        label_federal_withholding: "연방 원천징수",
        label_state_tax: "주 세금",
        label_oasdi: "OASDI",
        label_medicare: "메디케어",
        label_ca_sdi: "CA SDI",
        btn_add_item: "항목 추가", // 일관성을 위해 HTML의 data-i18n-key와 맞춤
        section_pre_tax_title: "세전 공제",
        label_medical_premium: "의료 보험료",
        label_dental_premium: "치과 보험료",
        label_vision_premium: "시력 보험료",
        label_401k_traditional: "401k 일반",
        section_post_tax_title: "세후 공제",
        label_spp: "주식 구매 계획",
        label_adnd: "AD&D",
        label_401k_roth: "401k Roth",
        label_ltd: "장기 장애",
        section_expenses_title: "지출 관리",
        label_rent_mortgage: "월세/주택담보대출",
        label_utilities: "공과금",
        label_internet: "인터넷",
        label_phone: "휴대폰 요금",
        label_groceries: "식료품",
        label_dining_out: "외식",
        label_transportation: "교통비",
        label_shopping: "쇼핑",
        label_health_wellness: "건강/웰빙",
        label_entertainment: "오락",
        section_summary_title: "예산 요약",
        section_budget_rule_title: "예산 규칙 적용 (Budget Rules)",
        label_budget_rule_select: "예산 규칙 선택:",
        rule_50_30_20: "50/30/20 (필수/원하는 것/저축)",
        rule_70_20_10: "70/20/10 (필수/원하는 것/저축)",
        rule_80_20: "80/20 (필수/저축)",
        label_total_budget: "총 예산",
        label_budget_status: "예산 상태",
        label_total_taxes: "총 세금:",
        label_total_pre_tax: "총 세전 공제액:",
        label_total_post_tax: "총 세후 공제액:",
        label_net_salary: "순 월 급여:",
        label_total_expenses: "총 지출:",
        label_remaining_budget: "남은 예산:",
        section_ai_title: "AI 지출 보고서",
        btn_ai_report: "AI 보고서 생성",
        ai_report_placeholder: "\"AI 보고서 생성\"을 클릭하여 지출 습관에 대한 통찰력을 얻으세요.",
        section_data_title: "데이터 관리",
        btn_export: "JSON 내보내기",
        btn_import: "JSON 가져오기",
        btn_clear_all_data: "모든 데이터 지우기",
        remove_item: "이 항목을 삭제하시겠습니까",
        add_item_title: "사용자 정의 항목 추가",
        item_name_placeholder: "항목 이름",
        item_amount_placeholder: "금액",
        item_category_label: "카테고리 (지출용)",
        category_needs: "필수",
        category_wants: "원하는 것",
        alert_json_export_success: "예산 데이터가 성공적으로 내보내졌습니다!",
        alert_invalid_json: "유효하지 않은 JSON 파일 형식입니다.",
        alert_json_parse_error: "JSON 파일을 구문 분석하는 중 오류가 발생했습니다: ",
        alert_data_import_success: "데이터가 성공적으로 가져와졌습니다!",
        confirm_clear_data: "모든 저장된 데이터를 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.",
        alert_data_cleared: "모든 데이터가 지워졌습니다.",
        // Budget Rule Specific
        needs_label: "필수 지출",
        wants_label: "원하는 지출",
        savings_label: "저축",
        status_over: "예산 초과",
        status_under: "예산 미달",
        status_ok: "양호",
        label_deficit: "적자",
        label_rule: "규칙",
        label_actual: "실제",
        label_total: "총계" // Added for budget rule section
    }
};

// 4. 유틸리티 함수

// 통화 형식 지정 (변경 없음)
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
 * 주어진 금액을 입력된 주기로부터 월별 기준으로 변환합니다. (변경 없음)
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
// 이 함수는 data 객체로부터 값을 직접 읽어옵니다.
function getTotalMonthly(sectionData, sectionKey) { // sectionData는 data.taxes, data.expenses 등입니다.
    let total = 0;
    // 고정 입력 필드 처리
    for (const key in sectionData) {
        if (key !== 'custom') { // 'custom' 배열은 따로 처리
            const value = parseFloat(sectionData[key]) || 0;
            // 고정 입력 필드는 이제 data 객체에 저장된 값입니다. 주기는 기본값을 사용합니다.
            // 필요하다면, 각 고정 항목별 주기를 data 객체에 추가하여 관리할 수 있습니다.
            // 현재는 defaultItemFrequency를 따르거나, 특정 항목은 고정 주기로 간주합니다.
            // 여기서는 모든 고정 항목이 'monthly'라고 가정하거나, data.defaultItemFrequency를 따릅니다.
            // HTML input 필드에 dataset.frequency가 있었다면, loadData에서 data 객체로 로드할 때 해당 정보를 data 객체에 저장해야 합니다.
            // 지금은 HTML에 직접 data-frequency가 없으므로, 여기서 월별로 간주하거나 defaultItemFrequency를 따릅니다.
            // 일단 'monthly'로 간주하고, 나중에 필요하면 data 객체에 frequency를 추가하는 방향으로 논의합니다.
            // 또는, 고정 입력 필드는 항상 월별 값을 받는다고 가정합니다.
            total += value;
        }
    }
    // 사용자 정의 항목 처리
    // 각 커스텀 항목은 이제 frequency 속성을 가집니다.
    sectionData.custom.forEach(item => {
        total += convertToMonthly(item.value, item.frequency || data.defaultItemFrequency); // item.value로 변경
    });
    return total;
}


// 사용자 정의 항목 렌더링 (이제 편집 가능한 형태로 렌더링)
// 이 함수는 DOM을 업데이트하는 역할만 합니다. 실제 데이터는 data 객체에서 관리됩니다.
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

        // item.name과 item.value를 초기값으로 설정
        itemDiv.innerHTML = `
            <label for="${item.id}-name-input" class="custom-item-label" style="display: block;">${item.name || translations[data.currentLanguage].label_new_item}</label>
            <div class="input-container custom-input-container">
                <input type="text" id="${item.id}-name-input" class="form-control custom-item-name-input" value="${item.name}" placeholder="${translations[data.currentLanguage].item_name_placeholder}" readonly style="display: none;">
                <input type="number" id="${item.id}-value-input" class="form-control custom-item-value-input" min="0" value="${item.value}" oninput="updateCustomItem('${type}', '${item.id}', 'value', this.value)" readonly>
                <select id="${item.id}-frequency-select" class="form-control custom-item-frequency-select" onchange="updateCustomItem('${type}', '${item.id}', 'frequency', this.value)" ${item.id.startsWith('e-') ? '' : 'style="display: none;"'} disabled>
                    <option value="monthly" ${item.frequency === 'monthly' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_monthly}</option>
                    <option value="annually" ${item.frequency === 'annually' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_annually}</option>
                    <option value="weekly" ${item.frequency === 'weekly' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_weekly}</option>
                    <option value="bi-weekly" ${item.frequency === 'bi-weekly' ? 'selected' : ''}>${translations[data.currentLanguage].frequency_bi_weekly}</option>
                </select>
                ${type === 'expense' ? `
                <select id="${item.id}-category-select" class="form-control custom-item-category-select" onchange="updateCustomItem('${type}', '${item.id}', 'category', this.value)" disabled>
                    <option value="needs" ${item.category === 'needs' ? 'selected' : ''}>${translations[data.currentLanguage].category_needs}</option>
                    <option value="wants" ${item.category === 'wants' ? 'selected' : ''}>${translations[data.currentLanguage].category_wants}</option>
                </select>` : ''}
                <button class="icon-btn edit-custom-btn" onclick="toggleEditMode(this, '${type}', '${item.id}')" title="${translations[data.currentLanguage].btn_edit_item}"><i class="ri-pencil-line"></i></button>
                <button class="icon-btn delete-custom-btn" onclick="deleteCustomItem('${type}', '${item.id}')" title="${translations[data.currentLanguage].remove_item}"><i class="ri-close-line"></i></button>
            </div>
        `;
        listElement.appendChild(itemDiv);

        // 새 항목의 입력 필드에 이벤트 리스너 추가 (이름 입력 필드가 보이지 않을 때도 데이터는 업데이트되어야 함)
        const nameInput = itemDiv.querySelector(`#${item.id}-name-input`);
        nameInput.addEventListener('input', (event) => {
            updateCustomItem(type, item.id, 'name', event.target.value);
            itemDiv.querySelector('.custom-item-label').textContent = event.target.value || translations[data.currentLanguage].label_new_item;
        });

        // 초기 상태에서 레이블은 보이고, 이름 입력 필드는 숨김
        const labelElement = itemDiv.querySelector('.custom-item-label');
        if (item.name) {
            labelElement.textContent = item.name;
            labelElement.style.display = 'block';
            nameInput.style.display = 'none';
        } else {
            labelElement.textContent = translations[data.currentLanguage].label_new_item;
            labelElement.style.display = 'block';
            nameInput.style.display = 'none';
        }
    });
}


// 사용자 정의 항목 추가 (data 객체에 맞춰 수정)
function addCustomItem(type) {
    const itemName = translations[data.currentLanguage].label_new_item; // 기본 이름
    const itemAmount = 0; // 기본 금액
    const itemId = `${type}-${Date.now()}`; // 고유 ID 생성

    let targetArray;
    let itemCategory = '';
    if (type === 'tax') targetArray = data.taxes.custom;
    else if (type === 'pre-tax') targetArray = data.preTaxDeductions.custom;
    else if (type === 'post-tax') targetArray = data.postTaxDeductions.custom;
    else if (type === 'expense') {
        targetArray = data.expenses.custom;
        itemCategory = 'needs'; // 지출의 경우 기본 카테고리
    } else {
        console.error("Unknown custom item type:", type);
        return;
    }

    const newItem = {
        id: itemId,
        name: itemName,
        value: itemAmount, // amount 대신 value로 통일
        frequency: data.defaultItemFrequency // 기본 주기는 defaultItemFrequency
    };

    if (type === 'expense') {
        newItem.category = itemCategory;
    }

    targetArray.push(newItem);
    updateDisplay(); // 항목 추가 후 화면 업데이트 및 재렌더링
    saveData(); // 데이터 저장
}


// 사용자 정의 항목 제거 (data 객체에 맞춰 수정)
function deleteCustomItem(type, itemId) {
    const confirmed = confirm(translations[data.currentLanguage].remove_item + "?");
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

    const initialLength = targetArray.length;
    targetArray = targetArray.filter(item => item.id !== itemId);

    // Filter 후 data 객체의 해당 배열을 업데이트합니다.
    if (type === 'tax') data.taxes.custom = targetArray;
    else if (type === 'pre-tax') data.preTaxDeductions.custom = targetArray;
    else if (type === 'post-tax') data.postTaxDeductions.custom = targetArray;
    else if (type === 'expense') data.expenses.custom = targetArray;

    updateDisplay(); // 항목 삭제 후 화면 업데이트
    saveData(); // 데이터 저장
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

    if (nameInput.readOnly) { // 현재 읽기 모드 -> 편집 모드로 전환
        nameInput.removeAttribute('readonly');
        valueInput.removeAttribute('readonly');
        if (frequencySelect) frequencySelect.removeAttribute('disabled');
        if (categorySelect) categorySelect.removeAttribute('disabled');

        nameInput.focus(); // 이름 입력 필드에 포커스
        icon.className = 'ri-check-line'; // 아이콘을 저장(체크)으로 변경
        button.title = translations[data.currentLanguage].btn_save_item_changes || "Save Changes"; // 툴팁 변경 (번역 추가 필요)
        label.style.display = 'none'; // 레이블 숨기기
        nameInput.style.display = 'block'; // 입력 필드 보이기
    } else { // 현재 편집 모드 -> 읽기 모드로 전환 (저장)
        nameInput.setAttribute('readonly', 'true');
        valueInput.setAttribute('readonly', 'true');
        if (frequencySelect) frequencySelect.setAttribute('disabled', 'true');
        if (categorySelect) categorySelect.setAttribute('disabled', 'true');

        icon.className = 'ri-pencil-line'; // 아이콘을 편집(연필)으로 변경
        button.title = translations[data.currentLanguage].btn_edit_item || "Edit Item"; // 툴팁 변경
        label.style.display = 'block'; // 레이블 보이기
        nameInput.style.display = 'none'; // 입력 필드 숨기기
        label.textContent = nameInput.value || translations[data.currentLanguage].label_new_item; // 레이블 업데이트
        updateDisplay(); // 변경된 값으로 화면 업데이트
        saveData(); // 변경사항 저장
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
        } else if (field === 'value') { // amount 대신 value로 통일
            itemToUpdate.value = parseFloat(newValue) || 0;
        } else if (field === 'frequency') {
            itemToUpdate.frequency = newValue;
        } else if (field === 'category') {
            itemToUpdate.category = newValue;
        }
    }
    updateDisplay(); // 데이터 변경 후 화면 업데이트 (저장은 toggleEditMode에서 일괄 처리)
}


// 5. 언어 적용 (data.currentLanguage 사용하도록 수정)
function applyLanguage(lang) {
    data.currentLanguage = lang; // 전역 변수 대신 data.currentLanguage 사용
    document.documentElement.lang = lang; // HTML lang 속성 변경

    // 모든 번역 가능한 요소 업데이트
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[data.currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[data.currentLanguage][key];
            } else if (element.tagName === 'OPTION') {
                // 옵션 텍스트는 해당 key가 translations에 있어야 함 (예: frequency_monthly)
                element.textContent = translations[data.currentLanguage][key];
            } else if (element.tagName === 'BUTTON' && element.classList.contains('edit-custom-btn')) {
                 // edit/save button title
                 // 이 부분은 toggleEditMode에서 처리하므로 여기서 변경할 필요가 없습니다.
            } else if (element.tagName === 'BUTTON' && element.classList.contains('delete-custom-btn')) {
                 // delete button title
                 element.title = translations[data.currentLanguage].remove_item;
            }
            else {
                element.textContent = translations[data.currentLanguage][key];
            }
        }
    });

    // 헤더 토글 버튼 텍스트 업데이트
    if (languageToggleBtn) {
        languageToggleBtn.textContent = data.currentLanguage === 'ko' ? 'EN' : 'KO';
    }

    // 예산 규칙 섹션 라벨 수동 업데이트 (data-i18n-key를 HTML에 추가하는 것을 강력히 권장)
    const needsLabelEl = document.querySelector('.rule-breakdown div:nth-child(1) p:nth-child(1)');
    if(needsLabelEl) needsLabelEl.textContent = translations[data.currentLanguage].needs_label + ':';
    const wantsLabelEl = document.querySelector('.rule-breakdown div:nth-child(2) p:nth-child(1)');
    if(wantsLabelEl) wantsLabelEl.textContent = translations[data.currentLanguage].wants_label + ':';
    const savingsLabelEl = document.querySelector('.rule-breakdown div:nth-child(3) p:nth-child(1)');
    if(savingsLabelEl) savingsLabelEl.textContent = translations[data.currentLanguage].savings_label + ':';
    const totalLabelEl = document.querySelector('.rule-breakdown div.total p:nth-child(1)');
    if(totalLabelEl) totalLabelEl.textContent = translations[data.currentLanguage].label_total + ':';

    // AI 보고서 플레이스홀더 텍스트 업데이트
    if (aiReportBox) {
        const aiReportPlaceholderP = aiReportBox.querySelector('p');
        if (aiReportPlaceholderP) {
            aiReportPlaceholderP.textContent = translations[data.currentLanguage].ai_report_placeholder;
        }
    }

    // confirm 메시지도 업데이트될 수 있도록 updateDisplay() 호출
    updateDisplay();
}

// 6. 다크 모드 적용 (data.isDarkMode 사용하도록 수정)
function applyDarkMode(enable) {
    data.isDarkMode = enable; // 전역 변수 대신 data.isDarkMode 사용
    document.body.classList.toggle('dark-mode', data.isDarkMode);
    if (darkmodeToggleBtn) {
        darkmodeToggleBtn.innerHTML = data.isDarkMode ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
    }
    // 차트 색상 업데이트를 위해 updateDisplay() 호출 (내부에서 updateCharts 호출)
    updateDisplay();
}

// 7. 데이터 저장 및 로드 (data 객체에 맞춰 전체 로직 변경)
function saveData() {
    // data 객체는 이미 최신 상태를 유지하고 있으므로, 별도의 객체를 다시 만들 필요 없음
    // 단, DOM에서 직접 가져와야 하는 값들은 data 객체에 반영해야 함
    data.salary.gross = parseFloat(grossSalaryInput.value) || 0;
    data.salary.frequency = salaryFrequencySelect.value;
    data.defaultItemFrequency = defaultItemFrequencySelect.value;
    data.budgetRule = budgetRuleSelect.value;

    // 고정 입력 필드의 값들을 data 객체에 저장
    for (const key in taxInputs) {
        if (taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    }
    for (const key in preTaxDeductInputs) {
        // 'fourZeroOneKTrad' -> '401kTrad'로 변환
        const dataKey = key === 'fourZeroOneKTrad' ? '401kTrad' : key;
        if (preTaxDeductInputs[key]) data.preTaxDeductions[dataKey] = parseFloat(preTaxDeductInputs[key].value) || 0;
    }
    for (const key in postTaxDeductInputs) {
        // 'fourZeroOneKRoth' -> '401kRoth'로 변환
        const dataKey = key === 'fourZeroOneKRoth' ? '401kRoth' : key;
        if (postTaxDeductInputs[key]) data.postTaxDeductions[dataKey] = parseFloat(postTaxDeductInputs[key].value) || 0;
    }
    for (const key in expenseInputs) {
        if (expenseInputs[key]) data.expenses[key] = parseFloat(expenseInputs[key].value) || 0;
    }

    // custom 배열은 이미 updateCustomItem, addCustomItem, deleteCustomItem에서 data 객체를 직접 수정하므로 따로 처리할 필요 없음

    localStorage.setItem('budgetAppData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('budgetAppData');
    if (savedData) {
        // 기존 data 객체를 저장된 데이터로 덮어씁니다.
        // 이전에 data 객체를 정의한 곳에서 초기값을 설정했지만, 여기서는 저장된 값으로 완전히 대체합니다.
        // 단, JSON.parse 시 함수 등은 제외되므로, 필요한 경우 재초기화 필요.
        Object.assign(data, JSON.parse(savedData));

        // DOM 요소에 저장된 값 로드
        if (grossSalaryInput) grossSalaryInput.value = data.salary.gross;
        if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;

        // 고정 입력 필드 로드
        for (const key in taxInputs) {
            if (taxInputs[key] && typeof data.taxes[key] !== 'undefined') taxInputs[key].value = data.taxes[key];
        }
        for (const key in preTaxDeductInputs) {
            const dataKey = key === 'fourZeroOneKTrad' ? '401kTrad' : key;
            if (preTaxDeductInputs[key] && typeof data.preTaxDeductions[dataKey] !== 'undefined') preTaxDeductInputs[key].value = data.preTaxDeductions[dataKey];
        }
        for (const key in postTaxDeductInputs) {
            const dataKey = key === 'fourZeroOneKRoth' ? '401kRoth' : key;
            if (postTaxDeductInputs[key] && typeof data.postTaxDeductions[dataKey] !== 'undefined') postTaxDeductInputs[key].value = data.postTaxDeductions[dataKey];
        }
        for (const key in expenseInputs) {
            if (expenseInputs[key] && typeof data.expenses[key] !== 'undefined') expenseInputs[key].value = data.expenses[key];
        }

        // 예산 규칙 로드
        if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

        // 커스텀 항목 렌더링 (재렌더링)
        renderCustomList(customTaxList, data.taxes.custom, 'tax');
        renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
        renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
        renderCustomList(customExpenseList, data.expenses.custom, 'expense');

        // 언어 및 다크 모드 적용
        applyLanguage(data.currentLanguage);
        applyDarkMode(data.isDarkMode);

        updateDisplay(); // 데이터 로드 후 화면 업데이트
    } else {
        // 저장된 데이터가 없는 경우, data 객체의 초기값 사용
        // DOM 요소는 0으로 초기화
        if (grossSalaryInput) grossSalaryInput.value = 0;
        if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;
        if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

        // 고정 입력 필드 0으로 초기화
        [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs].forEach(inputsGroup => {
            for (const key in inputsGroup) {
                if (inputsGroup[key]) inputsGroup[key].value = 0;
            }
        });

        // 커스텀 리스트 DOM 비우기
        customTaxList.innerHTML = '';
        customPreTaxDeductList.innerHTML = '';
        customPostTaxDeductList.innerHTML = '';
        customExpenseList.innerHTML = '';

        applyLanguage(data.currentLanguage); // data.currentLanguage의 초기값 적용
        applyDarkMode(data.isDarkMode); // data.isDarkMode의 초기값 적용
        updateDisplay(); // 초기 상태 반영
    }
}

// 8. 차트 관리 (Chart.js) (data 객체와 연동되도록 수정)
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
                    color: data.isDarkMode ? '#fff' : '#333' // data.isDarkMode 사용
                }
            }
        }
    };

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
    const colors = data.isDarkMode ? darkColors : defaultColors; // data.isDarkMode 사용

    // Helper to update individual chart
    const updateChartData = (chartInstance, dataSection, titlePrefix = '', excludeZero = true) => {
        if (!chartInstance) return;

        let labels = [];
        let chartValues = []; // Chart.js에 전달할 실제 값 (월별 환산 완료)
        let backgroundColors = [];
        let currentColorIndex = 0;

        // 고정 입력 필드 처리
        for (const key in dataSection) {
            if (key !== 'custom') { // 'custom' 배열은 따로 처리
                const value = parseFloat(dataSection[key]) || 0; // data 객체의 값
                if (value > 0 || !excludeZero) {
                    let labelKey;
                    if (titlePrefix === translations[data.currentLanguage].section_taxes_title) {
                        labelKey = `label_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`;
                    } else if (titlePrefix === translations[data.currentLanguage].section_pre_tax_title) {
                        labelKey = `label_${key.replace('401kTrad', '401k_traditional').replace(/([A-Z])/g, '_$1').toLowerCase()}`;
                    } else if (titlePrefix === translations[data.currentLanguage].section_post_tax_title) {
                        labelKey = `label_${key.replace('401kRoth', '401k_roth').replace(/([A-Z])/g, '_$1').toLowerCase()}`;
                    } else if (titlePrefix === translations[data.currentLanguage].section_expenses_title) {
                        labelKey = `label_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`;
                    }

                    labels.push(translations[data.currentLanguage][labelKey] || key);
                    chartValues.push(value); // 이미 월별로 data 객체에 저장되어 있다고 가정
                    backgroundColors.push(colors[currentColorIndex % colors.length]);
                    currentColorIndex++;
                }
            }
        }

        // 사용자 정의 항목 처리
        dataSection.custom.forEach(item => {
            if (item.value > 0 || !excludeZero) { // item.amount 대신 item.value 사용
                labels.push(item.name);
                chartValues.push(convertToMonthly(item.value, item.frequency || data.defaultItemFrequency)); // custom items는 여기서 월별 변환
                backgroundColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        });

        // If no data, clear chart
        if (chartValues.every(val => val === 0)) { // 변경된 변수명 사용
            chartInstance.data.labels = [];
            chartInstance.data.datasets[0].data = [];
            chartInstance.data.datasets[0].backgroundColor = [];
        } else {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = chartValues; // 변경된 변수명 사용
            chartInstance.data.datasets[0].backgroundColor = backgroundColors;
        }

        // Update legend label color based on dark mode
        chartInstance.options.plugins.legend.labels.color = data.isDarkMode ? '#fff' : '#333'; // data.isDarkMode 사용
        chartInstance.update();
    };

    // Update individual charts using data object sections
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
            totalTaxes, // These are already monthly sums from updateDisplay
            totalPreTaxDeductions, // These are already monthly sums
            totalPostTaxDeductions, // These are already monthly sums
            totalExpenses, // These are already monthly sums
            remainingBudget // This is already monthly
        ];

        // Filter out zero values for better chart representation
        const filteredBudgetLabels = [];
        const filteredBudgetData = [];
        const filteredBudgetColors = [];
        let currentColorIndex = 0;

        for (let i = 0; i < budgetData.length; i++) {
            if (budgetData[i] > 0) {
                filteredBudgetLabels.push(budgetLabels[i]);
                filteredBudgetData.push(budgetData[i]);
                filteredBudgetColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        }

        budgetDistributionChartInstance.data.labels = filteredBudgetLabels;
        budgetDistributionChartInstance.data.datasets[0].data = filteredBudgetData;
        budgetDistributionChartInstance.data.datasets[0].backgroundColor = filteredBudgetColors;
        budgetDistributionChartInstance.options.plugins.legend.labels.color = data.isDarkMode ? '#fff' : '#333'; // data.isDarkMode 사용
        budgetDistributionChartInstance.update();
    }
}

// 9. 디스플레이 업데이트 (계산 및 UI 갱신)
function updateDisplay() {
    // 1. DOM에서 최신 값을 읽어와 `data` 객체에 반영
    data.salary.gross = parseFloat(grossSalaryInput.value) || 0;
    data.salary.frequency = salaryFrequencySelect.value;
    data.defaultItemFrequency = defaultItemFrequencySelect.value;
    data.budgetRule = budgetRuleSelect.value; // 예산 규칙도 data 객체에 저장

    // 고정 입력 필드의 값들을 data 객체에 반영
    // taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs는 DOM 요소 객체입니다.
    // data.taxes, data.preTaxDeductions 등은 계산에 사용될 숫자 값들을 저장하는 data 객체 내의 섹션입니다.
    // 따라서 이 둘을 동기화해야 합니다.
    for (const key in taxInputs) {
        if (taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    }
    // 401kTrad와 같은 특수 키는 data 객체와 DOM 객체 간의 매핑 필요
    if (preTaxDeductInputs.fourZeroOneKTrad) data.preTaxDeductions['401kTrad'] = parseFloat(preTaxDeductInputs.fourZeroOneKTrad.value) || 0;
    if (preTaxDeductInputs.traditionalIRA) data.preTaxDeductions.traditionalIRA = parseFloat(preTaxDeductInputs.traditionalIRA.value) || 0;
    if (preTaxDeductInputs.hsa) data.preTaxDeductions.hsa = parseFloat(preTaxDeductInputs.hsa.value) || 0;
    if (postTaxDeductInputs.fourZeroOneKRoth) data.postTaxDeductions['401kRoth'] = parseFloat(postTaxDeductInputs.fourZeroOneKRoth.value) || 0;
    if (postTaxDeductInputs.rothIRA) data.postTaxDeductions.rothIRA = parseFloat(postTaxDeductInputs.rothIRA.value) || 0;
    // 나머지 expenseInputs도 유사하게 동기화 (HTML id와 data 키가 1:1 매핑된다고 가정)
    for (const key in expenseInputs) {
        if (expenseInputs[key]) data.expenses[key] = parseFloat(expenseInputs[key].value) || 0;
    }


    // 2. 급여 관련 계산
    let monthlyGrossSalaryForCalculation = convertToMonthly(data.salary.gross, data.salary.frequency);

    // Summary Display 업데이트 (연간)
    // 연간 급여는 월별 계산용 급여를 다시 12배하여 표시합니다.
    if (annualSalarySummaryDisplay) annualSalarySummaryDisplay.textContent = formatCurrency(monthlyGrossSalaryForCalculation * 12);
    if (grossSalarySummaryDisplay) grossSalarySummaryDisplay.textContent = formatCurrency(monthlyGrossSalaryForCalculation); // 월별 총 급여 표시


    // 3. 커스텀 항목 렌더링 (data 객체에서 읽어오도록 변경)
    renderCustomList(customTaxList, data.taxes.custom, 'tax');
    renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
    renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
    renderCustomList(customExpenseList, data.expenses.custom, 'expense');

    // 4. 총계 계산 (이제 모든 getTotalMonthly가 data 객체 섹션을 직접 받음)
    // getTotalMonthly는 이제 'data.taxes'와 같이 객체 자체를 인자로 받습니다.
    const totalTaxes = getTotalMonthly(data.taxes);
    const totalPreTaxDeductions = getTotalMonthly(data.preTaxDeductions);
    const totalPostTaxDeductions = getTotalMonthly(data.postTaxDeductions);
    const totalExpenses = getTotalMonthly(data.expenses); // data.expenses 객체 전체를 전달

    const totalDeductions = totalTaxes + totalPreTaxDeductions + totalPostTaxDeductions;

    // 순 급여 계산 (Gross - All Deductions)
    const netSalary = monthlyGrossSalaryForCalculation - totalTaxes - totalPreTaxDeductions - totalPostTaxDeductions;
    const remainingBudget = netSalary - totalExpenses;

    // 5. UI 업데이트
    if (totalTaxesDisplay) totalTaxesDisplay.textContent = formatCurrency(totalTaxes);
    if (totalPreTaxDisplay) totalPreTaxDisplay.textContent = formatCurrency(totalPreTaxDeductions);
    if (totalPostTaxDisplay) totalPostTaxDisplay.textContent = formatCurrency(totalPostTaxDeductions);
    if (netSalaryDisplay) netSalaryDisplay.textContent = formatCurrency(netSalary);
    if (totalExpensesDisplay) totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
    if (remainingBudgetDisplay) remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);

    // 6. 예산 규칙 적용 (monthlyGrossSalaryForCalculation 대신 netSalary를 기반으로 규칙 적용)
    // 일반적으로 50/30/20 규칙은 세후 순소득(netSalary)에 적용됩니다.
    applyBudgetRule(netSalary, totalExpenses, totalTaxes, totalPreTaxDeductions, totalPostTaxDeductions); // 인자 수정


    // 7. 차트 업데이트
    updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions);

    // 8. 데이터 저장
    saveData();
}

// 10. 예산 규칙 정의 (변경 없음)
const BUDGET_RULES = {
    "50-30-20": { needs: 0.5, wants: 0.3, savings: 0.2 },
    "70-20-10": { needs: 0.7, wants: 0.2, savings: 0.1 },
    "80-20": { needs: 0.8, wants: 0.0, savings: 0.2 } // 80/20 rule often implies 0 wants
};

// 11. 예산 규칙 적용 함수 (data 객체 사용 및 인자 조정)
// applyBudgetRule(netSalary, totalExpenses, totalTaxes, totalPreTaxDeductions, totalPostTaxDeductions)
function applyBudgetRule(netSalary, totalExpenses, totalTaxes, totalPreTaxDeductions, totalPostTaxDeductions) {
    // Null checks for display elements
    if (!ruleNeedsDisplay || !ruleWantsDisplay || !ruleSavingsDisplay || !ruleTotalDisplay ||
        !actualNeedsDisplay || !actualWantsDisplay || !actualSavingsDisplay || !actualTotalDisplay || !budgetStatusDisplay) {
        console.warn("One or more budget rule display elements are missing from the DOM.");
        return; // Exit if essential elements are missing
    }

    const selectedRule = data.budgetRule; // data.budgetRule 사용
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

    // 1. Calculate budget based on the rule (based on net salary for rule calculation)
    // 여기서 netSalary는 이미 월별로 변환된 값입니다.
    const ruleNeeds = netSalary * rule.needs;
    const ruleWants = netSalary * rule.wants;
    const ruleSavings = netSalary * rule.savings;
    const ruleTotal = ruleNeeds + ruleWants + ruleSavings; // Should ideally sum up to netSalary

    ruleNeedsDisplay.textContent = formatCurrency(ruleNeeds);
    ruleWantsDisplay.textContent = formatCurrency(ruleWants);
    ruleSavingsDisplay.textContent = formatCurrency(ruleSavings);
    ruleTotalDisplay.textContent = formatCurrency(ruleTotal);

    // 2. Calculate actual spending based on user inputs
    let actualNeeds = 0;
    let actualWants = 0;

    // 고정 지출 항목들에서 needs와 wants 분류 (data.expenses에서 값 가져오기)
    // data.expenses에 저장된 값은 이미 월별입니다.
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

    // 사용자 정의 지출 항목들에서 'category' 기반 분류 (data.expenses.custom에서 값 가져오기)
    data.expenses.custom.forEach(item => { // data.expenses.custom 사용
        const monthlyAmount = convertToMonthly(item.value, item.frequency); // item.amount 대신 item.value
        if (item.category === 'needs') {
            actualNeeds += monthlyAmount;
        } else if (item.category === 'wants') {
            actualWants += monthlyAmount;
        } else {
            actualNeeds += monthlyAmount; // If category is not specified or unknown, default to needs
        }
    });

    // Actual Savings: Net salary minus all expenses (needs + wants) and also accounting for explicit savings within deductions
    // Actual savings should be (net salary) - (actual needs) - (actual wants)
    // Plus any savings explicitly defined in pre-tax or post-tax deductions (e.g., 401k, IRA if considered savings)
    // For simplicity, let's assume 'savings' in 50/30/20 means disposable income not spent on needs/wants.
    // If you want to include 401k/IRA as 'actual savings', you would add them here.
    const actualSavings = netSalary - (actualNeeds + actualWants); // 현재는 순수 남은 금액만 고려

    actualNeedsDisplay.textContent = formatCurrency(actualNeeds);
    actualWantsDisplay.textContent = formatCurrency(actualWants);
    actualSavingsDisplay.textContent = formatCurrency(actualSavings);

    actualTotalDisplay.textContent = formatCurrency(actualNeeds + actualWants + actualSavings); // 총 지출 + 총 저축 = 순급여

    // 3. Evaluate budget status
    let statusText = "";
    let statusColor = "var(--summary-text-color)"; // Default to positive color

    // Check Needs
    if (actualNeeds > ruleNeeds) {
        statusText += `${translations[data.currentLanguage].needs_label} ${translations[data.currentLanguage].status_over}. `;
        statusColor = "var(--danger-color)";
    }

    // Check Wants (only if the rule has a Wants component)
    if (rule.wants > 0 && actualWants > ruleWants) {
        statusText += `${translations[data.currentLanguage].wants_label} ${translations[data.currentLanguage].status_over}. `;
        statusColor = "var(--danger-color)";
    }

    // Check Savings (if actual savings are less than what the rule recommends)
    if (actualSavings < ruleSavings) {
        statusText += `${translations[data.currentLanguage].savings_label} ${translations[data.currentLanguage].status_under}. `;
        statusColor = "var(--danger-color)";
    }

    // Overall deficit check: if net salary minus total actual expenses is negative
    // This check is slightly redundant with actualSavings < 0, but good for clarity.
    if (actualNeeds + actualWants > netSalary) { // Total expenses exceed net salary
        statusText = translations[data.currentLanguage].status_over + " (" + translations[data.currentLanguage].label_deficit + ")";
        statusColor = "var(--danger-color)";
    } else if (statusText.trim() === "") { // If no specific issues found above
        statusText = translations[data.currentLanguage].status_ok;
        statusColor = "var(--summary-text-color)";
    } else { // If there are specific warnings but no overall deficit
        // Keep the warnings and set color to warning if not already danger
        if (statusColor !== "var(--danger-color)") {
            statusColor = "var(--warning-color)"; // Assuming you have a CSS variable for warning color
        }
    }

    budgetStatusDisplay.textContent = statusText;
    budgetStatusDisplay.style.color = statusColor;
}

// 12. 이벤트 리스너 설정 (data 객체 사용하도록 수정)
document.addEventListener('DOMContentLoaded', () => {
    loadData(); // DOM 로드 후 저장된 데이터 로드

    initializeCharts(); // 차트 초기화 (데이터 로드 후)
    // updateDisplay()는 loadData() 내부에서 이미 호출됩니다.
    // 하지만 DOMContentLoaded 시점에 최초 한 번 더 호출하는 것은 안정성을 높일 수 있습니다.
    // loadData()가 데이터를 로드하고 DOM에 반영한 후 updateDisplay()를 호출합니다.
    // 따라서 여기서 한 번 더 호출할 필요는 없습니다. (주석 처리 또는 제거)
    // updateDisplay(); // 초기 UI 업데이트

    // 급여 양식 입력 변경 시
    if (grossSalaryInput) {
        grossSalaryInput.addEventListener('input', updateDisplay);
    }
    if (salaryFrequencySelect) {
        salaryFrequencySelect.addEventListener('change', (e) => {
            data.salary.frequency = e.target.value; // data 객체 업데이트
            updateDisplay();
        });
    }

    // 기본 항목 주기 변경 시
    if (defaultItemFrequencySelect) {
        defaultItemFrequencySelect.addEventListener('change', (e) => {
            data.defaultItemFrequency = e.target.value; // data 객체 업데이트
            // 모든 고정 입력 필드의 data.xxx.key 값을 업데이트할 필요는 없습니다.
            // data.defaultItemFrequency는 오직 새로운 사용자 정의 항목을 추가할 때의 기본 주기를 결정하거나,
            // convertToMonthly 함수에서 주기가 명시되지 않은 경우 사용됩니다.
            // 고정 입력 필드의 값은 이제 data 객체에 월별 값으로 직접 저장되고 관리되므로,
            // 이 이벤트를 통해 고정 입력 필드의 dataset.frequency를 변경할 필요는 없습니다.
            // 만약 고정 입력 필드도 각각 주기를 가질 수 있다면, 그 주기를 data 객체에 저장해야 합니다.
            // 현재는 고정 입력 필드는 월별 값이거나 defaultItemFrequency를 따르지 않는다고 가정합니다.
            // 만약 고정 입력 필드의 주기도 변경하고 싶다면, loadData와 saveData에 해당 로직을 추가하고
            // 여기서 해당 input의 dataset.frequency를 업데이트해야 합니다.
            updateDisplay(); // 변경된 주기를 반영하여 UI 업데이트
            saveData(); // 기본 주기 저장
        });
    }

    // 고정 입력 필드 변경 시 (이제 data 객체에 직접 반영)
    const allInputGroups = [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs];
    allInputGroups.forEach(group => {
        for (const key in group) {
            if (group[key]) {
                group[key].addEventListener('input', (e) => {
                    const value = parseFloat(e.target.value) || 0;
                    // HTML input의 name 속성 또는 id를 이용하여 data 객체의 올바른 위치에 저장
                    // 여기서는 taxInputs, preTaxDeductInputs 등의 객체 키와 data 객체 키가 일치한다고 가정
                    // 특수 케이스 (401kTrad 등)는 별도 처리
                    if (group === taxInputs) data.taxes[key] = value;
                    else if (group === preTaxDeductInputs) {
                        const dataKey = key === 'fourZeroOneKTrad' ? '401kTrad' : key;
                        data.preTaxDeductions[dataKey] = value;
                    }
                    else if (group === postTaxDeductInputs) {
                        const dataKey = key === 'fourZeroOneKRoth' ? '401kRoth' : key;
                        data.postTaxDeductions[dataKey] = value;
                    }
                    else if (group === expenseInputs) data.expenses[key] = value;
                    updateDisplay();
                });
            }
        }
    });

    // 커스텀 항목 추가 버튼 (addCustomItem 함수가 type 문자열만 받도록 변경되었음)
    document.querySelectorAll('.add-custom-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            addCustomItem(type); // type 문자열만 전달
        });
    });

    // Custom Item Delete Buttons (Event Delegation)
    // deleteCustomItem 함수가 type과 itemId를 받도록 변경되었으므로, event delegation 로직도 수정해야 합니다.
    // renderCustomList에서 삭제 버튼에 `deleteCustomItem('${type}', '${item.id}')` 형태로 이미 onclick이 붙어 있으므로,
    // 이 DOMContentLoaded 이벤트 리스너는 필요 없을 수 있습니다.
    // 하지만, 만약 onclick이 동적으로 추가되는 것이 아니라면, 여기서 이벤트 위임을 통해 처리하는 것이 좋습니다.
    // 현재 `renderCustomList`에서 직접 `onclick`을 사용하므로, 이 섹션은 중복되거나 삭제 가능합니다.
    // 여기서는 기존 코드를 따라 이벤트 위임 방식으로 유지하되, `itemId`를 사용하도록 수정합니다.
    document.addEventListener('click', (e) => {
        // delete-custom-btn 클래스를 확인
        if (e.target.classList.contains('delete-custom-btn') || e.target.closest('.delete-custom-btn')) {
            const btn = e.target.closest('.delete-custom-btn');
            const itemDiv = btn.closest('.custom-item');
            const type = itemDiv.dataset.itemType; // itemDiv에서 type 가져오기
            const itemId = itemDiv.dataset.itemId; // itemDiv에서 itemId 가져오기

            // deleteCustomItem 함수는 이미 confirm을 포함하므로 여기서 다시 confirm 할 필요 없습니다.
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
            const newLang = data.currentLanguage === 'ko' ? 'en' : 'ko'; // data.currentLanguage 사용
            applyLanguage(newLang);
            saveData();
        });
    }

    // Dark Mode Toggle
    if (darkmodeToggleBtn) {
        darkmodeToggleBtn.addEventListener('click', () => {
            applyDarkMode(!data.isDarkMode); // data.isDarkMode 사용
            saveData();
        });
    }

    // Data Management: Export JSON (data 객체 사용)
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            // saveData() 함수를 호출하여 data 객체의 최신 상태를 확보합니다.
            // data 객체는 이미 전역으로 존재하며 최신 상태를 유지하므로,
            // 여기서 별도의 `data` 객체를 생성할 필요 없이 전역 `data` 객체를 사용합니다.
            saveData(); // 항상 최신 상태를 저장
            const jsonData = JSON.stringify(data, null, 2); // 전역 data 객체 사용
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'budget_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert(translations[data.currentLanguage].alert_json_export_success); // data.currentLanguage 사용
        });
    }

    // Data Management: Import JSON (data 객체 사용)
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
                        // 불러온 데이터의 유효성을 간단히 검사
                        // data 객체 구조에 맞는지 확인
                        if (importedData && typeof importedData.salary?.gross !== 'undefined' && importedData.taxes) {
                            // localStorage에 직접 저장 (loadData에서 파싱하고 적용하도록)
                            localStorage.setItem('budgetAppData', JSON.stringify(importedData));
                            loadData(); // 데이터 로드 및 UI 업데이트
                            alert(translations[data.currentLanguage].alert_data_import_success); // data.currentLanguage 사용
                        } else {
                            alert(translations[data.currentLanguage].alert_invalid_json); // data.currentLanguage 사용
                        }
                    } catch (error) {
                        alert(translations[data.currentLanguage].alert_json_parse_error + error.message); // data.currentLanguage 사용
                        console.error('Error parsing JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Data Management: Clear All Data (data 객체 사용)
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', () => {
            if (confirm(translations[data.currentLanguage].confirm_clear_data)) { // data.currentLanguage 사용
                localStorage.removeItem('budgetAppData');

                // data 객체를 초기 상태로 되돌립니다.
                // 전역 `data` 객체의 초기 정의를 여기에 반영합니다.
                // 아니면 페이지를 새로고침하여 초기 상태로 만드는 것이 더 간단하고 안전합니다.
                // 여기서는 수동 초기화를 선택합니다.
                data.salary = {
                    gross: 0,
                    frequency: 'monthly'
                };
                data.defaultItemFrequency = 'monthly';
                data.taxes = {
                    federal: 0, state: 0, socialSecurity: 0, medicare: 0, custom: []
                };
                data.preTaxDeductions = {
                    '401kTrad': 0, traditionalIRA: 0, hsa: 0, custom: []
                };
                data.postTaxDeductions = {
                    '401kRoth': 0, rothIRA: 0, healthInsurance: 0, lifeInsurance: 0, custom: []
                };
                data.expenses = {
                    rent: 0, utilities: 0, internet: 0, phone: 0, groceries: 0, transport: 0, health: 0,
                    dining: 0, shopping: 0, entertainment: 0, custom: []
                };
                data.currentLanguage = 'ko';
                data.isDarkMode = false;
                data.budgetRule = '50-30-20';

                // DOM 요소도 초기값으로 재설정 (data 객체와 동기화)
                if (grossSalaryInput) grossSalaryInput.value = data.salary.gross;
                if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
                if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;
                if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

                // 고정 입력 필드 0으로 초기화
                [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs].forEach(inputsGroup => {
                    for (const key in inputsGroup) {
                        if (inputsGroup[key]) inputsGroup[key].value = 0;
                    }
                });

                // 커스텀 리스트 DOM 비우기
                customTaxList.innerHTML = '';
                customPreTaxDeductList.innerHTML = '';
                customPostTaxDeductList.innerHTML = '';
                customExpenseList.innerHTML = '';

                applyLanguage(data.currentLanguage); // data.currentLanguage 초기 적용
                applyDarkMode(data.isDarkMode);     // data.isDarkMode 초기 적용

                updateDisplay(); // UI 다시 그리기
                alert(translations[data.currentLanguage].alert_data_cleared); // data.currentLanguage 사용
            }
        });
    }

    // AI Report Generation (Placeholder for actual AI integration)
    if (aiReportBtn && aiReportBox) {
        aiReportBtn.addEventListener('click', () => {
            aiReportBox.innerHTML = `<p>${translations[data.currentLanguage].ai_report_placeholder}</p>`; // data.currentLanguage 사용
        });
    }

    // Budget Rule Select Listener
    if (budgetRuleSelect) {
        budgetRuleSelect.addEventListener("change", () => {
            data.budgetRule = budgetRuleSelect.value; // data 객체 업데이트
            updateDisplay();
        });
    }
});
