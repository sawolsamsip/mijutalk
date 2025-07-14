// 0. 전역 변수
let grossSalaryInput, salaryFrequencySelect, netIncomeInput, modeToggleCheckbox;
let taxFrequencySelect, preTaxFrequencySelect, postTaxFrequencySelect, expenseFrequencySelect;
let summaryFrequencySelect;
let annualSalarySummaryDisplay, summaryGrossSalary, summaryTotalTaxes, summaryTotalPreTax, summaryTotalPostTax, summaryNetSalary, summaryTotalExpenses, summaryRemainingBudget, summaryAdvancedView;
const taxInputs = {}, preTaxDeductInputs = {}, postTaxDeductInputs = {}, expenseInputs = {};
let customIncomeList, customTaxList, customPreTaxDeductList, customPostTaxDeductList, customExpenseList;
let languageToggleBtn, darkmodeToggleBtn, currencyToggleBtn;
let exportJsonBtn, importJsonBtn, importJsonInput, clearAllDataBtn, printBtn, emailBtn, shareBtn;
let aiReportBtn, aiReportBox;
let budgetRuleSelect, budgetRuleBreakdown;
let taxChartInstance, preTaxDeductChartInstance, postTaxDeductChartInstance, expensesChartInstance, budgetDistributionChartInstance;
let modalContainer, modalTitle, modalList, modalCloseBtn;
let advancedModeContainer, simpleModeContainer;

