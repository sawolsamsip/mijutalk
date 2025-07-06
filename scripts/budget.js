// 0. 전역 변수 (초기에는 null 또는 나중에 할당될 수 있도록 let 사용)
let grossSalaryInput = null;
let salaryFrequencySelect = null;
let defaultItemFrequencySelect = null;

// Summary Displays
let annualSalarySummaryDisplay = null;
let grossSalarySummaryDisplay = null;
let totalTaxesDisplay = null;
let totalPreTaxDisplay = null;
let totalPostTaxDisplay = null;
let netSalaryDisplay = null;
let totalExpensesDisplay = null;
let remainingBudgetDisplay = null;

// Tax, Deduction, Expense Inputs (객체 내부는 DOMContentLoaded에서 할할당)
let taxInputs = {};
let preTaxDeductInputs = {};
let postTaxDeductInputs = {};
let expenseInputs = {};

// Custom Lists
let customTaxList = null;
let customPreTaxDeductList = null;
let customPostTaxDeductList = null;
let customExpenseList = null;

// Buttons & Toggles
let addTaxBtn = null;
let addPreTaxDeductBtn = null;
let addPostTaxDeductBtn = null;
let addExpenseBtn = null;
let languageToggleBtn = null;
let darkmodeToggleBtn = null;

// Data Management Buttons & Inputs
let exportJsonBtn = null;
let importJsonBtn = null;
let importJsonInput = null;
let clearAllDataBtn = null;

// AI Report
let aiReportBtn = null;
let aiReportBox = null;

// Budget Rule Elements
let budgetRuleSelect = null;
let ruleNeedsDisplay = null;
let ruleWantsDisplay = null;
let ruleSavingsDisplay = null;
let ruleTotalDisplay = null;
let actualNeedsDisplay = null;
let actualWantsDisplay = null;
let actualSavingsDisplay = null;
let actualTotalDisplay = null;
let budgetStatusDisplay = null;


// Chart Instances
let taxChartInstance = null;
let preTaxDeductChartInstance = null;
let postTaxDeductChartInstance = null;
let expensesChartInstance = null;
let budgetDistributionChartInstance = null;

// 1. 초기 데이터
const data = {
    grossSalary: 0,
    salaryFrequency: 'annual', // annual, monthly, bi-weekly, weekly
    defaultItemFrequency: 'monthly', // monthly, annual, one-time
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
        '401k-trad': 0,
        traditionalIRA: 0,
        hsa: 0,
        custom: []
    },
    postTaxDeductions: {
        spp: 0,
        adnd: 0,
        '401k-roth': 0,
        ltd: 0,
        rothIRA: 0,
        healthInsurance: 0,
        lifeInsurance: 0,
        custom: []
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
        custom: []
    },
    budgetRule: '50-30-20', // New property for budget rule
    currentLanguage: 'ko', // 기본 언어 설정 (한국어)
    isDarkMode: false // 기본 다크모드 설정 (비활성화)
};

