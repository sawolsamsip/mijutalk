// 0. 전역 변수
let grossSalaryInput, salaryFrequencySelect;
let taxFrequencySelect, preTaxFrequencySelect, postTaxFrequencySelect, expenseFrequencySelect;
let annualSalarySummaryDisplay, grossSalarySummaryDisplay, totalTaxesDisplay, totalPreTaxDisplay, totalPostTaxDisplay, netSalaryDisplay, totalExpensesDisplay, remainingBudgetDisplay;
const taxInputs = {}, preTaxDeductInputs = {}, postTaxDeductInputs = {}, expenseInputs = {};
let customTaxList, customPreTaxDeductList, customPostTaxDeductList, customExpenseList;
let languageToggleBtn, darkmodeToggleBtn;
let exportJsonBtn, importJsonBtn, importJsonInput, clearAllDataBtn;
let aiReportBtn, aiReportBox;
let budgetRuleSelect, ruleNeedsDisplay, ruleWantsDisplay, ruleSavingsDisplay, ruleTotalDisplay, actualNeedsDisplay, actualWantsDisplay, actualSavingsDisplay, actualTotalDisplay, budgetStatusDisplay;
let taxChartInstance, preTaxDeductChartInstance, postTaxDeductChartInstance, expensesChartInstance, budgetDistributionChartInstance;

// 1. 초기 데이터
const data = {
    grossSalary: 0,
    salaryFrequency: 'monthly',
    currency: 'USD', // 화폐 단위를 USD로 고정
    frequencies: {
        tax: 'monthly',
        preTax: 'monthly',
        postTax: 'monthly',
        expense: 'monthly'
    },
    taxes: { federal: 0, state: 0, oasdi: 0, medicare: 0, casdi: 0, custom: [] },
    preTaxDeductions: { medical: 0, dental: 0, vision: 0, '401k-trad': 0, custom: [] },
    postTaxDeductions: { spp: 0, adnd: 0, '401k-roth': 0, ltd: 0, custom: [] },
    expenses: { rent: 0, utilities: 0, internet: 0, phone: 0, groceries: 0, dining: 0, transport: 0, shopping: 0, health: 0, entertainment: 0, custom: [] },
    budgetRule: '50-30-20',
    currentLanguage: 'ko',
    isDarkMode: false
};

