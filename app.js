// app.js
// Profile Data
const profileData = {
    "name": "Colombo Bespoke House",
    "tier": "top_rated",
    "rating": 4.9,
    "reviews": 126,
    "location": "Colombo, Sri Lanka",
    "openNow": true,
    "experience": "18+ Years",
    "languages": ["English", "Sinhala", "Tamil"],
    "pricing": ["Budget", "Mid-range", "Luxury"],
    "services": ["Custom Suits", "Wedding Wear", "Sarees", "Alterations"],
    "cta": {
        "call": true,
        "whatsapp": true,
        "directions": true
    },
    "businessHours": {
        "weekdays": "9:00 AM - 6:00 PM",
        "saturday": "9:00 AM - 4:00 PM",
        "sunday": "Closed"
    },
    "contact": {
        "phone": "+94 11 234 5678",
        "whatsapp": "+94 77 123 4567",
        "email": "info@colombobespoke.lk"
    }
};

// Gallery Images Data
const galleryImages = [
    { 
        src: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
        caption: 'Custom Suit Collection - Premium fabrics and expert tailoring' 
    },
    { 
        src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
        caption: 'Wedding Attire - Elegant designs for your special day' 
    },
    { 
        src: 'https://images.unsplash.com/photo-1568256569744-a84f6d7762e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
        caption: 'Traditional Sarees - Beautifully crafted Sri Lankan attire' 
    },
    { 
        src: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
        caption: 'Design Studio - Where creativity meets craftsmanship' 
    },
    { 
        src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
        caption: 'Fabric Selection - Premium materials from around the world' 
    },
    { 
        src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
        caption: 'Tailoring Process - Meticulous attention to every detail' 
    },
    { 
        src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', 
        caption: 'Finished Works - Quality craftsmanship in every stitch' 
    }
];

// Global Variables
let currentImageIndex = 0;

