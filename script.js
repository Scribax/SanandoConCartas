// Sanando Con Cartas - Professional Landing Page JavaScript
// Features: smooth scrolling, mobile menu, countdown timer, animations

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Sanando Con Cartas - Professional Landing Page Loaded');
    
    // Initialize all functionality
    initializeNavigation();
    initializeCountdownTimer();
    initializeScrollToTop();
    initializeAnimations();
    initializeFormHandling();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbar = document.querySelector('.navbar');
                const headerHeight = navbar ? navbar.offsetHeight : 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        });
    }
}

// Countdown Timer functionality
function initializeCountdownTimer() {
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');

    if (!hoursElement || !minutesElement || !secondsElement) {
        console.log('⏰ Timer elements not found, skipping countdown initialization');
        return;
    }

    // Set countdown to 24 hours from now (or get from localStorage if exists)
    let countdownDate = localStorage.getItem('countdownEndTime');
    
    if (!countdownDate) {
        // Set countdown to 23 hours, 59 minutes, 59 seconds from now
        countdownDate = new Date().getTime() + (24 * 60 * 60 * 1000) - 1000;
        localStorage.setItem('countdownEndTime', countdownDate);
    }

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            // Reset countdown if it has expired
            countdownDate = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('countdownEndTime', countdownDate);
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    console.log('⏰ Countdown timer initialized');
}

// Scroll to top functionality
function initializeScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Scroll animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and sections for animations
    const animatedElements = document.querySelectorAll('.content-card, .testimonial-card, .action-card, .value-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Add hover effects for content cards
    const contentCards = document.querySelectorAll('.content-card');
    contentCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px)';
            card.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.1)';
        });
    });

    console.log('✨ Animations initialized');
}

// Form handling
function initializeFormHandling() {
    const emailInput = document.getElementById('customer-email');
    const purchaseButton = document.getElementById('mercadopago-button');
    
    if (emailInput) {
        // Auto-validate email
        emailInput.addEventListener('input', function() {
            const email = this.value;
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            if (email === '') {
                this.style.borderColor = '#E2E8F0';
                this.style.background = 'white';
            } else if (isValidEmail) {
                this.style.borderColor = '#10B981';
                this.style.background = '#F0FDF4';
            } else {
                this.style.borderColor = '#EF4444';
                this.style.background = '#FEF2F2';
            }
        });
        
        // Save email to localStorage
        emailInput.addEventListener('change', function() {
            if (this.value) {
                localStorage.setItem('customerEmail', this.value);
            }
        });
        
        // Load saved email
        const savedEmail = localStorage.getItem('customerEmail');
        if (savedEmail) {
            emailInput.value = savedEmail;
            emailInput.dispatchEvent(new Event('input'));
        }
    }

    if (purchaseButton) {
        purchaseButton.addEventListener('click', function() {
            const email = emailInput ? emailInput.value : '';
            
            // Add loading state
            this.style.opacity = '0.8';
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Procesando...</span>';
            
            // Simulate processing delay
            setTimeout(() => {
                this.style.opacity = '1';
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> <span>Obtener por $1,000 Ahora</span>';
                
                // Here would go the MercadoPago integration
                console.log('🛒 Purchase button clicked with email:', email);
                
                // For development, show a message
                if (confirm('¿Proceder con MercadoPago?\n\n(En desarrollo - esto abriría el checkout real)')) {
                    alert('Integración con MercadoPago pendiente');
                }
            }, 1500);
        });
    }
    
    console.log('📝 Form handling initialized');
}

// WhatsApp contact functionality
function openWhatsApp() {
    const phoneNumber = '5491156177616';
    const message = encodeURIComponent('Hola! Estoy interesado en la Mega Biblioteca de Tarot por $1,000. ¿Podrías darme más información?');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// Export functions for global access (for onclick handlers in HTML)
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

window.openWhatsApp = openWhatsApp;

// Console welcome message
console.log(`
🔮 ═══════════════════════════════════════════════════════
   SANANDO CON CARTAS - PROFESSIONAL LANDING PAGE
   Mega Biblioteca de Tarot - Solo $1,000
   
   ✨ Frontend: Ready for Development
   🚀 Features: Loaded Successfully
   💰 Price: $1,000 (96% Discount!)
   📞 Support: WhatsApp Available
═══════════════════════════════════════════════════════ 🔮
`);