// 2. 언어별 텍스트
const translations = {
    en: {
        app_title: 'Budget Management Tool', section_salary_title: 'Gross Salary', label_gross_salary: 'Gross Salary', frequency_monthly: 'Monthly', frequency_annually: 'Annual', frequency_weekly: 'Weekly', frequency_bi_weekly: 'Bi-Weekly',
        label_annual_salary: 'Annual Gross Salary:', btn_save: 'Save', section_default_frequency_title: 'Default Item Frequency', label_default_frequency: 'Default Expense/Item Frequency:', section_taxes_title: 'Taxes',
        label_frequency: 'Frequency:', label_federal_withholding: 'Federal Withholding', label_state_tax: 'State Tax', label_oasdi: 'OASDI', label_medicare: 'Medicare', label_ca_sdi: 'CA SDI', btn_add_item: 'Add Item',
        section_pre_tax_title: 'Pre-Tax Deductions', label_medical_premium: 'Medical Premium', label_dental_premium: 'Dental Premium', label_vision_premium: 'Vision Premium', label_401k_traditional: '401k Traditional',
        section_post_tax_title: 'Post-Tax Deductions', label_spp: 'SPP', label_adnd: 'AD&D', label_401k_roth: '401k Roth', label_ltd: 'LTD', section_expenses_title: 'Expense Management',
        label_rent_mortgage: 'Rent/Mortgage', label_utilities: 'Utilities', label_internet: 'Internet', label_phone: 'Phone Bill', label_groceries: 'Groceries', label_dining_out: 'Dining Out',
        label_transportation: 'Transportation', label_shopping: 'Shopping', label_health_wellness: 'Health/Wellness', label_entertainment: 'Entertainment', section_summary_title: 'Budget Summary',
        total_taxes: 'Total Taxes:', total_pre_tax: 'Total Pre-Tax:', total_post_tax: 'Total Post-Tax:', net_salary: 'Net Salary:', total_expenses: 'Total Expenses:', remaining_budget: 'Remaining Budget:',
        section_budget_rule_title: 'Budget Rules', label_budget_rule_select: 'Select Budget Rule:', rule_50_30_20: '50/30/20 (Needs/Wants/Savings)', rule_70_20_10: '70/20/10 (Needs/Wants/Savings)',
        rule_80_20: '80/20 (Needs/Savings)', needs_label: 'Needs', label_rule: 'Rule', label_actual: 'Actual', wants_label: 'Wants', savings_label: 'Savings', label_total_budget: 'Total Budget',
        label_budget_status: 'Budget Status:', section_ai_title: 'AI Expense Report', btn_ai_report: 'Generate AI Report', ai_report_placeholder: 'Click "Generate AI Report" for insights on your spending habits.',
        section_data_title: 'Data Management', btn_export: 'Export JSON', btn_import: 'Import JSON', btn_clear_all_data: 'Clear All Data',
        custom_item_name: 'Item Name', custom_item_amount: 'Amount', remove: 'Remove', alert_data_saved: 'Data saved successfully!', alert_data_loaded: 'Data loaded successfully!',
        alert_data_cleared: 'All data cleared!', confirm_clear_data: 'Are you sure you want to clear all data?', confirm_import_data: 'This will overwrite existing data. Continue?', invalid_json: 'Invalid JSON file.',
        chart_taxes: 'Taxes Distribution', chart_pre_tax: 'Pre-Tax Deductions', chart_post_tax: 'Post-Tax Deductions', chart_expenses: 'Expenses Distribution', chart_budget_distribution: 'Overall Budget Distribution',
        chart_labels_taxes: 'Taxes', chart_labels_pre_tax_deductions: 'Pre-Tax', chart_labels_post_tax_deductions: 'Post-Tax', chart_labels_expenses: 'Expenses', chart_labels_remaining_budget: 'Remaining',
        budget_status_surplus: 'You have a budget surplus!', budget_status_deficit: 'You have a budget deficit!', budget_status_balanced: 'Your budget is balanced!',
    },
    ko: {
        app_title: '예산 관리 도구', section_salary_title: '총 급여', label_gross_salary: '총 급여', frequency_monthly: '월별', frequency_annually: '연간', frequency_weekly: '주별', frequency_bi_weekly: '2주별',
        label_annual_salary: '연간 총 급여:', btn_save: '저장', section_default_frequency_title: '기본 항목 주기 설정', label_default_frequency: '기본 지출/항목 주기:', section_taxes_title: '세금',
        label_frequency: '주기:', label_federal_withholding: '연방 원천징수', label_state_tax: '주 세금', label_oasdi: 'OASDI', label_medicare: '메디케어', label_ca_sdi: 'CA SDI', btn_add_item: '항목 추가',
        section_pre_tax_title: '세전 공제', label_medical_premium: '의료 보험료', label_dental_premium: '치과 보험료', label_vision_premium: '시력 보험료', label_401k_traditional: '401k 일반',
        section_post_tax_title: '세후 공제', label_spp: '주식 구매 계획', label_adnd: 'AD&D', label_401k_roth: '401k Roth', label_ltd: '장기 장애', section_expenses_title: '지출 관리',
        label_rent_mortgage: '월세/주택담보대출', label_utilities: '공과금', label_internet: '인터넷', label_phone: '휴대폰 요금', label_groceries: '식료품', label_dining_out: '외식',
        label_transportation: '교통비', label_shopping: '쇼핑', label_health_wellness: '건강/웰빙', label_entertainment: '오락', section_summary_title: '예산 요약',
        total_taxes: '총 세금:', total_pre_tax: '총 세전 공제액:', total_post_tax: '총 세후 공제액:', net_salary: '순 급여:', total_expenses: '총 지출:', remaining_budget: '남은 예산:',
        section_budget_rule_title: '예산 규칙 적용', label_budget_rule_select: '예산 규칙 선택:', rule_50_30_20: '50/30/20 (필수/선택/저축)', rule_70_20_10: '70/20/10 (필수/선택/저축)',
        rule_80_20: '80/20 (필수/저축)', needs_label: '필수 지출', label_rule: '규칙', label_actual: '실제', wants_label: '선택 지출', savings_label: '저축', label_total_budget: '총 예산',
        label_budget_status: '예산 상태:', section_ai_title: 'AI 지출 보고서', btn_ai_report: 'AI 보고서 생성', ai_report_placeholder: '"AI 보고서 생성"을 클릭하여 지출 습관에 대한 통찰력을 얻으세요.',
        section_data_title: '데이터 관리', btn_export: 'JSON 내보내기', btn_import: 'JSON 가져오기', btn_clear_all_data: '모든 데이터 지우기',
        custom_item_name: '항목 이름', custom_item_amount: '금액', remove: '삭제', alert_data_saved: '데이터가 성공적으로 저장되었습니다!', alert_data_loaded: '데이터가 성공적으로 로드되었습니다!',
        alert_data_cleared: '모든 데이터가 지워졌습니다!', confirm_clear_data: '정말 모든 데이터를 지우시겠습니까?', confirm_import_data: '기존 데이터를 덮어씁니다. 계속하시겠습니까?', invalid_json: '유효하지 않은 JSON 파일입니다.',
        chart_taxes: '세금 분배', chart_pre_tax: '세전 공제 분배', chart_post_tax: '세후 공제 분배', chart_expenses: '지출 분배', chart_budget_distribution: '전체 예산 분배',
        chart_labels_taxes: '세금', chart_labels_pre_tax_deductions: '세전 공제', chart_labels_post_tax_deductions: '세후 공제', chart_labels_expenses: '지출', chart_labels_remaining_budget: '남은 예산',
        budget_status_surplus: '예산 흑자입니다!', budget_status_deficit: '예산 적자입니다!', budget_status_balanced: '예산이 균형을 이룹니다!',
    }
};

