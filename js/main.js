document.addEventListener('DOMContentLoaded', () => {

  // CURSOR
  const cursor = document.querySelector('.cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const tick = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%) translateZ(0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    document.querySelectorAll('a, button, .carta__item, .grid__cell').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('expand'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('expand'));
    });
  }

  // NAV
  const nav = document.querySelector('.nav');
  const hScroll = document.getElementById('h-scroll');

  if (hScroll) {
    hScroll.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', hScroll.scrollLeft > 60 || hScroll.scrollTop > 60);
    }, { passive: true });

    // Panel-by-panel navigation: find the nearest visible panel and move ±1
    let wheelLock = false;
    hScroll.addEventListener('wheel', e => {
      if (window.innerWidth <= 768) return;
      e.preventDefault();
      if (wheelLock) return;

      const dir = (e.deltaY || e.deltaX) > 0 ? 1 : -1;
      const panels = [...hScroll.querySelectorAll('.h-panel')];

      // Current panel = the one whose left edge is closest to x=0 of viewport
      let currentIdx = 0, minDist = Infinity;
      panels.forEach((p, i) => {
        const dist = Math.abs(p.getBoundingClientRect().left);
        if (dist < minDist) { minDist = dist; currentIdx = i; }
      });

      const nextIdx = Math.max(0, Math.min(panels.length - 1, currentIdx + dir));
      if (nextIdx === currentIdx) return;

      wheelLock = true;
      hScroll.scrollTo({
        left: hScroll.scrollLeft + panels[nextIdx].getBoundingClientRect().left,
        behavior: 'smooth'
      });
      setTimeout(() => { wheelLock = false; }, 900);
    }, { passive: false });
  }

  // MOBILE MENU
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // HERO ANIMATE IN
  setTimeout(() => {
    document.querySelectorAll('.hero__img-label, .hero__img-sub')
      .forEach(el => el.classList.add('visible'));
  }, 200);

  // SCROLL REVEAL — root: hScroll so the observer tracks the scroll container, not the viewport
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -10px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // CARTA FILTER
  const filterBtns = document.querySelectorAll('.carta__filter-btn');
  const items = document.querySelectorAll('.carta__item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(item => {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? 'grid' : 'none';
      });
    });
  });

  // SMOOTH ANCHORS — skip bare "#" links (footer legal) to avoid SyntaxError
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const t = document.querySelector(href);
      if (!t || !hScroll) return;
      e.preventDefault();
      if (window.innerWidth > 768) {
        // Explicit scrollLeft calculation is more reliable than scrollIntoView for horizontal scroll
        hScroll.scrollTo({
          left: hScroll.scrollLeft + t.getBoundingClientRect().left,
          behavior: 'smooth'
        });
      } else {
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // DATE MIN — prevent selecting past dates
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    fechaInput.min = new Date().toISOString().split('T')[0];
  }

  // FORM — validation + feedback
  const form = document.querySelector('.form');
  if (form) {
    const markErrors = () => {
      let hasError = false;
      form.querySelectorAll('[required]').forEach(el => {
        const empty = !el.value.trim();
        el.style.borderBottomColor = empty ? '#c0392b' : '';
        if (empty) hasError = true;
      });
      const personasEl = document.getElementById('personas');
      if (personasEl && !personasEl.value) {
        personasEl.style.borderBottomColor = '#c0392b';
        hasError = true;
      }
      return hasError;
    };

    // Clear error state on change
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input', () => { el.style.borderBottomColor = ''; });
      el.addEventListener('change', () => { el.style.borderBottomColor = ''; });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      if (markErrors()) return;

      const btn = form.querySelector('.form__submit');
      btn.textContent = 'Enviado ✓';
      btn.style.background = 'var(--topo)';
      setTimeout(() => {
        btn.textContent = 'Enviar reserva';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

});