// 2. 언어별 텍스트
const translations = {
    en: {
        gross_salary: 'Gross Salary',
        annual: 'Annual',
        monthly: 'Monthly',
        bi_weekly: 'Bi-Weekly',
        weekly: 'Weekly',
        one_time: 'One-Time',
        taxes: 'Taxes',
        federal: 'Federal Tax',
        state: 'State Tax',
        oasdi: 'OASDI',
        medicare: 'Medicare',
        casdi: 'CASDI',
        pre_tax_deductions: 'Pre-Tax Deductions',
        medical: 'Medical',
        dental: 'Dental',
        vision: 'Vision',
        '401k_trad': '401K Traditional',
        traditional_ira: 'Traditional IRA',
        hsa: 'HSA',
        post_tax_deductions: 'Post-Tax Deductions',
        spp: 'SPP',
        adnd: 'AD&D',
        '401k_roth': '401K Roth',
        ltd: 'LTD',
        roth_ira: 'Roth IRA',
        health_insurance: 'Health Insurance',
        life_insurance: 'Life Insurance',
        expenses: 'Expenses',
        rent: 'Rent',
        utilities: 'Utilities',
        internet: 'Internet',
        phone: 'Phone',
        groceries: 'Groceries',
        dining: 'Dining',
        transport: 'Transport',
        shopping: 'Shopping',
        health: 'Health',
        entertainment: 'Entertainment',
        add_custom: 'Add Custom',
        summary: 'Summary',
        annual_salary: 'Annual Salary',
        gross_salary_summary: 'Gross Salary',
        total_taxes: 'Total Taxes',
        total_pre_tax: 'Total Pre-Tax',
        total_post_tax: 'Total Post-Tax',
        net_salary: 'Net Salary',
        total_expenses: 'Total Expenses',
        remaining_budget: 'Remaining Budget',
        custom_item_name: 'Custom Item Name',
        custom_item_amount: 'Amount',
        remove: 'Remove',
        currency_symbol: '$',
        monthly: 'Monthly',
        annual: 'Annual',
        one_time: 'One-Time',
        save_data: 'Save Data',
        load_data: 'Load Data',
        export_json: 'Export Data (JSON)',
        import_json: 'Import Data (JSON)',
        clear_all_data: 'Clear All Data',
        alert_data_saved: 'Data saved successfully!',
        alert_data_loaded: 'Data loaded successfully!',
        alert_data_cleared: 'All data cleared!',
        confirm_clear_data: 'Are you sure you want to clear all data?',
        confirm_import_data: 'Are you sure you want to import data? This will overwrite existing data.',
        invalid_json: 'Invalid JSON file.',
        chart_taxes: 'Taxes Distribution',
        chart_pre_tax: 'Pre-Tax Deductions Distribution',
        chart_post_tax: 'Post-Tax Deductions Distribution',
        chart_expenses: 'Expenses Distribution',
        chart_budget_distribution: 'Overall Budget Distribution',
        chart_labels_taxes: 'Taxes',
        chart_labels_pre_tax_deductions: 'Pre-Tax Deductions',
        chart_labels_post_tax_deductions: 'Post-Tax Deductions',
        chart_labels_expenses: 'Expenses',
        chart_labels_remaining_budget: 'Remaining Budget',
        needs: 'Needs',
        wants: 'Wants',
        savings: 'Savings',
        total: 'Total',
        budget_rule: 'Budget Rule',
        '50-30-20': '50/30/20 Rule',
        '70-20-10': '70/20/10 Rule',
        '80-20': '80/20 Rule',
        ai_report: 'AI Report',
        ai_report_placeholder: 'AI budget report will be generated here. (Feature coming soon!)',
        budget_status_surplus: 'You have a budget surplus!',
        budget_status_deficit: 'You have a budget deficit!',
        budget_status_balanced: 'Your budget is balanced!',
        theme: 'Theme',
        dark_mode: 'Dark Mode',
        language: 'Language'
    },
    ko: {
        gross_salary: '세전 급여',
        annual: '연간',
        monthly: '월간',
        bi_weekly: '격주',
        weekly: '주간',
        one_time: '일회성',
        taxes: '세금',
        federal: '연방세',
        state: '주세',
        oasdi: 'OASDI',
        medicare: '메디케어',
        casdi: 'CASDI',
        pre_tax_deductions: '세전 공제',
        medical: '의료비',
        dental: '치과비',
        vision: '시력',
        '401k_trad': '401K 전통',
        traditional_ira: '전통 IRA',
        hsa: 'HSA',
        post_tax_deductions: '세후 공제',
        spp: 'SPP',
        adnd: 'AD&D',
        '401k_roth': '401K Roth',
        ltd: 'LTD',
        roth_ira: 'Roth IRA',
        health_insurance: '건강 보험',
        life_insurance: '생명 보험',
        expenses: '지출',
        rent: '월세',
        utilities: '공과금',
        internet: '인터넷',
        phone: '통신비',
        groceries: '식료품',
        dining: '외식비',
        transport: '교통비',
        shopping: '쇼핑',
        health: '건강/피트니스',
        entertainment: '오락',
        add_custom: '사용자 추가',
        summary: '요약',
        annual_salary: '연간 급여',
        gross_salary_summary: '세전 급여',
        total_taxes: '총 세금',
        total_pre_tax: '총 세전 공제',
        total_post_tax: '총 세후 공제',
        net_salary: '순 급여',
        total_expenses: '총 지출',
        remaining_budget: '남은 예산',
        custom_item_name: '항목 이름',
        custom_item_amount: '금액',
        remove: '삭제',
        currency_symbol: '원',
        monthly: '월간',
        annual: '연간',
        one_time: '일회성',
        save_data: '데이터 저장',
        load_data: '데이터 불러오기',
        export_json: '데이터 내보내기 (JSON)',
        import_json: '데이터 가져오기 (JSON)',
        clear_all_data: '모든 데이터 지우기',
        alert_data_saved: '데이터가 성공적으로 저장되었습니다!',
        alert_data_loaded: '데이터가 성공적으로 로드되었습니다!',
        alert_data_cleared: '모든 데이터가 지워졌습니다!',
        confirm_clear_data: '정말 모든 데이터를 지우시겠습니까?',
        confirm_import_data: '데이터를 가져오시겠습니까? 기존 데이터는 덮어쓰여집니다.',
        invalid_json: '유효하지 않은 JSON 파일입니다.',
        chart_taxes: '세금 분배',
        chart_pre_tax: '세전 공제 분배',
        chart_post_tax: '세후 공제 분배',
        chart_expenses: '지출 분배',
        chart_budget_distribution: '전체 예산 분배',
        chart_labels_taxes: '세금',
        chart_labels_pre_tax_deductions: '세전 공제',
        chart_labels_post_tax_deductions: '세후 공제',
        chart_labels_expenses: '지출',
        chart_labels_remaining_budget: '남은 예산',
        needs: '필수',
        wants: '선택',
        savings: '저축',
        total: '총합',
        budget_rule: '예산 규칙',
        '50-30-20': '50/30/20 규칙',
        '70-20-10': '70/20/10 규칙',
        '80-20': '80/20 규칙',
        ai_report: 'AI 보고서',
        ai_report_placeholder: 'AI 예산 보고서가 여기에 생성됩니다. (기능 예정!)',
        budget_status_surplus: '예산 흑자입니다!',
        budget_status_deficit: '예산 적자입니다!',
        budget_status_balanced: '예산이 균형을 이룹니다!',
        theme: '테마',
        dark_mode: '다크 모드',
        language: '언어'
    }
};

// 3. 헬퍼 함수: 주파수 변환
function convertToAnnual(amount, frequency) {
    switch (frequency) {
        case 'monthly':
            return amount * 12;
        case 'bi-weekly':
            return amount * 26;
        case 'weekly':
            return amount * 52;
        case 'annual':
        default:
            return amount;
    }
}

