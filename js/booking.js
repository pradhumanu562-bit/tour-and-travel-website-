/**
 * WanderWise - Tour Packages & Booking System
 * Manages package catalog, filtering, detail modal, live price calculation,
 * and demo booking system stored in localStorage.
 */

// 1. Tour Packages Data
const PACKAGES_DATA = [
  {
    id: 'pkg-manali-adventure',
    title: 'Himalayan Highs: Solang & Rohtang Expedition',
    destination: 'Manali, India',
    category: 'adventure',
    categoryLabel: 'Adventure Tour',
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    price: 12999,
    priceFormatted: '₹12,999',
    rating: 4.9,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    facilities: ['3★ Hotel', 'All Meals', 'Snow Trek', 'Cab Transfers', 'Campfire'],
    description: 'An adrenaline-packed mountain tour featuring paragliding at Solang Valley, snow trekking near Rohtang Pass, and camping under Himalayan stars.',
    itinerary: [
      { day: 1, title: 'Arrival in Manali & Old Manali Cafe Walk' },
      { day: 2, title: 'Solang Valley Paragliding & Zorbing' },
      { day: 3, title: 'Atal Tunnel & Sissu Waterfall Day Excursion' },
      { day: 4, title: 'Jogini Falls Trek & Vashisht Hot Springs' },
      { day: 5, title: 'Souvenir Shopping at Mall Road & Departure' }
    ],
    inclusions: ['4 Nights Boutique Mountain Resort', 'Daily Breakfast & Dinner', 'Private Cab for Sightseeing', 'Certified Adventure Trek Guide'],
    exclusions: ['Airfare / Train tickets to Chandigarh', 'Personal gear rental', 'Entry permits if applicable']
  },
  {
    id: 'pkg-goa-beach',
    title: 'Goa Coastal Serenity & Sunset Catamaran',
    destination: 'Goa, India',
    category: 'budget',
    categoryLabel: 'Budget Trip',
    duration: '4 Days / 3 Nights',
    durationDays: 4,
    price: 8999,
    priceFormatted: '₹8,999',
    rating: 4.8,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    facilities: ['Resort Stay', 'Breakfast', 'Watersports', 'Sunset Cruise', 'Scooter Rental'],
    description: 'Unwind on golden sands, feast on coastal curries, cruise the Mandovi river at sunset, and explore Portuguese villas in Fontainhas.',
    itinerary: [
      { day: 1, title: 'North Goa Check-in & Baga Beach Sunset' },
      { day: 2, title: 'Scuba Diving & Watersports at Grand Island' },
      { day: 3, title: 'Fontainhas Heritage Walk & Mandovi Luxury Cruise' },
      { day: 4, title: 'Flea Market Exploring & Return Flights' }
    ],
    inclusions: ['3 Nights 4★ Beach Resort', 'Daily Buffet Breakfast', 'Private Airport Transfers', 'Mandovi River Sunset Cruise Tickets'],
    exclusions: ['Flight tickets', 'Lunch & Alcoholic beverages', 'Watersport add-ons']
  },
  {
    id: 'pkg-kerala-honeymoon',
    title: 'Kerala Backwaters & Misty Munnar Romantic Escapes',
    destination: 'Kerala, India',
    category: 'honeymoon',
    categoryLabel: 'Honeymoon Package',
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    price: 24999,
    priceFormatted: '₹24,999',
    rating: 5.0,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    facilities: ['Private Houseboat', 'Munnar Villa', 'Candlelight Dinner', 'Ayurvedic Spa', 'Private Sedan'],
    description: 'Designed for couples: private cruise in Alleppey backwaters, aromatic tea gardens in Munnar, romantic candlelight dinner, and couples Ayurvedic rejuvenation.',
    itinerary: [
      { day: 1, title: 'Arrive in Kochi, scenic drive to Munnar Hills' },
      { day: 2, title: 'Munnar Tea Gardens, Echo Point & Mattupetty Dam' },
      { day: 3, title: 'Transfer to Thekkady & Periyar Spice Plantation' },
      { day: 4, title: 'Board Luxury Private Houseboat in Alleppey' },
      { day: 5, title: 'Houseboat sunrise & Kochi Fort Heritage Sunset' },
      { day: 6, title: 'Authentic Kerala breakfast & Airport farewell' }
    ],
    inclusions: ['Luxury Private Houseboat with Chef', 'Candlelight Dinner with Flower Decor', 'Ayurvedic Couple Massage', 'Chauffeur Driven AC Sedan'],
    exclusions: ['Airfare', 'Personal shopping']
  },
  {
    id: 'pkg-jaipur-family',
    title: 'Royal Rajasthan: Forts, Palaces & Desert Tales',
    destination: 'Jaipur, India',
    category: 'family',
    categoryLabel: 'Family Package',
    duration: '4 Days / 3 Nights',
    durationDays: 4,
    price: 11499,
    priceFormatted: '₹11,499',
    rating: 4.8,
    reviews: 132,
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    facilities: ['Heritage Haveli', 'All Meals', 'Chokhi Dhani Pass', 'Private Van', 'Audio Guides'],
    description: 'A regal family getaway covering the Golden Triangle wonders: Amber Fort elephant views, Jal Mahal photo stops, and lively cultural dances at Chokhi Dhani.',
    itinerary: [
      { day: 1, title: 'Arrival, Haveli check-in & City Palace tour' },
      { day: 2, title: 'Amber Fort, Nahargarh sunset & Hawa Mahal' },
      { day: 3, title: 'Chokhi Dhani cultural village & Rajasthani Feast' },
      { day: 4, title: 'Bapu Bazaar shopping & departure' }
    ],
    inclusions: ['Heritage Hotel stay with family suites', 'Daily breakfast & dinner', 'Entry tickets to major forts', 'Family transport in AC Innova'],
    exclusions: ['Camera fees at monuments', 'Personal expenses']
  },
  {
    id: 'pkg-dubai-international',
    title: 'Dubai Extravaganza: Burj Khalifa, Safari & Yacht',
    destination: 'Dubai, UAE',
    category: 'international',
    categoryLabel: 'International Tour',
    duration: '5 Days / 4 Nights',
    durationDays: 5,
    price: 44999,
    priceFormatted: '₹44,999',
    rating: 4.9,
    reviews: 290,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    facilities: ['5★ Hotel', 'Desert Safari BBQ', 'Burj Top Ticket', 'Marina Dhow Cruise', 'Visa Support'],
    description: 'Experience futuristic luxury: standing on the 124th floor of Burj Khalifa, dune bashing with belly dance BBQ in Arabian deserts, and marina yachting.',
    itinerary: [
      { day: 1, title: 'Arrival at Dubai International & Marina Dhow Dinner' },
      { day: 2, title: 'Half Day City Tour & Burj Khalifa At The Top' },
      { day: 3, title: 'Desert Safari Dune Bashing & Arabian Night Camp' },
      { day: 4, title: 'Dubai Frame & Miracle Garden / Global Village' },
      { day: 5, title: 'Duty Free shopping & Departure' }
    ],
    inclusions: ['4 Nights at 5★ Dubai Hotel', 'Daily International Buffet', 'Burj Khalifa 124th floor entry pass', 'UAE Tourist Visa Assistance'],
    exclusions: ['International Flight tickets', 'Tourism Dirham Fee (payable at hotel)']
  },
  {
    id: 'pkg-bali-international',
    title: 'Bali Bliss: Ubud Jungles & Uluwatu Cliffs',
    destination: 'Bali, Indonesia',
    category: 'international',
    categoryLabel: 'International Tour',
    duration: '6 Days / 5 Nights',
    durationDays: 6,
    price: 36999,
    priceFormatted: '₹36,999',
    rating: 4.9,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    facilities: ['Private Pool Villa', 'Floating Breakfast', 'Nusa Penida Tour', 'Kecak Dance Show', 'Airport Pick'],
    description: 'Immerse in tropical splendor with private jungle pool villas, sacred Monkey Forest walks, Nusa Penida Kelingking cliff viewpoints, and beach club sunsets.',
    itinerary: [
      { day: 1, title: 'Welcome to Denpasar & Ubud Jungle Villa check-in' },
      { day: 2, title: 'Tegallalang Rice Terrace Swing & Tegenungan Waterfall' },
      { day: 3, title: 'Full Day Nusa Penida Island Speedboat Excursion' },
      { day: 4, title: 'Uluwatu Sunset Temple & Fire Dance show' },
      { day: 5, title: 'Seminyak Beach Club leisure & Spa therapy' },
      { day: 6, title: 'Floating breakfast in villa & airport transfer' }
    ],
    inclusions: ['3 Nights Ubud Villa + 2 Nights Seminyak Villa', 'Daily Breakfast including Floating Breakfast', 'Fast boat tickets to Nusa Penida', 'All sightseeing transfers'],
    exclusions: ['International flights', 'Bali tourist entry levy (IDR 150k)']
  }
];

