    document.addEventListener('DOMContentLoaded', () => {
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
          'app-title': '💰 예산 관리 시스템 (USD)', 'income-title': '월급', 'income-label': '세전 월급액 ($)', 'tax-title': '세금', 'tax-type-label': '세금 종류', 'tax-select-placeholder': '세금 종류 선택', 'tax-option-custom': '직접 입력', 'tax-custom-name-placeholder': '세금 항목명 입력', 'tax-apply-button': '적용', 'pre-tax-title': '세전 공제', 'pre-tax-type-label': '공제 항목', 'pre-tax-select-placeholder': '공제 항목 선택', 'pre-tax-option-custom': '직접 입력', 'pre-tax-custom-name-placeholder': '공제 항목명 입력', 'pre-tax-apply-button': '적용', 'post-tax-title': '세후 공제', 'post-tax-type-label': '공제 항목', 'post-tax-select-placeholder': '공제 항목 선택', 'post-tax-option-custom': '직접 입력', 'post-tax-custom-name-placeholder': '공제 항목명 입력', 'post-tax-apply-button': '적용', 'expense-management-title': '지출 관리', 'category-label': '카테고리', 'expense-name-label': '항목명', 'expense-name-placeholder': '예: 월세', 'expense-amount-label': '금액', 'new-category-label': '새 카테고리명', 'new-category-placeholder': '새 카테고리명 입력', 'add-category-button': '카테고리 추가', 'add-expense-button': '지출 추가', 'monthly-financial-status-title': '📊 월별 재무 현황', 'financial-analysis-chart-title': '📈 재무 분석 차트', 'income-flow-chart-title': '자금 흐름 배분 (총 수입 대비)', 'expense-category-chart-title': '지출 카테고리별 비중 (총 지출 대비)', 'save-button': '💾 저장하기', 'load-button': '📂 불러오기', 'print-button': '🖨️ 인쇄하기', 'reset-button': '🔄 초기화',
           gross_income_label: "세전 월급 (총 수입)", pre_tax_deductions_label: "세전 공제", taxable_income_label: "과세 소득", tax_total_label: "세금", post_tax_deductions_label: "세후 공제", total_deductions_taxes_label: "총 공제 및 세금", net_income_label: "순수입 (실수령액)", total_expenses_card_label: "총 지출", total_expenses_card_sub: "(순수입에서 사용)", remaining_balance_card_label: "남은 잔액", remaining_balance_card_sub: "(저축/투자 가능)", expenses_percentage_text: "총 수입의", remaining_percentage_text: "총 수입의",
        },
        en: {
          'app-title': '💰 Budget Management System (USD)', 'income-title': 'Salary', 'income-label': 'Gross Monthly Salary ($)', 'tax-title': 'Taxes', 'tax-type-label': 'Tax Type', 'tax-select-placeholder': 'Select tax type', 'tax-option-custom': 'Custom', 'tax-custom-name-placeholder': 'Enter tax name', 'tax-apply-button': 'Apply', 'pre-tax-title': 'Pre-Tax Deductions', 'pre-tax-type-label': 'Deduction Item', 'pre-tax-select-placeholder': 'Select deduction', 'pre-tax-option-custom': 'Custom', 'pre-tax-custom-name-placeholder': 'Enter deduction name', 'pre-tax-apply-button': 'Apply', 'post-tax-title': 'Post-Tax Deductions', 'post-tax-type-label': 'Deduction Item', 'post-tax-select-placeholder': 'Select deduction', 'post-tax-option-custom': 'Custom', 'post-tax-custom-name-placeholder': 'Enter deduction name', 'post-tax-apply-button': 'Apply', 'expense-management-title': 'Expense Management', 'category-label': 'Category', 'expense-name-label': 'Item Name', 'expense-name-placeholder': 'e.g., Rent', 'expense-amount-label': 'Amount', 'new-category-label': 'New Category Name', 'new-category-placeholder': 'Enter new category name', 'add-category-button': 'Add Category', 'add-expense-button': 'Add Expense', 'monthly-financial-status-title': '📊 Monthly Financial Status', 'financial-analysis-chart-title': '📈 Financial Analysis Charts', 'income-flow-chart-title': 'Fund Flow Distribution (vs. Gross Income)', 'expense-category-chart-title': 'Expense Breakdown by Category (vs. Total Expenses)', 'save-button': '💾 Save', 'load-button': '📂 Load', 'print-button': '🖨️ Print', 'reset-button': '🔄 Reset',
           gross_income_label: "Gross Salary (Total Income)", pre_tax_deductions_label: "Pre-Tax Deductions", taxable_income_label: "Taxable Income", tax_total_label: "Taxes", post_tax_deductions_label: "Post-Tax Deductions", total_deductions_taxes_label: "Total Deductions & Taxes", net_income_label: "Net Income (Take-Home Pay)", total_expenses_card_label: "Total Expenses", total_expenses_card_sub: "(spent from Net Income)", remaining_balance_card_label: "Remaining Balance", remaining_balance_card_sub: "(for Savings/Investments)", expenses_percentage_text: "of Gross Income", remaining_percentage_text: "of Gross Income",
        },
        zh: {
          'app-title': '💰 预算管理系统 (USD)', 'income-title': '薪水', 'income-label': '税前月薪 ($)', 'tax-title': '税款', 'tax-type-label': '税种', 'tax-select-placeholder': '选择税种', 'tax-option-custom': '自定义', 'tax-custom-name-placeholder': '输入税项名称', 'tax-apply-button': '应用', 'pre-tax-title': '税前扣除', 'pre-tax-type-label': '扣除项目', 'pre-tax-select-placeholder': '选择扣除项目', 'pre-tax-option-custom': '自定义', 'pre-tax-custom-name-placeholder': '输入扣除名称', 'pre-tax-apply-button': '应用', 'post-tax-title': '税后扣除', 'post-tax-type-label': '扣除项目', 'post-tax-select-placeholder': '选择扣除项目', 'post-tax-option-custom': '自定义', 'post-tax-custom-name-placeholder': '输入扣除名称', 'post-tax-apply-button': '应用', 'expense-management-title': '支出管理', 'category-label': '类别', 'expense-name-label': '项目名称', 'expense-name-placeholder': '例如：房租', 'expense-amount-label': '金额', 'new-category-label': '新类别名称', 'new-category-placeholder': '输入新类别名称', 'add-category-button': '添加类别', 'add-expense-button': '添加支出', 'monthly-financial-status-title': '📊 每月财务状况', 'financial-analysis-chart-title': '📈 财务分析图表', 'income-flow-chart-title': '资金流分配 (与总收入相比)', 'expense-category-chart-title': '按类别划分的支出明细 (与总支出相比)', 'save-button': '💾 保存', 'load-button': '📂 加载', 'print-button': '🖨️ 打印', 'reset-button': '🔄 重置',
           gross_income_label: "总薪水 (总收入)", pre_tax_deductions_label: "税前扣除", taxable_income_label: "应税收入", tax_total_label: "税款", post_tax_deductions_label: "税后扣除", total_deductions_taxes_label: "总扣除和税款", net_income_label: "净收入 (实得工资)", total_expenses_card_label: "总支出", total_expenses_card_sub: "(从净收入中支出)", remaining_balance_card_label: "剩余余额", remaining_balance_card_sub: "(用于储蓄/投资)", expenses_percentage_text: "总收入的", remaining_percentage_text: "总收入的",
        },
      };

      // --- DOM SELECTORS ---
      const incomeInput = document.getElementById('income');
      const langSelect = document.getElementById('language-select');
      const categorySections = document.querySelectorAll('.card[data-category]');
      const addCategoryBtn = document.getElementById('add-category-button');
      const newCategoryInput = document.getElementById('new-category');
      const expenseCategorySelect = document.getElementById('category');
      const addExpenseBtn = document.getElementById('add-expense-button');
      const expenseNameInput = document.getElementById('expense-name');
      const expenseAmountInput = document.getElementById('expense-amount');
      const expensesListContainer = document.getElementById('expenses-list');

      // --- UTILITY FUNCTIONS ---
      const formatCurrency = (amount) => amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
      const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // --- TRANSLATION FUNCTION ---
      const setLanguage = (lang) => {
          state.language = lang;
          const t = translations[lang];
          document.querySelectorAll('[id]').forEach(el => {
              const key = el.id.replace(/-label|-title|-button|-placeholder|-text|-sub|-card/g, '');
              if (t[key]) {
                  if (el.placeholder) el.placeholder = t[key];
                  else if (el.tagName === 'OPTION') el.textContent = t[key];
                  else el.innerHTML = t[key];
              }
          });
          document.documentElement.lang = lang.split('-')[0];
          // Update dynamic text
          fullUpdate();
      };
      
      // --- RENDER FUNCTIONS ---
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
                <button class="item-delete-btn" data-id="${item.id}" data-category="${category}">X</button>
            </div>
          `;
          listContainer.appendChild(itemDiv);
        });
      };

      const renderExpenseCategories = () => {
        expenseCategorySelect.innerHTML = '';
        state.expenseCategories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat;
          option.textContent = cat;
          expenseCategorySelect.appendChild(option);
        });
      };

      const renderExpensesList = () => {
        expensesListContainer.innerHTML = '';
        state.expenses.forEach(exp => {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'item';
          itemDiv.innerHTML = `
             <span class="item-name">${exp.category}: ${exp.name}</span>
             <div class="flex items-center gap-2">
                <span class="item-amount">-$${formatCurrency(exp.amount)}</span>
                <button class="item-delete-btn" data-id="${exp.id}" data-category="expenses">X</button>
            </div>
          `;
          expensesListContainer.appendChild(itemDiv);
        });
      };

      // --- CALCULATE & UPDATE SUMMARY ---
      const calculateAndUpdateAll = () => {
        const t = translations[state.language];
        const income = state.income || 0;

        const preTaxDeductions = state.preTax.reduce((sum, item) => sum + item.amount, 0);
        const taxableIncome = income - preTaxDeductions;
        const taxTotal = state.taxes.reduce((sum, item) => sum + item.amount, 0);
        const postTaxDeductions = state.postTax.reduce((sum, item) => sum + item.amount, 0);
        const totalDeductionsAndTaxes = preTaxDeductions + taxTotal + postTaxDeductions;
        const netIncome = income - totalDeductionsAndTaxes;
        const expensesTotal = state.expenses.reduce((sum, item) => sum + item.amount, 0);
        const remainingBalance = netIncome - expensesTotal;

        // Render Income Flow
        const incomeFlowContainer = document.querySelector('.income-flow');
        incomeFlowContainer.innerHTML = `
          <div class="flow-item"><span class="flow-label">${t.gross_income_label}</span> <span class="flow-amount">$${formatCurrency(income)} <em class="percentage highlighted-percentage">(100.0%)</em></span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-item highlighted"><span class="flow-label">${t.pre_tax_deductions_label}</span> <span class="flow-amount">-$${formatCurrency(preTaxDeductions)} <em class="percentage highlighted-percentage">(${(preTaxDeductions / income * 100 || 0).toFixed(1)}%)</em></span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-item"><span class="flow-label"><strong>${t.taxable_income_label}</strong></span> <span class="flow-amount">$${formatCurrency(taxableIncome)} <em class="percentage highlighted-percentage">(${(taxableIncome / income * 100 || 0).toFixed(1)}%)</em></span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-item highlighted"><span class="flow-label">${t.tax_total_label}</span> <span class="flow-amount">-$${formatCurrency(taxTotal)} <em class="percentage highlighted-percentage">(${(taxTotal / income * 100 || 0).toFixed(1)}%)</em></span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-item highlighted"><span class="flow-label">${t.post_tax_deductions_label}</span> <span class="flow-amount">-$${formatCurrency(postTaxDeductions)} <em class="percentage highlighted-percentage">(${(postTaxDeductions / income * 100 || 0).toFixed(1)}%)</em></span></div>
          <div class="flow-arrow">↓</div>
           <div class="flow-item info"><span class="flow-label"><strong>${t.total_deductions_taxes_label}</strong></span> <span class="flow-amount">-$${formatCurrency(totalDeductionsAndTaxes)} <em class="percentage highlighted-percentage">(${(totalDeductionsAndTaxes / income * 100 || 0).toFixed(1)}%)</em></span></div>
          <div class="flow-arrow">↓</div>
          <div class="flow-item result"><span class="flow-label"><strong>${t.net_income_label}</strong></span> <span class="flow-amount">$${formatCurrency(netIncome)} <em class="percentage highlighted-percentage">(${(netIncome / income * 100 || 0).toFixed(1)}%)</em></span></div>
        `;

        // Render Summary Cards
        const summaryCardsContainer = document.querySelector('.summary-cards');
        summaryCardsContainer.innerHTML = `
          <div class="summary-card">
            <div class="card-label">${t.total_expenses_card_label}</div>
            <div class="card-amount negative">$${formatCurrency(expensesTotal)}</div>
            <div class="card-sub">${t.total_expenses_card_sub}</div>
            <div class="card-percentage">${t.expenses_percentage_text} <span class="highlighted-percentage">${(expensesTotal / income * 100 || 0).toFixed(1)}%</span></div>
          </div>
          <div class="summary-card accent">
            <div class="card-label">${t.remaining_balance_card_label}</div>
            <div class="card-amount ${remainingBalance < 0 ? 'negative' : ''}">$${formatCurrency(remainingBalance)}</div>
            <div class="card-sub">${t.remaining_balance_card_sub}</div>
            <div class="card-percentage">${t.remaining_percentage_text} <span class="highlighted-percentage">${(remainingBalance / income * 100 || 0).toFixed(1)}%</span></div>
          </div>
        `;

        // Update Charts
        updateCharts({ netIncome, taxTotal, preTaxDeductions, postTaxDeductions, expensesTotal, remainingBalance });
      };

      // --- CHARTING ---
      let incomeFlowChart, expenseCategoryChart;
      const updateCharts = ({ netIncome, taxTotal, preTaxDeductions, postTaxDeductions, expensesTotal, remainingBalance }) => {
        const income = state.income || 0;
        if (income === 0) { // Clear charts if no income
            if (incomeFlowChart) incomeFlowChart.destroy();
            if (expenseCategoryChart) expenseCategoryChart.destroy();
            return;
        }

        const incomeFlowCtx = document.getElementById('incomeFlowChart').getContext('2d');
        const expenseCategoryCtx = document.getElementById('expenseCategoryChart').getContext('2d');

        const otherDeductions = preTaxDeductions + postTaxDeductions;
        const actualNet = income - taxTotal - otherDeductions;
        
        if (incomeFlowChart) incomeFlowChart.destroy();
        incomeFlowChart = new Chart(incomeFlowCtx, {
          type: 'doughnut',
          data: {
            labels: ['Net Income', 'Taxes', 'Other Deductions'],
            datasets: [{
              data: [actualNet > 0 ? actualNet : 0, taxTotal, otherDeductions],
              backgroundColor: ['#7ed321', '#d0021b', '#f5a623'],
            }]
          },
          options: {
             responsive: true,
             plugins: {
                legend: { position: 'top' },
                datalabels: {
                   formatter: (value, ctx) => {
                      let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                      let percentage = (value * 100 / sum).toFixed(1) + '%';
                      return percentage;
                   },
                   color: '#fff',
                }
             }
          },
           plugins: [ChartDataLabels],
        });
        
        const expenseData = state.expenseCategories.map(cat => {
            return state.expenses
                .filter(exp => exp.category === cat)
                .reduce((sum, exp) => sum + exp.amount, 0);
        });

        if (expenseCategoryChart) expenseCategoryChart.destroy();
        expenseCategoryChart = new Chart(expenseCategoryCtx, {
          type: 'pie',
          data: {
            labels: state.expenseCategories,
            datasets: [{
              data: expenseData,
              backgroundColor: ['#4a90e2', '#50e3c2', '#f5a623', '#bd10e0', '#b8e986', '#7ed321', '#4a4a4a']
            }]
          },
          options: {
             responsive: true,
             plugins: {
                legend: { position: 'top' },
                datalabels: {
                   formatter: (value, ctx) => {
                      let sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                      if (sum === 0) return '0%';
                      let percentage = (value * 100 / sum).toFixed(1) + '%';
                      return percentage;
                   },
                   color: '#fff',
                }
             }
          },
           plugins: [ChartDataLabels],
        });
      };
      
      const fullUpdate = () => {
        renderExpenseCategories();
        renderExpensesList();
        renderCategorizedList('taxes');
        renderCategorizedList('preTax');
        renderCategorizedList('postTax');
        calculateAndUpdateAll();
      };

      // --- EVENT HANDLERS ---
      incomeInput.addEventListener('input', (e) => {
        state.income = parseFloat(e.target.value) || 0;
        calculateAndUpdateAll();
      });

      categorySections.forEach(section => {
        const category = section.dataset.category;
        const select = section.querySelector('.category-select');
        const inputContainer = section.querySelector('.category-input-container');
        const customNameInput = section.querySelector('.custom-name-input');
        const amountInput = section.querySelector('.amount-input');
        const addButton = section.querySelector('.add-item-btn');

        select.addEventListener('change', () => {
          if (select.value) {
            inputContainer.style.display = 'flex';
            customNameInput.style.display = select.value === 'custom' ? 'block' : 'none';
            if (select.value === 'custom') {
              customNameInput.focus();
            } else {
              amountInput.focus();
            }
          } else {
            inputContainer.style.display = 'none';
          }
        });
        
        addButton.addEventListener('click', () => {
          const amount = parseFloat(amountInput.value);
          if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount.');
            return;
          }
          
          let name;
          if (select.value === 'custom') {
            name = customNameInput.value.trim();
            if (!name) {
              alert('Please enter a name for the custom item.');
              return;
            }
          } else {
            name = select.options[select.selectedIndex].text;
          }
          
          // Check for duplicates
          if(state[category].some(item => item.name.toLowerCase() === name.toLowerCase())) {
            alert(`'${name}' already exists in this category.`);
            return;
          }

          state[category].push({ id: generateId(), name, amount });
          
          // Reset fields
          amountInput.value = '';
          customNameInput.value = '';
          select.value = '';
          inputContainer.style.display = 'none';
          
          renderCategorizedList(category);
          calculateAndUpdateAll();
        });
      });
      
      document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('item-delete-btn')) {
            const { id, category } = e.target.dataset;
            state[category] = state[category].filter(item => item.id !== id);
            fullUpdate();
        }
      });

      addCategoryBtn.addEventListener('click', () => {
        const newCategory = newCategoryInput.value.trim();
        if (newCategory && !state.expenseCategories.includes(newCategory)) {
          state.expenseCategories.push(newCategory);
          newCategoryInput.value = '';
          renderExpenseCategories();
        } else if (state.expenseCategories.includes(newCategory)) {
          alert('Category already exists.');
        }
      });
      
      addExpenseBtn.addEventListener('click', () => {
          const category = expenseCategorySelect.value;
          const name = expenseNameInput.value.trim();
          const amount = parseFloat(expenseAmountInput.value);

          if (!category || !name || isNaN(amount) || amount <= 0) {
              alert('Please fill all expense fields with valid data.');
              return;
          }
          
          state.expenses.push({ id: generateId(), category, name, amount });

          expenseNameInput.value = '';
          expenseAmountInput.value = '';
          
          renderExpensesList();
          calculateAndUpdateAll();
      });
      
      // Language and data persistence buttons
      langSelect.addEventListener('change', (e) => setLanguage(e.target.value));

      document.getElementById('save-button').addEventListener('click', () => {
        try {
          localStorage.setItem('budgetAppData', JSON.stringify(state));
          alert('Data saved successfully!');
        } catch (error) {
          console.error('Failed to save data:', error);
          alert('Failed to save data. Local storage might be full or disabled.');
        }
      });

      document.getElementById('load-button').addEventListener('click', () => {
        const savedData = localStorage.getItem('budgetAppData');
        if (savedData) {
          try {
            const loadedState = JSON.parse(savedData);
            // Simple merge to avoid breaking app with old data structures
             Object.assign(state, loadedState);
            // Re-populate inputs from loaded state
            incomeInput.value = state.income;
            langSelect.value = state.language;
            setLanguage(state.language); // this will trigger a full update
            alert('Data loaded successfully!');
          } catch(error) {
            console.error('Failed to parse saved data:', error);
            alert('Failed to load data. It might be corrupted.');
          }
        } else {
          alert('No saved data found.');
        }
      });
      
      document.getElementById('reset-button').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            localStorage.removeItem('budgetAppData');
            // Re-initialize state to default
            state = {
                language: state.language, // Keep language setting
                income: 0,
                taxes: [], preTax: [], postTax: [],
                expenses: [],
                expenseCategories: ['주거', '교통', '식비', '생활', '오락', '기타'],
            };
            incomeInput.value = '';
            setLanguage(state.language); // This triggers a full refresh
            alert('Data has been reset.');
        }
      });
      
      // --- INITIALIZATION ---
      const savedLang = localStorage.getItem('budgetAppLang');
      if (savedLang) {
          langSelect.value = savedLang;
          setLanguage(savedLang);
      } else {
          setLanguage('ko');
      }

    });
