// --- DOM Elements ---
const grossSalaryInput = document.getElementById('salary-gross');
// const salarySummaryDisplay = document.getElementById('salary-summary'); // 이 라인은 이제 필요 없음 - HTML에서 해당 div를 제거했으므로
const grossSalarySummaryDisplay = document.getElementById('gross-salary-summary-display'); // 예산 요약 섹션에 새로 추가된 요소

const taxInputs = {
    federal: document.getElementById('tax-federal'),
    state: document.getElementById('tax-state'),
    oasdi: document.getElementById('tax-oasdi'),
    medicare: document.getElementById('tax-medicare'),
    casdi: document.getElementById('tax-casdi')
};
const customTaxList = document.getElementById('tax-custom-list');

const preTaxDeductInputs = {
    medical: document.getElementById('deduct-medical'),
    dental: document.getElementById('deduct-dental'),
    vision: document.getElementById('deduct-vision'),
    trad401k: document.getElementById('deduct-401k-trad')
};
const customPreTaxDeductList = document.getElementById('pre-tax-custom-list');

const postTaxDeductInputs = {
    spp: document.getElementById('deduct-spp'),
    adnd: document.getElementById('deduct-adnd'),
    roth401k: document.getElementById('deduct-401k-roth'),
    ltd: document.getElementById('deduct-ltd')
};
const customPostTaxDeductList = document.getElementById('post-tax-custom-list');


const expenseInputs = {
    rent: document.getElementById('exp-rent'),
    utilities: document.getElementById('exp-utilities'),
    internet: document.getElementById('exp-internet'),
    phone: document.getElementById('exp-phone'),
    groceries: document.getElementById('exp-groceries'),
    dining: document.getElementById('exp-dining'),
    transport: document.getElementById('exp-transport'),
    shopping: document.getElementById('exp-shopping'),
    health: document.getElementById('exp-health'),
    entertainment: document.getElementById('exp-entertainment')
};
const customExpenseList = document.getElementById('expenses-custom-list');


const totalTaxesDisplay = document.getElementById('total-taxes-display');
const totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
const totalPostTaxDisplay = document.getElementById('total-post-tax-display');
const netSalaryDisplay = document.getElementById('net-salary-display');
const totalExpensesDisplay = document.getElementById('total-expenses-display');
const remainingBudgetDisplay = document.getElementById('remaining-budget-display');

const aiReportBtn = document.getElementById('ai-report-btn');
const aiReportBox = document.getElementById('ai-report-box');

const exportJsonBtn = document.getElementById('export-json-btn');
const importJsonBtn = document.getElementById('import-json-btn');
const importJsonInput = document.getElementById('import-json-input');
const clearAllDataBtn = document.getElementById('clear-all-data-btn');

const languageToggleBtn = document.getElementById('language-toggle');
const darkmodeToggleBtn = document.getElementById('darkmode-toggle');


// --- Data Variables ---
let grossSalary = 0;
let customTaxes = [];
let customPreTaxDeductions = [];
let customPostTaxDeductions = [];
let customExpenses = [];
let currentLanguage = 'ko'; // Default language
let isDarkMode = false; // Default theme


// --- Chart Instances ---
let taxChart;
let expensesChart;
let budgetDistributionChart;
let preTaxDeductionsChart;
let postTaxDeductionsChart;

