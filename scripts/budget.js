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

// Tax, Deduction, Expense Inputs (객체 내부는 DOMContentLoaded에서 할당)
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
    salaryFrequency: 'monthly', // annual, monthly, bi-weekly, weekly
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
        custom: []
    },
    postTaxDeductions: {
        spp: 0,
        adnd: 0,
        '401k-roth': 0,
        ltd: 0,
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

// 2. 언어별 텍스트 (기존과 동일)
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
        post_tax_deductions: 'Post-Tax Deductions',
        spp: 'SPP',
        adnd: 'AD&D',
        '401k_roth': '401K Roth',
        ltd: 'LTD',
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
        post_tax_deductions: '세후 공제',
        spp: 'SPP',
        adnd: 'AD&D',
        '401k_roth': '401K Roth',
        ltd: 'LTD',
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
function calculateTotalForSection(items, customItems, defaultFrequency) {
    let total = 0;
    // 기본 항목 계산
    for (const key in items) {
        if (key !== 'custom') {
            total += parseFloat(items[key]) || 0;
        }
    }
    // 커스텀 항목 계산 (주기 변환 적용)
    total += customItems.reduce((sum, item) => {
        const itemAmount = parseFloat(item.amount) || 0;
        const itemFrequency = item.frequency || defaultFrequency;
        return sum + convertToAnnual(itemAmount, itemFrequency);
    }, 0);
    return total;
}


// 5. 주요 계산 로직
function calculateBudget() {
    const annualGrossSalary = convertToAnnual(data.grossSalary, data.salaryFrequency);

    const totalAnnualTaxes = calculateTotalForSection(data.taxes, data.taxes.custom, data.defaultItemFrequency);
    const totalAnnualPreTaxDeductions = calculateTotalForSection(data.preTaxDeductions, data.preTaxDeductions.custom, data.defaultItemFrequency);
    const totalAnnualPostTaxDeductions = calculateTotalForSection(data.postTaxDeductions, data.postTaxDeductions.custom, data.defaultItemFrequency);
    const totalAnnualExpenses = calculateTotalForSection(data.expenses, data.expenses.custom, data.defaultItemFrequency);

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
    // 먼저 데이터 객체를 입력 필드 값으로 업데이트
    data.grossSalary = parseFloat(grossSalaryInput.value) || 0;
    data.salaryFrequency = salaryFrequencySelect.value;
    data.defaultItemFrequency = defaultItemFrequencySelect.value;

    for (const key in taxInputs) {
        if (taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    }
    for (const key in preTaxDeductInputs) {
        if (preTaxDeductInputs[key]) data.preTaxDeductions[key] = parseFloat(preTaxDeductInputs[key].value) || 0;
    }
    for (const key in postTaxDeductInputs) {
        if (postTaxDeductInputs[key]) data.postTaxDeductions[key] = parseFloat(postTaxDeductInputs[key].value) || 0;
    }
    for (const key in expenseInputs) {
        if (expenseInputs[key]) data.expenses[key] = parseFloat(expenseInputs[key].value) || 0;
    }

    const {
        annualGrossSalary,
        totalAnnualTaxes,
        totalAnnualPreTaxDeductions,
        totalAnnualPostTaxDeductions,
        netSalary,
        totalAnnualExpenses,
        remainingBudget
    } = calculateBudget();


    // 요약 디스플레이 업데이트
    if (annualSalarySummaryDisplay) annualSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary);
    if (grossSalarySummaryDisplay) grossSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary); // 연간 총 급여와 동일
    if (totalTaxesDisplay) totalTaxesDisplay.textContent = formatCurrency(totalAnnualTaxes);
    if (totalPreTaxDisplay) totalPreTaxDisplay.textContent = formatCurrency(totalAnnualPreTaxDeductions);
    if (totalPostTaxDisplay) totalPostTaxDisplay.textContent = formatCurrency(totalAnnualPostTaxDeductions);
    if (netSalaryDisplay) netSalaryDisplay.textContent = formatCurrency(netSalary);
    if (totalExpensesDisplay) totalExpensesDisplay.textContent = formatCurrency(totalAnnualExpenses);
    if (remainingBudgetDisplay) {
        remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);
        remainingBudgetDisplay.classList.remove('positive', 'negative', 'balanced');
        if (remainingBudget > 0) {
            remainingBudgetDisplay.classList.add('positive');
        } else if (remainingBudget < 0) {
            remainingBudgetDisplay.classList.add('negative');
        } else {
            remainingBudgetDisplay.classList.add('balanced');
        }
    }


    // 커스텀 리스트 렌더링
    renderCustomList(customTaxList, data.taxes.custom, 'taxes');
    renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'preTaxDeductions');
    renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'postTaxDeductions');
    renderCustomList(customExpenseList, data.expenses.custom, 'expenses');
    
    // 언어 및 테마 적용
    applyLanguage(data.currentLanguage);
    applyDarkMode(data.isDarkMode);

    // 차트 및 예산 규칙 업데이트
    updateCharts();
    applyBudgetRule();
    updateBudgetStatus(remainingBudget);
    
    // 데이터 자동 저장
    saveData();
}

