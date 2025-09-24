// MercadoPago Integration for Sanando Con Cartas
// Replace 'YOUR_PUBLIC_KEY' with your actual MercadoPago public key

const mp = new MercadoPago('APP_USR-82a9259a-1964-4bbe-a4c4-8ab50745ba4d', {
    locale: 'es-AR'
});

// Product configuration
const courseProduct = {
    id: 'mega-biblioteca-tarot-sanando-con-cartas',
    title: 'Mega Biblioteca de Tarot - Sanando Con Cartas',
    description: 'La biblioteca de tarot más completa: +50 cursos profesionales, +60 libros especializados y +170 mazos y oráculos descargables. Acceso inmediato y de por vida.',
    picture_url: 'https://tu-dominio.com/images/mega-biblioteca-tarot.jpg', // Replace with actual image
    category_id: 'education',
    quantity: 1,
    currency_id: 'ARS',
    unit_price: 2500
};

// Initialize MercadoPago checkout
function initializeMercadoPago() {
    const mercadoPagoButton = document.getElementById('mercadopago-button');
    
    if (mercadoPagoButton) {
        mercadoPagoButton.addEventListener('click', function(e) {
            e.preventDefault();
            createPreference();
        });
    }
}

// Create payment preference
async function createPreference() {
    try {
        // Show loading state
        showLoadingState();
        
        // This would typically be done on your backend
        // For demonstration, we're showing the frontend integration
        const preferenceData = {
            items: [courseProduct],
            payer: {
                email: '', // This will be filled by the user
            },
            back_urls: {
                success: window.location.origin + '/success.html',
                failure: window.location.origin + '/failure.html',
                pending: window.location.origin + '/pending.html'
            },
            auto_return: 'approved',
            payment_methods: {
                excluded_payment_methods: [],
                excluded_payment_types: [],
                installments: 12 // Allow up to 12 installments
            },
            shipments: {
                mode: 'not_specified'
            },
            notification_url: window.location.origin + '/webhook', // Your webhook endpoint
            external_reference: generateOrderId(),
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        // In a real implementation, this request should go to your backend
        // Your backend should create the preference and return the preference_id
        const response = await createPreferenceOnBackend(preferenceData);
        
        if (response.preference_id) {
            // Redirect to MercadoPago checkout
            redirectToCheckout(response.preference_id);
        } else {
            throw new Error('Error creating payment preference');
        }
        
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('Error al procesar el pago. Por favor, inténtalo nuevamente.');
    } finally {
        hideLoadingState();
    }
}

// Generate unique order ID
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TAROT-${timestamp}-${random}`;
}

// Create preference on backend (you need to implement this endpoint)
async function createPreferenceOnBackend(preferenceData) {
    // This is a placeholder - implement your actual backend endpoint
    const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferenceData)
    });
    
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    
    return await response.json();
}

// Alternative: Direct MercadoPago integration (for testing)
function createDirectPreference() {
    // Note: This is for demonstration only
    // In production, always create preferences on your backend for security
    
    mp.preferences.create({
        items: [courseProduct],
        back_urls: {
            success: window.location.origin + '/success.html',
            failure: window.location.origin + '/failure.html',
            pending: window.location.origin + '/pending.html'
        },
        auto_return: 'approved'
    }).then(function(response) {
        // Redirect to checkout
        window.location.href = response.response.init_point;
    }).catch(function(error) {
        console.error('Error creating preference:', error);
        showErrorMessage('Error al procesar el pago. Por favor, inténtalo nuevamente.');
    });
}

// Redirect to MercadoPago checkout
function redirectToCheckout(preferenceId) {
    const checkoutUrl = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;
    
    // Track the checkout initiation
    trackEvent('begin_checkout', 'ecommerce', 'curso-tarot');
    
    // Redirect to MercadoPago
    window.location.href = checkoutUrl;
}

// Alternative: Open checkout in modal (requires MercadoPago SDK)
function openCheckoutModal(preferenceId) {
    mp.checkout({
        preference: {
            id: preferenceId
        },
        render: {
            container: '.cho-container', // Create a container for the checkout
            label: 'Pagar Curso'
        }
    });
}

// Show loading state
function showLoadingState() {
    const button = document.getElementById('mercadopago-button');
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    }
}

// Hide loading state
function hideLoadingState() {
    const button = document.getElementById('mercadopago-button');
    if (button) {
        button.disabled = false;
        button.innerHTML = '<i class="fas fa-credit-card"></i> Obtener Curso Ahora';
    }
}

// Show error message
function showErrorMessage(message) {
    // Use the notification system from the main script
    if (window.SanandoConCartas && window.SanandoConCartas.showNotification) {
        window.SanandoConCartas.showNotification(message, 'error');
    } else {
        alert(message);
    }
}

// Handle payment status (for success/failure pages)
function handlePaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('collection_status');
    const paymentId = urlParams.get('collection_id');
    const preferenceId = urlParams.get('preference_id');
    
    if (status) {
        switch (status) {
            case 'approved':
                handleSuccessfulPayment(paymentId);
                break;
            case 'pending':
                handlePendingPayment(paymentId);
                break;
            case 'rejected':
                handleRejectedPayment(paymentId);
                break;
        }
    }
}

// Handle successful payment
function handleSuccessfulPayment(paymentId) {
    // Track successful purchase
    trackEvent('purchase', 'ecommerce', 'curso-tarot', 2500);
    
    // Show success message
    if (window.SanandoConCartas) {
        window.SanandoConCartas.showNotification(
            '¡Pago exitoso! Recibirás el acceso al curso por email.',
            'success'
        );
    }
    
    // Send data to your backend for course access
    grantCourseAccess(paymentId);
}

// Handle pending payment
function handlePendingPayment(paymentId) {
    if (window.SanandoConCartas) {
        window.SanandoConCartas.showNotification(
            'Pago en proceso. Te notificaremos cuando se confirme.',
            'info'
        );
    }
}

// Handle rejected payment
function handleRejectedPayment(paymentId) {
    if (window.SanandoConCartas) {
        window.SanandoConCartas.showNotification(
            'El pago fue rechazado. Por favor, inténtalo con otro método de pago.',
            'error'
        );
    }
}

// Grant course access (implement according to your backend)
async function grantCourseAccess(paymentId) {
    try {
        const response = await fetch('/api/grant-course-access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                payment_id: paymentId,
                course_id: courseProduct.id
            })
        });
        
        if (response.ok) {
            console.log('Course access granted successfully');
        }
    } catch (error) {
        console.error('Error granting course access:', error);
    }
}

// Track events for analytics
function trackEvent(action, category, label, value) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', action, {
            content_name: label,
            value: value,
            currency: 'ARS'
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeMercadoPago();
    handlePaymentStatus();
});

// Add multiple payment buttons support
function addPaymentButtons() {
    // Add installment options
    const installmentButtons = [
        { installments: 1, text: 'Pago único - $2,500' },
        { installments: 3, text: '3 cuotas sin interés - $833.33' },
        { installments: 6, text: '6 cuotas sin interés - $416.67' },
        { installments: 12, text: '12 cuotas - $250.00*' }
    ];
    
    // You can create multiple buttons for different payment options
    installmentButtons.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn btn-outline installment-btn';
        button.innerHTML = `<i class="fas fa-credit-card"></i> ${option.text}`;
        button.addEventListener('click', () => {
            createPreferenceWithInstallments(option.installments);
        });
    });
}

// Create preference with specific installment options
function createPreferenceWithInstallments(maxInstallments) {
    const preferenceData = {
        ...courseProduct,
        payment_methods: {
            installments: maxInstallments,
            excluded_payment_methods: [],
            excluded_payment_types: maxInstallments === 1 ? ['credit_card'] : []
        }
    };
    
    // Create preference with installment restrictions
    createPreference(preferenceData);
}

// Export for global access
window.MercadoPagoIntegration = {
    createPreference,
    handlePaymentStatus,
    trackEvent
};

// Security: Input validation
function validatePreferenceData(data) {
    const required = ['title', 'unit_price', 'quantity'];
    
    for (const field of required) {
        if (!data[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
    
    if (data.unit_price <= 0) {
        throw new Error('Price must be greater than 0');
    }
    
    if (data.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }
    
    return true;
}

console.log('🔮 MercadoPago Integration loaded for Sanando Con Cartas');