// 1. 초기 데이터 및 분류 정의
const data = {
    calculationMode: 'simple', // 'simple' or 'advanced'
    netIncome: 0,
    grossSalary: 0,
    salaryFrequency: 'monthly',
    customIncomes: [],
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
        app_title: 'Budget Management Tool',
        section_calculation_mode_title: 'Calculation Mode',
        mode_simple: 'Simple (Net Income)',
        mode_advanced: 'Advanced (Gross Income)',
        section_net_income_title: 'Net Income',
        label_net_income: 'Monthly Net Income (After-Tax)',
        section_salary_title: 'Gross Income',
        label_base_salary: 'Base Salary',
        frequency_monthly: 'Monthly',
        frequency_annual: 'Annual',
        btn_add_income: 'Add Custom Income',
        label_annual_salary: 'Annual Gross Income:',
        section_taxes_title: 'Taxes',
        label_frequency: 'Frequency',
        label_federal_withholding: 'Federal Withholding',
        label_state_tax: 'State Tax',
        label_oasdi: 'OASDI',
        label_medicare: 'Medicare',
        label_ca_sdi: 'CA SDI',
        btn_add_item: 'Add Custom Item',
        section_pre_tax_title: 'Pre-Tax Deductions',
        label_medical_premium: 'Medical Premium',
        label_dental_premium: 'Dental Premium',
        label_vision_premium: 'Vision Premium',
        label_401k_traditional: '401k Traditional',
        section_post_tax_title: 'Post-Tax Deductions',
        label_spp: 'SPP',
        label_adnd: 'AD&D',
        label_401k_roth: '401k Roth',
        label_ltd: 'LTD',
        section_expenses_title: 'Expense Management',
        label_rent_mortgage: 'Rent/Mortgage',
        label_utilities: 'Utilities',
        label_internet: 'Internet',
        label_phone: 'Phone Bill',
        label_groceries: 'Groceries',
        label_dining_out: 'Dining Out',
        label_transportation: 'Transportation',
        label_shopping: 'Shopping',
        label_health_wellness: 'Health/Wellness',
        label_entertainment: 'Entertainment',
        section_summary_title: 'Budget Summary',
        label_summary_frequency: 'Summary Frequency',
        label_gross_salary: 'Gross Salary:',
        label_total_taxes: 'Total Taxes:',
        label_total_pre_tax: 'Total Pre-Tax:',
        label_total_post_tax: 'Total Post-Tax:',
        label_net_salary: 'Net Salary:',
        label_total_expenses: 'Total Expenses:',
        label_remaining_budget: 'Remaining Budget:',
        section_budget_rule_title: 'Budget Rule Application',
        label_budget_rule_select: 'Select Budget Rule:',
        rule_50_30_20_title: '50/30/20 Rule (Needs/Wants/Savings)',
        rule_70_20_10_title: '70/20/10 Rule (Spending/Savings/Debt)',
        rule_80_20_title: '80/20 Rule (Spending/Savings)',
        section_ai_title: 'AI Expense Report',
        btn_ai_report: 'Generate AI Report',
        ai_report_placeholder: 'Click "Generate AI Report" for insights.',
        section_data_title: 'Data Management',
        btn_export: 'Export',
        btn_import: 'Import',
        btn_clear_all_data: 'Clear Data',
        btn_print: 'Print',
        btn_email: 'Email',
        btn_share: 'Share',
        custom_item_name: 'Item Name',
        custom_income_name: 'Income Name',
        custom_item_amount: 'Amount',
        custom_item_category: 'Category',
        remove: 'Remove',
        confirm_clear_data: 'Are you sure you want to clear all data?',
        confirm_import_data: 'This will overwrite existing data. Continue?',
        invalid_json: 'Invalid JSON file.',
        alert_data_loaded: "Data loaded successfully!",
        tag_needs: 'Needs',
        tag_wants: 'Wants',
        tag_savings: 'Savings',
        tag_debt: 'Debt',
        tag_fixed: 'Fixed',
        rule_category_needs: 'Needs',
        rule_category_wants: 'Wants',
        rule_category_savings: 'Savings',
        rule_category_savings_debt: 'Savings & Debt',
        rule_category_spending: 'Spending',
        rule_category_debt: 'Debt Repayment',
        rule_category_surplus: 'Surplus (Unallocated)',
        modal_title_needs: 'Needs Items',
        modal_title_wants: 'Wants Items',
        modal_title_savings: 'Savings & Debt Items',
        modal_title_spending: 'Spending Items',
        modal_title_debt: 'Debt Items',
        report_local_generating: "Generating Local Analysis Report...",
        report_local_failed: "Failed to generate local report. Please check the data.",
        report_local_title: "Financial Health Analysis",
        report_local_summary_title: "1. Executive Summary",
        report_local_summary_text: "Based on a {summaryFreq} net income of {netIncome}, your savings rate is <strong>{savingsRate}%</strong>. You have a remaining surplus of <strong>{remaining}</strong>. Your spending habits show strengths in <strong>{strength}</strong>, with areas for improvement in <strong>{weakness}</strong>.",
        report_local_strength: "prudent savings",
        report_local_weakness: "high discretionary spending",
        report_local_no_weakness: "balanced management",
        report_local_recommendation_title: "2. Recommended Actions",
        report_local_tip_overspending: "Your spending on '{category}' ({amount}) exceeds the budget rule. Consider reducing this by about 10-15%.",
        report_local_tip_high_wants: "Your discretionary spending ('Wants') makes up {wantsPercentage}% of your income. Reviewing these items could significantly boost your savings.",
        report_local_tip_low_savings: "Your savings rate is {savingsRate}%. To achieve your financial goals faster, consider allocating any surplus or cutting back on non-essential spending to increase this rate.",
        report_local_tip_surplus: "You have a surplus of {remaining}! Allocating this to your savings or investments could generate an estimated {annualReturn} more per year (assuming a 5% return).",
        report_local_no_data: "Insufficient data for a detailed analysis. Please input your income and expenses.",
    },
    ko: {
        app_title: '예산 관리 도구',
        section_calculation_mode_title: '계산 방식 선택',
        mode_simple: '기본 모드 (순수입)',
        mode_advanced: '고급 모드 (총수입)',
        section_net_income_title: '순수입',
        label_net_income: '월 순수입 (세후)',
        section_salary_title: '총수입',
        label_base_salary: '기본 급여',
        frequency_monthly: '월별',
        frequency_annual: '연간',
        btn_add_income: '추가 수입',
        label_annual_salary: '연간 총수입:',
        section_taxes_title: '세금',
        label_frequency: '주기',
        label_federal_withholding: '연방세',
        label_state_tax: '주세',
        label_oasdi: '사회보장세 (OASDI)',
        label_medicare: '메디케어',
        label_ca_sdi: '캘리포니아 주 장애보험 (CASDI)',
        btn_add_item: '항목 추가',
        section_pre_tax_title: '세전 공제',
        label_medical_premium: '의료 보험료',
        label_dental_premium: '치과 보험료',
        label_vision_premium: '안과 보험료',
        label_401k_traditional: '401k (Traditional)',
        section_post_tax_title: '세후 공제',
        label_spp: '자사주 매입 계획 (SPP)',
        label_adnd: '사고 사망 및 신체 상해 보험 (AD&D)',
        label_401k_roth: '401k (Roth)',
        label_ltd: '장기 장애 보험 (LTD)',
        section_expenses_title: '지출 관리',
        label_rent_mortgage: '월세/주택담보대출',
        label_utilities: '공과금',
        label_internet: '인터넷',
        label_phone: '통신비',
        label_groceries: '식료품',
        label_dining_out: '외식',
        label_transportation: '교통',
        label_shopping: '쇼핑',
        label_health_wellness: '건강/웰빙',
        label_entertainment: '오락/여가',
        section_summary_title: '예산 요약',
        label_summary_frequency: '요약 주기',
        label_gross_salary: '총수입:',
        label_total_taxes: '총 세금:',
        label_total_pre_tax: '총 세전 공제:',
        label_total_post_tax: '총 세후 공제:',
        label_net_salary: '순수입:',
        label_total_expenses: '총 지출:',
        label_remaining_budget: '남은 예산:',
        section_budget_rule_title: '예산 규칙 적용',
        label_budget_rule_select: '예산 규칙 선택:',
        rule_50_30_20_title: '50/30/20 규칙 (필수/선택/저축)',
        rule_70_20_10_title: '70/20/10 규칙 (지출/저축/부채)',
        rule_80_20_title: '80/20 규칙 (지출/저축)',
        section_ai_title: 'AI 지출 보고서',
        btn_ai_report: 'AI 보고서 생성',
        ai_report_placeholder: '"AI 보고서 생성"을 클릭하여 분석 결과를 확인하세요.',
        section_data_title: '데이터 관리',
        btn_export: '내보내기',
        btn_import: '가져오기',
        btn_clear_all_data: '전체 삭제',
        btn_print: '인쇄',
        btn_email: '이메일',
        btn_share: '공유',
        custom_item_name: '항목 이름',
        custom_income_name: '수입 이름',
        custom_item_amount: '금액',
        custom_item_category: '카테고리',
        remove: '삭제',
        confirm_clear_data: '정말 모든 데이터를 지우시겠습니까?',
        confirm_import_data: '기존 데이터를 덮어씁니다. 계속하시겠습니까?',
        invalid_json: '유효하지 않은 JSON 파일입니다.',
        alert_data_loaded: "데이터를 성공적으로 가져왔습니다!",
        tag_needs: '필수',
        tag_wants: '선택',
        tag_savings: '저축',
        tag_debt: '부채',
        tag_fixed: '고정',
        rule_category_needs: '필수 지출',
        rule_category_wants: '선택 지출',
        rule_category_savings: '저축',
        rule_category_savings_debt: '저축 & 부채',
        rule_category_spending: '지출 (필수+선택)',
        rule_category_debt: '부채 상환',
        rule_category_surplus: '잉여금',
        modal_title_needs: '필수 지출 항목',
        modal_title_wants: '선택 지출 항목',
        modal_title_savings: '저축 & 부채 항목',
        modal_title_spending: '지출 항목',
        modal_title_debt: '부채 상환 항목',
        report_local_generating: "로컬 분석 리포트를 생성 중입니다...",
        report_local_failed: "로컬 리포트 생성에 실패했습니다. 데이터를 확인해주세요.",
        report_local_title: "재무 건강 분석 리포트",
        report_local_summary_title: "1. 재무 현황 요약",
        report_local_summary_text: "{summaryFreq} 순수입 {netIncome}을 기준으로, 저축률은 <strong>{savingsRate}%</strong>이며, <strong>{remaining}</strong>의 추가 잉여금이 있습니다. 재정 운용의 강점은 <strong>{strength}</strong>이며, <strong>{weakness}</strong> 부분에서 개선의 여지가 있습니다.",
        report_local_strength: "계획적인 저축",
        report_local_weakness: "높은 선택 지출 비중",
        report_local_no_weakness: "균형 잡힌 관리",
        report_local_recommendation_title: "2. 추천 실행 계획",
        report_local_tip_overspending: "'{category}' 항목 지출({amount})이 예산 규칙을 초과했습니다. 이 부분을 10~15% 줄이는 것을 고려해보세요.",
        report_local_tip_high_wants: "선택적 지출('선택')이 소득의 {wantsPercentage}%를 차지합니다. 이 항목들을 검토하면 저축액을 크게 늘릴 수 있습니다.",
        report_local_tip_low_savings: "현재 저축률은 {savingsRate}%입니다. 재무 목표를 빠르게 달성하기 위해, 잉여금을 저축에 배분하거나 불필요한 지출을 줄여 저축률을 높여보세요.",
        report_local_tip_surplus: "<strong>{remaining}</strong>의 잉여금이 있습니다! 이 금액을 저축이나 투자에 활용하면, 연 5% 수익률 가정 시 연간 약 <strong>{annualReturn}</strong>의 추가 수익을 기대할 수 있습니다.",
        report_local_no_data: "상세 분석을 위한 데이터가 부족합니다. 수입 및 지출 내역을 입력해주세요.",
    }
};