// --- Chart Color Palettes (새로 정의된 색상 팔레트) ---
const chartColorPalettes = {
    // 라이트 모드 (기본)
    light: {
        tax: ['#4CAF50'], // 막대 차트는 단일 색상
        expenses: ['#6a0dad', '#007bff', '#28a745', '#ffc107', '#dc3545', '#fd7e14', '#6610f2', '#e83e8c', '#17a2b8', '#6c757d'],
        preTax: ['#20c997', '#6c757d', '#00a8cc', '#ff9a00', '#607d8b', '#7b1fa2'],
        postTax: ['#6f42c1', '#a6b1c4', '#e6005c', '#3366ff', '#e91e63', '#795548'],
        budgetDistribution: {
            taxes: '#f64e60', // Red for Taxes
            preTaxDeductions: '#5d78ff', // Blue for Pre-Tax
            postTaxDeductions: '#20c997', // Teal for Post-Tax
            expenses: '#ffc107', // Yellow for Expenses
            remainingBudget: '#1abc9c', // Green for Remaining
            deficit: '#dc3545' // Darker Red for Deficit
        }
    },
    // 다크 모드
    dark: {
        tax: ['#76FF03'], // Brighter green for taxes
        expenses: ['#9C27B0', '#2196F3', '#4CAF50', '#FFEB3B', '#F44336', '#FF9800', '#673AB7', '#E91E63', '#00BCD4', '#9E9E9E'],
        preTax: ['#00BCD4', '#9E9E9E', '#8BC34A', '#FFC107', '#607d8b', '#E040FB'],
        postTax: ['#3F51B5', '#B0BEC5', '#E91E63', '#03A9F4', '#FF4081', '#795548'],
        budgetDistribution: {
            taxes: '#F44336', // Red for Taxes
            preTaxDeductions: '#2196F3', // Blue for Pre-Tax
            postTaxDeductions: '#00BCD4', // Teal for Post-Tax
            expenses: '#FFC107', // Yellow for Expenses
            remainingBudget: '#8BC34A', // Green for Remaining
            deficit: '#E53935' // Darker Red for Deficit
        }
    }
};

// --- Translations ---
const translations = {
    ko: {
        app_title: "예산 관리 도구",
        section_salary_title: "월별 총 급여",
        label_gross_salary: "총 급여",
        btn_save: "저장",
        section_taxes_title: "세금",
        label_federal_withholding: "연방 원천징수",
        label_state_tax: "주 세금",
        label_oasdi: "OASDI",
        label_medicare: "메디케어",
        label_ca_sdi: "CA SDI",
        btn_add_item: "항목 추가",
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
        label_net_salary: "순 월 급여:",
        label_total_taxes: "총 세금:",
        label_total_pre_tax: "총 세전 공제액:",
        label_total_post_tax: "총 세후 공제액:",
        label_total_expenses: "총 지출:",
        label_remaining_budget: "남은 예산:",
        label_deficit: "적자:",
        section_ai_title: "AI 지출 보고서",
        btn_ai_report: "AI 보고서 생성",
        ai_report_placeholder: '"AI 보고서 생성"을 클릭하여 지출 습관에 대한 통찰력을 얻으세요.',
        section_data_title: "데이터 관리",
        btn_export: "JSON 내보내기",
        btn_import: "JSON 가져오기",
        btn_clear_all_data: "모든 데이터 지우기",
        placeholder_item_name: "항목 이름",
        placeholder_amount: "금액",
        remove_item: "항목 제거",
        currency_symbol: "$"
    },
    en: {
        app_title: "Budget Management Tool",
        section_salary_title: "Gross Monthly Salary",
        label_gross_salary: "Gross Salary",
        btn_save: "Save",
        section_taxes_title: "Taxes",
        label_federal_withholding: "Federal Withholding",
        label_state_tax: "State Tax",
        label_oasdi: "OASDI",
        label_medicare: "Medicare",
        label_ca_sdi: "CA SDI",
        btn_add_item: "Add Item",
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
        label_net_salary: "Net Monthly Salary:",
        label_total_taxes: "Total Taxes:",
        label_total_pre_tax: "Total Pre-Tax Deductions:",
        label_total_post_tax: "Total Post-Tax Deductions:",
        label_total_expenses: "Total Expenses:",
        label_remaining_budget: "Remaining Budget:",
        label_deficit: "Deficit:",
        section_ai_title: "AI Spending Report",
        btn_ai_report: "Generate AI Report",
        ai_report_placeholder: 'Click "Generate AI Report" to get insights on your spending habits.',
        section_data_title: "Data Management",
        btn_export: "Export JSON",
        btn_import: "Import JSON",
        btn_clear_all_data: "Clear All Data",
        placeholder_item_name: "Item Name",
        placeholder_amount: "Amount",
        remove_item: "Remove Item",
        currency_symbol: "$"
    }
};

// --- Utility Functions ---
function formatCurrency(amount) {
    return `${translations[currentLanguage].currency_symbol}${amount.toFixed(2)}`;
}

