// Authentication Check Script
(function() {
    'use strict';
    
    // Check if user is authenticated
    function checkAuth() {
        const isAuthenticated = sessionStorage.getItem('authenticated') === 'true';
        const loginTime = sessionStorage.getItem('loginTime');
        
        // Check if session has expired (8 hours)
        const sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
        const currentTime = Date.now();
        const timeSinceLogin = currentTime - parseInt(loginTime || '0');
        
        if (!isAuthenticated || timeSinceLogin > sessionTimeout) {
            // Clear any existing session
            sessionStorage.removeItem('authenticated');
            sessionStorage.removeItem('loginTime');
            
            // Redirect to login page
            if (window.location.pathname !== '/login.html' && !window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
                return false;
            }
        }
        
        return true;
    }
    
    // Add logout functionality
    function logout() {
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('loginTime');
        window.location.href = 'login.html';
    }
    
    // Check authentication on page load
    if (!checkAuth()) {
        return;
    }
    
    // Add logout button to protected pages
    function addLogoutButton() {
        // Create logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = `
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
        `;
        logoutBtn.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 flex items-center text-sm font-medium z-50';
        logoutBtn.onclick = logout;
        
        // Add to page
        document.body.appendChild(logoutBtn);
    }
    
    // Add logout button after page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addLogoutButton);
    } else {
        addLogoutButton();
    }
    
    // Expose logout function globally
    window.logout = logout;
    
})(); 