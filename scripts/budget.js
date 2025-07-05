// budget.js

// --- Global Variables ---
let currentLanguage = 'ko'; // Default language
let isDarkMode = false; // Default theme

let taxChart;
let expensesChart;
let budgetDistributionChart;
let preTaxDeductionsChart;
let postTaxDeductionsChart;

let customTaxes = [];
let customPreTaxDeductions = [];
let customPostTaxDeductions = [];
let customExpenses = [];

let grossSalary = 0; // 이 변수는 이제 월별 총 급여를 저장합니다.
let currentSalaryInput = 0; // 사용자가 입력한 raw 값 (monthly, annually 등 기준)
let currentSalaryFrequency = 'monthly'; // 사용자가 선택한 급여 주기

// --- DOM Elements ---
const grossSalaryInput = document.getElementById('salary-gross');
const salaryFrequencySelect = document.getElementById('salary-frequency-select');
const grossSalarySummaryDisplay = document.getElementById('gross-salary-summary-display'); // HTML에 이 ID가 있는지 확인 및 추가 필요
const annualSalarySummaryDisplay = document.getElementById('annual-salary-summary-display');

// 추가: default-item-frequency-select 도 로드될 수 있도록 추가
const defaultItemFrequencySelect = document.getElementById('default-item-frequency-select');


const totalTaxesDisplay = document.getElementById('total-taxes-display');
const totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
const totalPostTaxDisplay = document.getElementById('total-post-tax-display');
const netSalaryDisplay = document.getElementById('net-salary-display');
const totalExpensesDisplay = document.getElementById('total-expenses-display');
const remainingBudgetDisplay = document.getElementById('remaining-budget-display');

const languageToggleBtn = document.getElementById('language-toggle-btn');
const darkmodeToggleBtn = document.getElementById('darkmode-toggle-btn');

const exportJsonBtn = document.getElementById('export-json-btn');
const importJsonBtn = document.getElementById('import-json-btn');
const importJsonInput = document.getElementById('import-json-input'); // Hidden file input
const clearAllDataBtn = document.getElementById('clear-all-data-btn');
const aiReportBtn = document.getElementById('ai-report-btn');
const aiReportBox = document.getElementById('ai-report-box');

const budgetRuleSelect = document.getElementById('budget-rule-select');
const ruleNeedsDisplay = document.getElementById('rule-needs-display');
const ruleWantsDisplay = document.getElementById('rule-wants-display');
const ruleSavingsDisplay = document.getElementById('rule-savings-display');
const ruleTotalDisplay = document.getElementById('rule-total-display');
const actualNeedsDisplay = document.getElementById('actual-needs-display');
const actualWantsDisplay = document.getElementById('actual-wants-display');
const actualSavingsDisplay = document.getElementById('actual-savings-display');
const actualTotalDisplay = document.getElementById('actual-total-display');
const budgetStatusDisplay = document.getElementById('budget-status-display');


// IMPORTANT: Ensure these IDs match your HTML input element IDs exactly.
// If your HTML IDs end with '-1', you must include them here.
const taxInputs = {
    federal: document.getElementById('tax-federal-1'), // Assuming HTML ID is 'tax-federal-1'
    state: document.getElementById('tax-state-1'),     // Assuming HTML ID is 'tax-state-1'
    oasdi: document.getElementById('tax-oasdi-1'),     // Assuming HTML ID is 'tax-oasdi-1'
    medicare: document.getElementById('tax-medicare-1'), // Assuming HTML ID is 'tax-medicare-1'
    casdi: document.getElementById('tax-casdi-1')      // Assuming HTML ID is 'tax-casdi-1'
};
const customTaxList = document.getElementById('tax-custom-list');

const preTaxDeductInputs = {
    medical: document.getElementById('deduct-medical-1'),
    dental: document.getElementById('deduct-dental-1'),
    vision: document.getElementById('deduct-vision-1'),
    trad401k: document.getElementById('deduct-401k-trad-1')
};
const customPreTaxDeductList = document.getElementById('pre-tax-custom-list');

const postTaxDeductInputs = {
    spp: document.getElementById('deduct-spp-1'),
    adnd: document.getElementById('deduct-adnd-1'),
    roth401k: document.getElementById('deduct-401k-roth-1'),
    ltd: document.getElementById('deduct-ltd-1')
};
const customPostTaxDeductList = document.getElementById('post-tax-custom-list');

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
const customExpenseList = document.getElementById('expenses-custom-list');


