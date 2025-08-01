/**
 * Data Processor Utility
 * Handles CSV parsing, data cleaning, and validation
 */

class DataProcessor {
    constructor() {
        this.salesData = [];
        this.transactionsData = [];
        this.previousPeriodData = {};
    }

    /**
     * Clean and validate sales data from CSV
     * @param {Array} data - Raw CSV data
     * @returns {Array} Cleaned sales data
     */
    cleanSalesData(data) {
        return data.map(row => {
            const customerNameMatch = row.Customer ? row.Customer.match(/^(.*?)\s*\(/) : null;
            const customerName = customerNameMatch ? customerNameMatch[1].trim() : (row.Customer || 'N/A');

            // Handle different possible column names for total amount
            let totalAmount = 0;
            if (row['Total Amount']) {
                totalAmount = parseFloat(String(row['Total Amount']).replace(/,/g, '')) || 0;
            }

            // Ensure we have valid data
            if (!row.Date || isNaN(totalAmount)) {
                return null;
            }

            return {
                date: new Date(row.Date),
                customer: customerName,
                totalAmount: totalAmount,
                paymentStatus: row['Payment Status'] || 'N/A',
                paymentMethod: row['Payment Method'] || 'N/A',
                totalTrays: parseInt(row['Total Trays']) || 0
            };
        }).filter(row => row && row.date instanceof Date && !isNaN(row.date) && !isNaN(row.totalAmount) && row.totalAmount > 0);
    }

    /**
     * Clean and validate transactions data from CSV
     * @param {Array} data - Raw CSV data
     * @returns {Array} Cleaned transactions data
     */
    cleanTransactionsData(data) {
        return data.map(row => {
            // Handle different possible column names for expense amount
            let amount = 0;
            if (row['Expense Amount']) {
                amount = parseFloat(String(row['Expense Amount']).replace(/,/g, '')) || 0;
            }

            // Ensure we have valid data
            if (!row.Date || isNaN(amount) || amount <= 0) {
                return null;
            }

            return {
                date: new Date(row.Date),
                name: row.Name || 'N/A',
                amount: amount,
                type: row.Type || 'N/A',
                category: row.Category || 'Uncategorized',
                paymentMethod: row['Payment Method'] || 'N/A',
                status: row.Status || 'N/A'
            };
        }).filter(row => row && row.date instanceof Date && !isNaN(row.date) && !isNaN(row.amount) && row.amount > 0);
    }

    /**
     * Calculate previous period data for comparison
     */
    calculatePreviousPeriodData() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        const currentPeriodSales = this.salesData.filter(sale => 
            sale.date.getMonth() === currentMonth && sale.date.getFullYear() === currentYear
        );
        const currentPeriodExpenses = this.transactionsData.filter(transaction => 
            transaction.date.getMonth() === currentMonth && transaction.date.getFullYear() === currentYear
        );

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        const previousPeriodSales = this.salesData.filter(sale => 
            sale.date.getMonth() === previousMonth && sale.date.getFullYear() === previousYear
        );
        const previousPeriodExpenses = this.transactionsData.filter(transaction => 
            transaction.date.getMonth() === previousMonth && transaction.date.getFullYear() === previousYear
        );

        this.previousPeriodData = {
            currentRevenue: currentPeriodSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            currentExpenses: currentPeriodExpenses.reduce((sum, transaction) => sum + transaction.amount, 0),
            previousRevenue: previousPeriodSales.reduce((sum, sale) => sum + sale.totalAmount, 0),
            previousExpenses: previousPeriodExpenses.reduce((sum, transaction) => sum + transaction.amount, 0)
        };
    }

    /**
     * Process uploaded CSV file
     * @param {File} file - CSV file
     * @param {string} type - 'sales' or 'transactions'
     * @returns {Promise} Promise that resolves with processed data
     */
    processFile(file, type) {
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    try {
                        let processedData;
                        if (type === 'sales') {
                            processedData = this.cleanSalesData(results.data);
                            this.salesData = processedData;
                        } else {
                            processedData = this.cleanTransactionsData(results.data);
                            this.transactionsData = processedData;
                        }
                        resolve(processedData);
                    } catch (error) {
                        reject(error);
                    }
                },
                error: (error) => {
                    reject(error);
                }
            });
        });
    }

    /**
     * Get summary statistics
     * @param {Array} sales - Filtered sales data
     * @param {Array} transactions - Filtered transactions data
     * @returns {Object} Summary statistics
     */
    getSummary(sales, transactions) {
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

        // Calculate changes
        const revenueChange = this.previousPeriodData.currentRevenue - this.previousPeriodData.previousRevenue;
        const expensesChange = this.previousPeriodData.currentExpenses - this.previousPeriodData.previousExpenses;
        const profitChange = (this.previousPeriodData.currentRevenue - this.previousPeriodData.currentExpenses) - 
                           (this.previousPeriodData.previousRevenue - this.previousPeriodData.previousExpenses);

        return {
            totalRevenue,
            totalExpenses,
            netProfit,
            profitMargin,
            revenueChange,
            expensesChange,
            profitChange
        };
    }

    /**
     * Filter data based on criteria
     * @param {Object} filters - Filter criteria
     * @returns {Object} Filtered data
     */
    filterData(filters) {
        const { customerFilter, startDate, endDate, paymentStatusFilter, paymentMethodFilter } = filters;

        const filteredSales = this.salesData.filter(sale => {
            const saleDate = sale.date;
            const customerMatch = sale.customer.toLowerCase().includes(customerFilter.toLowerCase());
            const dateMatch = (!startDate || saleDate >= startDate) && (!endDate || saleDate <= endDate);
            const statusMatch = !paymentStatusFilter || sale.paymentStatus === paymentStatusFilter;
            const methodMatch = !paymentMethodFilter || sale.paymentMethod === paymentMethodFilter;
            return customerMatch && dateMatch && statusMatch && methodMatch;
        });

        const filteredTransactions = this.transactionsData.filter(transaction => {
            const transactionDate = transaction.date;
            const dateMatch = (!startDate || transactionDate >= startDate) && (!endDate || transactionDate <= endDate);
            const statusMatch = !paymentStatusFilter || transaction.status === paymentStatusFilter;
            const methodMatch = !paymentMethodFilter || transaction.paymentMethod === paymentMethodFilter;
            return dateMatch && statusMatch && methodMatch;
        });

        return { filteredSales, filteredTransactions };
    }
}

// Export for use in other modules
window.DataProcessor = DataProcessor; 