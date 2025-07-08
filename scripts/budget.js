// 0. 전역 변수
let grossSalaryInput, salaryFrequencySelect;
let taxFrequencySelect, preTaxFrequencySelect, postTaxFrequencySelect, expenseFrequencySelect;
let summaryFrequencySelect; 
let annualSalarySummaryDisplay, grossSalarySummaryDisplay, totalTaxesDisplay, totalPreTaxDisplay, totalPostTaxDisplay, netSalaryDisplay, totalExpensesDisplay, remainingBudgetDisplay;
const taxInputs = {}, preTaxDeductInputs = {}, postTaxDeductInputs = {}, expenseInputs = {};
let customTaxList, customPreTaxDeductList, customPostTaxDeductList, customExpenseList;
let languageToggleBtn, darkmodeToggleBtn;
let exportJsonBtn, importJsonBtn, importJsonInput, clearAllDataBtn;
let aiReportBtn, aiReportBox;
let budgetRuleSelect, budgetRuleBreakdown;
let taxChartInstance, preTaxDeductChartInstance, postTaxDeductChartInstance, expensesChartInstance, budgetDistributionChartInstance;

// 1. 초기 데이터 및 분류 정의
const data = {
    grossSalary: 0,
    salaryFrequency: 'monthly',
    summaryFrequency: 'monthly', 
    currency: 'USD', 
    frequencies: { tax: 'monthly', preTax: 'monthly', postTax: 'monthly', expense: 'monthly' },
    taxes: { federal: 0, state: 0, oasdi: 0, medicare: 0, casdi: 0, custom: [] },
    preTaxDeductions: { medical: 0, dental: 0, vision: 0, '401k-trad': 0, custom: [] },
    postTaxDeductions: { spp: 0, adnd: 0, '401k-roth': 0, ltd: 0, custom: [] },
    expenses: { rent: 0, utilities: 0, internet: 0, phone: 0, groceries: 0, dining: 0, transport: 0, shopping: 0, health: 0, entertainment: 0, custom: [] },
    budgetRule: '50-30-20',
    currentLanguage: 'ko',
    isDarkMode: false
};

const ITEM_CATEGORIES = {
    'tax-federal-1': 'fixed', 'tax-state-1': 'fixed', 'tax-oasdi-1': 'fixed', 'tax-medicare-1': 'fixed', 'tax-casdi-1': 'fixed',
    'deduct-medical-1': 'needs', 'deduct-dental-1': 'needs', 'deduct-vision-1': 'needs', 'deduct-ltd-1': 'needs', 'deduct-adnd-1': 'needs',
    'deduct-401k-trad-1': 'savings', 'deduct-401k-roth-1': 'savings', 'deduct-spp-1': 'savings',
    'exp-rent-1': 'needs', 'exp-utilities-1': 'needs', 'exp-internet-1': 'needs', 'exp-phone-1': 'needs', 'exp-groceries-1': 'needs', 'exp-transport-1': 'needs', 'exp-health-1': 'needs',
    'exp-dining-1': 'wants', 'exp-shopping-1': 'wants', 'exp-entertainment-1': 'wants'
};