// 3. 헬퍼 & 계산 함수
function convertToAnnual(amount, frequency) {
    amount = parseFloat(amount) || 0;
    switch (frequency) {
        case 'monthly': return amount * 12;
        case 'bi-weekly': return amount * 26;
        case 'weekly': return amount * 52;
        default: return amount;
    }
}

function calculateTotalForSection(items, customItems, sectionFrequency) {
    let total = 0;
    for (const key in items) {
        if (key !== 'custom') {
            total += convertToAnnual(items[key], sectionFrequency);
        }
    }
    total += customItems.reduce((sum, item) => sum + convertToAnnual(item.amount, item.frequency || 'monthly'), 0);
    return total;
}

function calculateBudget() {
    const annualGrossSalary = convertToAnnual(data.grossSalary, data.salaryFrequency);
    const totalAnnualTaxes = calculateTotalForSection(data.taxes, data.taxes.custom, data.frequencies.tax);
    const totalAnnualPreTaxDeductions = calculateTotalForSection(data.preTaxDeductions, data.preTaxDeductions.custom, data.frequencies.preTax);
    const totalAnnualPostTaxDeductions = calculateTotalForSection(data.postTaxDeductions, data.postTaxDeductions.custom, data.frequencies.postTax);
    const totalAnnualExpenses = calculateTotalForSection(data.expenses, data.expenses.custom, data.frequencies.expense);

    const netSalary = annualGrossSalary - totalAnnualTaxes - totalAnnualPreTaxDeductions - totalAnnualPostTaxDeductions;
    const remainingBudget = netSalary - totalAnnualExpenses;

    return { annualGrossSalary, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, netSalary, totalAnnualExpenses, remainingBudget };
}

// 4. UI 업데이트 & 렌더링
function formatCurrency(amount) {
    // 숫자 서식(쉼표 등)은 언어 설정에 맞추고, 통화 기호는 '$'로 고정합니다.
    const lang = data.currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
    
    const numberPart = new Intl.NumberFormat(lang, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);

    return `$${numberPart}`;
}

