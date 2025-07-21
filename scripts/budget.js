// =================================================================================
// 1. 전역 변수 및 초기 데이터 (Global Variables & Initial Data)
// =================================================================================

let grossSalaryInput, salaryFrequencySelect, netIncomeInput, modeToggleCheckbox;
let taxFrequencySelect, preTaxFrequencySelect, postTaxFrequencySelect, expenseFrequencySelect;
let summaryFrequencySelect;
let annualSalarySummaryDisplay, summaryGrossSalary, summaryTotalTaxes, summaryTotalPreTax, summaryTotalPostTax, summaryNetSalary, summaryTotalExpenses, summaryRemainingBudget, summaryAdvancedView;
const taxInputs = {}, preTaxDeductInputs = {}, postTaxDeductInputs = {}, expenseInputs = {};
let customIncomeList, customTaxList, customPreTaxDeductList, customPostTaxDeductList;
let languageToggleBtn, darkmodeToggleBtn, currencyToggleBtn;
let exportJsonBtn, importJsonBtn, importJsonInput, clearAllDataBtn, printBtn, emailBtn, shareBtn;
let aiReportBtn, aiReportBox, apiKeyInput;
let budgetRuleSelect, budgetRuleBreakdown;
let taxChartInstance, preTaxDeductChartInstance, postTaxDeductChartInstance, expensesChartInstance, budgetDistributionChartInstance, historyChartInstance;
let modalContainer, modalTitle, modalList, modalCloseBtn;
let advancedModeContainer, simpleModeContainer;
let goalNameInput, goalTargetInput, addGoalBtn, goalListContainer;
let debtNameInput, debtBalanceInput, debtRateInput, debtPaymentInput, addDebtBtn, debtListContainer, debtExtraPaymentInput, debtResultContainer;
let recordHistoryBtn;
let categoryNameInput, categoryTypeSelect, addCategoryBtn, categoryListContainer;
let expenseNameInput, expenseAmountInput, expenseCategorySelect, addExpenseBtn, expenseListContainer;


const data = {
    calculationMode: 'simple',
    netIncome: 0,
    grossSalary: 0,
    salaryFrequency: 'monthly',
    customIncomes: [],
    summaryFrequency: 'monthly',
    currency: 'USD',
    frequencies: { tax: 'monthly', preTax: 'monthly', postTax: 'monthly', expense: 'monthly' },
    taxes: { federal: 0, state: 0, oasdi: 0, medicare: 0, casdi: 0, custom: [] },
    preTaxDeductions: { medical: 0, dental: 0, vision: 0, '401k-trad': 0, custom: [] },
    postTaxDeductions: { spp: 0, adnd: 0, '401k-roth': 0, ltd: 0, 'critical-illness': 0, 'accident-insurance': 0, 'legal-services': 0, custom: [] },
    expenses: {
        rent: 0, utilities: 0, internet: 0, phone: 0, groceries: 0, dining: 0, transport: 0, shopping: 0, health: 0,
        entertainment: 0, insurance: 0, donation: 0, travel: 0, pets: 0, children: 0,
        custom: []
    },
    categories: [
        { id: 1, name: 'Rent/Mortgage', type: 'needs' }, { id: 2, name: 'Utilities', type: 'needs' }, { id: 3, name: 'Groceries', type: 'needs' },
        { id: 4, name: 'Transportation', type: 'needs' }, { id: 5, name: 'Health/Wellness', type: 'needs' }, { id: 6, name: 'Insurance', type: 'needs' },
        { id: 7, name: 'Phone Bill', type: 'needs' }, { id: 8, name: 'Internet', type: 'needs' }, { id: 9, name: 'Children', type: 'needs' },
        { id: 10, name: 'Dining Out', type: 'wants' }, { id: 11, name: 'Shopping', type: 'wants' }, { id: 12, name: 'Entertainment', type: 'wants' },
        { id: 13, name: 'Travel', type: 'wants' }, { id: 14, name: 'Pets', type: 'wants' }, { id: 15, name: 'Donation', type: 'wants' }
    ],
    goals: [],
    debts: [],
    history: [],
    budgetRule: '50-30-20',
    currentLanguage: 'ko',
    isDarkMode: false
};

const ITEM_CATEGORIES = {
    'tax-federal-1': 'fixed', 'tax-state-1': 'fixed', 'tax-oasdi-1': 'fixed', 'tax-medicare-1': 'fixed', 'tax-casdi-1': 'fixed',
    'deduct-medical-1': 'needs', 'deduct-dental-1': 'needs', 'deduct-vision-1': 'needs', 'deduct-ltd-1': 'needs', 'deduct-adnd-1': 'needs',
    'deduct-critical-illness-1': 'needs', 'deduct-accident-insurance-1': 'needs', 'deduct-legal-services-1': 'wants',
    'deduct-401k-trad-1': 'savings', 'deduct-401k-roth-1': 'savings', 'deduct-spp-1': 'savings'
};

