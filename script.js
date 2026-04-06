// Shopping Cart System
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateCartDisplay();
    setupEventListeners();
    initializeAnimations();
});

// Setup event listeners
function setupEventListeners() {
    // Clear cart button
    const clearCartBtn = document.getElementById('clear-cart');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }

    // Update cart indicator in navigation
    updateCartIndicator();
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add item to cart
function addToCart(itemName, price) {
    // Create cart item object
    const cartItem = {
        id: Date.now(),
        name: itemName,
        price: price,
        quantity: 1,
        addedAt: new Date().toISOString()
    };
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.name === itemName);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += 1;
    } else {
        // Add new item
        cart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update display
    updateCartDisplay();
    updateCartIndicator();
    
    // Show success message with animation
    showNotification(`${itemName} added to cart!`, 'success');
    
    // Animate cart indicator
    animateCartIndicator();
}

// Update cart display
function updateCartDisplay() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');
    const payNowBtn = document.getElementById('pay-now-btn');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `(${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;
    
    // Update items list
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Add items from the menu!</p>';
    } else {
        let itemsHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemsHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-quantity">Qty: ${item.quantity}</span>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-price">${formatPrice(itemTotal)}</span>
                        <button class="remove-item" onclick="removeFromCart(${item.id})" 
                                aria-label="Remove ${item.name} from cart">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItems.innerHTML = itemsHTML;
    }
    
    // Update total
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = formatPrice(cartTotal);
    
    // Update pay now button
    if (payNowBtn) {
        if (cart.length === 0) {
            payNowBtn.classList.add('disabled');
            payNowBtn.setAttribute('aria-disabled', 'true');
        } else {
            payNowBtn.classList.remove('disabled');
            payNowBtn.removeAttribute('aria-disabled');
        }
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        const itemName = cart[itemIndex].name;
        cart.splice(itemIndex, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartIndicator();
        showNotification(`${itemName} removed from cart!`, 'warning');
    }
}

// Clear entire cart
function clearCart() {
    if (cart.length === 0) {
        showNotification('Cart is already empty!', 'info');
        return;
    }
    
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        localStorage.removeItem('cart');
        updateCartDisplay();
        updateCartIndicator();
        showNotification('Cart cleared successfully!', 'success');
    }
}

// Update cart indicator in navigation
function updateCartIndicator() {
    const cartIndicator = document.getElementById('cart-indicator');
    if (cartIndicator) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIndicator.textContent = totalItems;
        cartIndicator.style.display = totalItems > 0 ? 'inline-flex' : 'none';
    }
}

// Format price with Nigerian Naira symbol
function formatPrice(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set background color based on type
    const bgColors = {
        success: '#28a745',
        warning: '#ffc107',
        info: '#17a2b8',
        error: '#dc3545'
    };
    notification.style.backgroundColor = bgColors[type] || bgColors.info;
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 3000);
    
    // Add animation keyframes
    if (!document.querySelector('#notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Animate cart indicator
function animateCartIndicator() {
    const indicator = document.getElementById('cart-indicator');
    if (indicator) {
        indicator.style.transform = 'scale(1.5)';
        setTimeout(() => {
            indicator.style.transform = 'scale(1)';
        }, 300);
    }
}

// Initialize animations
function initializeAnimations() {
    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.variety, .about-content, .intro-section').forEach(el => {
        observer.observe(el);
    });
}

// Export cart data for payment page
function getCartData() {
    return {
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
    };
}

// Check if cart is empty
function isCartEmpty() {
    return cart.length === 0;
}

// Add sample data for testing (remove in production)
function addSampleItems() {
    if (cart.length === 0) {
        addToCart('Chips', 3000);
        addToCart('Shawarma', 4000);
    }
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // Escape key closes notifications
    if (e.key === 'Escape') {
        const notification = document.querySelector('.notification');
        if (notification) {
            notification.remove();
        }
    }
    
    // Add keyboard shortcuts for cart (Ctrl+Shift+C to clear)
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        clearCart();
    }
});

// Save cart to localStorage before page unload
window.addEventListener('beforeunload', function() {
    localStorage.setItem('cart', JSON.stringify(cart));
});


    // Check if user is logged in
    document.addEventListener('DOMContentLoaded', function() {
        const isLoggedIn = localStorage.getItem('loggedIn');
        const userType = localStorage.getItem('userType');
        
        // If not logged in, redirect to login page
        if (!isLoggedIn) {
            window.location.href = 'login.html';
        }
        
        // If logged in as admin but accessing customer page, redirect to admin dashboard
        if (isLoggedIn && userType === 'admin' && !window.location.href.includes('admin-dashboard')) {
            window.location.href = 'admin-dashboard.html';
        }
    });
