/**
 * WanderWise - Destinations Module
 * Manages all 10 core destinations: Manali, Goa, Jaipur, Kashmir, Kerala, Dubai, Bali, Switzerland, Paris, Thailand
 * Search, filter, wishlist integration, and interactive destination quick views
 */

// 1. Destinations Data Source
const DESTINATIONS_DATA = [
  {
    id: 'dest-manali',
    name: 'Manali',
    country: 'India',
    state: 'Himachal Pradesh',
    category: 'mountain',
    tags: ['mountain', 'adventure', 'budget'],
    price: 9999,
    priceFormatted: '₹9,999',
    rating: 4.9,
    reviews: 245,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Snow-capped peaks, pine forests, Solang adventures, and vibrant bohemian cafes.',
    highlights: ['Solang Valley Snow Sports', 'Rohtang Pass & Atal Tunnel', 'Old Manali Cafes', 'Hadimba Devi Temple'],
    bestTime: 'October to June',
    weather: '8°C - 20°C (Snow in Dec-Feb)',
    duration: '4-5 Days'
  },
  {
    id: 'dest-goa',
    name: 'Goa',
    country: 'India',
    state: 'Goa',
    category: 'beach',
    tags: ['beach', 'relaxation', 'budget'],
    price: 8499,
    priceFormatted: '₹8,499',
    rating: 4.8,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Sun-drenched beaches, vibrant nightlife, Portuguese heritage, and fresh seafood.',
    highlights: ['Baga & Anjuna Coast', 'Fontainhas Latin Quarter', 'Dudhsagar Waterfalls', 'Sunset River Cruise'],
    bestTime: 'November to March',
    weather: '24°C - 32°C (Tropical)',
    duration: '4-6 Days'
  },
  {
    id: 'dest-jaipur',
    name: 'Jaipur',
    country: 'India',
    state: 'Rajasthan',
    category: 'heritage',
    tags: ['heritage', 'family', 'budget'],
    price: 7499,
    priceFormatted: '₹7,499',
    rating: 4.9,
    reviews: 198,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'The Pink City of regal forts, opulent palaces, vibrant bazaars, and royal hospitality.',
    highlights: ['Amber Fort & Palace', 'Hawa Mahal View', 'City Palace & Jantar Mantar', 'Nahargarh Fort Sunset'],
    bestTime: 'October to March',
    weather: '15°C - 28°C (Pleasant)',
    duration: '3-4 Days'
  },
  {
    id: 'dest-kashmir',
    name: 'Kashmir',
    country: 'India',
    state: 'Jammu & Kashmir',
    category: 'mountain',
    tags: ['mountain', 'honeymoon', 'luxury'],
    price: 18999,
    priceFormatted: '₹18,999',
    rating: 5.0,
    reviews: 184,
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Heaven on Earth with tranquil Dal Lake houseboats, Gulmarg snow, and Pahalgam meadows.',
    highlights: ['Dal Lake Shikara Rides', 'Gulmarg Gondola Ride', 'Pahalgam Betaab Valley', 'Mughal Gardens'],
    bestTime: 'March to October (Snow in Dec-Feb)',
    weather: '5°C - 22°C (Crisp & Cool)',
    duration: '5-7 Days'
  },
  {
    id: 'dest-kerala',
    name: 'Kerala',
    country: 'India',
    state: 'Kerala',
    category: 'nature',
    tags: ['nature', 'family', 'honeymoon'],
    price: 14500,
    priceFormatted: '₹14,500',
    rating: 4.9,
    reviews: 265,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'God’s Own Country with serene backwaters, tea plantations, and ayurvedic serenity.',
    highlights: ['Alleppey Houseboat Cruise', 'Munnar Tea Estates', 'Periyar Wildlife Sanctuary', 'Kochi Fort Heritage'],
    bestTime: 'September to March',
    weather: '22°C - 30°C (Lush Tropical)',
    duration: '5-7 Days'
  },
  {
    id: 'dest-dubai',
    name: 'Dubai',
    country: 'UAE',
    state: 'Dubai',
    category: 'international',
    tags: ['international', 'luxury', 'family'],
    price: 38999,
    priceFormatted: '₹38,999',
    rating: 4.8,
    reviews: 340,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Ultra-modern marvels, desert safari thrills, luxury shopping, and golden coastlines.',
    highlights: ['Burj Khalifa Skydeck', 'Desert Safari Dune Bashing', 'Dubai Mall & Fountain Show', 'Marina Yacht Cruise'],
    bestTime: 'November to April',
    weather: '20°C - 30°C (Sunny & Warm)',
    duration: '5-6 Days'
  },
  {
    id: 'dest-bali',
    name: 'Bali',
    country: 'Indonesia',
    state: 'Bali',
    category: 'international',
    tags: ['international', 'honeymoon', 'beach'],
    price: 32999,
    priceFormatted: '₹32,999',
    rating: 4.9,
    reviews: 420,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Tropical island paradise with sacred cliff temples, emerald rice terraces, and surf beaches.',
    highlights: ['Tanah Lot & Uluwatu Temples', 'Ubud Rice Terraces & Swing', 'Nusa Penida Day Trip', 'Seminyak Beach Clubs'],
    bestTime: 'April to October',
    weather: '26°C - 31°C (Tropical)',
    duration: '6-8 Days'
  },
  {
    id: 'dest-switzerland',
    name: 'Switzerland',
    country: 'Switzerland',
    state: 'Alps',
    category: 'international',
    tags: ['international', 'luxury', 'honeymoon'],
    price: 89999,
    priceFormatted: '₹89,999',
    rating: 5.0,
    reviews: 165,
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Majestic Alpine peaks, emerald lakes, panoramic cogwheel railways, and chocolate towns.',
    highlights: ['Jungfraujoch - Top of Europe', 'Matterhorn in Zermatt', 'Lake Lucerne Scenic Cruise', 'Interlaken Paragliding'],
    bestTime: 'May to September & Dec to March',
    weather: '12°C - 24°C (Alpine)',
    duration: '7-10 Days'
  },
  {
    id: 'dest-paris',
    name: 'Paris',
    country: 'France',
    state: 'Île-de-France',
    category: 'international',
    tags: ['international', 'honeymoon', 'luxury'],
    price: 79999,
    priceFormatted: '₹79,999',
    rating: 4.9,
    reviews: 280,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'The City of Light, romantic Eiffel Tower vistas, Louvre art treasures, and Parisian cafe charm.',
    highlights: ['Eiffel Tower Summit & Lights', 'Louvre Museum Guided Tour', 'Seine River Sunset Cruise', 'Montmartre & Sacré-Cœur'],
    bestTime: 'April to June & Sept to November',
    weather: '14°C - 23°C (Mild)',
    duration: '5-7 Days'
  },
  {
    id: 'dest-thailand',
    name: 'Thailand',
    country: 'Thailand',
    state: 'Bangkok & Phuket',
    category: 'international',
    tags: ['international', 'beach', 'budget'],
    price: 24999,
    priceFormatted: '₹24,999',
    rating: 4.8,
    reviews: 395,
    image: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=800&q=80',
    shortDesc: 'Golden Buddhist temples, turquoise Phi Phi waters, bustling night markets, and rich cuisine.',
    highlights: ['Phi Phi Islands Speedboat Tour', 'Grand Palace Bangkok', 'Pattaya Coral Island', 'Chiang Mai Night Bazaars'],
    bestTime: 'November to April',
    weather: '26°C - 33°C (Sunny & Warm)',
    duration: '5-7 Days'
  }
];