const translations = {
    en: {
        app_title: 'Budget Tool',
        section_calculation_mode_title: 'Calculation Mode',
        mode_simple: 'Simple',
        mode_advanced: 'Advanced',
        tooltip_calculation_mode: "Choose your calculation method. 'Simple Mode' uses your after-tax net income. 'Advanced Mode' allows for a detailed breakdown starting from your gross income and deductions.",
        section_net_income_title: 'Net Income',
        label_net_income: 'Monthly Net Income (After-Tax)',
        tooltip_net_income: "Enter the actual amount of money you receive in your bank account monthly, after all taxes and deductions.",
        section_salary_title: 'Gross Income',
        tooltip_salary: "Enter your total salary before any taxes or deductions are taken out. Use 'Add Custom Income' for irregular earnings.",
        label_base_salary: 'Base Salary',
        frequency_monthly: 'Monthly',
        frequency_annually: 'Annual',
        frequency_weekly: 'Weekly',
        frequency_bi_weekly: 'Bi-Weekly',
        btn_add_income: 'Add Custom Income',
        label_annual_salary: 'Annual Gross Income:',
        section_taxes_title: 'Taxes',
        tooltip_taxes: "Enter all tax amounts that are withheld from your paycheck.",
        label_frequency: 'Frequency',
        label_federal_withholding: 'Federal Withholding',
        label_state_tax: 'State Tax',
        label_oasdi: 'OASDI',
        label_medicare: 'Medicare',
        label_ca_sdi: 'CA SDI',
        btn_add_item: 'Add Custom Item',
        section_pre_tax_title: 'Pre-Tax Deductions',
        tooltip_pre_tax: "Items deducted from your gross income before taxes are calculated, such as 401(k) contributions or certain insurance premiums.",
        label_medical_premium: 'Medical Premium',
        label_dental_premium: 'Dental Premium',
        label_vision_premium: 'Vision Premium',
        label_401k_traditional: '401k Traditional',
        section_post_tax_title: 'Post-Tax Deductions',
        tooltip_post_tax: "Items deducted from your paycheck after taxes have been paid.",
        label_spp: 'SPP',
        label_adnd: 'AD&D',
        label_401k_roth: '401k Roth',
        label_ltd: 'LTD',
        label_critical_illness: 'Critical Illness',
        label_accident_insurance: 'Accident Insurance',
        label_legal_services: 'Legal Services',
        section_expenses_title: 'Expense Management',
        tooltip_expenses: "Enter all your regular expenses based on your Net Income.",
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
        label_insurance: 'Insurance',
        label_donation: 'Donation',
        label_travel: 'Travel',
        label_pets: 'Pets',
        label_children: 'Children',
        section_summary_title: 'Budget Summary',
        tooltip_summary: "This is a complete overview of your finances based on your inputs.",
        label_summary_frequency: 'Summary Frequency',
        label_gross_salary: 'Gross Salary:',
        label_total_taxes: 'Total Taxes:',
        label_total_pre_tax: 'Total Pre-Tax Deductions:',
        label_total_post_tax: 'Total Post-Tax Deductions:',
        label_net_salary: 'Net Salary (Take-Home):',
        label_total_expenses: 'Total Expenses:',
        label_remaining_budget: 'Remaining Budget:',
        section_budget_rule_title: 'Budget Rule Application',
        tooltip_budget_rule: "Select a popular budgeting rule to visually compare your spending against a target.",
        rule_50_30_20_title: '50/30/20 Rule (Needs/Wants/Savings)',
        rule_70_20_10_title: '70/20/10 Rule (Spending/Savings/Debt)',
        rule_80_20_title: '80/20 Rule (Spending/Savings)',
        section_ai_title: 'AI Expense Report',
        tooltip_ai_report: "Generates an analysis of your financial health based on the data you've entered and provides actionable advice.",
        ai_report_placeholder: 'Click "Generate AI Report" for insights.',
        section_data_title: 'Data Management',
        tooltip_data_management: "Save your current data to a file (Export) or load data from a previously saved file (Import).",
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
        modal_title_savings: 'Savings Items',
        modal_title_savings_debt: 'Savings & Debt Items',
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
        section_debt_title: "Debt Management",
        tooltip_debt: "Manage your debts. We'll help you calculate a 'Debt Avalanche' plan, prioritizing high-interest debts.",
        label_debt_name: "Debt Name",
        label_debt_balance: "Current Balance",
        label_debt_rate: "Interest Rate (%)",
        label_debt_min_payment: "Min. Monthly Payment",
        btn_add_debt: "Add Debt",
        label_debt_extra_payment: "Extra Monthly Payment",
        section_goals_title: "Financial Goal Setting",
        tooltip_goals: "Add and manage your financial goals. Update your progress by adding to your saved amount.",
        label_goal_name: "Goal Name",
        label_goal_target: "Target Amount",
        btn_add_goal: "Add Goal",
        section_trends_title: "Financial Trend Analysis",
        tooltip_trends: "Record your data at the end of each month to track your financial changes over time.",
        btn_record_history: "Record This Month's Data",
        placeholder_goal: 'e.g., Trip to Europe',
        placeholder_debt: 'e.g., Credit Card A',
        section_category_title: "Category Management",
        tooltip_category: "Add, view, and delete your expense categories here.",
        label_category_name: "Category Name",
        label_category_type: "Category Type",
        btn_add_category: "Add Category",
        label_expense_name: "Other Expense",
        label_expense_amount: "Amount",
        btn_add_expense: "Add Other Expense",
        label_api_key: 'Gemini API Key',
        placeholder_api_key: 'Paste your API key here',
    },
    ko: {
        app_title: '스마트 예산 노트',
        section_calculation_mode_title: '계산 방식',
        mode_simple: '기본',
        mode_advanced: '고급',
        tooltip_calculation_mode: "계산 방식을 선택합니다. '기본 모드'는 세후 순수입을 기준으로, '고급 모드'는 세전 총수입과 각종 공제 항목을 직접 입력하여 더 상세하게 계산합니다.",
        section_net_income_title: '순수입',
        label_net_income: '월 순수입 (세후)',
        tooltip_net_income: "세금과 공제 항목이 모두 빠져나간 후, 실제로 통장에 입금되는 월 순수입을 입력합니다.",
        section_salary_title: '총수입',
        tooltip_salary: "세금을 제하기 전의 총 수입을 입력합니다. '추가 수입' 버튼으로 비정기적인 수입을 더할 수 있습니다.",
        label_base_salary: '기본 급여',
        frequency_monthly: '월별',
        frequency_annually: '연간',
        frequency_weekly: '주별',
        frequency_bi_weekly: '2주별',
        btn_add_income: '추가 수입',
        label_annual_salary: '연간 총수입:',
        section_taxes_title: '세금',
        tooltip_taxes: "급여에서 원천징수되는 세금 항목들을 입력합니다.",
        label_frequency: '주기',
        label_federal_withholding: '연방세',
        label_state_tax: '주세',
        label_oasdi: '사회보장세 (OASDI)',
        label_medicare: '메디케어',
        label_ca_sdi: 'CA 장애보험 (CASDI)',
        btn_add_item: '항목 추가',
        section_pre_tax_title: '세전 공제',
        tooltip_pre_tax: "세금을 부과하기 전에 총수입에서 공제되는 항목들입니다. 주로 401k와 같은 연금 저축이나 특정 보험료가 해당됩니다.",
        label_medical_premium: '의료 보험료',
        label_dental_premium: '치과 보험료',
        label_vision_premium: '안과 보험료',
        label_401k_traditional: '401k (Traditional)',
        section_post_tax_title: '세후 공제',
        tooltip_post_tax: "세금을 납부한 후, 순수입에서 공제되는 항목들입니다.",
        label_spp: '자사주 매입 계획 (SPP)',
        label_adnd: '사고사망 및 상해보험 (AD&D)',
        label_401k_roth: '401k (Roth)',
        label_ltd: '장기 장애 보험 (LTD)',
        label_critical_illness: '중대질병 보험',
        label_accident_insurance: '상해 보험',
        label_legal_services: '법률 서비스',
        section_expenses_title: '지출 관리',
        tooltip_expenses: "순수입(실수령액)에서 나가는 모든 지출을 입력합니다.",
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
        label_insurance: '보험',
        label_donation: '기부',
        label_travel: '여행',
        label_pets: '반려동물',
        label_children: '자녀 양육비',
        section_summary_title: '예산 요약',
        tooltip_summary: "모든 수입과 지출을 종합한 최종 요약입니다.",
        label_summary_frequency: '요약 주기',
        label_gross_salary: '총수입:',
        label_total_taxes: '총 세금:',
        label_total_pre_tax: '총 세전 공제:',
        label_total_post_tax: '총 세후 공제:',
        label_net_salary: '순수입 (실수령액):',
        label_total_expenses: '총 지출:',
        label_remaining_budget: '남은 예산:',
        section_budget_rule_title: '예산 규칙 적용',
        tooltip_budget_rule: "널리 알려진 예산 규칙을 선택하여 현재 지출이 순수입(실수령액) 기준 목표에 얼마나 부합하는지 시각적으로 확인합니다.",
        rule_50_30_20_title: '50/30/20 규칙 (필수/선택/저축)',
        rule_70_20_10_title: '70/20/10 규칙 (지출/저축/부채)',
        rule_80_20_title: '80/20 규칙 (지출/저축)',
        section_ai_title: 'AI 지출 보고서',
        tooltip_ai_report: "입력된 데이터를 바탕으로 현재 재무 상태를 분석하고 개선을 위한 조언을 제공합니다.",
        ai_report_placeholder: '"AI 보고서 생성"을 클릭하여 분석 결과를 확인하세요.',
        section_data_title: '데이터 관리',
        tooltip_data_management: "현재까지 입력한 모든 데이터를 파일로 저장(Export)하거나, 저장했던 파일을 불러올(Import) 수 있습니다.",
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
        modal_title_savings: '저축 항목',
        modal_title_savings_debt: '저축 & 부채 항목',
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
        section_debt_title: "부채 관리",
        tooltip_debt: "상환할 부채 목록을 관리합니다. 이자율이 높은 순서대로 상환하는 '눈사태(Avalanche)' 전략을 계산해 드립니다.",
        label_debt_name: "부채 이름",
        label_debt_balance: "현재 잔액",
        label_debt_rate: "이자율 (%)",
        label_debt_min_payment: "월 최소상환액",
        btn_add_debt: "부채 추가",
        label_debt_extra_payment: "월 추가 상환액",
        section_goals_title: "재무 목표 설정",
        tooltip_goals: "달성하고 싶은 재무 목표를 추가하고 관리합니다. '저축액 추가'에 금액을 입력하여 달성률을 업데이트할 수 있습니다.",
        label_goal_name: "목표 이름",
        label_goal_target: "목표 금액",
        btn_add_goal: "목표 추가",
        section_trends_title: "재무 트렌드 분석",
        tooltip_trends: "매월 말 '이번 달 데이터 기록하기' 버튼을 눌러 데이터를 저장하고, 시간 경과에 따른 재무 변화를 차트로 확인하세요.",
        btn_record_history: "이번 달 데이터 기록하기",
        placeholder_goal: '예: 유럽 여행',
        placeholder_debt: '예: 신용카드 A',
        section_category_title: "카테고리 관리",
        tooltip_category: "지출 카테고리를 직접 추가, 확인, 삭제할 수 있습니다.",
        label_category_name: "카테고리 이름",
        label_category_type: "카테고리 종류",
        btn_add_category: "카테고리 추가",
        label_expense_name: "기타 지출 항목",
        label_expense_amount: "금액",
        btn_add_expense: "기타 지출 추가",
        label_api_key: 'Gemini API 키',
        placeholder_api_key: '이곳에 API 키를 붙여넣으세요',
    }
};

