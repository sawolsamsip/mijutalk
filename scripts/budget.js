    // 설정값
    const DEFAULT_DEDUCTIONS = {
        taxes: [
            "Federal Withholding", 
            "State Tax (CA)", 
            "OASDI (Social Security)", 
            "Medicare", 
            "CA SDI"
        ],
        preTax: [
            "401k Traditional",
            "Medical Premium",
            "Dental Premium",
            "Vision Premium",
            "MSEAP"
        ],
        postTax: [
            "401k Roth",
            "Stock Purchase Plan",
            "Legal Services",
            "LTD",
            "AD&D",
            "Accident Insurance",
            "Critical Illness"
        ]
    };

    const budgetData = {
        income: 0,
        taxes: [],
        preTax: [],
        postTax: [],
        expenses: [],
        categories: [
            { id: 'housing', name: '🏠 주거', nameEn: '🏠 Housing' },
            { id: 'food', name: '🍔 식비', nameEn: '🍔 Food' },
            { id: 'transportation', name: '🚗 교통', nameEn: '🚗 Transportation' },
            { id: 'health', name: '🏥 건강', nameEn: '🏥 Health' },
            { id: 'family', name: '👪 가족', nameEn: '👪 Family' },
            { id: 'shopping', name: '🛍️ 쇼핑', nameEn: '🛍️ Shopping' },
            { id: 'finance', name: '💳 금융', nameEn: '💳 Finance' },
            { id: 'travel', name: '✈️ 여행', nameEn: '✈️ Travel' },
            { id: 'saving', name: '💰 저축', nameEn: '💰 Saving' },
            { id: 'business', name: '💼 업무', nameEn: '💼 Business' }
        ],
        currentLanguage: 'ko'
    };

    let incomeFlowChartInstance = null;
    let expenseCategoryChartInstance = null;
    let editingItem = null;

    // --- 유틸리티 함수 ---
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    function formatMoney(amount) {
        if (Number.isNaN(amount)) return "0.00";
        return parseFloat(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function calculatePercentage(value, total) {
        if (total === 0) return "0.0%";
        return ((value / total) * 100).toFixed(1) + '%';
    }

    // --- 언어 전환 ---
    function switchLanguage(lang) {
        budgetData.currentLanguage = lang;
        document.querySelectorAll('[data-lang]').forEach(e => {
            if (e.getAttribute('data-lang') === lang) {
                e.classList.remove('hidden');
            } else {
                e.classList.add('hidden');
            }
        });

        document.querySelectorAll('[data-lang-ko-placeholder]').forEach(el => {
            const koPlaceholder = el.getAttribute('data-lang-ko-placeholder');
            const enPlaceholder = el.getAttribute('data-lang-en-placeholder');
            el.placeholder = (lang === 'ko') ? koPlaceholder : enPlaceholder;
        });

        document.getElementById('lang-ko').classList.toggle('active', lang === 'ko');
        document.getElementById('lang-en').classList.toggle('active', lang === 'en');

        populateCategorySelect();
        updateUI();
    }

    // --- 카테고리 셀렉트박스 채우기 ---
    function populateCategorySelect() {
        const select = document.getElementById('category-select');
        const prev = select.value;
        select.innerHTML = '';

        budgetData.categories.forEach(cat => {
            const o = document.createElement('option');
            o.value = cat.id;
            o.textContent = budgetData.currentLanguage === 'ko' ? cat.name : cat.nameEn || cat.name;
            select.appendChild(o);
        });

        const c = document.createElement('option');
        c.value = 'custom';
        c.textContent = budgetData.currentLanguage === 'ko' ? '✏️ 직접 입력' : '✏️ Custom Category';
        select.appendChild(c);

        if (budgetData.categories.some(cat => cat.id === prev) || prev === 'custom') {
            select.value = prev;
        } else {
            select.value = budgetData.categories[0] ? budgetData.categories[0].id : '';
        }
    }

    // --- 차트 업데이트 ---
    function updateCharts(grossIncome, preTaxTotal, taxTotal, postTaxTotal, expensesTotal, remaining) {
        if (incomeFlowChartInstance) incomeFlowChartInstance.destroy();
        if (expenseCategoryChartInstance) expenseCategoryChartInstance.destroy();

        const ctx1 = document.getElementById('incomeFlowChart').getContext('2d');
        incomeFlowChartInstance = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: [
                    budgetData.currentLanguage === 'ko' ? '세전 공제' : 'Pre-Tax Deductions',
                    budgetData.currentLanguage === 'ko' ? '세금' : 'Taxes',
                    budgetData.currentLanguage === 'ko' ? '세후 공제' : 'Post-Tax Deductions',
                    budgetData.currentLanguage === 'ko' ? '총 지출' : 'Total Expenses',
                    budgetData.currentLanguage === 'ko' ? '남은 잔액' : 'Remaining Balance'
                ],
                datasets: [{
                    data: [preTaxTotal, taxTotal, postTaxTotal, expensesTotal, Math.max(0, remaining)],
                    backgroundColor: ['#4895ef', '#f72585', '#4cc9f0', '#f8961e', '#43aa8b']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 13 } } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                                const percentage = total === 0 ? '0.0%' : ((value / total) * 100).toFixed(1) + '%';
                                return `${label}: $${formatMoney(value)} (${percentage})`;
                            }
                        }
                    }
                }
            }
        });

        const ctx2 = document.getElementById('expenseCategoryChart').getContext('2d');
        const categoryTotals = {};
        budgetData.expenses.forEach(item => {
            const cat = budgetData.categories.find(c => c.id === item.category);
            const label = budgetData.currentLanguage === 'ko' ? (cat?.name || '기타') : (cat?.nameEn || cat?.name || 'Other');
            if (!categoryTotals[label]) {
                categoryTotals[label] = 0;
            }
            categoryTotals[label] += item.amount;
        });

        expenseCategoryChartInstance = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: ['#4895ef', '#f72585', '#4cc9f0', '#f8961e', '#7209b7', '#b5179e', '#43aa8b', '#ffd60a', '#b5ead7', '#ffdac1']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 13 } } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((sum, current) => sum + current, 0);
                                const percentage = total === 0 ? '0.0%' : ((value / total) * 100).toFixed(1) + '%';
                                return `${label}: $${formatMoney(value)} (${percentage})`;
                            }
                        }
                    }
                }
            }
        });
    }

    // --- UI 전체 업데이트 ---
    function updateUI() {
        localStorage.setItem('budgetData', JSON.stringify(budgetData));

        const gross = budgetData.income;
        const pretax = budgetData.preTax.reduce((s, i) => s + i.amount, 0);
        const tax = budgetData.taxes.reduce((s, i) => s + i.amount, 0);
        const posttax = budgetData.postTax.reduce((s, i) => s + i.amount, 0);

        const totalDeduct = pretax + tax + posttax;
        const taxable = gross - pretax;
        const net = taxable - tax - posttax;
        const expenses = budgetData.expenses.reduce((s, i) => s + i.amount, 0);
        const remain = net - expenses;

        document.getElementById('income-input').value = gross;

        document.getElementById('gross-income').textContent = formatMoney(gross);
        document.getElementById('pre-tax-deductions').textContent = formatMoney(pretax);
        document.getElementById('taxable-income').textContent = formatMoney(taxable);
        document.getElementById('tax-total').textContent = formatMoney(tax);
        document.getElementById('post-tax-deductions').textContent = formatMoney(posttax);
        document.getElementById('total-deductions-taxes').textContent = formatMoney(totalDeduct);
        document.getElementById('net-income').textContent = formatMoney(net);

        document.getElementById('expenses-total-card').textContent = formatMoney(expenses);
        document.getElementById('remaining-balance').textContent = formatMoney(remain);

        const remainingBalanceElement = document.getElementById('remaining-balance');
        remainingBalanceElement.className = `card-amount ${remain >= 0 ? 'positive' : 'negative'}`;

        document.getElementById('expenses-percentage-card').textContent = calculatePercentage(expenses, gross);
        document.getElementById('remaining-percentage-card').textContent = calculatePercentage(remain, gross);

        renderList('tax-list', budgetData.taxes);
        renderList('pre-tax-list', budgetData.preTax);
        renderList('post-tax-list', budgetData.postTax);
        renderExpenses();

        populateCategorySelect();
        updateCharts(gross, pretax, tax, posttax, expenses, remain);
    }

    // --- 목록 렌더링 함수 ---
    function renderList(elementId, items) {
        const container = document.getElementById(elementId);
        const type = elementId.replace('-list', '');

        container.innerHTML = items.map(item => `
            <div class="list-item" data-id="${item.id}" data-type="${type}">
                ${editingItem && editingItem.id === item.id ?
                    `<div class="list-item-content">
                        <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '항목명' : 'Item name'}">
                        <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '금액' : 'Amount'}">
                    </div>
                    <div class="list-item-actions">
                        <button onclick="saveEdit('${type}','${item.id}')" class="btn-success">${budgetData.currentLanguage === 'ko' ? '저장' : 'Save'}</button>
                        <button onclick="cancelEdit()" class="btn-warning">${budgetData.currentLanguage === 'ko' ? '취소' : 'Cancel'}</button>
                    </div>`
                    :
                    `<div class="list-item-content">
                        <span>${item.name}: $${formatMoney(item.amount)}</span>
                    </div>
                    <div class="list-item-actions">
                        <button onclick="editItem('${type}','${item.id}')" class="btn-info">${budgetData.currentLanguage === 'ko' ? '수정' : 'Edit'}</button>
                        <button onclick="deleteItem('${type}','${item.id}')" class="btn-danger">${budgetData.currentLanguage === 'ko' ? '삭제' : 'Delete'}</button>
                    </div>`
                }
            </div>
        `).join('');
    }

    // --- 지출 목록 렌더링 함수 ---
    function renderExpenses() {
        const container = document.getElementById('expenses-list');
        container.innerHTML = budgetData.expenses.map(item => {
            const category = budgetData.categories.find(cat => cat.id === item.category);
            const categoryName = budgetData.currentLanguage === 'ko' ? category?.name : category?.nameEn || category?.name || 'Other';
            return `
                <div class="list-item" data-id="${item.id}" data-type="expenses">
                    ${editingItem && editingItem.id === item.id ?
                        `<div class="list-item-content">
                            <select id="edit-category-${item.id}" style="margin-right:7px;">
                                ${budgetData.categories.map(cat => `
                                    <option value="${cat.id}" ${cat.id === item.category ? 'selected' : ''}>
                                        ${budgetData.currentLanguage === 'ko' ? cat.name : cat.nameEn || cat.name}
                                    </option>
                                `).join('')}
                            </select>
                            <input type="text" value="${item.name}" id="edit-name-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '항목명' : 'Item name'}">
                            <input type="number" value="${item.amount}" id="edit-amount-${item.id}" placeholder="${budgetData.currentLanguage === 'ko' ? '금액' : 'Amount'}">
                        </div>
                        <div class="list-item-actions">
                            <button onclick="saveEdit('expenses','${item.id}')" class="btn-success">${budgetData.currentLanguage === 'ko' ? '저장' : 'Save'}</button>
                            <button onclick="cancelEdit()" class="btn-warning">${budgetData.currentLanguage === 'ko' ? '취소' : 'Cancel'}</button>
                        </div>`
                        :
                        `<div class="list-item-content">
                            <span class="badge">${categoryName || '📌 ' + (budgetData.currentLanguage === 'ko' ? '기타' : 'Other')}</span>
                            <span>${item.name}</span>
                        </div>
                        <span class="list-item-amount">$${formatMoney(item.amount)}</span>
                        <div class="list-item-actions">
                            <button onclick="editItem('expenses','${item.id}')" class="btn-info">${budgetData.currentLanguage === 'ko' ? '수정' : 'Edit'}</button>
                            <button onclick="deleteItem('expenses','${item.id}')" class="btn-danger">${budgetData.currentLanguage === 'ko' ? '삭제' : 'Delete'}</button>
                        </div>`
                    }
                </div>
            `;
        }).join('');
    }

    // --- CRUD 함수 ---
    function deleteItem(type, id) {
        if (confirm(budgetData.currentLanguage === 'ko' ? '정말로 삭제하시겠습니까?' : 'Are you sure you want to delete this item?')) {
            budgetData[type] = budgetData[type].filter(item => item.id !== id);
            updateUI();
        }
    }

    function editItem(type, id) {
        cancelEdit();
        const item = budgetData[type].find(item => item.id === id);
        if (item) {
            editingItem = { ...item, type: type };
            updateUI();
        }
    }

    function saveEdit(type, id) {
        const idx = budgetData[type].findIndex(item => item.id === id);
        if (idx === -1) return;

        const newNameInput = document.getElementById(`edit-name-${id}`);
        const newAmountInput = document.getElementById(`edit-amount-${id}`);

        const newName = newNameInput ? newNameInput.value.trim() : '';
        const newAmount = parseFloat(newAmountInput ? newAmountInput.value : '');

        if (!newName) {
            alert(budgetData.currentLanguage === 'ko' ? '항목명은 비워둘 수 없습니다.' : 'Item name cannot be empty.');
            return;
        }
        if (isNaN(newAmount)) {
            alert(budgetData.currentLanguage === 'ko' ? '유효한 금액을 입력해주세요.' : 'Please enter a valid amount.');
            return;
        }

        budgetData[type][idx].name = newName;
        budgetData[type][idx].amount = newAmount;

        if (type === 'expenses') {
            const newCategorySelect = document.getElementById(`edit-category-${id}`);
            const newCategory = newCategorySelect ? newCategorySelect.value : '';
            budgetData[type][idx].category = newCategory;
        }
        editingItem = null;
        updateUI();
    }

    function cancelEdit() {
        editingItem = null;
        updateUI();
    }

    // --- 데이터 저장/불러오기/초기화 ---
    function saveData() {
        localStorage.setItem('budgetData', JSON.stringify(budgetData));
        alert(budgetData.currentLanguage === 'ko' ? '데이터가 저장되었습니다!' : 'Data saved!');
    }

    function loadData() {
        const d = localStorage.getItem('budgetData');
        if (d) {
            const parsed = JSON.parse(d);

            budgetData.income = parsed.income || 0;
            budgetData.taxes = Array.isArray(parsed.taxes) ? parsed.taxes : [];
            budgetData.preTax = Array.isArray(parsed.preTax) ? parsed.preTax : [];
            budgetData.postTax = Array.isArray(parsed.postTax) ? parsed.postTax : [];
            budgetData.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];

            if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
                budgetData.categories = parsed.categories;
            }

            budgetData.currentLanguage = parsed.currentLanguage || 'ko';
        } else {
            initDefaultData();
        }
        updateUI();
    }

    function resetData() {
        if (confirm(budgetData.currentLanguage === 'ko' ? '모든 데이터를 초기화할까요? 이 작업은 되돌릴 수 없습니다.' : 'Reset all data? This action cannot be undone.')) {
            localStorage.removeItem('budgetData');
            initDefaultData();
            updateUI();
        }
    }

    function initDefaultData() {
        budgetData.income = 0;
        budgetData.taxes = [];
        budgetData.preTax = [];
        budgetData.postTax = [];
        budgetData.expenses = [];
        budgetData.categories = [
            { id: 'housing', name: '🏠 주거', nameEn: '🏠 Housing' },
            { id: 'food', name: '🍔 식비', nameEn: '🍔 Food' },
            { id: 'transportation', name: '🚗 교통', nameEn: '🚗 Transportation' },
            { id: 'health', name: '🏥 건강', nameEn: '🏥 Health' },
            { id: 'family', name: '👪 가족', nameEn: '👪 Family' },
            { id: 'shopping', name: '🛍️ 쇼핑', nameEn: '🛍️ Shopping' },
            { id: 'finance', name: '💳 금융', nameEn: '💳 Finance' },
            { id: 'travel', name: '✈️ 여행', nameEn: '✈️ Travel' },
            { id: 'saving', name: '💰 저축', nameEn: '💰 Saving' },
            { id: 'business', name: '💼 업무', nameEn: '💼 Business' }
        ];
        budgetData.currentLanguage = 'ko';
        localStorage.setItem('budgetData', JSON.stringify(budgetData));
    }

    // --- 이벤트 핸들러 ---
    function addExpense() {
        const categorySelect = document.getElementById('category-select');
        const nameInput = document.getElementById('expense-name-input');
        const amountInput = document.getElementById('expense-amount-input-main');

        const category = categorySelect.value;
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (category === 'custom') {
            alert(budgetData.currentLanguage === 'ko' ? '먼저 새 카테고리를 추가하거나 기존 카테고리를 선택하세요.' : 'Please add a new category or select an existing one first.');
            return;
        }
        if (!name) {
            alert(budgetData.currentLanguage === 'ko' ? '지출 항목 이름을 입력하세요.' : 'Enter expense name.');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert(budgetData.currentLanguage === 'ko' ? '유효한 금액을 입력하세요.' : 'Enter a valid amount.');
            return;
        }

        budgetData.expenses.push({
            id: generateUniqueId(),
            name,
            amount,
            category
        });

        nameInput.value = '';
        amountInput.value = '';
        categorySelect.value = budgetData.categories[0]?.id || '';

        updateUI();
    }

    function addCategory() {
        const newCategoryInput = document.getElementById('new-category-input');
        const name = newCategoryInput.value.trim();
        if (!name) {
            alert(budgetData.currentLanguage === 'ko' ? '카테고리 이름을 입력하세요.' : 'Enter category name.');
            return;
        }

        const existingCategory = budgetData.categories.find(
            cat => cat.name.toLowerCase() === name.toLowerCase() || cat.nameEn?.toLowerCase() === name.toLowerCase()
        );
        if (existingCategory) {
            alert(budgetData.currentLanguage === 'ko' ? '이미 존재하는 카테고리입니다.' : 'Category already exists.');
            return;
        }

        const id = generateUniqueId();
        const catObj = { id, name: name, nameEn: name };
        budgetData.categories.push(catObj);
        newCategoryInput.value = '';
        populateCategorySelect();
        document.getElementById('category-input-container').classList.add('hidden');
        document.getElementById('category-select').value = id;
        updateUI();
    }

    function handleTaxTypeSelect(type) {
        const selectElement = document.getElementById(`${type}-type-select`);
        const value = selectElement.value;
        
        if (value === 'custom') {
            document.getElementById(`${type}-custom-container`).classList.remove('hidden');
            return;
        }
        
        if (value && value !== 'custom') {
            const existingItem = budgetData[type].find(item => item.name === value);
            if (!existingItem) {
                budgetData[type].push({
                    id: generateUniqueId(),
                    name: value,
                    amount: 0,
                    type: type
                });
                updateUI();
            }
        }
        
        selectElement.selectedIndex = 0;
        document.getElementById(`${type}-custom-container`).classList.add('hidden');
    }

    function addCategorizedItem(type) {
        const nameInput = document.getElementById(`${type}-custom-name-input`);
        const amountInput = document.getElementById(`${type}-amount-input`);
        
        const name = nameInput.value.trim();
        const amount = parseFloat(amountInput.value);

        if (!name) {
            alert(budgetData.currentLanguage === 'ko' ? '이름을 입력하세요.' : 'Enter name.');
            return;
        }
        if (isNaN(amount)) {
            alert(budgetData.currentLanguage === 'ko' ? '유효한 금액을 입력하세요.' : 'Enter a valid amount.');
            return;
        }

        const existingItem = budgetData[type].find(item => 
            item.name.toLowerCase() === name.toLowerCase()
        );
        if (existingItem) {
            alert(budgetData.currentLanguage === 'ko' 
                ? '이미 존재하는 항목입니다. 수정하려면 목록에서 선택하세요.' 
                : 'This item already exists. To modify, select it from the list.');
            return;
        }

        budgetData[type].push({
            id: generateUniqueId(),
            name: name,
            amount: amount,
            type: type
        });

        nameInput.value = '';
        amountInput.value = '';
        document.getElementById(`${type}-custom-container`).classList.add('hidden');
        document.getElementById(`${type}-type-select`).selectedIndex = 0;
        
        updateUI();
    }

    // --- 이벤트 리스너 설정 ---
    function setupEventListeners() {
        document.getElementById('lang-ko').onclick = () => switchLanguage('ko');
        document.getElementById('lang-en').onclick = () => switchLanguage('en');
        
        document.getElementById('income-input').addEventListener('input', function(e) {
            budgetData.income = parseFloat(e.target.value) || 0;
            updateUI();
        });

        document.getElementById('tax-type-select').addEventListener('change', () => handleTaxTypeSelect('taxes'));
        document.getElementById('pre-tax-type-select').addEventListener('change', () => handleTaxTypeSelect('preTax'));
        document.getElementById('post-tax-type-select').addEventListener('change', () => handleTaxTypeSelect('postTax'));
        
        document.querySelector('[onclick="addCategorizedItem(\'taxes\')"]').onclick = () => addCategorizedItem('taxes');
        document.querySelector('[onclick="addCategorizedItem(\'preTax\')"]').onclick = () => addCategorizedItem('preTax');
        document.querySelector('[onclick="addCategorizedItem(\'postTax\')"]').onclick = () => addCategorizedItem('postTax');
        
        document.getElementById('category-select').addEventListener('change', function() {
            const container = document.getElementById('category-input-container');
            container.classList.toggle('hidden', this.value !== 'custom');
        });

        document.getElementById('tax-type-select').addEventListener('change', function() {
            document.getElementById('tax-custom-container').classList.toggle('hidden', this.value !== 'custom');
        });
        document.getElementById('pre-tax-type-select').addEventListener('change', function() {
            document.getElementById('pre-tax-custom-container').classList.toggle('hidden', this.value !== 'custom');
        });
        document.getElementById('post-tax-type-select').addEventListener('change', function() {
            document.getElementById('post-tax-custom-container').classList.toggle('hidden', this.value !== 'custom');
        });
    }

    // --- 초기화 ---
    function initialize() {
        setupEventListeners();
        loadData();
        switchLanguage(budgetData.currentLanguage);
    }

    // 페이지 로드 시 초기화
    window.onload = initialize;
