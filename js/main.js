(function () {
  'use strict';

  const PAGE_ORDER = [
    { key: '',                        title: 'Overview' },
    { key: '1-meta-setup',            title: '1. Getting Started with Meta' },
    { key: '2-create-app',            title: '2. Creating a WhatsApp App' },
    { key: '3-ids-explained',         title: '3. Understanding IDs' },
    { key: '4-business-verification', title: '4. Business Verification' },
    { key: '5-phone-numbers',         title: '5. Phone Number Registration' },
    { key: '6-display-name',          title: '6. Display Name Verification' },
    { key: '7-tokens',                title: '7. Tokens & Authentication' },
    { key: '8-pricing',               title: '8. Pricing' },
    { key: '9-webhooks',              title: '9. Webhooks' },
    { key: '10-express-backend',      title: '10. Express Backend' },
    { key: '11-message-types',        title: '11. Message Types' },
    { key: '12-going-live',           title: '12. Going Live' },
  ];

  function getCurrentIndex() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');
    if (!filename || filename === 'index') return 0;
    const idx = PAGE_ORDER.findIndex(p => p.key === filename);
    return idx === -1 ? 0 : idx;
  }

  function getPagePath(idx) {
    if (idx === 0) return '../index.html';
    return './' + PAGE_ORDER[idx].key + '.html';
  }

  function isInPages() {
    return window.location.pathname.includes('/pages/');
  }

  function updateProgress() {
    const current = getCurrentIndex();
    const total = PAGE_ORDER.length - 1;
    const pct = total > 0 ? (current / total) * 100 : 0;

    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = pct + '%';

    const container = document.getElementById('progressDots');
    if (!container) return;

    container.innerHTML = '';
    PAGE_ORDER.forEach((page, i) => {
      const dot = document.createElement('span');
      dot.className = 'progress-dot';
      dot.title = page.title;
      if (i < current) dot.classList.add('done');
      else if (i === current) dot.classList.add('active');
      container.appendChild(dot);
    });
  }

  function initCodeCopy() {
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const block = btn.closest('.code-block');
        if (!block) return;
        const code = block.querySelector('code');
        if (!code) return;
        const text = code.innerText || code.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = 'Copied!';
            setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
          });
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1800);
        }
      });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function initExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(function (a) {
      if (!a.rel || !a.rel.includes('noopener')) {
        a.rel = 'noopener noreferrer';
      }
    });
  }

  function initMobileNav() {
    const hamburger = document.getElementById('navHamburger');
    const drawer = document.getElementById('navDrawer');
    if (!hamburger || !drawer) return;

    const current = getCurrentIndex();
    const inPages = isInPages();

    drawer.innerHTML = '';
    PAGE_ORDER.forEach(function (page, i) {
      const a = document.createElement('a');
      a.href = i === 0
        ? (inPages ? '../index.html' : './index.html')
        : (inPages ? './' + page.key + '.html' : './pages/' + page.key + '.html');

      const numSpan = document.createElement('span');
      numSpan.className = 'num';
      numSpan.textContent = i === 0 ? '☰' : i + '.';

      const titleSpan = document.createElement('span');
      titleSpan.textContent = i === 0 ? 'Overview' : page.title.replace(/^\d+\.\s*/, '');

      if (i < current) {
        a.classList.add('done-link');
        const check = document.createElement('span');
        check.className = 'check';
        check.textContent = '✓';
        a.appendChild(numSpan);
        a.appendChild(titleSpan);
        a.appendChild(check);
      } else {
        if (i === current) a.classList.add('current');
        a.appendChild(numSpan);
        a.appendChild(titleSpan);
      }

      drawer.appendChild(a);
    });

    hamburger.addEventListener('click', function () {
      drawer.classList.toggle('open');
    });

    document.addEventListener('click', function (e) {
      if (!drawer.contains(e.target) && !hamburger.contains(e.target)) {
        drawer.classList.remove('open');
      }
    });
  }

  function initChecklist() {
    document.querySelectorAll('.checklist-box').forEach(function (box) {
      box.addEventListener('click', function () {
        box.classList.toggle('checked');
      });
    });
  }

  function initNavbarScroll() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          navbar.classList.toggle('scrolled', window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initScrollReveal() {
    var selectors = ['.card', '.callout', '.ref-card', '.table-wrapper', '.diagram', '.code-block', '.page-nav', '.video-card'];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.classList.add('reveal');
      });
    });
    if (!window.IntersectionObserver) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { observer.observe(el); });
  }

  function initHeroAnimation() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var children = hero.querySelectorAll('.hero-badges, h1, .page-subtitle');
    children.forEach(function (el, i) {
      el.classList.add('hero-animate');
      setTimeout(function () { el.classList.add('entered'); }, 80 + i * 130);
    });
  }

  function initCardStagger() {
    var grid = document.querySelector('.section-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.section-card');
    cards.forEach(function (c) { c.classList.add('reveal'); });
    if (!window.IntersectionObserver) {
      cards.forEach(function (c) { c.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var allCards = grid.querySelectorAll('.section-card');
          allCards.forEach(function (card, i) {
            setTimeout(function () { card.classList.add('visible'); }, i * 55);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    observer.observe(grid);
  }

  function initMobileAnimations() {
    if (!window.matchMedia || !window.matchMedia('(max-width: 640px)').matches) return;
    if (!window.IntersectionObserver) return;

    // Slide each step in from the left as it scrolls into view
    var steps = document.querySelectorAll('.step');
    if (steps.length) {
      var stepObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('step-visible');
            stepObs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

      steps.forEach(function (s, i) {
        s.classList.add('step-reveal');
        // small stagger so consecutive steps don't fire at once
        s.style.transitionDelay = (i % 4 * 60) + 'ms';
        stepObs.observe(s);
      });
    }

    // Fade h2 headings in as they scroll into view
    var headings = document.querySelectorAll('.page-wrapper h2');
    if (headings.length) {
      var h2Obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('h2-visible');
            h2Obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      headings.forEach(function (h) {
        h.classList.add('h2-reveal');
        h2Obs.observe(h);
      });
    }
  }

  window.initPage = function () {
    updateProgress();
    initCodeCopy();
    initSmoothScroll();
    initExternalLinks();
    initMobileNav();
    initChecklist();
    initNavbarScroll();
    initScrollReveal();
    initHeroAnimation();
    initCardStagger();
    initMobileAnimations();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initPage);
  } else {
    window.initPage();
  }
})();