function updateDisplay() {
    // 1. UI에서 데이터 객체로 값 업데이트
    data.grossSalary = parseFloat(grossSalaryInput.value) || 0;
    data.salaryFrequency = salaryFrequencySelect.value;
    data.budgetRule = budgetRuleSelect.value;
    data.frequencies = {
        tax: taxFrequencySelect.value,
        preTax: preTaxFrequencySelect.value,
        postTax: postTaxFrequencySelect.value,
        expense: expenseFrequencySelect.value,
    };
    Object.keys(taxInputs).forEach(key => data.taxes[key] = parseFloat(taxInputs[key].value) || 0);
    Object.keys(preTaxDeductInputs).forEach(key => data.preTaxDeductions[key] = parseFloat(preTaxDeductInputs[key].value) || 0);
    Object.keys(postTaxDeductInputs).forEach(key => data.postTaxDeductions[key] = parseFloat(postTaxDeductInputs[key].value) || 0);
    Object.keys(expenseInputs).forEach(key => data.expenses[key] = parseFloat(expenseInputs[key].value) || 0);

    // 2. 계산 실행
    const { annualGrossSalary, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, netSalary, totalAnnualExpenses, remainingBudget } = calculateBudget();

    // 3. 계산 결과를 UI에 표시
    annualSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary);
    grossSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary);
    totalTaxesDisplay.textContent = formatCurrency(totalAnnualTaxes);
    totalPreTaxDisplay.textContent = formatCurrency(totalAnnualPreTaxDeductions);
    totalPostTaxDisplay.textContent = formatCurrency(totalAnnualPostTaxDeductions);
    netSalaryDisplay.textContent = formatCurrency(netSalary);
    totalExpensesDisplay.textContent = formatCurrency(totalAnnualExpenses);
    
    remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);
    remainingBudgetDisplay.className = remainingBudget > 0 ? 'positive' : remainingBudget < 0 ? 'negative' : 'balanced';

    // 4. 나머지 UI 요소들 업데이트
    renderAllCustomLists();
    applyBudgetRule(netSalary, totalAnnualExpenses);
    updateBudgetStatus(remainingBudget);
    updateCharts();
    saveData();
}

function renderAllCustomLists() {
    renderCustomList(customTaxList, data.taxes.custom, 'tax');
    renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
    renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
    renderCustomList(customExpenseList, data.expenses.custom, 'expense');
}

function renderCustomList(listElement, customItems, type) {
    if (!listElement) return;
    const lang = data.currentLanguage;
    listElement.innerHTML = customItems.map((item, index) => `
        <li class="custom-list-item">
            <input type="text" value="${item.name}" placeholder="${translations[lang].custom_item_name}" class="custom-item-name form-control" data-index="${index}" data-type="${type}">
            <input type="number" value="${item.amount}" placeholder="${translations[lang].custom_item_amount}" class="custom-item-amount form-control" data-index="${index}" data-type="${type}">
            <select class="custom-item-frequency form-control" data-index="${index}" data-type="${type}">
                <option value="monthly"${item.frequency === 'monthly' ? ' selected' : ''}>${translations[lang].frequency_monthly}</option>
                <option value="annual"${item.frequency === 'annual' ? ' selected' : ''}>${translations[lang].frequency_annually}</option>
                <option value="bi-weekly"${item.frequency === 'bi-weekly' ? ' selected' : ''}>${translations[lang].frequency_bi_weekly}</option>
                <option value="weekly"${item.frequency === 'weekly' ? ' selected' : ''}>${translations[lang].frequency_weekly}</option>
            </select>
            <button class="remove-btn btn btn-danger" data-index="${index}" data-type="${type}">${translations[lang].remove}</button>
        </li>
    `).join('');

    listElement.querySelectorAll('.custom-item-name, .custom-item-amount, .custom-item-frequency').forEach(el => el.addEventListener('input', handleCustomItemChange));
    listElement.querySelectorAll('.remove-btn').forEach(button => button.addEventListener('click', removeCustomItem));
}

function updateBudgetStatus(remainingBudget) {
    if (!budgetStatusDisplay) return;
    const lang = data.currentLanguage;
    if (remainingBudget > 0) {
        budgetStatusDisplay.textContent = translations[lang].budget_status_surplus;
        budgetStatusDisplay.className = 'status-surplus';
    } else if (remainingBudget < 0) {
        budgetStatusDisplay.textContent = translations[lang].budget_status_deficit;
        budgetStatusDisplay.className = 'status-deficit';
    } else {
        budgetStatusDisplay.textContent = translations[lang].budget_status_balanced;
        budgetStatusDisplay.className = 'status-balanced';
    }
}

