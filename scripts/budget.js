// budget.js

// 1. 전역 변수 및 DOM 요소 캐싱
const grossSalaryInput = document.getElementById('salary-gross');
const salaryFrequencySelect = document.getElementById('salary-frequency-select');
const annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');

const defaultItemFrequencySelect = document.getElementById('default-item-frequency-select');

// 세금 입력 필드 - HTML ID와 일치하도록 키 이름을 명확히 함
const taxInputs = {
    federal: document.getElementById('tax-federal-1'),
    state: document.getElementById('tax-state-1'),
    oasdi: document.getElementById('tax-oasdi-1'), // OASDI
    medicare: document.getElementById('tax-medicare-1'),
    casdi: document.getElementById('tax-casdi-1') // CA SDI
};

// 세전 공제 입력 필드 - HTML ID와 일치하도록 키 이름을 명확히 함
const preTaxDeductInputs = {
    medical: document.getElementById('deduct-medical-1'),
    dental: document.getElementById('deduct-dental-1'),
    vision: document.getElementById('deduct-vision-1'),
    fourZeroOneKTrad: document.getElementById('deduct-401k-trad-1'), // HTML ID와 일치
    traditionalIRA: document.getElementById('deduct-traditional-ira-1'), // 추가된 ID
    hsa: document.getElementById('deduct-hsa-1') // 추가된 ID
};

// 세후 공제 입력 필드 - HTML ID와 일치하도록 키 이름을 명확히 함
const postTaxDeductInputs = {
    spp: document.getElementById('deduct-spp-1'),
    adnd: document.getElementById('deduct-adnd-1'),
    fourZeroOneKRoth: document.getElementById('deduct-401k-roth-1'), // HTML ID와 일치
    ltd: document.getElementById('deduct-ltd-1'),
    rothIRA: document.getElementById('deduct-roth-ira-1'), // 추가된 ID
    healthInsurance: document.getElementById('deduct-health-insurance-1'), // 추가된 ID (CSS 변수명과 일치)
    lifeInsurance: document.getElementById('deduct-life-insurance-1') // 추가된 ID
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

// 커스텀 항목 목록 컨테이너
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
const actualWantsDisplay = document = document.getElementById('actual-wants');
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
        custom: [] // [{id: 't-1', name: 'Other Tax', value: 0, frequency: 'monthly'}]
    },
    preTaxDeductions: {
        medical: 0,
        dental: 0,
        vision: 0,
        '401kTrad': 0, // '401kTrad'로 키 이름 통일
        traditionalIRA: 0, // 추가된 키
        hsa: 0, // 추가된 키
        custom: [] // [{id: 'ptd-1', name: 'HSA', value: 0, frequency: 'monthly'}]
    },
    postTaxDeductions: {
        spp: 0,
        adnd: 0,
        '401kRoth': 0, // '401kRoth'로 키 이름 통일
        ltd: 0,
        rothIRA: 0, // 추가된 키
        healthInsurance: 0, // 추가된 키
        lifeInsurance: 0, // 추가된 키
        custom: [] // [{id: 'potd-1', name: 'Life Insurance', value: 0, frequency: 'monthly'}]
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
        custom: [] // [{id: 'e-1', name: 'Gym Membership', value: 0, category: 'needs/wants', frequency: 'monthly'}]
    },
    defaultItemFrequency: 'monthly',
    budgetRule: '50-30-20', // 초기 규칙 설정
    currentLanguage: 'ko', // 언어 설정도 data 객체 안으로
    isDarkMode: false // 다크 모드 설정도 data 객체 안으로
};

// Chart.js 인스턴스 (이 부분은 유지합니다.)
let taxChartInstance;
let preTaxDeductChartInstance;
let postTaxDeductChartInstance;
let expensesChartInstance;
let budgetDistributionChartInstance;


