/**
 * WanderWise - Authentication & User Dashboard Module
 * Demo Authentication stored in localStorage (wanderwise_users & wanderwise_current_user)
 * Manages user profile, My Bookings, and My Wishlist.
 */

// 1. Sign Up Handler
function initSignup() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('signupName')?.value?.trim();
    const email = document.getElementById('signupEmail')?.value?.trim().toLowerCase();
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;

    if (!name || !email || !password) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USERS)) || [];
    } catch (err) {
      users = [];
    }

    if (users.some(u => u.email === email)) {
      showToast('An account with this email already exists. Please login.', 'warning');
      return;
    }

    const newUser = {
      id: 'usr_' + Date.now(),
      name: name,
      email: email,
      password: password, // Note: Demo localStorage only, clearly noted in disclaimer
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    users.push(newUser);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));

    // Automatically log user in
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

    showToast(`Welcome to WanderWise, ${name}! 🎉`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 800);
  });
}

// 2. Login Handler
function initLogin() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail')?.value?.trim().toLowerCase();
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
      showToast('Please enter both email and password.', 'warning');
      return;
    }

    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.USERS)) || [];
    } catch (err) {
      users = [];
    }

    const matchedUser = users.find(u => u.email === email && u.password === password);

    // If demo mode and user hasn't created account yet, let's allow demo user instant login option
    if (!matchedUser) {
      if (email === 'demo@wanderwise.com' && password === 'wanderwise123') {
        const demoUser = {
          id: 'usr_demo',
          name: 'Sarah Jenkins',
          email: 'demo@wanderwise.com',
          joinedAt: 'Jan 2026'
        };
        localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(demoUser));
        showToast('Logged in as Demo Traveler! ✈️', 'success');
        setTimeout(() => window.location.href = 'dashboard.html', 600);
        return;
      }

      showToast('Invalid email or password. Please try again.', 'error');
      return;
    }

    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER, JSON.stringify(matchedUser));
    showToast(`Welcome back, ${matchedUser.name}! 🌍`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 600);
  });
}

// 3. Password Visibility Toggle
function initPasswordToggle() {
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.querySelector('i').className = isPassword ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      }
    });
  });
}

// 4. User Dashboard Rendering
function initDashboard() {
  const dashboardContainer = document.getElementById('dashboardContent');
  if (!dashboardContainer) return;

  const user = getCurrentUser();
  if (!user) {
    // If not logged in, prompt to log in or create demo account
    dashboardContainer.innerHTML = `
      <div style="text-align: center; padding: 4rem 1.5rem; max-width: 500px; margin: 0 auto;">
        <i class="fa-solid fa-lock" style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;"></i>
        <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Access Your Dashboard</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Please log in to view your bookings, manage your wishlist, and track your travel itineraries.</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <a href="login.html" class="btn btn-primary">Log In</a>
          <a href="signup.html" class="btn btn-secondary">Create Account</a>
        </div>
      </div>
    `;
    return;
  }

  // Render Dashboard
  renderDashboardUI(user);
}

