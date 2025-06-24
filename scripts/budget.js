document.addEventListener('DOMContentLoaded', () => {
    // --- IMPORTANT: Register Chart.js plugins ---
    // This is crucial for datalabels to appear on charts.
    // Ensure Chart.js and ChartDataLabels are loaded from HTML before this point.
    Chart.register(ChartDataLabels);

    // --- STATE MANAGEMENT ---
    let state = {
        language: 'ko',
        income: 0,
        taxes: [], // { id, name, amount }
        preTax: [],
        postTax: [],
        expenses: [], // { id, category, name, amount }
        expenseCategories: ['주거', '교통', '식비', '생활', '오락', '기타'],
    };

    // --- TRANSLATIONS (i18n) ---
    const translations = {
        ko: {
            'app-title': '💰 예산 관리 시스템 (USD)', 'income-title': '월급', 'income-label': '세전 월급액 ($)', 
            'tax-title': '세금', 'tax-type-label': '세금 종류', 'tax-select-placeholder': '세금 종류 선택', 'tax-option-custom': '직접 입력', 'tax_custom_name_placeholder': '세금 항목명 입력', 'tax-amount-placeholder': '금액 ($)', 'tax-add-button': '추가', 'tax-update-button': '업데이트', 'tax-cancel-button': '취소', 
            'pre-tax-title': '세전 공제', 'pre-tax-type-label': '공제 항목', 'pre-tax-select-placeholder': '공제 항목 선택', 'pre-tax-option-custom': '직접 입력', 'pre_tax_custom_name_placeholder': '공제 항목명 입력', 'pre-tax-amount-placeholder': '금액 ($)', 'pre-tax-add-button': '추가', 'pre-tax-update-button': '업데이트', 'pre-tax-cancel-button': '취소', 
            'post-tax-title': '세후 공제', 'post-tax-type-label': '공제 항목', 'post-tax-select-placeholder': '공제 항목 선택', 'post-tax-option-custom': '직접 입력', 'post_tax_custom_name_placeholder': '공제 항목명 입력', 'post-tax-amount-placeholder': '금액 ($)', 'post-tax-add-button': '추가', 'post-tax-update-button': '업데이트', 'post-tax-cancel-button': '취소',
            'expense-management-title': '지출 관리', 'category-label': '카테고리', 'expense-name-label': '항목명', 'expense-name-placeholder': '예: 월세', 'expense-amount-label': '금액', 
            'new-category-placeholder': '새 카테고리명 입력', 'add-category-button': '카테고리 추가', 'add-expense-button': '지출 추가', 'update-expense-button': '지출 업데이트', 'cancel-expense-button': '취소',
            'monthly-financial-status-title': '📊 월별 재무 현황', 'financial-analysis-chart-title': '📈 재무 분석 차트', 'income-flow-chart-title': '자금 흐름 배분 (총 수입 대비)', 'expense-category-chart-title': '지출 카테고리별 비중 (총 지출 대비)', 
            'save-button': '💾 저장하기', 'load-button': '📂 불러오기', 'print-button': '🖨️ 인쇄하기', 'reset-button': '🔄 초기화',
            gross_income_label: "세전 월급 (총 수입)", pre_tax_deductions_label: "세전 공제", taxable_income_label: "과세 소득", tax_total_label: "세금", post_tax_deductions_label: "세후 공제", total_deductions_taxes_label: "총 공제 및 세금", net_income_label: "순수입 (실수령액)", 
            total_expenses_card_label: "총 지출", total_expenses_card_sub: "(순수입에서 사용)", remaining_balance_card_label: "남은 잔액", remaining_balance_card_sub: "(저축/투자 가능)", expenses_percentage_text: "총 수입의", remaining_percentage_text: "총 수입의",
            alert_valid_amount: "올바른 금액을 입력하세요.", alert_custom_name: "사용자 지정 항목의 이름을 입력하세요.", alert_item_exists: "' 이미 이 카테고리에 존재합니다.", alert_fill_all_fields: "모든 지출 필드를 올바른 데이터로 채우세요.", alert_category_exists: "카테고리가 이미 존재합니다.",
            confirm_reset: "모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.", alert_data_saved: "데이터가 성공적으로 저장되었습니다.", alert_save_failed: "데이터 저장에 실패했습니다.", alert_data_loaded: "데이터를 성공적으로 불러왔습니다.", alert_load_failed: "데이터 불러오기에 실패했습니다. 데이터가 손상되었을 수 있습니다.", alert_no_data: "저장된 데이터가 없습니다.", alert_data_reset: "데이터가 초기화되었습니다.",
            confirm_delete_item: "정말로 이 항목을 삭제하시겠습니까?" 
        },
        en: {
            'app-title': '💰 Budget Management System (USD)', 'income-title': 'Salary', 'income-label': 'Gross Monthly Salary ($)', 
            'tax-title': 'Taxes', 'tax-type-label': 'Tax Type', 'tax-select-placeholder': 'Select tax type', 'tax-option-custom': 'Custom', 'tax_custom_name_placeholder': 'Enter tax name', 'tax-amount-placeholder': 'Amount ($)', 'tax-add-button': 'Add', 'tax-update-button': 'Update', 'tax-cancel-button': 'Cancel', 
            'pre-tax-title': 'Pre-Tax Deductions', 'pre-tax-type-label': 'Deduction Item', 'pre-tax-select-placeholder': 'Select deduction', 'pre-tax-option-custom': 'Custom', 'pre_tax_custom_name_placeholder': 'Enter deduction name', 'pre-tax-amount-placeholder': 'Amount ($)', 'pre-tax-add-button': 'Add', 'pre-tax-update-button': 'Update', 'pre-tax-cancel-button': 'Cancel', 
            'post-tax-title': 'Post-Tax Deductions', 'post-tax-type-label': 'Deduction Item', 'post-tax-select-placeholder': 'Select deduction', 'post-tax-option-custom': 'Custom', 'post_tax_custom_name_placeholder': 'Enter deduction name', 'post-tax-amount-placeholder': 'Amount ($)', 'post-tax-add-button': 'Add', 'post-tax-update-button': 'Update', 'post-tax-cancel-button': 'Cancel',
            'expense-management-title': 'Expense Management', 'category-label': 'Category', 'expense-name-label': 'Item Name', 'expense-name-placeholder': 'e.g., Rent', 'expense-amount-label': 'Amount', 
            'new-category-placeholder': 'Enter new category name', 'add-category-button': 'Add Category', 'add-expense-button': 'Add Expense', 'update-expense-button': 'Update Expense', 'cancel-expense-button': 'Cancel', 
            'monthly-financial-status-title': '📊 Monthly Financial Status', 'financial-analysis-chart-title': '📈 Financial Analysis Charts', 'income-flow-chart-title': 'Fund Flow Distribution (vs. Gross Income)', 'expense-category-chart-title': 'Expense Breakdown by Category (vs. Total Expenses)', 
            'save-button': '💾 Save', 'load-button': '📂 Load', 'print-button': '🖨️ Print', 'reset-button': '🔄 Reset',
            gross_income_label: "Gross Salary (Total Income)", pre_tax_deductions_label: "Pre-Tax Deductions", taxable_income_label: "Taxable Income", tax_total_label: "Taxes", post_tax_deductions_label: "Post-Tax Deductions", total_deductions_taxes_label: "Total Deductions & Taxes", net_income_label: "Net Income (Take-Home Pay)", 
            total_expenses_card_label: "Total Expenses", total_expenses_card_sub: "(spent from Net Income)", remaining_balance_card_label: "Remaining Balance", remaining_balance_card_sub: "(for Savings/Investments)", expenses_percentage_text: "of Gross Income", remaining_percentage_text: "of Gross Income",
            alert_valid_amount: "Please enter a valid amount.", alert_custom_name: "Please enter a name for the custom item.", alert_item_exists: "' already exists in this category.", alert_fill_all_fields: "Please fill all expense fields with valid data.", alert_category_exists: "Category already exists.",
            confirm_reset: "Are you sure you want to reset all data? This cannot be undone.", alert_data_saved: "Data saved successfully!", alert_save_failed: "Failed to save data.", alert_data_loaded: "Data loaded successfully!", alert_load_failed: "Failed to load data. It might be corrupted.", alert_no_data: "No saved data found.", alert_data_reset: "Data has been reset.",
            confirm_delete_item: "Are you sure you want to delete this item?"
        },
        zh: {
            'app-title': '💰 预算管理系统 (USD)', 'income-title': '薪水', 'income-label': '세전 월급액 ($)', 
            'tax-title': '세금', 'tax-type-label': '세종', 'tax-select-placeholder': '선택 세종', 'tax-option-custom': '自定义', 'tax_custom_name_placeholder': '输入税项名称', 'tax-amount-placeholder': '金額 ($)', 'tax-add-button': '添加', 'tax-update-button': '更新', 'tax-cancel-button': '取消', 
            'pre-tax-title': '세전 공제', 'pre-tax-type-label': '공제 항목', 'pre-tax-select-placeholder': '선택 공제 항목', 'pre-tax-option-custom': '自定义', 'pre_tax_custom_name_placeholder': '输入扣除名称', 'pre-tax-amount-placeholder': '金額 ($)', 'pre-tax-add-button': '添加', 'pre-tax-update-button': '更新', 'pre-tax-cancel-button': '取消', 
            'post-tax-title': '세후 공제', 'post-tax-type-label': '공제 항목', 'post-tax-select-placeholder': '선택 공제 항목', 'post-tax-option-custom': '自定义', 'post_tax_custom_name_placeholder': '输入扣除名称', 'post-tax-amount-placeholder': '金額 ($)', 'post-tax-add-button': '添加', 'post-tax-update-button': '更新', 'post-tax-cancel-button': '取消',
            'expense-management-title': '지출 관리', 'category-label': '类别', 'expense-name-label': '항목명', 'expense-name-placeholder': '예: 월세', 'expense-amount-label': '金額', 
            'new-category-placeholder': '输入新类别名称', 'add-category-button': '添加类别', 'add-expense-button': '添加支出', 'update-expense-button': '更新支出', 'cancel-expense-button': '取消', 
            'monthly-financial-status-title': '📊 每월 재무 현황', 'financial-analysis-chart-title': '📈 재무 분석 차트', 'income-flow-chart-title': '資金流分配 (與總收入相比)', 'expense-category-chart-title': '按类别划分的支出明细 (與總支出相比)', 
            'save-button': '💾 保存', 'load-button': '📂 加载', 'print-button': '🖨️ 인쇄하기', 'reset-button': '🔄 초기화',
            gross_income_label: "총薪수 (총收入)", pre_tax_deductions_label: "세전 공제", taxable_income_label: "应税收入", tax_total_label: "세금", post_tax_deductions_label: "세후 공제", total_deductions_taxes_label: "总 공제 및 세금", net_income_label: "净收入 (实得工资)", 
            total_expenses_card_label: "总支出", total_expenses_card_sub: "(从净收入中支出)", remaining_balance_card_label: "剩余余额", remaining_balance_card_sub: "(用於储蓄/投资)", expenses_percentage_text: "총收入의", remaining_percentage_text: "총收入의",
            alert_valid_amount: "请输入有效金額。", alert_custom_name: "请输入自定义项目的名称。", alert_item_exists: "' 已存在于此类别中。", alert_fill_all_fields: "请用有效数据填写所有费用字段。", alert_category_exists: "类别已存在。",
            confirm_reset: "您确定要重置所有数据吗？此操作无法撤销。", alert_data_saved: "数据保存成功！", alert_save_failed: "数据保存失败。", alert_data_loaded: "数据加载成功！", alert_load_failed: "加载数据失败。数据可能已损坏。", alert_no_data: "未找到保存的数据。", alert_data_reset: "数据已重置。",
            confirm_delete_item: "您确定要删除此项目吗？"
        },
    };

    // --- DOM SELECTORS ---
    const incomeInput = document.getElementById('income');
    const langSelect = document.getElementById('language-select');
    const categorySections = document.querySelectorAll('.card[data-category]');
    const addCategoryBtn = document.getElementById('add-category-button');
    const newCategoryInput = document.getElementById('new-category');
    const expenseCategorySelect = document.getElementById('category');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expensesListContainer = document.getElementById('expenses-list');
    const addExpenseBtn = document.getElementById('add-expense-button'); // Original "Add Expense" button
    let updateExpenseBtn = null; // New "Update Expense" button
    let cancelExpenseBtn = null; // New "Cancel Expense" button

    // Modal elements
    const customModalOverlay = document.getElementById('custom-modal-overlay');
    const modalMessage = document.getElementById('modal-message');
    const modalButtons = document.getElementById('modal-buttons');

    // --- CUSTOM MODAL FUNCTIONS ---
    // Displays an alert-style modal with a message and an "OK" button.
    const showAlertDialog = (message) => {
        return new Promise(resolve => {
            modalMessage.textContent = message;
            modalButtons.innerHTML = `<button class="modal-button alert-ok">OK</button>`;
            customModalOverlay.classList.add('active');

            modalButtons.querySelector('.alert-ok').onclick = () => {
                customModalOverlay.classList.remove('active');
                resolve();
            };
        });
    };

    // Displays a confirmation-style modal with a message and "Yes/No" buttons.
    const showConfirmDialog = (message) => {
        return new Promise(resolve => {
            modalMessage.textContent = message;
            modalButtons.innerHTML = `
                <button class="modal-button confirm-yes">Yes</button>
                <button class="modal-button confirm-no">No</button>
            `;
            customModalOverlay.classList.add('active');

            modalButtons.querySelector('.confirm-yes').onclick = () => {
                customModalOverlay.classList.remove('active');
                resolve(true);
            };
            modalButtons.querySelector('.confirm-no').onclick = () => {
                customModalOverlay.classList.remove('active');
                resolve(false);
            };
        });
    };

    // --- UTILITY FUNCTIONS ---
    // Formats a number as currency with two decimal places and commas.
    const formatCurrency = (amount) => (amount ? amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : '0.00');
    // Generates a unique ID for list items.
    const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // --- TRANSLATION FUNCTION ---
    // Sets the application language and updates all translatable elements.
    const setLanguage = (lang) => {
        state.language = lang;
        localStorage.setItem('budgetAppLang', lang); // Save language preference
        const t = translations[lang];

        // Update text content and placeholders for elements with matching IDs
        document.querySelectorAll('[id]').forEach(el => {
            const keyWithSuffix = el.id.replace(/-/g, '_'); // Convert hyphen-case ID to snake_case for potential translation keys
            const key = el.id.replace(/-label|-title|-button|-placeholder|-text|-sub|-card/g, ''); // Extract base key

            if (t[keyWithSuffix]) {
                el.innerHTML = t[keyWithSuffix];
            } else if (t[key]) {
                // For placeholders, ensure it's an input/textarea
                if (el.placeholder !== undefined) el.placeholder = t[key];
                else el.innerHTML = t[key];
            }
        });
        
        // Explicitly update placeholders for dynamic/complex elements that might not match simple ID patterns
        document.querySelector('[data-category="taxes"] .custom-name-input').placeholder = t.tax_custom_name_placeholder;
        document.querySelector('[data-category="taxes"] .amount-input').placeholder = t['tax-amount-placeholder'];
        // The add-item-btn text needs to be updated here for initial load
        if (document.querySelector('[data-category="taxes"] .add-item-btn')) {
            document.querySelector('[data-category="taxes"] .add-item-btn').textContent = t['tax-add-button'];
        }
        
        document.querySelector('[data-category="preTax"] .custom-name-input').placeholder = t.pre_tax_custom_name_placeholder;
        document.querySelector('[data-category="preTax"] .amount-input').placeholder = t['pre-tax-amount-placeholder'];
        if (document.querySelector('[data-category="preTax"] .add-item-btn')) {
            document.querySelector('[data-category="preTax"] .add-item-btn').textContent = t['pre-tax-add-button'];
        }

        document.querySelector('[data-category="postTax"] .custom-name-input').placeholder = t.post_tax_custom_name_placeholder;
        document.querySelector('[data-category="postTax"] .amount-input').placeholder = t['post-tax-amount-placeholder'];
        if (document.querySelector('[data-category="postTax"] .add-item-btn')) {
            document.querySelector('[data-category="postTax"] .add-item-btn').textContent = t['post-tax-add-button'];
        }


        document.getElementById('expense-name').placeholder = t['expense-name-placeholder'];
        document.getElementById('expense-amount').placeholder = t['expense-amount-label']; 
        document.getElementById('new-category').placeholder = t['new-category-placeholder'];
        document.getElementById('add-expense-button').textContent = t['add-expense-button']; 

        // If update/cancel buttons exist, update their text
        if (updateExpenseBtn) updateExpenseBtn.textContent = t['update-expense-button'];
        if (cancelExpenseBtn) cancelExpenseBtn.textContent = t['cancel-expense-button'];

        // Update button texts for section-specific update/cancel buttons
        categorySections.forEach(section => {
            const category = section.dataset.category;
            const updateBtn = section.querySelector('.update-item-btn');
            const cancelBtn = section.querySelector('.cancel-item-btn');
            const addBtn = section.querySelector('.add-item-btn'); // Also update add button text

            if (updateBtn) updateBtn.textContent = t[`${category}-update-button`];
            if (cancelBtn) cancelBtn.textContent = t[`${category}-cancel-button`];
            if (addBtn) addBtn.textContent = t[`${category}-add-button`]; // Important: update 'Add' button text too
        });

        document.documentElement.lang = lang.split('-')[0]; // Set the HTML lang attribute
        fullUpdate(); // Re-render all components with new language
    };
    
    // --- RENDER FUNCTIONS ---
    // Renders the list of taxes, pre-tax, or post-tax items.
    const renderCategorizedList = (category) => {
        const listContainer = document.getElementById(`${category}-list`);
        listContainer.innerHTML = '';
        state[category].forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                <div class="flex items-center gap-2">
                    <span class="item-amount">-$${formatCurrency(item.amount)}</span>
                    <button class="item-edit-btn" data-id="${item.id}" data-category="${category}">수정</button>
                    <button class="item-delete-btn" data-id="${item.id}" data-category="${category}">X</button>
                </div>
            `;
            listContainer.appendChild(itemDiv);
        });
    };

    // Renders the expense category dropdown.
    const renderExpenseCategories = () => {
        expenseCategorySelect.innerHTML = '';
        state.expenseCategories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            expenseCategorySelect.appendChild(option);
        });
    };

    // Renders the list of expenses.
    const renderExpensesList = () => {
        expensesListContainer.innerHTML = '';
        state.expenses.forEach(exp => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.innerHTML = `
                <span class="item-name">${exp.category}: ${exp.name}</span>
                <div class="flex items-center gap-2">
                    <span class="item-amount">-$${formatCurrency(exp.amount)}</span>
                    <button class="item-edit-btn" data-id="${exp.id}" data-category="expenses">수정</button>
                    <button class="item-delete-btn" data-id="${exp.id}" data-category="expenses">X</button>
                </div>
            `;
            expensesListContainer.appendChild(itemDiv);
        });
    };

    // --- CALCULATE & UPDATE SUMMARY ---
    // Calculates all financial summaries and updates the UI.
    const calculateAndUpdateAll = () => {
        const t = translations[state.language];
        const income = state.income || 0;

        const preTaxDeductions = state.preTax.reduce((sum, item) => sum + item.amount, 0);
        const taxableIncome = Math.max(0, income - preTaxDeductions);
        const taxTotal = state.taxes.reduce((sum, item) => sum + item.amount, 0);
        const postTaxDeductions = state.postTax.reduce((sum, item) => sum + item.amount, 0);
        const totalDeductionsAndTaxes = preTaxDeductions + taxTotal + postTaxDeductions;
        const netIncome = Math.max(0, income - totalDeductionsAndTaxes);
        const expensesTotal = state.expenses.reduce((sum, item) => sum + item.amount, 0);
        const remainingBalance = netIncome - expensesTotal;

        const incomeFlowContainer = document.querySelector('.income-flow');
        incomeFlowContainer.innerHTML = `
            <div class="flow-item"><span class="flow-label">${t.gross_income_label}</span> <span class="flow-amount">$${formatCurrency(income)} <em class="percentage highlighted-percentage">(100.0%)</em></span></div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item highlighted"><span class="flow-label">${t.pre_tax_deductions_label}</span> <span class="flow-amount">-$${formatCurrency(preTaxDeductions)} <em class="percentage highlighted-percentage">(${(income > 0 ? preTaxDeductions / income * 100 : 0).toFixed(1)}%)</em></span></div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item"><span class="flow-label"><strong>${t.taxable_income_label}</strong></span> <span class="flow-amount">$${formatCurrency(taxableIncome)} <em class="percentage highlighted-percentage">(${(income > 0 ? taxableIncome / income * 100 : 0).toFixed(1)}%)</em></span></div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item highlighted"><span class="flow-label">${t.tax_total_label}</span> <span class="flow-amount">-$${formatCurrency(taxTotal)} <em class="percentage highlighted-percentage">(${(income > 0 ? taxTotal / income * 100 : 0).toFixed(1)}%)</em></span></div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item highlighted"><span class="flow-label">${t.post_tax_deductions_label}</span> <span class="flow-amount">-$${formatCurrency(postTaxDeductions)} <em class="percentage highlighted-percentage">(${(income > 0 ? postTaxDeductions / income * 100 : 0).toFixed(1)}%)</em></span></div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item info"><span class="flow-label"><strong>${t.total_deductions_taxes_label}</strong></span> <span class="flow-amount">-$${formatCurrency(totalDeductionsAndTaxes)} <em class="percentage highlighted-percentage">(${(income > 0 ? totalDeductionsAndTaxes / income * 100 : 0).toFixed(1)}%)</em></span></div>
            <div class="flow-arrow">↓</div>
            <div class="flow-item result"><span class="flow-label"><strong>${t.net_income_label}</strong></span> <span class="flow-amount">$${formatCurrency(netIncome)} <em class="percentage highlighted-percentage">(${(income > 0 ? netIncome / income * 100 : 0).toFixed(1)}%)</em></span></div>
        `;

        const summaryCardsContainer = document.querySelector('.summary-cards');
        summaryCardsContainer.innerHTML = `
            <div class="summary-card">
                <div class="card-label">${t.total_expenses_card_label}</div>
                <div class="card-amount negative">$${formatCurrency(expensesTotal)}</div>
                <div class="card-sub">${t.total_expenses_card_sub}</div>
                <div class="card-percentage">${t.expenses_percentage_text} <span class="highlighted-percentage">${(income > 0 ? expensesTotal / income * 100 : 0).toFixed(1)}%</span></div>
            </div>
            <div class="summary-card accent">
                <div class="card-label">${t.remaining_balance_card_label}</div>
                <div class="card-amount ${remainingBalance < 0 ? 'negative' : ''}">$${formatCurrency(remainingBalance)}</div>
                <div class="card-sub">${t.remaining_balance_card_sub}</div>
                <div class="card-percentage">${t.remaining_percentage_text} <span class="highlighted-percentage">${(income > 0 ? remainingBalance / income * 100 : 0).toFixed(1)}%</span></div>
            </div>
        `;

        updateCharts({ netIncome, taxTotal, preTaxDeductions, postTaxDeductions });
    };

    // --- CHARTING ---
    let incomeFlowChart, expenseCategoryChart;
    // Updates the Chart.js charts with current financial data.
    const updateCharts = ({ netIncome, taxTotal, preTaxDeductions, postTaxDeductions }) => {
        const incomeFlowCtx = document.getElementById('incomeFlowChart')?.getContext('2d');
        const expenseCategoryCtx = document.getElementById('expenseCategoryChart')?.getContext('2d');

        if (!incomeFlowCtx || !expenseCategoryCtx) return;

        // Ensure charts are responsive and prevent infinite growth.
        incomeFlowCtx.canvas.parentNode.style.height = '350px';
        incomeFlowCtx.canvas.parentNode.style.position = 'relative';
        expenseCategoryCtx.canvas.parentNode.style.height = '350px';
        expenseCategoryCtx.canvas.parentNode.style.position = 'relative';

        if (incomeFlowChart) incomeFlowChart.destroy();
        incomeFlowChart = new Chart(incomeFlowCtx, {
            type: 'doughnut',
            data: {
                labels: ['Net Income', 'Taxes', 'Pre-Tax Deductions', 'Post-Tax Deductions'],
                datasets: [{
                    data: [Math.max(0, netIncome), taxTotal, preTaxDeductions, postTaxDeductions],
                    backgroundColor: ['#7ed321', '#d0021b', '#f5a623', '#4a90e2'],
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' },
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            if (sum === 0) return '0%';
                            let percentage = (value * 100 / sum).toFixed(1) + '%';
                            return value > 0 ? percentage : '';
                        }, color: '#fff',
                    }
                }
            },
        });
        
        const expenseData = state.expenseCategories.map(cat => state.expenses.filter(exp => exp.category === cat).reduce((sum, exp) => sum + exp.amount, 0));

        if (expenseCategoryChart) expenseCategoryChart.destroy();
        expenseCategoryChart = new Chart(expenseCategoryCtx, {
            type: 'pie',
            data: {
                labels: state.expenseCategories,
                datasets: [{
                    data: expenseData,
                    backgroundColor: ['#4a90e2', '#50e3c2', '#f5a623', '#bd10e0', '#b8e986', '#7ed321', '#4a4a4a', '#9013fe', '#f8e71c', '#d0021b']
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'top' },
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                            if (sum === 0) return '0%';
                            let percentage = (value * 100 / sum).toFixed(1) + '%';
                            return value > 0 ? percentage : '';
                        }, color: '#fff',
                    }
                }
            },
        });
    };
    
    // Performs a full UI update and recalculation.
    const fullUpdate = () => {
        renderExpenseCategories();
        renderExpensesList();
        renderCategorizedList('taxes');
        renderCategorizedList('preTax');
        renderCategorizedList('postTax');
        calculateAndUpdateAll();
    };

    // --- EVENT HANDLERS ---
    // Updates income when input changes.
    incomeInput.addEventListener('input', (e) => {
        state.income = parseFloat(e.target.value) || 0;
        calculateAndUpdateAll();
    });

    // Event listeners for tax, pre-tax, and post-tax sections.
    categorySections.forEach(section => {
        const category = section.dataset.category;
        const select = section.querySelector('.category-select');
        const inputContainer = section.querySelector('.category-input-container');
        const customNameInput = section.querySelector('.custom-name-input');
        const amountInput = section.querySelector('.amount-input');
        const addButton = section.querySelector('.add-item-btn');
        
        // Create or get the update and cancel buttons.
        // Ensure they are hidden by default by adding the 'hidden' class.
        let updateButton = section.querySelector('.update-item-btn');
        let cancelButton = section.querySelector('.cancel-item-btn');

        if (!updateButton) {
            updateButton = document.createElement('button');
            updateButton.className = 'update-item-btn hidden'; // Ensure hidden initially
            inputContainer.appendChild(updateButton);
        }
        if (!cancelButton) {
            cancelButton = document.createElement('button');
            cancelButton.className = 'cancel-item-btn hidden utility-btn'; // Ensure hidden initially
            cancelButton.style.backgroundColor = '#6c757d'; 
            inputContainer.appendChild(cancelButton);
        }

        // State to keep track of the item being edited for THIS specific section
        let editingItemId = null;

        /**
         * Sets the edit mode for the current category section.
         * Controls visibility of add/update/cancel buttons and populates inputs.
         * @param {boolean} isEditing - True to enter edit mode, false to exit.
         * @param {object | null} item - The item object to edit (if entering edit mode).
         */
        const setSectionEditMode = (isEditing, item = null) => {
            const t = translations[state.language]; 
            if (isEditing) {
                // Hide 'Add' button, show 'Update' and 'Cancel'
                addButton.classList.add('hidden');
                updateButton.classList.remove('hidden');
                cancelButton.classList.remove('hidden');
                // Update button texts based on current language
                updateButton.textContent = t[`${category}-update-button`];
                cancelButton.textContent = t[`${category}-cancel-button`];

                if (item) {
                    editingItemId = item.id;
                    // Check if the item.name exists as a standard option value
                    const optionExists = Array.from(select.options).some(option => option.value === item.name);
                    if (optionExists && select.querySelector(`option[value="${item.name}"]`)) { 
                        select.value = item.name;
                        customNameInput.style.display = 'none'; // Hide custom input if a standard option is selected
                    } else {
                        select.value = 'custom'; // Select 'Custom' option
                        customNameInput.value = item.name; // Set custom input value
                        customNameInput.style.display = 'block'; // Show custom input for custom item
                    }
                    amountInput.value = item.amount;
                    inputContainer.style.display = 'flex'; // Ensure input container is visible
                    
                    // Manually trigger change to ensure other related UI updates (if any) occur
                    // This is crucial for the select's change listener to re-evaluate the display.
                    const event = new Event('change');
                    select.dispatchEvent(event); 
                }
            } else {
                // Show 'Add' button, hide 'Update' and 'Cancel'
                addButton.classList.remove('hidden');
                updateButton.classList.add('hidden');
                cancelButton.classList.add('hidden');
                // Revert button text to 'Add'
                addButton.textContent = t[`${category}-add-button`];
                editingItemId = null; // Clear editing state
                // Clear inputs and reset select
                select.value = ''; // Reset select to placeholder
                customNameInput.value = '';
                amountInput.value = '';
                customNameInput.style.display = 'none'; // Ensure custom input is hidden

                // This line ensures the inputContainer is hidden if no option is selected
                inputContainer.style.display = 'none'; 
            }
        };

        // Assign the setSectionEditMode function to the section for external calls (e.g., from item-edit-btn click)
        section.setEditMode = setSectionEditMode;

        // Toggle visibility of input fields based on select choice.
        select.addEventListener('change', () => {
            // Always reset the state of this section to "add new item" mode
            // This will hide update/cancel buttons and ensure 'Add' is visible.
            // It will also clear the input fields and hide the custom name input.
            // IMPORTANT: setSectionEditMode(false) also sets inputContainer.style.display = 'none'
            // We need to ensure that if a valid option is selected, it becomes 'flex' again.
            setSectionEditMode(false); // Resets the form and hides inputContainer

            // Now, based on the NEW selection, determine if inputs should be visible
            if (select.value) { // If anything other than the placeholder is selected
                inputContainer.style.display = 'flex'; // Show the main input container
                if (select.value === 'custom') {
                    customNameInput.style.display = 'block'; // Show custom input for 'custom'
                    customNameInput.focus();
                } else {
                    customNameInput.style.display = 'none'; // Hide custom input for non-'custom'
                    amountInput.focus();
                }
            } else {
                // If the placeholder is selected (select.value is empty), ensure everything is hidden
                inputContainer.style.display = 'none';
                customNameInput.style.display = 'none';
            }

            // Clear amounts when changing selection to avoid carrying over old values
            amountInput.value = '';
            if (select.value !== 'custom') {
                customNameInput.value = ''; // Only clear custom name if not 'custom' option
            }
        });
        
        // Add item handler (original 'Apply' button, now 'Add')
        addButton.addEventListener('click', async () => {
            const t = translations[state.language];
            const amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount <= 0) { await showAlertDialog(t.alert_valid_amount); return; }
            
            let name = select.value === 'custom' ? customNameInput.value.trim() : select.options[select.selectedIndex].text;
            if (select.value === 'custom' && !name) { await showAlertDialog(t.alert_custom_name); return; }
            
            // Check for duplicate name, case-insensitive
            if(state[category].some(item => item.name.toLowerCase() === name.toLowerCase())) { await showAlertDialog(`'${name}'` + t.alert_item_exists); return; }

            state[category].push({ id: generateId(), name, amount });
            
            setSectionEditMode(false); // Reset inputs after adding
            fullUpdate(); // Re-render lists and charts
        });

        // Update item handler
        updateButton.addEventListener('click', async () => {
            const t = translations[state.language];
            const amount = parseFloat(amountInput.value);
            if (isNaN(amount) || amount <= 0) { await showAlertDialog(t.alert_valid_amount); return; }

            let name = select.value === 'custom' ? customNameInput.value.trim() : select.options[select.selectedIndex].text;
            if (select.value === 'custom' && !name) { await showAlertDialog(t.alert_custom_name); return; }

            // Check for duplicate name, excluding the item currently being edited
            if(state[category].some(item => item.id !== editingItemId && item.name.toLowerCase() === name.toLowerCase())) {
                await showAlertDialog(`'${name}'` + t.alert_item_exists); return;
            }

            state[category] = state[category].map(item =>
                item.id === editingItemId ? { ...item, name, amount } : item
            );
            
            setSectionEditMode(false); // Reset inputs after updating
            fullUpdate(); // Re-render lists and charts
        });

        // Cancel update handler
        cancelButton.addEventListener('click', () => {
            setSectionEditMode(false); // Reset inputs
        });
    });
    
    // Handles deletion and editing of items from any list (taxes, preTax, postTax, expenses).
    document.body.addEventListener('click', async (e) => {
        if (e.target.classList.contains('item-delete-btn')) {
            const { id, category } = e.target.dataset;
            // Confirm deletion for any categorized item
            if (await showConfirmDialog(translations[state.language].confirm_delete_item)) {
                state[category] = state[category].filter(item => item.id !== id);
                fullUpdate();
            } 
        } else if (e.target.classList.contains('item-edit-btn')) {
            const { id, category } = e.target.dataset;
            const itemToEdit = state[category].find(item => item.id === id);

            if (itemToEdit) {
                // Determine which section's inputs to populate
                if (category === 'expenses') {
                    // For expenses, handle separately due to different input structure
                    expenseCategorySelect.value = itemToEdit.category;
                    expenseNameInput.value = itemToEdit.name;
                    expenseAmountInput.value = itemToEdit.amount;

                    addExpenseBtn.classList.add('hidden');
                    // Create update/cancel buttons if they don't exist
                    if (!updateExpenseBtn) { 
                        const expenseButtonContainer = addExpenseBtn.parentNode;
                        updateExpenseBtn = document.createElement('button');
                        updateExpenseBtn.id = 'update-expense-button';
                        updateExpenseBtn.textContent = translations[state.language]['update-expense-button'];
                        updateExpenseBtn.style.width = '100%';
                        updateExpenseBtn.style.marginTop = '1rem';
                        expenseButtonContainer.insertBefore(updateExpenseBtn, addExpenseBtn);

                        cancelExpenseBtn = document.createElement('button');
                        cancelExpenseBtn.id = 'cancel-expense-button';
                        cancelExpenseBtn.textContent = translations[state.language]['cancel-expense-button'];
                        cancelExpenseBtn.className = 'utility-btn';
                        cancelExpenseBtn.style.width = '100%';
                        cancelExpenseBtn.style.marginTop = '1rem';
                        cancelExpenseBtn.style.backgroundColor = '#6c757d';
                        expenseButtonContainer.insertBefore(cancelExpenseBtn, addExpenseBtn);

                        // Attach event listeners for expense update/cancel buttons
                        updateExpenseBtn.addEventListener('click', async () => {
                            const t = translations[state.language];
                            const categoryVal = expenseCategorySelect.value;
                            const name = expenseNameInput.value.trim();
                            const amount = parseFloat(expenseAmountInput.value);

                            if (!categoryVal || !name || isNaN(amount) || amount <= 0) { await showAlertDialog(t.alert_fill_all_fields); return; }

                            state.expenses = state.expenses.map(exp =>
                                exp.id === editingItemIdForExpenses ? { ...exp, category: categoryVal, name, amount } : exp
                            );
                            resetExpenseForm();
                            fullUpdate();
                        });

                        cancelExpenseBtn.addEventListener('click', () => {
                            resetExpenseForm();
                        });
                    }
                    updateExpenseBtn.classList.remove('hidden');
                    cancelExpenseBtn.classList.remove('hidden');
                    editingItemIdForExpenses = id; // Set editing ID for expenses
                } else {
                    // For tax, preTax, postTax sections
                    const section = document.querySelector(`.card[data-category="${category}"]`);
                    // Call the setEditMode function attached to the specific section
                    if (section && section.setEditMode) {
                        section.setEditMode(true, itemToEdit); // Pass the item to populate inputs
                    }
                }
            }
        }
    });

    // Helper function to reset expense form and buttons
    const resetExpenseForm = () => {
        expenseCategorySelect.value = state.expenseCategories[0]; // Reset to first category
        expenseNameInput.value = '';
        expenseAmountInput.value = '';
        addExpenseBtn.classList.remove('hidden');
        if (updateExpenseBtn) updateExpenseBtn.classList.add('hidden');
        if (cancelExpenseBtn) cancelExpenseBtn.classList.add('hidden');
        editingItemIdForExpenses = null;
    };
    let editingItemIdForExpenses = null; // New state variable for expense editing

    // Adds a new expense category.
    addCategoryBtn.addEventListener('click', async () => {
        const t = translations[state.language];
        const newCategory = newCategoryInput.value.trim();
        if (newCategory && !state.expenseCategories.includes(newCategory)) {
            state.expenseCategories.push(newCategory);
            newCategoryInput.value = '';
            renderExpenseCategories();
        } else if (state.expenseCategories.includes(newCategory)) {
            await showAlertDialog(t.alert_category_exists);
        }
    });
    
    // Adds a new expense item.
    addExpenseBtn.addEventListener('click', async () => {
        const t = translations[state.language];
        const category = expenseCategorySelect.value;
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);

        if (!category || !name || isNaN(amount) || amount <= 0) { await showAlertDialog(t.alert_fill_all_fields); return; }
        
        state.expenses.push({ id: generateId(), category, name, amount });
        resetExpenseForm(); // Reset form after adding
        fullUpdate();
    });
    
    // Changes the application language.
    langSelect.addEventListener('change', (e) => setLanguage(e.target.value));

    // Saves current state to local storage.
    document.getElementById('save-button').addEventListener('click', async () => {
        const t = translations[state.language];
        try {
            localStorage.setItem('budgetAppData', JSON.stringify(state));
            await showAlertDialog(t.alert_data_saved);
        } catch (error) {
            console.error('Failed to save data:', error);
            await showAlertDialog(t.alert_save_failed);
        }
    });

    // Loads state from local storage.
    document.getElementById('load-button').addEventListener('click', async () => {
        const t = translations[state.language];
        const savedData = localStorage.getItem('budgetAppData');
        if (savedData) {
            try {
                const loadedState = JSON.parse(savedData);
                // Robustly initialize arrays if they are missing or null in loaded state
                state.income = loadedState.income || 0;
                state.taxes = Array.isArray(loadedState.taxes) ? loadedState.taxes : [];
                state.preTax = Array.isArray(loadedState.preTax) ? loadedState.preTax : [];
                state.postTax = Array.isArray(loadedState.postTax) ? loadedState.postTax : [];
                state.expenses = Array.isArray(loadedState.expenses) ? loadedState.expenses : [];
                state.expenseCategories = Array.isArray(loadedState.expenseCategories) ? loadedState.expenseCategories : ['주거', '교통', '식비', '생활', '오락', '기타'];
                
                langSelect.value = loadedState.language || 'ko';
                setLanguage(langSelect.value); // Re-set language to update all UI elements
                await showAlertDialog(t.alert_data_loaded);
            } catch(error) {
                console.error('Failed to parse saved data:', error);
                await showAlertDialog(t.alert_load_failed);
            }
        } else {
            await showAlertDialog(t.alert_no_data);
        }
    });
    
    // Resets all data in the application.
    document.getElementById('reset-button').addEventListener('click', async () => {
        const t = translations[state.language];
        const confirmed = await showConfirmDialog(t.confirm_reset);
        if (confirmed) {
            localStorage.removeItem('budgetAppData');
            // Reset to initial state, ensuring all arrays are empty.
            state = { 
                language: state.language, 
                income: 0, 
                taxes: [], 
                preTax: [], 
                postTax: [], 
                expenses: [], 
                expenseCategories: ['주거', '교통', '식비', '생활', '오락', '기타'], 
            };
            incomeInput.value = '';
            setLanguage(state.language); // Re-set language to update all UI elements
            await showAlertDialog(t.alert_data_reset);
        }
    });
    
    // --- INITIALIZATION ---
    // Loads saved language preference or defaults to Korean.
    const savedLang = localStorage.getItem('budgetAppLang') || 'ko';
    langSelect.value = savedLang;
    setLanguage(savedLang); // Initial UI setup with saved language
});
