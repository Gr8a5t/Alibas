// Check if admin is logged in
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('loggedIn');
    const userType = localStorage.getItem('userType');
    
    if (!isLoggedIn || userType !== 'admin') {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAdminAuth()) return;
    
    // Update admin name
    const adminEmail = localStorage.getItem('userEmail');
    document.getElementById('adminName').textContent = `Welcome, ${adminEmail}`;
    
    // Tab navigation
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    const tabContents = document.querySelectorAll('.tab-content');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Hide all tab contents
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        window.location.href = 'login.html';
    });
    
    // Initialize dashboard content
    initializeDashboard();
});

function initializeDashboard() {
    // You can expand this function to load real data
    console.log('Admin dashboard initialized');
    
    // Example: Load recent orders
    loadRecentOrders();
    
    // Example: Initialize charts
    initializeCharts();
}

function loadRecentOrders() {
    // This would fetch from API in real app
    const recentOrders = [
        { id: 'ORD-001', customer: 'John Doe', total: '₦7,000', status: 'Pending', time: '10:30 AM' },
        { id: 'ORD-002', customer: 'Jane Smith', total: '₦13,000', status: 'Processing', time: '11:15 AM' },
        { id: 'ORD-003', customer: 'Mike Johnson', total: '₦6,000', status: 'Completed', time: '9:45 AM' }
    ];
    
    // Display orders in the overview tab
    const overviewTab = document.getElementById('overview');
    if (overviewTab) {
        const ordersHTML = `
            <div class="recent-orders">
                <h2><i class="fas fa-clock"></i> Recent Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentOrders.map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${order.customer}</td>
                                <td>${order.total}</td>
                                <td><span class="status ${order.status.toLowerCase()}">${order.status}</span></td>
                                <td>${order.time}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        overviewTab.innerHTML += ordersHTML;
    }
}

function initializeCharts() {
    // This would initialize Chart.js charts
    console.log('Charts initialized');
}