// 3. 번역 객체
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
        label_new_item: "New Item", // 추가: 새로운 항목의 기본 이름
        btn_add_item: "Add Item",
        btn_edit_item: "Edit Item", // 추가: 편집 버튼 툴팁
        btn_save_item_changes: "Save Changes", // 추가: 저장 버튼 툴팁
        section_pre_tax_title: "Pre-Tax Deductions",
        label_medical_premium: "Medical Premium",
        label_dental_premium: "Dental Premium",
        label_vision_premium: "Vision Premium",
        label_401k_traditional: "401k Traditional",
        label_traditional_ira: "Traditional IRA", // 추가
        label_hsa: "HSA", // 추가
        section_post_tax_title: "Post-Tax Deductions",
        label_spp: "Stock Purchase Plan",
        label_adnd: "AD&D",
        label_401k_roth: "401k Roth",
        label_ltd: "Long Term Disability",
        label_roth_ira: "Roth IRA", // 추가
        label_health_insurance: "Health Insurance", // 추가
        label_life_insurance: "Life Insurance", // 추가
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
        remove_item: "Are you sure you want to remove this item?", // 문장 부호 추가
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
        label_total: "Total"
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
        label_new_item: "새 항목", // 추가
        btn_add_item: "항목 추가",
        btn_edit_item: "항목 편집", // 추가
        btn_save_item_changes: "변경 사항 저장", // 추가
        section_pre_tax_title: "세전 공제",
        label_medical_premium: "의료 보험료",
        label_dental_premium: "치과 보험료",
        label_vision_premium: "시력 보험료",
        label_401k_traditional: "401k 일반",
        label_traditional_ira: "일반 IRA", // 추가
        label_hsa: "HSA", // 추가
        section_post_tax_title: "세후 공제",
        label_spp: "주식 구매 계획",
        label_adnd: "AD&D",
        label_401k_roth: "401k Roth",
        label_ltd: "장기 장애",
        label_roth_ira: "Roth IRA", // 추가
        label_health_insurance: "건강 보험", // 추가
        label_life_insurance: "생명 보험", // 추가
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
        remove_item: "이 항목을 삭제하시겠습니까?", // 문장 부호 추가
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
        label_total: "총계"
    }
};

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
// 이 함수는 data 객체로부터 값을 직접 읽어옵니다.
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

        itemDiv.innerHTML = `
            <label for="${item.id}-name-input" class="custom-item-label" style="display: block;">${item.name || translations[data.currentLanguage].label_new_item}</label>
            <div class="input-container custom-input-container">
                <input type="text" id="${item.id}-name-input" class="form-control custom-item-name-input" value="${item.name}" placeholder="${translations[data.currentLanguage].item_name_placeholder}" readonly style="display: none;">
                <input type="number" id="${item.id}-value-input" class="form-control custom-item-value-input" min="0" value="${item.value}" oninput="updateCustomItem('${type}', '${item.id}', 'value', this.value)" readonly>
                <select id="${item.id}-frequency-select" class="form-control custom-item-frequency-select" onchange="updateCustomItem('${type}', '${item.id}', 'frequency', this.value)" ${type === 'expense' || type === 'tax' || type === 'pre-tax' || type === 'post-tax' ? '' : 'style="display: none;"'} disabled>
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

        const nameInput = itemDiv.querySelector(`#${item.id}-name-input`);
        nameInput.addEventListener('input', (event) => {
            updateCustomItem(type, item.id, 'name', event.target.value);
            itemDiv.querySelector('.custom-item-label').textContent = event.target.value || translations[data.currentLanguage].label_new_item;
        });

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
        itemCategory = 'needs';
    } else {
        console.error("Unknown custom item type:", type);
        return;
    }

    const newItem = {
        id: itemId,
        name: itemName,
        value: itemAmount,
        frequency: data.defaultItemFrequency
    };

    if (type === 'expense') {
        newItem.category = itemCategory;
    }

    targetArray.push(newItem);
    updateDisplay();
    saveData();
}


