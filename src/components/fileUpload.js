/**
 * File Upload Component
 * Handles CSV file uploads and processing
 */

class FileUpload {
    constructor(dataProcessor) {
        this.dataProcessor = dataProcessor;
        this.salesData = [];
        this.transactionsData = [];
        this.setupEventListeners();
    }

    /**
     * Setup event listeners for file uploads
     */
    setupEventListeners() {
        document.getElementById('salesFile').addEventListener('change', (event) => {
            this.handleFileSelect(event, 'sales');
        });

        document.getElementById('transactionsFile').addEventListener('change', (event) => {
            this.handleFileSelect(event, 'transactions');
        });
    }

    /**
     * Handle file selection
     * @param {Event} event - File input change event
     * @param {string} type - File type ('sales' or 'transactions')
     */
    async handleFileSelect(event, type) {
        const file = event.target.files[0];
        if (!file) return;

        const statusElement = document.getElementById(type === 'sales' ? 'salesFileStatus' : 'transactionsFileStatus');
        statusElement.textContent = `Processing ${file.name}...`;

        try {
            const processedData = await this.dataProcessor.processFile(file, type);
            
            if (type === 'sales') {
                this.salesData = processedData;
                statusElement.textContent = `✅ Loaded ${processedData.length} sales records`;
            } else {
                this.transactionsData = processedData;
                statusElement.textContent = `✅ Loaded ${processedData.length} transaction records`;
            }

            // Check if both files are loaded
            if (this.salesData.length > 0 && this.transactionsData.length > 0) {
                this.processData();
            }
        } catch (error) {
            console.error("Error processing file:", error);
            statusElement.textContent = "❌ Error processing file";
            alert("There was an error processing the CSV file. Please check the file format.");
        }
    }

    /**
     * Process data when both files are loaded
     */
    processData() {
        console.log('Processing data...');
        console.log('Sales data length:', this.salesData.length);
        console.log('Transactions data length:', this.transactionsData.length);
        console.log('Sample sales data:', this.salesData.slice(0, 3));
        console.log('Sample transactions data:', this.transactionsData.slice(0, 3));

        // Show all sections
        document.getElementById('summary').classList.remove('hidden');
        document.getElementById('filters').classList.remove('hidden');
        document.getElementById('charts').classList.remove('hidden');
        document.getElementById('data-section').classList.remove('hidden');

        // Calculate previous period data
        this.dataProcessor.calculatePreviousPeriodData();
        
        // Trigger initial filter application
        if (window.filterComponent) {
            window.filterComponent.applyFilters();
        }
    }

    /**
     * Get current data
     * @returns {Object} Current sales and transactions data
     */
    getData() {
        return {
            salesData: this.salesData,
            transactionsData: this.transactionsData
        };
    }

    /**
     * Clear all data
     */
    clearData() {
        this.salesData = [];
        this.transactionsData = [];
        
        // Clear file inputs
        document.getElementById('salesFile').value = '';
        document.getElementById('transactionsFile').value = '';
        
        // Clear status messages
        document.getElementById('salesFileStatus').textContent = '';
        document.getElementById('transactionsFileStatus').textContent = '';
        
        // Hide sections
        document.getElementById('summary').classList.add('hidden');
        document.getElementById('filters').classList.add('hidden');
        document.getElementById('charts').classList.add('hidden');
        document.getElementById('data-section').classList.add('hidden');
    }

    /**
     * Validate file type
     * @param {File} file - File to validate
     * @returns {boolean} Whether file is valid
     */
    validateFile(file) {
        const validTypes = ['text/csv', 'application/csv'];
        const validExtensions = ['.csv'];
        
        const isValidType = validTypes.includes(file.type);
        const isValidExtension = validExtensions.some(ext => 
            file.name.toLowerCase().endsWith(ext)
        );
        
        return isValidType || isValidExtension;
    }

    /**
     * Show loading state
     * @param {string} type - File type
     */
    showLoading(type) {
        const statusElement = document.getElementById(type === 'sales' ? 'salesFileStatus' : 'transactionsFileStatus');
        statusElement.textContent = `Processing ${type} file...`;
        statusElement.className = 'mt-2 text-sm text-blue-500';
    }

    /**
     * Show success state
     * @param {string} type - File type
     * @param {number} count - Number of records
     */
    showSuccess(type, count) {
        const statusElement = document.getElementById(type === 'sales' ? 'salesFileStatus' : 'transactionsFileStatus');
        statusElement.textContent = `✅ Loaded ${count} ${type} records`;
        statusElement.className = 'mt-2 text-sm text-green-500';
    }

    /**
     * Show error state
     * @param {string} type - File type
     * @param {string} message - Error message
     */
    showError(type, message) {
        const statusElement = document.getElementById(type === 'sales' ? 'salesFileStatus' : 'transactionsFileStatus');
        statusElement.textContent = `❌ ${message}`;
        statusElement.className = 'mt-2 text-sm text-red-500';
    }
}

// Export for use in other modules
window.FileUpload = FileUpload; 