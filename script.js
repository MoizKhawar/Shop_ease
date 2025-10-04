// --- Checkout Page Logic ---
function renderCheckoutCart() {
  const cart = getCartItems();
  const cartContainer = document.getElementById('checkout-cart-container');
  if (!cartContainer) return;
  let cartRows = '';
  let total = 0;
  let hasItems = false;
  for (const [id, qty] of Object.entries(cart)) {
    const product = products.find(p => p.id == id);
    if (!product) continue;
    hasItems = true;
    const itemTotal = product.price * qty;
    total += itemTotal;
    cartRows += `
      <tr>
        <td><img src="${product.image}" alt="${product.title}"></td>
        <td>${product.title}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${qty}</td>
        <td>$${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }
  if (!hasItems) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('checkout-total').textContent = '0.00';
    document.getElementById('checkout-form').style.display = 'none';
    return;
  }
  cartContainer.innerHTML = `
    <table class="checkout-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${cartRows}
      </tbody>
    </table>
  `;
  document.getElementById('checkout-total').textContent = total.toFixed(2);
}

function setupCheckoutPage() {
  renderCheckoutCart();
  const form = document.getElementById('checkout-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const address = document.getElementById('delivery-address').value.trim();
    const contact = document.getElementById('contact-number').value.trim();
    if (!address || !contact) {
      alert('Please fill in all delivery details.');
      return;
    }
    // Place order: clear cart, show confirmation
    localStorage.removeItem('cartItems');
    setCartCount(0);
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('checkout-cart-container').style.display = 'none';
    document.querySelector('.checkout-total').style.display = 'none';
    document.getElementById('order-confirmation').style.display = 'block';
    document.getElementById('order-confirmation').textContent = 'Thank you! Your order has been placed.';
  });
}
// --- Registration Page Logic ---
function validateRegistration(name, email, password, confirm) {
  if (!name || !email || !password || !confirm) {
    return { success: false, message: 'Please fill in all fields.' };
  }
  // Simple email regex
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }
  if (password !== confirm) {
    return { success: false, message: 'Passwords do not match.' };
  }
  return { success: true };
}

function setupRegisterPage() {
  const form = document.getElementById('register-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    const result = validateRegistration(name, email, password, confirm);
    if (result.success) {
      alert('Registration successful!');
      // Optionally redirect or set login state here
    } else {
      alert(result.message);
    }
  });
  document.getElementById('login-link').addEventListener('click', function(e) {
    // Allow default navigation
  });
}
// --- Login Page Logic ---
function validateLogin(email, password) {
  // Simple validation: check not empty and fake credentials
  if (!email || !password) return { success: false, message: 'Please fill in all fields.' };
  // Demo: accept any email/password, but show error for a specific case
  if (email === 'fail' || password === 'fail') {
    return { success: false, message: 'Invalid credentials.' };
  }
  return { success: true };
}

function setupLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const result = validateLogin(email, password);
    if (result.success) {
      alert('Login successful!');
      // Optionally redirect or set login state here
    } else {
      alert(result.message);
    }
  });
  document.getElementById('register-link').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Registration page not implemented in this demo.');
  });
}
// --- Cart Utilities ---
function getCartItems() {
  // Cart is stored as { id: quantity, ... }
  return JSON.parse(localStorage.getItem('cartItems') || '{}');
}
function setCartItems(cart) {
  localStorage.setItem('cartItems', JSON.stringify(cart));
  setCartCount(Object.values(cart).reduce((a, b) => a + b, 0));
}
function addToCart(productId) {
  let cart = getCartItems();
  cart[productId] = (cart[productId] || 0) + 1;
  setCartItems(cart);
}
function removeFromCart(productId) {
  let cart = getCartItems();
  delete cart[productId];
  setCartItems(cart);
}
function updateCartQty(productId, qty) {
  let cart = getCartItems();
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  setCartItems(cart);
}

// --- Render Cart Page ---
function renderCartPage() {
  const cart = getCartItems();
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;
  let cartRows = '';
  let total = 0;
  let hasItems = false;
  for (const [id, qty] of Object.entries(cart)) {
    const product = products.find(p => p.id == id);
    if (!product) continue;
    hasItems = true;
    const itemTotal = product.price * qty;
    total += itemTotal;
    cartRows += `
      <tr>
        <td><img src="${product.image}" alt="${product.title}"></td>
        <td>${product.title}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td><input type="number" min="1" class="cart-qty-input" data-id="${product.id}" value="${qty}"></td>
        <td>$${itemTotal.toFixed(2)}</td>
        <td><button class="remove-btn" data-id="${product.id}">Remove</button></td>
      </tr>
    `;
  }
  if (!hasItems) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    document.getElementById('cart-total').textContent = '0.00';
    return;
  }
  cartContainer.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${cartRows}
      </tbody>
    </table>
  `;
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// --- Cart Page Event Listeners ---
function setupCartPageEvents() {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;
  cartContainer.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) {
      const id = e.target.getAttribute('data-id');
      removeFromCart(id);
      renderCartPage();
    }
  });
  cartContainer.addEventListener('change', e => {
    if (e.target.classList.contains('cart-qty-input')) {
      const id = e.target.getAttribute('data-id');
      let qty = parseInt(e.target.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      updateCartQty(id, qty);
      renderCartPage();
    }
  });
  document.getElementById('checkout-btn').addEventListener('click', () => {
    alert('Checkout is not implemented in this demo.');
  });
}
// script.js - E-Commerce Homepage Logic

