// Script for Zombie vs Humans website

// Smooth scroll behavior for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Update active navigation link on page load
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

updateActiveNav();

// Handle contact form submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const faction = document.getElementById('faction').value;
        const message = document.getElementById('message').value;
        
        // Simple validation
        if (name && email && message) {
            // Show success message
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            button.textContent = 'Message Sent! ✓';
            button.style.backgroundColor = '#00cc44';
            
            // Reset form
            this.reset();
            
            // Restore button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 3000);
            
            console.log('Contact form submitted:', { name, email, faction, message });
        } else {
            alert('Please fill in all fields');
        }
    });
}

// Add hover effects to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// Animate stats numbers on page load
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Initialize stat animations
window.addEventListener('load', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const number = parseInt(text.replace(/,/g, ''));
        if (!isNaN(number)) {
            stat.textContent = '0';
            // Delay animation slightly for visual effect
            setTimeout(() => {
                animateCounter(stat, number);
            }, 200);
        }
    });
});

// Add character card selection (for potential game feature)
document.querySelectorAll('.character-card').forEach(card => {
    card.addEventListener('click', function() {
        const characterName = this.querySelector('h3').textContent;
        const isZombie = this.classList.contains('zombie');
        const faction = isZombie ? 'Zombie' : 'Human';
        console.log(`Selected: ${characterName} (${faction} faction)`);
        
        // Optional: highlight selected character
        document.querySelectorAll('.character-card').forEach(c => {
            c.style.opacity = '0.6';
        });
        this.style.opacity = '1';
        
        // Reset after 2 seconds
        setTimeout(() => {
            document.querySelectorAll('.character-card').forEach(c => {
                c.style.opacity = '1';
            });
        }, 2000);
    });
});

// Add scroll animation for elements
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards and sections
    document.querySelectorAll('.feature-card, .character-card, .mode-card, .map-card, .stat-card, .social-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

observeElements();

// Mobile menu toggle (if needed for smaller screens)
function initializeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    
    // Check if menu needs to be collapsible
    if (window.innerWidth < 768) {
        navMenu.classList.add('mobile-menu');
    }
    
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            navMenu.classList.add('mobile-menu');
        } else {
            navMenu.classList.remove('mobile-menu');
        }
    });
}

initializeMobileMenu();

// Welcome message
console.log('%cWelcome to Zombie vs Humans!', 'color: #ff6b35; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #ff6b35;');
console.log('%cChoose your faction and prepare for battle!', 'color: #d0d0d0; font-size: 14px;');
