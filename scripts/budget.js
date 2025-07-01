document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const salaryGrossInput = document.getElementById('salary-gross');
    const salaryForm = document.getElementById('salary-form');
    const salarySummaryDiv = document.getElementById('salary-summary');

    // Tax inputs
    const taxInputs = {
        federal: document.getElementById('tax-federal'),
        state: document.getElementById('tax-state'),
        oasdi: document.getElementById('tax-oasdi'),
        medicare: document.getElementById('tax-medicare'),
        casdi: document.getElementById('tax-casdi'),
    };
    const taxCustomList = document.getElementById('tax-custom-list');

    // Pre-Tax Deduction inputs
    const preTaxDeductInputs = {
        medical: document.getElementById('deduct-medical'),
        dental: document.getElementById('deduct-dental'),
        vision: document.getElementById('deduct-vision'),
        '401k-trad': document.getElementById('deduct-401k-trad'),
    };
    const preTaxCustomList = document.getElementById('pre-tax-custom-list');

    // Post-Tax Deduction inputs
    const postTaxDeductInputs = {
        spp: document.getElementById('deduct-spp'),
        adnd: document.getElementById('deduct-adnd'),
        '401k-roth': document.getElementById('deduct-401k-roth'),
        ltd: document.getElementById('deduct-ltd'),
    };
    const postTaxCustomList = document.getElementById('post-tax-custom-list');

    // Expense inputs
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
        entertainment: document.getElementById('exp-entertainment'),
    };
    const expensesCustomList = document.getElementById('expenses-custom-list');

    // Summary displays
    const netSalaryDisplay = document.getElementById('net-salary-display');
    const totalTaxesDisplay = document.getElementById('total-taxes-display');
    const totalPreTaxDisplay = document.getElementById('total-pre-tax-display');
    const totalPostTaxDisplay = document.getElementById('total-post-tax-display');
    const totalExpensesDisplay = document.getElementById('total-expenses-display');
    const remainingBudgetDisplay = document.getElementById('remaining-budget-display');

    // Buttons
    const addCustomButtons = document.querySelectorAll('.add-custom-btn');
    const languageToggleBtn = document.getElementById('language-toggle');
    const darkmodeToggleBtn = document.getElementById('darkmode-toggle');
    const exportJsonBtn = document.getElementById('export-json-btn');
    const importJsonBtn = document.getElementById('import-json-btn');
    const importJsonInput = document.getElementById('import-json-input');
    const clearAllDataBtn = document.getElementById('clear-all-data-btn');
    const aiReportBtn = document.getElementById('ai-report-btn');
    const aiReportBox = document.getElementById('ai-report-box');

    // --- Data Storage (using localStorage) ---
    let grossSalary = 0;
    let customTaxes = [];
    let customPreTaxDeductions = [];
    let customPostTaxDeductions = [];
    let customExpenses = [];
    let currentLanguage = 'ko'; // Default language
    let isDarkMode = false; // Default dark mode state

    // --- Chart Instances ---
    let taxChart;
    let expensesChart;
    let budgetDistributionChart;

    // --- Internationalization (i18n) setup ---
    const translations = {
        en: {
            app_title: "Budgeting Tool",
            section_salary_title: "Gross Monthly Salary",
            label_gross_salary: "Gross Salary",
            btn_save: "Save",
            salary_summary_text: "Gross Monthly Salary: ${amount}",
            section_taxes_title: "Taxes",
            label_federal_withholding: "Federal Withholding",
            label_state_tax: "State Tax",
            label_oasdi: "OASDI",
            label_medicare: "Medicare",
            label_ca_sdi: "CA SDI",
            btn_add_item: "Add Item",
            label_item_name: "Item Name", // Added for custom item prompt
            label_item_amount: "Amount", // Added for custom item prompt
            section_pre_tax_title: "Pre-Tax Deductions",
            label_medical_premium: "Medical Premium",
            label_dental_premium: "Dental Premium",
            label_vision_premium: "Vision Premium",
            label_401k_traditional: "401k Traditional",
            section_post_tax_title: "Post-Tax Deductions",
            label_spp: "Stock Purchase Plan",
            label_adnd: "AD&D",
            label_401k_roth: "401k Roth",
            label_ltd: "LTD",
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
            label_deficit: "Deficit", // Added for chart when budget is negative
            section_data_title: "Data Management",
            btn_export: "Export JSON",
            btn_import: "Import JSON",
            btn_clear_all_data: "Clear All Data",
            section_ai_title: "AI Spending Report",
            btn_ai_report: "Generate AI Report",
            ai_report_placeholder: 'Click "Generate AI Report" to get insights into your spending habits.',
            alert_invalid_input: 'Please enter a valid positive number for all fields.',
            alert_name_amount_needed: 'Please enter a name and a positive amount for the item.',
            alert_import_success: 'Data imported successfully!',
            alert_import_failure: 'Failed to import data. Please check the file format.',
            alert_prompt_name: 'Enter item name:', // Added prompt text
            alert_prompt_amount: 'Enter amount:', // Added prompt text
            confirm_clear_data: 'Are you sure you want to clear all budget data? This action cannot be undone.',
            ai_report_intro: 'Here is your personalized AI spending report:\n\n',
            ai_report_positive_budget: 'Great job! You have a remaining budget of ${remainingBudget}. This indicates strong financial health and good planning. Consider allocating some of this surplus to savings, investments, or discretionary spending.',
            ai_report_negative_budget: 'It looks like you have a deficit of ${remainingBudget}. It\'s important to review your expenses. Focus on areas where you can cut back, such as ${highestExpenseCategory}, and consider increasing your income or adjusting your budget.',
            ai_report_taxes: 'Your taxes (Federal, State, OASDI, Medicare, CA SDI, and custom taxes) amount to ${totalTaxes}. This represents a significant portion of your gross salary.',
            ai_report_pre_tax: 'Pre-tax deductions (Medical, Dental, Vision, 401k Traditional, and custom pre-tax items) total ${totalPreTaxDeductions}. These deductions reduce your taxable income.',
            ai_report_post_tax: 'Post-tax deductions (Stock Purchase Plan, AD&D, 401k Roth, LTD, and custom post-tax items) total ${totalPostTaxDeductions}. These are taken from your net pay.',
            ai_report_expenses_breakdown: 'Your total expenses are ${totalExpenses}. The largest categories are:\n${expenseBreakdown}',
            ai_report_next_steps: '\n\n**Next Steps:**\n* **Review high expenses:** Identify where you can cut back, especially in categories like dining out or shopping.\n* **Increase savings:** If you have a surplus, set up automatic transfers to a savings account or investment fund.\n* **Adjust budget categories:** Make sure your budget aligns with your financial goals.\n* **Seek professional advice:** For complex financial planning, consider consulting a financial advisor.',
            ai_report_no_data: 'Please enter your salary and expenses to generate an AI report.'

        },
        ko: {
            app_title: "예산 관리 도구",
            section_salary_title: "월별 총 급여",
            label_gross_salary: "총 급여",
            btn_save: "저장",
            salary_summary_text: "월별 총 급여: ${amount}",
            section_taxes_title: "세금",
            label_federal_withholding: "연방 원천징수",
            label_state_tax: "주 세금",
            label_oasdi: "OASDI",
            label_medicare: "메디케어",
            label_ca_sdi: "CA SDI",
            btn_add_item: "항목 추가",
            label_item_name: "항목 이름",
            label_item_amount: "금액",
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
            label_deficit: "적자",
            section_data_title: "데이터 관리",
            btn_export: "JSON 내보내기",
            btn_import: "JSON 가져오기",
            btn_clear_all_data: "모든 데이터 지우기",
            section_ai_title: "AI 지출 보고서",
            btn_ai_report: "AI 보고서 생성",
            ai_report_placeholder: '"AI 보고서 생성"을 클릭하여 지출 습관에 대한 통찰력을 얻으세요.',
            alert_invalid_input: '모든 필드에 유효한 양수를 입력해주세요.',
            alert_name_amount_needed: '항목 이름과 양수를 입력해주세요.',
            alert_import_success: '데이터를 성공적으로 가져왔습니다!',
            alert_import_failure: '데이터 가져오기에 실패했습니다. 파일 형식을 확인해주세요.',
            alert_prompt_name: '항목 이름을 입력하세요:',
            alert_prompt_amount: '금액을 입력하세요:',
            confirm_clear_data: '모든 예산 데이터를 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.',
            ai_report_intro: '귀하의 맞춤형 AI 지출 보고서입니다:\n\n',
            ai_report_positive_budget: '훌륭합니다! ${remainingBudget}의 남은 예산이 있습니다. 이는 강력한 재정 상태와 좋은 계획을 나타냅니다. 이 잉여 자금을 저축, 투자 또는 자유 지출에 할당하는 것을 고려해 보세요.',
            ai_report_negative_budget: '${remainingBudget}의 적자가 있는 것 같습니다. 지출을 검토하는 것이 중요합니다. ${highestExpenseCategory}와 같이 줄일 수 있는 영역에 집중하고, 수입을 늘리거나 예산을 조정하는 것을 고려해 보세요.',
            ai_report_taxes: '귀하의 세금(연방, 주, OASDI, 메디케어, CA SDI 및 사용자 정의 세금)은 총 ${totalTaxes}입니다. 이는 총 급여의 상당 부분을 차지합니다.',
            ai_report_pre_tax: '세전 공제액(의료, 치과, 시력 보험료, 401k 일반 및 사용자 정의 세전 항목)은 총 ${totalPreTaxDeductions}입니다. 이러한 공제액은 과세 소득을 줄여줍니다.',
            ai_report_post_tax: '세후 공제액(주식 구매 계획, AD&D, 401k Roth, LTD 및 사용자 정의 세후 항목)은 총 ${totalPostTaxDeductions}입니다. 이는 순 급여에서 공제됩니다.',
            ai_report_expenses_breakdown: '총 지출은 ${totalExpenses}입니다. 가장 큰 카테고리는 다음과 같습니다:\n${expenseBreakdown}',
            ai_report_next_steps: '\n\n**다음 단계:**\n* **높은 지출 검토:** 특히 외식이나 쇼핑과 같은 범주에서 줄일 수 있는 부분을 파악하세요.\n* **저축 증대:** 잉여 자금이 있다면, 저축 계좌나 투자 펀드로 자동 이체를 설정하세요.\n* **예산 범주 조정:** 예산이 재정 목표에 부합하는지 확인하세요.\n* **전문가 조언 구하기:** 복잡한 재정 계획의 경우, 재정 고문과 상담하는 것을 고려해 보세요.'
        }
    };

    function setLanguage(lang) {
        currentLanguage = lang;
        document.documentElement.lang = lang; // Set HTML lang attribute
        document.querySelectorAll('[data-i18n-key]').forEach(element => {
            const key = element.dataset.i18nKey;
            // Handle placeholders for input elements (like "Item Name" in custom inputs)
            if (element.tagName === 'INPUT' && element.placeholder && translations[lang][`label_${key}`]) {
                 element.placeholder = translations[lang][`label_${key}`];
            } else if (translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });
        languageToggleBtn.textContent = lang === 'ko' ? 'EN' : 'KO';

        // Re-render custom items to apply new language for placeholders
        renderCustomItems(taxCustomList, customTaxes, 'tax');
        renderCustomItems(preTaxCustomList, customPreTaxDeductions, 'pre-tax');
        renderCustomItems(postTaxCustomList, customPostTaxDeductions, 'post-tax');
        renderCustomItems(expensesCustomList, customExpenses, 'expense');

        updateDisplay(); // Update display to reflect translated text in summaries/charts
    }

    // --- Core Calculation & Display Functions ---

    // Helper to get total from a set of inputs (standard + custom)
    function getTotal(inputs, customItems) {
        let total = 0;
        for (const key in inputs) {
            total += parseFloat(inputs[key].value) || 0;
        }
        customItems.forEach(item => {
            total += parseFloat(item.amount) || 0;
        });
        return total;
    }

    // Main update function
    function updateDisplay() {
        const totalTaxes = getTotal(taxInputs, customTaxes);
        const totalPreTaxDeductions = getTotal(preTaxDeductInputs, customPreTaxDeductions);
        const totalPostTaxDeductions = getTotal(postTaxDeductInputs, customPostTaxDeductions);
        const totalExpenses = getTotal(expenseInputs, customExpenses);

        const taxableIncome = grossSalary - totalPreTaxDeductions;
        const netSalary = taxableIncome - totalTaxes - totalPostTaxDeductions;
        const remainingBudget = netSalary - totalExpenses;

        salarySummaryDiv.textContent = translations[currentLanguage].salary_summary_text.replace('${amount}', `$${grossSalary.toFixed(2)}`);
        netSalaryDisplay.textContent = `$${netSalary.toFixed(2)}`;
        totalTaxesDisplay.textContent = `$${totalTaxes.toFixed(2)}`;
        totalPreTaxDisplay.textContent = `$${totalPreTaxDeductions.toFixed(2)}`;
        totalPostTaxDisplay.textContent = `$${totalPostTaxDeductions.toFixed(2)}`;
        totalExpensesDisplay.textContent = `$${totalExpenses.toFixed(2)}`;
        remainingBudgetDisplay.textContent = `$${remainingBudget.toFixed(2)}`;

        // Conditional styling for remaining budget
        if (remainingBudget < 0) {
            remainingBudgetDisplay.style.color = 'var(--danger-color)';
        } else {
            remainingBudgetDisplay.style.color = 'var(--primary-color)'; // Revert to default/positive color
        }

        updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions);
        saveData(); // Save data to localStorage after every update
    }

    // --- Custom Item Management ---
    function createCustomItemHTML(item, type) {
        const li = document.createElement('div');
        li.classList.add('custom-item');
        li.dataset.id = item.id;
        li.innerHTML = `
            <input type="text" value="${item.name}" placeholder="${translations[currentLanguage].label_item_name}" readonly>
            <input type="number" value="${item.amount}" min="0" placeholder="${translations[currentLanguage].label_item_amount}" readonly>
            <button class="delete-custom-btn" data-id="${item.id}" data-type="${type}"><i class="ri-delete-bin-line"></i></button>
        `;

        // Add event listener for editing
        const nameInput = li.querySelector('input[type="text"]');
        const amountInput = li.querySelector('input[type="number"]');

        [nameInput, amountInput].forEach(input => {
            input.addEventListener('dblclick', () => {
                input.readOnly = false;
                input.focus();
            });
            input.addEventListener('blur', () => {
                input.readOnly = true;
                const newName = nameInput.value.trim();
                const newAmount = parseFloat(amountInput.value);

                if (newName === '' || isNaN(newAmount) || newAmount < 0) {
                    alert(translations[currentLanguage].alert_name_amount_needed);
                    // Revert to old value if invalid
                    nameInput.value = item.name;
                    amountInput.value = item.amount;
                    return;
                }

                // Update the item in the array
                const targetArray = getCustomArrayByType(type);
                const index = targetArray.findIndex(i => i.id === item.id);
                if (index !== -1) {
                    targetArray[index].name = newName;
                    targetArray[index].amount = newAmount;
                }
                updateDisplay(); // Recalculate on edit
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    input.blur(); // Trigger blur to save
                }
            });
            // Attach input event listener for immediate calculation update
            input.addEventListener('input', updateDisplay);
        });

        return li;
    }

    function renderCustomItems(listElement, customArray, type) {
        listElement.innerHTML = '';
        customArray.forEach(item => {
            listElement.appendChild(createCustomItemHTML(item, type));
        });
        attachDeleteListeners(listElement, type);
    }

    function addCustomItem(type) {
        const name = prompt(translations[currentLanguage].alert_prompt_name || 'Enter item name:');
        if (!name) return;

        const amountStr = prompt(translations[currentLanguage].alert_prompt_amount || 'Enter amount:');
        const amount = parseFloat(amountStr);

        if (isNaN(amount) || amount < 0) {
            alert(translations[currentLanguage].alert_invalid_input);
            return;
        }

        const newItem = { id: Date.now(), name, amount };
        const targetArray = getCustomArrayByType(type);
        targetArray.push(newItem);
        updateDisplay();
        renderCustomItems(getCustomListElementByType(type), targetArray, type);
    }

    function deleteCustomItem(id, type) {
        let targetArray = getCustomArrayByType(type);
        targetArray = targetArray.filter(item => item.id !== id);
        setCustomArrayByType(type, targetArray); // Update the global array reference
        updateDisplay();
        renderCustomItems(getCustomListElementByType(type), targetArray, type);
    }

    function attachDeleteListeners(listElement, type) {
        listElement.querySelectorAll('.delete-custom-btn').forEach(button => {
            button.onclick = (e) => {
                const id = parseInt(e.target.dataset.id || e.target.closest('button').dataset.id);
                deleteCustomItem(id, type);
            };
        });
    }

    function getCustomArrayByType(type) {
        switch (type) {
            case 'tax': return customTaxes;
            case 'pre-tax': return customPreTaxDeductions;
            case 'post-tax': return customPostTaxDeductions;
            case 'expense': return customExpenses;
            default: return [];
        }
    }

    function getCustomListElementByType(type) {
        switch (type) {
            case 'tax': return taxCustomList;
            case 'pre-tax': return preTaxCustomList;
            case 'post-tax': return postTaxCustomList;
            case 'expense': return expensesCustomList;
            default: return null;
        }
    }

    function setCustomArrayByType(type, newArray) {
        switch (type) {
            case 'tax': customTaxes = newArray; break;
            case 'pre-tax': customPreTaxDeductions = newArray; break;
            case 'post-tax': customPostTaxDeductions = newArray; break;
            case 'expense': customExpenses = newArray; break;
        }
    }


    // --- Chart.js Integration ---
    function initializeCharts() {
        // --- ADDED: Destroy existing chart instances before creating new ones ---
        if (taxChart) {
            taxChart.destroy();
            console.log('Destroyed existing taxChart.'); // For debugging
        }
        if (expensesChart) {
            expensesChart.destroy();
            console.log('Destroyed existing expensesChart.'); // For debugging
        }
        if (budgetDistributionChart) {
            budgetDistributionChart.destroy();
            console.log('Destroyed existing budgetDistributionChart.'); // For debugging
        }
        // --- END ADDED ---

        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: getComputedStyle(document.body).getPropertyValue('--chart-text-color'),
                    }
                }
            },
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
        };

        // Tax Chart
        taxChart = new Chart(document.getElementById('tax-chart'), {
            type: 'bar',
            data: {
                labels: [], // Populated in updateCharts
                datasets: [{
                    label: translations[currentLanguage].section_taxes_title || 'Taxes',
                    data: [], // Populated in updateCharts
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: chartOptions
        });

        // Expenses Chart
        expensesChart = new Chart(document.getElementById('expenses-chart'), {
            type: 'pie',
            data: {
                labels: [], // Populated in updateCharts
                datasets: [{
                    label: translations[currentLanguage].section_expenses_title || 'Expenses Breakdown',
                    data: [], // Populated in updateCharts
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#C9CBCF', '#8BC34A', '#FF9800', '#673AB7',
                        '#E67C73', '#F6BF26', '#33B679', '#039BE5', '#7986CB', '#8E24AA', '#E91E63', '#9C27B0'
                    ], // More colors for more expenses
                    hoverOffset: 4
                }]
            },
            options: chartOptions
        });

        // Budget Distribution Chart (Pie)
        budgetDistributionChart = new Chart(document.getElementById('budget-distribution-chart'), {
            type: 'doughnut',
            data: {
                labels: [], // Populated in updateCharts
                datasets: [{
                    label: translations[currentLanguage].section_summary_title || 'Budget Distribution',
                    data: [], // Populated in updateCharts
                    backgroundColor: [],
                    hoverOffset: 4
                }]
            },
            options: chartOptions
        });

        // --- Debugging line: confirm initialization ---
        console.log('Charts initialized successfully.');
    }

    function updateCharts(totalTaxes, totalExpenses, netSalary, remainingBudget, totalPreTaxDeductions, totalPostTaxDeductions) {
        // Update Tax Chart
        const taxLabels = [];
        const taxData = [];
        for (const key in taxInputs) {
            const value = parseFloat(taxInputs[key].value) || 0;
            if (value > 0) {
                taxLabels.push(taxInputs[key].previousElementSibling.textContent); // Get label text
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
        taxChart.data.datasets[0].label = translations[currentLanguage].section_taxes_title; // Update label
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
        expensesChart.data.datasets[0].label = translations[currentLanguage].section_expenses_title; // Update label
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
            '#FF6384', // Taxes
            '#36A2EB', // Pre-Tax Deductions
            '#FFCE56', // Post-Tax Deductions
            '#4BC0C0', // Expenses
            '#4CAF50'  // Remaining Budget (Green)
        ];
        // If remaining budget is negative, change color to red and label
        if (remainingBudget < 0) {
            budgetColors[4] = '#F44336'; // Red for negative budget
            budgetData[4] = Math.abs(remainingBudget); // Show absolute value of deficit
            budgetLabels[4] = translations[currentLanguage].label_deficit || 'Deficit'; // Label as Deficit
        }


        budgetDistributionChart.data.labels = budgetLabels;
        budgetDistributionChart.data.datasets[0].data = budgetData;
        budgetDistributionChart.data.datasets[0].backgroundColor = budgetColors;
        budgetDistributionChart.data.datasets[0].label = translations[currentLanguage].section_summary_title; // Update label
        budgetDistributionChart.update();

        // Update chart text color based on dark mode
        const chartTextColor = getComputedStyle(document.body).getPropertyValue('--chart-text-color');
        const chartGridColor = getComputedStyle(document.body).getPropertyValue('--chart-grid-color');

        [taxChart, expensesChart, budgetDistributionChart].forEach(chart => {
            // Check if chart and its options/scales exist before trying to update properties
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
            if (chart) { // Only update if chart instance exists
                chart.update(); // Re-render with new colors
            }
        });
    }

    // --- Data Persistence (LocalStorage) ---
    function saveData() {
        const data = {
            grossSalary: grossSalary,
            taxInputs: {},
            preTaxDeductInputs: {},
            postTaxDeductInputs: {},
            expenseInputs: {},
            customTaxes: customTaxes,
            customPreTaxDeductions: customPreTaxDeductions,
            customPostTaxDeductions: customPostTaxDeductions,
            customExpenses: customExpenses,
            language: currentLanguage,
            darkMode: isDarkMode
        };

        // Save values from standard inputs
        for (const key in taxInputs) data.taxInputs[key] = parseFloat(taxInputs[key].value) || 0;
        for (const key in preTaxDeductInputs) data.preTaxDeductInputs[key] = parseFloat(preTaxDeductInputs[key].value) || 0;
        for (const key in postTaxDeductInputs) data.postTaxDeductInputs[key] = parseFloat(postTaxDeductInputs[key].value) || 0;
        for (const key in expenseInputs) data.expenseInputs[key] = parseFloat(expenseInputs[key].value) || 0;

        localStorage.setItem('budgetData', JSON.stringify(data));
    }

    function loadData() {
        const storedData = localStorage.getItem('budgetData');
        if (storedData) {
            const data = JSON.parse(storedData);

            grossSalary = data.grossSalary || 0;
            salaryGrossInput.value = grossSalary;

            for (const key in taxInputs) taxInputs[key].value = data.taxInputs[key] || 0;
            for (const key in preTaxDeductInputs) preTaxDeductInputs[key].value = data.preTaxDeductInputs[key] || 0;
            for (const key in postTaxDeductInputs) postTaxDeductInputs[key].value = data.postTaxDeductInputs[key] || 0;
            for (const key in expenseInputs) expenseInputs[key].value = data.expenseInputs[key] || 0;

            customTaxes = data.customTaxes || [];
            customPreTaxDeductions = data.customPreTaxDeductions || [];
            customPostTaxDeductions = data.customPostTaxDeductions || [];
            customExpenses = data.customExpenses || [];

            isDarkMode = data.darkMode === true; // Ensure boolean
            currentLanguage = data.language || 'ko'; // Default to Korean if not set

            renderCustomItems(taxCustomList, customTaxes, 'tax');
            renderCustomItems(preTaxCustomList, customPreTaxDeductions, 'pre-tax');
            renderCustomItems(postTaxCustomList, customPostTaxDeductions, 'post-tax');
            renderCustomItems(expensesCustomList, customExpenses, 'expense');

            applyDarkMode(isDarkMode);
            setLanguage(currentLanguage); // Apply language after loading

            updateDisplay(); // Recalculate and display
        } else {
            // Set initial values if no data exists
            grossSalary = 0;
            salaryGrossInput.value = 0;
            for (const key in taxInputs) taxInputs[key].value = 0;
            for (const key in preTaxDeductInputs) preTaxDeductInputs[key].value = 0;
            for (const key in postTaxDeductInputs) postTaxDeductInputs[key].value = 0;
            for (const key in expenseInputs) expenseInputs[key].value = 0;

            applyDarkMode(isDarkMode); // Apply default dark mode
            setLanguage(currentLanguage); // Apply default language
            updateDisplay(); // Initialize display
        }
    }

    function clearAllData() {
        if (confirm(translations[currentLanguage].confirm_clear_data)) {
            localStorage.removeItem('budgetData');
            // Reset all values to 0 and clear custom lists
            grossSalary = 0;
            salaryGrossInput.value = 0;

            for (const key in taxInputs) taxInputs[key].value = 0;
            for (const key in preTaxDeductInputs) preTaxDeductInputs[key].value = 0;
            for (const key in postTaxDeductInputs) postTaxDeductInputs[key].value = 0;
            for (const key in expenseInputs) expenseInputs[key].value = 0;

            customTaxes = [];
            customPreTaxDeductions = [];
            customPostTaxDeductions = [];
            customExpenses = [];

            renderCustomItems(taxCustomList, customTaxes, 'tax');
            renderCustomItems(preTaxCustomList, customPreTaxDeductions, 'pre-tax');
            renderCustomItems(postTaxCustomList, customPostTaxDeductions, 'post-tax');
            renderCustomItems(expensesCustomList, customExpenses, 'expense');

            aiReportBox.innerHTML = `<p>${translations[currentLanguage].ai_report_placeholder}</p>`;

            updateDisplay();
        }
    }

    // --- Dark Mode Toggler ---
    function applyDarkMode(enable) {
        if (enable) {
            document.body.classList.add('dark-mode');
            darkmodeToggleBtn.innerHTML = '<i class="ri-sun-line"></i>'; // Sun icon for light mode
        } else {
            document.body.classList.remove('dark-mode');
            darkmodeToggleBtn.innerHTML = '<i class="ri-moon-line"></i>'; // Moon icon for dark mode
        }
        // Update charts to reflect new theme colors
        // Ensure chart instances exist before attempting to update them
        if (taxChart && expensesChart && budgetDistributionChart) {
            updateCharts(
                getTotal(taxInputs, customTaxes),
                getTotal(expenseInputs, customExpenses),
                grossSalary - getTotal(preTaxDeductions, customPreTaxDeductions) - getTotal(postTaxDeductions, customPostTaxDeductions), // Net salary part
                (grossSalary - getTotal(preTaxDeductInputs, customPreTaxDeductions) - getTotal(taxInputs, customTaxes) - getTotal(postTaxDeductInputs, customPostTaxDeductions)) - getTotal(expenseInputs, customExpenses), // Remaining budget part
                getTotal(preTaxDeductInputs, customPreTaxDeductions),
                getTotal(postTaxDeductInputs, customPostTaxDeductions)
            );
        }
    }

    // --- Event Listeners ---

    // Salary Form
    salaryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newSalary = parseFloat(salaryGrossInput.value);
        if (!isNaN(newSalary) && newSalary >= 0) {
            grossSalary = newSalary;
            updateDisplay();
        } else {
            alert(translations[currentLanguage].alert_invalid_input);
        }
    });

    // Listen for changes on all standard number inputs to update display
    // IMPORTANT: Attach input event listener to all number inputs
    const allNumberInputs = document.querySelectorAll('.form-grid input[type="number"]');
    allNumberInputs.forEach(input => {
        input.addEventListener('input', updateDisplay);
    });

    // Add Custom Item Buttons
    addCustomButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            addCustomItem(type);
        });
    });

    // Language Toggle
    languageToggleBtn.addEventListener('click', () => {
        const newLang = currentLanguage === 'ko' ? 'en' : 'ko';
        setLanguage(newLang);
    });

    // Dark Mode Toggle
    darkmodeToggleBtn.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        applyDarkMode(isDarkMode);
        saveData();
    });

    // Export JSON
    exportJsonBtn.addEventListener('click', () => {
        const dataToExport = {
            grossSalary: grossSalary,
            taxInputs: {},
            preTaxDeductInputs: {},
            postTaxDeductInputs: {},
            expenseInputs: {},
            customTaxes: customTaxes,
            customPreTaxDeductions: customPreTaxDeductions,
            customPostTaxDeductions: customPostTaxDeductions,
            customExpenses: customExpenses,
        };

        // Get current values from standard inputs
        for (const key in taxInputs) dataToExport.taxInputs[key] = parseFloat(taxInputs[key].value) || 0;
        for (const key in preTaxDeductInputs) dataToExport.preTaxDeductInputs[key] = parseFloat(preTaxDeductInputs[key].value) || 0;
        for (const key in postTaxDeductInputs) dataToExport.postTaxDeductInputs[key] = parseFloat(postTaxDeductInputs[key].value) || 0;
        for (const key in expenseInputs) dataToExport.expenseInputs[key] = parseFloat(expenseInputs[key].value) || 0;


        const dataStr = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'budget_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Import JSON
    importJsonBtn.addEventListener('click', () => {
        importJsonInput.click(); // Trigger file input click
    });

    importJsonInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    // Validate and apply imported data
                    if (importedData && typeof importedData.grossSalary === 'number') {
                        grossSalary = importedData.grossSalary;
                        salaryGrossInput.value = grossSalary;

                        for (const key in taxInputs) taxInputs[key].value = importedData.taxInputs[key] || 0;
                        for (const key in preTaxDeductInputs) preTaxDeductInputs[key].value = importedData.preTaxDeductInputs[key] || 0;
                        for (const key in postTaxDeductInputs) postTaxDeductInputs[key].value = importedData.postTaxDeductInputs[key] || 0;
                        for (const key in expenseInputs) expenseInputs[key].value = importedData.expenseInputs[key] || 0;

                        customTaxes = importedData.customTaxes || [];
                        customPreTaxDeductions = importedData.customPreTaxDeductions || [];
                        customPostTaxDeductions = importedData.customPostTaxDeductions || [];
                        customExpenses = importedData.customExpenses || [];

                        renderCustomItems(taxCustomList, customTaxes, 'tax');
                        renderCustomItems(preTaxCustomList, customPreTaxDeductions, 'pre-tax');
                        renderCustomItems(postTaxCustomList, customPostTaxDeductions, 'post-tax');
                        renderCustomItems(expensesCustomList, customExpenses, 'expense');

                        updateDisplay();
                        alert(translations[currentLanguage].alert_import_success);
                    } else {
                        throw new Error("Invalid JSON format.");
                    }
                } catch (error) {
                    console.error("Error importing JSON:", error);
                    alert(translations[currentLanguage].alert_import_failure);
                }
                // Clear the input so the same file can be selected again
                event.target.value = '';
            };
            reader.readAsText(file);
        }
    });

    // Clear All Data
    clearAllDataBtn.addEventListener('click', clearAllData);

    // AI Report Button
    aiReportBtn.addEventListener('click', () => {
        if (grossSalary <= 0) {
            aiReportBox.textContent = translations[currentLanguage].ai_report_no_data;
            return;
        }

        const totalTaxes = getTotal(taxInputs, customTaxes);
        const totalPreTaxDeductions = getTotal(preTaxDeductInputs, customPreTaxDeductions);
        const totalPostTaxDeductions = getTotal(postTaxDeductInputs, customPostTaxDeductions);
        const totalExpenses = getTotal(expenseInputs, customExpenses);

        const taxableIncome = grossSalary - totalPreTaxDeductions;
        const netSalary = taxableIncome - totalTaxes - totalPostTaxDeductions;
        const remainingBudget = netSalary - totalExpenses;

        let report = translations[currentLanguage].ai_report_intro;

        // Overall Budget Summary
        if (remainingBudget >= 0) {
            report += translations[currentLanguage].ai_report_positive_budget.replace('${remainingBudget}', `$${remainingBudget.toFixed(2)}`) + '\n\n';
        } else {
            // Find highest expense category for negative budget advice
            const allExpenses = [];
            for(const key in expenseInputs) {
                const value = parseFloat(expenseInputs[key].value) || 0;
                if (value > 0) {
                    // Use a unique key for lookup later if needed, or just the text
                    allExpenses.push({ name: expenseInputs[key].previousElementSibling.textContent, amount: value });
                }
            }
            customExpenses.forEach(item => {
                if (item.amount > 0) {
                    allExpenses.push(item);
                }
            });
            allExpenses.sort((a, b) => b.amount - a.amount);
            const highestExpenseCategory = allExpenses.length > 0 ? allExpenses[0].name : (translations[currentLanguage].label_expenses || 'your expenses');

            report += translations[currentLanguage].ai_report_negative_budget
                .replace('${remainingBudget}', `$${Math.abs(remainingBudget).toFixed(2)}`)
                .replace('${highestExpenseCategory}', highestExpenseCategory) + '\n\n';
        }

        // Taxes breakdown
        report += translations[currentLanguage].ai_report_taxes.replace('${totalTaxes}', `$${totalTaxes.toFixed(2)}`) + '\n\n';

        // Pre-Tax Deductions breakdown
        report += translations[currentLanguage].ai_report_pre_tax.replace('${totalPreTaxDeductions}', `$${totalPreTaxDeductions.toFixed(2)}`) + '\n\n';

        // Post-Tax Deductions breakdown
        report += translations[currentLanguage].ai_report_post_tax.replace('${totalPostTaxDeductions}', `$${totalPostTaxDeductions.toFixed(2)}`) + '\n\n';

        // Detailed Expense Breakdown
        report += translations[currentLanguage].ai_report_expenses_breakdown.replace('${totalExpenses}', `$${totalExpenses.toFixed(2)}`) + '\n';
        const expenseDetails = [];
        for (const key in expenseInputs) {
            const value = parseFloat(expenseInputs[key].value) || 0;
            if (value > 0) {
                expenseDetails.push(`- ${expenseInputs[key].previousElementSibling.textContent}: $${value.toFixed(2)}`);
            }
        }
        customExpenses.forEach(item => {
            if (item.amount > 0) {
                expenseDetails.push(`- ${item.name}: $${item.amount.toFixed(2)}`);
            }
        });
        report += expenseDetails.length > 0 ? expenseDetails.join('\n') : '- No specific expenses recorded.';
        report += translations[currentLanguage].ai_report_next_steps;

        aiReportBox.textContent = report;
    });

    // --- Initialization ---
    initializeCharts(); // Call once on DOMContentLoaded
    loadData(); // Load data and update display on page load
});