// 3. 헬퍼 함수
function convertToAnnual(amount, frequency) {
    amount = parseFloat(amount) || 0;
    if (frequency === 'monthly') return amount * 12;
    return amount;
}

function convertFromAnnual(annualAmount, frequency) {
    annualAmount = parseFloat(annualAmount) || 0;
    if (frequency === 'monthly') return annualAmount / 12;
    return annualAmount;
}

function calculateTotalForSection(items, customItems, freqKey) {
    let total = 0;
    const freq = data.frequencies[freqKey];
    for (const key in items) {
        if (key !== 'custom') total += convertToAnnual(items[key], freq);
    }
    total += customItems.reduce((sum, item) => sum + convertToAnnual(item.amount, item.frequency), 0);
    return total;
}

function calculateBudget() {
    let annualNetIncome = 0;
    let annualGrossSalary = 0;
    let totalAnnualTaxes = 0;
    let totalAnnualPreTaxDeductions = 0;
    let totalAnnualPostTaxDeductions = 0;

    if (data.calculationMode === 'advanced') {
        annualGrossSalary = convertToAnnual(data.grossSalary, data.salaryFrequency) + data.customIncomes.reduce((sum, income) => sum + convertToAnnual(income.amount, income.frequency), 0);
        totalAnnualTaxes = calculateTotalForSection(data.taxes, data.taxes.custom, 'tax');
        totalAnnualPreTaxDeductions = calculateTotalForSection(data.preTaxDeductions, data.preTaxDeductions.custom, 'preTax');
        totalAnnualPostTaxDeductions = calculateTotalForSection(data.postTaxDeductions, data.postTaxDeductions.custom, 'postTax');
        annualNetIncome = annualGrossSalary - totalAnnualTaxes - totalAnnualPreTaxDeductions - totalAnnualPostTaxDeductions;
    } else {
        annualNetIncome = convertToAnnual(data.netIncome, 'monthly');
    }
    
    const { needs, wants, savings, debt } = categorizeAll(false);
    const totalAnnualExpenses = needs + wants + savings + debt;
    const remainingBudget = annualNetIncome - totalAnnualExpenses;
    
    return { annualGrossSalary, annualNetIncome, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget };
}

// 4. UI 업데이트 & 렌더링
function formatCurrency(amount) {
    amount = parseFloat(amount) || 0;
    const isKRW = data.currency === 'KRW';
    return new Intl.NumberFormat(isKRW ? 'ko-KR' : 'en-US', {
        style: 'currency',
        currency: data.currency,
        minimumFractionDigits: isKRW ? 0 : 2,
        maximumFractionDigits: isKRW ? 0 : 2,
    }).format(amount);
}