function getTotal(inputs, customItems) {
    let total = 0;
    for (const key in inputs) {
        total += parseFloat(inputs[key].value) || 0;
    }
    customItems.forEach(item => {
        total += item.amount;
    });
    return total;
}

function renderCustomList(listElement, items, type) {
    listElement.innerHTML = ''; // Clear existing items
    items.forEach((item, index) => {
        const listItem = document.createElement('div');
        listItem.className = 'custom-list-item';
        listItem.innerHTML = `
            <span>${item.name}: ${formatCurrency(item.amount)}</span>
            <button class="remove-btn" data-index="${index}" data-type="${type}" title="${translations[currentLanguage].remove_item}">
                <i class="ri-close-line"></i>
            </button>
        `;
        listElement.appendChild(listItem);
    });
}

function addCustomItem(list, type, name, amount) {
    if (name && amount > 0) {
        list.push({ name, amount });
        saveData();
        updateDisplay();
    } else {
        alert('Please enter a valid name and amount.');
    }
}

function removeCustomItem(list, index) {
    list.splice(index, 1);
    saveData();
    updateDisplay();
}

// --- Chart.js Integration ---
function initializeCharts() {
    // --- 기존 차트 인스턴스가 있다면 파괴 ---
    if (taxChart) {
        taxChart.destroy();
        console.log('Destroyed existing taxChart.');
    }
    if (expensesChart) {
        expensesChart.destroy();
        console.log('Destroyed existing expensesChart.');
    }
    if (budgetDistributionChart) {
        budgetDistributionChart.destroy();
        console.log('Destroyed existing budgetDistributionChart.');
    }
    if (preTaxDeductionsChart) {
        preTaxDeductionsChart.destroy();
        console.log('Destroyed existing preTaxDeductionsChart.');
    }
    if (postTaxDeductionsChart) {
        postTaxDeductionsChart.destroy();
        console.log('Destroyed existing postTaxDeductionsChart.');
    }
    // --- END Destroy ---

    // 공통 차트 옵션 (색상, 반응성 등)
    // Note: scales property is only for charts with axes (like bar/line)
    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: getComputedStyle(document.body).getPropertyValue('--chart-text-color'),
                }
            }
        }
    };

    // Tax Chart (막대 차트)
    taxChart = new Chart(document.getElementById('tax-chart'), {
        type: 'bar',
        data: {
            labels: [], // Populated in updateCharts
            datasets: [{
                label: translations[currentLanguage].section_taxes_title || 'Taxes',
                data: [], // Populated in updateCharts
                backgroundColor: getComputedStyle(document.body).getPropertyValue('--chart-tax-bar-color'), // CSS 변수 사용
                borderColor: getComputedStyle(document.body).getPropertyValue('--chart-tax-bar-color'),
                borderWidth: 1
            }]
        },
        options: { // 막대 차트는 scales 옵션 필요
            ...commonChartOptions,
            scales: {
                x: {
                    ticks: { color: getComputedStyle(document.body).getPropertyValue('--chart-text-color') },
                    grid: { color: getComputedStyle(document.body).getPropertyValue('--chart-grid-color') }
                },
                y: {
                    ticks: { color: getComputedStyle(document.body).getPropertyValue('--chart-text-color') },
                    grid: { color: getComputedStyle(document.body).getPropertyValue('--chart-grid-color') }
                }
            }
        }
    });

    // Expenses Chart (파이 차트)
    expensesChart = new Chart(document.getElementById('expenses-chart'), {
        type: 'pie',
        data: {
            labels: [], // Populated in updateCharts
            datasets: [{
                label: translations[currentLanguage].section_expenses_title || 'Expenses Breakdown',
                data: [], // Populated in updateCharts
                // 색상 팔레트를 직접 배열로 전달 (JS에서 정의)
                backgroundColor: isDarkMode ? chartColorPalettes.dark.expenses : chartColorPalettes.light.expenses,
                hoverOffset: 4
            }]
        },
        options: commonChartOptions // 파이 차트는 scales 옵션 불필요
    });

    // Budget Distribution Chart (도넛 차트)
    budgetDistributionChart = new Chart(document.getElementById('budget-distribution-chart'), {
        type: 'doughnut',
        data: {
            labels: [], // Populated in updateCharts
            datasets: [{
                label: translations[currentLanguage].section_summary_title || 'Budget Distribution',
                data: [], // Populated in updateCharts
                backgroundColor: [], // Update in updateCharts based on remainingBudget
                hoverOffset: 4
            }]
        },
        options: commonChartOptions // 도넛 차트는 scales 옵션 불필요
    });

    // Pre-Tax Deductions Chart (파이 차트)
    preTaxDeductionsChart = new Chart(document.getElementById('pre-tax-deduct-chart'), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: translations[currentLanguage].section_pre_tax_title || 'Pre-Tax Deductions Breakdown',
                data: [],
                backgroundColor: isDarkMode ? chartColorPalettes.dark.preTax : chartColorPalettes.light.preTax,
                hoverOffset: 4
            }]
        },
        options: commonChartOptions
    });

    // Post-Tax Deductions Chart (파이 차트)
    postTaxDeductionsChart = new Chart(document.getElementById('post-tax-deduct-chart'), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: translations[currentLanguage].section_post_tax_title || 'Post-Tax Deductions Breakdown',
                data: [],
                backgroundColor: isDarkMode ? chartColorPalettes.dark.postTax : chartColorPalettes.light.postTax,
                hoverOffset: 4
            }]
        },
        options: commonChartOptions
    });

    console.log('Charts initialized successfully.');
}


function updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions) {
    // Current palette based on theme
    const currentPalette = isDarkMode ? chartColorPalettes.dark : chartColorPalettes.light;

    // Update Tax Chart
    const taxLabels = [];
    const taxData = [];
    for (const key in taxInputs) {
        const value = parseFloat(taxInputs[key].value) || 0;
        if (value > 0) {
            taxLabels.push(taxInputs[key].previousElementSibling.textContent);
            taxData.push(value);
        }
    }
    customTaxes.forEach(item => {
        if (item.amount > 0) {
            taxLabels.push(item.name);
            taxData.push(item.amount);
        }
    });
    taxChart.data.labels = taxLabels;
    taxChart.data.datasets[0].data = taxData;
    taxChart.data.datasets[0].label = translations[currentLanguage].section_taxes_title;
    taxChart.update();

    // Update Expenses Chart
    const expenseLabels = [];
    const expenseData = [];
    for (const key in expenseInputs) {
        const value = parseFloat(expenseInputs[key].value) || 0;
        if (value > 0) {
            expenseLabels.push(expenseInputs[key].previousElementSibling.textContent);
            expenseData.push(value);
        }
    }
    customExpenses.forEach(item => {
        if (item.amount > 0) {
            expenseLabels.push(item.name);
            expenseData.push(item.amount);
        }
    });
    expensesChart.data.labels = expenseLabels;
    expensesChart.data.datasets[0].data = expenseData;
    expensesChart.data.datasets[0].label = translations[currentLanguage].section_expenses_title;
    expensesChart.update();

    // Update Budget Distribution Chart
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
        Math.max(0, remainingBudget) // Show 0 if negative, as pie chart can't show negative
    ];
    // Use dynamic budget distribution colors from currentPalette
    const budgetColors = [
        currentPalette.budgetDistribution.taxes,
        currentPalette.budgetDistribution.preTaxDeductions,
        currentPalette.budgetDistribution.postTaxDeductions,
        currentPalette.budgetDistribution.expenses,
        currentPalette.budgetDistribution.remainingBudget
    ];
    // If remaining budget is negative, change color to red and label
    if (remainingBudget < 0) {
        budgetColors[4] = currentPalette.budgetDistribution.deficit; // Use deficit color
        budgetData[4] = Math.abs(remainingBudget); // Show absolute value of deficit
        budgetLabels[4] = translations[currentLanguage].label_deficit || 'Deficit'; // Label as Deficit
    }

    budgetDistributionChart.data.labels = budgetLabels;
    budgetDistributionChart.data.datasets[0].data = budgetData;
    budgetDistributionChart.data.datasets[0].backgroundColor = budgetColors;
    budgetDistributionChart.data.datasets[0].label = translations[currentLanguage].section_summary_title;
    budgetDistributionChart.update();

    // Update Pre-Tax Deductions Chart
    const preTaxDeductLabels = [];
    const preTaxDeductData = [];
    for (const key in preTaxDeductInputs) {
        const value = parseFloat(preTaxDeductInputs[key].value) || 0;
        if (value > 0) {
            preTaxDeductLabels.push(preTaxDeductInputs[key].previousElementSibling.textContent);
            preTaxDeductData.push(value);
        }
    }
    customPreTaxDeductions.forEach(item => {
        if (item.amount > 0) {
            preTaxDeductLabels.push(item.name);
            preTaxDeductData.push(item.amount);
        }
    });
    preTaxDeductionsChart.data.labels = preTaxDeductLabels;
    preTaxDeductionsChart.data.datasets[0].data = preTaxDeductData;
    preTaxDeductionsChart.data.datasets[0].label = translations[currentLanguage].section_pre_tax_title;
    // Update background colors based on current theme palette
    preTaxDeductionsChart.data.datasets[0].backgroundColor = currentPalette.preTax;
    preTaxDeductionsChart.update();

    // Update Post-Tax Deductions Chart
    const postTaxDeductLabels = [];
    const postTaxDeductData = [];
    for (const key in postTaxDeductInputs) {
        const value = parseFloat(postTaxDeductInputs[key].value) || 0;
        if (value > 0) {
            postTaxDeductLabels.push(postTaxDeductInputs[key].previousElementSibling.textContent);
            postTaxDeductData.push(value);
        }
    }
    customPostTaxDeductions.forEach(item => {
        if (item.amount > 0) {
            postTaxDeductLabels.push(item.name);
            postTaxDeductData.push(item.amount);
        }
    });
    postTaxDeductionsChart.data.labels = postTaxDeductLabels;
    postTaxDeductionsChart.data.datasets[0].data = postTaxDeductData;
    postTaxDeductionsChart.data.datasets[0].label = translations[currentLanguage].section_post_tax_title;
    // Update background colors based on current theme palette
    postTaxDeductionsChart.data.datasets[0].backgroundColor = currentPalette.postTax;
    postTaxDeductionsChart.update();


    // Update chart text color based on dark mode
    const chartTextColor = getComputedStyle(document.body).getPropertyValue('--chart-text-color');
    const chartGridColor = getComputedStyle(document.body).getPropertyValue('--chart-grid-color');

    [taxChart, expensesChart, budgetDistributionChart, preTaxDeductionsChart, postTaxDeductionsChart].forEach(chart => {
        if (chart && chart.options && chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
            chart.options.plugins.legend.labels.color = chartTextColor;
        }
        if (chart && chart.options && chart.options.scales && chart.options.scales.x) {
            chart.options.scales.x.ticks.color = chartTextColor;
            chart.options.scales.x.grid.color = chartGridColor;
        }
        if (chart && chart.options && chart.options.scales && chart.options.scales.y) {
            chart.options.scales.y.ticks.color = chartTextColor;
            chart.options.scales.y.grid.color = chartGridColor;
        }
        // 특별히 막대 차트의 단일 배경색을 업데이트
        if (chart === taxChart && chart.data.datasets.length > 0) {
            chart.data.datasets[0].backgroundColor = getComputedStyle(document.body).getPropertyValue('--chart-tax-bar-color');
            chart.data.datasets[0].borderColor = getComputedStyle(document.body).getPropertyValue('--chart-tax-bar-color');
        }

        if (chart) {
            chart.update();
        }
    });
}