// 사용자 정의 항목 제거
function deleteCustomItem(type, itemId) {
    const confirmed = confirm(translations[data.currentLanguage].remove_item); // 문장 부호 제거
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

    // 새로운 배열로 필터링하고 data 객체에 재할당
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

    if (nameInput.readOnly) { // 현재 읽기 모드 -> 편집 모드로 전환
        nameInput.removeAttribute('readonly');
        valueInput.removeAttribute('readonly');
        if (frequencySelect) frequencySelect.removeAttribute('disabled');
        if (categorySelect) categorySelect.removeAttribute('disabled');

        nameInput.focus();
        icon.className = 'ri-check-line'; // 아이콘을 저장(체크)으로 변경
        button.title = translations[data.currentLanguage].btn_save_item_changes; // 툴팁 변경 (번역 추가됨)
        label.style.display = 'none';
        nameInput.style.display = 'block';
    } else { // 현재 편집 모드 -> 읽기 모드로 전환 (저장)
        nameInput.setAttribute('readonly', 'true');
        valueInput.setAttribute('readonly', 'true');
        if (frequencySelect) frequencySelect.setAttribute('disabled', 'true');
        if (categorySelect) categorySelect.setAttribute('disabled', 'true');

        icon.className = 'ri-pencil-line'; // 아이콘을 편집(연필)으로 변경
        button.title = translations[data.currentLanguage].btn_edit_item; // 툴팁 변경
        label.style.display = 'block';
        nameInput.style.display = 'none';
        label.textContent = nameInput.value || translations[data.currentLanguage].label_new_item;
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
                element.title = translations[data.currentLanguage].remove_item;
            } else {
                element.textContent = translations[data.currentLanguage][key];
            }
        }
    });

    if (languageToggleBtn) {
        languageToggleBtn.textContent = data.currentLanguage === 'ko' ? 'EN' : 'KO';
    }

    // 예산 규칙 섹션 라벨 수동 업데이트 (HTML에 data-i18n-key를 추가하는 것이 더 좋습니다)
    const needsLabelEl = document.querySelector('.rule-breakdown div:nth-child(1) p:nth-child(1)');
    if (needsLabelEl) needsLabelEl.textContent = translations[data.currentLanguage].needs_label + ':';
    const wantsLabelEl = document.querySelector('.rule-breakdown div:nth-child(2) p:nth-child(1)');
    if (wantsLabelEl) wantsLabelEl.textContent = translations[data.currentLanguage].wants_label + ':';
    const savingsLabelEl = document.querySelector('.rule-breakdown div:nth-child(3) p:nth-child(1)');
    if (savingsLabelEl) savingsLabelEl.textContent = translations[data.currentLanguage].savings_label + ':';
    const totalLabelEl = document.querySelector('.rule-breakdown div.total p:nth-child(1)');
    if (totalLabelEl) totalLabelEl.textContent = translations[data.currentLanguage].label_total + ':';

    if (aiReportBox) {
        const aiReportPlaceholderP = aiReportBox.querySelector('p');
        if (aiReportPlaceholderP) {
            aiReportPlaceholderP.textContent = translations[data.currentLanguage].ai_report_placeholder;
        }
    }

    updateDisplay();
}

// 6. 다크 모드 적용
function applyDarkMode(enable) {
    data.isDarkMode = enable;
    document.body.classList.toggle('dark-mode', data.isDarkMode);
    if (darkmodeToggleBtn) {
        darkmodeToggleBtn.innerHTML = data.isDarkMode ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
    }
    updateDisplay();
}

// 7. 데이터 저장 및 로드
function saveData() {
    data.salary.gross = parseFloat(grossSalaryInput.value) || 0;
    data.salary.frequency = salaryFrequencySelect.value;
    data.defaultItemFrequency = defaultItemFrequencySelect.value;
    data.budgetRule = budgetRuleSelect.value;

    // 고정 입력 필드의 값들을 data 객체에 저장
    for (const key in taxInputs) {
        if (taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    }
    // `fourZeroOneKTrad` 등 DOM ID와 data 객체 키 불일치 매핑
    data.preTaxDeductions['medical'] = parseFloat(preTaxDeductInputs.medical.value) || 0;
    data.preTaxDeductions['dental'] = parseFloat(preTaxDeductInputs.dental.value) || 0;
    data.preTaxDeductions['vision'] = parseFloat(preTaxDeductInputs.vision.value) || 0;
    data.preTaxDeductions['401kTrad'] = parseFloat(preTaxDeductInputs.fourZeroOneKTrad.value) || 0;
    if (preTaxDeductInputs.traditionalIRA) data.preTaxDeductions.traditionalIRA = parseFloat(preTaxDeductInputs.traditionalIRA.value) || 0;
    if (preTaxDeductInputs.hsa) data.preTaxDeductions.hsa = parseFloat(preTaxDeductInputs.hsa.value) || 0;

    data.postTaxDeductions['spp'] = parseFloat(postTaxDeductInputs.spp.value) || 0;
    data.postTaxDeductions['adnd'] = parseFloat(postTaxDeductInputs.adnd.value) || 0;
    data.postTaxDeductions['401kRoth'] = parseFloat(postTaxDeductInputs.fourZeroOneKRoth.value) || 0;
    data.postTaxDeductions['ltd'] = parseFloat(postTaxDeductInputs.ltd.value) || 0;
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
        Object.assign(data, JSON.parse(savedData));

        if (grossSalaryInput) grossSalaryInput.value = data.salary.gross;
        if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;

        // 고정 입력 필드 로드 및 DOM 업데이트
        for (const key in taxInputs) {
            if (taxInputs[key] && typeof data.taxes[key] !== 'undefined') taxInputs[key].value = data.taxes[key];
        }
        // `fourZeroOneKTrad` 등 DOM ID와 data 객체 키 불일치 매핑
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

        renderCustomList(customTaxList, data.taxes.custom, 'tax');
        renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
        renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
        renderCustomList(customExpenseList, data.expenses.custom, 'expense');

        applyLanguage(data.currentLanguage);
        applyDarkMode(data.isDarkMode);

        updateDisplay();
    } else {
        // 저장된 데이터가 없는 경우, DOM 요소를 0으로 초기화
        if (grossSalaryInput) grossSalaryInput.value = 0;
        if (salaryFrequencySelect) salaryFrequencySelect.value = data.salary.frequency;
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;
        if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

        [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs].forEach(inputsGroup => {
            for (const key in inputsGroup) {
                if (inputsGroup[key]) inputsGroup[key].value = 0;
            }
        });

        customTaxList.innerHTML = '';
        customPreTaxDeductList.innerHTML = '';
        customPostTaxDeductList.innerHTML = '';
        customExpenseList.innerHTML = '';

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
                    } else if (key === 'spp') { // SPP for Stock Purchase Plan
                        labelKey = 'label_spp';
                    } else if (key === 'adnd') { // AD&D
                        labelKey = 'label_adnd';
                    } else if (key === 'ltd') { // LTD
                        labelKey = 'label_ltd';
                    }
                    else {
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
            if (item.value > 0 || !excludeZero) {
                labels.push(item.name);
                chartValues.push(convertToMonthly(item.value, item.frequency || data.defaultItemFrequency));
                backgroundColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        });

        if (chartValues.every(val => val === 0)) {
            chartInstance.data.labels = [];
            chartInstance.data.datasets[0].data = [];
            chartInstance.data.datasets[0].backgroundColor = [];
        } else {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = chartValues;
            chartInstance.data.datasets[0].backgroundColor = backgroundColors;
        }

        chartInstance.options.plugins.legend.labels.color = data.isDarkMode ? '#fff' : '#333';
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
            if (budgetData[i] > 0 || (budgetData[i] < 0 && budgetLabels[i] === translations[data.currentLanguage].label_remaining_budget)) { // Remaining budget can be negative
                filteredBudgetLabels.push(budgetLabels[i]);
                filteredBudgetData.push(Math.abs(budgetData[i])); // Use absolute value for chart display
                filteredBudgetColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        }

        // Handle case where all values are zero
        if (filteredBudgetData.length === 0) {
            budgetDistributionChartInstance.data.labels = [];
            budgetDistributionChartInstance.data.datasets[0].data = [];
            budgetDistributionChartInstance.data.datasets[0].backgroundColor = [];
        } else {
            budgetDistributionChartInstance.data.labels = filteredBudgetLabels;
            budgetDistributionChartInstance.data.datasets[0].data = filteredBudgetData;
            budgetDistributionChartInstance.data.datasets[0].backgroundColor = filteredBudgetColors;
        }
        
        budgetDistributionChartInstance.options.plugins.legend.labels.color = data.isDarkMode ? '#fff' : '#333';
        budgetDistributionChartInstance.update();
    }
}