// =================================================================================
// 2. 핵심 로직 및 계산 함수 (Core Logic & Calculation Functions)
// =================================================================================

function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function convertToAnnual(amount, frequency) {
    amount = parseFloat(amount) || 0;
    switch (frequency) {
        case 'monthly': return amount * 12;
        case 'bi-weekly': return amount * 26;
        case 'weekly': return amount * 52;
        case 'annual': return amount;
        default: return amount;
    }
}

function convertFromAnnual(annualAmount, frequency) {
    annualAmount = parseFloat(annualAmount) || 0;
    if (annualAmount === 0) return 0;
    switch (frequency) {
        case 'monthly': return annualAmount / 12;
        case 'bi-weekly': return annualAmount / 26;
        case 'weekly': return annualAmount / 52;
        case 'annual': return annualAmount;
        default: return annualAmount;
    }
}

function calculateTotalForSection(items, customItems, freqKey) {
    let total = 0;
    const freq = data.frequencies[freqKey];
    for (const key in items) {
        if (key !== 'custom') total += convertToAnnual(items[key], freq);
    }
    if (customItems) {
        total += customItems.reduce((sum, item) => sum + convertToAnnual(item.amount, item.frequency), 0);
    }
    return total;
}

function calculateBudget() {
    let annualNetIncome = 0;
    let annualGrossSalary = 0;
    let totalAnnualTaxes = 0;
    let totalAnnualPreTaxDeductions = 0;
    let totalAnnualPostTaxDeductions = 0;
    
    const expenseTotals = categorizeExpensesOnly();
    let totalAnnualExpenses = expenseTotals.needs + expenseTotals.wants + expenseTotals.savings + expenseTotals.debt;

    const totalAnnualDebtPayments = data.debts.reduce((sum, debt) => {
        return sum + convertToAnnual(debt.payment, 'monthly');
    }, 0);
    totalAnnualExpenses += totalAnnualDebtPayments;

    if (data.calculationMode === 'advanced') {
        annualGrossSalary = convertToAnnual(data.grossSalary, data.salaryFrequency) + calculateTotalForSection({}, data.customIncomes);
        totalAnnualTaxes = calculateTotalForSection(data.taxes, data.taxes.custom, 'tax');
        totalAnnualPreTaxDeductions = calculateTotalForSection(data.preTaxDeductions, data.preTaxDeductions.custom, 'preTax');
        totalAnnualPostTaxDeductions = calculateTotalForSection(data.postTaxDeductions, data.postTaxDeductions.custom, 'postTax');
        annualNetIncome = annualGrossSalary - totalAnnualTaxes - totalAnnualPreTaxDeductions - totalAnnualPostTaxDeductions;
    } else {
        annualNetIncome = convertToAnnual(data.netIncome, 'monthly');
    }

    const remainingBudget = annualNetIncome - totalAnnualExpenses;

    return { annualGrossSalary, annualNetIncome, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget };
}

function categorizeExpensesOnly(getItems = false) {
    let totals = { needs: 0, wants: 0, savings: 0, debt: 0 };
    let items = { needs: [], wants: [], savings: [], debt: [] };
    const lang = data.currentLanguage;
    const t = translations[lang];

    // 1. 고정 지출 항목 처리
    for (const key in data.expenses) {
        if (key === 'custom') continue;

        const amount = convertToAnnual(data.expenses[key], data.frequencies.expense);
        if (amount > 0) {
            // Note: This relies on category names matching keys, which can be fragile.
            // A better approach might involve a direct mapping if names diverge from keys.
            const category = data.categories.find(c => c.name.toLowerCase().replace(/[^a-z0-9]/g, '').startsWith(key.toLowerCase()));
            if (category) {
                totals[category.type] += amount;
                if (getItems) {
                    const itemName = t[`label_${key.replace(/-/g, '_')}`] || category.name;
                    items[category.type].push({ name: itemName, amount });
                }
            }
        }
    }

    // 2. 맞춤(기타) 지출 항목 처리
    data.expenses.custom.forEach(expense => {
        const category = data.categories.find(c => c.id === expense.categoryId);
        if (category) {
            const categoryType = category.type;
            const amount = convertToAnnual(expense.amount, expense.frequency);
            if (amount > 0) {
                totals[categoryType] += amount;
                if (getItems) {
                    items[categoryType].push({ name: expense.name, amount });
                }
            }
        }
    });

    return getItems ? { items, totals } : totals;
}