function convertFromAnnual(amount, frequency) {
    switch (frequency) {
        case 'monthly':
            return amount / 12;
        case 'bi-weekly':
            return amount / 26;
        case 'weekly':
            return amount / 52;
        case 'annual':
        default:
            return amount;
    }
}

// 4. 계산 함수
function calculateTotalAnnual(items) {
    return Object.values(items).reduce((sum, amount) => sum + amount, 0);
}

function calculateCustomAnnual(customItems, defaultFrequency) {
    return customItems.reduce((sum, item) => {
        const itemAmount = parseFloat(item.amount) || 0;
        const itemFrequency = item.frequency || defaultFrequency;
        return sum + convertToAnnual(itemAmount, itemFrequency);
    }, 0);
}

// 5. 주요 계산 로직
function calculateBudget() {
    const annualGrossSalary = convertToAnnual(data.grossSalary, data.salaryFrequency);

    const totalAnnualTaxes = calculateTotalAnnual(data.taxes) + calculateCustomAnnual(data.taxes.custom, data.defaultItemFrequency);
    const totalAnnualPreTaxDeductions = calculateTotalAnnual(data.preTaxDeductions) + calculateCustomAnnual(data.preTaxDeductions.custom, data.defaultItemFrequency);
    const totalAnnualPostTaxDeductions = calculateTotalAnnual(data.postTaxDeductions) + calculateCustomAnnual(data.postTaxDeductions.custom, data.defaultItemFrequency);
    const totalAnnualExpenses = calculateTotalAnnual(data.expenses) + calculateCustomAnnual(data.expenses.custom, data.defaultItemFrequency);

    const netSalary = annualGrossSalary - totalAnnualTaxes - totalAnnualPreTaxDeductions - totalAnnualPostTaxDeductions;
    const remainingBudget = netSalary - totalAnnualExpenses;

    return {
        annualGrossSalary,
        totalAnnualTaxes,
        totalAnnualPreTaxDeductions,
        totalAnnualPostTaxDeductions,
        netSalary,
        totalAnnualExpenses,
        remainingBudget
    };
}

// 6. UI 업데이트 및 렌더링 함수
function formatCurrency(amount) {
    const symbol = translations[data.currentLanguage].currency_symbol;
    return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function updateDisplay() {
    const {
        annualGrossSalary,
        totalAnnualTaxes,
        totalAnnualPreTaxDeductions,
        totalAnnualPostTaxDeductions,
        netSalary,
        totalAnnualExpenses,
        remainingBudget
    } = calculateBudget();

    // 입력 필드 업데이트
    if (grossSalaryInput) grossSalaryInput.value = data.grossSalary;
    if (salaryFrequencySelect) salaryFrequencySelect.value = data.salaryFrequency;
    if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;
    if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule;

    for (const key in taxInputs) {
        if (taxInputs[key]) taxInputs[key].value = data.taxes[key];
    }
    for (const key in preTaxDeductInputs) {
        if (preTaxDeductInputs[key]) preTaxDeductInputs[key].value = data.preTaxDeductions[key];
    }
    for (const key in postTaxDeductInputs) {
        if (postTaxDeductInputs[key]) postTaxDeductInputs[key].value = data.postTaxDeductions[key];
    }
    for (const key in expenseInputs) {
        if (expenseInputs[key]) expenseInputs[key].value = data.expenses[key];
    }

    // 요약 디스플레이 업데이트
    if (annualSalarySummaryDisplay) annualSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary);
    if (grossSalarySummaryDisplay) grossSalarySummaryDisplay.textContent = formatCurrency(convertToAnnual(data.grossSalary, data.salaryFrequency));
    if (totalTaxesDisplay) totalTaxesDisplay.textContent = formatCurrency(totalAnnualTaxes);
    if (totalPreTaxDisplay) totalPreTaxDisplay.textContent = formatCurrency(totalAnnualPreTaxDeductions);
    if (totalPostTaxDisplay) totalPostTaxDisplay.textContent = formatCurrency(totalAnnualPostTaxDeductions);
    if (netSalaryDisplay) netSalaryDisplay.textContent = formatCurrency(netSalary);
    if (totalExpensesDisplay) totalExpensesDisplay.textContent = formatCurrency(totalAnnualExpenses);
    if (remainingBudgetDisplay) {
        remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);
        if (remainingBudget < 0) {
            remainingBudgetDisplay.classList.add('negative');
            remainingBudgetDisplay.classList.remove('positive', 'balanced');
        } else if (remainingBudget > 0) {
            remainingBudgetDisplay.classList.add('positive');
            remainingBudgetDisplay.classList.remove('negative', 'balanced');
        } else {
            remainingBudgetDisplay.classList.add('balanced');
            remainingBudgetDisplay.classList.remove('negative', 'positive');
        }
    }


    // 커스텀 리스트 렌더링
    renderCustomList(customTaxList, data.taxes.custom, 'tax');
    renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
    renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
    renderCustomList(customExpenseList, data.expenses.custom, 'expense');

    applyLanguage(data.currentLanguage);
    applyDarkMode(data.isDarkMode);
    updateCharts();
    applyBudgetRule(); // 예산 규칙 적용 함수 호출
    updateBudgetStatus(remainingBudget);
    saveData(); // 데이터 자동 저장
}

