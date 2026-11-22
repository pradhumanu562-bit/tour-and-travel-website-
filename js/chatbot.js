/**
 * WanderWise - WanderBot AI Chatbot Module
 * Floating widget, chat window toggle, message history, markdown parsing,
 * backend connection to /api/chat (powered by Gemini API) with robust fallback.
 */

class WanderBot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isTyping = false;
    this.init();
  }

  init() {
    this.renderWidget();
    this.bindEvents();
    this.loadHistory();
    this.checkBackendHealth();
  }

  renderWidget() {
    // 1. Floating Toggle Button
    const btn = document.createElement('div');
    btn.className = 'chatbot-widget-btn';
    btn.id = 'wanderBotToggleBtn';
    btn.setAttribute('aria-label', 'Open WanderBot AI Chat');
    btn.innerHTML = `
      <i class="fa-solid fa-robot"></i>
      <span class="chat-unread-dot"></span>
      <span class="chatbot-tooltip">Chat with WanderBot AI</span>
    `;
    document.body.appendChild(btn);

    // 2. Chatbot Window
    const win = document.createElement('div');
    win.className = 'chatbot-window';
    win.id = 'wanderBotWindow';
    win.innerHTML = `
      <div class="chatbot-header">
        <div class="chat-bot-info">
          <div class="chat-bot-avatar">
            <i class="fa-solid fa-robot"></i>
            <span class="chat-status-dot"></span>
          </div>
          <div>
            <div class="chat-bot-title">WanderBot AI</div>
            <div class="chat-bot-status"><i class="fa-solid fa-circle" style="font-size: 6px; color: #10b981;"></i> Online • Travel Concierge</div>
          </div>
        </div>
        <div class="chat-header-actions">
          <button class="chat-action-btn" id="clearChatBtn" title="Clear Chat History">
            <i class="fa-regular fa-trash-can"></i>
          </button>
          <button class="chat-action-btn" id="closeChatBtn" title="Minimize Chat">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <div class="chatbot-messages" id="chatMessages"></div>

      <div class="chat-typing-indicator" id="typingIndicator">
        <span style="font-size: 0.78rem; color: var(--text-muted); margin-right: 4px;">WanderBot is thinking</span>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>

      <div class="chat-suggestions" id="chatSuggestions">
        <button class="chip-btn" data-query="Suggest a trip under ₹10,000">Trip under ₹10,000</button>
        <button class="chip-btn" data-query="What is the best time to visit Manali?">Best time for Manali</button>
        <button class="chip-btn" data-query="Plan a 3-day romantic getaway to Goa">3-Day Goa Romantic Trip</button>
        <button class="chip-btn" data-query="Recommend luxury honeymoon packages in Bali">Bali Honeymoon Packages</button>
      </div>

      <form class="chatbot-input-bar" id="chatInputForm">
        <input type="text" class="chat-input" id="chatTextInput" placeholder="Ask about destinations, budgets, itineraries..." autocomplete="off" required>
        <button type="submit" class="chat-send-btn" id="chatSendBtn" aria-label="Send Message">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    `;
    document.body.appendChild(win);
  }

  bindEvents() {
    const toggleBtn = document.getElementById('wanderBotToggleBtn');
    const closeBtn = document.getElementById('closeChatBtn');
    const clearBtn = document.getElementById('clearChatBtn');
    const form = document.getElementById('chatInputForm');
    const input = document.getElementById('chatTextInput');
    const suggestions = document.getElementById('chatSuggestions');

    toggleBtn.addEventListener('click', () => this.toggleWindow());
    closeBtn.addEventListener('click', () => this.closeWindow());
    clearBtn.addEventListener('click', () => this.clearChat());

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (text && !this.isTyping) {
        input.value = '';
        this.handleUserMessage(text);
      }
    });

    suggestions.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip-btn');
      if (chip && !this.isTyping) {
        const query = chip.dataset.query;
        this.handleUserMessage(query);
      }
    });
  }

  toggleWindow() {
    this.isOpen = !this.isOpen;
    const win = document.getElementById('wanderBotWindow');
    const dot = document.querySelector('.chat-unread-dot');
    
    if (this.isOpen) {
      win.classList.add('open');
      if (dot) dot.style.display = 'none';
      setTimeout(() => document.getElementById('chatTextInput')?.focus(), 200);
    } else {
      win.classList.remove('open');
    }
  }

  closeWindow() {
    this.isOpen = false;
    document.getElementById('wanderBotWindow').classList.remove('open');
  }

  loadHistory() {
    try {
      const saved = localStorage.getItem(APP_CONFIG.STORAGE_KEYS.CHAT_HISTORY);
      if (saved) {
        this.messages = JSON.parse(saved);
        this.renderAllMessages();
        return;
      }
    } catch (e) {
      this.messages = [];
    }

    // Default Welcome Message
    this.appendBotMessage(
      `Hello! 👋 I'm **WanderBot**, your AI travel concierge for **WanderWise**.\n\nI can help you with:\n• Destination recommendations\n• Budget-friendly trip planning (e.g., trips under ₹10,000)\n• Custom day-by-day itineraries\n• Best seasons to travel & weather forecasts\n• WanderWise tour packages & hidden attractions\n\nWhere would you like to explore next?`
    );
  }

  saveHistory() {
    try {
      // Save last 20 messages
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(this.messages.slice(-20)));
    } catch (e) {}
  }

  clearChat() {
    if (confirm('Are you sure you want to clear your chat history with WanderBot?')) {
      this.messages = [];
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.CHAT_HISTORY);
      document.getElementById('chatMessages').innerHTML = '';
      this.appendBotMessage(`Chat cleared. How can I assist your travel plans today? 🌍`);
      showToast('Chat history cleared', 'info');
    }
  }

  async checkBackendHealth() {
    try {
      const res = await fetch(`${APP_CONFIG.BACKEND_URL}/api/health`);
      if (res.ok) {
        const data = await res.json();
        if (!data.geminiConfigured) {
          console.info('Backend online, but Gemini API key not configured yet.');
        }
      }
    } catch (e) {
      console.info('WanderWise backend is running in standalone mode or not started yet.');
    }
  }

  renderAllMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    this.messages.forEach(msg => {
      this.renderMessageElement(msg.sender, msg.text, msg.time);
    });
    this.scrollToBottom();
  }

  renderMessageElement(sender, text, time) {
    const container = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const formattedText = this.formatMarkdown(text);
    const timeFormatted = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.innerHTML = `
      <div class="msg-bubble">
        ${formattedText}
        <div class="msg-time">${timeFormatted}</div>
      </div>
    `;

    container.appendChild(msgDiv);
    this.scrollToBottom();
  }

  appendUserMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({ sender: 'user', text, time });
    this.renderMessageElement('user', text, time);
    this.saveHistory();
  }

  appendBotMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.push({ sender: 'bot', text, time });
    this.renderMessageElement('bot', text, time);
    this.saveHistory();
  }

  setTyping(status) {
    this.isTyping = status;
    const indicator = document.getElementById('typingIndicator');
    const sendBtn = document.getElementById('chatSendBtn');
    
    if (status) {
      indicator.classList.add('show');
      sendBtn.disabled = true;
    } else {
      indicator.classList.remove('show');
      sendBtn.disabled = false;
    }
    this.scrollToBottom();
  }

  scrollToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  formatMarkdown(text) {
    if (!text) return '';
    let html = escapeHTML(text);

    // Bold **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet points
    const lines = html.split('\n');
    let inList = false;
    let listType = null;
    let processed = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        if (!inList) {
          processed.push('<ul>');
          inList = true;
          listType = 'ul';
        }
        processed.push(`<li>${trimmed.substring(2)}</li>`);
      } else if (/^\d+\.\s/.test(trimmed)) {
        if (!inList) {
          processed.push('<ol>');
          inList = true;
          listType = 'ol';
        }
        processed.push(`<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`);
      } else {
        if (inList) {
          processed.push(`</${listType}>`);
          inList = false;
        }
        if (trimmed) {
          processed.push(`<p>${trimmed}</p>`);
        }
      }
    });

    if (inList) {
      processed.push(`</${listType}>`);
    }

    return processed.join('');
  }

  async handleUserMessage(userText) {
    this.appendUserMessage(userText);
    this.setTyping(true);

    try {
      const res = await fetch(`${APP_CONFIG.BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          history: this.messages
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          this.setTyping(false);
          this.appendBotMessage(data.reply);
          return;
        }
      }
      throw new Error('Backend failed or returned invalid response');
    } catch (err) {
      // Intelligent offline conversational fallback
      this.setTyping(false);
      const fallbackReply = this.generateSmartFallbackReply(userText);
      this.appendBotMessage(fallbackReply);
    }
  }

  generateSmartFallbackReply(input) {
    const lower = input.toLowerCase();

    if (lower.includes('10,000') || lower.includes('10000') || lower.includes('budget')) {
      return `I can suggest some fantastic budget-friendly destinations under ₹10,000 such as **Jaipur, Rishikesh, Pushkar, and Kasol**! 🎒\n\n• **Jaipur (₹6,500 - ₹8,500)**: Explore royal forts, street food, and vibrant bazaars.\n• **Rishikesh (₹5,000 - ₹7,500)**: River rafting, cliff jumping, and serene Ganga Aarti.\n• **Pushkar (₹4,500 - ₹7,000)**: Sacred lake ghats, desert safaris, and bohemian cafes.\n\nTell me your starting city and travel duration for a customized budget plan!`;
    }

    if (lower.includes('manali')) {
      return `**Manali** is breathtaking year-round! 🏔️\n\n• **Best Season**: October to June. (Visit Dec-Feb for heavy snowfall and winter sports in Solang Valley).\n• **Top Highlights**: Atal Tunnel, Solang Valley paragliding, Jogini waterfalls trek, and Old Manali riverside cafes.\n• **WanderWise Package**: We have a 5-day adventure expedition starting at ₹12,999/person including stays, transfers, and guides!\n\nWould you like me to tailor a day-wise itinerary?`;
    }

    if (lower.includes('goa')) {
      return `**Goa** offers the perfect mix of relaxation and coastal thrill! 🌴🌊\n\n• **Best Season**: November to March for pleasant beach weather and water sports.\n• **Recommended 3-Day Plan**:\n  1. Day 1: North Goa beaches (Baga/Vagator) & beachside shacks.\n  2. Day 2: Fontainhas Latin Quarter heritage walk & Mandovi sunset cruise.\n  3. Day 3: Watersports at Calangute and seafood dinner in Candolim.\n\nCheck out our 4-day package at just ₹8,999/person!`;
    }

    if (lower.includes('kerala')) {
      return `**Kerala (God's Own Country)** is ideal for tranquil backwaters and tea hills! 🛶🌿\n\n• **Best Highlights**: Alleppey private houseboats, Munnar tea gardens, and Periyar spice plantations.\n• **Best Season**: September to March.\n\nWe offer an exclusive Honeymoon & Family Package starting at ₹24,999!`;
    }

    if (lower.includes('dubai')) {
      return `**Dubai** is a futuristic marvel in the desert! 🏙️✨\n\n• **Must-Do**: Burj Khalifa 124th floor observation deck, Desert Dune Bashing with BBQ dinner, and Marina Dhow cruise.\n• **Estimated Cost**: ₹38,000 - ₹50,000 per person for 5 days.\n• Check out our curated **Dubai Extravaganza** package in the Packages section!`;
    }

    if (lower.includes('bali')) {
      return `**Bali** is a dream island retreat! 🌺🏝️\n\n• **Must-Visit**: Ubud rice terraces & swings, Uluwatu cliff temple sunset, and Nusa Penida island speedboat tour.\n• **Ideal Stay**: 6-8 days for a relaxed pace.\n\nExplore our Bali Bliss package starting at ₹36,999!`;
    }

    if (lower.includes('package') || lower.includes('tour')) {
      return `WanderWise offers hand-crafted packages across 5 popular categories:\n\n1. **Adventure Tours** (Manali, Rishikesh)\n2. **Beach & Budget Trips** (Goa, Thailand)\n3. **Honeymoon Specials** (Kerala, Bali, Kashmir)\n4. **Family Packages** (Jaipur, Dubai)\n5. **International Luxury** (Switzerland, Paris)\n\nHead over to our **Packages** tab to browse detailed inclusions and book demo reservations!`;
    }

    return `That sounds like a wonderful travel idea! ✈️\n\nI can recommend top destinations, draft day-by-day itineraries, estimate budget splits, or explain any WanderWise package.\n\n💡 *Tip: For full live generative responses, you can also start our backend server with your free Gemini API key configured in `.env`!* What starting city and duration are you considering?`;
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.wanderBotInstance = new WanderBot();
});