// Expanded product list with categories for product listing page
const products = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    category: "audio"
  },
  {
    id: 2,
    title: "Smart Watch",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    category: "wearables"
  },
  {
    id: 3,
    title: "Bluetooth Speaker",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    category: "audio"
  },
  {
    id: 4,
    title: "Fitness Tracker",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    category: "wearables"
  },
  {
    id: 5,
    title: "VR Headset",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
    category: "gadgets"
  },
  {
    id: 6,
    title: "Portable Charger",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=400&q=80",
    category: "gadgets"
  },
  {
    id: 7,
    title: "Noise Cancelling Earbuds",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1512499617640-c2f999098c67?auto=format&fit=crop&w=400&q=80",
    category: "audio"
  },
  {
    id: 8,
    title: "Smart Glasses",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    category: "wearables"
  },
  {
    id: 9,
    title: "Action Camera",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b43?auto=format&fit=crop&w=400&q=80",
    category: "gadgets"
  },
  {
    id: 10,
    title: "Wireless Charger",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=400&q=80",
    category: "gadgets"
  },
  {
    id: 11,
    title: "Fitness Earbuds",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    category: "audio"
  },
  {
    id: 12,
    title: "Smart Band",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    category: "wearables"
  }
];


// Render products for homepage (first 6 featured)
function renderProducts() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  grid.innerHTML = '';
  products.slice(0, 6).forEach(product => {
    grid.appendChild(createProductCard(product));
  });
}

// Render products for product listing page (with filter/search)
function renderProductListing(filteredProducts) {
  const grid = document.getElementById('listing-grid');
  if (!grid) return;
  grid.innerHTML = '';
  (filteredProducts || products).forEach(product => {
    grid.appendChild(createProductCard(product));
  });
}

function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <div class="product-title">${product.title}</div>
    <div class="product-price">$${product.price.toFixed(2)}</div>
    <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
  `;
  return card;
}

function getCartCount() {
  return parseInt(localStorage.getItem('cartCount') || '0', 10);
}

function setCartCount(count) {
  localStorage.setItem('cartCount', count);
  document.getElementById('cart-count').textContent = count;
}

function addToCart(productId) {
  let count = getCartCount();
  setCartCount(count + 1);
}

// ...existing code...

document.addEventListener('DOMContentLoaded', () => {
  setCartCount(getCartCount());

  // Homepage featured products
  if (document.querySelector('.featured-products')) {
    renderProducts();
    document.querySelector('.products-grid').addEventListener('click', e => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const id = e.target.getAttribute('data-id');
        addToCart(id);
      }
    });
  }

  // Product listing page
  if (document.getElementById('listing-grid')) {
    renderProductListing();
    document.getElementById('listing-grid').addEventListener('click', e => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        const id = e.target.getAttribute('data-id');
        addToCart(id);
      }
    });

    // Filter and search logic
    const categoryFilter = document.getElementById('category-filter');
    const searchBar = document.getElementById('search-bar');
    function filterProducts() {
      const category = categoryFilter.value;
      const search = searchBar.value.trim().toLowerCase();
      let filtered = products.filter(p => {
        const matchCategory = category === 'all' || p.category === category;
        const matchSearch = p.title.toLowerCase().includes(search);
        return matchCategory && matchSearch;
      });
      renderProductListing(filtered);
    }
    categoryFilter.addEventListener('change', filterProducts);
    searchBar.addEventListener('input', filterProducts);
  }

  // Cart page
  if (document.getElementById('cart-container')) {
    renderCartPage();
    setupCartPageEvents();
  }

  // Login page
  if (document.getElementById('login-form')) {
    setupLoginPage();
  }

  // Registration page
  if (document.getElementById('register-form')) {
    setupRegisterPage();
  }

  // Checkout page
  if (document.getElementById('checkout-form')) {
    setupCheckoutPage();
  }
});