// 2. Render Packages
function renderPackages(containerSelector, packagesToRender) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (packagesToRender.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <i class="fa-solid fa-suitcase" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem;">No Packages Found</h3>
        <p style="color: var(--text-secondary);">Try adjusting your category filter or search terms.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = packagesToRender.map(pkg => `
    <div class="package-card" data-id="${pkg.id}" data-category="${pkg.category}">
      <div class="pkg-img-wrap">
        <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
        <span class="pkg-category-tag">${pkg.categoryLabel}</span>
        <span class="pkg-duration-badge">
          <i class="fa-regular fa-clock"></i> ${pkg.duration}
        </span>
      </div>
      <div class="pkg-content">
        <span class="pkg-destination"><i class="fa-solid fa-location-dot"></i> ${pkg.destination}</span>
        <h3 class="pkg-title">${pkg.title}</h3>
        
        <div class="pkg-rating-wrap">
          <div class="stars">
            ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(pkg.rating))}
          </div>
          <span style="font-weight: 700; color: var(--text-primary);">${pkg.rating}</span>
          <span style="color: var(--text-muted); font-size: 0.8rem;">(${pkg.reviews} reviews)</span>
          <span class="demo-rating-tag">Demo Verified</span>
        </div>

        <div class="pkg-facilities">
          ${pkg.facilities.slice(0, 4).map(f => `
            <span class="facility-chip"><i class="fa-solid fa-check"></i> ${f}</span>
          `).join('')}
        </div>

        <div class="pkg-footer">
          <div class="pkg-price-wrap">
            <span class="pkg-price-label">Per Person</span>
            <div class="pkg-price-val">${pkg.priceFormatted}</div>
          </div>
          <div class="pkg-actions">
            <button class="btn btn-secondary btn-sm" onclick="openPackageDetails('${pkg.id}')">
              Details
            </button>
            <button class="btn btn-primary btn-sm" onclick="openBookingModal('${pkg.id}')">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// 3. Package Details Modal
function openPackageDetails(pkgId) {
  const pkg = PACKAGES_DATA.find(p => p.id === pkgId);
  if (!pkg) return;

  let modal = document.getElementById('packageDetailsModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'packageDetailsModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="modal-card">
      <div class="pkg-img-wrap" style="height: 240px; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
        <img src="${pkg.image}" alt="${pkg.title}" style="width: 100%; height: 100%; object-fit: cover;">
        <button class="modal-close-btn" onclick="closePackageDetails()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.6); color: #fff;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="modal-body">
        <span class="pkg-category-tag" style="position: static; margin-bottom: 0.5rem; display: inline-block;">${pkg.categoryLabel}</span>
        <h2 style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.35rem;">${pkg.title}</h2>
        <div style="display: flex; gap: 1rem; color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1.25rem;">
          <span><i class="fa-solid fa-location-dot" style="color: var(--primary);"></i> ${pkg.destination}</span>
          <span><i class="fa-regular fa-clock" style="color: var(--accent);"></i> ${pkg.duration}</span>
          <span style="color: var(--warning); font-weight: 700;"><i class="fa-solid fa-star"></i> ${pkg.rating} (Demo Rating)</span>
        </div>

        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${pkg.description}</p>

        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.75rem;">Day-by-Day Highlights</h4>
        <div style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem;">
          ${pkg.itinerary.map(it => `
            <div style="display: flex; gap: 0.75rem; background: var(--bg-subtle); padding: 0.6rem 0.85rem; border-radius: var(--radius-sm); font-size: 0.88rem;">
              <span style="font-weight: 800; color: var(--primary); white-space: nowrap;">Day ${it.day}:</span>
              <span style="color: var(--text-primary); font-weight: 500;">${it.title}</span>
            </div>
          `).join('')}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; margin-bottom: 1.5rem;">
          <div>
            <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--success); margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-check"></i> What's Included</h5>
            <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
              ${pkg.inclusions.map(inc => `<li style="margin-bottom: 0.3rem;">• ${inc}</li>`).join('')}
            </ul>
          </div>
          <div>
            <h5 style="font-size: 0.9rem; font-weight: 700; color: var(--danger); margin-bottom: 0.5rem;"><i class="fa-solid fa-circle-xmark"></i> Exclusions</h5>
            <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.5;">
              ${pkg.exclusions.map(exc => `<li style="margin-bottom: 0.3rem;">• ${exc}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1.25rem;">
          <div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">Package Price</span>
            <div style="font-size: 1.5rem; font-weight: 800; color: var(--primary);">${pkg.priceFormatted} <small style="font-size: 0.75rem; color: var(--text-muted); font-weight: 400;">/ person</small></div>
          </div>
          <button class="btn btn-primary" onclick="closePackageDetails(); openBookingModal('${pkg.id}');">
            Book This Package Now <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePackageDetails();
  });
}

