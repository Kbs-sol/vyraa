/* Vyra Herbals - front-end behaviour (no dependencies) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var DATA = { items: {}, families: [], whatsapp: '', checkoutUrl: '' };
  try { DATA = JSON.parse($('#vyra-data').textContent); } catch (e) {}
  var inr = function (n) {
    n = Math.round(n); var s = String(n);
    if (s.length <= 3) return '\u20B9' + s;
    return '\u20B9' + s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + s.slice(-3);
  };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ------------------------------------------------------------ cart */
  var KEY = 'vyra_cart_v2';
  var cart = [];
  function load() { try { cart = JSON.parse(localStorage.getItem(KEY) || '[]').filter(function (l) { return DATA.items[l.sku]; }); } catch (e) { cart = []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }
  function count() { return cart.reduce(function (a, l) { return a + l.qty; }, 0); }
  function total() { return cart.reduce(function (a, l) { return a + DATA.items[l.sku].p * l.qty; }, 0); }
  function add(sku, qty) {
    if (!DATA.items[sku]) return;
    var l = cart.filter(function (x) { return x.sku === sku; })[0];
    if (l) l.qty = Math.min(20, l.qty + (qty || 1)); else cart.push({ sku: sku, qty: qty || 1 });
    save(); render(); bump();
  }
  function setQty(sku, q) {
    cart = cart.map(function (l) { return l.sku === sku ? { sku: sku, qty: q } : l; }).filter(function (l) { return l.qty > 0; });
    save(); render();
  }
  function bump() { var b = $('#cart-count'); if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } }
  function render() {
    var n = count(), b = $('#cart-count');
    if (b) { b.textContent = n; b.classList.toggle('is-on', n > 0); }
    var body = $('#cart-body'), foot = $('#cart-foot');
    if (!body) return;
    if (!cart.length) {
      body.innerHTML = '<div class="drawer__empty"><p>Your bag is empty.</p><a class="btn btn--sm" href="/shop">Start shopping</a></div>';
      foot.innerHTML = ''; return;
    }
    body.innerHTML = cart.map(function (l) {
      var it = DATA.items[l.sku];
      return '<div class="citem"><a href="' + it.u + '"><img src="' + it.i + '" alt="" width="76" height="76"></a><div>' +
        '<b>' + esc(it.n) + '</b>' + (it.l ? '<small>' + esc(it.l) + '</small>' : '') +
        '<div class="citem__row"><div class="qty"><button type="button" data-q="-1" data-sku="' + l.sku + '" aria-label="Decrease">&minus;</button><output>' + l.qty + '</output><button type="button" data-q="1" data-sku="' + l.sku + '" aria-label="Increase">+</button></div>' +
        '<strong>' + inr(it.p * l.qty) + '</strong></div>' +
        '<button type="button" class="citem__rm" data-rm="' + l.sku + '">Remove</button></div></div>';
    }).join('');
    var t = total(), savings = cart.reduce(function (a, l) { var it = DATA.items[l.sku]; return a + Math.max(0, it.m - it.p) * l.qty; }, 0);
    foot.innerHTML = '<div class="freebar">Free shipping on every order</div>' +
      (savings ? '<div class="drawer__row"><span>You save</span><span style="color:var(--leaf);font-weight:700">' + inr(savings) + '</span></div>' : '') +
      '<div class="drawer__row"><span>Subtotal</span><b>' + inr(t) + '</b></div>' +
      '<button type="button" class="btn btn--block" data-checkout>Checkout</button>' +
      '<p class="drawer__note">Prototype hand-off: checkout is wired to the live store in the integration step.</p>';
  }
  function checkout() {
    if (!cart.length) return;
    var lines = cart.map(function (l) { var it = DATA.items[l.sku]; return l.qty + ' x ' + it.n + (it.l ? ' (' + it.l + ')' : '') + ' - ' + inr(it.p * l.qty); });
    if (DATA.checkoutUrl) {
      var q = cart.map(function (l) { return encodeURIComponent(l.sku) + ':' + l.qty; }).join(',');
      location.href = DATA.checkoutUrl + (DATA.checkoutUrl.indexOf('?') > -1 ? '&' : '?') + 'items=' + q; return;
    }
    var msg = 'Hi Vyra Herbals, I would like to order:\n' + lines.join('\n') + '\nTotal: ' + inr(total());
    window.open('https://wa.me/' + DATA.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  }

  /* ------------------------------------------------------------ overlays */
  var overlay = $('#overlay');
  function openPanel(id) {
    var el = document.getElementById(id); if (!el) return;
    closeAll(true); el.classList.add('is-open'); overlay && overlay.classList.add('is-open'); document.body.classList.add('is-locked');
  }
  function closeAll(keep) {
    $$('.drawer.is-open,.sheet.is-open').forEach(function (e) { e.classList.remove('is-open'); });
    overlay && overlay.classList.remove('is-open');
    if (!keep) document.body.classList.remove('is-locked');
  }
  var toastT;
  function toast(msg, withBag) {
    var t = $('#toast'); if (!t) return;
    t.innerHTML = '<span>' + esc(msg) + '</span>' + (withBag ? '<button type="button" data-open="cart">View bag</button>' : '');
    t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('is-on'); }, 3200);
  }
  function openModal(html) { var m = $('#modal'); $('#modal-body').innerHTML = html; m.classList.add('is-open'); document.body.classList.add('is-locked'); }
  function closeModal() { var m = $('#modal'); m.classList.remove('is-open'); $('#modal-body').innerHTML = ''; document.body.classList.remove('is-locked'); }

  /* ------------------------------------------------------------ card variant switching */
  function applyVariant(card, d, sku) {
    var price = $('[data-role=price]', card), mrp = $('[data-role=mrp]', card), img = $('[data-role=img]', card), size = $('[data-role=size]', card);
    if (price) price.textContent = inr(+d.price);
    if (mrp) { if (d.mrp && +d.mrp > +d.price) { mrp.textContent = inr(+d.mrp); mrp.hidden = false; } else mrp.hidden = true; }
    if (img && d.img) img.src = d.img;
    if (size && d.size != null) size.textContent = d.size;
    $$('[data-role=link]', card).forEach(function (a) { a.href = d.href; });
    var addBtn = $('[data-role=add]', card); if (addBtn) addBtn.setAttribute('data-add', sku);
  }

  /* ------------------------------------------------------------ search suggestions */
  function initSearch() {
    var q = $('#q'), box = $('#suggest'); if (!q || !box) return;
    function show() {
      var v = q.value.trim().toLowerCase();
      if (!v) { box.classList.remove('is-open'); box.innerHTML = ''; return; }
      var terms = v.split(/\s+/);
      var hits = DATA.families.filter(function (f) { var h = (f.t + ' ' + f.tag + ' ' + f.k).toLowerCase(); return terms.every(function (t) { return h.indexOf(t) > -1; }); }).slice(0, 5);
      box.innerHTML = hits.map(function (f) {
        return '<a href="/product/' + f.s + '" role="option"><img src="' + f.i + '" alt="" width="44" height="44"><span><b>' + esc(f.t) + '</b><small>From ' + inr(f.p) + '</small></span></a>';
      }).join('') + '<a class="suggest__all" href="/search?q=' + encodeURIComponent(v) + '">See all results for "' + esc(v) + '"</a>';
      box.classList.add('is-open');
    }
    q.addEventListener('input', show);
    q.addEventListener('focus', show);
    document.addEventListener('click', function (e) { if (!e.target.closest('.searchbar')) box.classList.remove('is-open'); });
  }

  /* ------------------------------------------------------------ PDP */
  function initPdp() {
    var root = $('#pdp'), dEl = $('#pdp-data'); if (!root || !dEl) return;
    var D = JSON.parse(dEl.textContent), cur = D.variants.filter(function (v) { return v.slug === D.current; })[0] || D.variants[0];
    var qty = 1;
    var title = $('#pdp-title'), price = $('#pdp-price'), mrp = $('#pdp-mrp'), offEl = $('#pdp-off'), size = $('#pdp-sub');
    var track = $('#gallery-track'), thumbs = $('#thumbs'), count = $('#gallery-count');
    var bar = $('#buybar'), cta = $('#pdp-cta');

    function findVariant(attrs) {
      return D.variants.filter(function (v) { return D.axes.every(function (a) { return v.attrs[a.key] === attrs[a.key]; }); })[0];
    }
    function fmtOff(p, m) { return m > p ? Math.round((m - p) / m * 100) + '% off' : ''; }
    function setGallery(imgs) {
      track.innerHTML = imgs.map(function (s, i) { return '<div class="gallery__slide"><img src="' + s + '" alt="" width="800" height="800"' + (i ? ' loading="lazy"' : '') + '></div>'; }).join('');
      thumbs.innerHTML = imgs.map(function (s, i) { return '<button type="button" data-th="' + i + '" class="' + (i ? '' : 'is-on') + '" aria-label="Image ' + (i + 1) + '"><img src="' + s + '" alt="" width="68" height="68"></button>'; }).join('');
      count.textContent = '1 / ' + imgs.length; track.scrollLeft = 0;
    }
    function sync(first) {
      var p = cur.p;
      price.textContent = inr(p.p);
      if (p.m > p.p) { mrp.textContent = inr(p.m); mrp.hidden = false; offEl.textContent = fmtOff(p.p, p.m); offEl.hidden = false; } else { mrp.hidden = true; offEl.hidden = true; }
      if (title) title.textContent = D.title;
      if (size) size.textContent = p.n;
      $$('.pill[data-axis]').forEach(function (b) { var on = cur.attrs[b.dataset.axis] === b.dataset.val; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      $$('[data-axis-value]').forEach(function (el) { el.textContent = cur.attrs[el.dataset.axisValue] || ''; });
      $$('select[data-pdp-select]').forEach(function (s) { s.value = cur.slug; });
      /* disable combos that do not exist */
      D.axes.forEach(function (a, ai) {
        $$('.pill[data-axis="' + a.key + '"]').forEach(function (b) {
          var probe = {}; D.axes.forEach(function (x) { probe[x.key] = cur.attrs[x.key]; }); probe[a.key] = b.dataset.val;
          b.classList.toggle('is-na', !findVariant(probe) && D.axes.length > 1);
        });
      });
      var inc = $('#pdp-includes'); if (inc) { inc.hidden = !p.inc.length; var ul = $('ul', inc); if (ul) ul.innerHTML = p.inc.map(function (i) { return '<li><svg class="icon" viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>' + esc(i) + '</li>'; }).join(''); }
      var pd = $('#pdp-desc'); if (pd) pd.textContent = p.d;
      var bp = $('#buybar-price'), bm = $('#buybar-mrp'), bl = $('#buybar-label');
      if (bp) bp.textContent = inr(p.p); if (bm) { bm.textContent = p.m > p.p ? inr(p.m) : ''; } if (bl) bl.textContent = cur.label;
      if (!first) { setGallery(p.i); }
      document.title = D.title + (cur.label ? ' - ' + cur.label : '') + ' | Vyra Herbals';
      try { history.replaceState(null, '', '/product/' + cur.slug); } catch (e) {}
    }
    root.addEventListener('click', function (e) {
      var pill = e.target.closest('.pill[data-axis]');
      if (pill) {
        var attrs = {}; D.axes.forEach(function (a) { attrs[a.key] = cur.attrs[a.key]; }); attrs[pill.dataset.axis] = pill.dataset.val;
        var v = findVariant(attrs);
        if (!v) { /* pick the first variant that has this value */ v = D.variants.filter(function (x) { return x.attrs[pill.dataset.axis] === pill.dataset.val; })[0]; }
        if (v) { cur = v; sync(); }
        return;
      }
      var th = e.target.closest('[data-th]');
      if (th) { var i = +th.dataset.th; track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' }); }
      if (e.target.closest('#qty-minus')) { qty = Math.max(1, qty - 1); $('#qty-val').textContent = qty; }
      if (e.target.closest('#qty-plus')) { qty = Math.min(20, qty + 1); $('#qty-val').textContent = qty; }
    });
    root.addEventListener('change', function (e) {
      var s = e.target.closest('select[data-pdp-select]');
      if (s) { var v = D.variants.filter(function (x) { return x.slug === s.value; })[0]; if (v) { cur = v; sync(); } }
    });
    track.addEventListener('scroll', function () {
      var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)), n = track.children.length;
      count.textContent = (i + 1) + ' / ' + n;
      $$('button', thumbs).forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
    }, { passive: true });
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-pdp-add]'), b = e.target.closest('[data-pdp-buy]');
      if (a) { add(cur.slug, qty); toast('Added to your bag', true); }
      if (b) { add(cur.slug, qty); openPanel('cart'); }
    });
    /* sticky bar: always visible on desktop, appears once in-page CTAs scroll away on mobile */
    if (bar && cta && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) { bar.classList.toggle('is-on', !en[0].isIntersecting); }, { threshold: 0 });
      io.observe(cta);
      var desk = matchMedia('(min-width: 980px)');
      var fn = function () { if (desk.matches) bar.classList.add('is-on'); };
      fn(); desk.addEventListener && desk.addEventListener('change', fn);
    } else if (bar) bar.classList.add('is-on');
    sync(true);
  }

  /* ------------------------------------------------------------ misc */
  function initDots() {
    $$('[data-dots]').forEach(function (d) {
      var rail = document.getElementById(d.dataset.dots); if (!rail) return;
      var items = rail.children;
      d.innerHTML = Array.prototype.map.call(items, function (_, i) { return '<i class="' + (i ? '' : 'is-on') + '"></i>'; }).join('');
      rail.addEventListener('scroll', function () {
        var w = items[0].getBoundingClientRect().width + 12, i = Math.round(rail.scrollLeft / w);
        $$('i', d).forEach(function (n, k) { n.classList.toggle('is-on', k === i); });
      }, { passive: true });
    });
  }
  function initReveal() {
    var els = $$('.reveal'); if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  function initTabs() {
    $$('[data-tabs]').forEach(function (wrap) {
      wrap.addEventListener('click', function (e) {
        var b = e.target.closest('[data-tab]'); if (!b) return;
        $$('[data-tab]', wrap).forEach(function (x) { x.classList.toggle('is-on', x === b); });
        $$('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== b.dataset.tab; });
      });
    });
  }
  function initTrack() {
    var f = $('#track-form'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = $('#track-id').value.trim(); if (!v) return;
      var out = $('#track-out');
      out.hidden = false;
      out.innerHTML = '<p><b>' + esc(v) + '</b></p><p>Open live tracking for this order or ask our team on WhatsApp.</p>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--sm" target="_blank" rel="noopener" href="' + f.dataset.live + '?id=' + encodeURIComponent(v) + '">Track on vyraherbals.com</a>' +
        '<a class="btn btn--outline btn--sm" target="_blank" rel="noopener" href="https://wa.me/' + DATA.whatsapp + '?text=' + encodeURIComponent('Hi, please share the status of order ' + v) + '">Ask on WhatsApp</a></div>';
    });
  }

  /* ------------------------------------------------------------ global events */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var open = t.closest('[data-open]'); if (open) { e.preventDefault(); var tt = $('#toast'); if (tt) tt.classList.remove('is-on'); openPanel(open.dataset.open); return; }
    if (t.closest('[data-close]')) { closeAll(); return; }
    var addB = t.closest('[data-add]');
    if (addB) { add(addB.getAttribute('data-add')); toast('Added to your bag', true); return; }
    var q = t.closest('[data-q]');
    if (q) { var l = cart.filter(function (x) { return x.sku === q.dataset.sku; })[0]; if (l) setQty(l.sku, l.qty + (+q.dataset.q)); return; }
    var rm = t.closest('[data-rm]'); if (rm) { setQty(rm.dataset.rm, 0); return; }
    if (t.closest('[data-checkout]')) { checkout(); return; }
    var pill = t.closest('.pcard .pill[data-sku]');
    if (pill) {
      var card = pill.closest('.pcard');
      $$('.pill', card).forEach(function (p) { p.classList.toggle('is-on', p === pill); p.setAttribute('aria-pressed', p === pill ? 'true' : 'false'); });
      applyVariant(card, pill.dataset, pill.dataset.sku); return;
    }
    var zoom = t.closest('[data-zoom]'); if (zoom) { openModal('<img src="' + zoom.getAttribute('data-zoom') + '" alt="">'); return; }
    var vid = t.closest('[data-video]');
    if (vid) { openModal('<iframe src="https://drive.google.com/file/d/' + vid.getAttribute('data-video') + '/preview" allow="autoplay; fullscreen" allowfullscreen></iframe>'); return; }
    var mk = t.closest('[data-play-making]');
    if (mk) {
      var frame = mk.closest('.making__frame'), src = mk.getAttribute('data-play-making');
      frame.classList.add('is-playing');
      frame.innerHTML = /drive\.google|youtube|youtu\.be|vimeo/.test(src)
        ? '<iframe src="' + src + '" allow="autoplay; fullscreen" allowfullscreen></iframe>'
        : '<video src="' + src + '" controls autoplay playsinline></video>';
      return;
    }
    if (t.closest('[data-close-modal]') || t.id === 'modal') { closeModal(); }
  });
  document.addEventListener('change', function (e) {
    var vs = e.target.closest('select[data-vselect]');
    if (vs) {
      var card = vs.closest('.pcard'), o = vs.options[vs.selectedIndex];
      applyVariant(card, o.dataset, vs.value); return;
    }
    var sort = e.target.closest('select[data-sort]');
    if (sort) { var u = new URL(location.href); u.searchParams.set('sort', sort.value); location.href = u.toString(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAll(); closeModal(); } });
  window.addEventListener('storage', function (e) { if (e.key === KEY) { load(); render(); } });

  load(); render(); initSearch(); initPdp(); initDots(); initReveal(); initTabs(); initTrack();
})();