function renderCustomList(listElement, customItems, type) {
    if (!listElement) return;
    listElement.innerHTML = ''; // 기존 항목 지우기

    customItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('custom-list-item'); // CSS와 일치하도록 클래스 수정
        li.innerHTML = `
            <input type="text" value="${item.name}" placeholder="${translations[data.currentLanguage].custom_item_name}" class="custom-item-name form-control" data-index="${index}" data-type="${type}">
            <input type="number" value="${item.amount}" placeholder="${translations[data.currentLanguage].custom_item_amount}" class="custom-item-amount form-control" data-index="${index}" data-type="${type}">
            <select class="custom-item-frequency form-control" data-index="${index}" data-type="${type}">
                <option value="monthly"${item.frequency === 'monthly' ? ' selected' : ''}>${translations[data.currentLanguage].monthly}</option>
                <option value="annual"${item.frequency === 'annual' ? ' selected' : ''}>${translations[data.currentLanguage].annual}</option>
                <option value="bi-weekly"${item.frequency === 'bi-weekly' ? ' selected' : ''}>${translations[data.currentLanguage].bi_weekly}</option>
                <option value="weekly"${item.frequency === 'weekly' ? ' selected' : ''}>${translations[data.currentLanguage].weekly}</option>
            </select>
            <button class="remove-btn btn btn-danger" data-index="${index}" data-type="${type}">${translations[data.currentLanguage].remove}</button>
        `;
        listElement.appendChild(li);
    });

    // 이벤트 리스너 재부착
    listElement.querySelectorAll('.custom-item-name, .custom-item-amount, .custom-item-frequency').forEach(el => {
        el.addEventListener('input', handleCustomItemChange);
        el.addEventListener('change', handleCustomItemChange);
    });
    listElement.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', removeCustomItem);
    });
}


function updateBudgetStatus(remainingBudget) {
    if (budgetStatusDisplay) {
        if (remainingBudget > 0) {
            budgetStatusDisplay.textContent = translations[data.currentLanguage].budget_status_surplus;
            budgetStatusDisplay.className = 'status-surplus';
        } else if (remainingBudget < 0) {
            budgetStatusDisplay.textContent = translations[data.currentLanguage].budget_status_deficit;
            budgetStatusDisplay.className = 'status-deficit';
        } else {
            budgetStatusDisplay.textContent = translations[data.currentLanguage].budget_status_balanced;
            budgetStatusDisplay.className = 'status-balanced';
        }
    }
}


// 7. 커스텀 항목 추가/변경/삭제 핸들러
function addCustomItem(event) {
    const type = event.target.dataset.type;
    let targetArray;
    switch(type) {
        case 'tax': targetArray = data.taxes.custom; break;
        case 'pre-tax': targetArray = data.preTaxDeductions.custom; break;
        case 'post-tax': targetArray = data.postTaxDeductions.custom; break;
        case 'expense': targetArray = data.expenses.custom; break;
        default: return;
    }
    
    targetArray.push({ name: '', amount: 0, frequency: data.defaultItemFrequency });
    updateDisplay();
}

function handleCustomItemChange(event) {
    const { index, type } = event.target.dataset;
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
    const { index, type } = event.target.dataset;
    data[type].custom.splice(parseInt(index), 1);
    updateDisplay();
}