function renderDashboardUI(user) {
  const container = document.getElementById('dashboardContent');
  const bookings = getBookings();
  const wishlist = getWishlist();

  container.innerHTML = `
    <!-- User Profile Header -->
    <div style="background: var(--bg-surface); border-radius: var(--radius-lg); padding: 2rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); margin-bottom: 2.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1.5rem;">
        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80" alt="Avatar" style="width: 75px; height: 75px; border-radius: 50%; object-fit: cover; border: 3px solid var(--primary);">
        <div>
          <h2 style="font-size: 1.75rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.25rem;">${escapeHTML(user.name)}</h2>
          <div style="display: flex; align-items: center; gap: 1rem; font-size: 0.88rem; color: var(--text-secondary);">
            <span><i class="fa-regular fa-envelope" style="color: var(--primary);"></i> ${escapeHTML(user.email)}</span>
            <span><i class="fa-regular fa-calendar-check" style="color: var(--accent);"></i> Member since ${user.joinedAt || '2026'}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem;">
        <button class="btn btn-outline btn-sm" onclick="logoutUser()">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Logout
        </button>
      </div>
    </div>

    <!-- Demo Notice Banner -->
    <div class="demo-notice-alert" style="margin-bottom: 2rem;">
      <i class="fa-solid fa-circle-info"></i>
      <span><strong>Demo Storage:</strong> Your bookings and wishlist items are saved in browser <code>localStorage</code> for demonstration purposes. This is not production-grade authentication.</span>
    </div>

    <!-- Dashboard Tabs -->
    <div style="display: flex; gap: 1rem; border-bottom: 2px solid var(--border-color); margin-bottom: 2rem;">
      <button class="dash-tab-btn active" id="tabBookingsBtn" onclick="switchDashboardTab('bookings')">
        <i class="fa-solid fa-suitcase-rolling"></i> My Bookings (${bookings.length})
      </button>
      <button class="dash-tab-btn" id="tabWishlistBtn" onclick="switchDashboardTab('wishlist')">
        <i class="fa-solid fa-heart"></i> My Wishlist (${wishlist.length})
      </button>
    </div>

    <!-- Tab 1: Bookings Content -->
    <div id="dashBookingsTab">
      ${renderBookingsTab(bookings)}
    </div>

    <!-- Tab 2: Wishlist Content -->
    <div id="dashWishlistTab" style="display: none;">
      ${renderWishlistTab(wishlist)}
    </div>
  `;

  // Auto switch tab if URL has hash (e.g. #wishlist)
  if (window.location.hash === '#wishlist') {
    switchDashboardTab('wishlist');
  }
}

function switchDashboardTab(tabName) {
  const bTab = document.getElementById('dashBookingsTab');
  const wTab = document.getElementById('dashWishlistTab');
  const bBtn = document.getElementById('tabBookingsBtn');
  const wBtn = document.getElementById('tabWishlistBtn');

  if (tabName === 'bookings') {
    bTab.style.display = 'block';
    wTab.style.display = 'none';
    bBtn.classList.add('active');
    wBtn.classList.remove('active');
  } else {
    bTab.style.display = 'none';
    wTab.style.display = 'block';
    bBtn.classList.remove('active');
    wBtn.classList.add('active');
  }
}

function getBookings() {
  try {
    return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.BOOKINGS)) || [];
  } catch (err) {
    return [];
  }
}

function renderBookingsTab(bookings) {
  if (bookings.length === 0) {
    return `
      <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 3.5rem 1rem; text-align: center; border: 1px solid var(--border-color);">
        <i class="fa-solid fa-plane-departure" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">No Bookings Yet</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Ready to embark on an unforgettable adventure?</p>
        <a href="packages.html" class="btn btn-primary">Explore Tour Packages</a>
      </div>
    `;
  }

  return `
    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
      ${bookings.map(b => `
        <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: grid; grid-template-columns: 140px 1fr auto; gap: 1.5rem; align-items: center;">
          <img src="${b.packageImage || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80'}" alt="${b.packageTitle}" style="width: 140px; height: 100px; object-fit: cover; border-radius: var(--radius-sm);">
          
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.35rem;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary); background: var(--bg-subtle); padding: 0.2rem 0.6rem; border-radius: var(--radius-full);">${b.bookingId}</span>
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--success); background: #dcfce7; padding: 0.2rem 0.6rem; border-radius: var(--radius-full);"><i class="fa-solid fa-check"></i> ${b.status}</span>
            </div>
            <h4 style="font-size: 1.2rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.4rem;">${b.packageTitle}</h4>
            <div style="display: flex; gap: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); flex-wrap: wrap;">
              <span><i class="fa-regular fa-calendar" style="color: var(--primary);"></i> Travel: <strong>${b.travelDate}</strong></span>
              <span><i class="fa-solid fa-users" style="color: var(--accent);"></i> ${b.travellers} Traveler(s)</span>
              <span><i class="fa-solid fa-wallet" style="color: var(--success);"></i> Total: <strong>${b.totalFormatted}</strong></span>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="viewBookingVoucher('${b.bookingId}')">
              <i class="fa-solid fa-receipt"></i> Voucher
            </button>
            <button class="btn btn-secondary btn-sm" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3);" onclick="cancelBooking('${b.bookingId}')">
              <i class="fa-solid fa-ban"></i> Cancel
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderWishlistTab(wishlist) {
  if (wishlist.length === 0) {
    return `
      <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 3.5rem 1rem; text-align: center; border: 1px solid var(--border-color);">
        <i class="fa-regular fa-heart" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">Your Wishlist is Empty</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Heart your favorite destinations and packages to keep them handy.</p>
        <a href="destinations.html" class="btn btn-primary">Browse Destinations</a>
      </div>
    `;
  }

  return `
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
      ${wishlist.map(w => `
        <div style="background: var(--bg-surface); border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); display: flex; flex-direction: column;">
          <div style="height: 160px; position: relative;">
            <img src="${w.image}" alt="${w.name}" style="width: 100%; height: 100%; object-fit: cover;">
            <button style="position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(255,255,255,0.9); width: 34px; height: 34px; border-radius: 50%; color: var(--danger); display: flex; align-items: center; justify-content: center;" onclick="removeWishlistItem('${w.id}')" title="Remove from wishlist">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
          <div style="padding: 1.25rem; display: flex; flex-direction: column; flex-grow: 1;">
            <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.4rem;">${w.name}</h4>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 1rem; border-top: 1px solid var(--border-color);">
              <span style="font-size: 1.1rem; font-weight: 800; color: var(--primary);">${formatPrice(w.price)}</span>
              <a href="packages.html?dest=${encodeURIComponent(w.name)}" class="btn btn-primary btn-sm">Explore</a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function removeWishlistItem(id) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(w => w.id !== id);
  saveWishlist(wishlist);
  showToast('Item removed from Wishlist', 'info');
  const user = getCurrentUser();
  if (user) renderDashboardUI(user);
}