function updateDisplay() {
    data.calculationMode = modeToggleCheckbox.checked ? 'advanced' : 'simple';
    data.netIncome = parseFloat(netIncomeInput.value) || 0;
    data.grossSalary = parseFloat(grossSalaryInput.value) || 0;
    data.salaryFrequency = salaryFrequencySelect.value;
    data.summaryFrequency = summaryFrequencySelect.value;
    data.budgetRule = budgetRuleSelect.value;

    ['tax', 'preTax', 'postTax', 'expense'].forEach(key => {
        const select = document.getElementById(`${key}-frequency-select`);
        if (select) data.frequencies[key] = select.value;
    });

    for(const key in taxInputs) if(taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    for(const key in preTaxDeductInputs) if(preTaxDeductInputs[key]) data.preTaxDeductions[key] = parseFloat(preTaxDeductInputs[key].value) || 0;
    for(const key in postTaxDeductInputs) if(postTaxDeductInputs[key]) data.postTaxDeductions[key] = parseFloat(postTaxDeductInputs[key].value) || 0;
    for(const key in expenseInputs) if(expenseInputs[key]) data.expenses[key] = parseFloat(expenseInputs[key].value) || 0;
    
    advancedModeContainer.classList.toggle('hidden', data.calculationMode === 'simple');
    simpleModeContainer.classList.toggle('hidden', data.calculationMode === 'advanced');
    summaryAdvancedView.classList.toggle('hidden', data.calculationMode === 'simple');

    const { annualGrossSalary, annualNetIncome, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget } = calculateBudget();
    const summaryFreq = data.summaryFrequency;
    
    summaryGrossSalary.textContent = formatCurrency(convertFromAnnual(annualGrossSalary, summaryFreq));
    summaryTotalTaxes.textContent = formatCurrency(convertFromAnnual(totalAnnualTaxes, summaryFreq));
    summaryTotalPreTax.textContent = formatCurrency(convertFromAnnual(totalAnnualPreTaxDeductions, summaryFreq));
    summaryTotalPostTax.textContent = formatCurrency(convertFromAnnual(totalAnnualPostTaxDeductions, summaryFreq));
    summaryNetSalary.textContent = formatCurrency(convertFromAnnual(annualNetIncome, summaryFreq));
    summaryTotalExpenses.textContent = formatCurrency(convertFromAnnual(totalAnnualExpenses, summaryFreq));
    summaryRemainingBudget.textContent = formatCurrency(convertFromAnnual(remainingBudget, summaryFreq));
    summaryRemainingBudget.className = remainingBudget >= 0 ? 'positive' : 'negative';

    const annualSummaryP = annualSalarySummaryDisplay.parentElement;
    if (data.calculationMode === 'advanced') {
        annualSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary);
        annualSummaryP.classList.remove('hidden');
    } else {
        annualSummaryP.classList.add('hidden');
    }
    
    renderAllCustomLists();
    const breakdownData = applyBudgetRule();
    renderBudgetRule(breakdownData, remainingBudget, summaryFreq);
    updateCharts();
    renderCategoryTags();
    saveData();
}

function renderAllCustomLists() {
    renderCustomList(customIncomeList, data.customIncomes, 'income');
    renderCustomList(customTaxList, data.taxes.custom, 'tax');
    renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
    renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
    renderCustomList(customExpenseList, data.expenses.custom, 'expense');
}

function renderCustomList(listElement, customItems, type) {
    if (!listElement) return;
    const lang = data.currentLanguage;
    const t = translations[lang];
    const hasCategory = ['pre-tax', 'post-tax', 'expense'].includes(type);

    listElement.innerHTML = customItems.map((item, index) => {
        const categoryDropdown = hasCategory ? `
            <select class="custom-item-category form-control" data-index="${index}" data-type="${type}">
                <option value="wants" ${item.category === 'wants' ? 'selected' : ''}>${t.tag_wants}</option>
                <option value="needs" ${item.category === 'needs' ? 'selected' : ''}>${t.tag_needs}</option>
                <option value="savings" ${item.category === 'savings' ? 'selected' : ''}>${t.tag_savings}</option>
                 <option value="debt" ${item.category === 'debt' ? 'selected' : ''}>${t.tag_debt}</option>
            </select>
        ` : '';
        const placeholder = type === 'income' ? t.custom_income_name : t.custom_item_name;
        const frequencyOptions = `<option value="monthly"${item.frequency === 'monthly' ? ' selected' : ''}>${t.frequency_monthly}</option>
                                  <option value="annual"${item.frequency === 'annual' ? ' selected' : ''}>${t.frequency_annual}</option>`;

        return `
            <div class="custom-list-item ${type}-item">
                <input type="text" value="${item.name}" placeholder="${placeholder}" class="custom-item-name form-control" data-index="${index}" data-type="${type}">
                <input type="number" value="${item.amount}" placeholder="${t.custom_item_amount}" class="custom-item-amount form-control" data-index="${index}" data-type="${type}">
                <select class="custom-item-frequency form-control" data-index="${index}" data-type="${type}">
                    ${frequencyOptions}
                </select>
                ${categoryDropdown}
                <button class="remove-btn btn btn-danger" data-index="${index}" data-type="${type}">${t.remove}</button>
            </div>`;
    }).join('');

    listElement.querySelectorAll('.custom-item-name, .custom-item-amount, .custom-item-frequency, .custom-item-category').forEach(el => el.addEventListener('change', handleCustomItemChange));
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
    const listMap = { 'income': data.customIncomes, 'tax': data.taxes.custom, 'pre-tax': data.preTaxDeductions.custom, 'post-tax': data.postTaxDeductions.custom, 'expense': data.expenses.custom };
    const list = listMap[type];
    if (list) {
        list.push({ name: '', amount: 0, frequency: 'monthly', category: 'wants' });
        updateDisplay();
    }
}