// 8. 언어 변경
function applyLanguage(lang) {
    data.currentLanguage = lang;
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        } else if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
             if (translations[lang] && translations[lang][key]) {
                 element.value = translations[lang][key];
             }
        }
    });

    // 언어 토글 버튼 텍스트 변경
    if(languageToggleBtn) languageToggleBtn.textContent = lang === 'ko' ? 'EN' : 'KO';
}

// 9. 다크 모드 토글
function applyDarkMode(isDark) {
    data.isDarkMode = isDark;
    const icon = darkmodeToggleBtn.querySelector('i');
    if (isDark) {
        document.body.classList.add('dark-mode');
        if(icon) icon.className = 'ri-sun-line';
    } else {
        document.body.classList.remove('dark-mode');
        if(icon) icon.className = 'ri-moon-line';
    }
}


// 10. 데이터 저장/로드 (Local Storage)
function saveData() {
    localStorage.setItem('budgetData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('budgetData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        Object.assign(data, parsedData);
    }
    
    // UI에 데이터 반영
    grossSalaryInput.value = data.grossSalary;
    salaryFrequencySelect.value = data.salaryFrequency;
    defaultItemFrequencySelect.value = data.defaultItemFrequency;
    budgetRuleSelect.value = data.budgetRule;

    for (const key in taxInputs) {
        if (taxInputs[key] && data.taxes[key] !== undefined) taxInputs[key].value = data.taxes[key];
    }
    for (const key in preTaxDeductInputs) {
        if (preTaxDeductInputs[key] && data.preTaxDeductions[key] !== undefined) preTaxDeductInputs[key].value = data.preTaxDeductions[key];
    }
    for (const key in postTaxDeductInputs) {
        if (postTaxDeductInputs[key] && data.postTaxDeductions[key] !== undefined) postTaxDeductInputs[key].value = data.postTaxDeductions[key];
    }
    for (const key in expenseInputs) {
        if (expenseInputs[key] && data.expenses[key] !== undefined) expenseInputs[key].value = data.expenses[key];
    }

    applyLanguage(data.currentLanguage);
    applyDarkMode(data.isDarkMode);
    updateDisplay();
}

// 11. 차트 렌더링 (Chart.js 사용)
function createOrUpdateChart(instance, canvasId, label, dataValues, labels) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8AC926', '#A1C935', '#FFCC66', '#5DADE2', '#F1C40F'];
    const ctx = document.getElementById(canvasId);
    if (!ctx) return instance;

    if (instance) {
        instance.data.labels = labels;
        instance.data.datasets[0].data = dataValues;
        instance.data.datasets[0].backgroundColor = colors.slice(0, dataValues.length);
        instance.options.plugins.title.text = label;
        instance.update();
        return instance;
    }
    
    return new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                data: dataValues,
                backgroundColor: colors.slice(0, dataValues.length),
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
    const { totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget } = calculateBudget();
    const lang = data.currentLanguage;

    // 데이터와 라벨 추출 헬퍼 함수
    const extractChartData = (items, customItems) => {
        const labels = [];
        const amounts = [];
        // 기본 항목
        for(const key in items) {
            if(key !== 'custom' && items[key] > 0) {
                labels.push(translations[lang][key] || key);
                amounts.push(items[key]);
            }
        }
        // 커스텀 항목
        customItems.forEach(item => {
            if(item.amount > 0) {
                labels.push(item.name);
                amounts.push(convertToAnnual(item.amount, item.frequency));
            }
        });
        return { labels, amounts };
    };
    
    const taxData = extractChartData(data.taxes, data.taxes.custom);
    taxChartInstance = createOrUpdateChart(taxChartInstance, 'tax-chart', translations[lang].chart_taxes, taxData.amounts, taxData.labels);

    const preTaxData = extractChartData(data.preTaxDeductions, data.preTaxDeductions.custom);
    preTaxDeductChartInstance = createOrUpdateChart(preTaxDeductChartInstance, 'pre-tax-deduct-chart', translations[lang].chart_pre_tax, preTaxData.amounts, preTaxData.labels);
    
    const postTaxData = extractChartData(data.postTaxDeductions, data.postTaxDeductions.custom);
    postTaxDeductChartInstance = createOrUpdateChart(postTaxDeductChartInstance, 'post-tax-deduct-chart', translations[lang].chart_post_tax, postTaxData.amounts, postTaxData.labels);
    
    const expenseData = extractChartData(data.expenses, data.expenses.custom);
    expensesChartInstance = createOrUpdateChart(expensesChartInstance, 'expenses-chart', translations[lang].chart_expenses, expenseData.amounts, expenseData.labels);

    // 전체 예산 분배 차트
    const overallLabels = [
        translations[lang].chart_labels_taxes,
        translations[lang].chart_labels_pre_tax_deductions,
        translations[lang].chart_labels_post_tax_deductions,
        translations[lang].chart_labels_expenses,
        translations[lang].chart_labels_remaining_budget
    ];
    const overallAmounts = [
        totalAnnualTaxes,
        totalAnnualPreTaxDeductions,
        totalAnnualPostTaxDeductions,
        totalAnnualExpenses,
        remainingBudget > 0 ? remainingBudget : 0
    ].filter(v => v > 0); // 0보다 큰 값만 차트에 표시
    
    const filteredLabels = overallLabels.filter((_, i) => [totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget > 0 ? remainingBudget : 0][i] > 0);

    budgetDistributionChartInstance = createOrUpdateChart(budgetDistributionChartInstance, 'budget-distribution-chart', translations[lang].chart_budget_distribution, overallAmounts, filteredLabels);
}