function closePackageDetails() {
  const modal = document.getElementById('packageDetailsModal');
  if (modal) modal.classList.remove('active');
}

// 4. Interactive Booking Modal with Real-Time Total Price Calculation
let currentBookingState = {
  packageId: null,
  basePrice: 0,
  travellers: 1,
  flightAddon: false,
  flightCostPerPerson: 5000,
  insuranceAddon: false,
  insuranceCostPerPerson: 599
};

function openBookingModal(pkgId) {
  const pkg = PACKAGES_DATA.find(p => p.id === pkgId) || PACKAGES_DATA[0];
  const user = getCurrentUser();

  currentBookingState = {
    packageId: pkg.id,
    basePrice: pkg.price,
    travellers: 1,
    flightAddon: false,
    flightCostPerPerson: 5000,
    insuranceAddon: false,
    insuranceCostPerPerson: 599
  };

  let modal = document.getElementById('bookingModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'bookingModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  // Minimum date set to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-header">
        <div>
          <h3 class="modal-title">Book Tour Package</h3>
          <p style="font-size: 0.82rem; color: var(--text-muted); margin-top: 2px;">Instant reservation confirmation (Demo Mode)</p>
        </div>
        <button class="modal-close-btn" onclick="closeBookingModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="modal-body">
        <div class="demo-notice-alert">
          <i class="fa-solid fa-circle-info"></i>
          <span>This is an interactive demo booking system using local storage. No real money will be charged.</span>
        </div>

        <form id="tourBookingForm">
          <div class="form-group">
            <label class="form-label">Selected Tour Package</label>
            <select class="form-select" id="bookingPackageSelect" onchange="onPackageSelectChange(this.value)" required>
              ${PACKAGES_DATA.map(p => `
                <option value="${p.id}" ${p.id === pkg.id ? 'selected' : ''}>
                  ${p.title} (${p.priceFormatted}/person)
                </option>
              `).join('')}
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Customer Name</label>
              <input type="text" class="form-input" id="custName" value="${user ? escapeHTML(user.name) : ''}" placeholder="Full Name" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="custEmail" value="${user ? escapeHTML(user.email) : ''}" placeholder="name@domain.com" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" class="form-input" id="custPhone" placeholder="+91 98765 43210" pattern="[0-9+ ]{10,15}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Departure Date</label>
              <input type="date" class="form-input" id="custTravelDate" min="${minDateStr}" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Number of Travellers</label>
            <div style="display: flex; align-items: center; gap: 1rem;">
              <button type="button" class="btn btn-secondary btn-icon" onclick="adjustTravellers(-1)"><i class="fa-solid fa-minus"></i></button>
              <span id="travellersCountDisplay" style="font-size: 1.25rem; font-weight: 800; min-width: 40px; text-align: center;">1</span>
              <button type="button" class="btn btn-secondary btn-icon" onclick="adjustTravellers(1)"><i class="fa-solid fa-plus"></i></button>
              <span style="font-size: 0.85rem; color: var(--text-muted);">(Max 10 guests per booking)</span>
            </div>
          </div>

          <!-- Add-ons selection -->
          <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
            <label style="font-size: 0.85rem; font-weight: 700; color: var(--text-primary); display: block; margin-bottom: 0.5rem;">Optional Travel Add-ons:</label>
            
            <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; cursor: pointer; margin-bottom: 0.4rem;">
              <input type="checkbox" id="flightAddonCheck" onchange="toggleAddon('flight', this.checked)">
              <span>Add Round-Trip Flights Assistance (+₹5,000 / person)</span>
            </label>

            <label style="display: flex; align-items: center; gap: 0.6rem; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="insuranceAddonCheck" onchange="toggleAddon('insurance', this.checked)">
              <span>Comprehensive Travel & Medical Insurance (+₹599 / person)</span>
            </label>
          </div>

          <!-- Dynamic Live Price Calculation Breakdown -->
          <div class="price-summary-box">
            <div class="price-row">
              <span>Base Package (<span id="summaryBasePrice">₹0</span> × <span id="summaryTravellerCount">1</span>):</span>
              <span id="summaryBaseTotal">₹0</span>
            </div>
            <div class="price-row" id="flightRow" style="display: none;">
              <span>Flight Assistance:</span>
              <span id="summaryFlightTotal">₹0</span>
            </div>
            <div class="price-row" id="insuranceRow" style="display: none;">
              <span>Travel Insurance:</span>
              <span id="summaryInsuranceTotal">₹0</span>
            </div>
            <div class="price-row total">
              <span>Total Estimated Price:</span>
              <span id="summaryFinalTotal">₹0</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.9rem; font-size: 1.05rem;">
            <i class="fa-solid fa-lock"></i> Confirm Demo Booking
          </button>
        </form>
      </div>
    </div>
  `;

  modal.classList.add('active');
  recalculateBookingTotal();

  // Attach submit event
  const form = document.getElementById('tourBookingForm');
  form.addEventListener('submit', handleBookingSubmit);
}

function closeBookingModal() {
  const modal = document.getElementById('bookingModal');
  if (modal) modal.classList.remove('active');
}

function onPackageSelectChange(selectedId) {
  const pkg = PACKAGES_DATA.find(p => p.id === selectedId);
  if (pkg) {
    currentBookingState.packageId = pkg.id;
    currentBookingState.basePrice = pkg.price;
    recalculateBookingTotal();
  }
}

function adjustTravellers(delta) {
  let count = currentBookingState.travellers + delta;
  if (count < 1) count = 1;
  if (count > 10) count = 10;
  currentBookingState.travellers = count;
  
  const display = document.getElementById('travellersCountDisplay');
  if (display) display.textContent = count;
  recalculateBookingTotal();
}

function toggleAddon(type, isChecked) {
  if (type === 'flight') currentBookingState.flightAddon = isChecked;
  if (type === 'insurance') currentBookingState.insuranceAddon = isChecked;
  recalculateBookingTotal();
}

function recalculateBookingTotal() {
  const { basePrice, travellers, flightAddon, flightCostPerPerson, insuranceAddon, insuranceCostPerPerson } = currentBookingState;

  const baseTotal = basePrice * travellers;
  const flightTotal = flightAddon ? flightCostPerPerson * travellers : 0;
  const insuranceTotal = insuranceAddon ? insuranceCostPerPerson * travellers : 0;
  const grandTotal = baseTotal + flightTotal + insuranceTotal;

  // Update UI Elements
  const baseEl = document.getElementById('summaryBasePrice');
  const countEl = document.getElementById('summaryTravellerCount');
  const baseTotalEl = document.getElementById('summaryBaseTotal');
  const flightRow = document.getElementById('flightRow');
  const flightTotalEl = document.getElementById('summaryFlightTotal');
  const insuranceRow = document.getElementById('insuranceRow');
  const insuranceTotalEl = document.getElementById('summaryInsuranceTotal');
  const finalTotalEl = document.getElementById('summaryFinalTotal');

  if (baseEl) baseEl.textContent = formatPrice(basePrice);
  if (countEl) countEl.textContent = travellers;
  if (baseTotalEl) baseTotalEl.textContent = formatPrice(baseTotal);

  if (flightRow && flightTotalEl) {
    if (flightAddon) {
      flightRow.style.display = 'flex';
      flightTotalEl.textContent = formatPrice(flightTotal);
    } else {
      flightRow.style.display = 'none';
    }
  }

  if (insuranceRow && insuranceTotalEl) {
    if (insuranceAddon) {
      insuranceRow.style.display = 'flex';
      insuranceTotalEl.textContent = formatPrice(insuranceTotal);
    } else {
      insuranceRow.style.display = 'none';
    }
  }

  if (finalTotalEl) finalTotalEl.textContent = formatPrice(grandTotal);
}

// 5. Booking Form Submission & Confirmation Screen
function handleBookingSubmit(e) {
  e.preventDefault();

  const pkg = PACKAGES_DATA.find(p => p.id === currentBookingState.packageId);
  if (!pkg) return;

  const name = document.getElementById('custName')?.value?.trim();
  const email = document.getElementById('custEmail')?.value?.trim();
  const phone = document.getElementById('custPhone')?.value?.trim();
  const date = document.getElementById('custTravelDate')?.value;

  if (!name || !email || !phone || !date) {
    showToast('Please fill out all required booking fields.', 'warning');
    return;
  }

  const { basePrice, travellers, flightAddon, insuranceAddon, flightCostPerPerson, insuranceCostPerPerson } = currentBookingState;
  const grandTotal = (basePrice * travellers) + (flightAddon ? flightCostPerPerson * travellers : 0) + (insuranceAddon ? insuranceCostPerPerson * travellers : 0);

  // Generate Booking Record
  const bookingId = 'WW-' + Math.floor(100000 + Math.random() * 900000);
  const newBooking = {
    bookingId: bookingId,
    packageId: pkg.id,
    packageTitle: pkg.title,
    destination: pkg.destination,
    packageImage: pkg.image,
    customerName: name,
    email: email,
    phone: phone,
    travelDate: date,
    travellers: travellers,
    addons: {
      flight: flightAddon,
      insurance: insuranceAddon
    },
    totalAmount: grandTotal,
    totalFormatted: formatPrice(grandTotal),
    status: 'Confirmed (Demo)',
    bookedAt: new Date().toISOString()
  };

  // Save to localStorage
  let allBookings = [];
  try {
    allBookings = JSON.parse(localStorage.getItem(APP_CONFIG.STORAGE_KEYS.BOOKINGS)) || [];
  } catch (err) {
    allBookings = [];
  }
  allBookings.unshift(newBooking);
  localStorage.setItem(APP_CONFIG.STORAGE_KEYS.BOOKINGS, JSON.stringify(allBookings));

  // Show Booking Confirmation Modal
  showBookingConfirmation(newBooking);
}

function showBookingConfirmation(booking) {
  const modal = document.getElementById('bookingModal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-card" style="text-align: center; padding: 2.5rem 2rem;">
      <div style="width: 70px; height: 70px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.5rem auto;">
        <i class="fa-solid fa-check"></i>
      </div>

      <h2 style="font-size: 1.8rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Booking Confirmed!</h2>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Your demo tour booking has been placed successfully.</p>

      <div style="background: var(--bg-subtle); border-radius: var(--radius-md); padding: 1.25rem; text-align: left; margin-bottom: 1.5rem; border: 1px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; border-bottom: 1px dashed var(--border-color); padding-bottom: 0.5rem;">
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">Booking Reference:</span>
          <span style="font-size: 0.95rem; font-weight: 800; color: var(--primary);">${booking.bookingId}</span>
        </div>
        <div style="margin-bottom: 0.4rem; font-size: 0.9rem;">
          <strong>Tour:</strong> ${booking.packageTitle}
        </div>
        <div style="margin-bottom: 0.4rem; font-size: 0.9rem;">
          <strong>Primary Traveler:</strong> ${escapeHTML(booking.customerName)} (${booking.travellers} Person[s])
        </div>
        <div style="margin-bottom: 0.4rem; font-size: 0.9rem;">
          <strong>Departure Date:</strong> ${booking.travelDate}
        </div>
        <div style="margin-bottom: 0.4rem; font-size: 0.9rem;">
          <strong>Total Paid (Demo):</strong> <span style="font-weight: 800; color: var(--primary);">${booking.totalFormatted}</span>
        </div>
      </div>

      <div class="demo-notice-alert" style="text-align: left;">
        <i class="fa-solid fa-info-circle"></i>
        <span>This confirmation is stored in your browser's demo storage. You can view or cancel it anytime in <a href="dashboard.html" style="text-decoration: underline; font-weight: 700;">My Dashboard</a>.</span>
      </div>

      <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1.5rem;">
        <a href="dashboard.html" class="btn btn-primary">
          <i class="fa-solid fa-suitcase-rolling"></i> View My Bookings
        </a>
        <button class="btn btn-secondary" onclick="closeBookingModal()">
          Close
        </button>
      </div>
    </div>
  `;
}

// 6. Category Filter Controls on Packages Page
function initPackageFilters() {
  const filterBtns = document.querySelectorAll('.pkg-filter-btn');
  const searchInput = document.getElementById('packageSearchInput');

  let activeCategory = 'all';
  let activeQuery = '';

  function applyFilters() {
    let filtered = PACKAGES_DATA;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }

    if (activeQuery.trim()) {
      const q = activeQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.destination.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    renderPackages('#packagesGrid', filtered);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeQuery = e.target.value;
      applyFilters();
    });
  }

  // Pre-filter by destination if URL has ?dest=...
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get('dest');
  if (destParam && searchInput) {
    searchInput.value = destParam;
    activeQuery = destParam;
    applyFilters();
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('#packagesGrid')) {
    renderPackages('#packagesGrid', PACKAGES_DATA);
    initPackageFilters();
  } else if (document.querySelector('#featuredPackagesGrid')) {
    // Top 3 featured packages on Homepage
    renderPackages('#featuredPackagesGrid', PACKAGES_DATA.slice(0, 3));
  }
});
