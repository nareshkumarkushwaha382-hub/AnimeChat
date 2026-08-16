const ChatManager = {
    activeCharacterId: null,

    init() {
        // Event listeners for sending messages
        const sendBtn = document.getElementById("send-btn");
        const messageInput = document.getElementById("message-input");

        sendBtn.addEventListener("click", () => this.handleSendMessage());
        messageInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                this.handleSendMessage();
            }
        });
    },

    openChat(characterId) {
        this.activeCharacterId = characterId;
        const char = characters[characterId];
        if (!char) return;

        // Update Header UI
        document.getElementById("active-name").textContent = char.name;
        document.getElementById("active-status").textContent = char.status;
        document.getElementById("active-avatar").src = char.avatar;

        // Switch views on mobile / desktop
        document.getElementById("chat-welcome").classList.add("hidden");
        document.getElementById("chat-box").classList.remove("hidden");

        if (window.innerWidth <= 768) {
            document.querySelector(".sidebar").classList.add("mobile-hidden");
        }

        // Highlight active contact in list
        document.querySelectorAll(".contact-item").forEach(item => {
            item.classList.remove("active");
            if (item.dataset.id === characterId) {
                item.classList.add("active");
            }
        });

        // Render messages
        this.renderMessages();
    },

    renderMessages() {
        const container = document.getElementById("messages-container");
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

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    },

    handleSendMessage() {
        const input = document.getElementById("message-input");
        const text = input.value.trim();

        if (!text || !this.activeCharacterId) return;

        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Get current messages
        const messages = StorageManager.getMessages(this.activeCharacterId);

        // Add user message
        messages.push({
            sender: "sent",
            text: text,
            time: currentTime
        });

        StorageManager.saveMessages(this.activeCharacterId, messages);
        input.value = "";
        this.renderMessages();
        AppManager.renderContacts(); // Update preview in sidebar

        // Simulate Character AI Response (Phase 1 Mock Reply)
        setTimeout(() => {
            this.triggerMockReply();
        }, 1000);
    },

    triggerMockReply() {
        if (!this.activeCharacterId) return;
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messages = StorageManager.getMessages(this.activeCharacterId);
        const lastUserMsg = messages.length > 0 ? messages[messages.length - 1].text : "";

        // Generate intelligent reply using our AI service & character personality
        const replyText = AIService.generateReply(this.activeCharacterId, lastUserMsg);

        messages.push({
            sender: "received",
            text: replyText,
            time: currentTime
        });

        StorageManager.saveMessages(this.activeCharacterId, messages);
        
        if (this.activeCharacterId) {
            this.renderMessages();
            AppManager.renderContacts();
        }
    },

        const randomReply = mockResponses[Math.floor(Math.random() * mockResponses.length)];

        const messages = StorageManager.getMessages(this.activeCharacterId);
        messages.push({
            sender: "received",
            text: randomReply,
            time: currentTime
        });

        StorageManager.saveMessages(this.activeCharacterId, messages);
        
        // Only re-render if still in the same chat
        if (this.activeCharacterId) {
            this.renderMessages();
            AppManager.renderContacts();
        }
    },

    escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag)
        );
    }
};
