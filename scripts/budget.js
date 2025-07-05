// budget.js

// 1. 전역 변수 및 DOM 요소 캐싱
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
const actualWantsDisplay = document.getElementById('actual-wants');
const actualSavingsDisplay = document.getElementById('actual-savings');
const actualTotalDisplay = document.getElementById('actual-total');
const budgetStatusDisplay = document.getElementById('budget-status');


// 2. 전역 상태 변수
let currentSalaryFrequency = 'monthly'; // 기본값
let defaultItemFrequency = 'monthly'; // 기본값
let currentLanguage = 'ko'; // 기본 언어
let isDarkMode = false; // 기본 다크 모드 상태

// 사용자 정의 항목 배열
let customTaxes = [];
let customPreTaxDeductions = [];
let customPostTaxDeductions = [];
let customExpenses = [];

// Chart.js 인스턴스
let taxChartInstance;
let preTaxDeductChartInstance;
let postTaxDeductChartInstance;
let expensesChartInstance;
let budgetDistributionChartInstance;

// 3. 번역 객체 (더 많은 번역 키 추가)
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
        label_actual: "Actual"
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
        label_actual: "실제"
    }
};


// 4. 유틸리티 함수

// 통화 형식 지정
// 예시: 금액 포맷팅 함수 (실제 함수 이름은 다를 수 있습니다)
function formatCurrency(amount) {
    // navigator.language를 사용하여 사용자 로케일을 가져오거나, 'en-US'로 고정
    const locale = navigator.language || 'en-US';

    // Intl.NumberFormat을 사용하여 통화 형식으로 포맷팅
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD', // 통화를 'USD'로 명시적으로 지정
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

// 모든 입력 필드 및 커스텀 항목의 총액 계산
function getTotal(inputs, customItems) {
    let total = 0;
    for (const key in inputs) {
        if (inputs[key]) {
            total += parseFloat(inputs[key].value) || 0;
        }
    }
    customItems.forEach(item => {
        total += item.amount;
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
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('custom-item');
        itemDiv.innerHTML = `
            <span>${item.name} (${formatCurrency(item.amount)})</span>
            <button class="remove-btn icon-btn" data-index="${index}" data-type="${type}" aria-label="${translations[currentLanguage].remove_item}">
                <i class="ri-close-line"></i>
            </button>
        `;
        listElement.appendChild(itemDiv);
    });
}

// 사용자 정의 항목 추가
function addCustomItem(array, type) {
    const itemName = prompt(translations[currentLanguage].add_item_title + " - " + translations[currentLanguage].item_name_placeholder);
    if (!itemName) return; // 사용자가 취소함

    const itemAmountStr = prompt(translations[currentLanguage].add_item_title + " - " + translations[currentLanguage].item_amount_placeholder);
    const itemAmount = parseFloat(itemAmountStr);

    if (isNaN(itemAmount) || itemAmount <= 0) {
        alert("유효한 금액을 입력해주세요.");
        return;
    }

    let itemCategory = '';
    if (type === 'expense') {
        const categoryPrompt = prompt(`${translations[currentLanguage].item_category_label}: (${translations[currentLanguage].category_needs}/${translations[currentLanguage].category_wants})`, translations[currentLanguage].category_needs);
        if (categoryPrompt && (categoryPrompt.toLowerCase() === translations[currentLanguage].category_needs.toLowerCase() || categoryPrompt.toLowerCase() === translations[currentLanguage].category_wants.toLowerCase())) {
            itemCategory = categoryPrompt.toLowerCase() === translations[currentLanguage].category_needs.toLowerCase() ? 'needs' : 'wants';
        } else {
            itemCategory = 'needs'; // 기본값
        }
    }

    array.push({ name: itemName, amount: itemAmount, category: itemCategory, frequency: defaultItemFrequency });
    updateDisplay();
    saveData();
}


// 사용자 정의 항목 제거
function removeCustomItem(array, index) {
    array.splice(index, 1);
    updateDisplay();
    saveData();
}

// 5. 언어 적용
function applyLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang; // HTML lang 속성 변경

    // 모든 번역 가능한 요소 업데이트
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLanguage][key];
            } else if (element.tagName === 'OPTION') {
                element.textContent = translations[currentLanguage][key];
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });

    // 헤더 토글 버튼 텍스트 업데이트
    if (languageToggleBtn) {
        languageToggleBtn.textContent = currentLanguage === 'ko' ? 'EN' : 'KO';
    }

    // 예산 규칙 섹션 라벨 수동 업데이트 (data-i18n-key가 아닌 직접 텍스트 변경이 필요할 수 있음)
    // HTML에 직접 data-i18n-key를 추가하면 이 부분은 필요 없어집니다.
    // 현재 HTML에는 <p>필수 지출 (Needs):</p> 와 같이 직접 텍스트가 들어가 있어, 해당 텍스트를 업데이트해야 함.
    // 만약 <p data-i18n-key="needs_label"></p> 와 같이 HTML을 수정하면 위 루프에서 자동 처리됨.
    // 현재 HTML 구조에 맞춰 아래와 같이 직접 업데이트하거나, HTML을 수정하는 것을 추천합니다.
    document.querySelector('.rule-breakdown div:nth-child(1) p:nth-child(1)').textContent = translations[currentLanguage].needs_label + ':';
    document.querySelector('.rule-breakdown div:nth-child(2) p:nth-child(1)').textContent = translations[currentLanguage].wants_label + ':';
    document.querySelector('.rule-breakdown div:nth-child(3) p:nth-child(1)').textContent = translations[currentLanguage].savings_label + ':';
    document.querySelector('.rule-breakdown div.total p:nth-child(1)').textContent = translations[currentLanguage].label_total + ':'; // if you add label_total

    // '규칙' 및 '실제' 라벨 업데이트
    document.querySelectorAll('.rule-breakdown p:nth-child(2)').forEach(p => {
        p.textContent = `${translations[currentLanguage].label_rule}: ${p.querySelector('span').textContent}`;
    });
    document.querySelectorAll('.rule-breakdown p:nth-child(3)').forEach(p => {
        p.textContent = `${translations[currentLanguage].label_actual}: ${p.querySelector('span').textContent}`;
    });

    // AI 보고서 플레이스홀더 텍스트 업데이트
    if (aiReportBox) {
        aiReportBox.querySelector('p').textContent = translations[currentLanguage].ai_report_placeholder;
    }

    // confirm 메시지도 업데이트될 수 있도록 updateDisplay() 호출
    updateDisplay();
}

