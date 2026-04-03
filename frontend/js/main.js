/**
 * main.js — SDGconnect Global Script
 * Runs on every page. Handles navbar behaviour, scroll effects,
 * mobile menu toggle, and shared UI helpers.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('[SDGconnect] Frontend chargé.');

    // ─── Sticky Navbar Shadow ──────────────────────────────────────────────────
    const navbar = document.querySelector('.navbar, .header');
    if (navbar) {
        const updateNavbarShadow = () => {
            if (window.scrollY > 10) {
                navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
            }
        };
        window.addEventListener('scroll', updateNavbarShadow, { passive: true });
        updateNavbarShadow(); // run once on load
    }

    // ─── Mobile Menu Toggle ───────────────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const navbarNav = document.querySelector('.navbar-nav, .nav-links');

    if (menuToggle && navbarNav) {
        menuToggle.addEventListener('click', () => {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', String(!expanded));
            navbarNav.classList.toggle('nav-open');
            menuToggle.classList.toggle('is-open');
        });

        // Close menu when a link is clicked
        navbarNav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navbarNav.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.classList.remove('is-open');
            });
        });
    }

    // ─── Active Nav Link Highlighting ─────────────────────────────────────────
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.navbar-nav a, .nav-links a').forEach((link) => {
        const href = link.getAttribute('href')?.split('/').pop() || '';
        if (href === currentPage) {
            link.classList.add('active');
        }
    });

    // ─── Scroll-Reveal Animation ──────────────────────────────────────────────
    // Adds the class 'visible' to elements with [data-reveal] when they enter the viewport.
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        document.querySelectorAll('[data-reveal], .card, .stat-item').forEach((el) => {
            revealObserver.observe(el);
        });
    }

    // ─── Flash Notifications ──────────────────────────────────────────────────
    /**
     * Show a brief toast notification at the top-right of the screen.
     * @param {string} message
     * @param {'success'|'error'|'info'} type
     */
    window.showToast = function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `sdg-toast sdg-toast--${type}`;
        toast.setAttribute('role', 'alert');
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: '9999',
            padding: '14px 22px',
            borderRadius: '8px',
            fontFamily: 'var(--font-body, sans-serif)',
            fontSize: '0.95rem',
            fontWeight: '600',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            color: '#fff',
            backgroundColor:
                type === 'success' ? '#4CAF50'
                : type === 'error'   ? '#E53935'
                :                     '#0066CC',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
        });

        document.body.appendChild(toast);

        // Fade in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Fade out after 3s
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // ─── Auth State in Navbar ─────────────────────────────────────────────────
    // If auth.js is loaded, apply auth-based navbar updates.
    if (window.SDGAuth) {
        window.SDGAuth.updateNavbarForAuth?.();
    }

    // ─── Smooth Scroll for Anchor Links ──────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Back-to-Top Button ───────────────────────────────────────────────────
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.style.display = window.scrollY > 400 ? 'flex' : 'none';
        }, { passive: true });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Generic Confirm-Delete Buttons ──────────────────────────────────────
    // Elements with data-confirm="..." will show a confirmation dialog.
    document.querySelectorAll('[data-confirm]').forEach((el) => {
        el.addEventListener('click', (e) => {
            const msg = el.dataset.confirm || 'Êtes-vous sûr ?';
            if (!confirm(msg)) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
});