function applyBudgetRule() {
    const { annualNetIncome } = calculateBudget();
    const totals = categorizeExpensesOnly();
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
                { id: 'savings_debt', label: t.rule_category_savings_debt, goal: annualNetIncome * 0.2, actual: totals.savings + totals.debt }
            ];
    }
}

/**
 * UPGRADED DEBT CALCULATOR
 * This version simulates the true "Avalanche" method by rolling over
 * the minimum payments of paid-off debts to accelerate repayment.
 */
function calculateDebtPaydown() {
    const extraPayment = parseFloat(debtExtraPaymentInput.value) || 0;
    let debts = JSON.parse(JSON.stringify(data.debts));

    if (debts.length === 0) {
        return { months: 0, totalInterest: 0 };
    }
    
    debts.sort((a, b) => b.rate - a.rate);

    let months = 0;
    let totalInterestPaid = 0;
    
    while (debts.some(d => d.balance > 0)) {
        months++;
        let paymentPool = extraPayment;

        // Add all minimum payments of active debts to the payment pool for this month
        for (const debt of debts) {
            if (debt.balance > 0) {
                const monthlyInterest = (debt.balance * (debt.rate / 100)) / 12;
                totalInterestPaid += monthlyInterest;
                debt.balance += monthlyInterest;
                paymentPool += debt.payment;
            }
        }
        
        // Distribute the total payment pool according to the avalanche method
        for (const debt of debts) {
            if (paymentPool <= 0) break;
            if (debt.balance > 0) {
                const paymentAmount = Math.min(debt.balance, paymentPool);
                debt.balance -= paymentAmount;
                paymentPool -= paymentAmount;
            }
        }
        
        if (months > 1200) { // Safety break for 100 years
            return { months: -1, totalInterest: 0 };
        }
    }
    
    return { months, totalInterest: totalInterestPaid };
}

function displayDebtResults(results) {
    if (!debtResultContainer) return;
    const lang = data.currentLanguage;

    if (results.months === -1) {
        debtResultContainer.textContent = "상환액이 부족하여 계산할 수 없습니다.";
        return;
    }
    if (results.months === 0) {
        debtResultContainer.innerHTML = "";
        return;
    }

    const years = Math.floor(results.months / 12);
    const remainingMonths = results.months % 12;
    
    let timeText = '';
    if (years > 0) timeText += `${years}년 `;
    if (remainingMonths > 0) timeText += `${remainingMonths}개월`;

    const resultText = `<strong>${timeText}</strong> 후 부채 청산! (총 이자: ${formatCurrency(results.totalInterest)})`;
    debtResultContainer.innerHTML = resultText;
}