function renderCustomList(listElement, customItems, type) {
    if (!listElement) {
        console.warn(`renderCustomList: List element not found for type ${type}`);
        return;
    }
    listElement.innerHTML = ''; // 기존 항목 지우기

    customItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('custom-item-row');
        li.innerHTML = `
            <input type="text" value="${item.name}" placeholder="${translations[data.currentLanguage].custom_item_name}" class="custom-item-name" data-index="${index}" data-type="${type}">
            <input type="number" value="${item.amount}" placeholder="${translations[data.currentLanguage].custom_item_amount}" class="custom-item-amount" data-index="${index}" data-type="${type}">
            <select class="custom-item-frequency" data-index="${index}" data-type="${type}">
                <option value="monthly"${item.frequency === 'monthly' ? ' selected' : ''}>${translations[data.currentLanguage].monthly}</option>
                <option value="annual"${item.frequency === 'annual' ? ' selected' : ''}>${translations[data.currentLanguage].annual}</option>
                <option value="one-time"${item.frequency === 'one-time' ? ' selected' : ''}>${translations[data.currentLanguage].one_time}</option>
            </select>
            <button class="remove-custom-btn" data-index="${index}" data-type="${type}">${translations[data.currentLanguage].remove}</button>
        `;
        listElement.appendChild(li);
    });

    // 이벤트 리스너 재부착 (새로 생성된 요소들에 대해)
    listElement.querySelectorAll('.custom-item-name').forEach(input => {
        input.addEventListener('input', handleCustomItemChange);
    });
    listElement.querySelectorAll('.custom-item-amount').forEach(input => {
        input.addEventListener('input', handleCustomItemChange);
    });
    listElement.querySelectorAll('.custom-item-frequency').forEach(select => {
        select.addEventListener('change', handleCustomItemChange);
    });
    listElement.querySelectorAll('.remove-custom-btn').forEach(button => {
        button.addEventListener('click', removeCustomItem);
    });
}

function updateBudgetStatus(remainingBudget) {
    if (budgetStatusDisplay) {
        if (remainingBudget > 0) {
            budgetStatusDisplay.textContent = translations[data.currentLanguage].budget_status_surplus;
            budgetStatusDisplay.className = 'budget-status text-green-500';
        } else if (remainingBudget < 0) {
            budgetStatusDisplay.textContent = translations[data.currentLanguage].budget_status_deficit;
            budgetStatusDisplay.className = 'budget-status text-red-500';
        } else {
            budgetStatusDisplay.textContent = translations[data.currentLanguage].budget_status_balanced;
            budgetStatusDisplay.className = 'budget-status text-blue-500';
        }
    }
}


// 7. 커스텀 항목 추가/변경/삭제 핸들러
function addCustomItem(type) {
    const newItem = {
        name: '',
        amount: 0,
        frequency: data.defaultItemFrequency
    };
    data[type].custom.push(newItem);
    updateDisplay();
}

function handleCustomItemChange(event) {
    const {
        index,
        type
    } = event.target.dataset;
    const item = data[type].custom[parseInt(index)];

    if (event.target.classList.contains('custom-item-name')) {
        item.name = event.target.value;
    } else if (event.target.classList.contains('custom-item-amount')) {
        item.amount = parseFloat(event.target.value) || 0;
    } else if (event.target.classList.contains('custom-item-frequency')) {
        item.frequency = event.target.value;
    }
    updateDisplay();
}

function removeCustomItem(event) {
    const {
        index,
        type
    } = event.target.dataset;
    data[type].custom.splice(parseInt(index), 1);
    updateDisplay();
}

