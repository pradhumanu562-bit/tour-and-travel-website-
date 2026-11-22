/**
 * WanderWise - AI Trip Planner Module
 * Interacts with /api/plan-trip (powered by Gemini AI)
 * Includes client-side smart fallback if backend is offline.
 */

// Selected Travel Type state
let selectedTravelType = 'Adventure';

// Initialize Planner UI
function initPlanner() {
  const form = document.getElementById('aiPlannerForm');
  const typeChips = document.querySelectorAll('.travel-type-chip');
  const budgetRange = document.getElementById('budgetRange');
  const budgetDisplay = document.getElementById('budgetDisplay');

  // Travel Type Chips selection
  typeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      typeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedTravelType = chip.dataset.type || 'Adventure';
    });
  });

  // Budget Range Slider sync
  if (budgetRange && budgetDisplay) {
    budgetRange.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      budgetDisplay.textContent = formatPrice(val);
    });
  }

  // Pre-fill destination from URL if present (e.g. planner.html?dest=Manali)
  const urlParams = new URLSearchParams(window.location.search);
  const destParam = urlParams.get('dest');
  const destInput = document.getElementById('plannerDestination');
  if (destParam && destInput) {
    destInput.value = destParam;
  }

  // Form Submission
  if (form) {
    form.addEventListener('submit', handlePlannerSubmit);
  }
}

// Handle AI Itinerary Generation
async function handlePlannerSubmit(e) {
  e.preventDefault();

  const startCity = document.getElementById('plannerStartCity')?.value?.trim() || 'New Delhi';
  const dest = document.getElementById('plannerDestination')?.value?.trim();
  const budgetVal = document.getElementById('budgetRange')?.value || '35000';
  const travelers = document.getElementById('plannerTravellers')?.value || '2';
  const duration = document.getElementById('plannerDuration')?.value || '4';

  if (!dest) {
    showToast('Please enter your dream destination.', 'warning');
    return;
  }

  const submitBtn = document.getElementById('generatePlanBtn');
  const resultsContainer = document.getElementById('plannerResultsArea');

  // Loading state
  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <i class="fa-solid fa-spinner fa-spin"></i> WanderWise AI is Crafting Your Journey...
  `;

  // Scroll to results area and show spinner
  resultsContainer.style.display = 'block';
  resultsContainer.innerHTML = `
    <div style="text-align: center; padding: 4rem 1rem;">
      <div style="font-size: 2.5rem; color: var(--accent); margin-bottom: 1rem; animation: pulse 1.5s infinite;">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
      </div>
      <h3 style="font-size: 1.4rem; color: var(--text-primary); margin-bottom: 0.5rem;">Analyzing Weather, Sights & Best Routes...</h3>
      <p style="color: var(--text-secondary); max-width: 500px; margin: 0 auto;">Generating your personalized ${duration}-day ${selectedTravelType.toLowerCase()} itinerary for ${dest}.</p>
    </div>
  `;
  resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const payload = {
    startingCity: startCity,
    destination: dest,
    budget: formatPrice(parseInt(budgetVal, 10)),
    travellers: travelers,
    duration: duration,
    travelType: selectedTravelType
  };

  try {
    const response = await fetch(`${APP_CONFIG.BACKEND_URL}/api/plan-trip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      if (data.itinerary) {
        renderItineraryResult(data.itinerary, data.source, data.missingKey);
        showToast('Itinerary generated successfully! ✨', 'success');
        return;
      }
    }
    throw new Error('Backend response did not contain itinerary');
  } catch (err) {
    console.warn('Backend unavailable, using client-side intelligent planner fallback:', err);
    // Smooth fallback so user experience is uninterrupted
    const fallbackPlan = generateClientSideFallbackPlan(payload);
    renderItineraryResult(fallbackPlan, 'offline-engine', true);
    showToast('Generated using WanderWise Offline Travel Engine', 'info');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnHTML;
  }
}

