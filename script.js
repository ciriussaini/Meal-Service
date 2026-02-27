// --- Database / State Management (LocalStorage) ---
// Note: SAMPLE_PROVIDERS, SAMPLE_ORDERS, and SAMPLE_REQUESTS are loaded from config.js

// Seed the local storage with initial data if it doesn't exist
function initializeData() {
    if (!localStorage.getItem('chms_initialized')) {
        localStorage.setItem('chms_providers', JSON.stringify(SAMPLE_PROVIDERS));
        localStorage.setItem('chms_orders', JSON.stringify(SAMPLE_ORDERS));
        localStorage.setItem('chms_requests', JSON.stringify(SAMPLE_REQUESTS));
        localStorage.setItem('chms_initialized', 'true');
    }
}

// User Accounts built from configuration (loaded from config.js)
const USERS = {
    [CONFIG.ADMIN_USERNAME]: { password: CONFIG.ADMIN_PASSWORD, role: 'admin', name: CONFIG.ADMIN_NAME },
    [CONFIG.USER_USERNAME]: { password: CONFIG.USER_PASSWORD, role: 'user', name: CONFIG.USER_NAME }
};

let currentUser = null;

// --- Utility Functions for LocalStorage Data Retrieval/Update ---
function getProviders() { return JSON.parse(localStorage.getItem('chms_providers') || '[]'); }
function setProviders(data) { localStorage.setItem('chms_providers', JSON.stringify(data)); }

function getOrders() { return JSON.parse(localStorage.getItem('chms_orders') || '[]'); }
function setOrders(data) { localStorage.setItem('chms_orders', JSON.stringify(data)); }

function getRequests() { return JSON.parse(localStorage.getItem('chms_requests') || '[]'); }
function setRequests(data) { localStorage.setItem('chms_requests', JSON.stringify(data)); }

function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// --- Navigation / UI Flow ---
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function updateNavbar() {
    const nav = document.getElementById('navbar');
    if (currentUser) {
        nav.classList.remove('hidden');
        document.getElementById('nav-user-name').textContent = `Welcome, ${currentUser.name}`;
    } else {
        nav.classList.add('hidden');
    }
}

function goHome() {
    if (!currentUser) {
        showPage('page-login');
        return;
    }
    if (currentUser.role === 'admin') {
        renderAdminDashboard();
        showPage('page-admin-dashboard');
    } else {
        renderUserDashboard();
        showPage('page-user-dashboard');
    }
}

// --- Authentication ---
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const userField = document.getElementById('username').value.trim();
    const passField = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('login-error');

    if (USERS[userField] && USERS[userField].password === passField) {
        currentUser = { username: userField, ...USERS[userField] };
        sessionStorage.setItem('chms_currentUser', JSON.stringify(currentUser));
        errorMsg.classList.add('hidden');
        this.reset();
        updateNavbar();
        goHome();
    } else {
        errorMsg.classList.remove('hidden');
    }
});

function logout() {
    currentUser = null;
    sessionStorage.removeItem('chms_currentUser');
    updateNavbar();
    showPage('page-login');
}

function checkLoginSession() {
    const session = sessionStorage.getItem('chms_currentUser');
    if (session) {
        currentUser = JSON.parse(session);
        updateNavbar();
        goHome();
    } else {
        showPage('page-login');
    }
}

// --- User Dashboard ---
function renderUserDashboard() {
    // Clear search manually when rendering dashboard
    const searchInput = document.getElementById('provider-search');
    if (searchInput) searchInput.value = '';

    filterProviders();
    renderUserOrders();
    renderUserRequests();
}