// 8. 언어 변경
function applyLanguage(lang) {
    data.currentLanguage = lang;
    document.querySelectorAll('[data-lang-key]').forEach(element => {
        const key = element.dataset.langKey;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Placeholder 속성 업데이트
    // DOMContentLoaded에서 할당된 변수들이 null이 아닌지 항상 체크합니다.
    if (grossSalaryInput) grossSalaryInput.placeholder = translations[lang].gross_salary;
    
    // 이 부분은 renderCustomList에 의해 동적으로 생성된 요소이므로,
    // applyLanguage가 호출될 때마다 다시 쿼리해야 합니다.
    document.querySelectorAll('.custom-item-name').forEach(input => {
        input.placeholder = translations[lang].custom_item_name;
    });
    document.querySelectorAll('.custom-item-amount').forEach(input => {
        input.placeholder = translations[lang].custom_item_amount;
    });
}

// 9. 다크 모드 토글
function applyDarkMode(isDark) {
    data.isDarkMode = isDark;
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}


// 10. 데이터 저장/로드 (Local Storage)
function saveData() {
    localStorage.setItem('budgetData', JSON.stringify(data));
    // console.log('Data saved');
    // alert(translations[data.currentLanguage].alert_data_saved); // 자동 저장 시에는 알림 생략
}

function loadData() {
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
        Object.assign(data, JSON.parse(savedData));
        // 이전에 존재하지 않던 새 필드(budgetRule, currentLanguage, isDarkMode)를 위한 처리
        if (data.budgetRule === undefined) data.budgetRule = '50-30-20';
        if (data.currentLanguage === undefined) data.currentLanguage = 'ko';
        if (data.isDarkMode === undefined) data.isDarkMode = false;
        // 커스텀 항목에 frequency 필드가 없는 경우 기본값 할당
        ['taxes', 'preTaxDeductions', 'postTaxDeductions', 'expenses'].forEach(type => {
            if (data[type] && data[type].custom) {
                data[type].custom.forEach(item => {
                    if (item.frequency === undefined) {
                        item.frequency = data.defaultItemFrequency;
                    }
                });
            }
        });

        if (grossSalaryInput) grossSalaryInput.value = data.grossSalary;
        if (salaryFrequencySelect) salaryFrequencySelect.value = data.salaryFrequency;
        if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = data.defaultItemFrequency;
        if (budgetRuleSelect) budgetRuleSelect.value = data.budgetRule; // 새 필드 로드

        // Input fields update
        [taxInputs, preTaxDeductInputs, postTaxDeductInputs, expenseInputs].forEach(inputsGroup => {
            for (const key in inputsGroup) {
                if (inputsGroup[key]) inputsGroup[key].value = data[inputsGroup === taxInputs ? 'taxes' : inputsGroup === preTaxDeductInputs ? 'preTaxDeductions' : inputsGroup === postTaxDeductInputs ? 'postTaxDeductions' : 'expenses'][key];
            }
        });

        // HTML 요소가 null이 아닐 때만 innerHTML을 지웁니다.
        if (customTaxList) customTaxList.innerHTML = '';
        if (customPreTaxDeductList) customPreTaxDeductList.innerHTML = '';
        if (customPostTaxDeductList) customPostTaxDeductList.innerHTML = '';
        if (customExpenseList) customExpenseList.innerHTML = '';

        applyLanguage(data.currentLanguage); // 로드된 언어 적용
        applyDarkMode(data.isDarkMode); // 로드된 다크모드 적용

        updateDisplay();
        // alert(translations[data.currentLanguage].alert_data_loaded); // 자동 로드 시에는 알림 생략
    } else {
        updateDisplay(); // 초기 로드 시에도 디스플레이 업데이트
    }
}

// 11. 차트 렌더링 (Chart.js 사용)
function createChart(canvasId, label, dataValues, labels, colors) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.warn(`Chart canvas not found: ${canvasId}`);
        return null;
    }
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: dataValues,
                backgroundColor: colors,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: label
                }
            }
        }
    });
}

