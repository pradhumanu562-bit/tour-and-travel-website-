/**
 * WanderWise - Main JavaScript
 * Global configurations, navbar, theme toggle, wishlist sync, notifications, utilities
 */

// Global App State & Config
const APP_CONFIG = {
  BACKEND_URL: 'http://localhost:5000',
  CURRENCY: '₹',
  STORAGE_KEYS: {
    THEME: 'wanderwise_theme',
    WISHLIST: 'wanderwise_wishlist',
    BOOKINGS: 'wanderwise_bookings',
    USERS: 'wanderwise_users',
    CURRENT_USER: 'wanderwise_current_user',
    CHAT_HISTORY: 'wanderwise_chat_history'
  }
};

// 1. Theme Management (Light / Dark)
function initTheme() {
  const savedTheme = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.THEME) || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  applyTheme(savedTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.THEME, theme);
  
  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'fa-solid fa-sun';
    } else {
      icon.className = 'fa-solid fa-moon';
    }
  });
}

// 2. Mobile Navigation Drawer
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = navLinks.classList.contains('active') 
          ? 'fa-solid fa-xmark' 
          : 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }
}

// 3. Sticky Navbar & Back-to-Top Button
function initScrollBehaviors() {
  const navbar = document.querySelector('.navbar');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar scroll state
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// 4. Toast Notifications
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-exclamation',
    warning: 'fa-solid fa-triangle-exclamation',
    info: 'fa-solid fa-circle-info'
  };

  toast.innerHTML = `
    <i class="${iconMap[type] || iconMap.info}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-30px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// 5. Wishlist Management (LocalStorage)
function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.WISHLIST)) || [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(list) {
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.WISHLIST, JSON.stringify(list));
  updateWishlistBadges();
}

function toggleWishlist(item) {
  let wishlist = getWishlist();
  const existsIndex = wishlist.findIndex(w => w.id === item.id);

  if (existsIndex >= 0) {
    wishlist.splice(existsIndex, 1);
    saveWishlist(wishlist);
    showToast(`Removed ${item.name || item.title} from Wishlist`, 'info');
    return false; // Removed
  } else {
    wishlist.push({
      id: item.id,
      name: item.name || item.title,
      type: item.type || 'destination',
      image: item.image,
      price: item.price,
      rating: item.rating,
      addedAt: new Date().toISOString()
    });
    saveWishlist(wishlist);
    showToast(`Added ${item.name || item.title} to Wishlist! ❤️`, 'success');
    return true; // Added
  }
}

function updateWishlistBadges() {
  const wishlist = getWishlist();
  const count = wishlist.length;
  document.querySelectorAll('.wishlist-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

// 6. User Session UI in Navbar
function initUserNavbar() {
  const user = getCurrentUser();
  const authNavContainers = document.querySelectorAll('.nav-auth-slot');

  authNavContainers.forEach(container => {
    if (user) {
      container.innerHTML = `
        <div class="user-menu-wrap">
          <button class="user-profile-btn" id="userMenuToggle">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar">
            <span>${escapeHTML(user.name.split(' ')[0])}</span>
            <i class="fa-solid fa-chevron-down" style="font-size: 0.75rem;"></i>
          </button>
          <div class="user-dropdown" id="userDropdown">
            <a href="dashboard.html"><i class="fa-solid fa-user-circle"></i> My Dashboard</a>
            <a href="dashboard.html#bookings"><i class="fa-solid fa-suitcase-rolling"></i> My Bookings</a>
            <a href="dashboard.html#wishlist"><i class="fa-solid fa-heart"></i> My Wishlist</a>
            <div class="divider"></div>
            <button id="logoutBtn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
          </div>
        </div>
      `;

      const userBtn = container.querySelector('#userMenuToggle');
      const dropdown = container.querySelector('#userDropdown');
      const logoutBtn = container.querySelector('#logoutBtn');

      if (userBtn && dropdown) {
        userBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
          if (!container.contains(e.target)) {
            dropdown.classList.remove('show');
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          logoutUser();
        });
      }
    } else {
      container.innerHTML = `
        <a href="login.html" class="btn btn-secondary btn-sm">Login</a>
        <a href="signup.html" class="btn btn-primary btn-sm">Sign Up</a>
      `;
    }
  });
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER)) || null;
  } catch (e) {
    return null;
  }
}

function logoutUser() {
  localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CURRENT_USER);
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 500);
}

// 7. Newsletter Subscription Form Handler
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input?.value?.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.', 'warning');
        return;
      }

      showToast(`Thank you! ${email} has been subscribed to WanderWise alerts.`, 'success');
      form.reset();
    });
  }
}

// 8. Utility Helpers
function formatPrice(amount) {
  if (typeof amount === 'number') {
    return `${APP_CONFIG.CURRENCY}${amount.toLocaleString('en-IN')}`;
  }
  return `${amount}`;
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollBehaviors();
  updateWishlistBadges();
  initUserNavbar();
  initNewsletter();
});