// 9. 디스플레이 업데이트 (계산 및 UI 갱신)
function updateDisplay() {
    data.salary.gross = parseFloat(grossSalaryInput.value) || 0;
    data.salary.frequency = salaryFrequencySelect.value;
    data.defaultItemFrequency = defaultItemFrequencySelect.value;
    data.budgetRule = budgetRuleSelect.value;

    // 고정 입력 필드의 값들을 data 객체에 반영
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
        const monthlyAmount = convertToMonthly(item.value, item.frequency);
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
    let statusColor = "var(--summary-text-color)";

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
    // Here we compare the total "savings bucket" (explicit savings + remaining income) against the rule's savings target
    if (finalActualSavings < ruleSavings) {
        statusText += `${translations[data.currentLanguage].savings_label} ${translations[data.currentLanguage].status_under}. `;
        if (statusColor !== "var(--danger-color)") { // Don't override danger with warning
            statusColor = "var(--warning-color)";
        }
    }


    if (netSalary - (actualNeeds + actualWants + actualSavingsFromDeductions) < 0) { // If overall spending + explicit savings exceeds net income
        statusText = translations[data.currentLanguage].status_over + " (" + translations[data.currentLanguage].label_deficit + ")";
        statusColor = "var(--danger-color)";
    } else if (statusText.trim() === "") {
        statusText = translations[data.currentLanguage].status_ok;
        statusColor = "var(--summary-text-color)";
    } else {
        if (statusColor !== "var(--danger-color)") {
            statusColor = "var(--warning-color)";
        }
    }

    budgetStatusDisplay.textContent = statusText;
    budgetStatusDisplay.style.color = statusColor;
}

// 12. 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
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

                // data 객체를 초기 상태로 되돌립니다. (초기 정의와 일치하도록 수정)
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

                customTaxList.innerHTML = '';
                customPreTaxDeductList.innerHTML = '';
                customPostTaxDeductList.innerHTML = '';
                customExpenseList.innerHTML = '';

                applyLanguage(data.currentLanguage);
                applyDarkMode(data.isDarkMode);

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
