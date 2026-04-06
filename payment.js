// Payment System
document.addEventListener('DOMContentLoaded', function() {
    loadOrderSummary();
    setupPaymentMethodToggle();
    setupPaymentForm();
    setupFormValidation();
    
    // Process payment button
    const processPaymentBtn = document.getElementById('process-payment');
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', processPayment);
    }
});

// Generate random order ID
function generateOrderId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Load order summary from cart
function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const summaryElement = document.getElementById('payment-summary');
    const totalElement = document.getElementById('payment-total');
    const orderReference = document.getElementById('order-reference');
    
    // Update order reference
    if (orderReference) {
        orderReference.textContent = `ORDER-${generateOrderId()}`;
    }
    
    if (cart.length === 0) {
        summaryElement.innerHTML = '<p class="empty-cart">No items in cart</p>';
        totalElement.textContent = '₦0';
        
        // Redirect to menu if cart is empty
        setTimeout(() => {
            window.location.href = 'index.html#menu';
        }, 2000);
        
        return;
    }
    
    let total = 0;
    let summaryHTML = '<div class="order-items">';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        summaryHTML += `
            <div class="order-item">
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-quantity">Qty: ${item.quantity}</span>
                </div>
                <span class="item-total">${formatPrice(itemTotal)}</span>
            </div>
        `;
    });
    
    summaryHTML += '</div>';
    summaryElement.innerHTML = summaryHTML;
    totalElement.textContent = formatPrice(total);
}

// Setup payment method toggle
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment details
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.classList.remove('active');
                detail.style.display = 'none';
            });
            
            // Show selected payment method details
            const selectedId = this.id + '-details';
            const selectedDetails = document.getElementById(selectedId);
            if (selectedDetails) {
                selectedDetails.classList.add('active');
                selectedDetails.style.display = 'block';
            }
        });
    });
}

// Setup payment form
function setupPaymentForm() {
    // Card number formatting
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(.{4})/g, '$1 ').trim();
            e.target.value = value.substring(0, 19);
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.getElementById('expiry-date');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value.substring(0, 5);
        });
    }
    
    // CVV input
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
        });
    }
}

// Setup form validation
function setupFormValidation() {
    const form = document.querySelector('.payment-methods');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
}

// Validate payment form
function validatePaymentForm() {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    if (selectedMethod === 'debit-card') {
        const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiry-date').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('card-name').value;
        
        // Basic validation
        if (!cardNumber || cardNumber.length < 16) {
            showPaymentError('Please enter a valid 16-digit card number');
            return false;
        }
        
        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            showPaymentError('Please enter a valid expiry date (MM/YY)');
            return false;
        }
        
        // Check if card is expired
        const [month, year] = expiryDate.split('/');
        const currentYear = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1;
        
        if (parseInt(year) < currentYear || 
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
            showPaymentError('Card has expired');
            return false;
        }
        
        if (!cvv || cvv.length !== 3) {
            showPaymentError('Please enter a valid 3-digit CVV');
            return false;
        }
        
        if (!cardName.trim()) {
            showPaymentError('Please enter the cardholder name');
            return false;
        }
    }
    
    return true;
}

// Process payment
function processPayment() {
    if (!validatePaymentForm()) {
        return;
    }
    
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const totalAmount = document.getElementById('payment-total').textContent;
    
    // Show loading state
    const processBtn = document.getElementById('process-payment');
    const originalText = processBtn.innerHTML;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    processBtn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        // In a real application, you would integrate with a payment gateway here
        // This is just a simulation
        
        // Clear cart after successful payment
        localStorage.removeItem('cart');
        
        // Show success message
        showPaymentSuccess(selectedMethod, totalAmount);
        
        // Redirect to confirmation page
        setTimeout(() => {
            window.location.href = 'confirmation.html';
        }, 2000);
        
    }, 2000);
}

// Show payment error
function showPaymentError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'payment-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    errorDiv.style.cssText = `
        background: #dc3545;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin: 15px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: fadeIn 0.3s;
    `;
    
    // Insert before payment actions
    const paymentActions = document.querySelector('.payment-actions');
    if (paymentActions) {
        const existingError = document.querySelector('.payment-error');
        if (existingError) existingError.remove();
        paymentActions.parentNode.insertBefore(errorDiv, paymentActions);
    }
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Show payment success
function showPaymentSuccess(method, amount) {
    const successDiv = document.createElement('div');
    successDiv.className = 'payment-success';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <div>
            <strong>Payment Successful!</strong>
            <p>${amount} paid via ${getMethodName(method)}</p>
            <p>Redirecting to confirmation...</p>
        </div>
    `;
    
    // Add styles
    successDiv.style.cssText = `
        background: #28a745;
        color: white;
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: fadeIn 0.3s;
    `;
    
    // Insert before payment actions
    const paymentActions = document.querySelector('.payment-actions');
    if (paymentActions) {
        const existingSuccess = document.querySelector('.payment-success');
        if (existingSuccess) existingSuccess.remove();
        paymentActions.parentNode.insertBefore(successDiv, paymentActions);
    }
}

// Get payment method name
function getMethodName(method) {
    const methods = {
        'debit-card': 'Debit/Credit Card',
        'bank-transfer': 'Bank Transfer',
        'ussd': 'USSD'
    };
    return methods[method] || method;
}

// Format price
function formatPrice(amount) {
    if (typeof amount === 'string') {
        return amount; // Already formatted
    }
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
}

// Add styles for payment page
function addPaymentStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .payment-summary {
            margin: 20px 0;
        }
        
        .order-items {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            border-bottom: 1px solid #eee;
            background: white;
            margin: 8px 0;
            border-radius: 8px;
        }
        
        .item-info {
            display: flex;
            flex-direction: column;
        }
        
        .item-name {
            font-weight: 600;
            color: #333;
        }
        
        .item-quantity {
            font-size: 0.9rem;
            color: #666;
        }
        
        .item-total {
            font-weight: 700;
            color: #28a745;
        }
        
        .payment-details {
            display: none;
            animation: fadeIn 0.3s;
        }
        
        .payment-details.active {
            display: block;
        }
        
        .form-group {
            margin: 15px 0;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .payment-desc {
            font-size: 0.9rem;
            color: #666;
            margin-top: 5px;
        }
        
        .bank-details {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 15px 0;
        }
        
        .bank-info {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        
        .bank-info:last-child {
            border-bottom: none;
        }
        
        .bank-label {
            font-weight: 600;
            color: #333;
        }
        
        .bank-value {
            color: #28a745;
            font-weight: 600;
        }
        
        .ussd-instructions {
            background: white;
            padding: 20px;
            border-radius: 10px;
            margin: 15px 0;
        }
        
        .ussd-code {
            background: #333;
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 1.2rem;
            text-align: center;
            margin: 10px 0;
            letter-spacing: 2px;
        }
        
        .note {
            font-size: 0.9rem;
            color: #666;
            font-style: italic;
            margin-top: 10px;
        }
        
        .payment-actions {
            margin-top: 30px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Responsive styles for payment page */
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .payment-option label {
                flex-direction: column;
                text-align: center;
                gap: 10px;
            }
            
            .payment-option label div {
                text-align: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize payment page styles
addPaymentStyles();6666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666666