// 6. 다크 모드 적용
function applyDarkMode(enable) {
    isDarkMode = enable;
    document.body.classList.toggle('dark-mode', isDarkMode);
    if (darkmodeToggleBtn) {
        darkmodeToggleBtn.innerHTML = isDarkMode ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';
    }
    // 차트 색상 업데이트
    updateCharts(
        getTotal(taxInputs, customTaxes),
        getTotal(expenseInputs, customExpenses),
        (parseFloat(grossSalaryInput.value) || 0) * (currentSalaryFrequency === 'annually' ? 1/12 : 1) - getTotal(taxInputs, customTaxes) - getTotal(preTaxDeductInputs, customPreTaxDeductions) - getTotal(postTaxDeductInputs, customPostTaxDeductions),
        (parseFloat(grossSalaryInput.value) || 0) * (currentSalaryFrequency === 'annually' ? 1/12 : 1) - getTotal(taxInputs, customTaxes) - getTotal(preTaxDeductInputs, customPreTaxDeductions) - getTotal(postTaxDeductInputs, customPostTaxDeductions) - getTotal(expenseInputs, customExpenses),
        getTotal(preTaxDeductInputs, customPreTaxDeductions),
        getTotal(postTaxDeductInputs, customPostTaxDeductions)
    );
}