function handleCustomItemChange(event) {
    const { index, type } = event.target.dataset;
    const listMap = { 'income': data.customIncomes, 'tax': data.taxes.custom, 'pre-tax': data.preTaxDeductions.custom, 'post-tax': data.postTaxDeductions.custom, 'expense': data.expenses.custom };
    const list = listMap[type];
    const item = list[parseInt(index)];

    if(item) {
        if (event.target.classList.contains('custom-item-name')) item.name = event.target.value;
        else if (event.target.classList.contains('custom-item-amount')) item.amount = parseFloat(event.target.value) || 0;
        else if (event.target.classList.contains('custom-item-frequency')) item.frequency = event.target.value;
        else if (event.target.classList.contains('custom-item-category')) item.category = event.target.value;
        updateDisplay();
    }
}

function removeCustomItem(event) {
    const { index, type } = event.target.dataset;
    const listMap = { 'income': data.customIncomes, 'tax': data.taxes.custom, 'pre-tax': data.preTaxDeductions.custom, 'post-tax': data.postTaxDeductions.custom, 'expense': data.expenses.custom };
    const list = listMap[type];
    list.splice(parseInt(index), 1);
    updateDisplay();
}

// 6. 언어 & 테마
function applyLanguage() {
    const lang = data.currentLanguage;
    document.documentElement.lang = lang;
    languageToggleBtn.textContent = lang === 'ko' ? 'EN' : 'KO';
    currencyToggleBtn.textContent = data.currency === 'KRW' ? '$' : '₩';
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    updateDisplay();
}

function applyDarkMode() {
    document.body.classList.toggle('dark-mode', data.isDarkMode);
    darkmodeToggleBtn.querySelector('i').className = data.isDarkMode ? 'ri-sun-line' : 'ri-moon-line';
}

// 7. 데이터 관리
function saveData() { localStorage.setItem('budgetAppData', JSON.stringify(data)); }

function populateUiFromData(savedData) {
    Object.assign(data, savedData);
    modeToggleCheckbox.checked = data.calculationMode === 'advanced';
    netIncomeInput.value = data.netIncome || 0;
    grossSalaryInput.value = data.grossSalary || 0;
    salaryFrequencySelect.value = data.salaryFrequency || 'monthly';
    summaryFrequencySelect.value = data.summaryFrequency || 'monthly';
    budgetRuleSelect.value = data.budgetRule || '50-30-20';
    data.isDarkMode = document.body.classList.contains('dark-mode');

    for(const key in taxInputs) if(data.taxes[key] !== undefined) taxInputs[key].value = data.taxes[key];
    for(const key in preTaxDeductInputs) if(data.preTaxDeductions[key] !== undefined) preTaxDeductInputs[key].value = data.preTaxDeductions[key];
    for(const key in postTaxDeductInputs) if(data.postTaxDeductions[key] !== undefined) postTaxDeductInputs[key].value = data.postTaxDeductions[key];
    for(const key in expenseInputs) if(data.expenses[key] !== undefined) expenseInputs[key].value = data.expenses[key];
    
    applyDarkMode();
    applyLanguage();
}

function loadData() {
    const savedData = localStorage.getItem('budgetAppData');
    if (savedData) {
        populateUiFromData(JSON.parse(savedData));
    } else {
        updateDisplay();
    }
}

// 8. 차트
function createOrUpdateChart(instance, canvasId, label, dataValues, labels) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    const ctx = document.getElementById(canvasId);
    if (!ctx) return instance;
    const chartData = { labels, datasets: [{ label, data: dataValues, backgroundColor: colors }] };
    if (instance) {
        instance.data = chartData;
        instance.options.plugins.title.text = label;
        instance.update();
        return instance;
    }
    return new Chart(ctx, { type: 'pie', data: chartData, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: label } } } });
}