// --- Display and Calculation Logic ---
function updateDisplay() {
    grossSalary = parseFloat(grossSalaryInput.value) || 0;
    // salarySummaryDisplay.textContent = `${translations[currentLanguage].label_gross_salary}: ${formatCurrency(grossSalary)}`; // 이 라인은 제거
    grossSalarySummaryDisplay.textContent = formatCurrency(grossSalary); // 새로운 gross-salary-summary-display 업데이트

    const totalTaxes = getTotal(taxInputs, customTaxes);
    totalTaxesDisplay.textContent = formatCurrency(totalTaxes);

    const totalPreTaxDeductions = getTotal(preTaxDeductInputs, customPreTaxDeductions);
    totalPreTaxDisplay.textContent = formatCurrency(totalPreTaxDeductions);

    const totalPostTaxDeductions = getTotal(postTaxDeductInputs, customPostTaxDeductions);
    totalPostTaxDisplay.textContent = formatCurrency(totalPostTaxDeductions);

    const netSalary = grossSalary - totalTaxes - totalPreTaxDeductions - totalPostTaxDeductions;
    netSalaryDisplay.textContent = formatCurrency(netSalary);

    const totalExpenses = getTotal(expenseInputs, customExpenses);
    totalExpensesDisplay.textContent = formatCurrency(totalExpenses);

    const remainingBudget = netSalary - totalExpenses;
    remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);
    remainingBudgetDisplay.style.color = remainingBudget >= 0 ? 'var(--summary-text-color)' : 'var(--danger-color)';

    // Update charts with new data
    updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions);

    renderCustomList(customTaxList, customTaxes, 'tax');
    renderCustomList(customPreTaxDeductList, customPreTaxDeductions, 'pre-tax');
    renderCustomList(customPostTaxDeductList, customPostTaxDeductions, 'post-tax');
    renderCustomList(customExpenseList, customExpenses, 'expense');

    applyBudgetRule(grossSalary); // <- 예산 룰 자동 반영
}