// =================================================================================
// 3. UI 렌더링 및 업데이트 함수 (UI Rendering & Update Functions)
// =================================================================================
function renderHistoryChart() {
    const ctx = document.getElementById('history-chart');
    if (!ctx) return;

    const labels = data.history.map(item => item.date);
    const needsData = data.history.map(item => item.summary.needs);
    const wantsData = data.history.map(item => item.summary.wants);
    const savingsData = data.history.map(item => item.summary.savings);

    const chartData = {
        labels: labels,
        datasets: [
            { label: '필수 지출 (Needs)', data: needsData, borderColor: '#FF6384', backgroundColor: 'rgba(255, 99, 132, 0.2)', fill: true, tension: 0.1 },
            { label: '선택 지출 (Wants)', data: wantsData, borderColor: '#FFCE56', backgroundColor: 'rgba(255, 206, 86, 0.2)', fill: true, tension: 0.1 },
            { label: '저축 (Savings)', data: savingsData, borderColor: '#36A2EB', backgroundColor: 'rgba(54, 162, 235, 0.2)', fill: true, tension: 0.1 }
        ]
    };

    if (historyChartInstance) {
        historyChartInstance.data = chartData;
        historyChartInstance.update();
    } else {
        historyChartInstance = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' }, title: { display: true, text: '월별 지출 및 저축 트렌드' } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}
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

function renderAllCustomLists() {
    renderCustomList(customIncomeList, data.customIncomes, 'income');
    renderCustomList(customTaxList, data.taxes.custom, 'tax');
    renderCustomList(customPreTaxDeductList, data.preTaxDeductions.custom, 'pre-tax');
    renderCustomList(customPostTaxDeductList, data.postTaxDeductions.custom, 'post-tax');
}

function renderCustomList(listElement, customItems, type) {
    if (!listElement) return;
    const lang = data.currentLanguage;
    const t = translations[lang];
    const hasCategory = ['pre-tax', 'post-tax'].includes(type);

    listElement.innerHTML = customItems.map((item, index) => {
        const categoryDropdown = hasCategory ? `
            <select class="custom-item-category form-control" data-index="${index}" data-type="${type}">
                <option value="needs" ${item.category === 'needs' ? 'selected' : ''}>${t.tag_needs}</option>
                <option value="wants" ${item.category === 'wants' ? 'selected' : ''}>${t.tag_wants}</option>
                <option value="savings" ${item.category === 'savings' ? 'selected' : ''}>${t.tag_savings}</option>
                <option value="debt" ${item.category === 'debt' ? 'selected' : ''}>${t.tag_debt}</option>
            </select>
        ` : '';
        const placeholder = type === 'income' ? t.custom_income_name : t.custom_item_name;
        const frequencyOptions = `
            <option value="monthly"${item.frequency === 'monthly' ? ' selected' : ''}>${t.frequency_monthly}</option>
            <option value="annual"${item.frequency === 'annual' ? ' selected' : ''}>${t.frequency_annually}</option>
            <option value="weekly"${item.frequency === 'weekly' ? ' selected' : ''}>${t.frequency_weekly}</option>
            <option value="bi-weekly"${item.frequency === 'bi-weekly' ? ' selected' : ''}>${t.frequency_bi_weekly}</option>
        `;

        return `
            <div class="custom-list-item ${type}-item">
                <input type="text" value="${item.name}" placeholder="${placeholder}" class="custom-item-name form-control" data-index="${index}" data-type="${type}">
                <input type="number" value="${item.amount}" placeholder="${t.custom_item_amount}" class="custom-item-amount form-control" data-index="${index}" data-type="${type}">
                <select class="custom-item-frequency form-control" data-index="${index}" data-type="${type}">${frequencyOptions}</select>
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

function createOrUpdateChart(instance, canvasId, label, dataValues, labels) {
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
    const ctx = document.getElementById(canvasId);
    if (!ctx) return instance;

    const filteredData = dataValues.map((value, index) => ({ value, label: labels[index] }))
        .filter(item => item.value > 0);

    const chartData = {
        labels: filteredData.map(item => item.label),
        datasets: [{
            label: label,
            data: filteredData.map(item => item.value),
            backgroundColor: colors
        }]
    };

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
    const { remainingBudget, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses } = calculateBudget();
    const expenseTotals = categorizeExpensesOnly(false);

    expensesChartInstance = createOrUpdateChart(expensesChartInstance, 'expenses-chart', t.section_expenses_title,
        [expenseTotals.needs, expenseTotals.wants, expenseTotals.savings, expenseTotals.debt],
        [t.tag_needs, t.tag_wants, t.tag_savings, t.tag_debt]
    );

    const overallLabels = data.calculationMode === 'advanced' ?
        [t.label_total_taxes, t.label_total_pre_tax, t.label_total_post_tax, t.label_total_expenses, t.label_remaining_budget] :
        [t.label_total_expenses, t.label_remaining_budget];
    const overallData = data.calculationMode === 'advanced' ?
        [totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget] :
        [totalAnnualExpenses, remainingBudget];

    budgetDistributionChartInstance = createOrUpdateChart(budgetDistributionChartInstance, 'budget-distribution-chart', t.section_summary_title,
        overallData.map(v => Math.max(0, v)), overallLabels
    );

    if (data.calculationMode === 'advanced') {
        const createChartData = (inputGroup, dataGroup, freqKey) => {
            const labels = [];
            const amounts = [];
            for (const key in inputGroup) {
                if (dataGroup[key] > 0) {
                    labels.push(t[`label_${key.replace(/-/g, '_')}`] || key);
                    amounts.push(convertToAnnual(dataGroup[key], data.frequencies[freqKey]));
                }
            }
            dataGroup.custom.forEach(item => { if (item.amount > 0) { labels.push(item.name); amounts.push(convertToAnnual(item.amount, item.frequency)); } });
            return { labels, amounts };
        };

        const taxData = createChartData(taxInputs, data.taxes, 'tax');
        taxChartInstance = createOrUpdateChart(taxChartInstance, 'tax-chart', t.section_taxes_title, taxData.amounts, taxData.labels);

        const preTaxData = createChartData(preTaxDeductInputs, data.preTaxDeductions, 'preTax');
        preTaxDeductChartInstance = createOrUpdateChart(preTaxDeductChartInstance, 'pre-tax-deduct-chart', t.section_pre_tax_title, preTaxData.amounts, preTaxData.labels);

        const postTaxData = createChartData(postTaxDeductInputs, data.postTaxDeductions, 'postTax');
        postTaxDeductChartInstance = createOrUpdateChart(postTaxDeductChartInstance, 'post-tax-deduct-chart', t.section_post_tax_title, postTaxData.amounts, postTaxData.labels);
    }
}

function showCategoryDetails(categoryId) {
    const lang = data.currentLanguage;
    const t = translations[lang];
    const { items: expenseItems } = categorizeExpensesOnly(true);
    let itemsToShow = [];
    let title = "";

    switch (categoryId) {
        case 'needs':
        case 'wants':
        case 'debt':
        case 'savings':
            itemsToShow = expenseItems[categoryId];
            title = t[`modal_title_${categoryId}`] || t[`rule_category_${categoryId}`];
            break;
        case 'savings_debt':
            itemsToShow = [...expenseItems.savings, ...expenseItems.debt];
            title = t.modal_title_savings_debt;
            break;
        case 'spending':
            itemsToShow = [...expenseItems.needs, ...expenseItems.wants];
            if (data.budgetRule === '80-20') itemsToShow.push(...expenseItems.debt);
            title = t.modal_title_spending;
            break;
    }

    modalTitle.textContent = title || "Details";
    modalList.innerHTML = itemsToShow.length > 0
        ? itemsToShow.map(item => `<li><span class="modal-item-name">${capitalizeFirstLetter(item.name)}</span><span class="modal-item-amount">${formatCurrency(convertFromAnnual(item.amount, data.summaryFrequency))}</span></li>`).join('')
        : `<li>No items in this category.</li>`;
    modalContainer.classList.remove('hidden');
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

    for (const key in taxInputs) if (taxInputs[key]) data.taxes[key] = parseFloat(taxInputs[key].value) || 0;
    for (const key in preTaxDeductInputs) if (preTaxDeductInputs[key]) data.preTaxDeductions[key] = parseFloat(preTaxDeductInputs[key].value) || 0;
    for (const key in postTaxDeductInputs) if (postTaxDeductInputs[key]) data.postTaxDeductions[key] = parseFloat(postTaxDeductInputs[key].value) || 0;
    for (const key in expenseInputs) if (expenseInputs[key]) data.expenses[key] = parseFloat(expenseInputs[key].value) || 0;

    const { annualGrossSalary, annualNetIncome, totalAnnualTaxes, totalAnnualPreTaxDeductions, totalAnnualPostTaxDeductions, totalAnnualExpenses, remainingBudget } = calculateBudget();
    const summaryFreq = data.summaryFrequency;

    advancedModeContainer.classList.toggle('hidden', data.calculationMode === 'simple');
    simpleModeContainer.classList.toggle('hidden', data.calculationMode === 'advanced');
    summaryAdvancedView.classList.toggle('hidden', data.calculationMode === 'simple');

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
    renderGoals();
    renderDebts();
    renderCategories();
    populateCategoryDropdown();
    renderExpenses();
    const debtResults = calculateDebtPaydown();
    displayDebtResults(debtResults);
    renderHistoryChart();
    const breakdownData = applyBudgetRule();
    renderBudgetRule(breakdownData, remainingBudget, summaryFreq);
    updateCharts();
    renderCategoryTags();
    saveData();
}

// =================================================================================
// 4. 이벤트 핸들러 함수 (Event Handler Functions)
// =================================================================================

function recordMonthlyData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const currentMonthKey = `${year}-${month}`;

    const { annualNetIncome } = calculateBudget();
    const totals = categorizeExpensesOnly();
    const summaryFreq = 'monthly';

    const monthlySummary = {
        netIncome: convertFromAnnual(annualNetIncome, summaryFreq),
        needs: convertFromAnnual(totals.needs, summaryFreq),
        wants: convertFromAnnual(totals.wants, summaryFreq),
        savings: convertFromAnnual(totals.savings, summaryFreq),
        debt: convertFromAnnual(totals.debt, summaryFreq)
    };
    
    if (monthlySummary.netIncome <= 0) {
        alert("순수입이 0 이상일 때 기록할 수 있습니다.");
        return;
    }

    const existingIndex = data.history.findIndex(item => item.date === currentMonthKey);

    if (existingIndex > -1) {
        if (confirm(`'${currentMonthKey}' 데이터가 이미 존재합니다. 현재 데이터로 덮어쓰시겠습니까?`)) {
            data.history[existingIndex].summary = monthlySummary;
            alert("데이터가 업데이트되었습니다.");
        }
    } else {
        data.history.push({ date: currentMonthKey, summary: monthlySummary });
        alert("이번 달 데이터가 기록되었습니다.");
    }

    data.history.sort((a, b) => a.date.localeCompare(b.date));
    updateDisplay();
}

function renderGoals() {
    if (!goalListContainer) return;
    
    goalListContainer.innerHTML = data.goals.map((goal, index) => {
        const targetAmount = parseFloat(goal.target) || 0;
        const savedAmount = parseFloat(goal.saved) || 0;
        const progress = targetAmount > 0 ? (savedAmount / targetAmount) * 100 : 0;
        const isCompleted = savedAmount >= targetAmount;

        return `
            <div class="goal-item">
                <div class="goal-item-header">
                    <span class="goal-item-name">${goal.name} ${isCompleted ? '(달성!)' : ''}</span>
                    <span class="goal-item-progress-text">${formatCurrency(savedAmount)} / ${formatCurrency(targetAmount)}</span>
                </div>
                <div class="goal-progress-bar">
                    <div class="goal-progress-bar-inner" style="width: ${Math.min(progress, 100)}%;">${Math.round(progress)}%</div>
                </div>
                <div class="goal-item-controls">
                    <input type="number" class="form-control goal-saved-input" placeholder="저축액 추가" data-index="${index}">
                    <button class="btn update-goal-btn" data-index="${index}">입력</button>
                    <button class="btn btn-danger remove-goal-btn" data-index="${index}">삭제</button>
                </div>
            </div>
        `;
    }).join('');

    goalListContainer.querySelectorAll('.update-goal-btn').forEach(btn => btn.addEventListener('click', updateGoalSavedAmount));
    goalListContainer.querySelectorAll('.remove-goal-btn').forEach(btn => btn.addEventListener('click', removeGoal));
}

function renderDebts() {
    if (!debtListContainer) return;
    debtListContainer.innerHTML = data.debts.map((debt, index) => `
        <div class="debt-item">
            <span class="debt-name">${debt.name}</span>
            <span class="debt-balance">${formatCurrency(debt.balance)}</span>
            <span class="debt-rate">${debt.rate}%</span>
            <span class="debt-payment">${formatCurrency(debt.payment)}/월</span>
            <button class="btn btn-danger remove-debt-btn" data-index="${index}">삭제</button>
        </div>
    `).join('');
    debtListContainer.querySelectorAll('.remove-debt-btn').forEach(btn => btn.addEventListener('click', removeDebt));
}

function addDebt() {
    const name = debtNameInput.value.trim();
    const balance = parseFloat(debtBalanceInput.value) || 0;
    const rate = parseFloat(debtRateInput.value) || 0;
    const payment = parseFloat(debtPaymentInput.value) || 0;

    if (name && balance > 0 && rate >= 0 && payment > 0) {
        data.debts.push({ id: Date.now(), name, balance, rate, payment });
        debtNameInput.value = '';
        debtBalanceInput.value = '';
        debtRateInput.value = '';
        debtPaymentInput.value = '';
        updateDisplay();
    } else {
        alert('모든 부채 정보를 올바르게 입력해주세요.');
    }
}

function removeDebt(event) {
    const index = event.target.dataset.index;
    if (confirm(`'${data.debts[index].name}' 부채를 정말 삭제하시겠습니까?`)) {
        data.debts.splice(index, 1);
        updateDisplay();
    }
}

function addGoal() {
    const name = goalNameInput.value.trim();
    const target = parseFloat(goalTargetInput.value) || 0;
    if (name && target > 0) {
        data.goals.push({ id: Date.now(), name: name, target: target, saved: 0 });
        goalNameInput.value = '';
        goalTargetInput.value = '';
        updateDisplay();
    } else {
        alert('올바른 목표 이름과 목표 금액을 입력해주세요.');
    }
}

function updateGoalSavedAmount(event) {
    const index = event.target.dataset.index;
    const goal = data.goals[index];
    const input = goalListContainer.querySelector(`.goal-saved-input[data-index="${index}"]`);
    const amountToAdd = parseFloat(input.value) || 0;
    if (goal && amountToAdd > 0) {
        goal.saved = (parseFloat(goal.saved) || 0) + amountToAdd;
        input.value = '';
        updateDisplay();
    }
}

function removeGoal(event) {
    const index = event.target.dataset.index;
    if (confirm(`'${data.goals[index].name}' 목표를 정말 삭제하시겠습니까?`)) {
        data.goals.splice(index, 1);
        updateDisplay();
    }
}
function addCustomItem(event) {
    const type = event.target.dataset.type;
    const listMap = { 'income': data.customIncomes, 'tax': data.taxes.custom, 'pre-tax': data.preTaxDeductions.custom, 'post-tax': data.postTaxDeductions.custom };
    const list = listMap[type];
    if (list) {
        list.push({ name: '', amount: 0, frequency: 'monthly', category: 'wants' });
        updateDisplay();
    }
}

function handleCustomItemChange(event) {
    const { index, type } = event.target.dataset;
    const listMap = { 'income': data.customIncomes, 'tax': data.taxes.custom, 'pre-tax': data.preTaxDeductions.custom, 'post-tax': data.postTaxDeductions.custom };
    const list = listMap[type];
    const item = list[parseInt(index)];
    if (item) {
        if (event.target.classList.contains('custom-item-name')) item.name = event.target.value;
        else if (event.target.classList.contains('custom-item-amount')) item.amount = parseFloat(event.target.value) || 0;
        else if (event.target.classList.contains('custom-item-frequency')) item.frequency = event.target.value;
        else if (event.target.classList.contains('custom-item-category')) item.category = event.target.value;
        updateDisplay();
    }
}

function removeCustomItem(event) {
    const { index, type } = event.target.dataset;
    const listMap = { 'income': data.customIncomes, 'tax': data.taxes.custom, 'pre-tax': data.preTaxDeductions.custom, 'post-tax': data.postTaxDeductions.custom };
    const list = listMap[type];
    list.splice(parseInt(index), 1);
    updateDisplay();
}

function applyLanguage(shouldUpdate = true) {
    const lang = data.currentLanguage;
    document.documentElement.lang = lang;
    languageToggleBtn.textContent = lang === 'ko' ? 'EN' : 'KO';
    currencyToggleBtn.textContent = data.currency === 'KRW' ? '$' : '₩';
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.placeholder !== undefined) element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });

    if (shouldUpdate) {
        updateDisplay();
    }
}


function applyDarkMode() {
    document.body.classList.toggle('dark-mode', data.isDarkMode);
    darkmodeToggleBtn.querySelector('i').className = data.isDarkMode ? 'ri-sun-line' : 'ri-moon-line';
}

function getFinancialSummaryForAI() {
    const { annualNetIncome, totalAnnualExpenses, remainingBudget } = calculateBudget();
    const totals = categorizeExpensesOnly();
    const summaryFreq = 'monthly';
    const lang = data.currentLanguage;

    let summaryText = `
    - Language for response: ${lang === 'ko' ? 'Korean' : 'English'}
    - Calculation Mode: ${data.calculationMode}
    - Summary Frequency: ${summaryFreq}
    - Currency: ${data.currency}
    - Net Income: ${formatCurrency(convertFromAnnual(annualNetIncome, summaryFreq))}
    - Total Expenses: ${formatCurrency(convertFromAnnual(totalAnnualExpenses, summaryFreq))}
    - (Needs: ${formatCurrency(convertFromAnnual(totals.needs, summaryFreq))}, Wants: ${formatCurrency(convertFromAnnual(totals.wants, summaryFreq))}, Savings: ${formatCurrency(convertFromAnnual(totals.savings, summaryFreq))}, Debt Payments: ${formatCurrency(convertFromAnnual(totals.debt, summaryFreq))})
    - Remaining Surplus: ${formatCurrency(convertFromAnnual(remainingBudget, summaryFreq))}
    - Financial Goals: ${data.goals.length > 0 ? data.goals.map(g => `${g.name} (Target: ${formatCurrency(g.target)})`).join(', ') : 'None'}
    - Debts: ${data.debts.length > 0 ? data.debts.map(d => `${d.name} (Balance: ${formatCurrency(d.balance)} at ${d.rate}% interest)`).join(', ') : 'None'}
    `;
    return summaryText.replace(/\s+/g, ' ').trim();
}

async function generateAiReport() {
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert("Gemini API 키를 입력해주세요.");
        return;
    }

    const lang = data.currentLanguage;
    aiReportBox.innerHTML = `<p>${translations[lang].report_local_generating}</p>`;

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const prompt = `
        You are a friendly and helpful financial advisor.
        Based on the following financial data summary, provide a concise analysis and 3-4 actionable recommendations for the user.
        Format your response in simple HTML using <h4> for titles and <ul><li> for bullet points. Do not include <html> or <body> tags.
        
        User's Financial Data:
        ${getFinancialSummaryForAI()}
    `;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} ${response.statusText}. ${errorData.error.message}`);
        }

        const responseData = await response.json();
        const aiText = responseData.candidates[0].content.parts[0].text;
        aiReportBox.innerHTML = aiText;

    } catch (error) {
        console.error("AI Report generation failed:", error);
        aiReportBox.innerHTML = `<p>리포트 생성에 실패했습니다. API 키가 유효한지, 또는 네트워크 연결을 확인해주세요. (${error.message})</p>`;
    }
}

function renderCategories() {
    if (!categoryListContainer) return;
    const lang = data.currentLanguage;
    const t = translations[lang];
    categoryListContainer.innerHTML = data.categories.map((cat, index) => `
        <div class="category-item">
            <span>${cat.name}</span>
            <span class="category-tag ${cat.type}">${t['tag_' + cat.type]}</span>
            <button class="remove-category-btn" data-index="${index}" title="Remove">&times;</button>
        </div>
    `).join('');
    categoryListContainer.querySelectorAll('.remove-category-btn').forEach(btn => btn.addEventListener('click', removeCategory));
}

function addCategory() {
    const name = categoryNameInput.value.trim();
    const type = categoryTypeSelect.value;
    if (name && type) {
        if (data.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
            alert('This category name already exists.');
            return;
        }
        data.categories.push({ id: Date.now(), name, type });
        categoryNameInput.value = '';
        updateDisplay();
    }
}

function removeCategory(event) {
    const index = event.target.dataset.index;
    const categoryName = data.categories[index].name;
    if (confirm(`Are you sure you want to delete the "${categoryName}" category?`)) {
        data.categories.splice(index, 1);
        updateDisplay();
    }
}

function populateCategoryDropdown() {
    if (!expenseCategorySelect) return;
    const lang = data.currentLanguage;
    const t = translations[lang];
    expenseCategorySelect.innerHTML = data.categories.map(cat => `<option value="${cat.id}">${cat.name} (${t['tag_' + cat.type]})</option>`).join('');
}

function renderExpenses() {
    if (!expenseListContainer) return;
    expenseListContainer.innerHTML = data.expenses.custom.map((exp, index) => {
        const category = data.categories.find(c => c.id === exp.categoryId);
        return `
            <div class="custom-list-item expense-item">
                <input type="text" value="${exp.name}" class="form-control" readonly>
                <input type="number" value="${exp.amount}" class="form-control" readonly>
                <input type="text" value="${exp.frequency}" class="form-control" readonly>
                <input type="text" value="${category ? category.name : 'Uncategorized'}" class="form-control" readonly>
                <button class="btn btn-danger remove-expense-btn" data-index="${index}">&times;</button>
            </div>
        `;
    }).join('');
    expenseListContainer.querySelectorAll('.remove-expense-btn').forEach(btn => btn.addEventListener('click', removeExpense));
}

function addExpense() {
    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value) || 0;
    const categoryId = parseInt(expenseCategorySelect.value);
    const frequency = expenseFrequencySelect.value;
    if (name && amount > 0 && categoryId) {
        data.expenses.custom.push({ id: Date.now(), name, amount, frequency, categoryId });
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        updateDisplay();
    } else {
        alert('Please enter a valid expense name, amount, and select a category.');
    }
}