function updateCharts() {
    const lang = data.currentLanguage;
    const t = translations[lang];
    const { annualNetIncome, remainingBudget } = calculateBudget();
    const expenseTotals = categorizeAll();
    
    expensesChartInstance = createOrUpdateChart(expensesChartInstance, 'expenses-chart', t.section_expenses_title, 
        [expenseTotals.needs, expenseTotals.wants, expenseTotals.savings, expenseTotals.debt], 
        [t.tag_needs, t.tag_wants, t.tag_savings, t.tag_debt].filter((_, i) => [expenseTotals.needs, expenseTotals.wants, expenseTotals.savings, expenseTotals.debt][i] > 0)
    );

    const overallExpenses = expenseTotals.needs + expenseTotals.wants + expenseTotals.savings + expenseTotals.debt;
    budgetDistributionChartInstance = createOrUpdateChart(budgetDistributionChartInstance, 'budget-distribution-chart', t.section_summary_title, 
        [overallExpenses, remainingBudget > 0 ? remainingBudget : 0], 
        [t.label_total_expenses, t.label_remaining_budget].filter((_, i) => [overallExpenses, remainingBudget][i] > 0)
    );

    if (data.calculationMode === 'advanced') {
        const totalTaxes = calculateTotalForSection(data.taxes, data.taxes.custom, 'tax');
        const totalPreTax = calculateTotalForSection(data.preTaxDeductions, data.preTaxDeductions.custom, 'preTax');
        const totalPostTax = calculateTotalForSection(data.postTaxDeductions, data.postTaxDeductions.custom, 'postTax');

        taxChartInstance = createOrUpdateChart(taxChartInstance, 'tax-chart', t.section_taxes_title, [totalTaxes], [t.section_taxes_title]);
        preTaxDeductChartInstance = createOrUpdateChart(preTaxDeductChartInstance, 'pre-tax-deduct-chart', t.section_pre_tax_title, [totalPreTax], [t.section_pre_tax_title]);
        postTaxDeductChartInstance = createOrUpdateChart(postTaxDeductChartInstance, 'post-tax-deduct-chart', t.section_post_tax_title, [totalPostTax], [t.section_post_tax_title]);
    }
}

// 9. 예산 규칙
function categorizeAll(getItems = false) {
    let totals = { needs: 0, wants: 0, savings: 0, debt: 0 };
    let items = { needs: [], wants: [], savings: [], debt: [] };

    const process = (item, defaultCategory, type) => {
        const category = item.category || defaultCategory;
        if(totals.hasOwnProperty(category)) {
            const amount = convertToAnnual(item.amount, item.frequency || data.frequencies[type]);
            totals[category] += amount;
            if(getItems && amount > 0) {
                 items[category].push({name: item.name, amount: amount});
            }
        }
    };
    
    ['expenses', 'preTaxDeductions', 'postTaxDeductions'].forEach(section => {
        for(const key in data[section]) {
            if(key === 'custom') continue;
            const category = ITEM_CATEGORIES[`${section.slice(0, 3)}-${key}-1`];
            if(category) {
                 process({name: key, amount: data[section][key]}, category, section.slice(0, -10));
            }
        }
        data[section].custom.forEach(item => process(item, 'wants', section.slice(0, -10)));
    });

    return getItems ? items : totals;
}

function applyBudgetRule() {
    const { annualNetIncome } = calculateBudget();
    const totals = categorizeAll();
    const lang = data.currentLanguage;
    const t = translations[lang];

    if (annualNetIncome <= 0) return [];
    
    switch (data.budgetRule) {
        case '70-20-10':
            return [
                { id: 'spending', label: t.rule_category_spending, goal: annualNetIncome * 0.7, actual: totals.needs + totals.wants },
                { id: 'savings', label: t.rule_category_savings, goal: annualNetIncome * 0.2, actual: totals.savings },
                { id: 'debt', label: t.rule_category_debt, goal: annualNetIncome * 0.1, actual: totals.debt }
            ];
        case '80-20':
             return [
                { id: 'spending', label: t.rule_category_spending, goal: annualNetIncome * 0.8, actual: totals.needs + totals.wants + totals.debt },
                { id: 'savings', label: t.rule_category_savings, goal: annualNetIncome * 0.2, actual: totals.savings }
            ];
        default: // 50-30-20
            return [
                { id: 'needs', label: t.rule_category_needs, goal: annualNetIncome * 0.5, actual: totals.needs },
                { id: 'wants', label: t.rule_category_wants, goal: annualNetIncome * 0.3, actual: totals.wants },
                { id: 'savings', label: t.rule_category_savings_debt, goal: annualNetIncome * 0.2, actual: totals.savings + totals.debt }
            ];
    }
}

function renderBudgetRule(breakdown, remaining, frequency) {
    if (!budgetRuleBreakdown) return;
    const lang = data.currentLanguage;
    const t = translations[lang];
    let html = breakdown.map(item => {
        const periodicActual = convertFromAnnual(item.actual, frequency);
        const periodicGoal = convertFromAnnual(item.goal, frequency);
        const percentage = periodicGoal > 0 ? (periodicActual / periodicGoal) * 100 : 0;
        const isOverBudget = periodicActual > periodicGoal;
        return `
            <div class="rule-progress-bar-container">
                <div class="rule-progress-bar-labels">
                    <span class="rule-category-label" data-categoryid="${item.id}">${item.label}</span>
                    <span class="rule-amount-label">${formatCurrency(periodicActual)} / ${formatCurrency(periodicGoal)}</span>
                </div>
                <div class="rule-progress-bar">
                    <div class="rule-progress-bar-inner ${isOverBudget ? 'over-budget' : ''}" style="width: ${Math.min(percentage, 100)}%;">${Math.round(percentage)}%</div>
                </div>
            </div>`;
    }).join('');
    if (remaining > 0) {
        html += `<div class="surplus-container"><span class="surplus-label">${t.rule_category_surplus}: ${formatCurrency(convertFromAnnual(remaining, frequency))}</span></div>`;
    }
    budgetRuleBreakdown.innerHTML = html;
    budgetRuleBreakdown.querySelectorAll('.rule-category-label').forEach(label => {
        label.addEventListener('click', () => showCategoryDetails(label.dataset.categoryid));
    });
}