// 5. 커스텀 항목 핸들러
function addCustomItem(event) {
    const type = event.target.dataset.type;
    const targetMap = { 'tax': data.taxes, 'pre-tax': data.preTaxDeductions, 'post-tax': data.postTaxDeductions, 'expense': data.expenses };
    if (targetMap[type]) {
        targetMap[type].custom.push({ name: '', amount: 0, frequency: 'monthly' });
        updateDisplay();
    }
}

function handleCustomItemChange(event) {
    const { index, type } = event.target.dataset;
    const targetMap = { 'tax': data.taxes, 'pre-tax': data.preTaxDeductions, 'post-tax': data.postTaxDeductions, 'expense': data.expenses };
    const item = targetMap[type].custom[parseInt(index)];

    if (event.target.classList.contains('custom-item-name')) item.name = event.target.value;
    else if (event.target.classList.contains('custom-item-amount')) item.amount = parseFloat(event.target.value) || 0;
    else if (event.target.classList.contains('custom-item-frequency')) item.frequency = event.target.value;
    updateDisplay();
}

function removeCustomItem(event) {
    const { index, type } = event.target.dataset;
    const targetMap = { 'tax': data.taxes, 'pre-tax': data.preTaxDeductions, 'post-tax': data.postTaxDeductions, 'expense': data.expenses };
    targetMap[type].custom.splice(parseInt(index), 1);
    updateDisplay();
}

// 6. 언어 & 테마
function applyLanguage() {
    const lang = data.currentLanguage;
    document.documentElement.lang = lang;
    languageToggleBtn.textContent = lang === 'ko' ? 'EN' : 'KO';
    
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        const translation = translations[lang][key];
        if (translation) {
            if (element.placeholder !== undefined) element.placeholder = translation;
            else element.textContent = translation;
        }
    });
    updateDisplay();
}

function applyDarkMode() {
    const icon = darkmodeToggleBtn.querySelector('i');
    if (data.isDarkMode) {
        document.body.classList.add('dark-mode');
        if(icon) icon.className = 'ri-sun-line';
    } else {
        document.body.classList.remove('dark-mode');
        if(icon) icon.className = 'ri-moon-line';
    }
}

// 7. 데이터 관리
function saveData() {
    localStorage.setItem('budgetData', JSON.stringify(data));
}

function loadData() {
    const savedData = localStorage.getItem('budgetData');
    if (savedData) Object.assign(data, JSON.parse(savedData));

    grossSalaryInput.value = data.grossSalary;
    salaryFrequencySelect.value = data.salaryFrequency;
    budgetRuleSelect.value = data.budgetRule;
    taxFrequencySelect.value = data.frequencies.tax;
    preTaxFrequencySelect.value = data.frequencies.preTax;
    postTaxFrequencySelect.value = data.frequencies.postTax;
    expenseFrequencySelect.value = data.frequencies.expense;

    Object.keys(taxInputs).forEach(key => taxInputs[key].value = data.taxes[key] || 0);
    Object.keys(preTaxDeductInputs).forEach(key => preTaxDeductInputs[key].value = data.preTaxDeductions[key] || 0);
    Object.keys(postTaxDeductInputs).forEach(key => postTaxDeductInputs[key].value = data.postTaxDeductions[key] || 0);
    Object.keys(expenseInputs).forEach(key => expenseInputs[key].value = data.expenses[key] || 0);
    
    applyDarkMode();
    applyLanguage();
}

// 8. 차트
function createOrUpdateChart(instance, canvasId, label, dataValues, labels) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#8AC926', '#A1C935'];
    const ctx = document.getElementById(canvasId);
    if (!ctx) return instance;

    const chartData = {
        labels: labels,
        datasets: [{
            label: label,
            data: dataValues,
            backgroundColor: colors.slice(0, dataValues.length),
            hoverOffset: 4
        }]
    };
    
    if (instance) {
        instance.data = chartData;
        instance.options.plugins.title.text = label;
        instance.update();
        return instance;
    }
    
    return new Chart(ctx, {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: label }
            }
        }
    });
}

