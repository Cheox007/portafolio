document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('siteHeader');
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('primaryNav');
    const navLinks = nav.querySelectorAll('a[href^="#"]');
    const hero = document.querySelector('.hero');
    const sections = document.querySelectorAll('main section[id]');

    /* ------------------------------------------------------------------
       Header state
       - .is-scrolled : translucent backdrop after scroll
       - .on-dark     : white text while the dark hero is in view
                        (only applies on pages that have a .hero element)
       ------------------------------------------------------------------ */
    const heroEndPx = () =>
        hero.getBoundingClientRect().top + window.pageYOffset + hero.offsetHeight - header.offsetHeight;

    const updateHeaderState = () => {
        const y = window.pageYOffset;
        header.classList.toggle('is-scrolled', y > 24);
        if (hero) {
            header.classList.toggle('on-dark', y < heroEndPx() - 8);
        }
    };
    updateHeaderState();
    window.addEventListener('scroll', updateHeaderState, { passive: true });
    window.addEventListener('resize', updateHeaderState);

    /* ------------------------------------------------------------------
       Mobile menu
       ------------------------------------------------------------------ */
    const closeMobileNav = () => {
        nav.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
    };

    navToggle.addEventListener('click', () => {
        const opened = nav.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', opened);
        navToggle.setAttribute('aria-expanded', String(opened));
        navToggle.setAttribute('aria-label', opened ? 'Close menu' : 'Open menu');
    });

    /* ------------------------------------------------------------------
       Smooth scroll for in-page anchors only.
       Cross-page links (events.html, index.html#about) are left to the
       browser's default navigation.
       ------------------------------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const offset = header.offsetHeight + 8;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
            closeMobileNav();
        });
    });

    /* ------------------------------------------------------------------
       Active section highlight in nav.
       Only touches anchor-style links (href starting with '#').
       Cross-page links keep their hardcoded is-active untouched.
       ------------------------------------------------------------------ */
    if (sections.length > 0 && navLinks.length > 0) {
        const updateActiveSection = () => {
            const threshold = window.pageYOffset + header.offsetHeight + 80;
            let current = '';
            sections.forEach(section => {
                if (threshold >= section.offsetTop) current = section.id;
            });
            navLinks.forEach(link => {
                link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
            });
        };
        updateActiveSection();
        window.addEventListener('scroll', updateActiveSection, { passive: true });
    }

    /* ------------------------------------------------------------------
       Reveal on scroll
       ------------------------------------------------------------------ */
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('is-visible'));
    }
});
