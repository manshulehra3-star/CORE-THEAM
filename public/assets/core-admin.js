/* ========== CORE-THEME ADMIN PANEL EFFECTS ========== */
(function () {
    'use strict';

    // ============ SNOW EFFECT ============
    function createSnow() {
        const flakes = ['❄', '❅', '❆', '•', '*'];
        const total = 40;

        for (let i = 0; i < total; i++) {
            const flake = document.createElement('div');
            flake.className = 'core-snowflake';
            flake.textContent = flakes[Math.floor(Math.random() * flakes.length)];
            flake.style.left = Math.random() * 100 + 'vw';
            flake.style.fontSize = (Math.random() * 12 + 8) + 'px';
            flake.style.animationDuration = (Math.random() * 6 + 5) + 's';
            flake.style.animationDelay = (Math.random() * 5) + 's';
            flake.style.opacity = (Math.random() * 0.5 + 0.3).toString();
            document.body.appendChild(flake);
        }
    }

    // ============ CLICK RIPPLE ============
    function createRipple(x, y, color) {
        const ripple = document.createElement('div');
        ripple.className = 'core-ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        if (color) {
            ripple.style.background = `radial-gradient(circle, ${color}aa, transparent 70%)`;
        }
        document.body.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    document.addEventListener('click', function (e) {
        const target = e.target.closest('button, a, .btn, [role="button"]');
        if (target) {
            // Get the accent color from primary button if possible
            const color = getComputedStyle(target).backgroundColor;
            createRipple(e.clientX, e.clientY, color !== 'rgba(0, 0, 0, 0)' ? '#6366f1' : null);
        } else {
            createRipple(e.clientX, e.clientY, null);
        }
    });

    // ============ SIDEBAR ACTIVE GLOW ============
    function highlightActive() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.sidebar a, aside a').forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }

    // ============ PAGE TRANSITION ============
    function animatePageIn() {
        document.body.style.opacity = '0';
        requestAnimationFrame(() => {
            document.body.style.transition = 'opacity 0.4s ease';
            document.body.style.opacity = '1';
        });
    }

    // ============ INIT ============
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        createSnow();
        highlightActive();
        animatePageIn();
    }

    // Watch for navigation (SPA-like)
    let lastPath = window.location.pathname;
    setInterval(() => {
        if (window.location.pathname !== lastPath) {
            lastPath = window.location.pathname;
            highlightActive();
            animatePageIn();
        }
    }, 300);
})();