// 7. 데이터 저장 및 로드
function saveData() {
    const data = {
        grossSalaryInput: grossSalaryInput ? grossSalaryInput.value : 0,
        currentSalaryFrequency: currentSalaryFrequency,
        defaultItemFrequency: defaultItemFrequencySelect ? defaultItemFrequencySelect.value : 'monthly',
        taxInputs: {},
        customTaxes: customTaxes,
        preTaxDeductInputs: {},
        customPreTaxDeductions: customPreTaxDeductions,
        postTaxDeductInputs: {},
        customPostTaxDeductions: customPostTaxDeductions,
        expenseInputs: {},
        customExpenses: customExpenses,
        currentLanguage: currentLanguage,
        isDarkMode: isDarkMode,
        selectedBudgetRule: budgetRuleSelect ? budgetRuleSelect.value : '50-30-20' // 선택된 예산 규칙 저장
    };

    for (const key in taxInputs) {
        if (taxInputs[key]) data.taxInputs[key] = taxInputs[key].value;
    }
    for (const key in preTaxDeductInputs) {
        if (preTaxDeductInputs[key]) data.preTaxDeductInputs[key] = preTaxDeductInputs[key].value;
    }
    for (const key in postTaxDeductInputs) {
        if (postTaxDeductInputs[key]) data.postTaxDeductInputs[key] = postTaxDeductInputs[key].value;
    }
    for (const key in expenseInputs) {
        if (expenseInputs[key]) data.expenseInputs[key] = expenseInputs[key].value;
    }

    localStorage.setItem('budgetAppData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('budgetAppData');
    if (savedData) {
        const data = JSON.parse(savedData);

        if (grossSalaryInput && data.grossSalaryInput) grossSalaryInput.value = data.grossSalaryInput;
        if (data.currentSalaryFrequency) currentSalaryFrequency = data.currentSalaryFrequency;
        if (salaryFrequencySelect) salaryFrequencySelect.value = currentSalaryFrequency;
        if (defaultItemFrequencySelect && data.defaultItemFrequency) defaultItemFrequencySelect.value = data.defaultItemFrequency;
        if (data.defaultItemFrequency) defaultItemFrequency = data.defaultItemFrequency;


        for (const key in taxInputs) {
            if (taxInputs[key] && data.taxInputs[key]) taxInputs[key].value = data.taxInputs[key];
        }
        for (const key in preTaxDeductInputs) {
            if (preTaxDeductInputs[key] && data.preTaxDeductInputs[key]) preTaxDeductInputs[key].value = data.preTaxDeductInputs[key];
        }
        for (const key in postTaxDeductInputs) {
            if (postTaxDeductInputs[key] && data.postTaxDeductInputs[key]) postTaxDeductInputs[key].value = data.postTaxDeductInputs[key];
        }
        for (const key in expenseInputs) {
            if (expenseInputs[key] && data.expenseInputs[key]) expenseInputs[key].value = data.expenseInputs[key];
        }

        customTaxes = data.customTaxes || [];
        customPreTaxDeductions = data.customPreTaxDeductions || [];
        customPostTaxDeductions = data.customPostTaxDeductions || [];
        customExpenses = data.customExpenses || [];

        if (data.currentLanguage) applyLanguage(data.currentLanguage);
        if (typeof data.isDarkMode !== 'undefined') applyDarkMode(data.isDarkMode);

        if (budgetRuleSelect && data.selectedBudgetRule) {
            budgetRuleSelect.value = data.selectedBudgetRule;
        }

        updateDisplay();
    } else {
        // 데이터가 없는 경우 초기 상태 설정 및 디스플레이 업데이트
        if (grossSalaryInput) grossSalaryInput.value = 0;
        if (salaryFrequencySelect) salaryFrequencySelect.value = 'monthly';
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = 'monthly';
        currentSalaryFrequency = 'monthly';
        defaultItemFrequency = 'monthly';
        currentLanguage = 'ko';
        isDarkMode = false;

        customTaxes = [];
        customPreTaxDeductions = [];
        customPostTaxDeductions = [];
        customExpenses = [];

        applyLanguage(currentLanguage); // 언어 초기 적용
        applyDarkMode(isDarkMode); // 다크 모드 초기 적용
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
                    color: isDarkMode ? '#fff' : '#333'
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
            type: 'doughnut', // 총 예산 분포는 도넛 차트가 좋을 수 있음
            data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
            options: chartOptions
        });
    }
}

function updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions) {
    const defaultColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#A0B0C0', '#C0A0B0', '#B0C0A0'
    ];
    const darkColors = [
        '#E0567A', '#2A8CD9', '#E6B830', '#3FAAAA', '#8040E0', '#E08020', '#C0C2C4', '#8090A0', '#A08090', '#90A080'
    ];
    const colors = isDarkMode ? darkColors : defaultColors;

    // Helper to update individual chart
    const updateChartData = (chartInstance, inputs, customItems, titlePrefix = '', excludeZero = true) => {
        if (!chartInstance) return;

        let labels = [];
        let data = [];
        let backgroundColors = [];
        let currentColorIndex = 0;

        // Add fixed inputs
        for (const key in inputs) {
            if (inputs[key] && parseFloat(inputs[key].value) > 0) {
                labels.push(translations[currentLanguage][`label_${key.replace(/([A-Z])/g, '_$1').toLowerCase()}`] || key);
                data.push(parseFloat(inputs[key].value));
                backgroundColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        }

        // Add custom items
        customItems.forEach(item => {
            if (item.amount > 0) {
                labels.push(item.name);
                data.push(item.amount);
                backgroundColors.push(colors[currentColorIndex % colors.length]);
                currentColorIndex++;
            }
        });

        // Remove zero values if excludeZero is true
        if (excludeZero) {
            const filteredData = [];
            const filteredLabels = [];
            const filteredColors = [];
            for(let i = 0; i < data.length; i++) {
                if (data[i] > 0) {
                    filteredData.push(data[i]);
                    filteredLabels.push(labels[i]);
                    filteredColors.push(backgroundColors[i]);
                }
            }
            labels = filteredLabels;
            data = filteredData;
            backgroundColors = filteredColors;
        }

        // If no data, clear chart
        if (data.every(val => val === 0)) {
             chartInstance.data.labels = [];
             chartInstance.data.datasets[0].data = [];
             chartInstance.data.datasets[0].backgroundColor = [];
        } else {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = data;
            chartInstance.data.datasets[0].backgroundColor = backgroundColors;
        }


        // Update legend label color based on dark mode
        chartInstance.options.plugins.legend.labels.color = isDarkMode ? '#fff' : '#333';
        chartInstance.update();
    };

    // Update individual charts
    updateChartData(taxChartInstance, taxInputs, customTaxes, translations[currentLanguage].section_taxes_title);
    updateChartData(preTaxDeductChartInstance, preTaxDeductInputs, customPreTaxDeductions, translations[currentLanguage].section_pre_tax_title);
    updateChartData(postTaxDeductChartInstance, postTaxDeductInputs, customPostTaxDeductions, translations[currentLanguage].section_post_tax_title);
    updateChartData(expensesChartInstance, expenseInputs, customExpenses, translations[currentLanguage].section_expenses_title);

    // Update budget distribution chart (Doughnut chart)
    if (budgetDistributionChartInstance) {
        const budgetLabels = [
            translations[currentLanguage].label_total_taxes,
            translations[currentLanguage].label_total_pre_tax,
            translations[currentLanguage].label_total_post_tax,
            translations[currentLanguage].label_total_expenses,
            translations[currentLanguage].label_remaining_budget
        ];

        const budgetData = [
            totalTaxes,
            totalPreTaxDeductions,
            totalPostTaxDeductions,
            totalExpenses,
            remainingBudget
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
        budgetDistributionChartInstance.options.plugins.legend.labels.color = isDarkMode ? '#fff' : '#333';
        budgetDistributionChartInstance.update();
    }
}


// 9. 디스플레이 업데이트 (계산 및 UI 갱신)
function updateDisplay() {
    let grossSalary = parseFloat(grossSalaryInput.value) || 0;

    // 선택된 급여 주기에 따라 연간 급여 조정
    switch (currentSalaryFrequency) {
        case 'annually':
            grossSalary = grossSalary; // Already annual
            annualSalarySummaryDisplay.textContent = formatCurrency(grossSalary);
            grossSalary = grossSalary / 12; // Use monthly gross for calculations
            break;
        case 'monthly':
            annualSalarySummaryDisplay.textContent = formatCurrency(grossSalary * 12);
            break;
        case 'weekly':
            annualSalarySummaryDisplay.textContent = formatCurrency(grossSalary * 52);
            grossSalary = grossSalary * 4; // Approx 4 weeks in a month for monthly calculations
            break;
        case 'bi-weekly':
            annualSalarySummaryDisplay.textContent = formatCurrency(grossSalary * 26);
            grossSalary = grossSalary * 2; // Approx 2 bi-weekly periods in a month
            break;
    }

    // 커스텀 항목 렌더링
    renderCustomList(customTaxList, customTaxes, 'tax');
    renderCustomList(customPreTaxDeductList, customPreTaxDeductions, 'pre-tax');
    renderCustomList(customPostTaxDeductList, customPostTaxDeductions, 'post-tax');
    renderCustomList(customExpenseList, customExpenses, 'expense');

    // 총계 계산
    const totalTaxes = getTotal(taxInputs, customTaxes);
    const totalPreTaxDeductions = getTotal(preTaxDeductInputs, customPreTaxDeductions);
    const totalPostTaxDeductions = getTotal(postTaxDeductInputs, customPostTaxDeductions);
    const totalExpenses = getTotal(expenseInputs, customExpenses); // Fixed expenses + custom expenses
    const totalDeductions = totalTaxes + totalPreTaxDeductions + totalPostTaxDeductions;


    // 순 급여 계산 (Gross - All Deductions)
    const netSalary = grossSalary - totalTaxes - totalPreTaxDeductions - totalPostTaxDeductions;

    const remainingBudget = netSalary - totalExpenses;


    // UI 업데이트
    if (grossSalarySummaryDisplay) grossSalarySummaryDisplay.textContent = formatCurrency(grossSalary);
    if (totalTaxesDisplay) totalTaxesDisplay.textContent = formatCurrency(totalTaxes);
    if (totalPreTaxDisplay) totalPreTaxDisplay.textContent = formatCurrency(totalPreTaxDeductions);
    if (totalPostTaxDisplay) totalPostTaxDisplay.textContent = formatCurrency(totalPostTaxDeductions);
    if (netSalaryDisplay) netSalaryDisplay.textContent = formatCurrency(netSalary);
    if (totalExpensesDisplay) totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
    if (remainingBudgetDisplay) remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);

    // 예산 규칙 적용
    applyBudgetRule(grossSalary, totalExpenses, netSalary, totalDeductions);

    // 차트 업데이트
    updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions);

    saveData(); // 데이터 변경 시마다 저장
}