// 2. Render Destination Cards
function renderDestinations(containerSelector, destinationsToRender) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (destinationsToRender.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <i class="fa-solid fa-compass" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem;">No Destinations Found</h3>
        <p style="color: var(--text-secondary);">Try adjusting your search terms or filter selection.</p>
      </div>
    `;
    return;
  }

  const wishlist = getWishlist();
  const wishlistIds = new Set(wishlist.map(w => w.id));

  container.innerHTML = destinationsToRender.map(dest => {
    const isWishlisted = wishlistIds.has(dest.id);
    return `
      <div class="destination-card" data-id="${dest.id}" data-category="${dest.category}">
        <div class="dest-img-wrap">
          <img src="${dest.image}" alt="${dest.name}" loading="lazy">
          <span class="dest-badge"><i class="fa-solid fa-location-dot"></i> ${dest.country}</span>
          <button class="dest-wishlist-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="handleWishlistClick(event, '${dest.id}')"
                  title="Save to Wishlist"
                  aria-label="Save ${dest.name} to Wishlist">
            <i class="${isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}"></i>
          </button>
        </div>
        <div class="dest-content">
          <div class="dest-title-wrap">
            <h3 class="dest-name">${dest.name}</h3>
            <div class="dest-rating">
              <i class="fa-solid fa-star"></i>
              <span>${dest.rating}</span>
            </div>
          </div>
          <p class="dest-desc">${dest.shortDesc}</p>
          <div class="dest-footer">
            <div>
              <span class="dest-price-label">Starting From</span>
              <div class="dest-price-val">${dest.priceFormatted}</div>
            </div>
            <button class="btn btn-outline btn-sm" onclick="openDestinationModal('${dest.id}')">
              Explore More
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 3. Wishlist Click Handler
function handleWishlistClick(event, destId) {
  event.stopPropagation();
  const dest = DESTINATIONS_DATA.find(d => d.id === destId);
  if (!dest) return;

  const added = toggleWishlist(dest);
  const btn = event.currentTarget;
  const icon = btn.querySelector('i');

  if (added) {
    btn.classList.add('active');
    icon.className = 'fa-solid fa-heart';
  } else {
    btn.classList.remove('active');
    icon.className = 'fa-regular fa-heart';
  }
}

// 4. Quick View Modal for Destinations
function openDestinationModal(destId) {
  const dest = DESTINATIONS_DATA.find(d => d.id === destId);
  if (!dest) return;

  let modal = document.getElementById('destinationModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'destinationModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card">
      <div class="dest-img-wrap" style="height: 250px; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
        <img src="${dest.image}" alt="${dest.name}" style="width:100%; height:100%; object-fit: cover;">
        <button class="modal-close-btn" onclick="closeDestinationModal()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.6); color: #fff;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary);">${dest.name}, ${dest.country}</h2>
          <span style="color: var(--warning); font-weight: 700; font-size: 1rem;">
            <i class="fa-solid fa-star"></i> ${dest.rating} (${dest.reviews} reviews)
          </span>
        </div>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">${dest.shortDesc}</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Best Season</span>
            <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);"><i class="fa-regular fa-calendar-check" style="color: var(--primary);"></i> ${dest.bestTime}</p>
          </div>
          <div>
            <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Weather</span>
            <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-primary);"><i class="fa-solid fa-cloud-sun" style="color: var(--accent);"></i> ${dest.weather}</p>
          </div>
        </div>

        <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.6rem; color: var(--text-primary);">Must-See Highlights</h4>
        <ul style="list-style: none; margin-bottom: 1.5rem;">
          ${dest.highlights.map(h => `<li style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; color: var(--text-secondary); font-size: 0.9rem;"><i class="fa-solid fa-circle-check" style="color: var(--primary);"></i> ${h}</li>`).join('')}
        </ul>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Packages Starting At</span>
            <div style="font-size: 1.4rem; font-weight: 800; color: var(--primary);">${dest.priceFormatted}</div>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a href="packages.html?dest=${encodeURIComponent(dest.name)}" class="btn btn-primary btn-sm">
              View Packages <i class="fa-solid fa-arrow-right"></i>
            </a>
            <a href="planner.html?dest=${encodeURIComponent(dest.name)}" class="btn btn-secondary btn-sm">
              <i class="fa-solid fa-wand-magic-sparkles"></i> AI Plan
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeDestinationModal();
  });
}

