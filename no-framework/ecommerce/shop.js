// Consolidated shop JS — cart, quickview, search, toast
document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.getElementById('cart-button');
  const closeCart = document.getElementById('close-cart');
  const clearCart = document.getElementById('clear-cart');
  const checkout = document.getElementById('checkout');
  const cartBg = document.getElementById('cart-bg');
  const search = document.getElementById('search');

  // navbar burger
  document.querySelectorAll('.navbar-burger').forEach(b => {
    b.addEventListener('click', () => {
      const target = document.getElementById(b.dataset.target);
      b.classList.toggle('is-active');
      if (target) target.classList.toggle('is-active');
    });
  });

  // search filter
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('.product').forEach(card => {
        const name = (card.dataset.name || '').toLowerCase();
        card.parentElement.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  // delegated click handling for quick-view and add-to-cart
  document.addEventListener('click', (e) => {
    const qbtn = e.target.closest('.quick-view');
    if (qbtn) { openQuickView(qbtn.dataset.id || qbtn.getAttribute('data-id')); return; }
    const add = e.target.closest('.add-to-cart');
    if (add) {
      const card = add.closest('.card');
      const id = card.dataset.id; const name = card.dataset.name; const price = parseFloat(card.dataset.price);
      addToCart({ id, name, price, qty: 1 });
      showToast(`${name} added to cart`);
      animateCartCount();
      return;
    }
  });

  cartButton.addEventListener('click', showCart);
  closeCart.addEventListener('click', () => toggleModal(false));
  clearCart.addEventListener('click', () => { localStorage.removeItem('cart'); renderCart(); toggleModal(false); });
  checkout.addEventListener('click', () => { alert('Checkout placeholder — integrate payment here.'); });
  if (cartBg) cartBg.addEventListener('click', () => toggleModal(false));

  renderCart();
});

/* storage helpers */
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty += item.qty; else cart.push(item);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-count'); if (el) el.textContent = count;
}

function animateCartCount() {
  const el = document.getElementById('cart-count'); if (!el) return;
  el.classList.remove('pulse'); void el.offsetWidth; el.classList.add('pulse');
}

function renderCart() {
  updateCartCount();
  const itemsEl = document.getElementById('cart-items'); const totalEl = document.getElementById('cart-total'); const cart = getCart();
  if (!itemsEl) return; itemsEl.innerHTML = '';
  if (cart.length === 0) { itemsEl.innerHTML = '<p>Your cart is empty.</p>'; totalEl.textContent = '0.00'; return; }
  const list = document.createElement('div');
  cart.forEach(item => {
    const row = document.createElement('div'); row.className = 'box';
    row.innerHTML = `
      <div class="level">
        <div class="level-left"><div class="level-item"><div><strong>${escapeHtml(item.name)}</strong><div class="is-size-7">$${item.price.toFixed(2)}</div></div></div></div>
        <div class="level-right"><div class="level-item"><div class="buttons has-addons"><button class="button is-small qty-decrease">-</button><button class="button is-small is-light qty-count">${item.qty}</button><button class="button is-small qty-increase">+</button><button class="button is-small is-danger remove-item">Remove</button></div></div></div>
      </div>`;
    row.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
    row.querySelector('.qty-increase').addEventListener('click', () => changeQty(item.id, 1));
    row.querySelector('.qty-decrease').addEventListener('click', () => changeQty(item.id, -1));
    list.appendChild(row);
  });
  itemsEl.appendChild(list);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0); totalEl.textContent = total.toFixed(2);
}

function removeFromCart(id) { let cart = getCart(); cart = cart.filter(i => i.id !== id); saveCart(cart); renderCart(); }
function changeQty(id, delta) { const cart = getCart(); const item = cart.find(i => i.id === id); if (!item) return; item.qty += delta; if (item.qty <= 0) { const idx = cart.findIndex(i => i.id === id); cart.splice(idx,1); } saveCart(cart); renderCart(); }

function toggleModal(show) { const modal = document.getElementById('cart-modal'); if (!modal) return; modal.classList.toggle('is-active', show); }
function showCart() { renderCart(); toggleModal(true); }

function escapeHtml(text) { return (text||'').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* Quick view modal */
function openQuickView(id) {
  const product = document.querySelector(`.product[data-id="${id}"]`); if (!product) return;
  const name = product.dataset.name; const price = product.dataset.price; const img = product.querySelector('img')?.src || ''; const desc = product.querySelector('.content')?.textContent || '';
  const modal = document.getElementById('quickview-modal'); if (!modal) return;
  modal.querySelector('.quick-title').textContent = name; modal.querySelector('.quick-price').textContent = `$${parseFloat(price).toFixed(2)}`; modal.querySelector('.quick-desc').textContent = desc; modal.querySelector('.quick-img').src = img; modal.classList.add('is-active');
  modal.querySelector('.quick-add').onclick = () => { addToCart({ id, name, price: parseFloat(price), qty: 1}); showToast(`${name} added to cart`); animateCartCount(); };
  modal.querySelector('.quick-close').onclick = () => modal.classList.remove('is-active');
}

/* Toast */
function showToast(msg, timeout = 1400) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); requestAnimationFrame(()=>t.classList.add('visible')); setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=>t.remove(),260); }, timeout); }

