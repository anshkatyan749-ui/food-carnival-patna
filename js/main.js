/* Food Carnival Patna — site behaviour */
(function () {
  'use strict';

  var MENU = window.FC_MENU || [];
  var TEAM = window.FC_TEAM || [];

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav solid on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 60) nav.classList.add('nav--solid');
    else nav.classList.remove('nav--solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- mobile burger ---------- */
  var burger = document.getElementById('burger');
  var links = document.querySelector('.nav__links');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  function observeRises() { document.querySelectorAll('[data-rise]:not(.in)').forEach(function (el) { io.observe(el); }); }

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
    // stagger-in
    Array.prototype.forEach.call(gridEl.children, function (el, i) {
      el.style.opacity = 0; el.style.transform = 'translateY(14px)';
      setTimeout(function () {
        el.style.transition = 'opacity .5s var(--ease), transform .5s var(--ease)';
        el.style.opacity = 1; el.style.transform = 'none';
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
  teamGrid.innerHTML = TEAM.map(function (m) {
    return '<article class="member" data-rise>' +
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
    { img: 'img/hero-3.jpg', alt: 'Signature butter chicken', cls: 'g-tall' },
    { img: 'img/hero-5.jpg', alt: 'Dum biryani', cls: 'g-wide' },
    { img: 'img/hero-4.jpg', alt: 'Indian thali spread', cls: '' },
    { img: 'img/hero-1.jpg', alt: 'Fine dining table', cls: '' },
    { img: 'img/hero-6.jpg', alt: 'Tandoor kebabs', cls: 'g-wide' },
    { img: 'img/hero-2.jpg', alt: 'Restaurant ambiance', cls: '' },
    { img: 'img/menu-2.jpg', alt: 'Paneer tikka', cls: '' },
    { img: 'img/menu-0.jpg', alt: 'Malai tikka', cls: '' }
  ];
  galleryGrid.innerHTML = gPics.map(function (p) {
    return '<figure class="' + p.cls + '" data-rise><img loading="lazy" src="' + p.img + '" alt="' + p.alt + '" /></figure>';
  }).join('');

  observeRises();
})();