function updateCharts() {
    const { totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget } = calculateBudget();
    const lang = data.currentLanguage;

    const extractChartData = (items, customItems, sectionFrequency) => {
        let labels = [], amounts = [];
        for(const key in items) {
            if(key !== 'custom' && items[key] > 0) {
                // HTML id에서 숫자 제거 (예: 'tax-federal-1' -> 'tax-federal')
                const cleanKey = key.replace(/-\d$/, ''); 
                // 번역 키 형식으로 변환 (예: 'tax-federal' -> 'label_tax_federal')
                const translationKey = `label_${cleanKey.replace(/-/g, '_')}`;
                labels.push(translations[lang][translationKey] || key);
                amounts.push(convertToAnnual(items[key], sectionFrequency));
            }
        }
        customItems.forEach(item => {
            if(item.amount > 0) {
                labels.push(item.name);
                amounts.push(convertToAnnual(item.amount, item.frequency));
            }
        });
        return { labels, amounts };
    };
    
    const taxData = extractChartData(data.taxes, data.taxes.custom, data.frequencies.tax);
    taxChartInstance = createOrUpdateChart(taxChartInstance, 'tax-chart', translations[lang].chart_taxes, taxData.amounts, taxData.labels);

    const preTaxData = extractChartData(data.preTaxDeductions, data.preTaxDeductions.custom, data.frequencies.preTax);
    preTaxDeductChartInstance = createOrUpdateChart(preTaxDeductChartInstance, 'pre-tax-deduct-chart', translations[lang].chart_pre_tax, preTaxData.amounts, preTaxData.labels);

    const postTaxData = extractChartData(data.postTaxDeductions, data.postTaxDeductions.custom, data.frequencies.postTax);
    postTaxDeductChartInstance = createOrUpdateChart(postTaxDeductChartInstance, 'post-tax-deduct-chart', translations[lang].chart_post_tax, postTaxData.amounts, postTaxData.labels);

    const expenseData = extractChartData(data.expenses, data.expenses.custom, data.frequencies.expense);
    expensesChartInstance = createOrUpdateChart(expensesChartInstance, 'expenses-chart', translations[lang].chart_expenses, expenseData.amounts, expenseData.labels);

    const overallData = [totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, Math.max(0, remainingBudget)];
    const overallLabels = [translations[lang].chart_labels_taxes, translations[lang].chart_labels_pre_tax_deductions, translations[lang].chart_labels_post_tax_deductions, translations[lang].chart_labels_expenses, translations[lang].chart_labels_remaining_budget];
    const filteredAmounts = overallData.filter(v => v > 0);
    const filteredLabels = overallLabels.filter((_, i) => overallData[i] > 0);
    budgetDistributionChartInstance = createOrUpdateChart(budgetDistributionChartInstance, 'budget-distribution-chart', translations[lang].chart_budget_distribution, filteredAmounts, filteredLabels);
}


// 9. 예산 규칙
function applyBudgetRule(netSalary, totalAnnualExpenses) {
    const rules = { '50-30-20': [0.5, 0.3, 0.2], '70-20-10': [0.7, 0.2, 0.1], '80-20': [0.8, 0, 0.2] };
    const [needs, wants, savings] = rules[data.budgetRule] || rules['50-30-20'];

    ruleNeedsDisplay.textContent = formatCurrency(netSalary * needs);
    ruleWantsDisplay.textContent = formatCurrency(netSalary * wants);
    ruleSavingsDisplay.textContent = formatCurrency(netSalary * savings);
    ruleTotalDisplay.textContent = formatCurrency(netSalary);
    
    actualNeedsDisplay.textContent = formatCurrency(totalAnnualExpenses);
    actualWantsDisplay.textContent = formatCurrency(0);
    actualSavingsDisplay.textContent = formatCurrency(netSalary - totalAnnualExpenses);
    actualTotalDisplay.textContent = formatCurrency(netSalary);
}