// 12. 예산 규칙 적용 함수
function applyBudgetRule() {
    const { netSalary, totalAnnualExpenses } = calculateBudget();
    let needsPercentage, wantsPercentage, savingsPercentage;

    switch (data.budgetRule) {
        case '50-30-20': [needsPercentage, wantsPercentage, savingsPercentage] = [0.5, 0.3, 0.2]; break;
        case '70-20-10': [needsPercentage, wantsPercentage, savingsPercentage] = [0.7, 0.2, 0.1]; break;
        case '80-20': [needsPercentage, wantsPercentage, savingsPercentage] = [0.8, 0, 0.2]; break;
        default: [needsPercentage, wantsPercentage, savingsPercentage] = [0.5, 0.3, 0.2];
    }

    const calculatedNeeds = netSalary * needsPercentage;
    const calculatedWants = netSalary * wantsPercentage;
    const calculatedSavings = netSalary * savingsPercentage;
    const actualSavings = netSalary - totalAnnualExpenses;

    if (ruleNeedsDisplay) ruleNeedsDisplay.textContent = formatCurrency(calculatedNeeds);
    if (ruleWantsDisplay) ruleWantsDisplay.textContent = formatCurrency(calculatedWants);
    if (ruleSavingsDisplay) ruleSavingsDisplay.textContent = formatCurrency(calculatedSavings);
    if (ruleTotalDisplay) ruleTotalDisplay.textContent = formatCurrency(netSalary);
    
    if (actualNeedsDisplay) actualNeedsDisplay.textContent = formatCurrency(totalAnnualExpenses);
    if (actualWantsDisplay) actualWantsDisplay.textContent = formatCurrency(0); // 단순화를 위해 0으로 표시
    if (actualSavingsDisplay) actualSavingsDisplay.textContent = formatCurrency(actualSavings);
    if (actualTotalDisplay) actualTotalDisplay.textContent = formatCurrency(netSalary);
}


