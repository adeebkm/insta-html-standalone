// Video functionality for Instagram simulation
class VideoManager {
    constructor() {
        this.videos = [];
        this.intersectionObserver = null;
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.bindEvents();
    }
    
    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        this.playVideo(video);
                    } else {
                        this.pauseVideo(video);
                    }
                });
            },
            {
                threshold: 0.5,
                rootMargin: '0px 0px -10% 0px'
            }
        );
    }
    
    bindEvents() {
        // Video click to play/pause
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'VIDEO') {
                this.toggleVideo(e.target);
            }
        });
        
        // Video ended event
        document.addEventListener('ended', (e) => {
            if (e.target.tagName === 'VIDEO') {
                this.handleVideoEnd(e.target);
            }
        });
        
        // Mute/unmute functionality
        document.addEventListener('keydown', (e) => {
            if (e.key === 'm' || e.key === 'M') {
                this.toggleMuteAll();
            }
        });
    }
    
    addVideo(video) {
        this.videos.push(video);
        this.intersectionObserver.observe(video);
        
        // Set default attributes
        video.muted = true;
        video.playsInline = true;
        video.loop = video.classList.contains('reel-video');
        
        // Add loading state
        video.addEventListener('loadstart', () => {
            video.classList.add('loading');
        });
        
        video.addEventListener('canplay', () => {
            video.classList.remove('loading');
        });
        
        video.addEventListener('error', () => {
            console.error('Video failed to load:', video.src);
            video.classList.remove('loading');
        });
    }
    
    playVideo(video) {
        if (video.paused) {
            video.play().catch(error => {
                console.warn('Video autoplay failed:', error);
            });
        }
    }
    
    pauseVideo(video) {
        if (!video.paused) {
            video.pause();
        }
    }
    
    toggleVideo(video) {
        if (video.paused) {
            this.playVideo(video);
        } else {
            this.pauseVideo(video);
        }
    }
    
    handleVideoEnd(video) {
        if (video.classList.contains('reel-video')) {
            // For reels, restart the video
            video.currentTime = 0;
            this.playVideo(video);
        }
        // For feed videos, they stay paused
    }
    
    toggleMuteAll() {
        const isMuted = this.videos[0]?.muted;
        this.videos.forEach(video => {
            video.muted = !isMuted;
        });
        
        // Show mute/unmute indicator
        this.showMuteIndicator(!isMuted);
    }
    
    showMuteIndicator(isMuted) {
        // Remove existing indicator
        const existingIndicator = document.querySelector('.mute-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }
        
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = 'mute-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            pointer-events: none;
        `;
        indicator.textContent = isMuted ? '🔇 Muted' : '🔊 Unmuted';
        
        document.body.appendChild(indicator);
        
        // Remove after 2 seconds
        setTimeout(() => {
            indicator.remove();
        }, 2000);
    }
    
    // Utility method to create video element
    static createVideo(src, options = {}) {
        const video = document.createElement('video');
        video.src = src;
        video.muted = options.muted !== false;
        video.playsInline = true;
        video.loop = options.loop || false;
        video.autoplay = options.autoplay || false;
        video.controls = options.controls || false;
        
        if (options.className) {
            video.className = options.className;
        }
        
        if (options.poster) {
            video.poster = options.poster;
        }
        
        return video;
    }
}

// Auto-initialize video manager
let videoManager;

document.addEventListener('DOMContentLoaded', () => {
    videoManager = new VideoManager();
    
    // Add existing videos to manager
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        videoManager.addVideo(video);
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoManager;
} 