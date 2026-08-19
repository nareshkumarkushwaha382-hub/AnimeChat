/* =================================================================
   AnimeChat / Nexa Core - Complete Standalone JavaScript (v2 - Fixed)
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Sample Data Source
  const contacts = [
    { id: 1, name: "Rem", status: "Working at the mansion", preview: "Let's work hard today!", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" },
    { id: 2, name: "Ciel Phantomhive", status: "Busy with company affairs", preview: "Don't disappoint me.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
    { id: 3, name: "Emilia", status: "Resting at Roswaal's manor", preview: "Thank you for helping out!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" }
  ];

  const chatHistory = {
    1: [
      { sender: "ai", text: "Hello there! I'm Rem. How can I help you around the mansion today?", time: "08:30 AM" },
      { sender: "user", text: "Hi Rem! Just checking in on our daily tasks.", time: "08:32 AM" }
    ],
    2: [
      { sender: "ai", text: "The Earl of Phantomhive welcomes your report.", time: "Yesterday" }
    ],
    3: [
      { sender: "ai", text: "Hi! I'm Emilia. It's so nice to talk to you.", time: "07:00 AM" }
    ]
  };

  let activeContactId = 1;

  // DOM Elements
  const chatListEl = document.getElementById('chatList');
  const headerNameEl = document.getElementById('headerName');
  const headerStatusEl = document.getElementById('headerStatus');
  const headerAvatarEl = document.getElementById('headerAvatar');
  const chatMessagesEl = document.getElementById('chatMessages');
  const messageInputEl = document.getElementById('messageInput');
  const sendBtnEl = document.getElementById('sendBtn');
  const searchInputEl = document.getElementById('searchInput');
  const appContainerEl = document.querySelector('.app-container');

  // Render Chat List with search filtering
  function renderChatList(filterText = '') {
    chatListEl.innerHTML = '';
    const filteredContacts = contacts.filter(c => 
      c.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filteredContacts.length === 0) {
      chatListEl.innerHTML = `<li style="padding: 1rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">No chats found</li>`;
      return;
    }

    filteredContacts.forEach(contact => {
      const li = document.createElement('li');
      li.className = `chat-item ${contact.id === activeContactId ? 'active' : ''}`;
      li.innerHTML = `
        <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
        <div class="contact-info">
          <span class="contact-name">${contact.name}</span>
          <span class="contact-preview">${contact.preview}</span>
        </div>
      `;
      li.addEventListener('click', () => {
        activeContactId = contact.id;
        renderChatList(searchInputEl ? searchInputEl.value : '');
        loadActiveChat();

        if (window.innerWidth <= 768 && appContainerEl) {
          appContainerEl.classList.add('sidebar-hidden');
        }
      });
      chatListEl.appendChild(li);
    });
  }

  // Load Active Chat Header & Message Pane
  function loadActiveChat() {
    const contact = contacts.find(c => c.id === activeContactId);
    if (!contact) return;

    if (headerNameEl) headerNameEl.textContent = contact.name;
    if (headerStatusEl) headerStatusEl.textContent = contact.status;
    if (headerAvatarEl) headerAvatarEl.src = contact.avatar;

    if (!chatMessagesEl) return;
    chatMessagesEl.innerHTML = '';
    const messages = chatHistory[activeContactId] || [];
    
    messages.forEach(msg => {
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${msg.sender === 'user' ? 'user' : 'ai'}`;
      msgDiv.innerHTML = `
        <div class="message-bubble">${escapeHtml(msg.text)}</div>
        <span class="message-timestamp">${msg.time}</span>
      `;
      chatMessagesEl.appendChild(msgDiv);
    });

    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  // Handle Sending Messages
  function sendMessage() {
    if (!messageInputEl) return;
    const text = messageInputEl.value.trim();
    if (!text) return;

    // Lock in the current contact ID so the reply goes to the right person even if user switches chats
    const targetContactId = activeContactId;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (!chatHistory[targetContactId]) {
      chatHistory[targetContactId] = [];
    }

    // Append user message
    chatHistory[targetContactId].push({ sender: 'user', text, time: timeStr });
    
    const contact = contacts.find(c => c.id === targetContactId);
    if (contact) {
      contact.preview = `You: ${text}`;
    }

    messageInputEl.value = '';
    renderChatList(searchInputEl ? searchInputEl.value : '');
    loadActiveChat();

    // Simulate Character / AI Auto-Reply after 1 second delay
    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (!chatHistory[targetContactId]) {
        chatHistory[targetContactId] = [];
      }

      chatHistory[targetContactId].push({ 
        sender: 'ai', 
        text: `Got your message: "${text}"! Let's continue our roleplay.`, 
        time: replyTime 
      });
      
      if (contact) {
        contact.preview = `Got your message: "${text}"...`;
      }

      renderChatList(searchInputEl ? searchInputEl.value : '');
      
      // Only reload the active view if the user is still looking at this chat
      if (activeContactId === targetContactId) {
        loadActiveChat();
      }
    }, 1000);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Attach Event Listeners
  if (sendBtnEl) {
    sendBtnEl.addEventListener('click', sendMessage);
  }
  
  if (messageInputEl) {
    messageInputEl.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  if (searchInputEl) {
    searchInputEl.addEventListener('input', (e) => {
      renderChatList(e.target.value);
    });
  }

  // Initialize Application State on Load
  renderChatList();
  loadActiveChat();
});
