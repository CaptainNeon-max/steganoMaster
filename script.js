// Utility function to toggle classes
function toggleClass(element, className) {
    element.classList.toggle(className);
}

// Mobile menu functionality
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            toggleClass(navLinks, 'nav-active');
            const icon = mobileMenuToggle.querySelector('i');
            toggleClass(icon, 'fa-bars');
            toggleClass(icon, 'fa-times');
        });
    }
}

// FAQ accordion functionality
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                toggleClass(item, 'active');
            });
        }
    });
}

// Smooth scrolling functionality
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Animation observer for elements
function initAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item, .feature-orbit').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'all 0.5s ease';
        observer.observe(item);
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.5s ease';
        observer.observe(card);
    });
}

// Download folder functionality with user-selected files
function initDownload() {
    const downloadButtons = document.querySelectorAll('[id^="download-now"]');
    const folderInput = document.getElementById('folder-input');

    // downloadButtons.forEach(button => {
    //     button.addEventListener('click', (e) => {
    //         e.preventDefault();
    //         // Trigger folder selection
    //         folderInput.click();
    //     });
    // });

    folderInput.addEventListener('change', async () => {
        const files = folderInput.files;
        if (!files || files.length === 0) {
            alert('Please select the SteganoMaster_Files folder.');
            return;
        }

        // Add downloading state to all buttons
        downloadButtons.forEach(button => {
            button.classList.add('downloading');
            button.textContent = 'Preparing Download...';
        });

        try {
            const zip = new JSZip();

            // Add each file to the ZIP, preserving relative paths
            for (const file of files) {
                const relativePath = file.webkitRelativePath || file.name;
                const blob = await file.arrayBuffer();
                zip.file(relativePath, blob);
            }

            // Generate ZIP and trigger download
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            saveAs(zipBlob, 'SteganoMaster_Files.zip');

            // Reset button state
            downloadButtons.forEach(button => {
                button.classList.remove('downloading');
                button.textContent = 'Download Now';
            });
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to create ZIP: ' + error.message);
            downloadButtons.forEach(button => {
                button.classList.remove('downloading');
                button.textContent = 'Download Now';
            });
        }

        // Clear input to allow re-selection
        folderInput.value = '';
    });
}

// Initialize all functionalities when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initFAQAccordion();
    initSmoothScrolling();
    initAnimations();
    initDownload();
});