// 13. 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 모든 DOM 요소들을 이곳에서 할당
    grossSalaryInput = document.getElementById('salary-gross');
    salaryFrequencySelect = document.getElementById('salary-frequency-select');
    defaultItemFrequencySelect = document.getElementById('default-item-frequency-select');
    
    annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');
    grossSalarySummaryDisplay = document.getElementById('gross-salary-summary-display');
    totalTaxesDisplay = document.getElementById('total-taxes-display');
    totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
    totalPostTaxDisplay = document.getElementById('total-post-tax-display');
    netSalaryDisplay = document.getElementById('net-salary-display');
    totalExpensesDisplay = document.getElementById('total-expenses-display');
    remainingBudgetDisplay = document.getElementById('remaining-budget-display');

    taxInputs = {
        federal: document.getElementById('tax-federal-1'),
        state: document.getElementById('tax-state-1'),
        oasdi: document.getElementById('tax-oasdi-1'),
        medicare: document.getElementById('tax-medicare-1'),
        casdi: document.getElementById('tax-casdi-1')
    };

    preTaxDeductInputs = {
        medical: document.getElementById('deduct-medical-1'),
        dental: document.getElementById('deduct-dental-1'),
        vision: document.getElementById('deduct-vision-1'),
        '401k-trad': document.getElementById('deduct-401k-trad-1'),
    };

    postTaxDeductInputs = {
        spp: document.getElementById('deduct-spp-1'),
        adnd: document.getElementById('deduct-adnd-1'),
        '401k-roth': document.getElementById('deduct-401k-roth-1'),
        ltd: document.getElementById('deduct-ltd-1'),
    };

    expenseInputs = {
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
    
    customTaxList = document.getElementById('tax-custom-list');
    customPreTaxDeductList = document.getElementById('pre-tax-custom-list');
    customPostTaxDeductList = document.getElementById('post-tax-custom-list');
    customExpenseList = document.getElementById('expenses-custom-list');
    
    addTaxBtn = document.querySelector('[data-type="tax"].add-custom-btn');
    addPreTaxDeductBtn = document.querySelector('[data-type="pre-tax"].add-custom-btn');
    addPostTaxDeductBtn = document.querySelector('[data-type="post-tax"].add-custom-btn');
    addExpenseBtn = document.querySelector('[data-type="expense"].add-custom-btn');
    
    languageToggleBtn = document.getElementById('language-toggle');
    darkmodeToggleBtn = document.getElementById('darkmode-toggle');

    exportJsonBtn = document.getElementById('export-json-btn');
    importJsonBtn = document.getElementById('import-json-btn');
    importJsonInput = document.getElementById('import-json-input');
    clearAllDataBtn = document.getElementById('clear-all-data-btn');

    aiReportBtn = document.getElementById('ai-report-btn');
    aiReportBox = document.getElementById('ai-report-box');

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

    // 모든 입력 필드에 이벤트 리스너 추가
    document.querySelectorAll('input[type="number"], select').forEach(el => {
        el.addEventListener('input', updateDisplay);
        el.addEventListener('change', updateDisplay);
    });

    // 버튼 이벤트 리스너
    addTaxBtn.addEventListener('click', addCustomItem);
    addPreTaxDeductBtn.addEventListener('click', addCustomItem);
    addPostTaxDeductBtn.addEventListener('click', addCustomItem);
    addExpenseBtn.addEventListener('click', addCustomItem);

    languageToggleBtn.addEventListener('click', () => {
        const newLang = data.currentLanguage === 'ko' ? 'en' : 'ko';
        applyLanguage(newLang);
        updateDisplay();
    });

    darkmodeToggleBtn.addEventListener('click', () => {
        applyDarkMode(!data.isDarkMode);
        updateDisplay();
    });

    // 데이터 관리 버튼 리스너
    exportJsonBtn.addEventListener('click', () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'budget_data.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    importJsonBtn.addEventListener('click', () => importJsonInput.click());
    importJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    if (confirm(translations[data.currentLanguage].confirm_import_data)) {
                        Object.assign(data, importedData);
                        loadData();
                        alert(translations[data.currentLanguage].alert_data_loaded);
                    }
                } catch (error) {
                    alert(translations[data.currentLanguage].invalid_json);
                }
            };
            reader.readAsText(file);
        }
    });

    clearAllDataBtn.addEventListener('click', () => {
        if (confirm(translations[data.currentLanguage].confirm_clear_data)) {
            localStorage.removeItem('budgetData');
            window.location.reload(); // 페이지를 새로고침하여 초기 상태로
        }
    });

    // AI 리포트 (placeholder)
    aiReportBtn.addEventListener('click', () => {
        aiReportBox.innerHTML = `<p>${translations[data.currentLanguage].ai_report_placeholder}</p>`;
    });

    // 초기 로드
    loadData();
});
