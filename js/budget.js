// imports removed

class BudgetManager {
    constructor() {
        this.budgets = storage.load(storage.KEYS.BUDGETS) || [];
    }

    _save() {
        storage.save(storage.KEYS.BUDGETS, this.budgets);
    }

    /**
     * Set monthly budget
     */
    setBudget(userId, monthYear, amount) {
        if (amount < 0) throw new Error('Budget cannot be negative');

        let budgetEntry = this.budgets.find(b => b.userId === userId && b.month === monthYear);
        
        if (budgetEntry) {
            budgetEntry.amount = parseFloat(amount);
        } else {
            this.budgets.push({
                userId,
                month: monthYear,
                amount: parseFloat(amount)
            });
        }
        
        this._save();
    }

    /**
     * Get budget for a month
     */
    getBudget(userId, monthYear) {
        const budgetEntry = this.budgets.find(b => b.userId === userId && b.month === monthYear);
        return budgetEntry ? budgetEntry.amount : 0;
    }

    /**
     * Get complete budget status including spent amount
     */
    getBudgetStatus(userId, monthYear) {
        const limit = this.getBudget(userId, monthYear);
        const spent = transactionManager.getTotalExpenses(userId, monthYear);
        
        let percentage = 0;
        if (limit > 0) {
            percentage = Math.min(Math.round((spent / limit) * 100), 100);
        } else if (spent > 0) {
            percentage = 100; // No limit set but money spent
        }

        const remaining = Math.max(limit - spent, 0);
        const isExceeded = spent > limit && limit > 0;

        return {
            limit,
            spent,
            remaining,
            percentage,
            isExceeded,
            hasBudget: limit > 0
        };
    }

    /**
     * Check if budget warning should be shown
     * @returns 'safe' | 'warning' | 'exceeded' | 'none'
     */
    checkBudgetWarning(userId, monthYear) {
        const status = this.getBudgetStatus(userId, monthYear);
        
        if (!status.hasBudget) return 'none';
        if (status.isExceeded) return 'exceeded';
        if (status.percentage >= 80) return 'warning';
        
        return 'safe';
    }
}

class SavingsManager {
    constructor() {
        this.savings = storage.load(storage.KEYS.SAVINGS) || [];
    }

    _save() {
        storage.save(storage.KEYS.SAVINGS, this.savings);
    }

    _getUserSavings(userId) {
        let userSavings = this.savings.find(s => s.userId === userId);
        if (!userSavings) {
            userSavings = {
                userId,
                goalName: '',
                goalAmount: 0,
                contributions: []
            };
            this.savings.push(userSavings);
        }
        return userSavings;
    }

    /**
     * Set savings goal
     */
    setGoal(userId, goalAmount, goalName) {
        if (goalAmount <= 0) throw new Error('Goal amount must be greater than 0');
        if (!goalName) throw new Error('Goal name is required');

        const userSavings = this._getUserSavings(userId);
        userSavings.goalAmount = parseFloat(goalAmount);
        userSavings.goalName = goalName;
        
        this._save();
    }

    /**
     * Get current goal
     */
    getGoal(userId) {
        const userSavings = this._getUserSavings(userId);
        return {
            name: userSavings.goalName,
            amount: userSavings.goalAmount
        };
    }

    /**
     * Add contribution
     */
    addContribution(userId, amount, note = '') {
        if (amount <= 0) throw new Error('Contribution amount must be greater than 0');

        const userSavings = this._getUserSavings(userId);
        
        userSavings.contributions.unshift({
            id: Date.now().toString(),
            amount: parseFloat(amount),
            note: note,
            date: new Date().toISOString()
        });

        this._save();
    }

    /**
     * Get total saved amount
     */
    getTotalSaved(userId) {
        const userSavings = this._getUserSavings(userId);
        return userSavings.contributions.reduce((sum, c) => sum + c.amount, 0);
    }

    /**
     * Get full savings status
     */
    getSavingsStatus(userId) {
        const userSavings = this._getUserSavings(userId);
        const saved = this.getTotalSaved(userId);
        const target = userSavings.goalAmount;
        
        let percentage = 0;
        if (target > 0) {
            percentage = Math.min(Math.round((saved / target) * 100), 100);
        }

        return {
            goalName: userSavings.goalName || 'No Goal Set',
            goalAmount: target,
            savedAmount: saved,
            remainingAmount: Math.max(target - saved, 0),
            percentage,
            hasGoal: target > 0,
            isReached: target > 0 && saved >= target
        };
    }

    /**
     * Get contribution history
     */
    getContributionHistory(userId) {
        const userSavings = this._getUserSavings(userId);
        return userSavings.contributions;
    }
}

const budgetManager = new BudgetManager();
const savingsManager = new SavingsManager();