// 10. AI 리포트
function generateLocalAiReport() {
    const lang = data.currentLanguage;
    const t = translations[lang];

    try {
        const { annualNetIncome, remainingBudget } = calculateBudget();
        const totals = categorizeAll();
        const breakdown = applyBudgetRule();
        const summaryFreq = data.summaryFrequency;

        if (annualNetIncome <= 0) {
            aiReportBox.innerHTML = `<p>${t.report_local_no_data}</p>`;
            return;
        }

        let insights = { summary: "", recommendations: [] };
        const savingsRate = Math.round(((totals.savings + totals.debt) / annualNetIncome) * 100) || 0;
        const wantsPercentage = Math.round((totals.wants / annualNetIncome) * 100) || 0;
        const strength = savingsRate > 10 ? t.report_local_strength : t.report_local_no_weakness;
        const weakness = wantsPercentage > 30 ? t.report_local_weakness : t.report_local_no_weakness;
        
        insights.summary = t.report_local_summary_text
            .replace('{summaryFreq}', translations[lang][`frequency_${summaryFreq}`])
            .replace('{netIncome}', formatCurrency(convertFromAnnual(annualNetIncome, summaryFreq)))
            .replace('{savingsRate}', savingsRate)
            .replace('{remaining}', formatCurrency(convertFromAnnual(remainingBudget, summaryFreq)))
            .replace('{strength}', strength)
            .replace('{weakness}', weakness);

        const overspending = breakdown.find(item => item.actual > item.goal);
        if (overspending) {
            insights.recommendations.push(t.report_local_tip_overspending.replace('{category}', overspending.label).replace('{amount}', formatCurrency(convertFromAnnual(overspending.actual, summaryFreq))));
        }
        if (wantsPercentage > 35) {
            insights.recommendations.push(t.report_local_tip_high_wants.replace('{wantsPercentage}', wantsPercentage));
        }
        if (savingsRate < 10) {
            insights.recommendations.push(t.report_local_tip_low_savings.replace('{savingsRate}', savingsRate));
        }
        if (remainingBudget > 0) {
            const periodicSurplus = convertFromAnnual(remainingBudget, summaryFreq);
            insights.recommendations.push(t.report_local_tip_surplus.replace('{remaining}', formatCurrency(periodicSurplus)).replace('{annualReturn}', formatCurrency(convertToAnnual(periodicSurplus, summaryFreq) * 0.05)));
        }

        let reportHtml = `<h3>${t.report_local_title}</h3><h4>${t.report_local_summary_title}</h4><p>${insights.summary}</p>`;
        if (insights.recommendations.length > 0) {
            reportHtml += `<h4>${t.report_local_recommendation_title}</h4><ul>${insights.recommendations.map(tip => `<li>${tip}</li>`).join('')}</ul>`;
        }
        aiReportBox.innerHTML = reportHtml;

    } catch (error) {
        console.error("Local report generation error:", error);
        aiReportBox.innerHTML = `<p>${t.report_local_failed}</p>`;
    }
}

async function generateAiReport() {
    const lang = data.currentLanguage;
    aiReportBox.innerHTML = `<p>${translations[lang].report_local_generating}</p>`;
    try {
        if (false) { // This is the placeholder for real AI call
            // const response = await fetch(...);
        } else {
            throw new Error("Simulating network failure to trigger local fallback.");
        }
    } catch (error) {
        console.warn("AI endpoint simulation: falling back to local report.", error.message);
        generateLocalAiReport();
    }
}

function showCategoryDetails(categoryId) {
    const lang = data.currentLanguage;
    const t = translations[lang];
    const allItems = categorizeAll(true);
    let itemsToShow = allItems[categoryId] || [];
    let title = t[`modal_title_${categoryId}`] || "Details";

    if(categoryId === 'savings') itemsToShow = [...allItems.savings, ...allItems.debt];
    if(categoryId === 'spending') itemsToShow = [...allItems.needs, ...allItems.wants];

    modalTitle.textContent = title;
    modalList.innerHTML = itemsToShow.length > 0
        ? itemsToShow.map(item => `<li><span class="modal-item-name">${capitalizeFirstLetter(item.name)}</span><span class="modal-item-amount">${formatCurrency(convertFromAnnual(item.amount, data.summaryFrequency))}</span></li>`).join('')
        : `<li>No items in this category.</li>`;
    modalContainer.classList.remove('hidden');
}

