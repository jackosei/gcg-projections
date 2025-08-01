/**
 * Chart Manager Utility
 * Handles all Chart.js operations and chart creation
 */

class ChartManager {
    constructor() {
        this.charts = {};
    }

    /**
     * Create a chart with proper configuration
     * @param {string} canvasId - Canvas element ID
     * @param {string} type - Chart type
     * @param {Object} data - Chart data
     */
    createChart(canvasId, type, data) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: type,
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                // For pie/doughnut charts, use context.parsed, for others use context.parsed.y
                                const value = context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                                if (value !== null && typeof value === 'number' && !isNaN(value)) {
                                    label += new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value);
                                } else {
                                    label += '₵0.00'; // Fallback for invalid numbers
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: type !== 'pie' && type !== 'doughnut' ? {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => {
                                return '₵' + value.toLocaleString('en-GH');
                            }
                        }
                    }
                } : {}
            }
        });
    }

    /**
     * Update financial overview chart
     * @param {Array} sales - Sales data
     * @param {Array} transactions - Transactions data
     */
    updateFinancialChart(sales, transactions) {
        const dataByMonth = {};

        sales.forEach(sale => {
            if (!sale || !sale.date || isNaN(sale.totalAmount)) {
                console.warn('Invalid sale data:', sale);
                return;
            }
            const month = sale.date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!dataByMonth[month]) {
                dataByMonth[month] = { revenue: 0, expenses: 0 };
            }
            dataByMonth[month].revenue += sale.totalAmount;
        });

        transactions.forEach(transaction => {
            if (!transaction || !transaction.date || isNaN(transaction.amount)) {
                console.warn('Invalid transaction data:', transaction);
                return;
            }
            const month = transaction.date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!dataByMonth[month]) {
                dataByMonth[month] = { revenue: 0, expenses: 0 };
            }
            dataByMonth[month].expenses += transaction.amount;
        });
        
        const labels = Object.keys(dataByMonth).sort((a, b) => new Date(a) - new Date(b));
        const revenueData = labels.map(month => dataByMonth[month].revenue || 0);
        const expensesData = labels.map(month => dataByMonth[month].expenses || 0);
        const profitData = labels.map(month => (dataByMonth[month].revenue || 0) - (dataByMonth[month].expenses || 0));

        this.createChart('financialChart', 'bar', {
            labels: labels,
            datasets: [
                {
                    label: 'Revenue',
                    data: revenueData,
                    backgroundColor: 'rgba(34, 197, 94, 0.6)',
                    borderColor: 'rgba(34, 197, 94, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Expenses',
                    data: expensesData,
                    backgroundColor: 'rgba(239, 68, 68, 0.6)',
                    borderColor: 'rgba(239, 68, 68, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Net Profit',
                    data: profitData,
                    backgroundColor: 'rgba(59, 130, 246, 0.6)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    type: 'line',
                    fill: false,
                    tension: 0.1
                }
            ]
        });
    }

    /**
     * Update customer performance chart
     * @param {Array} sales - Sales data
     */
    updateCustomerChart(sales) {
        const customerData = {};
        sales.forEach(sale => {
            if (!sale || !sale.customer || isNaN(sale.totalAmount)) {
                console.warn('Invalid sale data for customer chart:', sale);
                return;
            }
            if (!customerData[sale.customer]) {
                customerData[sale.customer] = 0;
            }
            customerData[sale.customer] += sale.totalAmount;
        });

        const sortedCustomers = Object.entries(customerData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        this.createChart('customerChart', 'doughnut', {
            labels: sortedCustomers.map(([customer]) => customer),
            datasets: [{
                data: sortedCustomers.map(([,amount]) => amount),
                backgroundColor: [
                    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
                    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
                ]
            }]
        });
    }

    /**
     * Update payment status chart
     * @param {Array} sales - Sales data
     */
    updatePaymentStatusChart(sales) {
        const statusData = {};
        sales.forEach(sale => {
            if (!sale || !sale.paymentStatus || isNaN(sale.totalAmount)) {
                console.warn('Invalid sale data for status chart:', sale);
                return;
            }
            if (!statusData[sale.paymentStatus]) {
                statusData[sale.paymentStatus] = 0;
            }
            statusData[sale.paymentStatus] += sale.totalAmount;
        });

        this.createChart('paymentStatusChart', 'pie', {
            labels: Object.keys(statusData),
            datasets: [{
                data: Object.values(statusData),
                backgroundColor: [
                    '#10B981', '#F59E0B', '#EF4444', '#6B7280'
                ]
            }]
        });
    }

    /**
     * Update trends chart
     * @param {Array} sales - Sales data
     */
    updateTrendsChart(sales) {
        const monthlyData = {};
        sales.forEach(sale => {
            if (!sale || !sale.date || isNaN(sale.totalAmount)) {
                console.warn('Invalid sale data for trends chart:', sale);
                return;
            }
            const month = sale.date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!monthlyData[month]) {
                monthlyData[month] = 0;
            }
            monthlyData[month] += sale.totalAmount;
        });

        const labels = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));
        const data = labels.map(month => monthlyData[month] || 0);

        this.createChart('trendsChart', 'line', {
            labels: labels,
            datasets: [{
                label: 'Monthly Revenue',
                data: data,
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            }]
        });
    }

    /**
     * Update expense categories chart
     * @param {Array} transactions - Transactions data
     */
    updateExpenseCategoriesChart(transactions) {
        const categoryData = {};
        transactions.forEach(transaction => {
            if (!transaction || !transaction.category || isNaN(transaction.amount)) {
                console.warn('Invalid transaction data for categories chart:', transaction);
                return;
            }
            if (!categoryData[transaction.category]) {
                categoryData[transaction.category] = 0;
            }
            categoryData[transaction.category] += transaction.amount;
        });

        const sortedCategories = Object.entries(categoryData)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        this.createChart('expenseCategoriesChart', 'bar', {
            labels: sortedCategories.map(([category]) => category),
            datasets: [{
                label: 'Expense Amount',
                data: sortedCategories.map(([,amount]) => amount),
                backgroundColor: 'rgba(239, 68, 68, 0.6)',
                borderColor: 'rgba(239, 68, 68, 1)',
                borderWidth: 1
            }]
        });
    }

    /**
     * Update all charts
     * @param {Array} sales - Sales data
     * @param {Array} transactions - Transactions data
     */
    updateAllCharts(sales, transactions) {
        this.updateFinancialChart(sales, transactions);
        this.updateCustomerChart(sales);
        this.updatePaymentStatusChart(sales);
        this.updateTrendsChart(sales);
        this.updateExpenseCategoriesChart(transactions);
    }

    /**
     * Destroy all charts
     */
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
    }
}

// Export for use in other modules
window.ChartManager = ChartManager; 