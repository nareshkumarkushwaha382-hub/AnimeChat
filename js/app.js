const AppManager = {
    init() {
        this.renderContacts();
        this.setupEventListeners();
        ChatManager.init();
    },

    renderContacts(filter = "") {
        const contactsListEl = document.getElementById("contacts-list");
        contactsListEl.innerHTML = "";

        const conversations = StorageManager.getConversations();

        Object.values(characters).forEach(char => {
            // Apply search filter if present
            if (filter && !char.name.toLowerCase().includes(filter.toLowerCase())) {
                return;
            }

            // Get last message from storage or character default
            const charMessages = conversations[char.id] || [];
            const lastMsgObj = charMessages.length > 0 ? charMessages[charMessages.length - 1] : { text: char.lastMessage, time: char.lastTime };

            const contactItem = document.createElement("div");
            contactItem.classList.add("contact-item");
            contactItem.dataset.id = char.id;

            if (ChatManager.activeCharacterId === char.id) {
                contactItem.classList.add("active");
            }

            contactItem.innerHTML = `
                <div class="avatar-container">
                    <img src="${char.avatar}" alt="${char.name}">
                    <span class="status-dot"></span>
                </div>
                <div class="contact-info-preview">
                    <div class="contact-header-row">
                        <span class="contact-name">${char.name}</span>
                        <span class="contact-time">${lastMsgObj.time || ''}</span>
                    </div>
                    <div class="contact-preview-row">
                        <span class="contact-last-msg">${lastMsgObj.text}</span>
                        ${char.unread > 0 ? `<span class="unread-badge">${char.unread}</span>` : ''}
                    </div>
                </div>
            `;

            contactItem.addEventListener("click", () => {
                ChatManager.openChat(char.id);
            });

            contactsListEl.appendChild(contactItem);
        });
    },

    setupEventListeners() {
        // Search filter
        const searchInput = document.getElementById("search-contacts");
        searchInput.addEventListener("input", (e) => {
            this.renderContacts(e.target.value.trim());
        });

        // Mobile back button
        const backBtn = document.getElementById("back-btn");
        backBtn.addEventListener("click", () => {
            document.querySelector(".sidebar").classList.remove("mobile-hidden");
            document.getElementById("chat-box").classList.add("hidden");
            document.getElementById("chat-welcome").classList.remove("hidden");
            ChatManager.activeCharacterId = null;
            
            document.querySelectorAll(".contact-item").forEach(item => item.classList.remove("active"));
        });
    }
};

// Initialize App when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    AppManager.init();
});
