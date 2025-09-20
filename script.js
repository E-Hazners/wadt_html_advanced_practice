// Loading screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        // Start background music after loading
        startBackgroundMusic();
    }, 2000);
});

// Background Music Control
let isMusicPlaying = false;
const audio = document.getElementById('background-music');
const volumeSlider = document.getElementById('volume-slider');
const musicPlayPauseBtn = document.getElementById('music-play-pause');
const musicStatus = document.getElementById('music-status');

function startBackgroundMusic() {
    audio.volume = localStorage.getItem('volume') || 0.3;
    volumeSlider.value = audio.volume;
    
    // Auto-play with user interaction fallback
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isMusicPlaying = true;
            updateMusicControls();
        }).catch(error => {
            console.log('Autoplay prevented:', error);
            // Wait for user interaction to start music
        });
    }
}

function toggleMusic() {
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
    } else {
        audio.play().then(() => {
            isMusicPlaying = true;
        }).catch(error => {
            console.log('Error playing music:', error);
        });
    }
    updateMusicControls();
}

function updateMusicControls() {
    if (isMusicPlaying) {
        musicPlayPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
        musicStatus.textContent = 'Pauze';
    } else {
        musicPlayPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        musicStatus.textContent = 'Atskaņot';
    }
}

volumeSlider.addEventListener('input', e => {
    audio.volume = e.target.value;
    localStorage.setItem('volume', e.target.value);
});

musicPlayPauseBtn.addEventListener('click', toggleMusic);

// Create stars
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        starsContainer.appendChild(star);
    }
}

// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Progress Bar Functionality
function initProgressBars() {
    // Prologue progress
    const prologueLines = document.querySelectorAll('#prologue .animated-line');
    const prologueTotal = prologueLines.length;
    let prologueVisibleCount = 0;

    const prologueObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.dataset.observed) {
                    entry.target.dataset.observed = 'true';
                    prologueVisibleCount++;
                    updateProgressBar('prologue', prologueVisibleCount, prologueTotal);
                }
            }
        });
    }, { threshold: 0.3 });

    prologueLines.forEach(line => {
        prologueObserver.observe(line);
    });

    // Scene 1 progress
    const scene1Dialogues = document.querySelectorAll('#scene1 .dialogue');
    const scene1Total = scene1Dialogues.length;
    let scene1VisibleCount = 0;

    const scene1Observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.closest('.character-card:not(.filtered-out)')) {
                if (!entry.target.dataset.observed) {
                    entry.target.dataset.observed = 'true';
                    scene1VisibleCount++;
                    updateProgressBar('scene1', scene1VisibleCount, scene1Total);
                }
            }
        });
    }, { threshold: 0.5 });

    scene1Dialogues.forEach(dialogue => {
        scene1Observer.observe(dialogue);
    });
}

function updateProgressBar(section, visibleCount, totalCount) {
    const percentage = Math.round((visibleCount / totalCount) * 100);
    const progressBar = document.getElementById(`${section}-progress-bar`);
    const progressText = document.getElementById(`${section}-progress-text`);
    
    if (progressBar && progressText) {
        progressBar.style.width = percentage + '%';
        progressText.textContent = percentage + '%';
        
        // Add completion animation
        if (percentage === 100) {
            progressBar.classList.add('completed');
        }
    }
}

// Navigation functionality
function updateActiveNavLink() {
    const sections = ['home', 'prologue', 'scene1'];
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let currentSection = 'home'; // Default to home if at top
    
    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight / 2 && elementBottom > window.innerHeight / 2) {
                currentSection = section;
            }
        }
    });
    
    // If at the very top, keep home active
    if (window.scrollY < 100) {
        currentSection = 'home';
    }
    
    navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Smooth scrolling for anchor links with special handling for home
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        
        if (targetId === 'home') {
            // Special handling for home button - scroll to very top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Update active nav link
            setTimeout(() => {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }, 100);
        } else {
            // Regular sections with offset
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                setTimeout(() => {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }, 100);
            }
        }
    });
});

// Search functionality
function performSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const searchableElements = document.querySelectorAll('.searchable');
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        element.innerHTML = element.dataset.originalText || element.textContent;
        
        if (searchTerm && text.includes(searchTerm)) {
            element.classList.add('search-highlight');
            // Scroll to highlighted element
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest'
            });
        } else {
            element.classList.remove('search-highlight');
        }
        
        // Save original text for typewriter effect
        if (!element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
    });
}

// Role filter functionality
function applyRoleFilter() {
    const selectedRole = document.getElementById('role-filter').value;
    const characterCards = document.querySelectorAll('.character-card');
    
    characterCards.forEach(card => {
        const cardCharacter = card.dataset.character;
        
        if (selectedRole === 'all' || cardCharacter === selectedRole) {
            card.classList.remove('filtered-out');
            card.classList.add('filtered-in');
        } else {
            card.classList.remove('filtered-in');
            card.classList.add('filtered-out');
        }
    });
    
    // Reset typewriter effect for visible cards
    document.querySelectorAll('.dialogue[data-typed="true"]').forEach(d => {
        d.dataset.typed = '';
        d.textContent = d.dataset.originalText || d.textContent;
    });
    
    // Reset progress bar for scene 1 when filter changes
    const scene1Dialogues = document.querySelectorAll('#scene1 .dialogue');
    scene1Dialogues.forEach(d => {
        d.dataset.observed = '';
    });
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const isDark = body.getAttribute('data-bs-theme') === 'dark';
    
    if (isDark) {
        // Switch to light theme
        body.setAttribute('data-bs-theme', 'light');
        body.classList.add('light-theme');
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i> Gaišs';
        localStorage.setItem('theme', 'light');
    } else {
        // Switch to dark theme
        body.setAttribute('data-bs-theme', 'dark');
        body.classList.remove('light-theme');
        themeToggle.innerHTML = '<i class="bi bi-moon-fill"></i> Tumšs';
        localStorage.setItem('theme', 'dark');
    }
    
    // Trigger search and filter reapplication for theme change
    performSearch();
    applyRoleFilter();
}

