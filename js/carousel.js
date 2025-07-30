// Carousel functionality for Instagram simulation
class Carousel {
    constructor(container) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.slides = container.querySelectorAll('.carousel-slide');
        this.dots = container.querySelectorAll('.carousel-dot');
        this.currentIndex = 0;
        this.totalSlides = this.slides.length;
        
        this.init();
    }
    
    init() {
        this.createDots();
        this.bindEvents();
        this.updateDots();
    }
    
    createDots() {
        if (this.dots.length === 0) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot';
                dot.dataset.index = i;
                dotsContainer.appendChild(dot);
            }
            
            this.container.appendChild(dotsContainer);
            this.dots = dotsContainer.querySelectorAll('.carousel-dot');
        }
    }
    
    bindEvents() {
        // Touch events for mobile
        let startX = 0;
        let endX = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        this.container.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
        });
        
        // Mouse events for desktop
        let isMouseDown = false;
        let mouseStartX = 0;
        
        this.container.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseStartX = e.clientX;
        });
        
        this.container.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                const mouseEndX = e.clientX;
                this.handleSwipe(mouseStartX, mouseEndX);
                isMouseDown = false;
            }
        });
        
        this.container.addEventListener('mouseleave', () => {
            isMouseDown = false;
        });
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });
        
        // Arrow key navigation
        document.addEventListener('keydown', (e) => {
            if (this.container.contains(document.activeElement) || 
                this.container.contains(e.target)) {
                if (e.key === 'ArrowLeft') {
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    this.nextSlide();
                }
            }
        });
    }
    
    handleSwipe(startX, endX) {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.prevSlide();
            }
        }
    }
    
    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;
        
        this.currentIndex = index;
        const translateX = -index * 100; // Each slide is exactly 100% width
        this.track.style.transform = `translateX(${translateX}%)`;
        this.updateDots();
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = this.currentIndex === 0 ? this.totalSlides - 1 : this.currentIndex - 1;
        this.goToSlide(prevIndex);
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
}

// Auto-initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel-container');
    carousels.forEach(container => {
        new Carousel(container);
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Carousel;
} 