// 2. 언어별 텍스트
const translations = {
    en: {
        tag_needs: 'Needs', tag_wants: 'Wants', tag_savings: 'Savings', tag_debt: 'Debt', tag_fixed: 'Fixed',
        rule_50_30_20_title: '50/30/20 Rule (Needs/Wants/Savings)', rule_70_20_10_title: '70/20/10 Rule (Spending/Savings/Debt)', rule_80_20_title: '80/20 Rule (Spending/Savings)',
        rule_category_needs: 'Needs', rule_category_wants: 'Wants', rule_category_savings: 'Savings', rule_category_savings_debt: 'Savings & Debt', rule_category_spending: 'Spending', rule_category_debt: 'Debt Repayment', rule_category_surplus: 'Surplus (Unallocated)',
        label_summary_frequency: 'Summary Frequency:', app_title: 'Budget Management Tool', section_salary_title: 'Gross Salary', label_gross_salary: 'Gross Salary', frequency_monthly: 'Monthly', frequency_annually: 'Annual', frequency_weekly: 'Weekly', frequency_bi_weekly: 'Bi-Weekly',
        label_annual_salary: 'Annual Gross Salary:', section_taxes_title: 'Taxes', label_frequency: 'Frequency:', label_federal_withholding: 'Federal Withholding', label_state_tax: 'State Tax', label_oasdi: 'OASDI', label_medicare: 'Medicare', label_ca_sdi: 'CA SDI', btn_add_item: 'Add Item',
        section_pre_tax_title: 'Pre-Tax Deductions', label_medical_premium: 'Medical Premium', label_dental_premium: 'Dental Premium', label_vision_premium: 'Vision Premium', label_401k_traditional: '401k Traditional',
        section_post_tax_title: 'Post-Tax Deductions', label_spp: 'SPP', label_adnd: 'AD&D', label_401k_roth: '401k Roth', label_ltd: 'LTD', section_expenses_title: 'Expense Management',
        label_rent_mortgage: 'Rent/Mortgage', label_utilities: 'Utilities', label_internet: 'Internet', label_phone: 'Phone Bill', label_groceries: 'Groceries', label_dining_out: 'Dining Out',
        label_transportation: 'Transportation', label_shopping: 'Shopping', label_health_wellness: 'Health/Wellness', label_entertainment: 'Entertainment', section_summary_title: 'Budget Summary',
        label_total_taxes: 'Total Taxes:', label_total_pre_tax: 'Total Pre-Tax:', label_total_post_tax: 'Total Post-Tax:', label_net_salary: 'Net Salary:', label_total_expenses: 'Total Expenses:', label_remaining_budget: 'Remaining Budget:',
        section_budget_rule_title: 'Budget Rule Application', label_budget_rule_select: 'Select Budget Rule:', section_ai_title: 'AI Expense Report', btn_ai_report: 'Generate AI Report', ai_report_placeholder: 'Click "Generate AI Report" for insights on your spending habits.',
        section_data_title: 'Data Management', btn_export: 'Export JSON', btn_import: 'Import JSON', btn_clear_all_data: 'Clear All Data',
        custom_item_name: 'Item Name', custom_item_amount: 'Amount', custom_item_category: 'Category', remove: 'Remove', confirm_clear_data: 'Are you sure you want to clear all data?', confirm_import_data: 'This will overwrite existing data. Continue?', invalid_json: 'Invalid JSON file.',
        chart_taxes: 'Taxes Distribution', chart_pre_tax: 'Pre-Tax Deductions', chart_post_tax: 'Post-Tax Deductions', chart_expenses: 'Expenses Distribution', chart_budget_distribution: 'Overall Budget Distribution',
        chart_labels_taxes: 'Taxes', chart_labels_pre_tax_deductions: 'Pre-Tax', chart_labels_post_tax_deductions: 'Post-Tax', chart_labels_expenses: 'Expenses', chart_labels_remaining_budget: 'Remaining',
        ai_report_title: 'Your Financial Snapshot:', ai_report_spending_habit: 'Your largest spending category is', ai_report_on_track: 'You are on track with your budget rule.', ai_report_over_spending: 'You are overspending in the following categories:', ai_report_positive_savings: 'Great job on saving!', ai_report_negative_savings: 'Consider increasing your savings.', ai_report_surplus_tip: 'You have a surplus! Consider allocating it to your savings or paying off debt.'
    },
    ko: {
        tag_needs: '필수', tag_wants: '선택', tag_savings: '저축', tag_debt: '부채', tag_fixed: '고정',
        rule_50_30_20_title: '50/30/20 규칙 (필수/선택/저축)', rule_70_20_10_title: '70/20/10 규칙 (생활비/저축/부채)', rule_80_20_title: '80/20 규칙 (지출/저축)',
        rule_category_needs: '필수 지출', rule_category_wants: '선택 지출', rule_category_savings: '저축', rule_category_savings_debt: '저축 & 부채', rule_category_spending: '생활비', rule_category_debt: '부채 상환', rule_category_surplus: '잉여금 (미배정)',
        label_summary_frequency: '요약 주기:', app_title: '예산 관리 도구', section_salary_title: '총 급여', label_gross_salary: '총 급여', frequency_monthly: '월별', frequency_annually: '연간', frequency_weekly: '주별', frequency_bi_weekly: '2주별',
        label_annual_salary: '연간 총 급여:', section_taxes_title: '세금', label_frequency: '주기:', label_federal_withholding: '연방 원천징수', label_state_tax: '주 세금', label_oasdi: 'OASDI', label_medicare: '메디케어', label_ca_sdi: 'CA SDI', btn_add_item: '항목 추가',
        section_pre_tax_title: '세전 공제', label_medical_premium: '의료 보험료', label_dental_premium: '치과 보험료', label_vision_premium: '시력 보험료', label_401k_traditional: '401k 일반',
        section_post_tax_title: '세후 공제', label_spp: '주식 구매 계획', label_adnd: 'AD&D', label_401k_roth: '401k Roth', label_ltd: '장기 장애', section_expenses_title: '지출 관리',
        label_rent_mortgage: '월세/주택담보대출', label_utilities: '공과금', label_internet: '인터넷', label_phone: '휴대폰 요금', label_groceries: '식료품', label_dining_out: '외식',
        label_transportation: '교통비', label_shopping: '쇼핑', label_health_wellness: '건강/웰빙', label_entertainment: '오락', section_summary_title: '예산 요약',
        label_total_taxes: '총 세금:', label_total_pre_tax: '총 세전 공제액:', label_total_post_tax: '총 세후 공제액:', label_net_salary: '순 급여:', label_total_expenses: '총 지출:', label_remaining_budget: '남은 예산:',
        section_budget_rule_title: '예산 규칙 적용', label_budget_rule_select: '예산 규칙 선택:', section_ai_title: 'AI 지출 보고서', btn_ai_report: 'AI 보고서 생성', ai_report_placeholder: '"AI 보고서 생성"을 클릭하여 지출 습관에 대한 통찰력을 얻으세요.',
        section_data_title: '데이터 관리', btn_export: 'JSON 내보내기', btn_import: 'JSON 가져오기', btn_clear_all_data: '모든 데이터 지우기',
        custom_item_name: '항목 이름', custom_item_amount: '금액', custom_item_category: '카테고리', remove: '삭제', confirm_clear_data: '정말 모든 데이터를 지우시겠습니까?', confirm_import_data: '기존 데이터를 덮어씁니다. 계속하시겠습니까?', invalid_json: '유효하지 않은 JSON 파일입니다.',
        chart_taxes: 'Taxes Distribution', chart_pre_tax: 'Pre-Tax Deductions', chart_post_tax: 'Post-Tax Deductions', chart_expenses: 'Expenses Distribution', chart_budget_distribution: 'Overall Budget Distribution',
        chart_labels_taxes: 'Taxes', chart_labels_pre_tax_deductions: 'Pre-Tax', chart_labels_post_tax_deductions: 'Post-Tax', chart_labels_expenses: 'Expenses', chart_labels_remaining_budget: 'Remaining',
        ai_report_title: '나의 금융 스냅샷:', ai_report_spending_habit: '가장 큰 지출 항목은', ai_report_on_track: '예산 규칙을 잘 지키고 있습니다.', ai_report_over_spending: '다음 항목에서 예산을 초과하고 있습니다:', ai_report_positive_savings: '훌륭한 저축 습관입니다!', ai_report_negative_savings: '저축액을 늘리는 것을 고려해 보세요.', ai_report_surplus_tip: '잉여금이 있습니다! 저축을 늘리거나 부채를 상환하는 데 사용해 보세요.'
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

function convertFromAnnual(annualAmount, frequency) {
    annualAmount = parseFloat(annualAmount) || 0;
    switch (frequency) {
        case 'monthly': return annualAmount / 12;
        case 'bi-weekly': return annualAmount / 26;
        case 'weekly': return annualAmount / 52;
        default: return annualAmount; // 'annual'
    }
}

// ✨✨✨ calculateTotalForSection 함수 수정 ✨✨✨
function calculateTotalForSection(items, customItems, freqKey) {
    let total = 0;
    const freq = data.frequencies[freqKey]; // freqKey를 직접 받아 사용
    
    for (const key in items) {
        if (key !== 'custom' && typeof items[key] === 'number') {
            total += convertToAnnual(items[key], freq);
        }
    }
    if (customItems) {
        total += customItems.reduce((sum, item) => sum + convertToAnnual(item.amount, item.frequency), 0);
    }
    return total;
}

// ✨✨✨ calculateBudget 함수 수정 ✨✨✨
function calculateBudget() {
    const annualGrossSalary = convertToAnnual(data.grossSalary, data.salaryFrequency);
    // 각 섹션의 주기를 명확하게 전달하여 계산
    const totalAnnualTaxes = calculateTotalForSection(data.taxes, data.taxes.custom, 'tax');
    const totalAnnualPreTaxDeductions = calculateTotalForSection(data.preTaxDeductions, data.preTaxDeductions.custom, 'preTax');
    const totalAnnualPostTaxDeductions = calculateTotalForSection(data.postTaxDeductions, data.postTaxDeductions.custom, 'postTax');
    
    const { needs, wants, savings, debt } = categorizeAll();
    const totalAnnualExpenses = needs + wants; // 총 지출은 Needs와 Wants의 합

    const netSalary = annualGrossSalary - totalAnnualTaxes - totalAnnualPreTaxDeductions - totalAnnualPostTaxDeductions;
    const remainingBudget = netSalary - (totalAnnualExpenses + savings + debt); // 잉여금은 순수익에서 모든 지출, 저축, 부채를 뺀 금액

    return { annualGrossSalary, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, netSalary, totalAnnualExpenses, remainingBudget };
}


// 4. UI 업데이트 & 렌더링
function formatCurrency(amount) {
    amount = parseFloat(amount) || 0;
    const lang = data.currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
    const numberPart = new Intl.NumberFormat(lang, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
    return `$${numberPart}`;
}

function updateDisplay() {
    data.grossSalary = parseFloat(grossSalaryInput.value) || 0;
    data.salaryFrequency = salaryFrequencySelect.value;
    data.summaryFrequency = summaryFrequencySelect.value;
    data.budgetRule = budgetRuleSelect.value;
    data.frequencies = {
        tax: taxFrequencySelect.value, preTax: preTaxFrequencySelect.value,
        postTax: postTaxFrequencySelect.value, expense: expenseFrequencySelect.value,
    };
    ['taxes', 'preTaxDeductions', 'postTaxDeductions', 'expenses'].forEach(section => {
        const inputs = section === 'taxes' ? taxInputs : section === 'preTaxDeductions' ? preTaxDeductInputs : section === 'postTaxDeductions' ? postTaxDeductInputs : expenseInputs;
        Object.keys(inputs).forEach(key => {
            if(data[section]) data[section][key] = parseFloat(inputs[key].value) || 0;
        });
    });

    const { annualGrossSalary, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, netSalary, totalAnnualExpenses, remainingBudget } = calculateBudget();
    const summaryFreq = data.summaryFrequency; 

    annualSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary);
    grossSalarySummaryDisplay.textContent = formatCurrency(convertFromAnnual(annualGrossSalary, summaryFreq));
    totalTaxesDisplay.textContent = formatCurrency(convertFromAnnual(totalAnnualTaxes, summaryFreq));
    totalPreTaxDisplay.textContent = formatCurrency(convertFromAnnual(totalAnnualPreTaxDeductions, summaryFreq));
    totalPostTaxDisplay.textContent = formatCurrency(convertFromAnnual(totalAnnualPostTaxDeductions, summaryFreq));
    netSalaryDisplay.textContent = formatCurrency(convertFromAnnual(netSalary, summaryFreq));
    totalExpensesDisplay.textContent = formatCurrency(convertFromAnnual(totalAnnualExpenses, summaryFreq));
    
    const periodicRemaining = convertFromAnnual(remainingBudget, summaryFreq);
    remainingBudgetDisplay.textContent = formatCurrency(periodicRemaining);
    remainingBudgetDisplay.className = periodicRemaining > 0 ? 'positive' : periodicRemaining < 0 ? 'negative' : 'balanced';

    renderAllCustomLists();
    const breakdownData = applyBudgetRule();
    renderBudgetRule(breakdownData, remainingBudget, summaryFreq);
    updateCharts();
    renderCategoryTags();
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
    listElement.innerHTML = customItems.map((item, index) => {
        const isTax = type === 'tax';
        const categoryDropdown = !isTax ? `
            <select class="custom-item-category form-control" data-index="${index}" data-type="${type}">
                <option value="wants" ${item.category === 'wants' ? 'selected' : ''}>${translations[lang].tag_wants}</option>
                <option value="needs" ${item.category === 'needs' ? 'selected' : ''}>${translations[lang].tag_needs}</option>
                <option value="savings" ${item.category === 'savings' ? 'selected' : ''}>${translations[lang].tag_savings}</option>
                <option value="debt" ${item.category === 'debt' ? 'selected' : ''}>${translations[lang].tag_debt}</option>
            </select>
        ` : '';
        const gridStyle = isTax ? '2fr 1fr 1fr auto' : '2fr 1fr 1fr 1fr auto';
        return `
            <li class="custom-list-item" style="grid-template-columns: ${gridStyle};">
                <input type="text" value="${item.name}" placeholder="${translations[lang].custom_item_name}" class="custom-item-name form-control" data-index="${index}" data-type="${type}">
                <input type="number" value="${item.amount}" placeholder="${translations[lang].custom_item_amount}" class="custom-item-amount form-control" data-index="${index}" data-type="${type}">
                <select class="custom-item-frequency form-control" data-index="${index}" data-type="${type}">
                    <option value="monthly"${item.frequency === 'monthly' ? ' selected' : ''}>${translations[lang].frequency_monthly}</option>
                    <option value="annual"${item.frequency === 'annual' ? ' selected' : ''}>${translations[lang].frequency_annually}</option>
                    <option value="bi-weekly"${item.frequency === 'bi-weekly' ? ' selected' : ''}>${translations[lang].frequency_bi_weekly}</option>
                    <option value="weekly"${item.frequency === 'weekly' ? ' selected' : ''}>${translations[lang].frequency_weekly}</option>
                </select>
                ${categoryDropdown}
                <button class="remove-btn btn btn-danger" data-index="${index}" data-type="${type}">${translations[lang].remove}</button>
            </li>
        `;
    }).join('');

    listElement.querySelectorAll('.custom-item-name, .custom-item-amount').forEach(el => el.addEventListener('change', handleCustomItemChange));
    listElement.querySelectorAll('.custom-item-frequency, .custom-item-category').forEach(el => el.addEventListener('input', handleCustomItemChange));
    listElement.querySelectorAll('.remove-btn').forEach(button => button.addEventListener('click', removeCustomItem));
}

function renderCategoryTags() {
    const lang = data.currentLanguage;
    document.querySelectorAll('.form-group[data-item-id]').forEach(group => {
        const itemId = group.dataset.itemId;
        const category = ITEM_CATEGORIES[itemId];
        const tagElement = group.querySelector('.category-tag');
        if (category && tagElement) {
            tagElement.textContent = translations[lang][`tag_${category}`] || '';
            tagElement.className = `category-tag ${category}`;
        } else if (tagElement) {
            tagElement.textContent = '';
            tagElement.className = 'category-tag';
        }
    });
}

// 5. 커스텀 항목 핸들러
function addCustomItem(event) {
    const type = event.target.dataset.type;
    const targetMap = { 'tax': data.taxes, 'pre-tax': data.preTaxDeductions, 'post-tax': data.postTaxDeductions, 'expense': data.expenses };
    if (targetMap[type]) {
        targetMap[type].custom.push({ name: '', amount: 0, frequency: 'monthly', category: 'wants' });
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
    else if (event.target.classList.contains('custom-item-category')) item.category = event.target.value;
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
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        ['preTaxDeductions', 'postTaxDeductions', 'expenses', 'taxes'].forEach(section => {
            if (parsedData[section] && parsedData[section].custom) {
                parsedData[section].custom.forEach(item => {
                    if (!item.category) item.category = 'wants';
                });
            }
        });
        Object.assign(data, parsedData);
        data.summaryFrequency = parsedData.summaryFrequency || 'monthly'; 
    }

    grossSalaryInput.value = data.grossSalary;
    salaryFrequencySelect.value = data.salaryFrequency;
    summaryFrequencySelect.value = data.summaryFrequency;
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

    const extractChartData = (items, customItems, sectionKey) => {
        let labels = [], amounts = [];
        const freq = data.frequencies[sectionKey];
        for(const key in items) {
            if(key !== 'custom' && items[key] > 0) {
                const cleanKey = key.replace(/-\d$/, ''); 
                const translationKey = `label_${cleanKey.replace(/-/g, '_')}`;
                labels.push(translations[lang][translationKey] || key);
                amounts.push(convertToAnnual(items[key], freq));
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
    
    const taxData = extractChartData(data.taxes, data.taxes.custom, 'tax');
    taxChartInstance = createOrUpdateChart(taxChartInstance, 'tax-chart', translations[lang].chart_taxes, taxData.amounts, taxData.labels);

    const preTaxData = extractChartData(data.preTaxDeductions, data.preTaxDeductions.custom, 'preTax');
    preTaxDeductChartInstance = createOrUpdateChart(preTaxDeductChartInstance, 'pre-tax-deduct-chart', translations[lang].chart_pre_tax, preTaxData.amounts, preTaxData.labels);

    const postTaxData = extractChartData(data.postTaxDeductions, data.postTaxDeductions.custom, 'postTax');
    postTaxDeductChartInstance = createOrUpdateChart(postTaxDeductChartInstance, 'post-tax-deduct-chart', translations[lang].chart_post_tax, postTaxData.amounts, postTaxData.labels);

    const expenseData = extractChartData(data.expenses, data.expenses.custom, 'expense');
    expensesChartInstance = createOrUpdateChart(expensesChartInstance, 'expenses-chart', translations[lang].chart_expenses, expenseData.amounts, expenseData.labels);

    const overallData = [totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, Math.max(0, remainingBudget)];
    const overallLabels = [translations[lang].chart_labels_taxes, translations[lang].chart_labels_pre_tax_deductions, translations[lang].chart_labels_post_tax_deductions, translations[lang].chart_labels_expenses, translations[lang].chart_labels_remaining_budget];
    const filteredAmounts = overallData.filter(v => v > 0);
    const filteredLabels = overallLabels.filter((_, i) => overallData[i] > 0);
    budgetDistributionChartInstance = createOrUpdateChart(budgetDistributionChartInstance, 'budget-distribution-chart', translations[lang].chart_budget_distribution, filteredAmounts, filteredLabels);
}


// 9. 예산 규칙 & AI 보고서
function categorizeAll() {
    let totals = { needs: 0, wants: 0, savings: 0, debt: 0 };

    const processSection = (sectionName) => {
        const sectionData = data[sectionName];
        if (!sectionData) return;

        const freqKeyMap = { 'preTaxDeductions': 'preTax', 'postTaxDeductions': 'postTax', 'expenses': 'expense' };
        const freqKey = freqKeyMap[sectionName];
        const itemPrefix = sectionName.includes('Deduct') ? 'deduct' : 'exp';

        for (const key in sectionData) {
            if (key === 'custom') continue;
            const itemId = `${itemPrefix}-${key.replace(/_/g, '-')}-1`;
            const category = ITEM_CATEGORIES[itemId];
            if (category && totals.hasOwnProperty(category)) {
                totals[category] += convertToAnnual(sectionData[key], data.frequencies[freqKey]);
            }
        }
        
        if (sectionData.custom) {
            sectionData.custom.forEach(item => {
                const category = item.category || 'wants';
                if (totals.hasOwnProperty(category)) {
                    totals[category] += convertToAnnual(item.amount, item.frequency);
                }
            });
        }
    };
    
    ['preTaxDeductions', 'postTaxDeductions', 'expenses'].forEach(processSection);
    
    return totals;
}


// ✨✨✨ applyBudgetRule 함수 수정 ✨✨✨
function applyBudgetRule() {
    const { netSalary } = calculateBudget();
    const totals = categorizeAll();
    const lang = data.currentLanguage;
    let breakdown = [];
    
    switch (data.budgetRule) {
        case '50-30-20':
            breakdown = [
                { label: translations[lang].rule_category_needs, goal: netSalary * 0.5, actual: totals.needs },
                { label: translations[lang].rule_category_wants, goal: netSalary * 0.3, actual: totals.wants },
                { label: translations[lang].rule_category_savings_debt, goal: netSalary * 0.2, actual: totals.savings + totals.debt }
            ];
            break;
        case '70-20-10':
            breakdown = [
                { label: translations[lang].rule_category_spending, goal: netSalary * 0.7, actual: totals.needs + totals.wants },
                { label: translations[lang].rule_category_savings, goal: netSalary * 0.2, actual: totals.savings },
                { label: translations[lang].rule_category_debt, goal: netSalary * 0.1, actual: totals.debt }
            ];
            break;
        case '80-20':
            breakdown = [
                { label: translations[lang].rule_category_spending, goal: netSalary * 0.8, actual: totals.needs + totals.wants + totals.debt },
                { label: translations[lang].rule_category_savings, goal: netSalary * 0.2, actual: totals.savings }
            ];
            break;
    }
    return breakdown; // 이제 breakdown 배열을 반환
}

function renderBudgetRule(breakdown, remaining, frequency) {
    if (!budgetRuleBreakdown) return;
    const lang = data.currentLanguage;

    let html = breakdown.map(item => {
        const periodicActual = convertFromAnnual(item.actual, frequency);
        const periodicGoal = convertFromAnnual(item.goal, frequency);
        const percentage = periodicGoal > 0 ? (periodicActual / periodicGoal) * 100 : 0;
        const isOverBudget = periodicActual > periodicGoal;

        return `
            <div class="rule-progress-bar-container">
                <div class="rule-progress-bar-labels">
                    <span class="rule-category-label">${item.label}</span>
                    <span class="rule-amount-label">${formatCurrency(periodicActual)} / ${formatCurrency(periodicGoal)}</span>
                </div>
                <div class="rule-progress-bar">
                    <div class="rule-progress-bar-inner ${isOverBudget ? 'over-budget' : ''}" style="width: ${Math.min(percentage, 100)}%;" title="${Math.round(percentage)}%">
                        ${Math.round(percentage)}%
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    if (remaining > 0) {
        html += `
            <div class="surplus-container">
                <span class="surplus-label">${translations[lang].rule_category_surplus}: ${formatCurrency(convertFromAnnual(remaining, frequency))}</span>
            </div>
        `;
    }

    budgetRuleBreakdown.innerHTML = html;
}

// ✨✨✨ generateAiReport 함수 수정 ✨✨✨
function generateAiReport() {
    const { netSalary, remainingBudget } = calculateBudget();
    const totals = categorizeAll();
    const lang = data.currentLanguage;
    const breakdown = applyBudgetRule(); // 이제 정상적으로 breakdown 배열을 받음

    let insights = [];
    
    // Insight 1: Largest spending category
    const spendingCats = { 
        [translations[lang].rule_category_needs]: totals.needs, 
        [translations[lang].rule_category_wants]: totals.wants, 
        [translations[lang].rule_category_debt]: totals.debt 
    };
    if (Object.values(spendingCats).some(v => v > 0)) {
        const largestCat = Object.keys(spendingCats).reduce((a, b) => spendingCats[a] > spendingCats[b] ? a : b);
        insights.push(`${translations[lang].ai_report_spending_habit} <strong>${largestCat}</strong>.`);
    }

    // Insight 2: Rule Adherence
    const overspending = breakdown.filter(item => item.actual > item.goal);
    if (overspending.length > 0) {
        insights.push(`${translations[lang].ai_report_over_spending} ${overspending.map(item => `<strong>${item.label}</strong>`).join(', ')}.`);
    } else if (netSalary > 0) {
        insights.push(translations[lang].ai_report_on_track);
    }

    // Insight 3: Savings Check
    if (totals.savings > 0) {
        insights.push(translations[lang].ai_report_positive_savings);
    } else if (netSalary > 0) {
        insights.push(translations[lang].ai_report_negative_savings);
    }
    
    // Insight 4: Surplus Usage
    if (remainingBudget > 0) {
        insights.push(translations[lang].ai_report_surplus_tip);
    }

    if (insights.length > 0) {
        aiReportBox.innerHTML = `<strong>${translations[lang].ai_report_title}</strong><ul>${insights.map(i => `<li>${i}</li>`).join('')}</ul>`;
    } else {
        aiReportBox.innerHTML = `<p>${translations[lang].ai_report_placeholder}</p>`;
    }
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
    summaryFrequencySelect = document.getElementById('summary-frequency-select');
    
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
    budgetRuleBreakdown = document.getElementById('budget-rule-breakdown');

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
    
    aiReportBtn.addEventListener('click', generateAiReport);

    // 초기 로드
    loadData();
});
