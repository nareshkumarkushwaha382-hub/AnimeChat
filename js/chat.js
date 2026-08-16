const ChatManager = {
    activeCharacterId: null,

    init() {
        const sendBtn = document.getElementById("send-btn");
        const messageInput = document.getElementById("message-input");

        if (sendBtn) {
            sendBtn.addEventListener("click", () => this.handleSendMessage());
        }
        if (messageInput) {
            messageInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    this.handleSendMessage();
                }
            });
        }
    },

    openChat(characterId) {
        this.activeCharacterId = characterId;
        const char = (typeof characters !== 'undefined' && characters[characterId]) || 
                     (typeof StorageManager !== 'undefined' && StorageManager.getSavedCustomCharacters()[characterId]);
        if (!char) return;

        // Update Header UI
        document.getElementById("active-name").textContent = char.name;
        document.getElementById("active-status").textContent = char.status || "Online";
        document.getElementById("active-avatar").src = char.avatar;

        // Switch views
        document.getElementById("chat-welcome").classList.add("hidden");
        document.getElementById("chat-box").classList.remove("hidden");

        if (window.innerWidth <= 768) {
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) sidebar.classList.add("mobile-hidden");
        }

        // Highlight active contact
        document.querySelectorAll(".contact-item").forEach(item => {
            item.classList.remove("active");
            if (item.dataset.id === characterId) {
                item.classList.add("active");
            }
        });

        // Update Roleplay UI state for this character
        if (typeof RoleplayManager !== 'undefined') {
            RoleplayManager.updateUI(characterId);
        }

        this.renderMessages();
    },

    renderMessages() {
        const container = document.getElementById("messages-container");
        if (!container) return;
        container.innerHTML = "";

        const messages = StorageManager.getMessages(this.activeCharacterId);

        messages.forEach(msg => {
            const messageEl = document.createElement("div");
            messageEl.classList.add("message", msg.sender);
            
            messageEl.innerHTML = `
                <div class="message-text">${this.escapeHTML(msg.text)}</div>
                <div class="message-time">${msg.time}</div>
            `;
            container.appendChild(messageEl);
        });

        container.scrollTop = container.scrollHeight;
    },

    handleSendMessage() {
        const input = document.getElementById("message-input");
        if (!input) return;
        const text = input.value.trim();

        if (!text || !this.activeCharacterId) return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messages = StorageManager.getMessages(this.activeCharacterId);

        messages.push({
            sender: "sent",
            text: text,
            time: currentTime
        });

        StorageManager.saveMessages(this.activeCharacterId, messages);
        input.value = "";
        this.renderMessages();
        
        if (typeof AppManager !== 'undefined' && AppManager.renderContacts) {
            AppManager.renderContacts();
        }

        // Trigger AI reply after 1 second
        setTimeout(() => {
            this.triggerMockReply();
        }, 1000);
    },

    async triggerMockReply() {
        if (!this.activeCharacterId) return;
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messages = StorageManager.getMessages(this.activeCharacterId);

        const replyText = (typeof AIService !== 'undefined') ? 
            await AIService.generateReply(this.activeCharacterId, messages) : 
            "Hello! (AI service loading...)";

        messages.push({
            sender: "received",
            text: replyText,
            time: currentTime
        });

        StorageManager.saveMessages(this.activeCharacterId, messages);
        
        if (this.activeCharacterId) {
            this.renderMessages();
            if (typeof AppManager !== 'undefined' && AppManager.renderContacts) {
                AppManager.renderContacts();
            }
        }
    },

    escapeHTML(str) {
        if (!str) return "";
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag)
        );
    }
};
