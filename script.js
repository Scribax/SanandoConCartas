// Initialize AOS (Animate On Scroll) library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});

// Navbar functionality
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Testimonials slider functionality
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.dot');

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach(testimonial => {
        testimonial.classList.remove('active');
    });
    
    // Remove active class from all dots
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    // Show current testimonial and activate corresponding dot
    if (testimonials[index]) {
        testimonials[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

function changeTestimonial(direction) {
    currentTestimonial += direction;
    
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    showTestimonial(currentTestimonial);
}

function currentTestimonialSlide(index) {
    currentTestimonial = index - 1;
    showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials
setInterval(() => {
    changeTestimonial(1);
}, 6000);

// Scroll to top button
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Enhanced animations for hero cards
function createFloatingParticles() {
    const heroBackground = document.querySelector('.hero-background');
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${15 + Math.random() * 10}s linear infinite;
        `;
        heroBackground.appendChild(particle);
    }
}

// CSS for floating particles (added dynamically)
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Initialize floating particles
createFloatingParticles();

// Pricing card hover effect
const pricingCard = document.querySelector('.pricing-card');
if (pricingCard) {
    pricingCard.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    pricingCard.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
}

// Form validation and submission (for future contact forms)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Counter animation for statistics
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = +counter.innerText;
        const increment = target / 200;
        
        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(() => animateCounters(), 1);
        } else {
            counter.innerText = target;
        }
    });
}

// Intersection Observer for triggering animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Trigger counter animation if element has counters
            const counters = entry.target.querySelectorAll('.counter');
            if (counters.length > 0) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.module, .benefit-item, .feature-card').forEach(el => {
    observer.observe(el);
});

// WhatsApp integration
function openWhatsApp() {
    const phoneNumber = '5491156177616';
    const message = encodeURIComponent('¡Hola! Estoy interesado en la Mega Biblioteca de Tarot "Sanando Con Cartas". ¿Podrías darme más información?');
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// Lazy loading for images (when you add images)
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-cards');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Copy to clipboard functionality (for sharing)
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('¡Enlace copiado al portapapeles!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('¡Enlace copiado al portapapeles!');
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--primary-color)' : '#ef4444'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Loading screen (optional)
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
}

// Countdown timer functionality
function initializeCountdownTimer() {
    const TIMER_KEY = 'sanando_countdown_end';
    const TIMER_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    // Get or create end time
    function getEndTime() {
        let endTime = localStorage.getItem(TIMER_KEY);
        
        if (!endTime) {
            // First time - set timer to exactly 23:59:59
            endTime = new Date().getTime() + (23 * 60 * 60 * 1000) + (59 * 60 * 1000) + (59 * 1000);
            localStorage.setItem(TIMER_KEY, endTime);
        } else {
            endTime = parseInt(endTime);
            
            // Check if timer has expired
            if (endTime <= new Date().getTime()) {
                // Reset timer to 24 hours
                endTime = new Date().getTime() + TIMER_DURATION;
                localStorage.setItem(TIMER_KEY, endTime);
            }
        }
        
        return endTime;
    }
    
    function updateCountdown() {
        const endTime = getEndTime();
        const now = new Date().getTime();
        const distance = endTime - now;
        
        if (distance <= 0) {
            // Timer expired, reset it
            const newEndTime = new Date().getTime() + TIMER_DURATION;
            localStorage.setItem(TIMER_KEY, newEndTime);
            updateCountdownDisplay(TIMER_DURATION);
            
            // Show expired message briefly
            showTimerExpiredMessage();
            return;
        }
        
        updateCountdownDisplay(distance);
    }
    
    function updateCountdownDisplay(distance) {
        const hours = Math.floor(distance / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        if (hoursElement) {
            const newHours = Math.min(hours, 23).toString().padStart(2, '0');
            if (hoursElement.textContent !== newHours) {
                hoursElement.textContent = newHours;
                animateNumberChange(hoursElement);
            }
        }
        
        if (minutesElement) {
            const newMinutes = minutes.toString().padStart(2, '0');
            if (minutesElement.textContent !== newMinutes) {
                minutesElement.textContent = newMinutes;
                animateNumberChange(minutesElement);
            }
        }
        
        if (secondsElement) {
            const newSeconds = seconds.toString().padStart(2, '0');
            if (secondsElement.textContent !== newSeconds) {
                secondsElement.textContent = newSeconds;
                animateNumberChange(secondsElement);
            }
        }
        
        // Add urgency effect when time is low
        addUrgencyEffects(hours, minutes, seconds);
    }
    
    function animateNumberChange(element) {
        element.style.transform = 'scale(1.1)';
        element.style.color = '#FFD700';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            element.style.color = 'white';
        }, 200);
    }
    
    function addUrgencyEffects(hours, minutes, seconds) {
        const timerDisplay = document.querySelector('.timer-display');
        const urgencySection = document.querySelector('.urgency-section');
        
        if (!timerDisplay || !urgencySection) return;
        
        // Remove existing urgency classes
        timerDisplay.classList.remove('very-urgent', 'urgent', 'warning');
        urgencySection.classList.remove('critical-urgency');
        
        // Add urgency classes based on remaining time
        if (hours === 0 && minutes < 10) {
            // Less than 10 minutes - very urgent
            timerDisplay.classList.add('very-urgent');
            urgencySection.classList.add('critical-urgency');
        } else if (hours === 0 && minutes < 30) {
            // Less than 30 minutes - urgent
            timerDisplay.classList.add('urgent');
        } else if (hours < 2) {
            // Less than 2 hours - warning
            timerDisplay.classList.add('warning');
        }
    }
    
    function showTimerExpiredMessage() {
        if (window.SanandoConCartas && window.SanandoConCartas.showNotification) {
            window.SanandoConCartas.showNotification(
                '¡La oferta se ha reiniciado! Tienes 24 horas más para aprovechar este descuento.', 
                'success'
            );
        }
    }
    
    // Reset timer function (for testing purposes)
    window.resetCountdownTimer = function() {
        localStorage.removeItem(TIMER_KEY);
        const newEndTime = new Date().getTime() + (23 * 60 * 60 * 1000) + (59 * 60 * 1000) + (59 * 1000);
        localStorage.setItem(TIMER_KEY, newEndTime);
        updateCountdown();
        console.log('Timer reset to 23:59:59');
    };
    
    // Set timer to specific time (for testing)
    window.setCountdownTimer = function(hours, minutes, seconds) {
        const timeInMs = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
        const newEndTime = new Date().getTime() + timeInMs;
        localStorage.setItem(TIMER_KEY, newEndTime);
        updateCountdown();
        console.log(`Timer set to ${hours}:${minutes}:${seconds}`);
    };
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    const timerInterval = setInterval(updateCountdown, 1000);
    
    // Clear interval when page unloads
    window.addEventListener('beforeunload', () => {
        clearInterval(timerInterval);
    });
    
    console.log('🕒 Countdown timer initialized and running!');
}

// Content tabs functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen after a short delay
    setTimeout(hideLoadingScreen, 1000);
    
    // Initialize testimonials
    if (testimonials.length > 0) {
        showTestimonial(0);
    }
    
// Initialize content tabs
    initializeTabs();
    
    // Initialize countdown timer
    initializeCountdownTimer();
    
    // Add click event listeners to buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${e.offsetX}px;
                top: ${e.offsetY}px;
                width: 20px;
                height: 20px;
                margin-left: -10px;
                margin-top: -10px;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Performance optimization - debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    // Navbar scroll effect
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Scroll to top button
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}, 10));

// Analytics and tracking (placeholder for Google Analytics)
function trackEvent(action, category, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label
        });
    }
}

// Track button clicks
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const buttonText = e.target.textContent.trim();
        trackEvent('click', 'button', buttonText);
    });
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        console.log('Image failed to load:', this.src);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Arrow keys for testimonial navigation
    if (e.key === 'ArrowLeft') {
        changeTestimonial(-1);
    } else if (e.key === 'ArrowRight') {
        changeTestimonial(1);
    }
});

// Add focus styles for accessibility
const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
focusableElements.forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-color)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Preload critical resources
function preloadResources() {
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

// Initialize preloading
preloadResources();

// Console message for developers
console.log(`
🔮 Sanando Con Cartas - Curso de Tarot Profesional
✨ Sitio desarrollado con amor y magia
🌟 ¿Interesado en el código? ¡Contáctanos!
`);

// Export functions for external use (if needed)
window.SanandoConCartas = {
    showNotification,
    openWhatsApp,
    copyToClipboard,
    changeTestimonial,
    scrollToTop
};