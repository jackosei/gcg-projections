/**
 * Filters Component
 * Handles all filtering functionality
 */

class Filters {
    constructor(dataProcessor, chartManager, tableManager, summaryComponent) {
        this.dataProcessor = dataProcessor;
        this.chartManager = chartManager;
        this.tableManager = tableManager;
        this.summaryComponent = summaryComponent;
        this.currentFilters = {
            customerFilter: '',
            startDate: '',
            endDate: '',
            paymentStatusFilter: '',
            paymentMethodFilter: ''
        };
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for filter controls
     */
    setupEventListeners() {
        document.getElementById('filterButton').addEventListener('click', () => {
            this.applyFilters();
        });

        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetFilters();
        });

        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
    }

    /**
     * Get current filter values
     * @returns {Object} Current filter values
     */
    getFilterValues() {
        return {
            customerFilter: document.getElementById('customerFilter').value.toLowerCase(),
            startDate: document.getElementById('startDate').value ? new Date(document.getElementById('startDate').value) : null,
            endDate: document.getElementById('endDate').value ? new Date(document.getElementById('endDate').value) : null,
            paymentStatusFilter: document.getElementById('paymentStatusFilter').value,
            paymentMethodFilter: document.getElementById('paymentMethodFilter').value
        };
    }

    /**
     * Apply filters to data
     */
    applyFilters() {
        const filters = this.getFilterValues();
        this.currentFilters = filters;

        // Set end date to end of day if specified
        if (filters.endDate) {
            filters.endDate.setHours(23, 59, 59, 999);
        }

        // Filter data
        const { filteredSales, filteredTransactions } = this.dataProcessor.filterData(filters);

        // Update all components
        this.summaryComponent.updateSummary(filteredSales, filteredTransactions);
        this.chartManager.updateAllCharts(filteredSales, filteredTransactions);
        this.tableManager.populateTables(filteredSales, filteredTransactions);
    }

    /**
     * Reset all filters
     */
    resetFilters() {
        document.getElementById('customerFilter').value = '';
        document.getElementById('startDate').value = '';
        document.getElementById('endDate').value = '';
        document.getElementById('paymentStatusFilter').value = '';
        document.getElementById('paymentMethodFilter').value = '';
        
        this.applyFilters();
    }

    /**
     * Export filtered data
     */
    exportData() {
        if (window.exportManager) {
            window.exportManager.exportData(this.currentFilters);
        } else {
            console.error('Export manager not available');
        }
    }

    /**
     * Validate date range
     * @param {Date} startDate - Start date
     * @param {Date} endDate - End date
     * @returns {boolean} Whether date range is valid
     */
    validateDateRange(startDate, endDate) {
        if (startDate && endDate && startDate > endDate) {
            alert('Start date cannot be after end date');
            return false;
        }
        return true;
    }

    /**
     * Get filter summary
     * @returns {string} Filter summary text
     */
    getFilterSummary() {
        const filters = this.currentFilters;
        const summary = [];
        
        if (filters.customerFilter) {
            summary.push(`Customer: ${filters.customerFilter}`);
        }
        if (filters.startDate) {
            summary.push(`From: ${filters.startDate.toLocaleDateString()}`);
        }
        if (filters.endDate) {
            summary.push(`To: ${filters.endDate.toLocaleDateString()}`);
        }
        if (filters.paymentStatusFilter) {
            summary.push(`Status: ${filters.paymentStatusFilter}`);
        }
        if (filters.paymentMethodFilter) {
            summary.push(`Method: ${filters.paymentMethodFilter}`);
        }
        
        return summary.length > 0 ? summary.join(', ') : 'No filters applied';
    }

    /**
     * Show filter summary
     */
    showFilterSummary() {
        const summary = this.getFilterSummary();
        // You could add a filter summary display element to show this
        console.log('Active filters:', summary);
    }

    /**
     * Clear specific filter
     * @param {string} filterName - Name of filter to clear
     */
    clearFilter(filterName) {
        const element = document.getElementById(filterName);
        if (element) {
            element.value = '';
            this.applyFilters();
        }
    }

    /**
     * Set filter value
     * @param {string} filterName - Name of filter to set
     * @param {string} value - Value to set
     */
    setFilter(filterName, value) {
        const element = document.getElementById(filterName);
        if (element) {
            element.value = value;
            this.applyFilters();
        }
    }

    /**
     * Get active filter count
     * @returns {number} Number of active filters
     */
    getActiveFilterCount() {
        const filters = this.currentFilters;
        let count = 0;
        
        if (filters.customerFilter) count++;
        if (filters.startDate) count++;
        if (filters.endDate) count++;
        if (filters.paymentStatusFilter) count++;
        if (filters.paymentMethodFilter) count++;
        
        return count;
    }

    /**
     * Check if any filters are active
     * @returns {boolean} Whether any filters are active
     */
    hasActiveFilters() {
        return this.getActiveFilterCount() > 0;
    }
}

// Export for use in other modules
window.Filters = Filters; 