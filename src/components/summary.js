/**
 * Summary Component
 * Handles the executive summary display
 */

class Summary {
    constructor(dataProcessor) {
        this.dataProcessor = dataProcessor;
    }

    /**
     * Update summary with filtered data
     * @param {Array} sales - Filtered sales data
     * @param {Array} transactions - Filtered transactions data
     */
    updateSummary(sales, transactions) {
        const summary = this.dataProcessor.getSummary(sales, transactions);
        
        // Update summary cards
        document.getElementById('totalRevenue').textContent = this.formatCurrency(summary.totalRevenue);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(summary.totalExpenses);
        document.getElementById('netProfit').textContent = this.formatCurrency(summary.netProfit);
        document.getElementById('profitMargin').textContent = `${summary.profitMargin.toFixed(1)}%`;

        // Update change indicators
        this.updateChangeIndicator('revenueChange', summary.revenueChange);
        this.updateChangeIndicator('expensesChange', summary.expensesChange);
        this.updateChangeIndicator('profitChange', summary.profitChange);
        this.updateMarginChange(summary.profitMargin);
    }

    /**
     * Format currency value
     * @param {number} value - Value to format
     * @returns {string} Formatted currency string
     */
    formatCurrency(value) {
        return new Intl.NumberFormat('en-GH', { 
            style: 'currency', 
            currency: 'GHS' 
        }).format(value);
    }

    /**
     * Update change indicator
     * @param {string} elementId - Element ID to update
     * @param {number} change - Change value
     */
    updateChangeIndicator(elementId, change) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const formattedChange = this.formatCurrency(Math.abs(change));
        const isPositive = change >= 0;
        
        element.textContent = `${isPositive ? '+' : '-'}${formattedChange}`;
        element.className = `text-sm mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`;
    }

    /**
     * Update margin change
     * @param {number} currentMargin - Current profit margin
     */
    updateMarginChange(currentMargin) {
        const element = document.getElementById('marginChange');
        if (!element) return;

        // Calculate margin change (this would need previous period data)
        // For now, just show a placeholder
        element.textContent = 'vs previous period';
        element.className = 'text-sm text-gray-500 mt-1';
    }

    /**
     * Show loading state
     */
    showLoading() {
        const elements = ['totalRevenue', 'totalExpenses', 'netProfit', 'profitMargin'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Loading...';
            }
        });
    }

    /**
     * Show error state
     */
    showError() {
        const elements = ['totalRevenue', 'totalExpenses', 'netProfit', 'profitMargin'];
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = 'Error';
                element.className = 'text-3xl font-bold text-red-600 mt-2';
            }
        });
    }

    /**
     * Get summary statistics
     * @param {Array} sales - Sales data
     * @param {Array} transactions - Transactions data
     * @returns {Object} Summary statistics
     */
    getSummaryStats(sales, transactions) {
        const summary = this.dataProcessor.getSummary(sales, transactions);
        
        return {
            totalRevenue: summary.totalRevenue,
            totalExpenses: summary.totalExpenses,
            netProfit: summary.netProfit,
            profitMargin: summary.profitMargin,
            revenueChange: summary.revenueChange,
            expensesChange: summary.expensesChange,
            profitChange: summary.profitChange,
            salesCount: sales.length,
            transactionsCount: transactions.length
        };
    }

    /**
     * Calculate period-over-period change
     * @param {number} current - Current period value
     * @param {number} previous - Previous period value
     * @returns {Object} Change information
     */
    calculatePeriodChange(current, previous) {
        if (previous === 0) {
            return {
                change: current,
                percentage: current > 0 ? 100 : 0,
                isPositive: current > 0
            };
        }

        const change = current - previous;
        const percentage = (change / previous) * 100;

        return {
            change: change,
            percentage: percentage,
            isPositive: change >= 0
        };
    }

    /**
     * Update summary with period comparison
     * @param {Array} currentSales - Current period sales
     * @param {Array} currentTransactions - Current period transactions
     * @param {Array} previousSales - Previous period sales
     * @param {Array} previousTransactions - Previous period transactions
     */
    updateSummaryWithComparison(currentSales, currentTransactions, previousSales, previousTransactions) {
        const currentSummary = this.getSummaryStats(currentSales, currentTransactions);
        const previousSummary = this.getSummaryStats(previousSales, previousTransactions);

        // Update main values
        document.getElementById('totalRevenue').textContent = this.formatCurrency(currentSummary.totalRevenue);
        document.getElementById('totalExpenses').textContent = this.formatCurrency(currentSummary.totalExpenses);
        document.getElementById('netProfit').textContent = this.formatCurrency(currentSummary.netProfit);
        document.getElementById('profitMargin').textContent = `${currentSummary.profitMargin.toFixed(1)}%`;

        // Calculate and update changes
        const revenueChange = this.calculatePeriodChange(currentSummary.totalRevenue, previousSummary.totalRevenue);
        const expensesChange = this.calculatePeriodChange(currentSummary.totalExpenses, previousSummary.totalExpenses);
        const profitChange = this.calculatePeriodChange(currentSummary.netProfit, previousSummary.netProfit);

        this.updateChangeIndicator('revenueChange', revenueChange.change);
        this.updateChangeIndicator('expensesChange', expensesChange.change);
        this.updateChangeIndicator('profitChange', profitChange.change);
    }

    /**
     * Animate summary values
     * @param {Object} targetValues - Target values to animate to
     * @param {number} duration - Animation duration in milliseconds
     */
    animateSummaryValues(targetValues, duration = 1000) {
        const elements = {
            totalRevenue: targetValues.totalRevenue,
            totalExpenses: targetValues.totalExpenses,
            netProfit: targetValues.netProfit
        };

        Object.entries(elements).forEach(([elementId, targetValue]) => {
            const element = document.getElementById(elementId);
            if (!element) return;

            const startValue = 0;
            const startTime = performance.now();

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const currentValue = startValue + (targetValue - startValue) * progress;
                element.textContent = this.formatCurrency(currentValue);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        });
    }
}

// Export for use in other modules
window.Summary = Summary; 