function filterProviders() {
    const searchInput = document.getElementById('provider-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const providers = getProviders().filter(p => p.status === 'approved');
    const container = document.getElementById('provider-list');
    container.innerHTML = '';

    const filtered = providers.filter(p =>
        p.providerName.toLowerCase().includes(searchTerm) ||
        p.kitchenName.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No meal providers found matching your search.</p>';
        return;
    }

    filtered.forEach(provider => {
        const card = document.createElement('div');
        card.className = 'card provider-card';
        card.innerHTML = `
            <h3>${provider.kitchenName}</h3>
            <p><strong>Chef/Cook:</strong> ${provider.providerName}</p>
            <p><strong>Phone:</strong> ${provider.phone}</p>
            <div class="card-actions">
                <button class="btn btn-outline" onclick="viewMenu('${provider.id}')">View Menu</button>
                <button class="btn btn-primary" onclick="openOrderForm('${provider.id}')">Order Meal</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function getStatusColor(status) {
    if (status === 'Pending' || status === 'pending') return 'orange';
    if (status === 'Approved') return 'var(--primary-color)';
    if (status === 'Completed' || status === 'approved') return 'var(--success-color)';
    if (status === 'Rejected') return 'var(--danger-color)';
    return 'var(--text-main)';
}

function renderUserOrders() {
    const orders = getOrders().filter(o => o.username === currentUser.username);
    const container = document.getElementById('user-orders');
    if (!container) return;

    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p class="text-muted">You have no orders yet.</p>';
        return;
    }

    orders.forEach(order => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div>
                <strong style="color:var(--secondary-color); font-size:1.1rem;">${order.providerName}</strong>
                <div style="font-size:0.9rem; margin-top:4px;">${order.mealType} - ${order.quantity} Meal(s)</div>
            </div>
            <div>
                <span style="font-weight:600; font-size: 0.95em; padding: 4px 8px; border-radius: 4px; background: rgba(0,0,0,0.03); color: ${getStatusColor(order.status || 'Pending')}">Status: ${order.status || 'Pending'}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderUserRequests() {
    const requests = getRequests().filter(r => r.username === currentUser.username);
    const container = document.getElementById('user-requests');
    if (!container) return;

    container.innerHTML = '';

    if (requests.length === 0) {
        container.innerHTML = '<p class="text-muted">You have made no provider requests.</p>';
        return;
    }

    requests.forEach(req => {
        const item = document.createElement('div');
        item.className = 'list-item';
        // Normalize status display
        const displayStatus = (req.status || 'Pending');
        const formattedStatus = displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1);

        item.innerHTML = `
            <div>
                <strong style="color:var(--secondary-color); font-size:1.1rem;">${req.kitchenName}</strong>
            </div>
            <div>
                <span style="font-weight:600; font-size: 0.95em; padding: 4px 8px; border-radius: 4px; background: rgba(0,0,0,0.03); color: ${getStatusColor(formattedStatus)}">Status: ${formattedStatus}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

// Provider Menu Page View rendering
function viewMenu(providerId) {
    const provider = getProviders().find(p => p.id === providerId);
    if (!provider) return;
    const container = document.getElementById('menu-container');

    const renderItems = (items) => {
        if (Array.isArray(items)) {
            return `<ul class="menu-list">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        }
        return '';
    };

    let lunchContent = renderItems(provider.menuLunch);
    let dinnerContent = renderItems(provider.menuDinner);

    if (provider.sampleMenu) {
        lunchContent = `<div style="white-space: pre-wrap; font-size:1.05rem; padding:12px; background:#f9fafb; border-radius:8px; border:1px solid #e5e7eb;">${provider.sampleMenu}</div>`;
        dinnerContent = '';
    }

    container.innerHTML = `
        <div style="margin-bottom: 24px;">
            <h2>${provider.kitchenName}</h2>
            <p class="text-muted">By ${provider.providerName}</p>
        </div>
        <div class="menu-section">
            <h3>Lunch Highlights</h3>
            ${lunchContent}
        </div>
        ${dinnerContent ? `
        <div class="menu-section">
            <h3>Dinner Highlights</h3>
            ${dinnerContent}
        </div>` : ''}
        <button class="btn btn-primary btn-full" style="margin-top:20px;" onclick="openOrderForm('${provider.id}')">Order Meal Now</button>
    `;
    showPage('page-provider-menu');
}

// --- Order System ---
function openOrderForm(providerId) {
    const provider = getProviders().find(p => p.id === providerId);
    if (!provider) return;
    document.getElementById('order-provider-id').value = provider.id;
    document.getElementById('order-provider-name').textContent = `Ordering from: ${provider.kitchenName}`;
    document.getElementById('customer-name').value = currentUser.name || '';
    showPage('page-order-form');
}

document.getElementById('order-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const providerId = document.getElementById('order-provider-id').value;
    const provider = getProviders().find(p => p.id === providerId);

    const newOrder = {
        id: 'ord_' + generateId(),
        username: currentUser.username,
        customerName: document.getElementById('customer-name').value.trim(),
        phone: document.getElementById('customer-phone').value.trim(),
        providerId: providerId,
        providerName: provider.kitchenName,
        mealType: document.getElementById('meal-type').value,
        quantity: parseInt(document.getElementById('meal-quantity').value, 10),
        date: new Date().toISOString(),
        status: 'Pending'
    };

    const orders = getOrders();
    orders.push(newOrder);
    setOrders(orders);
    alert('🎉 Order placed successfully!');
    this.reset();
    goHome();
});


// --- Provider Application System ---
document.getElementById('provider-request-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const newRequest = {
        id: 'req_' + generateId(),
        username: currentUser.username,
        providerName: document.getElementById('req-name').value.trim(),
        kitchenName: document.getElementById('req-kitchen').value.trim(),
        phone: document.getElementById('req-phone').value.trim(),
        sampleMenu: document.getElementById('req-menu').value.trim(),
        status: 'Pending'
    };

    const requests = getRequests();
    requests.push(newRequest);
    setRequests(requests);
    alert('✅ Request submitted! Our admin team will review it for approval.');
    this.reset();
    goHome();
});


// --- Admin Dashboard logic ---
function renderAdminDashboard() {
    renderPendingRequests();
    renderApprovedProviders();
    renderAllOrders();
}

function renderPendingRequests() {
    const requests = getRequests().filter(r => r.status === 'Pending' || r.status === 'pending');
    const container = document.getElementById('pending-requests');
    container.innerHTML = '';

    if (requests.length === 0) {
        container.innerHTML = '<p class="text-muted">You have 0 pending provider requests.</p>';
        return;
    }

    requests.forEach(req => {
        const card = document.createElement('div');
        card.className = 'card provider-card';
        card.innerHTML = `
            <h3>${req.kitchenName}</h3>
            <p><strong>Name:</strong> ${req.providerName}</p>
            <p><strong>Phone:</strong> ${req.phone}</p>
            <div style="background:#f9fafb; padding:12px; border-radius:6px; margin-bottom:16px; margin-top:8px; font-size:0.9rem; white-space:pre-wrap; border:1px solid #e5e7eb;">${req.sampleMenu}</div>
            <div class="card-actions">
                <button class="btn btn-success" onclick="approveRequest('${req.id}')">Approve</button>
                <button class="btn btn-danger" onclick="rejectRequest('${req.id}')">Reject</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function approveRequest(reqId) {
    let requests = getRequests();
    const reqIndex = requests.findIndex(r => r.id === reqId);

    if (reqIndex > -1) {
        const req = requests[reqIndex];
        // Change status instead of deleting completely
        req.status = 'Approved';
        setRequests(requests);

        const providers = getProviders();
        providers.push({
            id: 'p_' + generateId(),
            providerName: req.providerName,
            kitchenName: req.kitchenName,
            phone: req.phone,
            sampleMenu: req.sampleMenu,
            status: 'approved'
        });
        setProviders(providers);
        renderAdminDashboard();
    }
}

function rejectRequest(reqId) {
    if (confirm('Are you sure you want to reject this request?')) {
        let requests = getRequests();
        const reqIndex = requests.findIndex(r => r.id === reqId);
        if (reqIndex > -1) {
            requests[reqIndex].status = 'Rejected';
            setRequests(requests);
            renderAdminDashboard();
        }
    }
}

function renderApprovedProviders() {
    const providers = getProviders().filter(p => p.status === 'approved');
    const container = document.getElementById('approved-providers');
    container.innerHTML = '';

    if (providers.length === 0) {
        container.innerHTML = '<p class="text-muted">No approved providers yet.</p>';
        return;
    }

    providers.forEach(provider => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div>
                <strong style="color:var(--secondary-color); font-size:1.1rem;">${provider.kitchenName}</strong>
                <div style="font-size:0.9rem; color:var(--text-muted); margin-top:4px;">${provider.providerName} &bull; ${provider.phone}</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="removeProvider('${provider.id}')">Remove Provider</button>
        `;
        container.appendChild(item);
    });
}

function removeProvider(providerId) {
    if (confirm('Warning: Remove this provider? This action cannot be undone.')) {
        let providers = getProviders();
        providers = providers.filter(p => p.id !== providerId);
        setProviders(providers);
        renderAdminDashboard();
    }
}

function changeOrderStatus(orderId, newStatus) {
    let orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex > -1) {
        orders[orderIndex].status = newStatus;
        setOrders(orders);
        renderAdminDashboard();
    }
}

function renderAllOrders() {
    const orders = getOrders();
    const container = document.getElementById('all-orders');
    container.innerHTML = '';

    if (orders.length === 0) {
        container.innerHTML = '<p class="text-muted">No orders placed by anyone yet.</p>';
        return;
    }

    // Sort by descending date
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    orders.forEach(order => {
        const item = document.createElement('div');
        item.className = 'list-item';

        const dateObj = new Date(order.date);
        const displayDate = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
        const displayTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const currentStatus = order.status || 'Pending';

        item.innerHTML = `
            <div style="flex:1;">
                <div style="font-size:1.05rem;">
                    <strong>${order.customerName}</strong> ordered <span style="color:var(--primary-color); font-weight:600;">${order.quantity}x ${order.mealType} meal(s)</span>
                </div>
                <div style="font-size:0.9rem; color:var(--text-muted); margin-top:6px;">
                    <strong>Provider:</strong> ${order.providerName} | <strong>Phone:</strong> ${order.phone}
                </div>
                <div style="margin-top:8px;">
                    <strong>Status:</strong> <span style="font-weight:600; font-size:0.95em; padding:2px 6px; border-radius:4px; background:rgba(0,0,0,0.03); color: ${getStatusColor(currentStatus)}">${currentStatus}</span>
                </div>
                <div class="card-actions" style="margin-top: 10px; display: inline-flex; gap: 8px;">
                    ${currentStatus === 'Pending' ? `<button class="btn btn-sm btn-outline" onclick="changeOrderStatus('${order.id}', 'Approved')">Approve Order</button>` : ''}
                    ${currentStatus === 'Approved' ? `<button class="btn btn-sm btn-success" onclick="changeOrderStatus('${order.id}', 'Completed')">Complete Order</button>` : ''}
                </div>
            </div>
            <div style="font-size:0.85rem; color:#888; text-align:right; min-width:120px;">
                <div>${displayDate}</div>
                <div>${displayTime}</div>
            </div>
        `;
        container.appendChild(item);
    });
}

// --- Bootstrap the Application ---
document.addEventListener('DOMContentLoaded', () => {
    initializeData();
    checkLoginSession();
});