// Load saved theme
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.setAttribute('data-bs-theme', 'light');
        document.body.classList.add('light-theme');
        document.getElementById('theme-toggle').innerHTML = '<i class="bi bi-sun-fill"></i> Gaišs';
    }
}

// Scroll animations
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in:not(.visible)');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    updateActiveNavLink();
    handleScrollAnimation();
});

// Parallax effect for header
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('.header');
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Typewriter effect for dialogues
function typeWriter(element, text, i = 0, speed = 20) {
    if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(() => typeWriter(element, text, i, speed), speed);
    }
}

const dialogueObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('filtered-in')) {
            const dialogue = entry.target;
            if (!dialogue.dataset.typed && !dialogue.classList.contains('hidden')) {
                const text = dialogue.dataset.originalText || dialogue.textContent.trim();
                dialogue.dataset.originalText = text;
                dialogue.textContent = '';
                typeWriter(dialogue, text);
                dialogue.dataset.typed = 'true';
            }
            dialogueObserver.unobserve(dialogue); // Type only once
        }
    });
}, { threshold: 0.5 });

// Highlight and toggle visibility for characters
document.addEventListener('click', (e) => {
    if (e.target.closest('.card-header')) {
        const cardHeader = e.target.closest('.card-header');
        const name = cardHeader.textContent.trim().split(' ')[0];
        
        // Single click - highlight
        document.querySelectorAll('.card-header').forEach(c => {
            if (c.textContent.trim().startsWith(name)) {
                c.classList.toggle('highlighted');
                const body = c.nextElementSibling;
                if (body && body.classList.contains('card-body')) {
                    body.querySelectorAll('.dialogue').forEach(d => d.classList.toggle('highlighted'));
                }
            }
        });
    }
}, true);

document.addEventListener('dblclick', (e) => {
    if (e.target.closest('.card-header')) {
        const cardHeader = e.target.closest('.card-header');
        const name = cardHeader.textContent.trim().split(' ')[0];
        
        // Double click - toggle visibility
        document.querySelectorAll('.card-header').forEach(c => {
            if (c.textContent.trim().startsWith(name)) {
                const body = c.nextElementSibling;
                if (body && body.classList.contains('card-body')) {
                    body.querySelectorAll('.dialogue').forEach(d => {
                        d.classList.toggle('hidden');
                        d.dataset.typed = ''; // Reset typewriter
                    });
                }
            }
        });
    }
}, true);

// Random quote generator
const quotes = Array.from(document.querySelectorAll('.dialogue')).map(d => d.dataset.originalText || d.textContent.trim()).filter(t => t.length > 0);
const quoteModal = new bootstrap.Modal(document.getElementById('quote-modal'));
const quoteText = document.getElementById('quote-text');

document.getElementById('random-quote').addEventListener('click', () => {
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteText.textContent = quotes[randomIndex];
        quoteModal.show();
    }
});

// Event listeners for dynamic options
document.getElementById('search-input').addEventListener('input', performSearch);

document.getElementById('role-filter').addEventListener('change', () => {
    applyRoleFilter();
    localStorage.setItem('favoriteRole', document.getElementById('role-filter').value);
});

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

// Sequential line animation for prologue
function animateLines() {
    const lines = document.querySelectorAll('#prologue .animated-line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, index * 300); // 300ms delay between each line
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createParticles();
    handleScrollAnimation();
    updateActiveNavLink();
    loadSavedTheme();
    initProgressBars();
    
    // Initialize typewriter observer
    document.querySelectorAll('.dialogue').forEach(d => dialogueObserver.observe(d));
    
    // Initialize search with original text
    document.querySelectorAll('.searchable').forEach(el => {
        if (!el.dataset.originalText) {
            el.dataset.originalText = el.textContent;
        }
    });
    
    // Load saved favorite role
    const roleFilter = document.getElementById('role-filter');
    roleFilter.value = localStorage.getItem('favoriteRole') || 'all';
    applyRoleFilter();
    
    // Start sequential animation for prologue
    setTimeout(animateLines, 500);
    
    // Initialize music controls
    updateMusicControls();
});

// Reset animations on theme/filter change
function resetAnimations() {
    document.querySelectorAll('.animated-line').forEach(line => {
        line.style.opacity = 0;
        line.classList.remove('visible');
    });
    setTimeout(animateLines, 100);
}

// Add click event for music dropdown to show/hide
document.querySelector('.dropdown-toggle[title="Skaņa"]').addEventListener('click', function(e) {
    e.stopPropagation();
});