// Render Itinerary Cards in UI
function renderItineraryResult(itinerary, source, missingKey) {
  const resultsContainer = document.getElementById('plannerResultsArea');
  if (!resultsContainer) return;

  const noticeHtml = missingKey ? `
    <div class="demo-notice-alert" style="margin-bottom: 1.5rem; justify-content: space-between;">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <i class="fa-solid fa-key"></i>
        <span><strong>Live AI Notice:</strong> Add your Google Gemini API key to <code>.env</code> in the project folder to enable live online neural generation! Currently operating on smart offline curated travel models.</span>
      </div>
      <a href="https://aistudio.google.com/app/apikey" target="_blank" class="btn btn-outline btn-sm" style="background:#fff; color:#92400e; border-color:#fde68a;">Get Free Key</a>
    </div>
  ` : '';

  resultsContainer.innerHTML = `
    ${noticeHtml}
    
    <!-- Itinerary Hero Card -->
    <div style="background: var(--bg-surface); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); border: 1px solid var(--border-color); margin-bottom: 2.5rem;">
      <div style="background: var(--bg-gradient); color: #fff; padding: 2.5rem 2rem; position: relative;">
        <span style="background: rgba(255,255,255,0.25); padding: 0.35rem 0.95rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.75rem; display: inline-block;">
          ${itinerary.travelType} Vacation Itinerary
        </span>
        <h2 style="font-size: 2.2rem; font-weight: 900; margin-bottom: 0.5rem; line-height: 1.2;">
          ${itinerary.destination} Exploration
        </h2>
        <p style="font-size: 1.15rem; opacity: 0.95; font-style: italic; margin-bottom: 1.5rem;">
          "${itinerary.tagline || 'Explore More. Travel Better.'}"
        </p>
        <p style="font-size: 0.95rem; max-width: 780px; line-height: 1.6; opacity: 0.9;">
          ${itinerary.summary}
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 2rem; background: rgba(0,0,0,0.18); padding: 1.25rem; border-radius: var(--radius-md);">
          <div>
            <div style="font-size: 0.75rem; opacity: 0.8; text-transform: uppercase; font-weight: 700;">Duration</div>
            <div style="font-size: 1.15rem; font-weight: 800;"><i class="fa-regular fa-clock"></i> ${itinerary.duration}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; opacity: 0.8; text-transform: uppercase; font-weight: 700;">Travelers</div>
            <div style="font-size: 1.15rem; font-weight: 800;"><i class="fa-solid fa-users"></i> ${itinerary.travelers}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; opacity: 0.8; text-transform: uppercase; font-weight: 700;">Est. Total Cost</div>
            <div style="font-size: 1.15rem; font-weight: 800;"><i class="fa-solid fa-wallet"></i> ${itinerary.totalEstimatedCost}</div>
          </div>
          <div>
            <div style="font-size: 0.75rem; opacity: 0.8; text-transform: uppercase; font-weight: 700;">Best Season</div>
            <div style="font-size: 1.15rem; font-weight: 800;"><i class="fa-regular fa-calendar-check"></i> ${itinerary.bestTimeToVisit}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day-by-Day Timeline Breakdown -->
    <h3 style="font-size: 1.6rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.6rem;">
      <i class="fa-solid fa-route" style="color: var(--primary);"></i> Day-by-Day Journey Plan
    </h3>

    <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3rem;">
      ${(itinerary.days || []).map(day => `
        <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 1.8rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); position: relative;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 0.85rem; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="background: var(--bg-gradient); color: #fff; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem;">
                ${day.day}
              </span>
              <h4 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary);">${day.title}</h4>
            </div>
            ${day.suggestedStay ? `<span style="font-size: 0.8rem; background: var(--bg-subtle); color: var(--text-secondary); padding: 0.3rem 0.75rem; border-radius: var(--radius-full); font-weight: 600;"><i class="fa-solid fa-bed" style="color: var(--primary);"></i> ${day.suggestedStay}</span>` : ''}
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid #f59e0b;">
              <span style="font-size: 0.8rem; font-weight: 700; color: #b45309; text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem;">
                <i class="fa-solid fa-sun"></i> Morning
              </span>
              <p style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.5;">${day.morning}</p>
            </div>

            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
              <span style="font-size: 0.8rem; font-weight: 700; color: var(--primary); text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem;">
                <i class="fa-solid fa-cloud-sun"></i> Afternoon
              </span>
              <p style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.5;">${day.afternoon}</p>
            </div>

            <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-sm); border-left: 3px solid #8b5cf6;">
              <span style="font-size: 0.8rem; font-weight: 700; color: #6d28d9; text-transform: uppercase; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0.35rem;">
                <i class="fa-solid fa-moon"></i> Evening
              </span>
              <p style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.5;">${day.evening}</p>
            </div>
          </div>

          ${day.highlights && day.highlights.length > 0 ? `
            <div style="margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
              <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 700;">HIGHLIGHTS:</span>
              ${day.highlights.map(h => `<span style="font-size: 0.75rem; background: var(--bg-subtle); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); color: var(--text-secondary); font-weight: 600;"><i class="fa-solid fa-location-dot" style="color: var(--accent);"></i> ${h}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>

    <!-- Expenses, Food & Tips Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
      <!-- Cost Breakdown -->
      <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-chart-pie" style="color: var(--primary);"></i> Estimated Expense Split
        </h4>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${Object.entries(itinerary.costBreakdown || {}).map(([cat, val]) => `
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.88rem; padding: 0.4rem 0; border-bottom: 1px dashed var(--border-color);">
              <span style="color: var(--text-secondary); text-transform: capitalize;">${cat.replace(/([A-Z])/g, ' $1')}</span>
              <span style="font-weight: 700; color: var(--text-primary);">${val}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Food Recommendations -->
      <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-utensils" style="color: var(--accent);"></i> Must-Try Local Delicacies
        </h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
          ${(itinerary.foodRecommendations || []).map(food => `
            <li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 0.5rem;">
              <i class="fa-solid fa-circle-check" style="color: var(--success); margin-top: 3px;"></i>
              <span>${food}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <!-- Travel Tips -->
      <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 1.5rem; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
        <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
          <i class="fa-solid fa-lightbulb" style="color: var(--warning);"></i> Insider Travel Tips
        </h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.6rem;">
          ${(itinerary.travelTips || []).map(tip => `
            <li style="font-size: 0.88rem; color: var(--text-secondary); display: flex; align-items: flex-start; gap: 0.5rem;">
              <i class="fa-solid fa-compass" style="color: var(--primary); margin-top: 3px;"></i>
              <span>${tip}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>

    <!-- Actions Bar -->
    <div style="text-align: center; margin-bottom: 3rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
      <button class="btn btn-primary btn-lg" onclick="window.print()">
        <i class="fa-solid fa-print"></i> Print / Save Itinerary PDF
      </button>
      <a href="packages.html?dest=${encodeURIComponent(itinerary.destination)}" class="btn btn-secondary btn-lg">
        <i class="fa-solid fa-suitcase"></i> View Matching Packages
      </a>
    </div>
  `;
}

// Client-Side Fallback Generator
function generateClientSideFallbackPlan(p) {
  const days = parseInt(p.duration, 10) || 4;
  const travelers = parseInt(p.travellers, 10) || 2;
  const dest = p.destination;

  const dayList = [];
  for (let i = 1; i <= days; i++) {
    dayList.push({
      day: i,
      title: i === 1 ? `Arrival in ${dest} & Local Exploration` : (i === days ? `Farewell ${dest} & Souvenirs` : `Highlight Attractions of ${dest} - Stage ${i}`),
      morning: i === 1 ? `Check in to hotel, unwind, and visit the main town center for local breakfast.` : `Early morning tour of key scenic viewpoints and historical architecture in ${dest}.`,
      afternoon: `Savor regional delicacies for lunch followed by museum or market walkthrough.`,
      evening: i === days ? `Sunset photography, souvenir shopping, and celebratory farewell dinner.` : `Panoramic sunset viewpoint followed by fine dining at a popular regional bistro.`,
      highlights: [`${dest} Landmark ${i}`, `Scenic Promenade`],
      suggestedStay: `Boutique 4-Star Resort near ${dest} central hub`
    });
  }

  return {
    destination: dest,
    tagline: `Unforgettable ${p.travelType} Journey`,
    summary: `A personalized ${days}-day ${p.travelType.toLowerCase()} vacation designed for ${travelers} traveler(s) starting from ${p.startingCity}, prioritizing scenic comfort and authentic local experiences.`,
    duration: `${days} Days`,
    travelers: `${travelers} Person(s)`,
    travelType: p.travelType,
    totalEstimatedCost: p.budget || `₹${days * 3500 * travelers}`,
    bestTimeToVisit: "September to May",
    days: dayList,
    costBreakdown: {
      accommodation: `38% (Hotels & Stays)`,
      foodAndDining: `24% (Restaurants & Cafes)`,
      activities: `22% (Tickets, Guides & Safaris)`,
      localTransport: `16% (Cabs & Transit)`
    },
    foodRecommendations: [
      `Signature regional specialties at central local eateries`,
      `Artisanal baked goods and local teas/coffees`,
      `Traditional street food delicacies with verified hygiene`
    ],
    travelTips: [
      `Book high-demand tickets online at least 48 hours prior.`,
      `Carry layered clothing tailored to local weather shifts.`,
      `Keep digital copies of emergency contact and booking vouchers.`
    ]
  };
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initPlanner();
});