// 10. 예산 규칙 정의
const BUDGET_RULES = {
    "50-30-20": { needs: 0.5, wants: 0.3, savings: 0.2 },
    "70-20-10": { needs: 0.7, wants: 0.2, savings: 0.1 },
    "80-20": { needs: 0.8, wants: 0.0, savings: 0.2 } // 80/20 rule often implies 0 wants
};

// 11. 예산 규칙 적용 함수
function applyBudgetRule(grossIncome, totalExpenses, netSalary, totalDeductions) {
    // Null checks for display elements
    if (!ruleNeedsDisplay || !ruleWantsDisplay || !ruleSavingsDisplay || !ruleTotalDisplay ||
        !actualNeedsDisplay || !actualWantsDisplay || !actualSavingsDisplay || !actualTotalDisplay || !budgetStatusDisplay) {
        console.warn("One or more budget rule display elements are missing from the DOM.");
        return; // Exit if essential elements are missing
    }

    const selectedRule = budgetRuleSelect.value;
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

    // 1. Calculate budget based on the rule (based on gross income for rule calculation)
    const ruleNeeds = grossIncome * rule.needs;
    const ruleWants = grossIncome * rule.wants;
    const ruleSavings = grossIncome * rule.savings;
    const ruleTotal = ruleNeeds + ruleWants + ruleSavings; // Should ideally be grossIncome

    ruleNeedsDisplay.textContent = formatCurrency(ruleNeeds);
    ruleWantsDisplay.textContent = formatCurrency(ruleWants);
    ruleSavingsDisplay.textContent = formatCurrency(ruleSavings);
    ruleTotalDisplay.textContent = formatCurrency(ruleTotal);

    // 2. Calculate actual spending based on user inputs
    let actualNeeds = 0;
    let actualWants = 0;
    let actualSavingsFromNet = netSalary; // Start with net salary for savings calculation

    // Sum fixed expense inputs for Needs (as per common 50/30/20 interpretation)
    actualNeeds += (parseFloat(expenseInputs.rent?.value) || 0);
    actualNeeds += (parseFloat(expenseInputs.utilities?.value) || 0);
    actualNeeds += (parseFloat(expenseInputs.internet?.value) || 0);
    actualNeeds += (parseFloat(expenseInputs.phone?.value) || 0);
    actualNeeds += (parseFloat(expenseInputs.groceries?.value) || 0);
    actualNeeds += (parseFloat(expenseInputs.transport?.value) || 0);
    actualNeeds += (parseFloat(expenseInputs.health?.value) || 0);

    // Sum fixed expense inputs for Wants
    actualWants += (parseFloat(expenseInputs.dining?.value) || 0);
    actualWants += (parseFloat(expenseInputs.shopping?.value) || 0);
    actualWants += (parseFloat(expenseInputs.entertainment?.value) || 0);

    // Add custom expenses based on their 'category'
    customExpenses.forEach(item => {
        if (item.category === 'needs') {
            actualNeeds += item.amount;
        } else if (item.category === 'wants') {
            actualWants += item.amount;
        } else {
            // If category is not specified or unknown, default to needs
            actualNeeds += item.amount;
        }
    });

    // Actual Savings: Net salary minus all expenses (needs + wants)
    const actualSavings = netSalary - (actualNeeds + actualWants);

    actualNeedsDisplay.textContent = formatCurrency(actualNeeds);
    actualWantsDisplay.textContent = formatCurrency(actualWants);
    actualSavingsDisplay.textContent = formatCurrency(actualSavings);

    // Actual total budget should be grossIncome (or netSalary if rule applied to net)
    // For 50/30/20, it's typically applied to gross income after taxes, so using netSalary here is more common for "actual total"
    actualTotalDisplay.textContent = formatCurrency(netSalary); // Changed to netSalary for actual total

    // 3. Evaluate budget status
    let statusText = "";
    let statusColor = "var(--summary-text-color)"; // Default to positive color

    // Check Needs
    if (actualNeeds > ruleNeeds) {
        statusText += `${translations[currentLanguage].needs_label} ${translations[currentLanguage].status_over}. `;
        statusColor = "var(--danger-color)";
    }

    // Check Wants (only if the rule has a Wants component)
    if (rule.wants > 0 && actualWants > ruleWants) {
        statusText += `${translations[currentLanguage].wants_label} ${translations[currentLanguage].status_over}. `;
        statusColor = "var(--danger-color)";
    }

    // Check Savings
    if (actualSavings < ruleSavings) {
        statusText += `${translations[currentLanguage].savings_label} ${translations[currentLanguage].status_under}. `;
        statusColor = "var(--danger-color)";
    }

    // Overall deficit check: if net salary minus total actual expenses is negative
    if (netSalary - (actualNeeds + actualWants) < 0) {
        statusText = translations[currentLanguage].status_over + " (" + translations[currentLanguage].label_deficit + ")";
        statusColor = "var(--danger-color)";
    } else if (statusText.trim() === "") { // If no specific issues found above
        statusText = translations[currentLanguage].status_ok;
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

// 12. 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    loadData(); // DOM 로드 후 저장된 데이터 로드

    initializeCharts(); // 차트 초기화 (데이터 로드 후)
    updateDisplay(); // 초기 UI 업데이트

    // 급여 양식 입력 변경 시
    if (grossSalaryInput) {
        grossSalaryInput.addEventListener('input', updateDisplay);
    }
    if (salaryFrequencySelect) {
        salaryFrequencySelect.addEventListener('change', (e) => {
            currentSalaryFrequency = e.target.value;
            updateDisplay();
        });
    }

    // 기본 항목 주기 변경 시
    if (defaultItemFrequencySelect) {
        defaultItemFrequencySelect.addEventListener('change', (e) => {
            defaultItemFrequency = e.target.value;
            saveData(); // 기본 주기만 변경 시에도 저장
        });
    }

    // 고정 입력 필드 변경 시
    const allInputGroups = [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs];
    allInputGroups.forEach(group => {
        for (const key in group) {
            if (group[key]) {
                group[key].addEventListener('input', updateDisplay);
            }
        }
    });

    // 커스텀 항목 추가 버튼
    document.querySelectorAll('.add-custom-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            switch (type) {
                case 'tax':
                    addCustomItem(customTaxes, 'tax');
                    break;
                case 'pre-tax':
                    addCustomItem(customPreTaxDeductions, 'pre-tax');
                    break;
                case 'post-tax':
                    addCustomItem(customPostTaxDeductions, 'post-tax');
                    break;
                case 'expense':
                    addCustomItem(customExpenses, 'expense');
                    break;
            }
        });
    });

    // Custom Item Remove Buttons (Event Delegation)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn') || e.target.closest('.remove-btn')) {
            const btn = e.target.closest('.remove-btn');
            const index = parseInt(btn.dataset.index);
            const type = btn.dataset.type;

            if (confirm(translations[currentLanguage].remove_item + '?')) {
                switch (type) {
                    case 'tax':
                        removeCustomItem(customTaxes, index);
                        break;
                    case 'pre-tax':
                        removeCustomItem(customPreTaxDeductions, index);
                        break;
                    case 'post-tax':
                        removeCustomItem(customPostTaxDeductions, index);
                        break;
                    case 'expense':
                        removeCustomItem(customExpenses, index);
                        break;
                }
            }
        }
    });

    // Language Toggle
    if (languageToggleBtn) {
        languageToggleBtn.addEventListener('click', () => {
            const newLang = currentLanguage === 'ko' ? 'en' : 'ko';
            applyLanguage(newLang);
            saveData();
        });
    }

    // Dark Mode Toggle
    if (darkmodeToggleBtn) {
        darkmodeToggleBtn.addEventListener('click', () => {
            applyDarkMode(!isDarkMode);
            saveData();
        });
    }

    // Data Management: Export JSON
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            const data = {
                grossSalaryInput: grossSalaryInput.value,
                currentSalaryFrequency: currentSalaryFrequency,
                defaultItemFrequency: defaultItemFrequencySelect ? defaultItemFrequencySelect.value : 'monthly',
                taxInputs: {},
                customTaxes: customTaxes,
                preTaxDeductInputs: {},
                customPreTaxDeductions: customPreTaxDeductions,
                postTaxDeductInputs: {},
                customPostTaxDeductions: customPostTaxDeductions,
                expenseInputs: {},
                customExpenses: customExpenses,
                currentLanguage: currentLanguage,
                isDarkMode: isDarkMode,
                selectedBudgetRule: budgetRuleSelect ? budgetRuleSelect.value : '50-30-20'
            };

            for (const key in taxInputs) {
                if (taxInputs[key]) data.taxInputs[key] = taxInputs[key].value;
            }
            for (const key in preTaxDeductInputs) {
                if (preTaxDeductInputs[key]) data.preTaxDeductInputs[key] = preTaxDeductInputs[key].value;
            }
            for (const key in postTaxDeductInputs) {
                if (postTaxDeductInputs[key]) data.postTaxDeductInputs[key] = postTaxDeductInputs[key].value;
            }
            for (const key in expenseInputs) {
                if (expenseInputs[key]) data.expenseInputs[key] = expenseInputs[key].value;
            }

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
            alert(translations[currentLanguage].alert_json_export_success);
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
                        if (importedData && typeof importedData.grossSalaryInput !== 'undefined' && importedData.taxInputs) {
                            localStorage.setItem('budgetAppData', JSON.stringify(importedData));
                            loadData(); // 데이터 로드 및 UI 업데이트
                            alert(translations[currentLanguage].alert_data_import_success);
                        } else {
                            alert(translations[currentLanguage].alert_invalid_json);
                        }
                    } catch (error) {
                        alert(translations[currentLanguage].alert_json_parse_error + error.message);
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
            if (confirm(translations[currentLanguage].confirm_clear_data)) {
                localStorage.removeItem('budgetAppData');
                if (grossSalaryInput) grossSalaryInput.value = 0;
                for (const key in taxInputs) {
                    if (taxInputs[key]) taxInputs[key].value = 0;
                }
                for (const key in preTaxDeductInputs) {
                    if (preTaxDeductInputs[key]) preTaxDeductInputs[key].value = 0;
                }
                for (const key in postTaxDeductInputs) {
                    if (postTaxDeductInputs[key]) postTaxDeductInputs[key].value = 0;
                }
                for (const key in expenseInputs) {
                    if (expenseInputs[key]) expenseInputs[key].value = 0;
                }

                customTaxes = [];
                customPreTaxDeductions = [];
                customPostTaxDeductions = [];
                customExpenses = [];

                updateDisplay(); // UI 다시 그리기
                alert(translations[currentLanguage].alert_data_cleared);
            }
        });
    }

    // AI Report Generation (Placeholder for actual AI integration)
    if (aiReportBtn && aiReportBox) {
        aiReportBtn.addEventListener('click', () => {
            aiReportBox.innerHTML = `<p>${translations[currentLanguage].ai_report_placeholder}</p>`;
        });
    }

    // Budget Rule Select Listener
    if (budgetRuleSelect) {
        budgetRuleSelect.addEventListener("change", () => {
            updateDisplay();
        });
    }
});
