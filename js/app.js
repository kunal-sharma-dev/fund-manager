// imports removed

class App {
    constructor() {
        this.currentView = 'dashboard';
        this.filters = {
            query: '',
            type: 'all',
            category: 'all',
            month: 'all'
        };
        this.cacheDOM();
        this.bindEvents();
    }

    cacheDOM() {
        // App container & Auth
        this.appContainer = document.getElementById('appContainer');
        this.authOverlay = document.getElementById('authOverlay');
        this.loginModal = document.getElementById('loginModal');
        this.registerModal = document.getElementById('registerModal');

        // Navigation
        this.navLinks = document.querySelectorAll('.nav-links a');
        this.views = document.querySelectorAll('.view');
        this.userAvatar = document.getElementById('userAvatar');
        this.userName = document.getElementById('userName');
        this.themeToggle = document.getElementById('themeToggle');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Mobile
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.sidebar = document.querySelector('.sidebar');
        
        // Dashboard
        this.currentDateDisplay = document.getElementById('currentDateDisplay');
        this.dashBalance = document.getElementById('dashBalance');
        this.dashIncome = document.getElementById('dashIncome');
        this.dashExpense = document.getElementById('dashExpense');
        this.dashSavings = document.getElementById('dashSavings');
        this.dashRecentTransactions = document.getElementById('dashRecentTransactions');
        this.dashBudgetWarning = document.getElementById('dashBudgetWarning');
        this.dashBudgetSpent = document.getElementById('dashBudgetSpent');
        this.dashBudgetLimit = document.getElementById('dashBudgetLimit');
        this.dashBudgetProgress = document.getElementById('dashBudgetProgress');
        this.dashCategoryList = document.getElementById('dashCategoryList');

        // Transaction Form
        this.transactionForm = document.getElementById('transactionForm');
        this.transCategory = document.getElementById('transCategory');
        this.transDate = document.getElementById('transDate');
        
        // Transaction History
        this.transactionsTableBody = document.getElementById('transactionsTableBody');
        this.noTransactionsMsg = document.getElementById('noTransactionsMsg');
        this.searchTrans = document.getElementById('searchTrans');
        this.filterType = document.getElementById('filterType');
        this.filterCategory = document.getElementById('filterCategory');
        this.filterMonth = document.getElementById('filterMonth');
        this.undoBtn = document.getElementById('undoBtn');
        this.exportBtn = document.getElementById('exportBtn');

        // Budget
        this.budgetMonthDisplay = document.getElementById('budgetMonthDisplay');
        this.budgetForm = document.getElementById('budgetForm');
        this.budgetBigWarning = document.getElementById('budgetBigWarning');
        this.budgetStatusLimit = document.getElementById('budgetStatusLimit');
        this.budgetStatusSpent = document.getElementById('budgetStatusSpent');
        this.budgetStatusRemaining = document.getElementById('budgetStatusRemaining');
        this.budgetStatusProgress = document.getElementById('budgetStatusProgress');
        this.budgetStatusPercentage = document.getElementById('budgetStatusPercentage');

        // Savings
        this.savingsGoalForm = document.getElementById('savingsGoalForm');
        this.savingsContributionForm = document.getElementById('savingsContributionForm');
        this.displayGoalName = document.getElementById('displayGoalName');
        this.displayGoalAmount = document.getElementById('displayGoalAmount');
        this.displaySavedAmount = document.getElementById('displaySavedAmount');
        this.displayRemainingAmount = document.getElementById('displayRemainingAmount');
        this.savingsProgressFill = document.getElementById('savingsProgressFill');
        this.savingsProgressPercentage = document.getElementById('savingsProgressPercentage');
        this.contributionList = document.getElementById('contributionList');
    }

    init() {
        this.loadThemePreference();
        this.populateSelects();

        if (userManager.isLoggedIn()) {
            this.showApp();
        } else {
            this.showAuth();
        }
    }