function updateCharts() {
    const {
        annualGrossSalary,
        totalAnnualTaxes,
        totalAnnualPreTaxDeductions,
        totalAnnualPostTaxDeductions,
        netSalary,
        totalAnnualExpenses,
        remainingBudget
    } = calculateBudget();

    // Taxes Chart
    const taxLabels = Object.keys(data.taxes)
        .filter(key => key !== 'custom' && data.taxes[key] > 0)
        .map(key => translations[data.currentLanguage][key]);
    const taxAmounts = Object.keys(data.taxes)
        .filter(key => key !== 'custom' && data.taxes[key] > 0)
        .map(key => data.taxes[key]);
    const customTaxLabels = data.taxes.custom
        .filter(item => item.amount > 0)
        .map(item => item.name);
    const customTaxAmounts = data.taxes.custom
        .filter(item => item.amount > 0)
        .map(item => convertToAnnual(parseFloat(item.amount) || 0, item.frequency || data.defaultItemFrequency));

    const combinedTaxLabels = [...taxLabels, ...customTaxLabels];
    const combinedTaxAmounts = [...taxAmounts, ...customTaxAmounts];
    const taxColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']; // 예시 색상

    if (taxChartInstance) {
        taxChartInstance.destroy();
    }
    taxChartInstance = createChart('taxesChart', translations[data.currentLanguage].chart_taxes, combinedTaxAmounts, combinedTaxLabels, taxColors);

    // Pre-Tax Deductions Chart
    const preTaxLabels = Object.keys(data.preTaxDeductions)
        .filter(key => key !== 'custom' && data.preTaxDeductions[key] > 0)
        .map(key => translations[data.currentLanguage][key]);
    const preTaxAmounts = Object.keys(data.preTaxDeductions)
        .filter(key => key !== 'custom' && data.preTaxDeductions[key] > 0)
        .map(key => data.preTaxDeductions[key]);
    const customPreTaxLabels = data.preTaxDeductions.custom
        .filter(item => item.amount > 0)
        .map(item => item.name);
    const customPreTaxAmounts = data.preTaxDeductions.custom
        .filter(item => item.amount > 0)
        .map(item => convertToAnnual(parseFloat(item.amount) || 0, item.frequency || data.defaultItemFrequency));

    const combinedPreTaxLabels = [...preTaxLabels, ...customPreTaxLabels];
    const combinedPreTaxAmounts = [...preTaxAmounts, ...customPreTaxAmounts];
    const preTaxColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED']; // 예시 색상

    if (preTaxDeductChartInstance) {
        preTaxDeductChartInstance.destroy();
    }
    preTaxDeductChartInstance = createChart('preTaxDeductionsChart', translations[data.currentLanguage].chart_pre_tax, combinedPreTaxAmounts, combinedPreTaxLabels, preTaxColors);

    // Post-Tax Deductions Chart
    const postTaxLabels = Object.keys(data.postTaxDeductions)
        .filter(key => key !== 'custom' && data.postTaxDeductions[key] > 0)
        .map(key => translations[data.currentLanguage][key]);
    const postTaxAmounts = Object.keys(data.postTaxDeductions)
        .filter(key => key !== 'custom' && data.postTaxDeductions[key] > 0)
        .map(key => data.postTaxDeductions[key]);
    const customPostTaxLabels = data.postTaxDeductions.custom
        .filter(item => item.amount > 0)
        .map(item => item.name);
    const customPostTaxAmounts = data.postTaxDeductions.custom
        .filter(item => item.amount > 0)
        .map(item => convertToAnnual(parseFloat(item.amount) || 0, item.frequency || data.defaultItemFrequency));

    const combinedPostTaxLabels = [...postTaxLabels, ...customPostTaxLabels];
    const combinedPostTaxAmounts = [...postTaxAmounts, ...customPostTaxAmounts];
    const postTaxColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8AC926']; // 예시 색상

    if (postTaxDeductChartInstance) {
        postTaxDeductChartInstance.destroy();
    }
    postTaxDeductChartInstance = createChart('postTaxDeductionsChart', translations[data.currentLanguage].chart_post_tax, combinedPostTaxAmounts, combinedPostTaxLabels, postTaxColors);


    // Expenses Chart
    const expenseLabels = Object.keys(data.expenses)
        .filter(key => key !== 'custom' && data.expenses[key] > 0)
        .map(key => translations[data.currentLanguage][key]);
    const expenseAmounts = Object.keys(data.expenses)
        .filter(key => key !== 'custom' && data.expenses[key] > 0)
        .map(key => data.expenses[key]);
    const customExpenseLabels = data.expenses.custom
        .filter(item => item.amount > 0)
        .map(item => item.name);
    const customExpenseAmounts = data.expenses.custom
        .filter(item => item.amount > 0)
        .map(item => convertToAnnual(parseFloat(item.amount) || 0, item.frequency || data.defaultItemFrequency));

    const combinedExpenseLabels = [...expenseLabels, ...customExpenseLabels];
    const combinedExpenseAmounts = [...expenseAmounts, ...customExpenseAmounts];
    const expenseColors = ['#A1C935', '#FFCC66', '#5DADE2', '#F1C40F', '#27AE60', '#BA4A00', '#7D3C98', '#1ABC9C', '#F39C12', '#C0392B']; // 예시 색상

    if (expensesChartInstance) {
        expensesChartInstance.destroy();
    }
    expensesChartInstance = createChart('expensesChart', translations[data.currentLanguage].chart_expenses, combinedExpenseAmounts, combinedExpenseLabels, expenseColors);


    // Overall Budget Distribution Chart
    const overallLabels = [
        translations[data.currentLanguage].chart_labels_taxes,
        translations[data.currentLanguage].chart_labels_pre_tax_deductions,
        translations[data.currentLanguage].chart_labels_post_tax_deductions,
        translations[data.currentLanguage].chart_labels_expenses,
        translations[data.currentLanguage].chart_labels_remaining_budget
    ];
    const overallAmounts = [
        totalAnnualTaxes,
        totalAnnualPreTaxDeductions,
        totalAnnualPostTaxDeductions,
        totalAnnualExpenses,
        remainingBudget > 0 ? remainingBudget : 0 // 남은 예산이 음수이면 0으로 표시
    ];
    const overallColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; // 예시 색상

    if (budgetDistributionChartInstance) {
        budgetDistributionChartInstance.destroy();
    }
    budgetDistributionChartInstance = createChart('budgetDistributionChart', translations[data.currentLanguage].chart_budget_distribution, overallAmounts, overallLabels, overallColors);
}

// 12. 예산 규칙 적용 함수
function applyBudgetRule() {
    const {
        annualGrossSalary,
        totalAnnualExpenses,
        netSalary
    } = calculateBudget();

    let needsPercentage, wantsPercentage, savingsPercentage;

    switch (data.budgetRule) {
        case '50-30-20':
            needsPercentage = 0.5;
            wantsPercentage = 0.3;
            savingsPercentage = 0.2;
            break;
        case '70-20-10':
            needsPercentage = 0.7;
            wantsPercentage = 0.2;
            savingsPercentage = 0.1;
            break;
        case '80-20':
            needsPercentage = 0.8;
            wantsPercentage = 0; // 80-20 rule often combines wants and needs
            savingsPercentage = 0.2;
            break;
        default:
            needsPercentage = 0.5;
            wantsPercentage = 0.3;
            savingsPercentage = 0.2;
    }

    const calculatedNeeds = netSalary * needsPercentage;
    const calculatedWants = netSalary * wantsPercentage;
    const calculatedSavings = netSalary * savingsPercentage;

    if (ruleNeedsDisplay) ruleNeedsDisplay.textContent = formatCurrency(calculatedNeeds);
    if (ruleWantsDisplay) ruleWantsDisplay.textContent = formatCurrency(calculatedWants);
    if (ruleSavingsDisplay) ruleSavingsDisplay.textContent = formatCurrency(calculatedSavings);
    if (ruleTotalDisplay) ruleTotalDisplay.textContent = formatCurrency(calculatedNeeds + calculatedWants + calculatedSavings);


    // 실제 지출을 NEEDS, WANTS, SAVINGS로 분류하는 것은 이 예제에서는 단순화하여 보여줍니다.
    // 실제 분류 로직은 사용자의 지출 항목에 따라 더 복잡할 수 있습니다.
    // 여기서는 총 지출(expenses)을 'actual needs'로, 남은 예산(remainingBudget)을 'actual savings'에 영향을 주는 것으로 가정합니다.
    if (actualNeedsDisplay) actualNeedsDisplay.textContent = formatCurrency(totalAnnualExpenses);
    // wants와 savings는 더 복잡한 분류가 필요하므로 일단 0으로 두거나, 남은 예산을 분배하는 방식으로 표시할 수 있습니다.
    if (actualWantsDisplay) actualWantsDisplay.textContent = formatCurrency(0); // 실제 지출 분류 로직에 따라 변경
    if (actualSavingsDisplay) actualSavingsDisplay.textContent = formatCurrency(netSalary - totalAnnualExpenses); // 순 급여 - 총 지출 (저축 가능 금액)
    if (actualTotalDisplay) actualTotalDisplay.textContent = formatCurrency(totalAnnualExpenses + (netSalary - totalAnnualExpenses)); // 총 지출 + 실제 저축

    // "One or more budget rule display elements are missing from the DOM." 경고는
    // ruleNeedsDisplay, actualNeedsDisplay 등의 요소가 null일 때 발생합니다.
    // 위에서 모든 DOM 요소들을 DOMContentLoaded 안에서 제대로 할당했다면 이 경고는 사라집니다.
    const allBudgetRuleDisplaysFound = ruleNeedsDisplay && actualNeedsDisplay && ruleWantsDisplay && actualWantsDisplay && ruleSavingsDisplay && actualSavingsDisplay && ruleTotalDisplay && actualTotalDisplay && budgetStatusDisplay;

    if (!allBudgetRuleDisplaysFound) {
        console.warn("One or more budget rule display elements are missing from the DOM.");
    }
}