function closeDestinationModal() {
  const modal = document.getElementById('destinationModal');
  if (modal) modal.classList.remove('active');
}

// 5. Category Filtering & Search Filtering
function initDestinationFilters() {
  const filterBtns = document.querySelectorAll('.dest-filter-btn');
  const searchInput = document.getElementById('destinationSearchInput');

  let currentCategory = 'all';
  let currentSearch = '';

  function applyFilters() {
    let filtered = DESTINATIONS_DATA;

    if (currentCategory !== 'all') {
      filtered = filtered.filter(d => d.category === currentCategory || d.tags.includes(currentCategory));
    }

    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.shortDesc.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    renderDestinations('#destinationsGrid', filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      applyFilters();
    });
  }

  // Handle URL query parameter for pre-filtering (e.g. ?q=manali)
  const urlParams = new URLSearchParams(window.location.search);
  const qParam = urlParams.get('q');
  if (qParam && searchInput) {
    searchInput.value = qParam;
    currentSearch = qParam;
    applyFilters();
  }
}

// Initialization for Destinations pages or sections
document.addEventListener('DOMContentLoaded', () => {
  // If destination grid exists on this page
  if (document.querySelector('#destinationsGrid')) {
    renderDestinations('#destinationsGrid', DESTINATIONS_DATA);
    initDestinationFilters();
  } else if (document.querySelector('#popularDestinationsGrid')) {
    // On Homepage, show top 6 popular destinations
    renderDestinations('#popularDestinationsGrid', DESTINATIONS_DATA.slice(0, 6));
  }
});
