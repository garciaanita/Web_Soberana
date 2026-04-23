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
  const nav    = document.querySelector('.nav');
  const hScroll = document.getElementById('h-scroll');

  if (hScroll) {
    hScroll.addEventListener('scroll', () => {
      nav.classList.toggle('is-scrolled', hScroll.scrollLeft > 60 || hScroll.scrollTop > 60);
    }, { passive: true });
  }

  // SMOOTH SCROLL — animación propia con easeOutExpo para máximo control
  let rafId = null;

  function scrollToX(targetX, duration = 620) {
    if (rafId) cancelAnimationFrame(rafId);
    const startX = hScroll.scrollLeft;
    const dist   = targetX - startX;
    if (Math.abs(dist) < 1) return;
    const t0 = performance.now();

    const easeOutExpo = t => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

    function step(now) {
      const progress = Math.min((now - t0) / duration, 1);
      hScroll.scrollLeft = startX + dist * easeOutExpo(progress);
      if (progress < 1) rafId = requestAnimationFrame(step);
      else rafId = null;
    }
    rafId = requestAnimationFrame(step);
  }

  // WHEEL — listener en window para capturar en CUALQUIER punto de la pantalla
  // (el nav fixed es hermano de hScroll en el DOM, no hijo, así que
  //  un listener en hScroll no recibe eventos sobre él)
  let wheelLock    = false;
  let wheelEndTimer = null;

  window.addEventListener('wheel', e => {
    if (window.innerWidth <= 768 || !hScroll) return;
    e.preventDefault();

    // El lock se libera 400 ms después del ÚLTIMO evento wheel
    // (fin real del gesto incluido el momentum del trackpad)
    clearTimeout(wheelEndTimer);
    wheelEndTimer = setTimeout(() => { wheelLock = false; }, 400);

    if (wheelLock) return;

    // Eje dominante: evita que un deltaY residual mínimo
    // sobreescriba un gesto horizontal real en deltaX
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (delta === 0) return;
    const dir = delta > 0 ? 1 : -1;

    const panels = [...hScroll.querySelectorAll('.h-panel')];
    let currentIdx = 0, minDist = Infinity;
    panels.forEach((p, i) => {
      const d = Math.abs(p.getBoundingClientRect().left);
      if (d < minDist) { minDist = d; currentIdx = i; }
    });

    const nextIdx = Math.max(0, Math.min(panels.length - 1, currentIdx + dir));
    if (nextIdx === currentIdx) return;

    wheelLock = true;
    scrollToX(hScroll.scrollLeft + panels[nextIdx].getBoundingClientRect().left);
  }, { passive: false });

  // MOBILE MENU
  const burger     = document.querySelector('.nav__burger');
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

  // SCROLL REVEAL
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -10px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // CARTA FILTER
  const filterBtns = document.querySelectorAll('.carta__filter-btn');
  const items      = document.querySelectorAll('.carta__item');
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

  // SMOOTH ANCHORS — usa la misma animación que el wheel
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const t = document.querySelector(href);
      if (!t || !hScroll) return;
      e.preventDefault();
      if (window.innerWidth > 768) {
        scrollToX(hScroll.scrollLeft + t.getBoundingClientRect().left);
      } else {
        t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // DATE MIN
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) fechaInput.min = new Date().toISOString().split('T')[0];

  // FORM
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

    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('input',  () => { el.style.borderBottomColor = ''; });
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