// 11. 초기화
document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    modeToggleCheckbox = document.getElementById('mode-toggle-checkbox');
    advancedModeContainer = document.getElementById('advanced-mode-container');
    simpleModeContainer = document.getElementById('simple-mode-container');
    netIncomeInput = document.getElementById('net-income-input');
    grossSalaryInput = document.getElementById('salary-gross');
    salaryFrequencySelect = document.getElementById('salary-frequency-select');
    annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');
    summaryGrossSalary = document.getElementById('summary-gross-salary');
    summaryTotalTaxes = document.getElementById('summary-total-taxes');
    summaryTotalPreTax = document.getElementById('summary-total-pre-tax');
    summaryTotalPostTax = document.getElementById('summary-total-post-tax');
    summaryNetSalary = document.getElementById('summary-net-salary');
    summaryTotalExpenses = document.getElementById('summary-total-expenses');
    summaryRemainingBudget = document.getElementById('summary-remaining-budget');
    summaryAdvancedView = document.getElementById('summary-advanced-view');
    summaryFrequencySelect = document.getElementById('summary-frequency-select');
    taxFrequencySelect = document.getElementById('tax-frequency-select');
    preTaxFrequencySelect = document.getElementById('pre-tax-frequency-select');
    postTaxFrequencySelect = document.getElementById('post-tax-frequency-select');
    expenseFrequencySelect = document.getElementById('expense-frequency-select');
    
    Object.assign(taxInputs, { federal: document.getElementById('tax-federal-1'), state: document.getElementById('tax-state-1'), oasdi: document.getElementById('tax-oasdi-1'), medicare: document.getElementById('tax-medicare-1'), casdi: document.getElementById('tax-casdi-1') });
    Object.assign(preTaxDeductInputs, { medical: document.getElementById('deduct-medical-1'), dental: document.getElementById('deduct-dental-1'), vision: document.getElementById('deduct-vision-1'), '401k-trad': document.getElementById('deduct-401k-trad-1') });
    Object.assign(postTaxDeductInputs, { spp: document.getElementById('deduct-spp-1'), adnd: document.getElementById('deduct-adnd-1'), '401k-roth': document.getElementById('deduct-401k-roth-1'), ltd: document.getElementById('deduct-ltd-1') });
    Object.assign(expenseInputs, { rent: document.getElementById('exp-rent-1'), utilities: document.getElementById('exp-utilities-1'), internet: document.getElementById('exp-internet-1'), phone: document.getElementById('exp-phone-1'), groceries: document.getElementById('exp-groceries-1'), dining: document.getElementById('exp-dining-1'), transport: document.getElementById('exp-transport-1'), shopping: document.getElementById('exp-shopping-1'), health: document.getElementById('exp-health-1'), entertainment: document.getElementById('exp-entertainment-1') });

    customIncomeList = document.getElementById('custom-income-list');
    customTaxList = document.getElementById('tax-custom-list');
    customPreTaxDeductList = document.getElementById('pre-tax-custom-list');
    customPostTaxDeductList = document.getElementById('post-tax-custom-list');
    customExpenseList = document.getElementById('expenses-custom-list');

    languageToggleBtn = document.getElementById('language-toggle');
    darkmodeToggleBtn = document.getElementById('darkmode-toggle');
    currencyToggleBtn = document.getElementById('currency-toggle');
    
    exportJsonBtn = document.getElementById('export-json-btn');
    importJsonBtn = document.getElementById('import-json-btn');
    importJsonInput = document.getElementById('import-json-input');
    clearAllDataBtn = document.getElementById('clear-all-data-btn');
    printBtn = document.getElementById('print-btn');
    emailBtn = document.getElementById('email-btn');
    shareBtn = document.getElementById('share-btn');
    
    aiReportBtn = document.getElementById('ai-report-btn');
    aiReportBox = document.getElementById('ai-report-box');
    
    budgetRuleSelect = document.getElementById('budget-rule-select');
    budgetRuleBreakdown = document.getElementById('budget-rule-breakdown');
    
    modalContainer = document.getElementById('modal-container');
    modalTitle = document.getElementById('modal-title');
    modalList = document.getElementById('modal-list');
    modalCloseBtn = document.querySelector('.modal-close-btn');

    // Event Listeners
    modeToggleCheckbox.addEventListener('change', updateDisplay);
    document.querySelectorAll('input[type="number"], select').forEach(el => el.addEventListener('change', updateDisplay));
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
    currencyToggleBtn.addEventListener('click', () => {
        data.currency = data.currency === 'KRW' ? 'USD' : 'KRW';
        applyLanguage();
    });
    
    clearAllDataBtn.addEventListener('click', () => {
        if (confirm(translations[data.currentLanguage].confirm_clear_data)) {
            localStorage.removeItem('budgetAppData');
            window.location.reload();
        }
    });
    
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
                    if (confirm(translations[data.currentLanguage].confirm_import_data)) {
                        populateUiFromData(JSON.parse(e.target.result));
                        alert(translations[data.currentLanguage].alert_data_loaded);
                    }
                } catch (error) {
                    alert(translations[data.currentLanguage].invalid_json);
                }
            };
            reader.readAsText(file);
            event.target.value = '';
        }
    });

    printBtn.addEventListener('click', () => window.print());
    emailBtn.addEventListener('click', () => {
        const { annualNetIncome, totalAnnualExpenses, remainingBudget } = calculateBudget();
        const summaryFreq = data.summaryFrequency;
        const subject = "My Budget Summary";
        const body = `Net Income: ${formatCurrency(convertFromAnnual(annualNetIncome, summaryFreq))}\nExpenses: ${formatCurrency(convertFromAnnual(totalAnnualExpenses, summaryFreq))}\nRemaining: ${formatCurrency(convertFromAnnual(remainingBudget, summaryFreq))}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    shareBtn.addEventListener('click', async () => {
        if (navigator.share) {
            const { annualNetIncome, totalAnnualExpenses, remainingBudget } = calculateBudget();
            const summaryFreq = data.summaryFrequency;
            await navigator.share({
                title: 'My Budget Summary',
                text: `Net Income: ${formatCurrency(convertFromAnnual(annualNetIncome, summaryFreq))}\nExpenses: ${formatCurrency(convertFromAnnual(totalAnnualExpenses, summaryFreq))}\nRemaining: ${formatCurrency(convertFromAnnual(remainingBudget, summaryFreq))}`,
            });
        }
    });
    aiReportBtn.addEventListener('click', generateAiReport);
    modalCloseBtn.addEventListener('click', () => modalContainer.classList.add('hidden'));
    modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) modalContainer.classList.add('hidden'); });

    loadData();
});