function removeExpense(event) {
    const index = event.target.dataset.index;
    if (confirm('Are you sure you want to delete this expense?')) {
        data.expenses.custom.splice(index, 1);
        updateDisplay();
    }
}


// =================================================================================
// 5. 데이터 관리 함수 (Data Management Functions)
// =================================================================================
function isImportedDataValid(parsedData) {
    const requiredKeys = ['calculationMode', 'netIncome', 'expenses', 'customIncomes', 'taxes', 'categories'];
    if (!parsedData || typeof parsedData !== 'object') {
        return false;
    }
    for (const key of requiredKeys) {
        if (!(key in parsedData)) {
            return false;
        }
    }
    if (typeof parsedData.expenses !== 'object' || !Array.isArray(parsedData.customIncomes)) {
        return false;
    }
    return true;
}

function saveData() {
    localStorage.setItem('budgetAppData', JSON.stringify(data));
}

function populateUiFromData(savedData) {
    const deepMerge = (target, source) => {
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] instanceof Object && !Array.isArray(source[key]) && key in target && target[key] instanceof Object) {
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }

    savedData.goals = savedData.goals || [];
    savedData.debts = savedData.debts || [];
    savedData.history = savedData.history || [];
    savedData.categories = savedData.categories || [];
    savedData.frequencies = savedData.frequencies || {};
    
    deepMerge(data, savedData);

    taxFrequencySelect.value = data.frequencies.tax || 'monthly';
    preTaxFrequencySelect.value = data.frequencies.preTax || 'monthly';
    postTaxFrequencySelect.value = data.frequencies.postTax || 'monthly';
    expenseFrequencySelect.value = data.frequencies.expense || 'monthly';

    modeToggleCheckbox.checked = data.calculationMode === 'advanced';

    netIncomeInput.value = data.netIncome || 0;
    grossSalaryInput.value = data.grossSalary || 0;
    salaryFrequencySelect.value = data.salaryFrequency || 'monthly';
    summaryFrequencySelect.value = data.summaryFrequency || 'monthly';
    budgetRuleSelect.value = data.budgetRule || '50-30-20';

    for (const key in taxInputs) if (taxInputs[key] && data.taxes[key] !== undefined) taxInputs[key].value = data.taxes[key];
    for (const key in preTaxDeductInputs) if (preTaxDeductInputs[key] && data.preTaxDeductions[key] !== undefined) preTaxDeductInputs[key].value = data.preTaxDeductions[key];
    for (const key in postTaxDeductInputs) if (postTaxDeductInputs[key] && data.postTaxDeductions[key] !== undefined) postTaxDeductInputs[key].value = data.postTaxDeductions[key];
    for (const key in expenseInputs) if (expenseInputs[key] && data.expenses[key] !== undefined) expenseInputs[key].value = data.expenses[key];

    applyDarkMode();
    applyLanguage(false);
    updateDisplay();
}

