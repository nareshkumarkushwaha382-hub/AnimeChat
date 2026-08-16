const AppManager = {
    init() {
        CustomCharacterManager.initCustoms();
        this.renderContacts();
        this.setupEventListeners();
        ChatManager.init();
    },

    renderContacts(filter = "") {
        const contactsListEl = document.getElementById("contacts-list");
        contactsListEl.innerHTML = "";

        const conversations = StorageManager.getConversations();

        Object.values(characters).forEach(char => {
            if (filter && !char.name.toLowerCase().includes(filter.toLowerCase())) {
                return;
            }

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
        // Roleplay Mode Toggle & Scenario Modal
        const rpToggleBtn = document.getElementById("roleplay-toggle-btn");
        const rpModal = document.getElementById("rp-modal");
        const rpSettingsBtn = document.getElementById("rp-settings-btn");

        if (rpToggleBtn) {
            rpToggleBtn.addEventListener("click", () => {
                if (!ChatManager.activeCharacterId) return;
                const isActive = RoleplayManager.toggleMode(ChatManager.activeCharacterId);
                if (isActive) {
                    // Open modal on first activate to let user set scenario
                    const state = RoleplayManager.getState(ChatManager.activeCharacterId);
                    document.getElementById("rp-scenario").value = state.scenario || "";
                    document.getElementById("rp-setting").value = state.setting || "";
                    document.getElementById("rp-user-role").value = state.userRole || "";
                    document.getElementById("rp-char-role").value = state.charRole || "";
                    rpModal.classList.remove("hidden");
                }
            });
        }

        if (rpSettingsBtn) {
            rpSettingsBtn.addEventListener("click", () => {
                if (!ChatManager.activeCharacterId) return;
                const state = RoleplayManager.getState(ChatManager.activeCharacterId);
                document.getElementById("rp-scenario").value = state.scenario || "";
                document.getElementById("rp-setting").value = state.setting || "";
                document.getElementById("rp-user-role").value = state.userRole || "";
                document.getElementById("rp-char-role").value = state.charRole || "";
                rpModal.classList.remove("hidden");
            });
        }

        const closeRpBtn = document.getElementById("close-rp-modal");
        if (closeRpBtn) {
            closeRpBtn.addEventListener("click", () => rpModal.classList.add("hidden"));
        }

        const rpConfigForm = document.getElementById("rp-config-form");
        if (rpConfigForm) {
            rpConfigForm.addEventListener("submit", (e) => {
                e.preventDefault();
                if (!ChatManager.activeCharacterId) return;

                const newState = {
                    active: true,
                    scenario: document.getElementById("rp-scenario").value.trim(),
                    setting: document.getElementById("rp-setting").value.trim(),
                    userRole: document.getElementById("rp-user-role").value.trim(),
                    charRole: document.getElementById("rp-char-role").value.trim()
                };

                RoleplayManager.saveState(ChatManager.activeCharacterId, newState);
                RoleplayManager.updateUI(ChatManager.activeCharacterId);
                rpModal.classList.add("hidden");
            });
        }
        
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

        // Add character button in sidebar header
        const sidebarActions = document.querySelector(".sidebar-actions");
        const addBtn = document.createElement("button");
        addBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i>';
        addBtn.title = "Add Custom Character";
        addBtn.id = "open-add-char-modal";
        sidebarActions.prepend(addBtn);

        // Add Character Modal events
        const addModal = document.getElementById("add-char-modal");
        addBtn.addEventListener("click", () => addModal.classList.remove("hidden"));
        document.getElementById("close-add-btn").addEventListener("click", () => addModal.classList.add("hidden"));

        document.getElementById("add-char-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("new-char-name").value.trim();
            const personality = document.getElementById("new-char-personality").value.trim();
            const prompt = document.getElementById("new-char-prompt").value.trim();

            const newId = CustomCharacterManager.createCharacter(name, personality, prompt);
            addModal.classList.add("hidden");
            document.getElementById("add-char-form").reset();
            this.renderContacts();
            ChatManager.openChat(newId);
        });

        // Character Info Modal events from Chat Header
        const infoModal = document.getElementById("char-info-modal");
        const contactInfoSection = document.querySelector(".chat-contact-info");
        
        contactInfoSection.style.cursor = "pointer";
        contactInfoSection.title = "View Character Profile";
        contactInfoSection.addEventListener("click", () => {
            if (!ChatManager.activeCharacterId) return;
            const char = characters[ChatManager.activeCharacterId];
            if (!char) return;

            document.getElementById("modal-avatar-img").src = char.avatar;
            document.getElementById("modal-char-name").textContent = char.name;
            document.getElementById("modal-char-status").textContent = char.status;
            document.getElementById("modal-char-personality").textContent = char.personality || "No personality defined.";
            document.getElementById("modal-char-prompt").textContent = char.systemPrompt || "No system prompt defined.";

            infoModal.classList.remove("hidden");
        });

        document.getElementById("close-info-btn").addEventListener("click", () => infoModal.classList.add("hidden"));
    }
};

document.addEventListener("DOMContentLoaded", () => {
    AppManager.init();
});