// 10. 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 요소 할당
    grossSalaryInput = document.getElementById('salary-gross');
    salaryFrequencySelect = document.getElementById('salary-frequency-select');
    taxFrequencySelect = document.getElementById('tax-frequency-select');
    preTaxFrequencySelect = document.getElementById('pre-tax-frequency-select');
    postTaxFrequencySelect = document.getElementById('post-tax-frequency-select');
    expenseFrequencySelect = document.getElementById('expense-frequency-select');
    
    annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');
    grossSalarySummaryDisplay = document.getElementById('gross-salary-summary-display');
    totalTaxesDisplay = document.getElementById('total-taxes-display');
    totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
    totalPostTaxDisplay = document.getElementById('total-post-tax-display');
    netSalaryDisplay = document.getElementById('net-salary-display');
    totalExpensesDisplay = document.getElementById('total-expenses-display');
    remainingBudgetDisplay = document.getElementById('remaining-budget-display');
    
    Object.assign(taxInputs, { federal: document.getElementById('tax-federal-1'), state: document.getElementById('tax-state-1'), oasdi: document.getElementById('tax-oasdi-1'), medicare: document.getElementById('tax-medicare-1'), casdi: document.getElementById('tax-casdi-1') });
    Object.assign(preTaxDeductInputs, { medical: document.getElementById('deduct-medical-1'), dental: document.getElementById('deduct-dental-1'), vision: document.getElementById('deduct-vision-1'), '401k-trad': document.getElementById('deduct-401k-trad-1') });
    Object.assign(postTaxDeductInputs, { spp: document.getElementById('deduct-spp-1'), adnd: document.getElementById('deduct-adnd-1'), '401k-roth': document.getElementById('deduct-401k-roth-1'), ltd: document.getElementById('deduct-ltd-1') });
    Object.assign(expenseInputs, { rent: document.getElementById('exp-rent-1'), utilities: document.getElementById('exp-utilities-1'), internet: document.getElementById('exp-internet-1'), phone: document.getElementById('exp-phone-1'), groceries: document.getElementById('exp-groceries-1'), dining: document.getElementById('exp-dining-1'), transport: document.getElementById('exp-transport-1'), shopping: document.getElementById('exp-shopping-1'), health: document.getElementById('exp-health-1'), entertainment: document.getElementById('exp-entertainment-1') });
    
    customTaxList = document.getElementById('tax-custom-list');
    customPreTaxDeductList = document.getElementById('pre-tax-custom-list');
    customPostTaxDeductList = document.getElementById('post-tax-custom-list');
    customExpenseList = document.getElementById('expenses-custom-list');
    
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

    // 이벤트 리스너
    document.querySelectorAll('input[type="number"], select').forEach(el => el.addEventListener('input', updateDisplay));
    document.querySelectorAll('.add-custom-btn').forEach(btn => btn.addEventListener('click', addCustomItem));
    
    languageToggleBtn.addEventListener('click', () => {
        data.currentLanguage = data.currentLanguage === 'ko' ? 'en' : 'ko';
        applyLanguage();
    });
    darkmodeToggleBtn.addEventListener('click', () => {
        data.isDarkMode = !data.isDarkMode;
        applyDarkMode();
        saveData();
    });

    exportJsonBtn.addEventListener('click', () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'budget_data.json'; a.click();
        URL.revokeObjectURL(url);
    });
    importJsonBtn.addEventListener('click', () => importJsonInput.click());
    importJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    if (confirm(translations[data.currentLanguage].confirm_import_data)) {
                        Object.assign(data, JSON.parse(e.target.result));
                        loadData();
                        alert(translations[data.currentLanguage].alert_data_loaded);
                    }
                } catch (error) { alert(translations[data.currentLanguage].invalid_json); }
            };
            reader.readAsText(file);
        }
    });
    clearAllDataBtn.addEventListener('click', () => {
        if (confirm(translations[data.currentLanguage].confirm_clear_data)) {
            localStorage.removeItem('budgetData');
            window.location.reload();
        }
    });
    aiReportBtn.addEventListener('click', () => {
        aiReportBox.innerHTML = `<p>${translations[data.currentLanguage].ai_report_placeholder}</p>`;
    });

    // 초기 로드
    loadData();
});
