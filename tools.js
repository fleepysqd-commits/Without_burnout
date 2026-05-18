// ============ Mobile nav toggle ============
(function () {
    const toggle = document.getElementById('navToggle');
    const list = document.getElementById('navList');
    if (!toggle || !list) return;

    toggle.addEventListener('click', () => {
        const open = list.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(open));
    });

    list.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            list.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
})();

// ============ Animated stat counters ============
(function () {
    const nums = document.querySelectorAll('.stat-num[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) {
        nums.forEach((el) => (el.textContent = el.dataset.count));
        return;
    }

    const animate = (el) => {
        const target = parseInt(el.dataset.count, 10) || 0;
        const duration = 1200;
        const start = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - start) / duration);
            const value = Math.round(target * (0.5 - 0.5 * Math.cos(Math.PI * t)));
            el.textContent = value;
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    nums.forEach((el) => obs.observe(el));
})();

// ============ Footer year ============
(function () {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

// ============ Active nav link on scroll ============
(function () {
    const links = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
    if (!links.length) return;
    const sections = links
        .map((a) => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    if (!('IntersectionObserver' in window)) return;

    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const id = '#' + entry.target.id;
                    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === id));
                }
            });
        },
        { rootMargin: '-50% 0px -45% 0px', threshold: 0 }
    );

    sections.forEach((s) => obs.observe(s));
})();