// --- Data Persistence ---
function saveData() {
    const data = {
        grossSalary: grossSalaryInput.value,
        taxInputs: {},
        customTaxes: customTaxes,
        preTaxDeductInputs: {},
        customPreTaxDeductions: customPreTaxDeductions,
        postTaxDeductInputs: {},
        customPostTaxDeductions: customPostTaxDeductions,
        expenseInputs: {},
        customExpenses: customExpenses,
        currentLanguage: currentLanguage,
        isDarkMode: isDarkMode
    };

    for (const key in taxInputs) data.taxInputs[key] = taxInputs[key].value;
    for (const key in preTaxDeductInputs) data.preTaxDeductInputs[key] = preTaxDeductInputs[key].value;
    for (const key in postTaxDeductInputs) data.postTaxDeductInputs[key] = postTaxDeductInputs[key].value;
    for (const key in expenseInputs) data.expenseInputs[key] = expenseInputs[key].value;

    localStorage.setItem('budgetAppData', JSON.stringify(data));
    console.log('Data saved.');
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('budgetAppData'));
    if (data) {
        grossSalaryInput.value = data.grossSalary || 0;

        for (const key in taxInputs) taxInputs[key].value = data.taxInputs[key] || 0;
        customTaxes = data.customTaxes || [];

        for (const key in preTaxDeductInputs) preTaxDeductInputs[key].value = data.preTaxDeductInputs[key] || 0;
        customPreTaxDeductions = data.customPreTaxDeductions || [];

        for (const key in postTaxDeductInputs) postTaxDeductInputs[key].value = data.postTaxDeductInputs[key] || 0;
        customPostTaxDeductions = data.customPostTaxDeductions || [];

        for (const key in expenseInputs) expenseInputs[key].value = data.expenseInputs[key] || 0;
        customExpenses = data.customExpenses || [];

        currentLanguage = data.currentLanguage || 'ko';
        isDarkMode = data.isDarkMode === true; // Ensure boolean
    }
    applyLanguage(currentLanguage);
    applyDarkMode(isDarkMode); // applyDarkMode를 loadData 마지막에 호출하여 초기화 후 테마 적용
    updateDisplay(); // 데이터 로드 후 디스플레이 업데이트 (차트 포함)
    console.log('Data loaded.');
}


// --- Language & Dark Mode ---
function applyLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });
    // Update input placeholders if needed (requires data-i18n-placeholder)
    // Note: If you have <input placeholder="..."> attributes that should be translated,
    // you'll need to add a data-i18n-placeholder attribute to them and handle it here.
    // For now, only labels and similar text content are handled directly.
    // If you add placeholder translation, it would look something like this:
    // document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    //      const key = element.dataset.i18nPlaceholder;
    //      if (translations[currentLanguage][key]) {
    //          element.placeholder = translations[currentLanguage][key];
    //      }
    // });

    // Custom item input labels (as per your previous query)
    // These need to be targeted specifically as they don't have data-i18n-key for labels
    const customItemNameLabel = document.querySelector('label[for="custom-item-name-input"]');
    if (customItemNameLabel) {
        customItemNameLabel.textContent = translations[currentLanguage].placeholder_item_name;
    }
    const customItemAmountLabel = document.querySelector('label[for="custom-item-amount-input"]');
    if (customItemAmountLabel) {
        customItemAmountLabel.textContent = translations[currentLanguage].placeholder_amount;
    }


    languageToggleBtn.textContent = currentLanguage === 'ko' ? 'EN' : 'KO'; // Toggle text
    updateDisplay(); // Recalculate and update displays with new language
}

