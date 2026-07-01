// ─── Knowledge Base ───────────────────────────────────────────────────────────
const KNOWLEDGE_BASE = {
  entries: [
    {
      keywords: ["role", "job", "what do you do", "position", "title", "work"],
      response:
        "Wei is a UX designer and technical builder at Amazon, working on the Kuiper (Leo) satellite program. He designs console interfaces that help maritime and mobility customers manage complex satellite networks.",
    },
    {
      keywords: ["project", "leo", "console", "dashboard", "satellite"],
      response:
        "Wei designed the Amazon Leo Console — a satellite network management dashboard for maritime and mobility customers. It includes real-time status maps, service contract management, fleet views, and antenna monitoring.",
    },
    {
      keywords: ["fleet", "management", "vessel", "ship"],
      response:
        "Wei led the Fleet Management Redesign, restructuring how enterprise customers organize and manage hundreds of vessels. The redesign reduced task completion time by 40% and cut fleet-related support tickets by 45%.",
    },
    {
      keywords: ["skill", "tools", "technology", "tech", "stack", "react", "code"],
      response:
        "Wei's skills span UX design (Figma, prototyping, usability testing) and front-end development (React, TypeScript, Vite, Cloudscape). He bridges design and engineering by building interactive prototypes.",
    },
    {
      keywords: ["design", "ux", "user experience", "process", "approach", "method"],
      response:
        "Wei's design approach blends customer research, information architecture, and rapid prototyping. He conducts stakeholder interviews, creates lo-fi wireframes, builds interactive React prototypes, and validates through moderated usability testing.",
    },
    {
      keywords: ["amazon", "kuiper", "aws", "company"],
      response:
        "Wei works at Amazon on the Kuiper (Leo) program — Amazon's satellite internet initiative. He designs the customer-facing console for managing satellite connectivity for maritime and mobility use cases.",
    },
    {
      keywords: ["background", "education", "experience", "history", "before"],
      response:
        "Before Amazon, Wei worked on enterprise SaaS products and internal tools, focused on making complex workflows approachable. He's passionate about design systems, information architecture, and the intersection of business strategy and craft.",
    },
    {
      keywords: ["contact", "email", "reach", "hire", "connect", "talk"],
      response:
        "You can reach Wei at weihg@amazon.com. He's always happy to connect about UX design, technical building, or collaboration opportunities.",
    },
    {
      keywords: ["cloudscape", "design system", "component", "ui library"],
      response:
        "Wei works with Cloudscape, AWS's open-source design system, to build consistent and accessible console experiences. He uses components like Table, Container, Header, and SpaceBetween to create polished interfaces.",
    },
    {
      keywords: ["map", "maplibre", "location", "geographic"],
      response:
        "The Leo Console uses MapLibre GL to render geographic maps showing service contract locations. Markers are color-coded by status: green (online), red (offline), and grey (paused/cancelled).",
    },
    {
      keywords: ["hello", "hi", "hey", "greet"],
      response:
        "Hi there! 👋 I can tell you about Wei's work, projects, skills, and background. What would you like to know?",
    },
  ],
  fallback:
    "I'm not sure about that one! You can ask me about Wei's role, projects, skills, or background. Or feel free to email him directly at weihg@amazon.com.",
  greeting:
    "Hi! 👋 I'm Wei's portfolio assistant. Ask me about his projects, skills, experience, or how to get in touch.",
};

// ─── Matcher ──────────────────────────────────────────────────────────────────
function findBestMatch(userInput) {
  const input = userInput.toLowerCase().trim();
  let bestEntry = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE.entries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (input.includes(keyword)) {
        score += keyword.split(" ").length; // multi-word keywords score higher
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestEntry ? bestEntry.response : KNOWLEDGE_BASE.fallback;
}

// ─── Session Persistence ──────────────────────────────────────────────────────
const SESSION_KEY = "wg-chatbot-messages";

function saveMessages(messages) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
  } catch (e) {
    // sessionStorage not available — silently fail
  }
}

function loadMessages() {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

// ─── Chat UI ──────────────────────────────────────────────────────────────────
(function initChatbot() {
  let isOpen = false;
  let messages = loadMessages();

  // Create floating button
  const btn = document.createElement("button");
  btn.className = "chatbot-btn";
  btn.setAttribute("aria-label", "Open chat");
  btn.setAttribute("aria-expanded", "false");
  btn.textContent = "💬";
  document.body.appendChild(btn);

  // Create chat panel
  const panel = document.createElement("div");
  panel.className = "chatbot-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Chat with Wei's portfolio assistant");
  panel.innerHTML = `
    <div class="chatbot-header">
      <span class="chatbot-header-title" id="chatbot-title">Chat with Wei</span>
      <button class="chatbot-close-btn" aria-label="Close chat">&times;</button>
    </div>
    <div class="chatbot-messages" role="log" aria-live="polite" aria-label="Chat messages"></div>
    <div class="chatbot-input-bar">
      <label for="chatbot-input-field" class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">Type a message</label>
      <input id="chatbot-input-field" class="chatbot-input" type="text" placeholder="Ask me anything..." autocomplete="off" />
      <button class="chatbot-send-btn" aria-label="Send message">Send</button>
    </div>
  `;
  panel.setAttribute("aria-labelledby", "chatbot-title");
  document.body.appendChild(panel);

  const closeBtn = panel.querySelector(".chatbot-close-btn");
  const messagesEl = panel.querySelector(".chatbot-messages");
  const inputEl = panel.querySelector(".chatbot-input");
  const sendBtn = panel.querySelector(".chatbot-send-btn");

  // ─── Render Messages ────────────────────────────────────────────────────────
  function renderMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `chatbot-msg chatbot-msg--${sender}`;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function renderAllMessages() {
    messagesEl.innerHTML = "";
    for (const m of messages) {
      renderMessage(m.text, m.sender);
    }
  }

  // ─── Send Message ───────────────────────────────────────────────────────────
  function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    // User message
    messages.push({ text, sender: "user" });
    renderMessage(text, "user");
    inputEl.value = "";

    // Bot response (slight delay for natural feel)
    setTimeout(function () {
      const response = findBestMatch(text);
      messages.push({ text: response, sender: "bot" });
      renderMessage(response, "bot");
      saveMessages(messages);
    }, 300);

    saveMessages(messages);
  }

  // ─── Open / Close ───────────────────────────────────────────────────────────
  function openPanel() {
    isOpen = true;
    panel.classList.add("open");
    btn.setAttribute("aria-expanded", "true");

    // Show greeting if first time
    if (messages.length === 0) {
      messages.push({ text: KNOWLEDGE_BASE.greeting, sender: "bot" });
      saveMessages(messages);
    }
    renderAllMessages();
    inputEl.focus();
  }

  function closePanel() {
    isOpen = false;
    panel.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }

  // ─── Event Listeners ────────────────────────────────────────────────────────
  btn.addEventListener("click", openPanel);
  closeBtn.addEventListener("click", closePanel);
  sendBtn.addEventListener("click", sendMessage);

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // Close on Escape
  panel.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closePanel();
    }
  });

  // Trap focus inside panel when open
  panel.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    const focusable = panel.querySelectorAll(
      'button, input, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();
