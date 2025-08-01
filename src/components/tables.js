/**
 * Tables Component
 * Handles table operations and interactions
 */

class Tables {
    constructor(tableManager) {
        this.tableManager = tableManager;
        this.isInitialized = false;
    }

    /**
     * Initialize tables
     */
    initialize() {
        if (this.isInitialized) return;

        this.tableManager.setupTableControls();
        this.tableManager.setupTabSwitching();
        this.addTableEventListeners();
        this.isInitialized = true;
    }

    /**
     * Add table event listeners
     */
    addTableEventListeners() {
        // Add row click handlers
        this.addRowClickHandlers();
        
        // Add keyboard navigation
        this.addKeyboardNavigation();
        
        // Add table search functionality
        this.addTableSearch();
    }

    /**
     * Add row click handlers
     */
    addRowClickHandlers() {
        // Sales table row clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('#salesTableBody tr')) {
                const row = e.target.closest('tr');
                this.handleRowClick(row, 'sales');
            }
        });

        // Transactions table row clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('#transactionsTableBody tr')) {
                const row = e.target.closest('tr');
                this.handleRowClick(row, 'transactions');
            }
        });
    }

    /**
     * Handle row click
     * @param {HTMLElement} row - Clicked row
     * @param {string} tableType - Table type ('sales' or 'transactions')
     */
    handleRowClick(row, tableType) {
        // Add visual feedback
        row.classList.add('bg-blue-50');
        setTimeout(() => {
            row.classList.remove('bg-blue-50');
        }, 200);

        // You could add more functionality here like showing details modal
        console.log(`Row clicked in ${tableType} table`);
    }

    /**
     * Add keyboard navigation
     */
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            
            if (activeElement && activeElement.closest('table')) {
                const table = activeElement.closest('table');
                const rows = Array.from(table.querySelectorAll('tbody tr'));
                const currentIndex = rows.indexOf(activeElement.closest('tr'));
                
                switch (e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        if (currentIndex < rows.length - 1) {
                            rows[currentIndex + 1].focus();
                        }
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        if (currentIndex > 0) {
                            rows[currentIndex - 1].focus();
                        }
                        break;
                    case 'Enter':
                        e.preventDefault();
                        this.handleRowClick(activeElement.closest('tr'), 
                            table.id.includes('sales') ? 'sales' : 'transactions');
                        break;
                }
            }
        });
    }

    /**
     * Add table search functionality
     */
    addTableSearch() {
        // This could be enhanced with a search input field
        // For now, we'll just add a placeholder for future implementation
        console.log('Table search functionality ready for implementation');
    }

    /**
     * Update tables with new data
     * @param {Array} sales - Sales data
     * @param {Array} transactions - Transactions data
     */
    updateTables(sales, transactions) {
        if (!this.isInitialized) {
            this.initialize();
        }

        this.tableManager.populateTables(sales, transactions);
    }

    /**
     * Get table statistics
     * @returns {Object} Table statistics
     */
    getTableStats() {
        const salesTable = document.getElementById('salesTableBody');
        const transactionsTable = document.getElementById('transactionsTableBody');
        
        return {
            salesRows: salesTable ? salesTable.children.length : 0,
            transactionsRows: transactionsTable ? transactionsTable.children.length : 0,
            totalRows: (salesTable ? salesTable.children.length : 0) + 
                      (transactionsTable ? transactionsTable.children.length : 0)
        };
    }

    /**
     * Export table data
     * @param {string} tableType - Table type to export
     */
    exportTableData(tableType) {
        const table = tableType === 'sales' ? 
            document.getElementById('salesTableBody') : 
            document.getElementById('transactionsTableBody');
        
        if (!table) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        
        if (tableType === 'sales') {
            csvContent += "Date,Customer,Total Amount,Payment Status,Payment Method\n";
            Array.from(table.children).forEach(row => {
                const cells = Array.from(row.children);
                csvContent += `${cells[0].textContent},"${cells[1].textContent}",${cells[2].textContent},${cells[3].textContent},${cells[4].textContent}\n`;
            });
        } else {
            csvContent += "Date,Description,Amount,Category,Payment Method\n";
            Array.from(table.children).forEach(row => {
                const cells = Array.from(row.children);
                csvContent += `${cells[0].textContent},"${cells[1].textContent}",${cells[2].textContent},${cells[3].textContent},${cells[4].textContent}\n`;
            });
        }

        const link = document.createElement("a");
        link.setAttribute("href", encodeURI(csvContent));
        link.setAttribute("download", `${tableType}_data_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Sort table by column
     * @param {string} tableType - Table type
     * @param {string} column - Column to sort by
     * @param {string} direction - Sort direction ('asc' or 'desc')
     */
    sortTable(tableType, column, direction) {
        if (tableType === 'sales') {
            this.tableManager.salesSort = { key: column, dir: direction };
            this.tableManager.salesPage = 1;
            this.tableManager.populateSalesTable(window.currentFilteredSales || []);
        } else {
            this.tableManager.transactionsSort = { key: column, dir: direction };
            this.tableManager.transactionsPage = 1;
            this.tableManager.populateTransactionsTable(window.currentFilteredTransactions || []);
        }
    }

    /**
     * Filter table rows
     * @param {string} tableType - Table type
     * @param {string} searchTerm - Search term
     */
    filterTableRows(tableType, searchTerm) {
        const table = tableType === 'sales' ? 
            document.getElementById('salesTableBody') : 
            document.getElementById('transactionsTableBody');
        
        if (!table) return;

        const rows = Array.from(table.children);
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const matches = text.includes(searchTerm.toLowerCase());
            row.style.display = matches ? '' : 'none';
        });
    }

    /**
     * Highlight table rows
     * @param {string} tableType - Table type
     * @param {string} searchTerm - Search term to highlight
     */
    highlightTableRows(tableType, searchTerm) {
        const table = tableType === 'sales' ? 
            document.getElementById('salesTableBody') : 
            document.getElementById('transactionsTableBody');
        
        if (!table || !searchTerm) return;

        const rows = Array.from(table.children);
        rows.forEach(row => {
            const cells = Array.from(row.children);
            cells.forEach(cell => {
                const text = cell.textContent;
                if (text.toLowerCase().includes(searchTerm.toLowerCase())) {
                    cell.style.backgroundColor = '#fef3c7';
                } else {
                    cell.style.backgroundColor = '';
                }
            });
        });
    }

    /**
     * Clear table highlights
     * @param {string} tableType - Table type
     */
    clearTableHighlights(tableType) {
        const table = tableType === 'sales' ? 
            document.getElementById('salesTableBody') : 
            document.getElementById('transactionsTableBody');
        
        if (!table) return;

        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
        });
    }

    /**
     * Get selected table rows
     * @param {string} tableType - Table type
     * @returns {Array} Selected rows
     */
    getSelectedRows(tableType) {
        const table = tableType === 'sales' ? 
            document.getElementById('salesTableBody') : 
            document.getElementById('transactionsTableBody');
        
        if (!table) return [];

        return Array.from(table.children).filter(row => 
            row.classList.contains('selected')
        );
    }

    /**
     * Toggle row selection
     * @param {HTMLElement} row - Row to toggle
     */
    toggleRowSelection(row) {
        row.classList.toggle('selected');
        row.style.backgroundColor = row.classList.contains('selected') ? '#dbeafe' : '';
    }
}

// Export for use in other modules
window.Tables = Tables; 