/**
 * Export Manager Utility
 * Handles data export functionality
 */

class ExportManager {
    constructor() {
        this.dataProcessor = null;
    }

    /**
     * Set the data processor instance
     * @param {DataProcessor} dataProcessor - Data processor instance
     */
    setDataProcessor(dataProcessor) {
        this.dataProcessor = dataProcessor;
    }

    /**
     * Export filtered data to CSV
     * @param {Object} filters - Current filter settings
     */
    exportData(filters) {
        if (!this.dataProcessor) {
            console.error('Data processor not set');
            return;
        }

        const { customerFilter, startDate, endDate, paymentStatusFilter, paymentMethodFilter } = filters;

        let csvContent = "data:text/csv;charset=utf-8,";
        
        // Add summary data
        csvContent += "Summary Report\n";
        csvContent += `Generated on: ${new Date().toLocaleDateString()}\n`;
        csvContent += `Filters: Customer=${customerFilter}, Start Date=${startDate}, End Date=${endDate}, Status=${paymentStatusFilter}, Method=${paymentMethodFilter}\n\n`;
        
        // Add sales data
        csvContent += "Sales Data\n";
        csvContent += "Date,Customer,Total Amount,Payment Status,Payment Method\n";
        
        const filteredSales = this.dataProcessor.salesData.filter(sale => {
            const saleDate = sale.date;
            const customerMatch = !customerFilter || sale.customer.toLowerCase().includes(customerFilter.toLowerCase());
            const startMatch = !startDate || saleDate >= new Date(startDate);
            const endMatch = !endDate || saleDate <= new Date(endDate);
            const statusMatch = !paymentStatusFilter || sale.paymentStatus === paymentStatusFilter;
            const methodMatch = !paymentMethodFilter || sale.paymentMethod === paymentMethodFilter;
            return customerMatch && startMatch && endMatch && statusMatch && methodMatch;
        });

        filteredSales.forEach(sale => {
            csvContent += `${sale.date.toLocaleDateString()},"${sale.customer}",${sale.totalAmount},${sale.paymentStatus},${sale.paymentMethod}\n`;
        });

        // Add transactions data
        csvContent += "\nTransactions Data\n";
        csvContent += "Date,Description,Amount,Category,Payment Method,Status\n";
        
        const filteredTransactions = this.dataProcessor.transactionsData.filter(transaction => {
            const transactionDate = transaction.date;
            const startMatch = !startDate || transactionDate >= new Date(startDate);
            const endMatch = !endDate || transactionDate <= new Date(endDate);
            const statusMatch = !paymentStatusFilter || transaction.status === paymentStatusFilter;
            const methodMatch = !paymentMethodFilter || transaction.paymentMethod === paymentMethodFilter;
            return startMatch && endMatch && statusMatch && methodMatch;
        });

        filteredTransactions.forEach(transaction => {
            csvContent += `${transaction.date.toLocaleDateString()},"${transaction.name}",${transaction.amount},${transaction.category},${transaction.paymentMethod},${transaction.status}\n`;
        });

        // Add summary statistics
        const summary = this.dataProcessor.getSummary(filteredSales, filteredTransactions);
        csvContent += "\nSummary Statistics\n";
        csvContent += `Total Revenue,${summary.totalRevenue}\n`;
        csvContent += `Total Expenses,${summary.totalExpenses}\n`;
        csvContent += `Net Profit,${summary.netProfit}\n`;
        csvContent += `Profit Margin,${summary.profitMargin.toFixed(2)}%\n`;

        this.downloadCSV(csvContent, `financial_report_${new Date().toISOString().split('T')[0]}.csv`);
    }

    /**
     * Download CSV file
     * @param {string} csvContent - CSV content
     * @param {string} filename - Filename for download
     */
    downloadCSV(csvContent, filename) {
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Export chart as image
     * @param {string} chartId - Chart canvas ID
     * @param {string} filename - Filename for download
     */
    exportChartAsImage(chartId, filename) {
        const canvas = document.getElementById(chartId);
        if (!canvas) {
            console.error(`Chart with ID ${chartId} not found`);
            return;
        }

        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Export all charts as images
     */
    exportAllCharts() {
        const charts = [
            { id: 'financialChart', name: 'financial_overview' },
            { id: 'customerChart', name: 'customer_performance' },
            { id: 'paymentStatusChart', name: 'payment_status' },
            { id: 'trendsChart', name: 'revenue_trends' },
            { id: 'expenseCategoriesChart', name: 'expense_categories' }
        ];

        charts.forEach(chart => {
            try {
                this.exportChartAsImage(chart.id, `${chart.name}_${new Date().toISOString().split('T')[0]}.png`);
            } catch (error) {
                console.error(`Failed to export chart ${chart.id}:`, error);
            }
        });
    }

    /**
     * Export summary report as PDF (placeholder for future implementation)
     */
    exportSummaryReport() {
        // This would require a PDF library like jsPDF
        // For now, we'll just show a message
        alert('PDF export functionality will be implemented in a future version.');
    }
}

// Export for use in other modules
window.ExportManager = ExportManager; 