    bindEvents() {
        // Auth Events
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));
        
        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.loginModal.style.display = 'none';
            this.registerModal.style.display = 'block';
        });

        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.registerModal.style.display = 'none';
            this.loginModal.style.display = 'block';
        });

        this.logoutBtn.addEventListener('click', this.handleLogout.bind(this));

        // Navigation
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Ensure we handle clicks on elements inside the link (like icons)
                const targetLink = e.target.closest('a');
                if (targetLink && targetLink.dataset.view) {
                    this.navigate(targetLink.dataset.view);
                    // Close sidebar on mobile after clicking
                    if (window.innerWidth <= 768) {
                        this.sidebar.classList.remove('open');
                    }
                }
            });
        });

        // Theme Toggle
        this.themeToggle.addEventListener('click', this.toggleDarkMode.bind(this));

        // Mobile Menu
        this.mobileMenuBtn.addEventListener('click', () => {
            this.sidebar.classList.toggle('open');
        });

        // Form Submissions
        this.transactionForm.addEventListener('submit', this.handleAddTransaction.bind(this));
        this.budgetForm.addEventListener('submit', this.handleSetBudget.bind(this));
        this.savingsGoalForm.addEventListener('submit', this.handleSetSavingsGoal.bind(this));
        this.savingsContributionForm.addEventListener('submit', this.handleAddContribution.bind(this));

        // Filters
        const handleFilterChange = () => {
            this.filters.type = this.filterType.value;
            this.filters.category = this.filterCategory.value;
            this.filters.month = this.filterMonth.value;
            this.renderTransactionHistory();
        };

        this.filterType.addEventListener('change', handleFilterChange);
        this.filterCategory.addEventListener('change', handleFilterChange);
        this.filterMonth.addEventListener('change', handleFilterChange);

        this.searchTrans.addEventListener('input', debounce((e) => {
            this.filters.query = e.target.value;
            this.renderTransactionHistory();
        }, 300));

        // Actions
        this.undoBtn.addEventListener('click', this.handleUndoLast.bind(this));
        this.exportBtn.addEventListener('click', this.handleExport.bind(this));

        // Delegated events for dynamic elements
        document.addEventListener('click', (e) => {
            if (e.target.closest('.delete-trans-btn')) {
                const id = e.target.closest('.delete-trans-btn').dataset.id;
                this.handleDeleteTransaction(id);
            }
        });
    }

    populateSelects() {
        // Categories
        let categoryOptions = '';
        CATEGORIES.forEach(c => {
            categoryOptions += `<option value="${c.name}">${c.icon} ${c.name}</option>`;
        });
        this.transCategory.innerHTML = categoryOptions;
        
        let filterCatOptions = '<option value="all">All Categories</option>';
        CATEGORIES.forEach(c => {
            filterCatOptions += `<option value="${c.name}">${c.icon} ${c.name}</option>`;
        });
        this.filterCategory.innerHTML = filterCatOptions;

        // Set default date to today
        this.transDate.value = new Date().toISOString().split('T')[0];
    }

    populateMonthFilter() {
        if (!userManager.isLoggedIn()) return;
        const userId = userManager.getCurrentUser().id;
        const allTrans = transactionManager.getAll(userId);
        
        const months = new Set();
        allTrans.forEach(t => months.add(getMonthYear(t.date)));
        
        // Add current month even if empty
        months.add(getMonthYear());

        const sortedMonths = Array.from(months).sort().reverse();
        
        let monthOptions = '<option value="all">All Time</option>';
        sortedMonths.forEach(m => {
            monthOptions += `<option value="${m}">${formatMonthYearDisplay(m)}</option>`;
        });
        
        // Only update if changed to avoid resetting selection
        if (this.filterMonth.innerHTML !== monthOptions) {
            const currentVal = this.filterMonth.value;
            this.filterMonth.innerHTML = monthOptions;
            if (sortedMonths.includes(currentVal)) {
                this.filterMonth.value = currentVal;
            }
        }
    }

    // --- Authentication ---

    showAuth() {
        this.appContainer.style.display = 'none';
        this.authOverlay.style.display = 'flex';
        this.loginModal.style.display = 'block';
        this.registerModal.style.display = 'none';
    }

    showApp() {
        this.authOverlay.style.display = 'none';
        this.appContainer.style.display = 'flex';
        
        const user = userManager.getCurrentUser();
        this.userName.textContent = user.name;
        this.userAvatar.textContent = user.name.charAt(0).toUpperCase();

        // Process recurring transactions
        const recurringAdded = transactionManager.processRecurring(user.id);
        if (recurringAdded > 0) {
            showToast(`Added ${recurringAdded} recurring transaction(s)`, 'success');
        }

        this.currentDateDisplay.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        this.budgetMonthDisplay.textContent = formatMonthYearDisplay(getMonthYear());

        this.navigate('dashboard');
    }

    handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;

        try {
            userManager.login(email, pass);
            e.target.reset();
            showToast('Login successful!');
            this.showApp();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const pass = document.getElementById('registerPassword').value;

        try {
            userManager.register(name, email, pass);
            e.target.reset();
            showToast('Registration successful!');
            this.showApp();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    handleLogout() {
        userManager.logout();
        this.showAuth();
        showToast('Logged out successfully');
    }

    // --- Navigation ---

    navigate(viewId) {
        this.currentView = viewId;
        
        // Update nav links
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.view === viewId) {
                link.classList.add('active');
            }
        });

        // Update views
        this.views.forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`view-${viewId}`).classList.add('active');

        // Render appropriate content
        this.renderCurrentView();
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'transactions':
                this.populateMonthFilter();
                this.renderTransactionHistory();
                break;
            case 'budget':
                this.renderBudgetView();
                break;
            case 'savings':
                this.renderSavingsView();
                break;
        }
    }

    // --- Rendering ---

    renderDashboard() {
        const userId = userManager.getCurrentUser().id;
        const currentMonth = getMonthYear();
        
        // Summary Cards
        const balance = transactionManager.getBalance(userId);
        const income = transactionManager.getTotalIncome(userId, currentMonth);
        const expense = transactionManager.getTotalExpenses(userId, currentMonth);
        const savingsStatus = savingsManager.getSavingsStatus(userId);

        animateCounter(this.dashBalance, balance);
        animateCounter(this.dashIncome, income);
        animateCounter(this.dashExpense, expense);
        animateCounter(this.dashSavings, savingsStatus.goalAmount);

        // Recent Transactions
        const recent = transactionManager.getAll(userId).slice(0, 5);
        this.dashRecentTransactions.innerHTML = '';
        
        if (recent.length === 0) {
            this.dashRecentTransactions.innerHTML = '<p class="text-muted text-center py-4">No recent transactions</p>';
        } else {
            recent.forEach(t => {
                const meta = getCategoryMeta(t.category);
                const sign = t.type === 'income' ? '+' : '-';
                const colorClass = t.type === 'income' ? 'text-success' : '';
                
                const html = `
                    <div class="category-list-item">
                        <div class="category-info">
                            <span class="card-icon" style="width: 40px; height: 40px; background-color: ${meta.color}20">${meta.icon}</span>
                            <div>
                                <div style="font-weight: 500">${t.description}</div>
                                <div style="font-size: 0.75rem; color: var(--text-muted)">${formatDate(t.date)}</div>
                            </div>
                        </div>
                        <div class="${colorClass}" style="font-weight: 600">
                            ${sign}${formatCurrency(t.amount)}
                        </div>
                    </div>
                `;
                this.dashRecentTransactions.appendChild(createElementFromHTML(html));
            });
        }

        // Budget Widget
        const budgetStatus = budgetManager.getBudgetStatus(userId, currentMonth);
        
        if (!budgetStatus.hasBudget) {
            this.dashBudgetWarning.style.display = 'block';
            this.dashBudgetWarning.className = 'warning-banner';
            this.dashBudgetWarning.innerHTML = '⚠️ No budget set for this month. <a href="#" onclick="document.querySelector(\'[data-view=budget]\').click()">Set one now</a>';
            this.dashBudgetLimit.textContent = '₹0';
            this.dashBudgetSpent.textContent = formatCurrency(budgetStatus.spent);
            this.dashBudgetProgress.style.width = '0%';
        } else {
            this.dashBudgetLimit.textContent = formatCurrency(budgetStatus.limit);
            this.dashBudgetSpent.textContent = formatCurrency(budgetStatus.spent);
            this.dashBudgetProgress.style.width = `${budgetStatus.percentage}%`;
            
            const warningLevel = budgetManager.checkBudgetWarning(userId, currentMonth);
            
            this.dashBudgetProgress.className = 'progress-fill';
            if (warningLevel === 'exceeded') {
                this.dashBudgetProgress.classList.add('danger');
                this.dashBudgetWarning.style.display = 'flex';
                this.dashBudgetWarning.className = 'warning-banner pulse';
                this.dashBudgetWarning.innerHTML = '🚨 <strong>Budget Exceeded!</strong> You have spent more than your limit.';
            } else if (warningLevel === 'warning') {
                this.dashBudgetProgress.classList.add('warning');
                this.dashBudgetWarning.style.display = 'flex';
                this.dashBudgetWarning.className = 'warning-banner';
                this.dashBudgetWarning.innerHTML = '⚠️ <strong>Approaching Limit!</strong> You have used ' + budgetStatus.percentage + '% of your budget.';
            } else {
                this.dashBudgetWarning.style.display = 'none';
            }
        }

        // Category Breakdown
        const breakdown = transactionManager.getCategoryBreakdown(userId, currentMonth);
        this.dashCategoryList.innerHTML = '';
        
        if (breakdown.length === 0) {
            this.dashCategoryList.innerHTML = '<p class="text-muted text-center py-4">No expenses this month</p>';
        } else {
            const maxAmount = breakdown[0].amount; // For relative bar widths
            
            breakdown.slice(0, 5).forEach(b => {
                const meta = getCategoryMeta(b.category);
                const percent = Math.round((b.amount / expense) * 100);
                
                const html = `
                    <div style="margin-bottom: 1rem;">
                        <div class="flex-between mb-2">
                            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
                                <span>${meta.icon}</span> <span>${b.category}</span>
                            </div>
                            <div style="font-weight: 500; font-size: 0.875rem;">
                                ${formatCurrency(b.amount)} <span class="text-muted">(${percent}%)</span>
                            </div>
                        </div>
                        <div class="progress-container">
                            <div class="progress-track" style="height: 6px;">
                                <div class="progress-fill" style="width: ${(b.amount / maxAmount) * 100}%; background: ${meta.color}"></div>
                            </div>
                        </div>
                    </div>
                `;
                this.dashCategoryList.appendChild(createElementFromHTML(html));
            });
        }
    }

    renderTransactionHistory() {
        const userId = userManager.getCurrentUser().id;
        const results = transactionManager.filterAndSearch(userId, this.filters);
        
        this.transactionsTableBody.innerHTML = '';
        
        if (results.length === 0) {
            this.transactionsTableBody.parentElement.style.display = 'none';
            this.noTransactionsMsg.style.display = 'block';
        } else {
            this.transactionsTableBody.parentElement.style.display = 'table';
            this.noTransactionsMsg.style.display = 'none';
            
            results.forEach(t => {
                const meta = getCategoryMeta(t.category);
                const isIncome = t.type === 'income';
                const sign = isIncome ? '+' : '-';
                const rowClass = isIncome ? 'text-success' : '';
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div style="font-weight: 500">${formatDate(t.date)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted)">
                            ${t.recurring ? '🔄 Recurring' : ''}
                        </div>
                    </td>
                    <td style="font-weight: 500">${t.description}</td>
                    <td>
                        <span class="badge" style="background-color: ${meta.color}20; color: ${meta.color}">
                            ${meta.icon} ${t.category}
                        </span>
                    </td>
                    <td class="text-right ${rowClass}" style="font-weight: 600;">
                        ${sign}${formatCurrency(t.amount)}
                    </td>
                    <td>
                        <button class="btn-icon delete-trans-btn text-danger" data-id="${t.id}" title="Delete">🗑️</button>
                    </td>
                `;
                this.transactionsTableBody.appendChild(tr);
            });
        }
    }

    renderBudgetView() {
        const userId = userManager.getCurrentUser().id;
        const currentMonth = getMonthYear();
        
        const status = budgetManager.getBudgetStatus(userId, currentMonth);
        
        if (status.hasBudget) {
            document.getElementById('budgetAmount').value = status.limit;
        }

        this.budgetStatusLimit.textContent = formatCurrency(status.limit);
        this.budgetStatusSpent.textContent = formatCurrency(status.spent);
        this.budgetStatusRemaining.textContent = formatCurrency(status.remaining);
        
        this.budgetStatusProgress.style.width = `${status.percentage}%`;
        this.budgetStatusPercentage.textContent = `${status.percentage}%`;
        
        const warningLevel = budgetManager.checkBudgetWarning(userId, currentMonth);
        
        this.budgetStatusProgress.className = 'progress-fill';
        if (warningLevel === 'exceeded') {
            this.budgetStatusProgress.classList.add('danger');
            this.budgetBigWarning.style.display = 'flex';
            this.budgetBigWarning.className = 'warning-banner pulse mb-4';
            this.budgetBigWarning.innerHTML = `🚨 <strong>Budget Exceeded!</strong> You are over budget by ${formatCurrency(status.spent - status.limit)}.`;
        } else if (warningLevel === 'warning') {
            this.budgetStatusProgress.classList.add('warning');
            this.budgetBigWarning.style.display = 'flex';
            this.budgetBigWarning.className = 'warning-banner mb-4';
            this.budgetBigWarning.innerHTML = `⚠️ <strong>Approaching Limit!</strong> You have used ${status.percentage}% of your budget.`;
        } else if (status.hasBudget) {
            this.budgetBigWarning.style.display = 'flex';
            this.budgetBigWarning.className = 'warning-banner mb-4';
            this.budgetBigWarning.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
            this.budgetBigWarning.style.color = 'var(--success)';
            this.budgetBigWarning.style.borderColor = 'var(--success)';
            this.budgetBigWarning.innerHTML = `✅ <strong>On Track!</strong> You have ${formatCurrency(status.remaining)} remaining.`;
        } else {
            this.budgetBigWarning.style.display = 'none';
        }
    }

    renderSavingsView() {
        const userId = userManager.getCurrentUser().id;
        const status = savingsManager.getSavingsStatus(userId);
        
        // Update Forms if goal exists
        if (status.hasGoal) {
            document.getElementById('savingsGoalName').value = status.goalName;
            document.getElementById('savingsGoalAmount').value = status.goalAmount;
        }

        // Update Displays
        this.displayGoalName.textContent = status.goalName;
        this.displayGoalAmount.textContent = formatCurrency(status.goalAmount);
        this.displaySavedAmount.textContent = formatCurrency(status.savedAmount);
        this.displayRemainingAmount.textContent = formatCurrency(status.remainingAmount);
        
        this.savingsProgressFill.style.width = `${status.percentage}%`;
        this.savingsProgressPercentage.textContent = `${status.percentage}%`;

        if (status.isReached && status.hasGoal) {
            this.savingsProgressFill.style.backgroundColor = 'var(--success)';
            showToast(`Congratulations! You reached your savings goal: ${status.goalName} 🎉`, 'success');
        }

        // Render History
        const history = savingsManager.getContributionHistory(userId);
        this.contributionList.innerHTML = '';
        
        if (history.length === 0) {
            this.contributionList.innerHTML = '<p class="text-muted text-center py-4">No contributions yet</p>';
        } else {
            history.forEach(c => {
                const div = document.createElement('div');
                div.className = 'category-list-item';
                div.innerHTML = `
                    <div>
                        <div style="font-weight: 500">${formatCurrency(c.amount)}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted)">${formatDate(c.date)}</div>
                    </div>
                    ${c.note ? `<div class="text-muted text-right" style="font-size: 0.875rem;">${c.note}</div>` : ''}
                `;
                this.contributionList.appendChild(div);
            });
        }
    }

    // --- Actions ---

    handleAddTransaction(e) {
        e.preventDefault();
        
        const type = document.querySelector('input[name="transType"]:checked').value;
        const amount = document.getElementById('transAmount').value;
        const date = document.getElementById('transDate').value;
        const category = document.getElementById('transCategory').value;
        const description = document.getElementById('transDesc').value;
        const recurring = document.getElementById('transRecurring').checked;
        
        try {
            transactionManager.add({
                userId: userManager.getCurrentUser().id,
                type,
                amount,
                date,
                category,
                description,
                recurring
            });
            
            e.target.reset();
            // Reset defaults
            document.getElementById('transDate').value = new Date().toISOString().split('T')[0];
            document.querySelector('input[name="transType"][value="expense"]').checked = true;
            
            showToast('Transaction added successfully!');
            
            // Go to dashboard to see it
            this.navigate('dashboard');
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    handleDeleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            transactionManager.remove(id);
            showToast('Transaction deleted');
            this.renderTransactionHistory();
        }
    }

    handleUndoLast() {
        const userId = userManager.getCurrentUser().id;
        const undone = transactionManager.undoLast(userId);
        
        if (undone) {
            showToast(`Undone: ${undone.description} (${formatCurrency(undone.amount)})`, 'warning');
            this.renderTransactionHistory();
        } else {
            showToast('No transactions to undo', 'warning');
        }
    }

    handleExport() {
        const userId = userManager.getCurrentUser().id;
        const json = transactionManager.exportToJSON(userId);
        
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${getMonthYear()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Data exported successfully!');
    }

    handleSetBudget(e) {
        e.preventDefault();
        const amount = document.getElementById('budgetAmount').value;
        
        try {
            budgetManager.setBudget(userManager.getCurrentUser().id, getMonthYear(), amount);
            showToast('Budget updated successfully!');
            this.renderBudgetView();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    handleSetSavingsGoal(e) {
        e.preventDefault();
        const name = document.getElementById('savingsGoalName').value;
        const amount = document.getElementById('savingsGoalAmount').value;
        
        try {
            savingsManager.setGoal(userManager.getCurrentUser().id, amount, name);
            showToast('Savings goal updated!');
            this.renderSavingsView();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    handleAddContribution(e) {
        e.preventDefault();
        const amount = document.getElementById('contributionAmount').value;
        const note = document.getElementById('contributionNote').value;
        
        try {
            savingsManager.addContribution(userManager.getCurrentUser().id, amount, note);
            e.target.reset();
            showToast('Contribution added!');
            this.renderSavingsView();
        } catch (error) {
            showToast(error.message, 'error');
        }
    }

    // --- Theme ---

    toggleDarkMode() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        storage.save(storage.KEYS.THEME, newTheme);
    }

    loadThemePreference() {
        const savedTheme = storage.load(storage.KEYS.THEME);
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
