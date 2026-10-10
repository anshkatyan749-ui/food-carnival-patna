/* Food Carnival Patna — site behaviour */
(function () {
  'use strict';

  var MENU = window.FC_MENU || [];
  var TEAM = window.FC_TEAM || [];
  var WA_NUMBER = '919431088219'; // reservations line

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

  /* ---------- booking drawer ---------- */
  var drawer = document.getElementById('booking');
  var form = document.getElementById('bookingForm');
  var errEl = document.getElementById('bkErr');
  var okModal = document.getElementById('okModal');
  var okBody = document.getElementById('okBody');
  var lastFocus = null;

  // guest options
  var guests = form.elements['guests'];
  for (var g = 1; g <= 20; g++) {
    var o = document.createElement('option'); o.value = g; o.textContent = g + (g === 1 ? ' guest' : ' guests');
    guests.appendChild(o);
  }
  guests.value = 4;

  // default date = today, default arrival = next hour
  var today = new Date();
  form.elements['date'].value = today.toISOString().slice(0, 10);
  form.elements['date'].min = today.toISOString().slice(0, 10);
  var next = new Date(today.getTime() + 60 * 60 * 1000);
  form.elements['arrival'].value = String(next.getHours()).padStart(2, '0') + ':00';

  function openDrawer() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { form.elements['name'].focus(); }, 60);
    document.addEventListener('keydown', escClose);
  }
  function closeDrawer() {
    drawer.hidden = true;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', escClose);
    if (lastFocus) lastFocus.focus();
  }
  function escClose(e) { if (e.key === 'Escape') { closeDrawer(); } }

  document.querySelectorAll('[data-open-booking]').forEach(function (b) { b.addEventListener('click', openDrawer); });
  document.querySelectorAll('[data-close-booking]').forEach(function (b) { b.addEventListener('click', closeDrawer); });

  function closeOk() { okModal.hidden = true; document.body.style.overflow = ''; }
  document.querySelectorAll('[data-close-ok]').forEach(function (b) { b.addEventListener('click', closeOk); });

  function showErr(msg, field) {
    errEl.textContent = msg; errEl.hidden = false;
    if (field) { field.classList.add('invalid'); field.focus(); }
  }
  function clearErr() {
    errEl.hidden = true;
    form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErr();
    var f = form.elements;
    var name = f['name'].value.trim();
    var phone = f['phone'].value.replace(/\D/g, '');
    var kind = f['kind'].value;

    if (name.length < 2) return showErr('Please tell us your name.', f['name']);
    if (phone.length < 10) return showErr('Please enter a valid 10-digit mobile number.', f['phone']);
    if (!f['date'].value) return showErr('Please choose a date.', f['date']);

    var arrival = f['arrival'].value;
    var pickup = f['pickup'].value;
    if (!arrival && !pickup) return showErr('Please set an arrival time, a pickup time, or both.', f['arrival']);

    var lines = [];
    lines.push('Hello Food Carnival! I would like to make a reservation.');
    lines.push('');
    lines.push('Name: ' + name);
    lines.push('Phone: ' + phone);
    lines.push('Guests: ' + f['guests'].value);
    lines.push('Date: ' + f['date'].value);
    if (arrival) lines.push('Arrival time: ' + arrival);
    if (pickup) lines.push('Pickup time: ' + pickup);
    lines.push('Type: ' + kind);
    if (f['notes'].value.trim()) lines.push('Notes: ' + f['notes'].value.trim());
    lines.push('');
    lines.push('Please confirm, thank you!');

    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');

    okBody.textContent = 'We\'ve opened WhatsApp with your reservation pre-filled for ' + name + '. Press send there and we\'ll confirm within minutes.';
    closeDrawer();
    okModal.hidden = false;
    document.body.style.overflow = 'hidden';
    form.reset();
    guests.value = 4;
    form.elements['date'].value = today.toISOString().slice(0, 10);
  });
})();
