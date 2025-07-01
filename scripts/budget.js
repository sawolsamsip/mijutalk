document.addEventListener('DOMContentLoaded', () => {

    // ---------------------------------- //
    // 1. I18N Language Management        //
    // ---------------------------------- //
// 1. I18N Language Management
    const locales = {
        en: {
            app_title: "Budget",
            section_salary_title: "Gross Monthly Salary",
            label_gross_salary: "Gross Salary",
            btn_save: "Save",
            section_taxes_title: "Taxes",
            section_pre_tax_title: "Pre-Tax Deductions",
            section_post_tax_title: "Post-Tax Deductions",
            btn_add_item: "Add Item",
            placeholder_item_name: "Item Name",
            placeholder_amount: "Amount",
            btn_delete: "Delete",
            // ▼▼▼ ADD THESE NEW LINES ▼▼▼
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
            // ▲▲▲ END OF NEW LINES ▲▲▲
            section_data_title: "Data Management",
            btn_export: "Export JSON",
            btn_import: "Import JSON",
            section_ai_title: "AI Spending Report",
            btn_ai_report: "Generate AI Report",
            ai_report_placeholder: "Your AI-generated spending analysis and savings tips will appear here...",
        },
        ko: {
            app_title: "가계부",
            section_salary_title: "세전 월급 입력",
            label_gross_salary: "세전 월급",
            btn_save: "저장",
            section_taxes_title: "세금 항목",
            section_pre_tax_title: "세전 공제 항목",
            section_post_tax_title: "세후 공제 항목",
            btn_add_item: "항목 추가",
            placeholder_item_name: "항목명",
            placeholder_amount: "금액",
            btn_delete: "삭제",
            // ▼▼▼ ADD THESE NEW LINES ▼▼▼
            section_expenses_title: "지출 관리",
            label_rent_mortgage: "주거비 (월세/이자)",
            label_utilities: "공과금 (전기/수도 등)",
            label_internet: "인터넷",
            label_phone: "통신비",
            label_groceries: "식료품",
            label_dining_out: "외식/배달",
            label_transportation: "교통비",
            label_shopping: "쇼핑",
            label_health_wellness: "건강/웰빙",
            label_entertainment: "문화/여가",
            // ▲▲▲ END OF NEW LINES ▲▲▲
            section_data_title: "데이터 백업/복원",
            btn_export: "내보내기 (JSON)",
            btn_import: "가져오기 (JSON)",
            section_ai_title: "AI 소비 리포트",
            btn_ai_report: "AI 리포트 생성",
            ai_report_placeholder: "AI가 생성한 지출 분석 및 절약 팁이 여기에 표시됩니다...",
        }
    };

    let currentLang = localStorage.getItem('budgetLang') || 'ko';
    const langToggleBtn = document.getElementById('language-toggle');

    const setLanguage = (lang) => {
        currentLang = lang;
        localStorage.setItem('budgetLang', lang);
        document.documentElement.lang = lang;
        langToggleBtn.textContent = lang === 'ko' ? 'EN' : 'KO';

        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (locales[lang][key]) {
                // Handle different element types (e.g., input placeholders vs. text content)
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (el.placeholder) el.placeholder = locales[lang][key];
                } else {
                    el.innerHTML = locales[lang][key];
                }
            }
        });
    };
    
    langToggleBtn.addEventListener('click', () => {
        setLanguage(currentLang === 'ko' ? 'en' : 'ko');
    });


    // ---------------------------------- //
    // 2. Dark Mode Management            //
    // ---------------------------------- //
    const darkModeToggle = document.getElementById('darkmode-toggle');
    const icon = darkModeToggle.querySelector('i');

    const enableDarkMode = () => {
        document.body.classList.add('dark-mode');
        icon.classList.replace('ri-moon-line', 'ri-sun-line');
        localStorage.setItem('budgetTheme', 'dark');
    };

    const disableDarkMode = () => {
        document.body.classList.remove('dark-mode');
        icon.classList.replace('ri-sun-line', 'ri-moon-line');
        localStorage.setItem('budgetTheme', 'light');
    };

    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });


    // ---------------------------------- //
    // 3. Dynamic Row Management          //
    // ---------------------------------- //
    document.querySelectorAll('.add-custom-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const type = e.currentTarget.dataset.type;
            const listId = `${type}-custom-list`;
            const list = document.getElementById(listId);
            
            const div = document.createElement('div');
            div.className = 'custom-row';
            
            const namePlaceholder = locales[currentLang].placeholder_item_name;
            const amountPlaceholder = locales[currentLang].placeholder_amount;
            const deleteLabel = locales[currentLang].btn_delete;

            div.innerHTML = `
                <input type="text" placeholder="${namePlaceholder}" class="${type}-custom-name">
                <input type="number" min="0" placeholder="${amountPlaceholder}" class="${type}-custom-amount">
                <button type="button" class="delete-btn" aria-label="${deleteLabel}">
                    <i class="ri-delete-bin-line"></i>
                </button>
            `;
            list.appendChild(div);
            
            div.querySelector('.delete-btn').addEventListener('click', () => {
                div.remove();
            });
        });
    });

    // ---------------------------------- //
    // 4. AI Report Simulation            //
    // ---------------------------------- //
    const aiReportBtn = document.getElementById('ai-report-btn');
    const aiReportBox = document.getElementById('ai-report-box');
    
    aiReportBtn.addEventListener('click', () => {
        aiReportBox.textContent = locales[currentLang].ai_report_placeholder;
        // Simulate API call
        setTimeout(() => {
            const reportText = currentLang === 'ko' 
                ? `📊 **월간 지출 분석**\n\n- **주요 지출 항목:** 식비 (45%), 교통비 (20%)\n- **지난달 대비:** 총 지출이 5% 감소했습니다. 훌륭합니다!\n\n💡 **절약 팁**\n\n1.  **식비 관리:** 외식 비중이 높습니다. 주 2회 직접 요리하여 월 ₩150,000을 절약해 보세요.\n2.  **구독 서비스 검토:** 사용하지 않는 구독 서비스를 해지하여 고정 지출을 줄이세요.`
                : `📊 **Monthly Spending Analysis**\n\n- **Top Spending Categories:** Food (45%), Transportation (20%)\n- **Month-over-Month:** Total spending decreased by 5%. Great job!\n\n💡 **Savings Tips**\n\n1.  **Manage Food Costs:** Your spending on dining out is high. Try cooking at home twice a week to save an estimated $120/month.\n2.  **Review Subscriptions:** Cancel unused subscriptions to reduce fixed costs.`;
            aiReportBox.textContent = reportText;
        }, 1500);
    });
    
    // ---------------------------------- //
    // 5. App Initialization              //
    // ---------------------------------- //
    const savedTheme = localStorage.getItem('budgetTheme');
    if (savedTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode(); // Default to light
    }
    
    setLanguage(currentLang);
    
    // Placeholder for other functions like data export/import, calculations, etc.
    console.log("Budgeting tool initialized.");

});
