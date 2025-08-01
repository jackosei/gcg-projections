/**
 * Table Manager Utility
 * Handles table operations, pagination, and sorting
 */

class TableManager {
    constructor() {
        this.salesPage = 1;
        this.transactionsPage = 1;
        this.salesPerPage = 25;
        this.transactionsPerPage = 25;
        this.salesSort = { key: 'date', dir: 'desc' };
        this.transactionsSort = { key: 'date', dir: 'desc' };
    }

    /**
     * Populate sales table with data
     * @param {Array} sales - Sales data
     */
    populateSalesTable(sales) {
        let sortedSales = [...sales];
        sortedSales.sort((a, b) => {
            let valA = a[this.salesSort.key], valB = b[this.salesSort.key];
            if (this.salesSort.key === 'date') { 
                valA = a.date.getTime(); 
                valB = b.date.getTime(); 
            }
            if (typeof valA === 'string') { 
                valA = valA.toLowerCase(); 
                valB = valB.toLowerCase(); 
            }
            if (valA < valB) return this.salesSort.dir === 'asc' ? -1 : 1;
            if (valA > valB) return this.salesSort.dir === 'asc' ? 1 : -1;
            return 0;
        });

        const totalSales = sortedSales.length;
        const startIdx = this.salesPerPage === Infinity ? 0 : (this.salesPage - 1) * this.salesPerPage;
        const endIdx = this.salesPerPage === Infinity ? totalSales : Math.min(startIdx + this.salesPerPage, totalSales);
        const pageSales = sortedSales.slice(startIdx, endIdx);

        const salesTableBody = document.getElementById('salesTableBody');
        salesTableBody.innerHTML = '';

        pageSales.forEach(sale => {
            const row = salesTableBody.insertRow();
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-900">${sale.date.toLocaleDateString()}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${sale.customer}</td>
                <td class="px-4 py-3 text-sm text-gray-900 text-right">${sale.totalAmount.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' })}</td>
                <td class="px-4 py-3 text-sm">
                    <span class="status-badge status-${sale.paymentStatus.toLowerCase()}">${sale.paymentStatus}</span>
                </td>
                <td class="px-4 py-3 text-sm text-gray-900">${sale.paymentMethod}</td>
            `;
        });

        // Update page info
        const salesPageInfo = document.getElementById('salesPageInfo');
        salesPageInfo.textContent = totalSales === 0 ? '0' : `${startIdx + 1}-${endIdx} of ${totalSales}`;
        
        document.getElementById('salesPrevPage').disabled = this.salesPage <= 1;
        document.getElementById('salesNextPage').disabled = endIdx >= totalSales;
    }

    /**
     * Populate transactions table with data
     * @param {Array} transactions - Transactions data
     */
    populateTransactionsTable(transactions) {
        let sortedTransactions = [...transactions];
        sortedTransactions.sort((a, b) => {
            let valA = a[this.transactionsSort.key], valB = b[this.transactionsSort.key];
            if (this.transactionsSort.key === 'date') { 
                valA = a.date.getTime(); 
                valB = b.date.getTime(); 
            }
            if (typeof valA === 'string') { 
                valA = valA.toLowerCase(); 
                valB = valB.toLowerCase(); 
            }
            if (valA < valB) return this.transactionsSort.dir === 'asc' ? -1 : 1;
            if (valA > valB) return this.transactionsSort.dir === 'asc' ? 1 : -1;
            return 0;
        });

        const totalTransactions = sortedTransactions.length;
        const tStartIdx = this.transactionsPerPage === Infinity ? 0 : (this.transactionsPage - 1) * this.transactionsPerPage;
        const tEndIdx = this.transactionsPerPage === Infinity ? totalTransactions : Math.min(tStartIdx + this.transactionsPerPage, totalTransactions);
        const pageTransactions = sortedTransactions.slice(tStartIdx, tEndIdx);

        const transactionsTableBody = document.getElementById('transactionsTableBody');
        transactionsTableBody.innerHTML = '';

        pageTransactions.forEach(transaction => {
            const row = transactionsTableBody.insertRow();
            row.className = 'hover:bg-gray-50';
            row.innerHTML = `
                <td class="px-4 py-3 text-sm text-gray-900">${transaction.date.toLocaleDateString()}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${transaction.name}</td>
                <td class="px-4 py-3 text-sm text-gray-900 text-right">${transaction.amount.toLocaleString('en-GH', { style: 'currency', currency: 'GHS' })}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${transaction.category}</td>
                <td class="px-4 py-3 text-sm text-gray-900">${transaction.paymentMethod}</td>
            `;
        });

        // Update page info
        const transactionsPageInfo = document.getElementById('transactionsPageInfo');
        transactionsPageInfo.textContent = totalTransactions === 0 ? '0' : `${tStartIdx + 1}-${tEndIdx} of ${totalTransactions}`;
        
        document.getElementById('transactionsPrevPage').disabled = this.transactionsPage <= 1;
        document.getElementById('transactionsNextPage').disabled = tEndIdx >= totalTransactions;
    }

    /**
     * Setup table controls (pagination and sorting)
     */
    setupTableControls() {
        // Records per page selectors
        document.getElementById('salesRecordsPerPage').onchange = () => {
            this.salesPerPage = this.salesRecordsPerPage.value === 'all' ? Infinity : parseInt(this.salesRecordsPerPage.value, 10);
            this.salesPage = 1;
            this.populateSalesTable(window.currentFilteredSales || []);
        };

        document.getElementById('transactionsRecordsPerPage').onchange = () => {
            this.transactionsPerPage = this.transactionsRecordsPerPage.value === 'all' ? Infinity : parseInt(this.transactionsRecordsPerPage.value, 10);
            this.transactionsPage = 1;
            this.populateTransactionsTable(window.currentFilteredTransactions || []);
        };

        // Prev/Next buttons
        document.getElementById('salesPrevPage').onclick = () => {
            if (this.salesPage > 1) { 
                this.salesPage--; 
                this.populateSalesTable(window.currentFilteredSales || []); 
            }
        };

        document.getElementById('salesNextPage').onclick = () => {
            const total = (window.currentFilteredSales || []).length;
            if (this.salesPage < Math.ceil(total / this.salesPerPage)) { 
                this.salesPage++; 
                this.populateSalesTable(window.currentFilteredSales || []); 
            }
        };

        document.getElementById('transactionsPrevPage').onclick = () => {
            if (this.transactionsPage > 1) { 
                this.transactionsPage--; 
                this.populateTransactionsTable(window.currentFilteredTransactions || []); 
            }
        };

        document.getElementById('transactionsNextPage').onclick = () => {
            const total = (window.currentFilteredTransactions || []).length;
            if (this.transactionsPage < Math.ceil(total / this.transactionsPerPage)) { 
                this.transactionsPage++; 
                this.populateTransactionsTable(window.currentFilteredTransactions || []); 
            }
        };

        // Sorting
        document.querySelectorAll('.sortable-header').forEach(header => {
            header.onclick = () => {
                const key = header.getAttribute('data-sort');
                const table = header.getAttribute('data-table');
                
                if (table === 'sales') {
                    if (this.salesSort.key === key) {
                        this.salesSort.dir = this.salesSort.dir === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.salesSort.key = key;
                        this.salesSort.dir = 'asc';
                    }
                    this.salesPage = 1;
                    this.populateSalesTable(window.currentFilteredSales || []);
                } else {
                    if (this.transactionsSort.key === key) {
                        this.transactionsSort.dir = this.transactionsSort.dir === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.transactionsSort.key = key;
                        this.transactionsSort.dir = 'asc';
                    }
                    this.transactionsPage = 1;
                    this.populateTransactionsTable(window.currentFilteredTransactions || []);
                }
            };
        });
    }

    /**
     * Setup tab switching
     */
    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('#dataTabs .tab-button');
        const salesTabPane = document.getElementById('salesTab');
        const expensesTabPane = document.getElementById('expensesTab');

        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                tabButtons.forEach(b => b.classList.remove('active', 'border-blue-500', 'font-semibold'));
                btn.classList.add('active', 'border-blue-500', 'font-semibold');
                
                if (btn.dataset.tab === 'sales') {
                    salesTabPane.classList.remove('hidden');
                    expensesTabPane.classList.add('hidden');
                } else {
                    salesTabPane.classList.add('hidden');
                    expensesTabPane.classList.remove('hidden');
                }
            });
        });
    }

    /**
     * Populate both tables
     * @param {Array} sales - Sales data
     * @param {Array} transactions - Transactions data
     */
    populateTables(sales, transactions) {
        window.currentFilteredSales = sales;
        window.currentFilteredTransactions = transactions;
        
        this.populateSalesTable(sales);
        this.populateTransactionsTable(transactions);
    }

    /**
     * Reset pagination
     */
    resetPagination() {
        this.salesPage = 1;
        this.transactionsPage = 1;
    }
}

// Export for use in other modules
window.TableManager = TableManager; 