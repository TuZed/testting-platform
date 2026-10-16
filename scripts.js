/* ==========================================================================
   AURORA Store — scripts.js
   Vanilla JS · no dependencies
   State → Render → Cart → Wishlist → QuickView → Customizer → UI wiring
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. HELPERS
     ------------------------------------------------------------------------ */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const nf = new Intl.NumberFormat('vi-VN');
  const money = (n) => nf.format(n) + '₫';

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  /* ------------------------------------------------------------------------
     2. PRODUCT DATA  (mock — dữ liệu mẫu, không phải cửa hàng thật)
     ------------------------------------------------------------------------ */
  const PRODUCTS = [
    {
      id: 'aurora-pro', name: 'Aurora Pro', brand: 'NOVA Audio', cat: 'audio',
      price: 4290000, was: 4990000, rating: 4.8, reviews: 214, badge: 'Bán chạy',
      desc: 'Tai nghe chống ồn thích ứng, pin 38 giờ, khung nhôm hàng không.',
      specs: { 'Chống ồn': 'Thích ứng (ANC)', 'Pin': '38 giờ', 'Kết nối': 'Bluetooth 5.3',
               'Trọng lượng': '268 g', 'Chống nước': 'IPX4' },
      colors: ['#0E9F7E', '#0B72B5', '#1B2621'], featured: true
    },
    {
      id: 'lumen-x', name: 'Lumen X', brand: 'LUMEN', cat: 'camera',
      price: 18900000, was: 21500000, rating: 4.9, reviews: 86, badge: 'Mới',
      desc: 'Máy ảnh không gương lõi APS-C 26MP, IBIS 5 trục, thân máy 410g.',
      specs: { 'Cảm biến': 'APS-C 26MP', 'Video': '4K 60fps 10-bit',
               'Chống rung': 'IBIS 5 trục', 'Trọng lượng': '410 g', 'Khe thẻ': '1× SD UHS-II' },
      colors: ['#1B2621', '#6E7B75'], featured: true
    },
    {
      id: 'pulse-s', name: 'Pulse Watch S', brand: 'PULSE', cat: 'watch',
      price: 6790000, was: 0, rating: 4.7, reviews: 342, badge: '',
      desc: 'Theo dõi nhịp tim, SpO₂ và giấc ngủ. Mặt sapphire, pin 14 ngày.',
      specs: { 'Màn hình': 'AMOLED 1.43"', 'Pin': '14 ngày', 'Chống nước': '5 ATM',
               'Cảm biến': 'Nhịp tim, SpO₂, gia tốc', 'Chất liệu': 'Sapphire + titan' },
      colors: ['#0B72B5', '#2E3A36', '#C9A227'], featured: true
    },
    {
      id: 'drift-buds', name: 'Drift Buds', brand: 'NOVA Audio', cat: 'audio',
      price: 1990000, was: 2490000, rating: 4.5, reviews: 508, badge: 'Giảm giá',
      desc: 'Tai nghe true-wireless nhỏ gọn, chống nước IPX5, pin 28 giờ.',
      specs: { 'Chống ồn': 'Chủ động (ANC)', 'Pin': '28 giờ (kèm hộp)',
               'Chống nước': 'IPX5', 'Codec': 'AAC, SBC', 'Sạc': 'USB-C' },
      colors: ['#FFFFFF', '#1B2621', '#0E9F7E'], featured: false
    },
    {
      id: 'vertex-75', name: 'Vertex Key 75', brand: 'VERTEX', cat: 'home',
      price: 3450000, was: 0, rating: 4.8, reviews: 127, badge: '',
      desc: 'Bàn phím cơ 75%, switch êm, kết nối ba chế độ, vỏ nhôm CNC.',
      specs: { 'Layout': '75% (82 phím)', 'Switch': 'Tactile 45g',
               'Kết nối': 'USB-C / BT / 2.4G', 'Pin': '4000 mAh', 'Vỏ': 'Nhôm CNC' },
      colors: ['#2E3A36', '#D8D2C4', '#0B72B5'], featured: false
    },
    {
      id: 'halo-lamp', name: 'Halo Desk Lamp', brand: 'HALO', cat: 'home',
      price: 2290000, was: 2790000, rating: 4.6, reviews: 94, badge: '',
      desc: 'Đèn bàn LED nhiệt độ màu thích ứng, không nhấp nháy, CRI 95.',
      specs: { 'CRI': '95+', 'Nhiệt độ màu': '2700K – 6500K',
               'Công suất': '12 W', 'Điều khiển': 'Cảm ứng + app', 'Chân đế': 'Nhôm' },
      colors: ['#F2EFE9', '#2E3A36'], featured: false
    },
    {
      id: 'trail-22', name: 'Trail Pack 22L', brand: 'TRAIL', cat: 'gear',
      price: 2890000, was: 0, rating: 4.7, reviews: 61, badge: '',
      desc: 'Ba lô chống nước 22L, ngăn laptop 16", đệm lưng thoáng khí.',
      specs: { 'Dung tích': '22 L', 'Ngăn laptop': '16 inch',
               'Chống nước': 'Vải phủ PU', 'Trọng lượng': '980 g', 'Bảo hành': '5 năm' },
      colors: ['#2E3A36', '#0E9F7E', '#6E7B75'], featured: false
    },
    {
      id: 'lens-27', name: 'Lens 27mm f/2.8', brand: 'LUMEN', cat: 'camera',
      price: 5990000, was: 6990000, rating: 4.6, reviews: 73, badge: '',
      desc: 'Ống kính pancake 27mm f/2.8, lấy nét nhanh, chỉ 78g.',
      specs: { 'Tiêu cự': '27 mm', 'Khẩu độ': 'f/2.8 – f/16',
               'Ngàm': 'LUMEN X', 'Lấy nét': 'STM im lặng', 'Trọng lượng': '78 g' },
      colors: ['#1B2621'], featured: false
    }
  ];

  const CAT_LABEL = {
    audio: 'Âm thanh', watch: 'Đồng hồ', camera: 'Máy ảnh',
    home: 'Nhà cửa', gear: 'Phụ kiện'
  };

  const CAT_TINT = {
    audio:  ['#0E9F7E', '#0B72B5'],
    watch:  ['#0B72B5', '#0E9F7E'],
    camera: ['#0D8F9F', '#1163A8'],
    home:   ['#1F9E5E', '#0F6FB0'],
    gear:   ['#0E9F7E', '#0B72B5']
  };

  /* ------------------------------------------------------------------------
     3. SVG ART
     ------------------------------------------------------------------------ */
  const ART = {
    audio: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M14 37v-5a18 18 0 0 1 36 0v5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
      <rect x="7" y="34" width="13" height="19" rx="6" stroke="currentColor" stroke-width="2.6"/>
      <rect x="44" y="34" width="13" height="19" rx="6" stroke="currentColor" stroke-width="2.6"/>
    </svg>`,
    watch: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="18" y="15" width="28" height="34" rx="10" stroke="currentColor" stroke-width="2.6"/>
      <path d="M25 15l1.6-7h10.8L39 15M25 49l1.6 7h10.8L39 49" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M32 26v7l5 3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    camera: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="6" y="18" width="52" height="34" rx="9" stroke="currentColor" stroke-width="2.6"/>
      <path d="M22 18l4-6h12l4 6" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="32" cy="35" r="9" stroke="currentColor" stroke-width="2.6"/>
      <circle cx="48" cy="26" r="2" fill="currentColor"/>
    </svg>`,
    home: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M20 30 32 12l12 18z" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M32 30v20M22 56h20" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`,
    gear: `<svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M22 20h20a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H22a8 8 0 0 1-8-8V28a8 8 0 0 1 8-8z" stroke="currentColor" stroke-width="2.6"/>
      <path d="M22 20v-4a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v4" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M20 34h24" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
    </svg>`
  };

  const artFor = (cat) => ART[cat] || ART.gear;

  const ICON_HEART = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 20s-7.5-4.6-7.5-9.6A4.4 4.4 0 0 1 12 7.4a4.4 4.4 0 0 1 7.5 3c0 5-7.5 9.6-7.5 9.6z"
      stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  </svg>`;

  const ICON_EYE = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
      stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <circle cx="12" cy="12" r="3.2" stroke="currentColor" stroke-width="1.8"/>
  </svg>`;

  const ICON_PLUS = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
  </svg>`;

  const ICON_CART = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5.5 8h13l-1.2 11.2a2 2 0 0 1-2 1.8H8.7a2 2 0 0 1-2-1.8z"
      stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 8V6.4a3 3 0 0 1 6 0V8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>`;

  /* ------------------------------------------------------------------------
     4. STATE & PERSISTENCE
     ------------------------------------------------------------------------ */
  const PREF_DEFAULTS = {
    theme: 'light',
    accent: 'emerald',
    radius: 'soft',
    density: 'comfortable',
    motion: 'on',
    blur: 18
  };

  const STORE = {
    cart: 'aurora.cart.v1',
    wish: 'aurora.wish.v1',
    prefs: 'aurora.prefs.v1'
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) { /* ignore */ }
  }

  const state = {
    category: 'all',
    sort: 'featured',
    query: '',
    cart: read(STORE.cart, []),
    wish: read(STORE.wish, []),
    prefs: Object.assign({}, PREF_DEFAULTS, read(STORE.prefs, {}))
  };

  const productById = (id) => PRODUCTS.find((p) => p.id === id) || null;

  /* ------------------------------------------------------------------------
     5. PREFERENCES / CUSTOMIZER
     ------------------------------------------------------------------------ */
  function applyPrefs() {
    const root = document.documentElement;
    const p = state.prefs;

    root.dataset.theme = p.theme;
    root.dataset.accent = p.accent;
    root.dataset.radius = p.radius;
    root.dataset.density = p.density;
    root.dataset.motion = p.motion;
    root.style.setProperty('--glass-blur', p.blur + 'px');

    // Sync controls
    $$('[data-theme-set]').forEach((b) => {
      const on = b.dataset.themeSet === p.theme;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    $$('[data-accent-set]').forEach((b) => {
      const on = b.dataset.accentSet === p.accent;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    $$('[data-radius-set]').forEach((b) => {
      const on = b.dataset.radiusSet === p.radius;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    $$('[data-density-set]').forEach((b) => {
      const on = b.dataset.densitySet === p.density;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });
    $$('[data-motion-set]').forEach((b) => {
      const on = b.dataset.motionSet === p.motion;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', String(on));
    });

    const range = $('#blurRange');
    const out = $('#blurOut');
    if (range) range.value = p.blur;
    if (out) out.textContent = p.blur + 'px';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', p.theme === 'dark' ? '#08130F' : '#0E9F7E');
  }

  function setPref(key, value) {
    state.prefs[key] = value;
    write(STORE.prefs, state.prefs);
    applyPrefs();
  }

  function resetPrefs() {
    state.prefs = Object.assign({}, PREF_DEFAULTS);
    write(STORE.prefs, state.prefs);
    applyPrefs();
    toast('Đã khôi phục giao diện mặc định');
  }

  /* ------------------------------------------------------------------------
     6. TOASTS
     ------------------------------------------------------------------------ */
  function toast(message, variant) {
    const host = $('#toasts');
    if (!host) return;

    const el = document.createElement('div');
    el.className = 'toast' + (variant ? ' toast--' + variant : '');
    el.innerHTML = `<span class="toast__dot" aria-hidden="true"></span><span>${esc(message)}</span>`;
    host.appendChild(el);

    window.setTimeout(() => {
      el.classList.add('is-out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, 2600);
  }

  /* ------------------------------------------------------------------------
     7. PRODUCT RENDERING
     ------------------------------------------------------------------------ */
  function visibleProducts() {
    const q = state.query.trim().toLowerCase();

    let list = PRODUCTS.filter((p) => {
      if (state.category !== 'all' && p.cat !== state.category) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (CAT_LABEL[p.cat] || '').toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
      );
    });

    switch (state.sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
    }
    return list;
  }

  function cardMarkup(p) {
    const tint = CAT_TINT[p.cat] || CAT_TINT.gear;
    const wished = state.wish.includes(p.id);
    const inCart = state.cart.some((i) => i.id === p.id);

    return `
      <article class="card glass" data-id="${p.id}"
               style="--tint-1:${tint[0]};--tint-2:${tint[1]}">

        <div class="card__media">
          ${p.badge ? `<span class="card__badge">${esc(p.badge)}</span>` : ''}
          <button class="card__wish${wished ? ' is-on' : ''}" type="button"
                  data-wish="${p.id}"
                  aria-pressed="${wished}"
                  aria-label="${wished ? 'Bỏ khỏi' : 'Thêm vào'} yêu thích: ${esc(p.name)}">
            ${ICON_HEART}
          </button>
          <span class="card__art">${artFor(p.cat)}</span>
        </div>

        <div class="card__body">
          <p class="card__brand">${esc(p.brand)}</p>
          <h3 class="card__name">${esc(p.name)}</h3>

          <p class="card__rating">
            <span class="star" aria-hidden="true">★</span>
            <span>${p.rating.toFixed(1)}</span>
            <span>· ${p.reviews} đánh giá</span>
          </p>

          <p class="card__desc">${esc(p.desc)}</p>

          ${p.colors.length > 1 ? `
            <div class="card__colors" aria-label="Màu có sẵn">
              ${p.colors.map((c) => `<i style="background:${c}"></i>`).join('')}
            </div>` : ''}

          <div class="card__foot">
            <div class="price">
              <span class="price__now">${money(p.price)}</span>
              ${p.was ? `<span class="price__old">${money(p.was)}</span>` : ''}
            </div>
            <div class="card__actions">
              <button class="icon-btn" type="button" data-quick="${p.id}"
                      aria-label="Xem nhanh: ${esc(p.name)}">${ICON_EYE}</button>
              <button class="btn btn--primary btn--add" type="button" data-add="${p.id}">
                ${inCart ? 'Đã thêm' : 'Thêm'}
              </button>
            </div>
          </div>
        </div>
      </article>`;
  }

  function renderGrid() {
    const grid = $('#productGrid');
    const empty = $('#emptyState');
    const count = $('#resultCount');
    if (!grid) return;

    const list = visibleProducts();

    grid.innerHTML = list.map(cardMarkup).join('');
    if (empty) empty.hidden = list.length !== 0;
    if (count) count.textContent = list.length + ' sản phẩm';
  }

  /* ------------------------------------------------------------------------
     8. CART
     ------------------------------------------------------------------------ */
  function addToCart(id, qty) {
    const p = productById(id);
    if (!p) return;

    const n = qty || 1;
    const line = state.cart.find((i) => i.id === id);

    if (line) line.qty = clamp(line.qty + n, 1, 99);
    else state.cart.push({ id, qty: clamp(n, 1, 99) });

    write(STORE.cart, state.cart);
    renderCart();
    renderGrid();
    toast(`Đã thêm "${p.name}" vào giỏ`);
  }

  function setQty(id, delta) {
    const line = state.cart.find((i) => i.id === id);
    if (!line) return;

    line.qty = clamp(line.qty + delta, 1, 99);
    write(STORE.cart, state.cart);
    renderCart();
  }

  function removeFromCart(id) {
    const p = productById(id);
    state.cart = state.cart.filter((i) => i.id !== id);
    write(STORE.cart, state.cart);
    renderCart();
    renderGrid();
    if (p) toast(`Đã xoá "${p.name}" khỏi giỏ`);
  }

  function cartTotals() {
    let count = 0, subtotal = 0;
    state.cart.forEach((line) => {
      const p = productById(line.id);
      if (!p) return;
      count += line.qty;
      subtotal += p.price * line.qty;
    });
    return { count, subtotal };
  }

  function renderCart() {
    const body = $('#cartBody');
    const badge = $('#cartCount');
    const sub = $('#cartSubtotal');
    if (!body) return;

    const { count, subtotal } = cartTotals();

    if (badge) {
      badge.hidden = count === 0;
      badge.textContent = String(count);
    }
    if (sub) sub.textContent = money(subtotal);

    if (!state.cart.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <span class="cart-empty__ico">${ICON_CART}</span>
          <h3>Giỏ hàng đang trống</h3>
          <p>Thêm sản phẩm để bắt đầu đơn hàng của bạn.</p>
        </div>`;
      return;
    }

    body.innerHTML = state.cart.map((line) => {
      const p = productById(line.id);
      if (!p) return '';
      const tint = CAT_TINT[p.cat] || CAT_TINT.gear;

      return `
        <div class="cart-item" style="--tint-1:${tint[0]}">
          <div class="cart-item__media">${artFor(p.cat)}</div>
          <div class="cart-item__info">
            <p class="cart-item__brand">${esc(p.brand)}</p>
            <h3 class="cart-item__name">${esc(p.name)}</h3>
            <div class="cart-item__row">
              <div class="qty">
                <button type="button" data-qty="-1" data-id="${p.id}"
                        aria-label="Giảm số lượng ${esc(p.name)}">−</button>
                <span aria-live="polite">${line.qty}</span>
                <button type="button" data-qty="1" data-id="${p.id}"
                        aria-label="Tăng số lượng ${esc(p.name)}">+</button>
              </div>
              <strong>${money(p.price * line.qty)}</strong>
            </div>
          </div>
          <button class="cart-item__remove" type="button" data-remove="${p.id}"
                  aria-label="Xoá ${esc(p.name)} khỏi giỏ">×</button>
        </div>`;
    }).join('');
  }

  /* ------------------------------------------------------------------------
     9. WISHLIST
     ------------------------------------------------------------------------ */
  function toggleWish(id) {
    const p = productById(id);
    if (!p) return;

    const idx = state.wish.indexOf(id);
    if (idx > -1) {
      state.wish.splice(idx, 1);
      toast(`Đã bỏ "${p.name}" khỏi yêu thích`);
    } else {
      state.wish.push(id);
      toast(`Đã lưu "${p.name}" vào yêu thích`);
    }

    write(STORE.wish, state.wish);
    renderWishCount();
    renderGrid();
    if ($('#quickView').classList.contains('is-open')) renderQuickView(id);
  }

  function renderWishCount() {
    const badge = $('#wishCount');
    if (!badge) return;
    badge.hidden = state.wish.length === 0;
    badge.textContent = String(state.wish.length);
  }

  /* ------------------------------------------------------------------------
     10. QUICK VIEW
     ------------------------------------------------------------------------ */
  function renderQuickView(id) {
    const p = productById(id);
    const host = $('#qvContent');
    if (!p || !host) return;

    const tint = CAT_TINT[p.cat] || CAT_TINT.gear;
    const wished = state.wish.includes(p.id);

    host.innerHTML = `
      <div class="qv-visual" style="--tint-1:${tint[0]};--tint-2:${tint[1]}">
        ${artFor(p.cat)}
      </div>

      <div class="qv-body">
        <span class="eyebrow">${esc(p.brand)} · ${esc(CAT_LABEL[p.cat] || '')}</span>
        <h2 id="qvTitle">${esc(p.name)}</h2>

        <p class="card__rating">
          <span class="star" aria-hidden="true">★</span>
          <span>${p.rating.toFixed(1)}</span>
          <span>· ${p.reviews} đánh giá</span>
        </p>

        <p class="qv-desc" style="margin-top:12px">${esc(p.desc)}</p>

        <ul class="qv-specs">
          ${Object.entries(p.specs).map(
            ([k, v]) => `<li><span>${esc(k)}</span><strong>${esc(v)}</strong></li>`
          ).join('')}
        </ul>

        <div class="qv-foot">
          <div class="price price--lg">
            <span class="price__now">${money(p.price)}</span>
            ${p.was ? `<span class="price__old">${money(p.was)}</span>` : ''}
          </div>

          <div style="display:flex;gap:8px">
            <button class="icon-btn icon-btn--ghost${wished ? ' is-on' : ''}"
                    type="button" data-wish="${p.id}"
                    aria-pressed="${wished}"
                    aria-label="${wished ? 'Bỏ khỏi' : 'Thêm vào'} yêu thích"
                    style="${wished ? 'color:#E5484D;border-color:#E5484D' : ''}">
              ${ICON_HEART}
            </button>
            <button class="btn btn--primary" type="button" data-add="${p.id}">
              ${ICON_PLUS} Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>`;
  }

  /* ------------------------------------------------------------------------
     11. LAYER CONTROL (drawer / modal / customizer / scrim)
     ------------------------------------------------------------------------ */
  const scrim = $('#scrim');
  let lastFocus = null;
  let openLayers = 0;

  function lockScroll(lock) {
    document.body.classList.toggle('is-locked', lock);
  }

  function syncScrim() {
    if (!scrim) return;
    if (openLayers > 0) {
      scrim.hidden = false;
      requestAnimationFrame(() => scrim.classList.add('is-open'));
    } else {
      scrim.classList.remove('is-open');
      window.setTimeout(() => {
        if (openLayers === 0) scrim.hidden = true;
      }, 260);
    }
    lockScroll(openLayers > 0);
  }

  function openLayer(el, trigger) {
    if (!el) return;
    lastFocus = trigger || document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    openLayers += 1;
    syncScrim();

    const focusable = el.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) window.setTimeout(() => focusable.focus(), 60);
  }

  function closeLayer(el) {
    if (!el || !el.classList.contains('is-open')) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    openLayers = Math.max(0, openLayers - 1);
    syncScrim();

    if (openLayers === 0 && lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  }

  function closeAllLayers() {
    $$('.drawer.is-open, .modal.is-open, .customizer.is-open').forEach(closeLayer);
  }

  /* ------------------------------------------------------------------------
     12. UI WIRING
     ------------------------------------------------------------------------ */
  function initHeader() {
    const header = $('#header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initNav() {
    const toggle = $('#navToggle');
    const nav = $('#primaryNav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', (e) => {
      if (e.target.closest('.nav__link')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Scroll-spy for nav links
    const links = $$('.nav__link');
    const sections = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = '#' + entry.target.id;
          links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === id));
        });
      }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

      sections.forEach((s) => io.observe(s));
    }
  }

  function initSearch() {
    const toggle = $('#searchToggle');
    const panel = $('#searchPanel');
    const input = $('#searchInput');
    const close = $('#searchClose');
    if (!toggle || !panel) return;

    const open = () => {
      panel.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
      window.setTimeout(() => input && input.focus(), 40);
    };
    const shut = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      if (input) input.value = '';
      state.query = '';
      renderGrid();
    };

    toggle.addEventListener('click', () => {
      panel.hidden ? open() : shut();
    });
    if (close) close.addEventListener('click', shut);

    if (input) {
      let t;
      input.addEventListener('input', () => {
        window.clearTimeout(t);
        t = window.setTimeout(() => {
          state.query = input.value;
          renderGrid();
        }, 140);
      });
    }
  }

  function initFilters() {
    $$('.chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.chip-btn').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        state.category = btn.dataset.cat;
        renderGrid();
      });
    });

    const sort = $('#sortSelect');
    if (sort) {
      sort.addEventListener('change', () => {
        state.sort = sort.value;
        renderGrid();
      });
    }

    const clear = $('#clearFilters');
    if (clear) {
      clear.addEventListener('click', () => {
        state.category = 'all';
        state.sort = 'featured';
        state.query = '';
        if ($('#searchInput')) $('#searchInput').value = '';
        if (sort) sort.value = 'featured';
        $$('.chip-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.cat === 'all'));
        renderGrid();
      });
    }

    // Collection cards jump to a category
    $$('[data-jump]').forEach((el) => {
      el.addEventListener('click', () => {
        const cat = el.dataset.jump;
        state.category = cat;
        $$('.chip-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.cat === cat));
        renderGrid();
      });
    });
  }

  function initDelegatedClicks() {
    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('[data-add]');
      if (addBtn) {
        e.preventDefault();
        addToCart(addBtn.dataset.add, 1);
        return;
      }

      const wishBtn = e.target.closest('[data-wish]');
      if (wishBtn) {
        e.preventDefault();
        toggleWish(wishBtn.dataset.wish);
        return;
      }

      const quickBtn = e.target.closest('[data-quick]');
      if (quickBtn) {
        e.preventDefault();
        renderQuickView(quickBtn.dataset.quick);
        openLayer($('#quickView'), quickBtn);
        return;
      }

      const qtyBtn = e.target.closest('[data-qty]');
      if (qtyBtn) {
        e.preventDefault();
        setQty(qtyBtn.dataset.id, Number(qtyBtn.dataset.qty));
        return;
      }

      const rmBtn = e.target.closest('[data-remove]');
      if (rmBtn) {
        e.preventDefault();
        removeFromCart(rmBtn.dataset.remove);
      }
    });
  }

  function initDrawers() {
    const cartBtn = $('#cartBtn');
    const cartDrawer = $('#cartDrawer');
    const cartClose = $('#cartClose');

    if (cartBtn && cartDrawer) {
      cartBtn.addEventListener('click', () => openLayer(cartDrawer, cartBtn));
    }
    if (cartClose) cartClose.addEventListener('click', () => closeLayer(cartDrawer));

    const czBtn = $('#customizeBtn');
    const cz = $('#customizer');
    const czClose = $('#czClose');
    const czReset = $('#czReset');

    if (czBtn && cz) czBtn.addEventListener('click', () => openLayer(cz, czBtn));
    if (czClose) czClose.addEventListener('click', () => closeLayer(cz));
    if (czReset) czReset.addEventListener('click', resetPrefs);

    // Quick view close
    const qv = $('#quickView');
    const qvClose = $('#qvClose');
    if (qvClose) qvClose.addEventListener('click', () => closeLayer(qv));
    if (qv) {
      qv.addEventListener('click', (e) => {
        if (e.target === qv) closeLayer(qv);
      });
    }

    if (scrim) scrim.addEventListener('click', closeAllLayers);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const nav = $('#primaryNav');
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          $('#navToggle').setAttribute('aria-expanded', 'false');
        }
        closeAllLayers();
      }
    });

    // Checkout (mock — no real payment)
    const checkout = $('#checkoutBtn');
    if (checkout) {
      checkout.addEventListener('click', () => {
        if (!state.cart.length) {
          toast('Giỏ hàng đang trống', 'warn');
          return;
        }
        toast('Bản demo: chưa kết nối cổng thanh toán', 'warn');
      });
    }
  }

  function initCustomizerControls() {
    $$('[data-theme-set]').forEach((b) =>
      b.addEventListener('click', () => setPref('theme', b.dataset.themeSet)));

    $$('[data-accent-set]').forEach((b) =>
      b.addEventListener('click', () => setPref('accent', b.dataset.accentSet)));

    $$('[data-radius-set]').forEach((b) =>
      b.addEventListener('click', () => setPref('radius', b.dataset.radiusSet)));

    $$('[data-density-set]').forEach((b) =>
      b.addEventListener('click', () => setPref('density', b.dataset.densitySet)));

    $$('[data-motion-set]').forEach((b) =>
      b.addEventListener('click', () => setPref('motion', b.dataset.motionSet)));

    const range = $('#blurRange');
    const out = $('#blurOut');
    if (range) {
      range.addEventListener('input', () => {
        const v = Number(range.value);
        if (out) out.textContent = v + 'px';
        state.prefs.blur = v;
        document.documentElement.style.setProperty('--glass-blur', v + 'px');
      });
      range.addEventListener('change', () => {
        write(STORE.prefs, state.prefs);
      });
    }
  }

  function initThemeToggle() {
    const btn = $('#themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      setPref('theme', state.prefs.theme === 'dark' ? 'light' : 'dark');
    });
  }

  function initWishButton() {
    const btn = $('#wishBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (!state.wish.length) {
        toast('Chưa có sản phẩm nào trong danh sách yêu thích');
        return;
      }
      state.category = 'all';
      state.query = '';
      state.sort = 'featured';
      if ($('#searchInput')) $('#searchInput').value = '';
      if ($('#sortSelect')) $('#sortSelect').value = 'featured';
      $$('.chip-btn').forEach((b) => b.classList.toggle('is-active', b.dataset.cat === 'all'));

      const grid = $('#productGrid');
      if (grid) {
        grid.innerHTML = state.wish
          .map((id) => productById(id))
          .filter(Boolean)
          .map(cardMarkup)
          .join('');
        $('#emptyState').hidden = state.wish.length !== 0;
        $('#resultCount').textContent = state.wish.length + ' sản phẩm yêu thích';
      }
      document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    });
  }

  function initNewsletter() {
    const form = $('#newsletterForm');
    const input = $('#newsletterEmail');
    const error = $('#newsletterError');
    if (!form || !input) return;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = input.value.trim();

      if (!EMAIL_RE.test(value)) {
        input.setAttribute('aria-invalid', 'true');
        if (error) {
          error.textContent = 'Vui lòng nhập địa chỉ email hợp lệ.';
          error.hidden = false;
        }
        input.focus();
        return;
      }

      input.removeAttribute('aria-invalid');
      if (error) error.hidden = true;
      form.reset();
      toast('Đã đăng ký (bản demo — email không được gửi đi)');
    });

    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true' && EMAIL_RE.test(input.value.trim())) {
        input.removeAttribute('aria-invalid');
        if (error) error.hidden = true;
      }
    });
  }

  function initYear() {
    const y = $('#year');
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (state.prefs.motion === 'off') return;

    const targets = $$('.section, .card, .coll, .spotlight, .newsletter');
    targets.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity .6s cubic-bezier(.16,1,.3,1), transform .6s cubic-bezier(.16,1,.3,1)';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity = '';
        el.style.transform = '';
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    targets.forEach((el) => io.observe(el));
  }

  /* ------------------------------------------------------------------------
     13. INIT
     ------------------------------------------------------------------------ */
  function init() {
    applyPrefs();
    renderCart();
    renderWishCount();
    renderGrid();

    initHeader();
    initNav();
    initSearch();
    initFilters();
    initDelegatedClicks();
    initDrawers();
    initCustomizerControls();
    initThemeToggle();
    initWishButton();
    initNewsletter();
    initYear();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