// 13. 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 모든 DOM 요소들을 이곳에서 할당합니다.
    grossSalaryInput = document.getElementById('gross-salary');
    salaryFrequencySelect = document.getElementById('salary-frequency');
    defaultItemFrequencySelect = document.getElementById('default-item-frequency');

    annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');
    grossSalarySummaryDisplay = document.getElementById('gross-salary-summary-display');
    totalTaxesDisplay = document.getElementById('total-taxes-display');
    totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
    totalPostTaxDisplay = document.getElementById('total-post-tax-display');
    netSalaryDisplay = document.getElementById('net-salary-display');
    totalExpensesDisplay = document.getElementById('total-expenses-display');
    remainingBudgetDisplay = document.getElementById('remaining-budget-display');

    // Tax Inputs 할당
    taxInputs = {
        federal: document.getElementById('federal-tax'),
        state: document.getElementById('state-tax'),
        oasdi: document.getElementById('oasdi-tax'),
        medicare: document.getElementById('medicare-tax'),
        casdi: document.getElementById('casdi-tax')
    };

    // Pre-Tax Deduction Inputs 할당
    preTaxDeductInputs = {
        medical: document.getElementById('medical-deduction'),
        dental: document.getElementById('dental-deduction'),
        vision: document.getElementById('vision-deduction'),
        '401k-trad': document.getElementById('401k-traditional-deduction'),
        traditionalIRA: document.getElementById('traditional-ira-deduction'),
        hsa: document.getElementById('hsa-deduction')
    };

    // Post-Tax Deduction Inputs 할당
    postTaxDeductInputs = {
        spp: document.getElementById('spp-deduction'),
        adnd: document.getElementById('adnd-deduction'),
        '401k-roth': document.getElementById('401k-roth-deduction'),
        ltd: document.getElementById('ltd-deduction'),
        rothIRA: document.getElementById('roth-ira-deduction'),
        healthInsurance: document.getElementById('health-insurance-deduction'),
        lifeInsurance: document.getElementById('life-insurance-deduction')
    };

    // Expense Inputs 할당
    expenseInputs = {
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

    // Custom Lists 할당 (HTML ID에 맞춰 수정)
    customTaxList = document.getElementById('tax-custom-list');
    customPreTaxDeductList = document.getElementById('pre-tax-custom-list');
    customPostTaxDeductList = document.getElementById('post-tax-custom-list');
    customExpenseList = document.getElementById('expenses-custom-list');

    // Buttons & Toggles 할당 (HTML ID에 맞춰 수정)
    addTaxBtn = document.getElementById('add-tax-btn');
    addPreTaxDeductBtn = document.getElementById('add-pre-tax-deduct-btn');
    addPostTaxDeductBtn = document.getElementById('add-post-tax-deduct-btn');
    addExpenseBtn = document.getElementById('add-expense-btn');
    languageToggleBtn = document.getElementById('language-toggle-btn'); // HTML ID 확인
    darkmodeToggleBtn = document.getElementById('darkmode-toggle-btn'); // HTML ID 확인

    // Data Management Buttons & Inputs 할당
    exportJsonBtn = document.getElementById('export-json-btn');
    importJsonBtn = document.getElementById('import-json-btn');
    importJsonInput = document.getElementById('import-json-input');
    clearAllDataBtn = document.getElementById('clear-all-data-btn');

    // AI Report 할당
    aiReportBtn = document.getElementById('ai-report-btn');
    aiReportBox = document.getElementById('ai-report-box');

    // Budget Rule Elements 할당
    budgetRuleSelect = document.getElementById('budget-rule-select');
    ruleNeedsDisplay = document.getElementById('rule-needs-display');
    ruleWantsDisplay = document.getElementById('rule-wants-display');
    ruleSavingsDisplay = document.getElementById('rule-savings-display');
    ruleTotalDisplay = document.getElementById('rule-total-display');
    actualNeedsDisplay = document.getElementById('actual-needs-display');
    actualWantsDisplay = document.getElementById('actual-wants-display');
    actualSavingsDisplay = document.getElementById('actual-savings-display');
    actualTotalDisplay = document.getElementById('actual-total-display');
    budgetStatusDisplay = document.getElementById('budget-status-display');


    // 이벤트 리스너 설정
    if (grossSalaryInput) grossSalaryInput.addEventListener('input', updateDisplay);
    if (salaryFrequencySelect) salaryFrequencySelect.addEventListener('change', updateDisplay);
    if (defaultItemFrequencySelect) defaultItemFrequencySelect.addEventListener('change', () => {
        data.defaultItemFrequency = defaultItemFrequencySelect.value;
        updateDisplay();
    });

    for (const key in taxInputs) {
        if (taxInputs[key]) taxInputs[key].addEventListener('input', (event) => {
            data.taxes[key] = parseFloat(event.target.value) || 0;
            updateDisplay();
        });
    }
    for (const key in preTaxDeductInputs) {
        if (preTaxDeductInputs[key]) preTaxDeductInputs[key].addEventListener('input', (event) => {
            data.preTaxDeductions[key] = parseFloat(event.target.value) || 0;
            updateDisplay();
        });
    }
    for (const key in postTaxDeductInputs) {
        if (postTaxDeductInputs[key]) postTaxDeductInputs[key].addEventListener('input', (event) => {
            data.postTaxDeductions[key] = parseFloat(event.target.value) || 0;
            updateDisplay();
        });
    }
    for (const key in expenseInputs) {
        if (expenseInputs[key]) expenseInputs[key].addEventListener('input', (event) => {
            data.expenses[key] = parseFloat(event.target.value) || 0;
            updateDisplay();
        });
    }

    if (addTaxBtn) addTaxBtn.addEventListener('click', () => addCustomItem('taxes'));
    if (addPreTaxDeductBtn) addPreTaxDeductBtn.addEventListener('click', () => addCustomItem('preTaxDeductions'));
    if (addPostTaxDeductBtn) addPostTaxDeductBtn.addEventListener('click', () => addCustomItem('postTaxDeductions'));
    if (addExpenseBtn) addExpenseBtn.addEventListener('click', () => addCustomItem('expenses'));

    if (languageToggleBtn) languageToggleBtn.addEventListener('click', () => {
        const newLang = data.currentLanguage === 'ko' ? 'en' : 'ko';
        applyLanguage(newLang);
        updateDisplay();
    });

    if (darkmodeToggleBtn) darkmodeToggleBtn.addEventListener('click', () => {
        const newMode = !data.isDarkMode;
        applyDarkMode(newMode);
        updateDisplay();
    });


    // 데이터 관리 버튼 리스너
    if (exportJsonBtn) {
        exportJsonBtn.addEventListener('click', () => {
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'budget_data.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    if (importJsonBtn && importJsonInput) {
        importJsonBtn.addEventListener('click', () => {
            importJsonInput.click(); // 숨겨진 파일 입력 필드 클릭
        });

        importJsonInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        if (confirm(translations[data.currentLanguage].confirm_import_data)) {
                            Object.assign(data, importedData);
                            // 새로운 필드 처리 (예: budgetRule)
                            if (data.budgetRule === undefined) data.budgetRule = '50-30-20';
                            if (data.currentLanguage === undefined) data.currentLanguage = 'ko';
                            if (data.isDarkMode === undefined) data.isDarkMode = false;
                            updateDisplay();
                            alert(translations[data.currentLanguage].alert_data_loaded);
                        }
                    } catch (error) {
                        alert(translations[data.currentLanguage].invalid_json);
                        console.error('Error parsing JSON:', error);
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', () => {
            if (confirm(translations[data.currentLanguage].confirm_clear_data)) {
                // data 객체를 초기 상태로 재설정
                Object.assign(data, {
                    grossSalary: 0,
                    salaryFrequency: 'annual',
                    defaultItemFrequency: 'monthly',
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
                        '401k-trad': 0,
                        traditionalIRA: 0,
                        hsa: 0,
                        custom: []
                    },
                    postTaxDeductions: {
                        spp: 0,
                        adnd: 0,
                        '401k-roth': 0,
                        ltd: 0,
                        rothIRA: 0,
                        healthInsurance: 0,
                        lifeInsurance: 0,
                        custom: []
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
                        custom: []
                    },
                    budgetRule: '50-30-20',
                    currentLanguage: 'ko',
                    isDarkMode: false
                });
                localStorage.removeItem('budgetData'); // 로컬 스토리지에서도 삭제

                // UI Input 필드도 초기화
                if (grossSalaryInput) grossSalaryInput.value = 0;
                if (salaryFrequencySelect) salaryFrequencySelect.value = 'annual';
                if (defaultItemFrequencySelect) defaultItemFrequencySelect.value = 'monthly';
                if (budgetRuleSelect) budgetRuleSelect.value = '50-30-20';

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

    // 초기 로드
    loadData();
    initializeCharts();
});


// 14. Chart.js 초기화 함수 (새로운 차트 인스턴스가 생성될 때마다 호출)
function initializeCharts() {
    updateCharts(); // 초기 차트 렌더링
}