/* Cart storage */
function getCart() { return JSON.parse(localStorage.getItem('cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('cart', JSON.stringify(cart)); }

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty += item.qty; else cart.push(item);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

function renderCart() {
  updateCartCount();
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const cart = getCart();
  if (!itemsEl) return;
  itemsEl.innerHTML = '';
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '0.00';
    return;
  }
  const list = document.createElement('div');
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'box';
    row.innerHTML = `
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <div class="is-size-7">$${item.price.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons has-addons">
              <button class="button is-small qty-decrease">-</button>
              <button class="button is-small is-light qty-count">${item.qty}</button>
              <button class="button is-small qty-increase">+</button>
              <button class="button is-small is-danger remove-item">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
    row.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
    row.querySelector('.qty-increase').addEventListener('click', () => changeQty(item.id, 1));
    row.querySelector('.qty-decrease').addEventListener('click', () => changeQty(item.id, -1));
    list.appendChild(row);
  });
  itemsEl.appendChild(list);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = total.toFixed(2);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const idx = cart.findIndex(i => i.id === id);
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
}

function toggleModal(show) {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;
  modal.classList.toggle('is-active', show);
}

function showCart() { renderCart(); }

function escapeHtml(text) { return (text||'').replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* Quick view modal */
function openQuickView(id) {
  const product = document.querySelector(`.product[data-id="${id}"]`);
  if (!product) return;
  const name = product.dataset.name;
  const price = product.dataset.price;
  const img = product.querySelector('img')?.src || '';
  const desc = product.querySelector('.content')?.textContent || '';
  let modal = document.getElementById('quickview-modal');
  if (!modal) return;
  modal.querySelector('.quick-title').textContent = name;
  modal.querySelector('.quick-price').textContent = `$${parseFloat(price).toFixed(2)}`;
  modal.querySelector('.quick-desc').textContent = desc;
  modal.querySelector('.quick-img').src = img;
  modal.classList.add('is-active');
  // add-to-cart in quickview
  modal.querySelector('.quick-add').onclick = () => { addToCart({ id, name, price: parseFloat(price), qty: 1 }); showToast(`${name} added to cart`); };
  modal.querySelector('.quick-close').onclick = () => modal.classList.remove('is-active');
}

/* Toast */
function showToast(msg, timeout = 1600) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => t.classList.add('visible'));
  setTimeout(() => { t.classList.remove('visible'); setTimeout(() => t.remove(), 300); }, timeout);
}
document.addEventListener('DOMContentLoaded', () => {
  const cartButton = document.getElementById('cart-button');
  const closeCart = document.getElementById('close-cart');
  const clearCart = document.getElementById('clear-cart');
  const checkout = document.getElementById('checkout');
  const cartBg = document.getElementById('cart-bg');
  const search = document.getElementById('search');

  // navbar burger
  document.querySelectorAll('.navbar-burger').forEach(b => {
    b.addEventListener('click', () => {
      const target = document.getElementById(b.dataset.target);
      b.classList.toggle('is-active');
      if (target) target.classList.toggle('is-active');
    });
  });

  // search filter
  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      document.querySelectorAll('.product').forEach(card => {
        const name = card.dataset.name.toLowerCase();
        card.parentElement.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.card');
      const id = card.dataset.id;
      const name = card.dataset.name;
      const price = parseFloat(card.dataset.price);
      addToCart({ id, name, price, qty: 1 });
    });
  });

  cartButton.addEventListener('click', showCart);
  closeCart.addEventListener('click', () => toggleModal(false));
  clearCart.addEventListener('click', () => { localStorage.removeItem('cart'); renderCart(); toggleModal(false); });
  checkout.addEventListener('click', () => { alert('Checkout placeholder — integrate payment here.'); });
  if (cartBg) cartBg.addEventListener('click', () => toggleModal(false));

  renderCart();
});

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty += 1; else cart.push(item);
  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
}

function renderCart() {
  updateCartCount();
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const cart = getCart();
  if (!itemsEl) return;
  itemsEl.innerHTML = '';
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = '0.00';
    return;
  }
  const list = document.createElement('div');
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'box';
    row.innerHTML = `
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <div>
              <strong>${escapeHtml(item.name)}</strong>
              <div class="is-size-7">$${item.price.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <div class="buttons has-addons">
              <button class="button is-small qty-decrease">-</button>
              <button class="button is-small is-light qty-count">${item.qty}</button>
              <button class="button is-small qty-increase">+</button>
              <button class="button is-small is-danger remove-item">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
    row.querySelector('.remove-item').addEventListener('click', () => removeFromCart(item.id));
    row.querySelector('.qty-increase').addEventListener('click', () => changeQty(item.id, 1));
    row.querySelector('.qty-decrease').addEventListener('click', () => changeQty(item.id, -1));
    list.appendChild(row);
  });
  itemsEl.appendChild(list);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.textContent = total.toFixed(2);
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    const idx = cart.findIndex(i => i.id === id);
    cart.splice(idx, 1);
  }
  saveCart(cart);
  renderCart();
}

function toggleModal(show) {
  const modal = document.getElementById('cart-modal');
  if (!modal) return;
  modal.classList.toggle('is-active', show);
}

function showCart() {
  renderCart();
}

function escapeHtml(text) {
  return text.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