function loadData() {
    const savedData = localStorage.getItem('budgetAppData');
    if (savedData) {
        populateUiFromData(JSON.parse(savedData));
    } else {
        updateDisplay();
    }
}


// =================================================================================
// 6. 애플리케이션 초기화 (Application Initialization)
// =================================================================================

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    apiKeyInput = document.getElementById('api-key-input');
    debtExtraPaymentInput = document.getElementById('debt-extra-payment-input');
    debtResultContainer = document.getElementById('debt-result-container');
    recordHistoryBtn = document.getElementById('record-history-btn');
    debtNameInput = document.getElementById('debt-name-input');
    debtBalanceInput = document.getElementById('debt-balance-input');
    debtRateInput = document.getElementById('debt-rate-input');
    debtPaymentInput = document.getElementById('debt-payment-input');
    addDebtBtn = document.getElementById('add-debt-btn');
    debtListContainer = document.getElementById('debt-list-container');
    goalNameInput = document.getElementById('goal-name-input');
    goalTargetInput = document.getElementById('goal-target-input');
    addGoalBtn = document.getElementById('add-goal-btn');
    goalListContainer = document.getElementById('goal-list-container');
    categoryNameInput = document.getElementById('category-name-input');
    categoryTypeSelect = document.getElementById('category-type-select');
    addCategoryBtn = document.getElementById('add-category-btn');
    categoryListContainer = document.getElementById('category-list-container');
    expenseNameInput = document.getElementById('expense-name-input');
    expenseAmountInput = document.getElementById('expense-amount-input');
    expenseCategorySelect = document.getElementById('expense-category-select');
    addExpenseBtn = document.getElementById('add-expense-btn');
    expenseListContainer = document.getElementById('expense-list-container');
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
    Object.assign(postTaxDeductInputs, { spp: document.getElementById('deduct-spp-1'), adnd: document.getElementById('deduct-adnd-1'), '401k-roth': document.getElementById('deduct-401k-roth-1'), ltd: document.getElementById('deduct-ltd-1'), 'critical-illness': document.getElementById('deduct-critical-illness-1'), 'accident-insurance': document.getElementById('deduct-accident-insurance-1'), 'legal-services': document.getElementById('deduct-legal-services-1') });
    Object.assign(expenseInputs, { rent: document.getElementById('exp-rent-1'), utilities: document.getElementById('exp-utilities-1'), internet: document.getElementById('exp-internet-1'), phone: document.getElementById('exp-phone-1'), groceries: document.getElementById('exp-groceries-1'), dining: document.getElementById('exp-dining-1'), transport: document.getElementById('exp-transport-1'), shopping: document.getElementById('exp-shopping-1'), health: document.getElementById('exp-health-1'), entertainment: document.getElementById('exp-entertainment-1'), insurance: document.getElementById('exp-insurance-1'), donation: document.getElementById('exp-donation-1'), travel: document.getElementById('exp-travel-1'), pets: document.getElementById('exp-pets-1'), children: document.getElementById('exp-children-1') });
    
    customIncomeList = document.getElementById('custom-income-list');
    customTaxList = document.getElementById('tax-custom-list');
    customPreTaxDeductList = document.getElementById('pre-tax-custom-list');
    customPostTaxDeductList = document.getElementById('post-tax-custom-list');

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

    // --- Event Listeners ---
    recordHistoryBtn.addEventListener('click', recordMonthlyData);
    addDebtBtn.addEventListener('click', addDebt);
    addGoalBtn.addEventListener('click', addGoal);
    addCategoryBtn.addEventListener('click', addCategory);
    addExpenseBtn.addEventListener('click', addExpense);
    modeToggleCheckbox.addEventListener('change', updateDisplay);
    document.querySelectorAll('.add-custom-btn').forEach(btn => btn.addEventListener('click', addCustomItem));

    const debouncedUpdate = debounce(updateDisplay, 300);
    document.querySelectorAll('input[type="number"]').forEach(el => el.addEventListener('input', debouncedUpdate));
    document.querySelectorAll('select').forEach(el => el.addEventListener('change', updateDisplay));

    languageToggleBtn.addEventListener('click', () => {
        data.currentLanguage = data.currentLanguage === 'ko' ? 'en' : 'ko';
        applyLanguage();
    });
    darkmodeToggleBtn.addEventListener('click', () => { data.isDarkMode = !data.isDarkMode; applyDarkMode(); saveData(); });
    currencyToggleBtn.addEventListener('click', () => { data.currency = data.currency === 'KRW' ? 'USD' : 'KRW'; applyLanguage(); });

    clearAllDataBtn.addEventListener('click', () => { if (confirm(translations[data.currentLanguage].confirm_clear_data)) { localStorage.removeItem('budgetAppData'); window.location.reload(); } });
    exportJsonBtn.addEventListener('click', () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'budget_data.json'; a.click(); URL.revokeObjectURL(a.href);
    });
    importJsonBtn.addEventListener('click', () => importJsonInput.click());
    importJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const parsedData = JSON.parse(e.target.result);
                    if (!isImportedDataValid(parsedData)) {
                        alert(translations[data.currentLanguage].invalid_json);
                        return;
                    }
                    if (confirm(translations[data.currentLanguage].confirm_import_data)) {
                        populateUiFromData(parsedData);
                        alert(translations[data.currentLanguage].alert_data_loaded);
                    }
                } catch (error) {
                    console.error("Import Error: ", error);
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

    // Tooltip handler
    document.querySelectorAll('.tooltip-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            const tooltipText = icon.nextElementSibling;
            const isVisible = tooltipText.classList.contains('visible');
            document.querySelectorAll('.tooltip-text.visible').forEach(tt => tt.classList.remove('visible'));
            if (!isVisible) tooltipText.classList.add('visible');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.tooltip-text.visible').forEach(tt => tt.classList.remove('visible'));
    });

    // --- Initial Load ---
    loadData();
});