function cancelBooking(bookingId) {
  if (confirm(`Are you sure you want to cancel demo booking ${bookingId}?`)) {
    let bookings = getBookings();
    bookings = bookings.filter(b => b.bookingId !== bookingId);
    localStorage.setItem(APP_CONFIG.STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    showToast(`Booking ${bookingId} has been cancelled.`, 'info');
    const user = getCurrentUser();
    if (user) renderDashboardUI(user);
  }
}

function viewBookingVoucher(bookingId) {
  const bookings = getBookings();
  const b = bookings.find(item => item.bookingId === bookingId);
  if (!b) return;

  let modal = document.getElementById('voucherModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'voucherModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card" style="max-width: 550px;">
      <div class="modal-header" style="background: var(--bg-gradient); color: #fff;">
        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800;">WanderWise Travel Voucher</h3>
          <p style="font-size: 0.8rem; opacity: 0.9;">Booking Ref: ${b.bookingId}</p>
        </div>
        <button class="modal-close-btn" onclick="document.getElementById('voucherModal').classList.remove('active')" style="color: #fff;"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="modal-body" style="padding: 1.8rem;">
        <div style="text-align: center; margin-bottom: 1.5rem; border-bottom: 2px dashed var(--border-color); padding-bottom: 1.25rem;">
          <h4 style="font-size: 1.3rem; font-weight: 800; color: var(--text-primary);">${b.packageTitle}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${b.destination}</p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.9rem; margin-bottom: 1.5rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Traveler Name</span>
            <p style="font-weight: 700; color: var(--text-primary);">${escapeHTML(b.customerName)}</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Departure Date</span>
            <p style="font-weight: 700; color: var(--text-primary);">${b.travelDate}</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Guests</span>
            <p style="font-weight: 700; color: var(--text-primary);">${b.travellers} Person(s)</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Status</span>
            <p style="font-weight: 700; color: var(--success);"><i class="fa-solid fa-circle-check"></i> ${b.status}</p>
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1.1rem; color: var(--primary);">
            <span>Total Demo Payment:</span>
            <span>${b.totalFormatted}</span>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
          <button class="btn btn-secondary btn-sm" onclick="window.print()"><i class="fa-solid fa-print"></i> Print Voucher</button>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('voucherModal').classList.remove('active')">Close</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// Styling for Dashboard Tabs in JS
const dashTabStyle = document.createElement('style');
dashTabStyle.innerHTML = `
  .dash-tab-btn {
    padding: 0.85rem 1.5rem;
    font-weight: 700;
    font-size: 1rem;
    color: var(--text-secondary);
    border-bottom: 3px solid transparent;
    transition: all var(--transition-fast);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .dash-tab-btn:hover {
    color: var(--primary);
  }
  .dash-tab-btn.active {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }
`;
document.head.appendChild(dashTabStyle);

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initSignup();
  initLogin();
  initPasswordToggle();
  initDashboard();
});
