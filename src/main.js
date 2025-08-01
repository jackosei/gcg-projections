/**
 * Main Application
 * Initializes and coordinates all components
 */

class FinancialDashboard {
    constructor() {
        this.dataProcessor = null;
        this.chartManager = null;
        this.tableManager = null;
        this.exportManager = null;
        this.fileUpload = null;
        this.filterComponent = null;
        this.summaryComponent = null;
        this.chartsComponent = null;
        this.tablesComponent = null;
        
        this.isInitialized = false;
    }

    /**
     * Initialize the application
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // Initialize utilities
            this.initializeUtilities();
            
            // Initialize components
            this.initializeComponents();
            
            // Setup global event listeners
            this.setupGlobalEventListeners();
            
            // Setup window resize handler
            this.setupResizeHandler();
            
            this.isInitialized = true;
            console.log('Financial Dashboard initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Financial Dashboard:', error);
        }
    }

    /**
     * Initialize utility classes
     */
    initializeUtilities() {
        this.dataProcessor = new DataProcessor();
        this.chartManager = new ChartManager();
        this.tableManager = new TableManager();
        this.exportManager = new ExportManager();
        
        // Set up export manager
        this.exportManager.setDataProcessor(this.dataProcessor);
        
        // Make utilities globally available
        window.dataProcessor = this.dataProcessor;
        window.chartManager = this.chartManager;
        window.tableManager = this.tableManager;
        window.exportManager = this.exportManager;
    }

    /**
     * Initialize components
     */
    initializeComponents() {
        this.fileUpload = new FileUpload(this.dataProcessor);
        this.summaryComponent = new Summary(this.dataProcessor);
        this.chartsComponent = new Charts(this.chartManager);
        this.tablesComponent = new Tables(this.tableManager);
        this.filterComponent = new Filters(
            this.dataProcessor, 
            this.chartManager, 
            this.tableManager, 
            this.summaryComponent
        );
        
        // Initialize components
        this.tablesComponent.initialize();
        
        // Make components globally available
        window.filterComponent = this.filterComponent;
        window.fileUpload = this.fileUpload;
    }

    /**
     * Setup global event listeners
     */
    setupGlobalEventListeners() {
        // Handle file upload completion
        document.addEventListener('filesLoaded', (event) => {
            this.handleFilesLoaded(event.detail);
        });

        // Handle filter changes
        document.addEventListener('filtersApplied', (event) => {
            this.handleFiltersApplied(event.detail);
        });

        // Handle export requests
        document.addEventListener('exportRequested', (event) => {
            this.handleExportRequested(event.detail);
        });

        // Handle window focus (for chart resizing)
        window.addEventListener('focus', () => {
            if (this.chartsComponent) {
                this.chartsComponent.resizeCharts();
            }
        });
    }

    /**
     * Setup resize handler
     */
    setupResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.chartsComponent) {
                    this.chartsComponent.resizeCharts();
                }
            }, 250);
        });
    }

    /**
     * Handle files loaded event
     * @param {Object} data - File data
     */
    handleFilesLoaded(data) {
        const { salesData, transactionsData } = data;
        
        // Update all components with the new data
        this.summaryComponent.updateSummary(salesData, transactionsData);
        this.chartsComponent.updateCharts(salesData, transactionsData);
        this.tablesComponent.updateTables(salesData, transactionsData);
        
        // Apply initial filters
        this.filterComponent.applyFilters();
    }

    /**
     * Handle filters applied event
     * @param {Object} data - Filter data
     */
    handleFiltersApplied(data) {
        const { filteredSales, filteredTransactions } = data;
        
        // Update components with filtered data
        this.summaryComponent.updateSummary(filteredSales, filteredTransactions);
        this.chartsComponent.updateCharts(filteredSales, filteredTransactions);
        this.tablesComponent.updateTables(filteredSales, filteredTransactions);
    }

    /**
     * Handle export requested event
     * @param {Object} data - Export data
     */
    handleExportRequested(data) {
        const { type, filters } = data;
        
        switch (type) {
            case 'csv':
                this.exportManager.exportData(filters);
                break;
            case 'charts':
                this.chartsComponent.exportAllCharts();
                break;
            case 'summary':
                this.exportManager.exportSummaryReport();
                break;
            default:
                console.warn('Unknown export type:', type);
        }
    }

    /**
     * Get application statistics
     * @returns {Object} Application statistics
     */
    getStats() {
        return {
            dataProcessor: {
                salesCount: this.dataProcessor.salesData.length,
                transactionsCount: this.dataProcessor.transactionsData.length
            },
            charts: this.chartsComponent ? this.chartsComponent.getChartStats() : {},
            tables: this.tablesComponent ? this.tablesComponent.getTableStats() : {},
            filters: this.filterComponent ? {
                activeFilters: this.filterComponent.getActiveFilterCount(),
                hasFilters: this.filterComponent.hasActiveFilters()
            } : {}
        };
    }

    /**
     * Reset application state
     */
    reset() {
        // Clear all data
        if (this.fileUpload) {
            this.fileUpload.clearData();
        }
        
        // Destroy charts
        if (this.chartsComponent) {
            this.chartsComponent.destroyCharts();
        }
        
        // Reset filters
        if (this.filterComponent) {
            this.filterComponent.resetFilters();
        }
        
        // Reset tables
        if (this.tableManager) {
            this.tableManager.resetPagination();
        }
        
        console.log('Application state reset');
    }

    /**
     * Export application state
     * @returns {Object} Application state
     */
    exportState() {
        return {
            filters: this.filterComponent ? this.filterComponent.currentFilters : {},
            tableState: {
                salesPage: this.tableManager.salesPage,
                transactionsPage: this.tableManager.transactionsPage,
                salesPerPage: this.tableManager.salesPerPage,
                transactionsPerPage: this.tableManager.transactionsPerPage
            },
            stats: this.getStats()
        };
    }

    /**
     * Import application state
     * @param {Object} state - Application state to import
     */
    importState(state) {
        if (state.filters && this.filterComponent) {
            Object.entries(state.filters).forEach(([key, value]) => {
                this.filterComponent.setFilter(key, value);
            });
        }
        
        if (state.tableState && this.tableManager) {
            this.tableManager.salesPage = state.tableState.salesPage || 1;
            this.tableManager.transactionsPage = state.tableState.transactionsPage || 1;
            this.tableManager.salesPerPage = state.tableState.salesPerPage || 25;
            this.tableManager.transactionsPerPage = state.tableState.transactionsPerPage || 25;
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const dashboard = new FinancialDashboard();
        await dashboard.initialize();
        
        // Make dashboard globally available
        window.dashboard = dashboard;
        
        console.log('Financial Dashboard ready');
    } catch (error) {
        console.error('Failed to initialize Financial Dashboard:', error);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && window.dashboard) {
        // Refresh charts when page becomes visible
        if (window.dashboard.chartsComponent) {
            window.dashboard.chartsComponent.resizeCharts();
        }
    }
});

// Handle beforeunload
window.addEventListener('beforeunload', () => {
    // Clean up any resources if needed
    if (window.dashboard && window.dashboard.chartsComponent) {
        window.dashboard.chartsComponent.destroyCharts();
    }
}); 