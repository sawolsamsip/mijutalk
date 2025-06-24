  <script>
    // 1. 기본 공제 항목 정의
    const DEFAULT_DEDUCTIONS = {
      taxes: [
        { name: "Federal Withholding", amount: 0 },
        { name: "State Tax (CA)", amount: 0 },
        { name: "OASDI (Social Security)", amount: 0 },
        { name: "Medicare", amount: 0 },
        { name: "CA SDI", amount: 0 }
      ],
      preTax: [
        { name: "401k Traditional", amount: 0 },
        { name: "Medical Premium", amount: 0 },
        { name: "Dental Premium", amount: 0 },
        { name: "Vision Premium", amount: 0 },
        { name: "MSEAP", amount: 0 }
      ],
      postTax: [
        { name: "401k Roth", amount: 0 },
        { name: "Legal Services", amount: 0 },
        { name: "LTD", amount: 0 },
        { name: "Stock Purchase Plan", amount: 0 },
        { name: "AD&D", amount: 0 },
        { name: "Critical Illness", amount: 0 },
        { name: "Accident Insurance", amount: 0 }
      ]
    };

    // 2. 초기 데이터 구조
    const budgetData = {
      income: 0,
      taxes: [],
      preTax: [],
      postTax: [],
      expenses: [],
      categories: [
        { id: 'housing', name: '🏠 주거' },
        { id: 'food', name: '🍔 식비' },
        { id: 'transportation', name: '🚗 교통' },
        { id: 'health', name: '🏥 건강' },
        { id: 'family', name: '👪 가족' },
        { id: 'shopping', name: '🛍️ 쇼핑' },
        { id: 'finance', name: '💳 금융' },
        { id: 'travel', name: '✈️ 여행' },
        { id: 'saving', name: '💰 저축' },
        { id: 'business', name: '💼 업무' }
      ]
    };

    // Chart instances
    let incomeFlowChartInstance = null;
    let expenseCategoryChartInstance = null;

    // Helper to generate unique IDs
    function generateUniqueId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    // 3. 기본 데이터 초기화 함수
    function initDefaultData() {
      budgetData.taxes = DEFAULT_DEDUCTIONS.taxes.map(item => ({
        ...item,
        id: generateUniqueId(),
        type: 'taxes'
      }));

      budgetData.preTax = DEFAULT_DEDUCTIONS.preTax.map(item => ({
        ...item,
        id: generateUniqueId(),
        type: 'preTax'
      }));

      budgetData.postTax = DEFAULT_DEDUCTIONS.postTax.map(item => ({
        ...item,
        id: generateUniqueId(),
        type: 'postTax'
      }));

      budgetData.income = 0;
      budgetData.expenses = [];
      budgetData.categories = [
        { id: 'housing', name: '🏠 주거' },
        { id: 'food', name: '🍔 식비' },
        { id: 'transportation', name: '🚗 교통' },
        { id: 'health', name: '🏥 건강' },
        { id: 'family', name: '👪 가족' },
        { id: 'shopping', name: '🛍️ 쇼핑' },
        { id: 'finance', name: '💳 금융' },
        { id: 'travel', name: '✈️ 여행' },
        { id: 'saving', name: '💰 저축' },
        { id: 'business', name: '💼 업무' }
      ];

      localStorage.setItem('budgetData', JSON.stringify(budgetData));
      console.log("✅ 기본 항목 생성됨");
    }

    // 4. 공통 함수들
    function formatMoney(amount) {
      if (isNaN(amount) || amount === null) return "0.00";
      return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function calculatePercentage(value, totalIncome) {
        if (totalIncome === 0) return "0.0%"; // Avoid division by zero
        return ((value / totalIncome) * 100).toFixed(1) + '%';
    }

    // Function to generate distinct colors for charts
    function generateColors(num) {
        const colors = [
            '#42A5F5', '#66BB6A', '#FFCA28', '#EF5350', '#AB47BC', '#78909C', '#26A69A', '#FF7043',
            '#7E57C2', '#BDBDBD', '#FFEE58', '#8D6E63', '#9CCC65', '#29B6F6', '#FFAB91', '#AFB42B'
        ];
        // Cycle through or pick distinct colors if more are needed
        return Array.from({ length: num }, (_, i) => colors[i % colors.length]);
    }

    function updateUI() {
      // Save data immediately
      localStorage.setItem('budgetData', JSON.stringify(budgetData));

      // Calculations
      const grossIncome = budgetData.income;
      const preTaxTotal = budgetData.preTax.reduce((sum, item) => sum + item.amount, 0);
      const taxTotal = budgetData.taxes.reduce((sum, item) => sum + item.amount, 0);
      const postTaxTotal = budgetData.postTax.reduce((sum, item) => sum + item.amount, 0);
      const totalDeductionsAndTaxes = preTaxTotal + taxTotal + postTaxTotal; // New calculation
      const taxableIncome = grossIncome - preTaxTotal;
      const netIncome = taxableIncome - taxTotal - postTaxTotal;
      const expensesTotal = budgetData.expenses.reduce((sum, item) => sum + item.amount, 0);
      const remaining = netIncome - expensesTotal;

      // Update income input
      document.getElementById('income').value = grossIncome;

      // Update flow section
      document.getElementById('gross-income').textContent = formatMoney(grossIncome);

      document.getElementById('pre-tax-deductions').innerHTML =
        `${formatMoney(preTaxTotal)} <em class="percentage highlighted-percentage">(${calculatePercentage(preTaxTotal, grossIncome)})</em>`;

      document.getElementById('taxable-income').innerHTML =
        `${formatMoney(taxableIncome)} <em class="percentage highlighted-percentage">(${calculatePercentage(taxableIncome, grossIncome)})</em>`;

      document.getElementById('tax-total').innerHTML =
        `${formatMoney(taxTotal)} <em class="percentage highlighted-percentage">(${calculatePercentage(taxTotal, grossIncome)})</em>`;

      document.getElementById('post-tax-deductions').innerHTML =
        `${formatMoney(postTaxTotal)} <em class="percentage highlighted-percentage">(${calculatePercentage(postTaxTotal, grossIncome)})</em>`;

      // Update new total deductions and taxes
      document.getElementById('total-deductions-taxes').innerHTML =
        `${formatMoney(totalDeductionsAndTaxes)} <em class="percentage highlighted-percentage">(${calculatePercentage(totalDeductionsAndTaxes, grossIncome)})</em>`;

      document.getElementById('net-income').innerHTML =
        `${formatMoney(netIncome)} <em class="percentage highlighted-percentage">(${calculatePercentage(netIncome, grossIncome)})</em>`;

      // Update summary cards
      document.getElementById('expenses-total-card').textContent = formatMoney(expensesTotal);
      document.getElementById('remaining-balance').textContent = formatMoney(remaining);

      const remainingElement = document.getElementById('remaining-balance');
      remainingElement.textContent = formatMoney(remaining);
      remainingElement.className = `card-amount ${remaining >= 0 ? 'positive' : 'negative'}`; // Set class based on remaining amount

      // Update percentages on summary cards
      document.getElementById('expenses-percentage-card').textContent = calculatePercentage(expensesTotal, grossIncome);
      document.getElementById('remaining-percentage-card').textContent = calculatePercentage(remaining, grossIncome);

      // Render lists
      renderList('tax-list', budgetData.taxes, grossIncome);
      renderList('pre-tax-list', budgetData.preTax, grossIncome);
      renderList('post-tax-list', budgetData.postTax, grossIncome);
      renderExpenses(grossIncome);
      populateCategorySelect();
      
      // Update Charts
      updateCharts(grossIncome, preTaxTotal, taxTotal, postTaxTotal, expensesTotal, remaining);
    }

    let editingItem = null;

    function renderList(elementId, items, totalIncome) {
      const container = document.getElementById(elementId);
      const type = elementId.replace('-list', '');
      const total = items.reduce((sum, item) => sum + item.amount, 0);

      container.innerHTML = `
        ${items.map(item => `
          <div class="expense-item" data-id="${item.id}" data-type="${type}">
            ${editingItem && editingItem.id === item.id ?
              `<div class="expense-item-content">
                 <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="항목명">
                 <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="금액">
               </div>
               <div class="expense-item-actions">
                 <button onclick="saveEdit('${type}', '${item.id}')" class="save-edit-btn">저장</button>
                 <button onclick="cancelEdit()" class="cancel-edit-btn">취소</button>
               </div>`
              :
              `<div class="expense-item-content">
                 <span>${item.name}: $${formatMoney(item.amount)}</span>
               </div>
               <div class="expense-item-actions">
                 <button onclick="editItem('${type}', '${item.id}')" class="edit-btn">수정</button>
                 <button onclick="deleteItem('${type}', '${item.id}')" class="delete-btn">삭제</button>
               </div>`
            }
          </div>
        `).join('')}
        <div class="total-summary">
          <div class="summary-row">
            <span class="summary-label">총 ${getTypeName(type)}</span>
            <span class="summary-value">$${formatMoney(total)} <span class="percentage">(${calculatePercentage(total, totalIncome)})</span></span>
          </div>
        </div>
      `;
    }

    function renderExpenses(totalIncome) {
      const container = document.getElementById('expenses-list');
      const total = budgetData.expenses.reduce((sum, item) => sum + item.amount, 0);

      container.innerHTML = `
        ${budgetData.expenses.map(item => {
          const category = budgetData.categories.find(cat => cat.id === item.category);
          return `
            <div class="expense-item" data-id="${item.id}" data-type="expenses">
              ${editingItem && editingItem.id === item.id ?
                `<div class="expense-item-content">
                   <select id="edit-category-${item.id}" style="width: auto; margin-right: 5px;">
                     ${budgetData.categories.map(cat => `<option value="${cat.id}" ${cat.id === item.category ? 'selected' : ''}>${cat.name}</option>`).join('')}
                   </select>
                   <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="항목명">
                   <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="금액">
                 </div>
                 <div class="expense-item-actions">
                   <button onclick="saveEdit('expenses', '${item.id}')" class="save-edit-btn">저장</button>
                   <button onclick="cancelEdit()" class="cancel-edit-btn">취소</button>
                 </div>`
                :
                `<div class="expense-item-content">
                   <span class="badge">${category ? category.name : '📌 (알 수 없음)'}</span>
                   <span>${item.name}</span>
                 </div>
                 <span class="expense-item-amount">$${formatMoney(item.amount)}</span>
                 <div class="expense-item-actions">
                   <button onclick="editItem('expenses', '${item.id}')" class="edit-btn">수정</button>
                   <button onclick="deleteItem('expenses', '${item.id}')" class="delete-btn">삭제</button>
                 </div>`
              }
            </div>
          `;
        }).join('')}
        <div class="total-summary">
          <div class="summary-row">
            <span class="summary-label">총 지출</span>
            <span class="summary-value">$${formatMoney(total)} <span class="percentage">(${calculatePercentage(total, totalIncome)})</span></span>
          </div>
        </div>
      `;
    }

    function getTypeName(type) {
      const names = {
        'taxes': '세금',
        'preTax': '세전 공제',
        'postTax': '세후 공제',
        'expenses': '지출'
      };
      return names[type] || type;
    }

    function populateCategorySelect() {
      const select = document.getElementById('category');
      const currentSelected = select.value;
      select.innerHTML = '';

      budgetData.categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });

      const customOption = document.createElement('option');
      customOption.value = 'custom';
      customOption.textContent = '✏️ 직접 입력';
      select.appendChild(customOption);

      if (budgetData.categories.some(cat => cat.id === currentSelected) || currentSelected === 'custom') {
        select.value = currentSelected;
      } else {
        select.value = budgetData.categories[0] ? budgetData.categories[0].id : '';
      }
    }

    // 5. CRUD 함수들
    function deleteItem(type, id) {
      if (confirm('정말로 삭제하시겠습니까?')) {
        budgetData[type] = budgetData[type].filter(item => item.id !== id);
        updateUI();
      }
    }

    function editItem(type, id) {
      cancelEdit(); // 기존 수정 모드 해제
      const item = budgetData[type].find(item => item.id === id);
      if (item) {
        editingItem = { ...item, type: type };
        updateUI(); // UI를 다시 그려서 수정 모드를 반영
      }
    }

    function saveEdit(type, id) {
      const itemIndex = budgetData[type].findIndex(item => item.id === id);
      if (itemIndex === -1) return;

      const newName = document.getElementById(`edit-name-${id}`).value.trim();
      const newAmount = parseFloat(document.getElementById(`edit-amount-${id}`).value);

      if (!newName) {
        alert('항목명은 비워둘 수 없습니다.');
        return;
      }
      if (isNaN(newAmount)) {
        alert('유효한 금액을 입력해주세요.');
        return;
      }

      budgetData[type][itemIndex].name = newName;
      budgetData[type][itemIndex].amount = newAmount;

      if (type === 'expenses') {
        const newCategory = document.getElementById(`edit-category-${id}`).value;
        budgetData[type][itemIndex].category = newCategory;
      }

      editingItem = null; // 수정 상태 해제
      updateUI();
    }

    function cancelEdit() {
      if (editingItem) {
        editingItem = null;
        updateUI(); // 수정 모드 해제 후 UI 다시 그리기
      }
    }

    function updateCategorizedItem(type) {
      const prefix = type === 'taxes' ? 'tax' : (type === 'preTax' ? 'pre-tax' : 'post-tax');
      const selectElement = document.getElementById(`${prefix}-type`);
      const inputAmountElement = document.getElementById(`${prefix}-amount`);
      const customNameElement = document.getElementById(`${prefix}-custom-name`);

      let name = selectElement.value;
      const amount = parseFloat(inputAmountElement.value);

      if (name === 'custom') {
        name = customNameElement.value.trim();
        if (!name) {
          alert('직접 입력 항목명을 입력해주세요!');
          return;
        }
      }

      if (!name || isNaN(amount)) {
        alert('항목과 금액을 정확히 입력해주세요!');
        return;
      }

      let item = budgetData[type].find(item => item.name === name);

      if (item) {
        item.amount = amount;
      } else {
        budgetData[type].push({
          id: generateUniqueId(),
          type: type,
          name,
          amount
        });
      }

      updateUI();
      inputAmountElement.value = '0';
      customNameElement.value = '';
      selectElement.value = '';
      document.getElementById(`${prefix}-custom-container`).style.display = 'none';
    }

    function addExpense() {
      const category = document.getElementById('category').value;
      const name = document.getElementById('expense-name').value.trim();
      const amount = parseFloat(document.getElementById('expense-amount').value);

      if (!name || isNaN(amount)) {
        alert('항목명과 금액을 입력해주세요!');
        return;
      }

      budgetData.expenses.push({
        id: generateUniqueId(),
        type: 'expenses',
        category,
        name,
        amount
      });

      updateUI();
      document.getElementById('expense-name').value = '';
      document.getElementById('expense-amount').value = '';
    }

    function addCategory() {
      const newCategoryName = document.getElementById('new-category').value.trim();
      if (!newCategoryName) {
        alert('카테고리명을 입력해주세요!');
        return;
      }

      const emoji = prompt('이모지를 입력해주세요 (예: 🎮)', '📌');
      const id = newCategoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      if (budgetData.categories.some(cat => cat.id === id)) {
        alert('이미 같은 이름의 카테고리가 존재합니다. 다른 이름을 사용해주세요.');
        return;
      }

      budgetData.categories.push({
        id: id,
        name: `${emoji || '📌'} ${newCategoryName}`
      });

      populateCategorySelect();
      document.getElementById('category').value = id;

      document.getElementById('new-category').value = '';
      document.getElementById('category-input-container').style.display = 'none';

      updateUI();
    }

    // Chart Functions
    function updateCharts(grossIncome, preTaxTotal, taxTotal, postTaxTotal, expensesTotal, remaining) {
        // --- 1. Income Flow Chart (총 수입 대비 배분) ---
        let incomeFlowLabels = [];
        let incomeFlowData = [];
        let incomeFlowColors = [];
        const baseColors = generateColors(5); // Enough for common categories

        if (grossIncome <= 0) {
            incomeFlowLabels = ['수입 없음'];
            incomeFlowData = [1]; // Use a dummy value to make the pie chart visible
            incomeFlowColors = ['#DCDCDC'];
        } else {
            if (preTaxTotal > 0) {
                incomeFlowLabels.push('세전 공제');
                incomeFlowData.push(preTaxTotal);
                incomeFlowColors.push(baseColors[0]);
            }
            if (taxTotal > 0) {
                incomeFlowLabels.push('세금');
                incomeFlowData.push(taxTotal);
                incomeFlowColors.push(baseColors[1]);
            }
            if (postTaxTotal > 0) {
                incomeFlowLabels.push('세후 공제');
                incomeFlowData.push(postTaxTotal);
                incomeFlowColors.push(baseColors[2]);
            }
            
            let effectiveExpenses = expensesTotal;
            let effectiveRemaining = remaining;

            // If remaining is negative, treat it as part of "total expenses"
            // for chart visualization. Pie charts don't handle negative values well.
            if (remaining < 0) {
                effectiveExpenses += Math.abs(remaining);
                effectiveRemaining = 0; // Set remaining to 0 for the chart
            }

            if (effectiveExpenses > 0) {
                incomeFlowLabels.push('총 지출');
                incomeFlowData.push(effectiveExpenses);
                incomeFlowColors.push(baseColors[3]);
            }
            if (effectiveRemaining > 0) { // Only add positive remaining to the chart
                incomeFlowLabels.push('남은 잔액');
                incomeFlowData.push(effectiveRemaining);
                incomeFlowColors.push(baseColors[4]);
            }
            
            // If all values are zero but gross income is positive, show it as 'Remaining'
            if (incomeFlowData.reduce((a, b) => a + b, 0) === 0 && grossIncome > 0) {
                incomeFlowLabels = ['남은 잔액'];
                incomeFlowData = [grossIncome];
                incomeFlowColors = ['#2ecc71']; // Green for remaining
            }
        }

        const incomeFlowCtx = document.getElementById('incomeFlowChart').getContext('2d');
        if (incomeFlowChartInstance) {
            incomeFlowChartInstance.destroy(); // Destroy existing chart
        }
        incomeFlowChartInstance = new Chart(incomeFlowCtx, {
            type: 'pie',
            data: {
                labels: incomeFlowLabels,
                datasets: [{
                    data: incomeFlowData,
                    backgroundColor: incomeFlowColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow charts to resize within their containers
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                          boxWidth: 12,
                          pdding: 10,
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const value = context.parsed;
                                const sum = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = sum === 0 ? '0.0' : (value / sum * 100).toFixed(1);
                                return `${label}$${formatMoney(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // --- 2. Expense Category Chart (총 지출 대비 비중) ---
        const expenseCategoryMap = new Map();
        budgetData.expenses.forEach(expense => {
            const categoryName = budgetData.categories.find(cat => cat.id === expense.category)?.name || '기타';
            expenseCategoryMap.set(categoryName, (expenseCategoryMap.get(categoryName) || 0) + expense.amount);
        });

        let expenseCategoryLabels = Array.from(expenseCategoryMap.keys());
        let expenseCategoryData = Array.from(expenseCategoryMap.values());
        let expenseCategoryColors = generateColors(expenseCategoryLabels.length);

        // Handle case where total expenses are zero
        if (expenseCategoryData.reduce((sum, val) => sum + val, 0) === 0) {
            expenseCategoryLabels = ['지출 없음'];
            expenseCategoryData = [1]; // Dummy value to show an empty pie chart visually
            expenseCategoryColors = ['#DCDCDC']; // Gray for no expenses
        }

        const expenseCategoryCtx = document.getElementById('expenseCategoryChart').getContext('2d');
        if (expenseCategoryChartInstance) {
            expenseCategoryChartInstance.destroy(); // Destroy existing chart
        }
        expenseCategoryChartInstance = new Chart(expenseCategoryCtx, {
            type: 'pie',
            data: {
                labels: expenseCategoryLabels,
                datasets: [{
                    data: expenseCategoryData,
                    backgroundColor: expenseCategoryColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // Allow charts to resize within their containers
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                const value = context.parsed;
                                const sum = context.dataset.data.reduce((a, b) => a + b, 0);
                                // Handle sum of 0 to prevent NaN for percentage
                                const percentage = sum === 0 ? '0.0' : (value / sum * 100).toFixed(1);
                                return `${label}$${formatMoney(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // 6. 유틸리티 함수들
    function saveData() {
      try {
        updateUI();

        const dataStr = JSON.stringify(budgetData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `budget_data_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          alert('데이터가 성공적으로 저장되었습니다!');
        }, 1000);
      } catch (error) {
        console.error('저장 중 오류 발생:', error);
        alert('데이터 저장 중 오류가 발생했습니다: ' + error.message);
      }
    }

    function loadData() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';

      input.onchange = async e => {
        const file = e.target.files[0];
        if (!file) return;

        try {
          const fileContent = await readFileAsText(file);
          const loadedData = JSON.parse(fileContent);

          if (!loadedData ||
              !Array.isArray(loadedData.taxes) ||
              !Array.isArray(loadedData.preTax) ||
              !Array.isArray(loadedData.postTax) ||
              !Array.isArray(loadedData.expenses)) {
            throw new Error('잘못된 데이터 형식입니다. 파일이 손상되었거나 올바른 형식의 파일이 아닙니다.');
          }

          Object.assign(budgetData, {
            income: loadedData.income !== undefined ? loadedData.income : 0,
            taxes: loadedData.taxes,
            preTax: loadedData.preTax,
            postTax: loadedData.postTax,
            expenses: loadedData.expenses
          });

          if (Array.isArray(loadedData.categories)) {
            const currentCategoryIds = new Set(budgetData.categories.map(c => c.id));
            loadedData.categories.forEach(newCat => {
              if (!currentCategoryIds.has(newCat.id)) {
                budgetData.categories.push(newCat);
              }
            });
          }

          DEFAULT_DEDUCTIONS.taxes.forEach(defaultItem => {
            if (!budgetData.taxes.some(item => item.name === defaultItem.name)) {
                budgetData.taxes.push({ ...defaultItem, id: generateUniqueId(), type: 'taxes' });
            }
          });
          DEFAULT_DEDUCTIONS.preTax.forEach(defaultItem => {
            if (!budgetData.preTax.some(item => item.name === defaultItem.name)) {
                budgetData.preTax.push({ ...defaultItem, id: generateUniqueId(), type: 'preTax' });
            }
          });
          DEFAULT_DEDUCTIONS.postTax.forEach(defaultItem => {
            if (!budgetData.postTax.some(item => item.name === defaultItem.name)) {
                budgetData.postTax.push({ ...defaultItem, id: generateUniqueId(), type: 'postTax' });
            }
          });

          updateUI();
          alert('데이터가 성공적으로 불러와졌습니다!');
        } catch (error) {
          console.error('불러오기 오류:', error);
          alert('파일을 읽거나 처리하는 중 오류가 발생했습니다:\n' + error.message);
        }
      };

      input.click();
    }

    function readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = error => reject(error);
        reader.readAsText(file);
      });
    }

    function resetData() {
      if (confirm('정말로 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
        localStorage.removeItem('budgetData');
        initDefaultData();
        updateUI();
        alert('모든 데이터가 초기화되었습니다.');
      }
    }

    // 7. 초기화 및 이벤트 리스너 설정
    document.addEventListener('DOMContentLoaded', function() {
      // Load saved data or initialize default data
      if (!localStorage.getItem('budgetData')) {
        initDefaultData();
      } else {
        const savedData = JSON.parse(localStorage.getItem('budgetData'));
        // Deep copy to ensure original objects are not mutated
        budgetData.income = savedData.income || 0;
        budgetData.taxes = savedData.taxes ? savedData.taxes.map(item => ({...item})) : [];
        budgetData.preTax = savedData.preTax ? savedData.preTax.map(item => ({...item})) : [];
        budgetData.postTax = savedData.postTax ? savedData.postTax.map(item => ({...item})) : [];
        budgetData.expenses = savedData.expenses ? savedData.expenses.map(item => ({...item})) : [];
        budgetData.categories = savedData.categories ? savedData.categories.map(item => ({...item})) : [
            { id: 'housing', name: '🏠 주거' }, { id: 'food', name: '🍔 식비' },
            { id: 'transportation', name: '🚗 교통' }, { id: 'health', name: '🏥 건강' },
            { id: 'family', name: '👪 가족' }, { id: 'shopping', name: '🛍️ 쇼핑' },
            { id: 'finance', name: '💳 금융' }, { id: 'travel', name: '✈️ 여행' },
            { id: 'saving', name: '💰 저축' }, { id: 'business', name: '💼 업무' }
          ];

        // Ensure default deduction types are present if missing after loading
        DEFAULT_DEDUCTIONS.taxes.forEach(defaultItem => {
            if (!budgetData.taxes.some(item => item.name === defaultItem.name)) {
                budgetData.taxes.push({ ...defaultItem, id: generateUniqueId(), type: 'taxes' });
            }
        });
        DEFAULT_DEDUCTIONS.preTax.forEach(defaultItem => {
            if (!budgetData.preTax.some(item => item.name === defaultItem.name)) {
                budgetData.preTax.push({ ...defaultItem, id: generateUniqueId(), type: 'preTax' });
            }
        });
        DEFAULT_DEDUCTIONS.postTax.forEach(defaultItem => {
            if (!budgetData.postTax.some(item => item.name === defaultItem.name)) {
                budgetData.postTax.push({ ...defaultItem, id: generateUniqueId(), type: 'postTax' });
            }
        });
      }

      populateCategorySelect();

      // Event listeners for select boxes to show/hide custom input
      document.querySelectorAll('select[id$="-type"]').forEach(select => {
        select.addEventListener('change', function() {
          const type = this.id.replace('-type', '');
          const container = document.getElementById(`${type}-custom-container`);
          const customNameInput = document.getElementById(`${type}-custom-name`);
          const amountInput = document.getElementById(`${type}-amount`);

          if (this.value === 'custom') {
            container.style.display = 'flex';
            customNameInput.focus();
          } else {
            container.style.display = 'none';
            const existingItem = budgetData[type].find(item => item.name === this.value);
            amountInput.value = existingItem ? existingItem.amount : '0';
            amountInput.focus();
          }
        });
      });

      document.getElementById('category').addEventListener('change', function() {
        const container = document.getElementById('category-input-container');
        if (this.value === 'custom') {
          container.style.display = 'flex';
          document.getElementById('new-category').focus();
        } else {
          container.style.display = 'none';
        }
      });

      document.getElementById('income').addEventListener('input', function() {
        budgetData.income = parseFloat(this.value) || 0;
        updateUI();
      });

      // Event listeners for 'Enter' key to apply input
      document.getElementById('tax-amount').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('taxes'); });
      document.getElementById('pre-tax-amount').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('preTax'); });
      document.getElementById('post-tax-amount').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('postTax'); });
      document.getElementById('expense-amount').addEventListener('keypress', function(e) { if (e.key === 'Enter') addExpense(); });
      document.getElementById('tax-custom-name').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('taxes'); });
      document.getElementById('pre-tax-custom-name').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('preTax'); });
      document.getElementById('post-tax-custom-name').addEventListener('keypress', function(e) { if (e.key === 'Enter') updateCategorizedItem('postTax'); });
      document.getElementById('new-category').addEventListener('keypress', function(e) { if (e.key === 'Enter') addCategory(); });

      // Initial UI update and chart rendering after DOM is loaded
      updateUI();
    });
  </script>