function applyDarkMode(enable) {
    isDarkMode = enable;
    if (enable) {
        document.body.classList.add('dark-mode');
        darkmodeToggleBtn.innerHTML = '<i class="ri-sun-line"></i>'; // Sun icon for light mode
    } else {
        document.body.classList.remove('dark-mode');
        darkmodeToggleBtn.innerHTML = '<i class="ri-moon-line"></i>'; // Moon icon for dark mode
    }
    // Update charts to reflect new theme colors
    // This will be handled by updateCharts, which is called by updateDisplay
    // We explicitly re-initialize charts to ensure all color options are re-applied based on new CSS variables
    // and then update their data.
    initializeCharts(); // 차트 인스턴스를 테마에 맞게 다시 초기화
    updateDisplay(); // 모든 값과 차트 업데이트
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // 중요한 순서: initializeCharts -> loadData -> updateDisplay (loadData 내에서 호출)
    initializeCharts(); // 차트 캔버스가 존재함을 확인하고 차트 인스턴스 초기화
    loadData(); // 저장된 데이터 로드 (applyDarkMode와 updateDisplay 포함)

    // Input Change Listeners
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            updateDisplay();
            saveData();
        });
    });

    document.getElementById('salary-form').addEventListener('submit', (e) => {
        e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지
        updateDisplay();
        saveData();
    });

    // Add Custom Item Buttons
    document.querySelectorAll('.add-custom-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const customName = prompt(translations[currentLanguage].placeholder_item_name + ':');
            if (customName === null) return; // Prompt cancelled

            let customAmount = prompt(translations[currentLanguage].placeholder_amount + ':');
            if (customAmount === null) return; // Prompt cancelled
            customAmount = parseFloat(customAmount);

            if (isNaN(customAmount) || customAmount < 0) {
                alert('Please enter a valid number for amount.');
                return;
            }

            switch (type) {
                case 'tax':
                    addCustomItem(customTaxes, type, customName, customAmount);
                    break;
                case 'pre-tax':
                    addCustomItem(customPreTaxDeductions, type, customName, customAmount);
                    break;
                case 'post-tax':
                    addCustomItem(customPostTaxDeductions, type, customName, customAmount);
                    break;
                case 'expense':
                    addCustomItem(customExpenses, type, customName, customAmount);
                    break;
            }
        });
    });

    // Remove Custom Item Buttons (Event Delegation)
    document.addEventListener('click', (e) => {
        // 이벤트 위임을 사용하여 동적으로 추가된 .remove-btn도 처리
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
    languageToggleBtn.addEventListener('click', () => {
        const newLang = currentLanguage === 'ko' ? 'en' : 'ko';
        applyLanguage(newLang);
        saveData();
    });

    // Dark Mode Toggle
    darkmodeToggleBtn.addEventListener('click', () => {
        applyDarkMode(!isDarkMode);
        saveData();
    });

    // Data Management: Export JSON
    exportJsonBtn.addEventListener('click', () => {
        const data = {
            grossSalary: grossSalaryInput.value,
            taxInputs: {},
            customTaxes: customTaxes,
            preTaxDeductInputs: {},
            customPreTaxDeductions: customPreTaxDeductions,
            postTaxDeductInputs: {},
            customPostTaxDeductions: customPostTaxDeductions,
            expenseInputs: {},
            customExpenses: customExpenses,
            currentLanguage: currentLanguage,
            isDarkMode: isDarkMode
        };

        // Standard inputs
        for (const key in taxInputs) data.taxInputs[key] = taxInputs[key].value;
        for (const key in preTaxDeductInputs) data.preTaxDeductInputs[key] = preTaxDeductInputs[key].value;
        for (const key in postTaxDeductInputs) data.postTaxDeductInputs[key] = postTaxDeductInputs[key].value;
        for (const key in expenseInputs) data.expenseInputs[key] = expenseInputs[key].value;

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
        alert('예산 데이터가 성공적으로 내보내졌습니다!');
    });

    // Data Management: Import JSON
    importJsonBtn.addEventListener('click', () => {
        importJsonInput.click(); // Hidden file input 클릭 트리거
    });

    importJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    // 데이터 유효성 검사 (선택 사항이지만 권장)
                    if (importedData && typeof importedData.grossSalary !== 'undefined' && importedData.taxInputs) {
                        // 기존 데이터 로드 함수를 재사용하여 UI 및 내부 변수 업데이트
                        localStorage.setItem('budgetAppData', JSON.stringify(importedData));
                        loadData(); // 모든 데이터 로드 및 UI 업데이트
                        alert('데이터가 성공적으로 가져와졌습니다!');
                    } else {
                        alert('유효하지 않은 JSON 파일 형식입니다.');
                    }
                } catch (error) {
                    alert('JSON 파일을 구문 분석하는 중 오류가 발생했습니다: ' + error.message);
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    });

    // Data Management: Clear All Data
    clearAllDataBtn.addEventListener('click', () => {
        if (confirm('모든 저장된 데이터를 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            localStorage.removeItem('budgetAppData');
            // 모든 입력 필드 초기화
            grossSalaryInput.value = 0;
            for (const key in taxInputs) taxInputs[key].value = 0;
            for (const key in preTaxDeductInputs) preTaxDeductInputs[key].value = 0;
            for (const key in postTaxDeductInputs) postTaxDeductInputs[key].value = 0;
            for (const key in expenseInputs) expenseInputs[key].value = 0;

            // 커스텀 목록 초기화
            customTaxes = [];
            customPreTaxDeductions = [];
            customPostTaxDeductions = [];
            customExpenses = [];

            updateDisplay(); // 초기화된 데이터로 UI 업데이트
            alert('모든 데이터가 지워졌습니다.');
        }
    });

    // AI Report Generation (Placeholder for actual AI integration)
    aiReportBtn.addEventListener('click', () => {
        // 이 부분은 실제 AI API 연동 없이 단순히 플레이스홀더 텍스트를 보여줍니다.
        aiReportBox.innerHTML = `<p>${translations[currentLanguage].ai_report_placeholder}</p>`;
        // 실제 AI 통합을 하려면 여기에 API 호출 등을 추가해야 합니다.
        // 예시:
        // fetch('/api/ai-report', {
        //      method: 'POST',
        //      headers: { 'Content-Type': 'application/json' },
        //      body: JSON.stringify(getCurrentBudgetSummary()) // 현재 예산 데이터를 전송
        // })
        // .then(response => response.json())
        // .then(data => {
        //      aiReportBox.textContent = data.report; // AI로부터 받은 보고서 표시
        // })
        // .catch(error => {
        //      console.error('AI 보고서 생성 중 오류 발생:', error);
        //      aiReportBox.textContent = 'AI 보고서를 생성할 수 없습니다.';
        // });
    });

    document.getElementById("budget-rule-select").addEventListener("change", () => {
    const gross = parseFloat(grossSalaryInput.value) || 0;
    applyBudgetRule(gross);
});
});

const BUDGET_RULES = {
    "50-30-20": { needs: 0.5, wants: 0.3, savings: 0.2 },
    "70-20-10": { needs: 0.7, wants: 0.2, savings: 0.1 },
    "80-20":    { needs: 0.8, wants: 0.0, savings: 0.2 }
};

function applyBudgetRule(grossIncome) {
    const select = document.getElementById("budget-rule-select");
    const rule = BUDGET_RULES[select.value];
    if (!rule) return;

    const needs = grossIncome * rule.needs;
    const wants = grossIncome * rule.wants;
    const savings = grossIncome * rule.savings;

    document.getElementById("rule-needs").textContent = formatCurrency(needs);
    document.getElementById("rule-wants").textContent = formatCurrency(wants);
    document.getElementById("rule-savings").textContent = formatCurrency(savings);
}
