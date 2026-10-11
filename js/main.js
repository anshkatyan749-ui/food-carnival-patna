/* Food Carnival Patna — site behaviour & motion */
(function () {
  'use strict';

  var MENU = window.FC_MENU || [];
  var TEAM = window.FC_TEAM || [];
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- scroll progress bar ---------- */
  var progress = document.getElementById('progress');
  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? h.scrollTop / max : 0;
    if (progress) progress.style.transform = 'scaleX(' + p + ')';
  }

  /* ---------- nav: solid on scroll, hide on scroll down ---------- */
  var nav = document.getElementById('nav');
  var lastY = 0;
  function onScroll() {
    var sy = window.scrollY;
    if (nav) {
      nav.classList.toggle('nav--solid', sy > 60);
      var goingDown = sy > lastY && sy > 320;
      nav.classList.toggle('nav--hidden', goingDown && !document.body.classList.contains('nav-open'));
    }
    lastY = sy;
    updateProgress();
    parallax();
    spy();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile burger ---------- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  function closeMenu() {
    links.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('nav-open', open);
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeMenu(); closeLightbox(); }
  });

  /* ---------- scroll reveal (staggered) ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  function observeRises() {
    document.querySelectorAll('[data-rise]:not(.in)').forEach(function (el, i) {
      if (!el.style.transitionDelay) el.style.transitionDelay = (i % 6) * 0.07 + 's';
      io.observe(el);
    });
  }

  /* ---------- menu ---------- */
  var CATS = [
    { id: 'all', label: 'Everything' },
    { id: 'starters', label: 'Tandoor & Starters' },
    { id: 'mains', label: 'Royal Curries' },
    { id: 'biryani', label: 'Dum Biryani & Rice' },
    { id: 'chinese', label: 'Indo-Chinese Wok' },
    { id: 'breads', label: 'Artisan Breads' },
    { id: 'desserts', label: 'Sweets & Desserts' },
    { id: 'beverages', label: 'Coolers & Shakes' }
  ];
  var tabsEl = document.getElementById('menuTabs');
  var gridEl = document.getElementById('menuGrid');

  function spiceMarks(n) {
    if (!n) return '';
    return '<span class="chip chip--spice">' + '🌶'.repeat(Math.min(n, 3)) + '</span>';
  }

  function dishCard(d) {
    var dots = d.chef ? '<span class="chip chip--chef">Chef\'s pick</span>' : '';
    var tags = (d.tags || []).slice(0, 2).map(function (t) { return '<span class="chip">' + t + '</span>'; }).join('');
    return '<article class="dish" data-cat="' + d.cat + '">' +
      '<img class="dish__img" loading="lazy" src="' + d.img + '" alt="' + d.name + '" />' +
      '<div class="dish__body">' +
        '<div class="dish__top">' +
          '<span class="veg ' + (d.veg ? '' : 'nonveg') + '" title="' + (d.veg ? 'Veg' : 'Non-veg') + '"></span>' +
          '<span class="dish__name">' + d.name + '</span>' +
          '<span class="dish__dots"></span>' +
          '<span class="dish__price">₹' + d.price + '</span>' +
        '</div>' +
        '<p class="dish__desc">' + d.desc + '</p>' +
        '<div class="dish__meta">' + dots + tags + spiceMarks(d.spice) +
          (d.time ? '<span class="chip">' + d.time + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderCat(cat) {
    var items = cat === 'all' ? MENU : MENU.filter(function (d) { return d.cat === cat; });
    gridEl.innerHTML = items.map(dishCard).join('');
    Array.prototype.forEach.call(gridEl.children, function (el, i) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(14px)';
      setTimeout(function () {
        el.style.transition = 'opacity .5s var(--ease), transform .5s var(--ease)';
        el.style.opacity = 1;
        el.style.transform = 'none';
      }, 30 + i * 35);
    });
  }

  CATS.forEach(function (c, i) {
    var b = document.createElement('button');
    b.className = 'tab'; b.type = 'button'; b.role = 'tab';
    b.textContent = c.label + ' (' + (c.id === 'all' ? MENU.length : MENU.filter(function (d) { return d.cat === c.id; }).length) + ')';
    b.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    b.addEventListener('click', function () {
      tabsEl.querySelectorAll('.tab').forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
      b.setAttribute('aria-selected', 'true');
      renderCat(c.id);
    });
    tabsEl.appendChild(b);
  });
  renderCat('all');

  /* ---------- team ---------- */
  var teamGrid = document.getElementById('teamGrid');
  teamGrid.innerHTML = TEAM.map(function (m, i) {
    return '<article class="member" data-rise style="transition-delay:' + (i % 5) * 0.08 + 's">' +
      '<div class="member__imgwrap">' +
        '<img loading="lazy" src="' + m.img + '" alt="' + m.name + '" />' +
        '<div class="member__name"><strong>' + m.name + '</strong><span>' + m.role + '</span></div>' +
      '</div>' +
      '<p class="member__spec">' + (m.spec || m.exp || '') + '</p>' +
      (m.quote ? '<p class="member__quote">“' + m.quote + '”</p>' : '') +
    '</article>';
  }).join('');

  /* ---------- gallery ---------- */
  var galleryGrid = document.getElementById('galleryGrid');
  var gPics = [
    { img: 'assets/real/fc-facade.jpg', alt: 'Food Carnival facade at night, Agamkuan Patna', cls: 'g-tall' },
    { img: 'assets/real/fc-interior-wide.jpg', alt: 'Food Carnival dining area', cls: 'g-wide' },
    { img: 'assets/real/fc-menu-card.jpg', alt: 'Food Carnival printed menu', cls: 'g-tall' },
    { img: 'assets/real/fc-biryani.jpg', alt: 'Dum biryani', cls: '' },
    { img: 'assets/real/fc-facade-wide.jpg', alt: 'Food Carnival signage', cls: 'g-wide' },
    { img: 'assets/real/fc-kebab.jpg', alt: 'Seekh kebabs', cls: '' },
    { img: 'assets/real/fc-momos.jpg', alt: 'Schezwan momos', cls: 'g-wide' },
    { img: 'assets/real/fc-kofta.jpg', alt: 'Handi curry', cls: '' },
    { img: 'assets/real/fc-noodles.jpg', alt: 'Hakka noodles', cls: '' },
    { img: 'assets/real/fc-mojito.jpg', alt: 'Blue lagoon mocktail', cls: '' }
  ];
  galleryGrid.innerHTML = gPics.map(function (p, i) {
    return '<figure class="' + p.cls + '" data-lb="' + i + '" style="transition-delay:' + (i % 4) * 0.09 + 's"><img loading="lazy" src="' + p.img + '" alt="' + p.alt + '" /></figure>';
  }).join('');

  observeRises();

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lbImg');
  var lbCount = document.getElementById('lbCount');
  var lbIndex = 0;
  function openLightbox(i) {
    lbIndex = (i + gPics.length) % gPics.length;
    lbImg.src = gPics[lbIndex].img;
    lbImg.alt = gPics[lbIndex].alt;
    lbCount.textContent = (lbIndex + 1) + ' / ' + gPics.length;
    lb.hidden = false;
    requestAnimationFrame(function () { lb.classList.add('is-open'); });
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (lb.hidden) return;
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(function () { lb.hidden = true; }, 320);
  }
  galleryGrid.addEventListener('click', function (e) {
    var fig = e.target.closest('figure[data-lb]');
    if (fig) openLightbox(parseInt(fig.getAttribute('data-lb'), 10));
  });
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbPrev').addEventListener('click', function () { openLightbox(lbIndex - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { openLightbox(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
  });

  /* ---------- hero slideshow ---------- */
  var slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1 && !reduceMotion) {
    var sIdx = 0;
    setInterval(function () {
      slides[sIdx].classList.remove('is-active');
      sIdx = (sIdx + 1) % slides.length;
      slides[sIdx].classList.add('is-active');
    }, 5200);
  }

  /* ---------- hero spotlight follows cursor ---------- */
  var hero = document.querySelector('.hero');
  var spot = document.querySelector('.hero__spot');
  if (hero && spot && !reduceMotion) {
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      spot.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      spot.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ---------- embers rising in hero ---------- */
  var canvas = document.getElementById('embers');
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext('2d');
    var W = 0, H = 0, parts = [];
    function sizeCanvas() {
      var r = canvas.parentElement.getBoundingClientRect();
      W = canvas.width = r.width;
      H = canvas.height = r.height;
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas);
    function spawn() {
      return { x: Math.random() * W, y: H + Math.random() * 40, r: 1 + Math.random() * 2.4,
        vy: 0.35 + Math.random() * 0.9, vx: (Math.random() - 0.5) * 0.4,
        life: 0, max: 320 + Math.random() * 320, hue: 18 + Math.random() * 26 };
    }
    for (var i = 0; i < 46; i++) { var p = spawn(); p.y = Math.random() * H; parts.push(p); }
    var running = true;
    var heroIO = new IntersectionObserver(function (en) { running = en[0].isIntersecting; });
    heroIO.observe(canvas);
    (function tick() {
      requestAnimationFrame(tick);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (pt, idx) {
        pt.life++;
        pt.y -= pt.vy;
        pt.x += pt.vx + Math.sin(pt.life / 40) * 0.3;
        var t = pt.life / pt.max;
        if (t >= 1 || pt.y < -10) parts[idx] = spawn();
        var a = Math.sin(Math.PI * Math.min(t, 1)) * 0.85;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, 6.284);
        ctx.fillStyle = 'hsla(' + pt.hue + ',95%,60%,' + a + ')';
        ctx.shadowColor = 'hsla(' + pt.hue + ',95%,55%,' + a + ')';
        ctx.shadowBlur = 7;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    })();
  }

  /* ---------- parallax ---------- */
  var pxEls = document.querySelectorAll('[data-parallax]');
  function parallax() {
    if (reduceMotion || !pxEls || !pxEls.forEach) return;
    var vh = window.innerHeight;
    pxEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var speed = parseFloat(el.getAttribute('data-parallax')) || 0.05;
      var offset = (r.top + r.height / 2 - vh / 2) * speed;
      el.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
    });
  }

  /* ---------- counters ---------- */
  var counted = new WeakSet();
  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting || counted.has(en.target)) return;
      counted.add(en.target);
      var el = en.target;
      var target = parseFloat(el.getAttribute('data-count'));
      var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduceMotion) { el.textContent = target.toFixed(dec) + suffix; return; }
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var t = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(dec) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { counterIO.observe(el); });

  /* ---------- scrollspy ---------- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
  var sections = spyLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function spy() {
    if (!spyLinks || !spyLinks.forEach) return;
    var pos = window.scrollY + window.innerHeight * 0.3;
    var active = -1;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop <= pos) active = i;
    });
    spyLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === active); });
  }

  /* ---------- magnetic buttons (fine pointers only) ---------- */
  if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reduceMotion) {
    document.querySelectorAll('.btn').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - r.left - r.width / 2) * 0.18;
        var dy = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + (dy - 2).toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
    /* gentle tilt on about collage */
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        el.style.transform = 'perspective(700px) rotateX(' + rx.toFixed(1) + 'deg) rotateY(' + ry.toFixed(1) + 'deg)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- back to top ---------- */
  var backTop = document.getElementById('backTop');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    var btIO = new IntersectionObserver(function (en) {
      backTop.classList.toggle('is-visible', !en[0].isIntersecting);
    }, { threshold: 0 });
    btIO.observe(document.body);
  }

  /* ---------- open-now indicator (11:30 – 23:30 IST) ---------- */
  (function () {
    var el = document.getElementById('openNow');
    var txt = document.getElementById('openNowText');
    if (!el || !txt) return;
    var now;
    try {
      now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    } catch (e) { now = new Date(); }
    var mins = now.getHours() * 60 + now.getMinutes();
    var open = mins >= 690 && mins < 1410; /* 11:30 → 23:30 */
    el.classList.add(open ? 'is-open' : 'is-closed');
    txt.textContent = open
      ? 'Open now — till 11:30 PM'
      : (mins < 690 ? 'Opens today at 11:30 AM' : 'Closed — opens 11:30 AM tomorrow');
  })();

  /* ---------- theme toggle ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    var savedTheme = localStorage.getItem('fc-theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      themeToggle.textContent = '☀️';
    } else if (savedTheme === 'light') {
      themeToggle.textContent = '🌙';
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark');
      themeToggle.textContent = '☀️';
    }
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      if (document.body.classList.contains('dark')) {
        themeToggle.textContent = '☀️';
        localStorage.setItem('fc-theme', 'dark');
      } else {
        themeToggle.textContent = '🌙';
        localStorage.setItem('fc-theme', 'light');
      }
    });
  }
})();
