/**
 * Charts Component
 * Handles chart initialization and updates
 */

class Charts {
    constructor(chartManager) {
        this.chartManager = chartManager;
        this.isInitialized = false;
    }

    /**
     * Initialize charts
     */
    initialize() {
        if (this.isInitialized) return;

        // Initialize chart containers
        this.setupChartContainers();
        this.isInitialized = true;
    }

    /**
     * Setup chart containers
     */
    setupChartContainers() {
        const chartIds = [
            'financialChart',
            'customerChart', 
            'paymentStatusChart',
            'trendsChart',
            'expenseCategoriesChart'
        ];

        chartIds.forEach(chartId => {
            const canvas = document.getElementById(chartId);
            if (canvas) {
                // Ensure canvas has proper dimensions
                canvas.style.width = '100%';
                canvas.style.height = '400px';
            }
        });
    }

    /**
     * Update all charts with new data
     * @param {Array} sales - Sales data
     * @param {Array} transactions - Transactions data
     */
    updateCharts(sales, transactions) {
        if (!this.isInitialized) {
            this.initialize();
        }

        console.log('Sales data for chart:', sales);
        console.log('Transactions data for chart:', transactions);

        try {
            this.chartManager.updateAllCharts(sales, transactions);
        } catch (error) {
            console.error('Error updating charts:', error);
        }
    }

    /**
     * Show loading state for charts
     */
    showLoading() {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.classList.add('loading');
        });
    }

    /**
     * Hide loading state for charts
     */
    hideLoading() {
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            container.classList.remove('loading');
        });
    }

    /**
     * Destroy all charts
     */
    destroyCharts() {
        this.chartManager.destroyAllCharts();
    }

    /**
     * Export specific chart as image
     * @param {string} chartId - Chart ID to export
     */
    exportChart(chartId) {
        if (window.exportManager) {
            const filename = `${chartId}_${new Date().toISOString().split('T')[0]}.png`;
            window.exportManager.exportChartAsImage(chartId, filename);
        }
    }

    /**
     * Export all charts as images
     */
    exportAllCharts() {
        if (window.exportManager) {
            window.exportManager.exportAllCharts();
        }
    }

    /**
     * Get chart data for specific chart
     * @param {string} chartId - Chart ID
     * @returns {Object|null} Chart data or null if not found
     */
    getChartData(chartId) {
        const chart = this.chartManager.charts[chartId];
        return chart ? chart.data : null;
    }

    /**
     * Update chart options
     * @param {string} chartId - Chart ID
     * @param {Object} options - New options
     */
    updateChartOptions(chartId, options) {
        const chart = this.chartManager.charts[chartId];
        if (chart) {
            chart.options = { ...chart.options, ...options };
            chart.update();
        }
    }

    /**
     * Resize all charts
     */
    resizeCharts() {
        Object.values(this.chartManager.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    /**
     * Add chart event listeners
     */
    addChartEventListeners() {
        // Add click handlers for chart export buttons if they exist
        const exportButtons = document.querySelectorAll('[data-export-chart]');
        exportButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const chartId = e.target.getAttribute('data-export-chart');
                if (chartId) {
                    this.exportChart(chartId);
                }
            });
        });
    }

    /**
     * Show chart tooltips
     * @param {boolean} show - Whether to show tooltips
     */
    toggleTooltips(show) {
        Object.values(this.chartManager.charts).forEach(chart => {
            if (chart && chart.options && chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.enabled = show;
                chart.update();
            }
        });
    }

    /**
     * Update chart colors
     * @param {Object} colorScheme - Color scheme object
     */
    updateChartColors(colorScheme) {
        Object.values(this.chartManager.charts).forEach(chart => {
            if (chart && chart.data && chart.data.datasets) {
                chart.data.datasets.forEach((dataset, index) => {
                    if (colorScheme[dataset.label]) {
                        dataset.backgroundColor = colorScheme[dataset.label];
                        dataset.borderColor = colorScheme[dataset.label];
                    }
                });
                chart.update();
            }
        });
    }

    /**
     * Get chart statistics
     * @returns {Object} Chart statistics
     */
    getChartStats() {
        const stats = {
            totalCharts: Object.keys(this.chartManager.charts).length,
            chartTypes: {},
            dataPoints: 0
        };

        Object.values(this.chartManager.charts).forEach(chart => {
            if (chart && chart.data) {
                const type = chart.config.type;
                stats.chartTypes[type] = (stats.chartTypes[type] || 0) + 1;
                
                if (chart.data.datasets) {
                    chart.data.datasets.forEach(dataset => {
                        if (dataset.data) {
                            stats.dataPoints += dataset.data.length;
                        }
                    });
                }
            }
        });

        return stats;
    }
}

// Export for use in other modules
window.Charts = Charts; 