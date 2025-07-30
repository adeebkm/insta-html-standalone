// Scroll and swipe functionality for Instagram simulation
class ScrollManager {
    constructor() {
        this.isScrolling = false;
        this.currentReelIndex = 0;
        this.reels = [];
        this.container = null;
        this.init();
    }

    init() {
        // Get reels container and reels
        this.container = document.querySelector('.reels-container');
        if (!this.container) return;
        
        this.reels = Array.from(document.querySelectorAll('.reel'));
        if (this.reels.length === 0) return;

        // Show first reel
        this.showReel(0);

        // Handle wheel events on document but only when over reels
        document.addEventListener('wheel', (e) => {
            if (e.target.closest('.reels-container')) {
                e.preventDefault();
                if (!this.isScrolling) {
                    this.handleScroll(e.deltaY > 0 ? 1 : -1);
                }
            }
        }, { passive: false });

        // Handle touch events for mobile
        let startY = 0;
        let isTouching = false;

        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.reels-container')) {
                startY = e.touches[0].clientY;
                isTouching = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.reels-container')) {
                e.preventDefault();
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (isTouching && e.target.closest('.reels-container')) {
                const endY = e.changedTouches[0].clientY;
                const diff = startY - endY;
                
                if (Math.abs(diff) > 50 && !this.isScrolling) {
                    this.handleScroll(diff > 0 ? 1 : -1);
                }
                isTouching = false;
            }
        }, { passive: true });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.reels-container')) {
                if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                    e.preventDefault();
                    this.handleScroll(1);
                } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                    e.preventDefault();
                    this.handleScroll(-1);
                }
            }
        });

        // Debug: Add click handler to test
        this.container.addEventListener('click', () => {
            console.log('Reels container clicked - scroll should work');
            this.handleScroll(1);
        });
    }

    handleScroll(direction) {
        if (this.isScrolling) return;

        const newIndex = this.currentReelIndex + direction;
        
        // Check bounds
        if (newIndex < 0 || newIndex >= this.reels.length) return;

        console.log(`Scrolling from reel ${this.currentReelIndex} to ${newIndex}`);

        this.isScrolling = true;
        this.currentReelIndex = newIndex;

        // Show the target reel
        this.showReel(newIndex);

        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 500);
    }

    showReel(index) {
        // Hide all reels and show target reel
        this.reels.forEach((reel, i) => {
            if (i === index) {
                reel.classList.add('active');
            } else {
                reel.classList.remove('active');
            }
        });
    }
}

// Initialize scroll manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollManager();
}); 