// Utility Functions
const Utils = {
    // Function to get Sri Lanka time (UTC+5:30)
    getSriLankaTime() {
        const now = new Date();
        const offset = 5.5 * 60; // 5.5 hours in minutes
        return new Date(now.getTime() + offset * 60000);
    },

    // Function to check if business is open
    checkBusinessHours() {
        const now = this.getSriLankaTime();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hour = now.getHours();
        const minute = now.getMinutes();
        const currentTime = hour + (minute / 60);
        
        let statusText = '';
        
        if (day >= 1 && day <= 5) { // Monday to Friday
            if (currentTime >= 9 && currentTime < 18) {
                return { 
                    isOpen: true, 
                    statusText: 'Open Now • Closes at 6:00 PM' 
                };
            } else if (currentTime < 9) {
                return { 
                    isOpen: false, 
                    statusText: 'Closed • Opens at 9:00 AM' 
                };
            } else {
                return { 
                    isOpen: false, 
                    statusText: 'Closed • Opens tomorrow at 9:00 AM' 
                };
            }
        } else if (day === 6) { // Saturday
            if (currentTime >= 9 && currentTime < 16) {
                return { 
                    isOpen: true, 
                    statusText: 'Open Now • Closes at 4:00 PM' 
                };
            } else if (currentTime < 9) {
                return { 
                    isOpen: false, 
                    statusText: 'Closed • Opens at 9:00 AM' 
                };
            } else {
                return { 
                    isOpen: false, 
                    statusText: 'Closed • Opens Monday at 9:00 AM' 
                };
            }
        } else { // Sunday
            return { 
                isOpen: false, 
                statusText: 'Closed • Opens Monday at 9:00 AM' 
            };
        }
    },

    // Validate email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Show form message
    showFormMessage(element, message, type = 'success') {
        element.className = `form-message ${type}`;
        element.innerHTML = message;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
};

// Mobile Menu Module
const MobileMenu = {
    menu: null,
    overlay: null,

    init() {
        this.menu = document.getElementById('mobileMenu');
        this.overlay = document.getElementById('mobileMenuOverlay');
        
        if (!this.menu || !this.overlay) return;
        
        // Close menu on overlay click
        this.overlay.addEventListener('click', () => this.close());
        
        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
        });
    },

    toggle() {
        this.menu.classList.toggle('active');
        this.overlay.classList.toggle('active');
        document.body.style.overflow = this.menu.classList.contains('active') ? 'hidden' : 'auto';
    },

    close() {
        this.menu.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Modal Manager Module
const ModalManager = {
    modals: {},

    init() {
        // Initialize all modals
        this.modals.review = document.getElementById('reviewModal');
        this.modals.image = document.getElementById('imageModal');
        
        // Set up overlay click handlers
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeAll();
                }
            });
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAll();
                MobileMenu.close();
            }
        });
    },

    open(modalName) {
        if (this.modals[modalName]) {
            this.modals[modalName].classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    close(modalName) {
        if (this.modals[modalName]) {
            this.modals[modalName].classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    },

    closeAll() {
        Object.keys(this.modals).forEach(modal => {
            this.close(modal);
        });
    }
};

// Image Gallery Module
const ImageGallery = {
    currentIndex: 0,

    init() {
        this.updateModalImage();
    },

    open(index) {
        this.currentIndex = index;
        this.updateModalImage();
        ModalManager.open('image');
    },

    next() {
        this.currentIndex = (this.currentIndex + 1) % galleryImages.length;
        this.updateModalImage();
    },

    prev() {
        this.currentIndex = (this.currentIndex - 1 + galleryImages.length) % galleryImages.length;
        this.updateModalImage();
    },

    updateModalImage() {
        const image = galleryImages[this.currentIndex];
        const modalImage = document.getElementById('modalImage');
        const imageCaption = document.getElementById('imageCaption');
        
        if (modalImage) modalImage.src = image.src;
        if (modalImage) modalImage.alt = image.caption;
        if (imageCaption) imageCaption.textContent = image.caption;
    }
};

// FormSubmit Integration Module
const FormSubmit = {
    // Submit review to rftid001@tailors.lk
    async submitReview(formData) {
        const endpoint = 'https://formsubmit.co/rftid001@tailors.lk';
        
        // Add FormSubmit configuration
        formData.append('_honey', ''); // Honeypot
        formData.append('_captcha', 'false');
        formData.append('_template', 'table'); // Better email formatting
        formData.append('_subject', `New Review for ${profileData.name}`);
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            
            return response.ok;
        } catch (error) {
            console.error('Review submission error:', error);
            return false;
        }
    },

    // Submit contact form to cftid001@tailors.lk
    async submitContact(formData) {
        const endpoint = 'https://formsubmit.co/cftid001@tailors.lk';
        
        // Add FormSubmit configuration
        formData.append('_honey', ''); // Honeypot
        formData.append('_captcha', 'false');
        formData.append('_template', 'table');
        formData.append('_subject', `New Contact Inquiry for ${profileData.name}`);
        
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });
            
            return response.ok;
        } catch (error) {
            console.error('Contact submission error:', error);
            return false;
        }
    },

    // Handle review form submission
    async handleReviewForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formMessage = document.getElementById('formMessage');
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Validate star rating
        const ratingSelected = form.querySelector('input[name="rating"]:checked');
        if (!ratingSelected) {
            Utils.showFormMessage(formMessage, 'Please select a star rating before submitting.', 'error');
            return;
        }
        
        // Validate name
        const nameInput = document.getElementById('reviewName');
        if (!nameInput.value.trim()) {
            Utils.showFormMessage(formMessage, 'Please enter your name.', 'error');
            return;
        }
        
        // Validate review text
        const reviewText = document.getElementById('reviewText');
        if (!reviewText.value.trim()) {
            Utils.showFormMessage(formMessage, 'Please enter your review text.', 'error');
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Submit via FormSubmit
        const success = await this.submitReview(formData);
        
        if (success) {
            // Success - update UI
            Utils.showFormMessage(formMessage, '✅ Thank you! Your review has been submitted successfully.', 'success');
            
            // Update review count
            const ratingCount = document.querySelector('.rating-count');
            const reviewsHeader = document.querySelector('.reviews-header h2');
            profileData.reviews += 1;
            
            ratingCount.textContent = `${profileData.rating} (${profileData.reviews} reviews)`;
            reviewsHeader.textContent = `Customer Reviews (${profileData.reviews})`;
            
            // Reset form
            form.reset();
            
            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Close modal after delay
                setTimeout(() => {
                    ModalManager.close('review');
                    formMessage.style.display = 'none';
                }, 2000);
            }, 1500);
        } else {
            // Error
            Utils.showFormMessage(formMessage, '❌ There was an error submitting your review. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    },

    // Handle contact form submission
    async handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.contact-submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Validate required fields
        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        
        if (!nameInput.value.trim()) {
            alert('Please enter your name.');
            nameInput.focus();
            return;
        }
        
        if (!emailInput.value.trim()) {
            alert('Please enter your email address.');
            emailInput.focus();
            return;
        }
        
        if (!Utils.validateEmail(emailInput.value)) {
            alert('Please enter a valid email address.');
            emailInput.focus();
            return;
        }
        
        if (!messageInput.value.trim()) {
            alert('Please enter your message.');
            messageInput.focus();
            return;
        }
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData(form);
        
        // Submit via FormSubmit
        const success = await this.submitContact(formData);
        
        if (success) {
            // Success
            alert('✅ Thank you for your message! We have received your inquiry and will get back to you within 1-2 business hours.\n\nYour message has been sent to Colombo Bespoke House.');
            
            // Reset form
            form.reset();
        } else {
            // Error
            alert('❌ There was an error sending your message. Please try again.');
        }
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
};

// Profile Initialization Module
const ProfileManager = {
    init() {
        // Set tier class
        document.body.className = `tier-${profileData.tier.replace('_', '-')}`;
        
        // Set page title with SEO optimization
        document.title = `${profileData.name} - Premium Tailor in ${profileData.location.split(',')[0]} | Tailors.lk`;
        
        // Update profile info
        const h1 = document.querySelector('h1');
        const ratingCount = document.querySelector('.rating-count');
        const locationSpan = document.querySelector('.location span');
        const experienceSpan = document.querySelector('.experience span');
        
        if (h1) h1.textContent = profileData.name;
        if (ratingCount) ratingCount.textContent = `${profileData.rating} (${profileData.reviews} reviews)`;
        if (locationSpan) locationSpan.textContent = profileData.location;
        if (experienceSpan) experienceSpan.textContent = profileData.experience + ' Experience';
        
        // Set tier icon
        this.setTierIcon();
        
        // Update business hours
        this.updateBusinessHours();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup animations
        this.setupAnimations();
    },

    setTierIcon() {
        const tierIcon = document.querySelector('.tier-icon');
        const tierBadge = document.querySelector('.tier-badge i');
        
        if (!tierIcon || !tierBadge) return;
        
        switch(profileData.tier) {
            case 'featured':
                tierIcon.className = 'fas fa-check-circle tier-icon';
                tierBadge.className = 'fas fa-check';
                break;
            case 'verified':
                tierIcon.className = 'fas fa-check-circle tier-icon';
                tierBadge.className = 'fas fa-check';
                break;
            case 'top_rated':
                tierIcon.className = 'fas fa-crown tier-icon';
                tierBadge.className = 'fas fa-crown';
                break;
            default:
                tierIcon.style.display = 'none';
        }
    },

    updateBusinessHours() {
        const businessStatus = Utils.checkBusinessHours();
        const hoursStatusElement = document.getElementById('hoursStatus');
        const businessHoursElement = document.getElementById('businessHours');
        const openBadge = document.querySelector('.open-badge');
        
        if (hoursStatusElement) {
            if (businessStatus.isOpen) {
                hoursStatusElement.className = 'hours-status open';
                hoursStatusElement.innerHTML = `
                    <span class="pulse"></span>
                    ${businessStatus.statusText}
                `;
                
                if (openBadge) {
                    openBadge.innerHTML = '<i class="fas fa-door-open"></i> Open Now';
                    openBadge.style.background = 'rgba(34, 197, 94, 0.95)';
                }
            } else {
                hoursStatusElement.className = 'hours-status closed';
                hoursStatusElement.innerHTML = `
                    <span class="pulse"></span>
                    ${businessStatus.statusText}
                `;
                
                if (openBadge) {
                    openBadge.innerHTML = '<i class="fas fa-door-closed"></i> Closed';
                    openBadge.style.background = 'rgba(239, 68, 68, 0.95)';
                }
            }
        }
        
        if (businessHoursElement) {
            businessHoursElement.innerHTML = `
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <span>Mon - Fri</span>
                    <span style="font-weight: 500;">${profileData.businessHours.weekdays}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.05);">
                    <span>Saturday</span>
                    <span style="font-weight: 500;">${profileData.businessHours.saturday}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                    <span>Sunday</span>
                    <span style="font-weight: 500;">${profileData.businessHours.sunday}</span>
                </div>
            `;
        }
    },

    setupEventListeners() {
        // Search functionality
        const searchBar = document.querySelector('.search-bar');
        if (searchBar) {
            searchBar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchBar.value.trim();
                    if (query) {
                        window.location.href = `/search?q=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
        
        // Contact info links
        document.querySelectorAll('a[href^="tel:"]').forEach(link => {
            link.addEventListener('click', function(e) {
                // Allow default behavior
            });
        });
        
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', function(e) {
                // Allow default behavior
            });
        });
        
        // File upload preview
        const fileInput = document.getElementById('reviewImage');
        const fileUploadLabel = document.querySelector('.file-upload-label');
        
        if (fileInput && fileUploadLabel) {
            fileInput.addEventListener('change', function(e) {
                if (this.files && this.files[0]) {
                    const fileName = this.files[0].name;
                    fileUploadLabel.innerHTML = `<i class="fas fa-check-circle"></i> ${fileName.substring(0, 20)}${fileName.length > 20 ? '...' : ''}`;
                }
            });
        }
        
        // Review form submission
        const reviewForm = document.getElementById('reviewForm');
        if (reviewForm) {
            reviewForm.addEventListener('submit', (e) => FormSubmit.handleReviewForm(e));
        }
        
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => FormSubmit.handleContactForm(e));
        }
        
        // Touch/swipe support for mobile reviews
        const reviewsContainer = document.querySelector('.reviews-container');
        if (reviewsContainer) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            reviewsContainer.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            reviewsContainer.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX, reviewsContainer);
            });
        }
        
        // URL parameter handling for review modal
        this.handleUrlParameters();
    },

    handleSwipe(touchStartX, touchEndX, container) {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            const scrollLeft = container.scrollLeft;
            const cardWidth = 300 + 16; // width + gap
            const direction = diff > 0 ? 1 : -1;
            const reviewCards = document.querySelectorAll('.review-card');
            const cardIndex = Math.round(scrollLeft / cardWidth) + direction;
            
            if (cardIndex >= 0 && cardIndex < reviewCards.length) {
                container.scrollTo({
                    left: cardIndex * cardWidth,
                    behavior: 'smooth'
                });
            }
        }
    },

    handleUrlParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const hash = window.location.hash;
        
        if (urlParams.has('review') || hash === '#review') {
            setTimeout(() => {
                ModalManager.open('review');
            }, 500);
        }
    },

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeIn');
                }
            });
        }, observerOptions);
        
        // Observe all sections for animation
        document.querySelectorAll('.tag-section, .profile-reviews, .gallery-collage, .contact-form, .join-banner, .our-socials').forEach(section => {
            observer.observe(section);
        });
    }
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize modules
    MobileMenu.init();
    ModalManager.init();
    ImageGallery.init();
    ProfileManager.init();
    
    // Expose functions to global scope for HTML onclick attributes
    window.toggleMobileMenu = () => MobileMenu.toggle();
    window.closeMobileMenu = () => MobileMenu.close();
    window.openReviewModal = () => ModalManager.open('review');
    window.closeReviewModal = () => ModalManager.close('review');
    window.openImageModal = (index) => ImageGallery.open(index);
    window.closeImageModal = () => ModalManager.close('image');
    window.nextImage = () => ImageGallery.next();
    window.prevImage = () => ImageGallery.prev();
});

// Public API for testing
window.TailorsLK = {
    MobileMenu,
    ModalManager,
    ImageGallery,
    FormSubmit,
    ProfileManager,
    Utils
};