// --- Utility Functions ---

// Currency Formatting
function formatCurrency(amount) {
    // 한국어 (ko-KR) 또는 영어 (en-US)에 따라 통화 형식을 설정합니다.
    const locale = currentLanguage === 'ko' ? 'ko-KR' : 'en-US';
    const currency = currentLanguage === 'ko' ? 'KRW' : 'USD';

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0, // 소수점 이하 자리수를 0으로 설정
        maximumFractionDigits: 0  // 소수점 이하 자리수를 0으로 설정 (반올림됨)
    }).format(amount);
}

// Get Total from input fields and custom items
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

// Add Custom Item
function addCustomItem(list, type, name, amount, category = '') { // category 인자 추가
    list.push({ name, amount, category }); // category도 함께 저장
    updateDisplay();
    saveData();
}

// Remove Custom Item
function removeCustomItem(list, index) {
    list.splice(index, 1);
    updateDisplay();
    saveData();
}

// Render Custom Item List
function renderCustomList(container, items, type) {
    container.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name}: ${formatCurrency(item.amount)}</span>
            <button class="remove-btn" data-type="${type}" data-index="${index}">${translations[currentLanguage].button_remove}</button>
        `;
        container.appendChild(li);
    });
}

// --- Chart Initialization & Update (using Chart.js) ---
const chartColorPalettes = {
    light: {
        taxes: [
            'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)'
        ],
        expenses: [
            'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
            'rgba(200, 100, 200, 0.7)', 'rgba(100, 200, 200, 0.7)', 'rgba(200, 200, 100, 0.7)',
            'rgba(100, 100, 200, 0.7)'
        ],
        preTax: [
            'rgba(100, 180, 250, 0.7)', 'rgba(250, 100, 180, 0.7)', 'rgba(180, 250, 100, 0.7)',
            'rgba(100, 250, 180, 0.7)'
        ],
        postTax: [
            'rgba(250, 180, 100, 0.7)', 'rgba(180, 100, 250, 0.7)', 'rgba(100, 250, 100, 0.7)',
            'rgba(250, 100, 100, 0.7)'
        ],
        budgetDistribution: {
            taxes: 'rgba(255, 99, 132, 0.7)',
            preTaxDeductions: 'rgba(54, 162, 235, 0.7)',
            postTaxDeductions: 'rgba(75, 192, 192, 0.7)',
            expenses: 'rgba(255, 159, 64, 0.7)',
            remainingBudget: 'rgba(153, 102, 255, 0.7)',
            deficit: 'rgba(255, 0, 0, 0.7)' // Red for deficit
        }
    },
    dark: {
        taxes: [
            'rgba(255, 99, 132, 0.9)', 'rgba(54, 162, 235, 0.9)', 'rgba(255, 206, 86, 0.9)',
            'rgba(75, 192, 192, 0.9)', 'rgba(153, 102, 255, 0.9)', 'rgba(255, 159, 64, 0.9)'
        ],
        expenses: [
            'rgba(255, 99, 132, 0.9)', 'rgba(54, 162, 235, 0.9)', 'rgba(255, 206, 86, 0.9)',
            'rgba(75, 192, 192, 0.9)', 'rgba(153, 102, 255, 0.9)', 'rgba(255, 159, 64, 0.9)',
            'rgba(200, 100, 200, 0.9)', 'rgba(100, 200, 200, 0.9)', 'rgba(200, 200, 100, 0.9)',
            'rgba(100, 100, 200, 0.9)'
        ],
        preTax: [
            'rgba(100, 180, 250, 0.9)', 'rgba(250, 100, 180, 0.9)', 'rgba(180, 250, 100, 0.9)',
            'rgba(100, 250, 180, 0.9)'
        ],
        postTax: [
            'rgba(250, 180, 100, 0.9)', 'rgba(180, 100, 250, 0.9)', 'rgba(100, 250, 100, 0.9)',
            'rgba(250, 100, 100, 0.9)'
        ],
        budgetDistribution: {
            taxes: 'rgba(255, 99, 132, 0.9)',
            preTaxDeductions: 'rgba(54, 162, 235, 0.9)',
            postTaxDeductions: 'rgba(75, 192, 192, 0.9)',
            expenses: 'rgba(255, 159, 64, 0.9)',
            remainingBudget: 'rgba(153, 102, 255, 0.9)',
            deficit: 'rgba(255, 0, 0, 0.9)' // Red for deficit
        }
    }
};

function initializeCharts() {
    const chartTextColor = getComputedStyle(document.body).getPropertyValue('--chart-text-color');
    const chartGridColor = getComputedStyle(document.body).getPropertyValue('--chart-grid-color');
    const chartTaxBarColor = getComputedStyle(document.body).getPropertyValue('--chart-tax-bar-color');

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: chartTextColor
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += formatCurrency(context.parsed.y);
                        } else if (context.parsed !== null) { // For pie/doughnut charts
                             label += formatCurrency(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: { color: chartTextColor },
                grid: { color: chartGridColor }
            },
            y: {
                ticks: { color: chartTextColor },
                grid: { color: chartGridColor }
            }
        }
    };

    const pieDoughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: chartTextColor
                }
            },
            tooltip: commonOptions.plugins.tooltip // Use the same tooltip formatting
        }
    };

    // Destroy existing chart instances if they exist
    if (taxChart) taxChart.destroy();
    if (expensesChart) expensesChart.destroy();
    if (budgetDistributionChart) budgetDistributionChart.destroy();
    if (preTaxDeductionsChart) preTaxDeductionsChart.destroy();
    if (postTaxDeductionsChart) postTaxDeductionsChart.destroy();

    const taxCtx = document.getElementById('taxChart').getContext('2d');
    taxChart = new Chart(taxCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: chartTaxBarColor, // Single color for bar charts, dynamically set
                borderColor: chartTaxBarColor,
                borderWidth: 1
            }]
        },
        options: commonOptions
    });

    const expensesCtx = document.getElementById('expensesChart').getContext('2d');
    expensesChart = new Chart(expensesCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: chartColorPalettes[isDarkMode ? 'dark' : 'light'].expenses, // Dynamic palette
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        },
        options: pieDoughnutOptions
    });

    const budgetDistributionCtx = document.getElementById('budgetDistributionChart').getContext('2d');
    budgetDistributionChart = new Chart(budgetDistributionCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: [], // Set dynamically in updateCharts
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        },
        options: pieDoughnutOptions
    });

    const preTaxDeductionsCtx = document.getElementById('preTaxDeductionsChart').getContext('2d');
    preTaxDeductionsChart = new Chart(preTaxDeductionsCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: chartColorPalettes[isDarkMode ? 'dark' : 'light'].preTax, // Dynamic palette
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        },
        options: pieDoughnutOptions
    });

    const postTaxDeductionsCtx = document.getElementById('postTaxDeductionsChart').getContext('2d');
    postTaxDeductionsChart = new Chart(postTaxDeductionsCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                label: '',
                data: [],
                backgroundColor: chartColorPalettes[isDarkMode ? 'dark' : 'light'].postTax, // Dynamic palette
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        },
        options: pieDoughnutOptions
    });
}


function updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions) {
    // Current palette based on theme
    const currentPalette = isDarkMode ? chartColorPalettes.dark : chartColorPalettes.light;

    // Update Tax Chart
    const taxLabels = [];
    const taxData = [];
    for (const key in taxInputs) {
        // Ensure taxInputs[key] exists before accessing .value
        const value = taxInputs[key] ? (parseFloat(taxInputs[key].value) || 0) : 0;
        if (value > 0) {
            // Ensure previousElementSibling exists before accessing textContent
            const labelText = taxInputs[key] && taxInputs[key].previousElementSibling ? taxInputs[key].previousElementSibling.textContent : key;
            taxLabels.push(labelText);
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
        // Ensure expenseInputs[key] exists before accessing .value
        const value = expenseInputs[key] ? (parseFloat(expenseInputs[key].value) || 0) : 0;
        if (value > 0) {
            // Ensure previousElementSibling exists before accessing textContent
            const labelText = expenseInputs[key] && expenseInputs[key].previousElementSibling ? expenseInputs[key].previousElementSibling.textContent : key;
            expenseLabels.push(labelText);
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
    expensesChart.data.datasets[0].backgroundColor = currentPalette.expenses;
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
    const budgetColors = [
        currentPalette.budgetDistribution.taxes,
        currentPalette.budgetDistribution.preTaxDeductions,
        currentPalette.budgetDistribution.postTaxDeductions,
        currentPalette.budgetDistribution.expenses,
        currentPalette.budgetDistribution.remainingBudget
    ];
    if (remainingBudget < 0) {
        budgetColors[4] = currentPalette.budgetDistribution.deficit;
        budgetData[4] = Math.abs(remainingBudget);
        budgetLabels[4] = translations[currentLanguage].label_deficit || 'Deficit';
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
        const value = preTaxDeductInputs[key] ? (parseFloat(preTaxDeductInputs[key].value) || 0) : 0;
        if (value > 0) {
            const labelText = preTaxDeductInputs[key] && preTaxDeductInputs[key].previousElementSibling ? preTaxDeductInputs[key].previousElementSibling.textContent : key;
            preTaxDeductLabels.push(labelText);
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
    preTaxDeductionsChart.data.datasets[0].backgroundColor = currentPalette.preTax;
    preTaxDeductionsChart.update();

    // Update Post-Tax Deductions Chart
    const postTaxDeductLabels = [];
    const postTaxDeductData = [];
    for (const key in postTaxDeductInputs) {
        const value = postTaxDeductInputs[key] ? (parseFloat(postTaxDeductInputs[key].value) || 0) : 0;
        if (value > 0) {
            const labelText = postTaxDeductInputs[key] && postTaxDeductInputs[key].previousElementSibling ? postTaxDeductInputs[key].previousElementSibling.textContent : key;
            postTaxDeductLabels.push(labelText);
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
    postTaxDeductionsChart.data.datasets[0].backgroundColor = currentPalette.postTax;
    postTaxDeductionsChart.update();

    // Update chart text color based on dark mode
    const chartTextColor = getComputedStyle(document.body).getPropertyValue('--chart-text-color');
    const chartGridColor = getComputedStyle(document.body).getPropertyValue('--chart-grid-color');
    const chartTaxBarColor = getComputedStyle(document.body).getPropertyValue('--chart-tax-bar-color'); // Re-fetch for safety

    [taxChart, expensesChart, budgetDistributionChart, preTaxDeductionsChart, postTaxDeductionsChart].forEach(chart => {
        if (chart) { // Ensure chart object exists
            if (chart.options && chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = chartTextColor;
            }
            // For bar charts (taxChart), ensure scales exist
            if (chart.options && chart.options.scales) {
                if (chart.options.scales.x) {
                    chart.options.scales.x.ticks.color = chartTextColor;
                    chart.options.scales.x.grid.color = chartGridColor;
                }
                if (chart.options.scales.y) {
                    chart.options.scales.y.ticks.color = chartTextColor;
                    chart.options.scales.y.grid.color = chartGridColor;
                }
            }

            // Update tax chart's bar color specifically
            if (chart === taxChart && chart.data.datasets.length > 0) {
                chart.data.datasets[0].backgroundColor = chartTaxBarColor;
                chart.data.datasets[0].borderColor = chartTaxBarColor;
            }
            chart.update(); // Re-render the chart after options change
        }
    });
}


// --- Display and Calculation Logic ---
function updateDisplay() {
    currentSalaryInput = parseFloat(grossSalaryInput.value) || 0;
    currentSalaryFrequency = salaryFrequencySelect.value;

    let monthlyGrossSalary = 0;
    let annualGrossSalary = 0;

    switch (currentSalaryFrequency) {
        case 'monthly':
            monthlyGrossSalary = currentSalaryInput;
            annualGrossSalary = currentSalaryInput * 12;
            break;
        case 'annually':
            annualGrossSalary = currentSalaryInput;
            monthlyGrossSalary = currentSalaryInput / 12;
            break;
        case 'weekly':
            annualGrossSalary = currentSalaryInput * 52;
            monthlyGrossSalary = annualGrossSalary / 12;
            break;
        case 'bi-weekly':
            annualGrossSalary = currentSalaryInput * 26;
            monthlyGrossSalary = annualGrossSalary / 12;
            break;
        default:
            monthlyGrossSalary = 0;
            annualGrossSalary = 0;
            break;
    }

    grossSalary = monthlyGrossSalary; // The global 'grossSalary' is now always monthly

    // UI Update for gross salary summaries
    if (grossSalarySummaryDisplay) { // Null check for grossSalarySummaryDisplay
        grossSalarySummaryDisplay.textContent = formatCurrency(monthlyGrossSalary);
    }
    if (annualSalarySummaryDisplay) { // Null check for annualSalarySummaryDisplay
        annualSalarySummaryDisplay.textContent = formatCurrency(annualGrossSalary);
    }

    const totalTaxes = getTotal(taxInputs, customTaxes);
    if (totalTaxesDisplay) totalTaxesDisplay.textContent = formatCurrency(totalTaxes);

    const totalPreTaxDeductions = getTotal(preTaxDeductInputs, customPreTaxDeductions);
    if (totalPreTaxDisplay) totalPreTaxDisplay.textContent = formatCurrency(totalPreTaxDeductions);

    const totalPostTaxDeductions = getTotal(postTaxDeductInputs, customPostTaxDeductions);
    if (totalPostTaxDisplay) totalPostTaxDisplay.textContent = formatCurrency(totalPostTaxDeductions);

    const netSalary = grossSalary - totalTaxes - totalPreTaxDeductions - totalPostTaxDeductions;
    if (netSalaryDisplay) netSalaryDisplay.textContent = formatCurrency(netSalary);

    const totalExpenses = getTotal(expenseInputs, customExpenses);
    if (totalExpensesDisplay) totalExpensesDisplay.textContent = formatCurrency(totalExpenses);

    const remainingBudget = netSalary - totalExpenses;
    if (remainingBudgetDisplay) {
        remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);
        remainingBudgetDisplay.style.color = remainingBudget >= 0 ? 'var(--summary-text-color)' : 'var(--danger-color)';
    }

    // Update charts with new data
    updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions);

    renderCustomList(customTaxList, customTaxes, 'tax');
    renderCustomList(customPreTaxDeductList, customPreTaxDeductions, 'pre-tax');
    renderCustomList(customPostTaxDeductList, customPostTaxDeductions, 'post-tax');
    renderCustomList(customExpenseList, customExpenses, 'expense');

    applyBudgetRule(grossSalary, totalExpenses, netSalary, totalPreTaxDeductions + totalPostTaxDeductions);
}

// --- Data Persistence ---
function saveData() {
    const data = {
        grossSalaryInput: grossSalaryInput.value,
        currentSalaryFrequency: currentSalaryFrequency,
        defaultItemFrequency: defaultItemFrequencySelect ? defaultItemFrequencySelect.value : 'monthly', // Save default item frequency if element exists
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
    console.log('Data saved.');
}

function loadData() {
    const data = JSON.parse(localStorage.getItem('budgetAppData'));
    if (data) {
        if (grossSalaryInput) grossSalaryInput.value = data.grossSalaryInput || 0;
        if (salaryFrequencySelect) {
            currentSalaryFrequency = data.currentSalaryFrequency || 'monthly';
            salaryFrequencySelect.value = currentSalaryFrequency;
        }
        if (defaultItemFrequencySelect && data.defaultItemFrequency) {
            defaultItemFrequencySelect.value = data.defaultItemFrequency;
        }

        for (const key in taxInputs) {
            if (taxInputs[key]) taxInputs[key].value = data.taxInputs[key] || 0;
        }
        customTaxes = data.customTaxes || [];

        for (const key in preTaxDeductInputs) {
            if (preTaxDeductInputs[key]) preTaxDeductInputs[key].value = data.preTaxDeductInputs[key] || 0;
        }
        customPreTaxDeductions = data.customPreTaxDeductions || [];

        for (const key in postTaxDeductInputs) {
            if (postTaxDeductInputs[key]) postTaxDeductInputs[key].value = data.postTaxDeductInputs[key] || 0;
        }
        customPostTaxDeductions = data.customPostTaxDeductions || [];

        for (const key in expenseInputs) {
            if (expenseInputs[key]) expenseInputs[key].value = data.expenseInputs[key] || 0;
        }
        customExpenses = data.customExpenses || [];

        currentLanguage = data.currentLanguage || 'ko';
        isDarkMode = data.isDarkMode === true;
    }
    applyLanguage(currentLanguage);
    applyDarkMode(isDarkMode); // applyDarkMode at the end of loadData to ensure theme is applied after initialization
    updateDisplay(); // Update displays with loaded data (including charts)
    console.log('Data loaded.');
}


// --- Language & Dark Mode ---
// Assume 'translations' object is defined globally or imported
const translations = {
    'ko': {
        // --- General Labels ---
        app_title: "예산 관리기",
        section_gross_salary_title: "총 급여",
        salary_input_label: "월별/연간 총 급여:",
        salary_frequency_label: "급여 주기:",
        monthly_frequency: "월별",
        annually_frequency: "연간",
        weekly_frequency: "주별",
        bi_weekly_frequency: "격주",
        annual_summary_label: "연간 총 급여:",
        monthly_summary_label: "월별 총 급여:",

        section_taxes_title: "세금",
        section_pre_tax_title: "세전 공제",
        section_post_tax_title: "세후 공제",
        section_expenses_title: "지출",
        section_summary_title: "요약",
        section_data_management_title: "데이터 관리",

        label_total_taxes: "총 세금",
        label_total_pre_tax: "총 세전 공제",
        label_total_post_tax: "총 세후 공제",
        label_net_salary: "실수령액",
        label_total_expenses: "총 지출",
        label_remaining_budget: "남은 예산",
        label_deficit: "적자", // Added for deficit in charts

        button_add_custom: "항목 추가",
        button_remove: "삭제",
        placeholder_item_name: "항목 이름",
        placeholder_amount: "금액",
        remove_item: "이 항목을 삭제하시겠습니까",

        // --- Budget Rule Section ---
        budget_rule_title: "예산 규칙",
        budget_rule_select_label: "예산 규칙 선택:",
        rule_50_30_20: "50/30/20 규칙 (필수/선택/저축)",
        rule_70_20_10: "70/20/10 규칙 (필수/선택/저축)",
        rule_80_20: "80/20 규칙 (필수/저축)",
        needs_label: "필수 지출",
        wants_label: "선택 지출",
        savings_label: "저축",
        total_budget_label: "총 예산",
        budget_status_label: "예산 상태",
        rule_label: "규칙:",
        actual_label: "실제:",
        status_ok: "양호",
        status_over: "초과",
        status_warning: "경고",
        status_under: "부족",

        // --- Data Management Buttons ---
        button_export_json: "JSON 내보내기",
        button_import_json: "JSON 가져오기",
        button_clear_all_data: "모든 데이터 지우기",
        button_ai_report: "AI 보고서 생성",
        ai_report_placeholder: "AI 보고서가 여기에 표시됩니다. (통합 예정)"
    },
    'en': {
        // --- General Labels ---
        app_title: "Budget Manager",
        section_gross_salary_title: "Gross Salary",
        salary_input_label: "Monthly/Annual Gross Salary:",
        salary_frequency_label: "Salary Frequency:",
        monthly_frequency: "Monthly",
        annually_frequency: "Annually",
        weekly_frequency: "Weekly",
        bi_weekly_frequency: "Bi-Weekly",
        annual_summary_label: "Annual Gross Salary:",
        monthly_summary_label: "Monthly Gross Salary:",

        section_taxes_title: "Taxes",
        section_pre_tax_title: "Pre-Tax Deductions",
        section_post_tax_title: "Post-Tax Deductions",
        section_expenses_title: "Expenses",
        section_summary_title: "Summary",
        section_data_management_title: "Data Management",

        label_total_taxes: "Total Taxes",
        label_total_pre_tax: "Total Pre-Tax Deductions",
        label_total_post_tax: "Total Post-Tax Deductions",
        label_net_salary: "Net Salary",
        label_total_expenses: "Total Expenses",
        label_remaining_budget: "Remaining Budget",
        label_deficit: "Deficit",

        button_add_custom: "Add Item",
        button_remove: "Remove",
        placeholder_item_name: "Item Name",
        placeholder_amount: "Amount",
        remove_item: "Are you sure you want to remove this item",

        // --- Budget Rule Section ---
        budget_rule_title: "Budget Rule",
        budget_rule_select_label: "Select Budget Rule:",
        rule_50_30_20: "50/30/20 Rule (Needs/Wants/Savings)",
        rule_70_20_10: "70/20/10 Rule (Needs/Wants/Savings)",
        rule_80_20: "80/20 Rule (Needs/Savings)",
        needs_label: "Needs",
        wants_label: "Wants",
        savings_label: "Savings",
        total_budget_label: "Total Budget",
        budget_status_label: "Budget Status",
        rule_label: "Rule:",
        actual_label: "Actual:",
        status_ok: "On Track",
        status_over: "Over Budget",
        status_warning: "Warning",
        status_under: "Under Budget",

        // --- Data Management Buttons ---
        button_export_json: "Export JSON",
        button_import_json: "Import JSON",
        button_clear_all_data: "Clear All Data",
        button_ai_report: "Generate AI Report",
        ai_report_placeholder: "AI Report will appear here. (Integration pending)"
    }
};

function applyLanguage(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-i18n-key]').forEach(element => {
        const key = element.dataset.i18nKey;
        if (translations[currentLanguage][key]) {
            element.textContent = translations[currentLanguage][key];
        }
    });

    // Translate specific elements that might not have data-i18n-key
    // Null checks added for safety
    if (document.querySelector('.budget-section h2')) document.querySelector('.budget-section h2').textContent = translations[currentLanguage].budget_rule_title;
    if (document.querySelector('label[for="budget-rule-select"]')) document.querySelector('label[for="budget-rule-select"]').textContent = translations[currentLanguage].budget_rule_select_label;

    // Update option texts in the select dropdown
    if (budgetRuleSelect) {
        const options = budgetRuleSelect.options;
        for (let i = 0; i < options.length; i++) {
            const value = options[i].value.replace(/-/g, '_'); // Convert "50-30-20" to "50_30_20" for translation key
            if (translations[currentLanguage][`rule_${value}`]) {
                options[i].textContent = translations[currentLanguage][`rule_${value}`];
            }
        }
    }

    // Update breakdown item labels
    if (document.querySelector('.breakdown-item:nth-child(1) p:nth-child(1)')) document.querySelector('.breakdown-item:nth-child(1) p:nth-child(1)').textContent = translations[currentLanguage].needs_label;
    if (document.querySelector('.breakdown-item:nth-child(2) p:nth-child(1)')) document.querySelector('.breakdown-item:nth-child(2) p:nth-child(1)').textContent = translations[currentLanguage].wants_label;
    if (document.querySelector('.breakdown-item:nth-child(3) p:nth-child(1)')) document.querySelector('.breakdown-item:nth-child(3) p:nth-child(1)').textContent = translations[currentLanguage].savings_label;
    if (document.querySelector('.breakdown-item.total p:nth-child(1)')) document.querySelector('.breakdown-item.total p:nth-child(1)').textContent = translations[currentLanguage].total_budget_label;
    if (document.querySelector('.breakdown-item.status p:nth-child(1)')) document.querySelector('.breakdown-item.status p:nth-child(1)').textContent = translations[currentLanguage].budget_status_label;


    document.querySelectorAll('.rule-breakdown .breakdown-item p').forEach(pElement => {
        // const spanElement = pElement.querySelector('span[id]'); // This was problematic, removed reliance on it.

        // Check text content and update only the text node if it's the first child
        if (pElement.firstChild && pElement.firstChild.nodeType === Node.TEXT_NODE) {
            const originalText = pElement.firstChild.nodeValue.trim();
            if (originalText.includes('규칙') || originalText.includes('Rule')) {
                pElement.firstChild.nodeValue = translations[currentLanguage].rule_label + ' ';
            } else if (originalText.includes('실제') || originalText.includes('Actual')) {
                pElement.firstChild.nodeValue = translations[currentLanguage].actual_label + ' ';
            }
        }
    });

    const budgetStatusP = document.querySelector('.breakdown-item.status p:nth-child(1)');
    if (budgetStatusP) {
        budgetStatusP.textContent = translations[currentLanguage].budget_status_label;
    }


    if (languageToggleBtn) languageToggleBtn.textContent = currentLanguage === 'ko' ? 'EN' : 'KO';
    updateDisplay(); // Recalculate and update displays with new language
}

function applyDarkMode(enable) {
    isDarkMode = enable;
    if (document.body) { // Ensure body exists
        if (enable) {
            document.body.classList.add('dark-mode');
            if (darkmodeToggleBtn) darkmodeToggleBtn.innerHTML = '<i class="ri-sun-line"></i>'; // Sun icon for light mode
        } else {
            document.body.classList.remove('dark-mode');
            if (darkmodeToggleBtn) darkmodeToggleBtn.innerHTML = '<i class="ri-moon-line"></i>'; // Moon icon for dark mode
        }
    }
    initializeCharts(); // Re-initialize chart instances to apply new theme colors
    updateDisplay(); // Update all values and charts
}


// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts(); // Ensure chart canvases exist and chart instances are initialized
    loadData(); // Load saved data (includes applyDarkMode and updateDisplay)

    // Input Change Listeners for number inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            updateDisplay();
            saveData();
        });
    });

    // Salary Frequency Select Listener
    if (salaryFrequencySelect) {
        salaryFrequencySelect.addEventListener('change', () => {
            updateDisplay();
            saveData();
        });
    }

    // Default Item Frequency Select Listener (if implemented)
    if (defaultItemFrequencySelect) {
        defaultItemFrequencySelect.addEventListener('change', () => {
            // No direct impact on calculations in updateDisplay, but might affect how new custom items are handled.
            // For now, just save data.
            saveData();
        });
    }


    // Form Submission Listener
    if (document.getElementById('salary-form')) {
        document.getElementById('salary-form').addEventListener('submit', (e) => {
            e.preventDefault();
            updateDisplay();
            saveData();
        });
    }

    // Add Custom Item Buttons
    document.querySelectorAll('.add-custom-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.target.dataset.type;
            const customName = prompt(translations[currentLanguage].placeholder_item_name + ':');
            if (customName === null || customName.trim() === '') { // Prompt cancelled or empty name
                alert(translations[currentLanguage].placeholder_item_name + ' cannot be empty.');
                return;
            }

            let customAmount = prompt(translations[currentLanguage].placeholder_amount + ':');
            if (customAmount === null) return;
            customAmount = parseFloat(customAmount);

            if (isNaN(customAmount) || customAmount < 0) {
                alert('Please enter a valid positive number for amount.');
                return;
            }

            let category = ''; // Default category
            if (type === 'expense') {
                const expenseCategory = prompt(translations[currentLanguage].needs_label + ' (N) or ' + translations[currentLanguage].wants_label + ' (W)?').toLowerCase();
                if (expenseCategory === 'n') {
                    category = 'needs';
                } else if (expenseCategory === 'w') {
                    category = 'wants';
                } else {
                    alert('Invalid category. Defaulting to Needs.');
                    category = 'needs'; // Default to 'needs' if invalid input
                }
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
                    addCustomItem(customExpenses, type, customName, customAmount, category); // Pass category
                    break;
            }
        });
    });

    // Remove Custom Item Buttons (Event Delegation)
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
                isDarkMode: isDarkMode
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
            alert('예산 데이터가 성공적으로 내보내졌습니다!');
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
                            loadData();
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
    }


    // Data Management: Clear All Data
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', () => {
            if (confirm('모든 저장된 데이터를 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
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

                updateDisplay();
                alert('모든 데이터가 지워졌습니다.');
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

const BUDGET_RULES = {
    "50-30-20": { needs: 0.5, wants: 0.3, savings: 0.2 },
    "70-20-10": { needs: 0.7, wants: 0.2, savings: 0.1 },
    "80-20": { needs: 0.8, wants: 0.0, savings: 0.2 } // 80/20 rule often implies 0 wants
};

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

    // 1. Calculate budget based on the rule
    const ruleNeeds = grossIncome * rule.needs;
    const ruleWants = grossIncome * rule.wants;
    const ruleSavings = grossIncome * rule.savings;
    const ruleTotal = ruleNeeds + ruleWants + ruleSavings;

    ruleNeedsDisplay.textContent = formatCurrency(ruleNeeds);
    ruleWantsDisplay.textContent = formatCurrency(ruleWants);
    ruleSavingsDisplay.textContent = formatCurrency(ruleSavings);
    ruleTotalDisplay.textContent = formatCurrency(ruleTotal);

    // 2. Calculate actual spending based on user inputs
    // This part requires careful consideration if you want a strict Needs/Wants/Savings breakdown.
    // For now, it assumes a simplified classification or requires custom items to have a 'category'.

    let actualNeeds = 0;
    let actualWants = 0;

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
            // If category is not specified, default to needs
            actualNeeds += item.amount;
        }
    });

    // Actual Savings: Net salary minus all expenses
    const actualSavings = netSalary - (actualNeeds + actualWants); // Note: totalExpenses might be different if category not applied to all

    actualNeedsDisplay.textContent = formatCurrency(actualNeeds);
    actualWantsDisplay.textContent = formatCurrency(actualWants);
    actualSavingsDisplay.textContent = formatCurrency(actualSavings);

    // Actual total budget: This should ideally be equal to grossIncome
    actualTotalDisplay.textContent = formatCurrency(grossIncome);

    // 3. Evaluate budget status
    let statusText = "";
    let statusColor = "var(--summary-text-color)"; // Default to positive color

    const currentTotalExpenses = actualNeeds + actualWants;

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

    // Overall deficit check
    if (netSalary - currentTotalExpenses < 0) {
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
