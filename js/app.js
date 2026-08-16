const AppManager = {
    init() {
        this.renderContacts();
        ChatManager.init();
        this.setupEventListeners();
    },

    renderContacts(filterText = "") {
        const contactsListEl = document.getElementById("contacts-list");
        if (!contactsListEl) return;
        contactsListEl.innerHTML = "";

        // Combine default characters with user custom characters
        const customChars = StorageManager.getSavedCustomCharacters();
        const allCharacters = { ...characters, ...customChars };

        Object.keys(allCharacters).forEach(id => {
            const char = allCharacters[id];
            
            if (filterText && !char.name.toLowerCase().includes(filterText.toLowerCase())) {
                return;
            }

            const messages = StorageManager.getMessages(id);
            const lastMsg = messages.length > 0 ? messages[messages.length - 1].text : char.status;
            const lastTime = messages.length > 0 ? messages[messages.length - 1].time : "";

            const contactItem = document.createElement("div");
            contactItem.classList.add("contact-item");
            contactItem.dataset.id = id;

            if (ChatManager.activeCharacterId === id) {
                contactItem.classList.add("active");
            }

            contactItem.innerHTML = `
                <div class="avatar-container">
                    <img src="${char.avatar}" alt="${char.name}">
                    <span class="status-dot"></span>
                </div>
                <div class="contact-info">
                    <div class="contact-name-row">
                        <h4>${char.name}</h4>
                        <span class="contact-time">${lastTime}</span>
                    </div>
                    <p class="contact-last-msg">${this.escapeHTML(lastMsg)}</p>
                </div>
            `;

            contactItem.addEventListener("click", () => {
                ChatManager.openChat(id);
            });

            contactsListEl.appendChild(contactItem);
        });
    },

    setupEventListeners() {
        // Back button on mobile view
        const backBtn = document.getElementById("back-btn");
        if (backBtn) {
            backBtn.addEventListener("click", () => {
                const sidebar = document.querySelector(".sidebar");
                if (sidebar) sidebar.classList.remove("mobile-hidden");
                document.getElementById("chat-box").classList.add("hidden");
                document.getElementById("chat-welcome").classList.remove("hidden");
                ChatManager.activeCharacterId = null;
                if (typeof RoleplayManager !== 'undefined') {
                    RoleplayManager.updateUI(null);
                }
            });
        }

        // Search contacts
        const searchInput = document.getElementById("search-contacts");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.renderContacts(e.target.value.trim());
            });
        }

        // Roleplay Mode Toggle & Scenario Modal
        const rpToggleBtn = document.getElementById("roleplay-toggle-btn");
        const rpModal = document.getElementById("rp-modal");
        const rpSettingsBtn = document.getElementById("rp-settings-btn");
        const closeRpBtn = document.getElementById("close-rp-modal");
        const rpConfigForm = document.getElementById("rp-config-form");

        if (rpToggleBtn) {
            rpToggleBtn.addEventListener("click", () => {
                if (!ChatManager.activeCharacterId) {
                    alert("Please select a chat first!");
                    return;
                }
                const isActive = RoleplayManager.toggleMode(ChatManager.activeCharacterId);
                if (isActive) {
                    const state = RoleplayManager.getState(ChatManager.activeCharacterId);
                    document.getElementById("rp-scenario").value = state.scenario || "";
                    document.getElementById("rp-setting").value = state.setting || "";
                    document.getElementById("rp-user-role").value = state.userRole || "";
                    document.getElementById("rp-char-role").value = state.charRole || "";
                    if (rpModal) rpModal.classList.remove("hidden");
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
                if (rpModal) rpModal.classList.remove("hidden");
            });
        }

        if (closeRpBtn) {
            closeRpBtn.addEventListener("click", () => {
                if (rpModal) rpModal.classList.add("hidden");
            });
        }

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
                if (rpModal) rpModal.classList.add("hidden");
            });
        }

        // API Settings Modal Listeners
        const settingsBtn = document.getElementById("settings-btn");
        const apiModal = document.getElementById("api-settings-modal");
        const closeApiModal = document.getElementById("close-api-modal");
        const apiForm = document.getElementById("api-settings-form");

        if (settingsBtn) {
            settingsBtn.addEventListener("click", () => {
                const settings = AIService.getSettings();
                document.getElementById("ai-provider").value = settings.provider;
                document.getElementById("api-key-input").value = settings.apiKey;
                document.getElementById("ai-model-input").value = settings.model;
                if (apiModal) apiModal.classList.remove("hidden");
            });
        }

        if (closeApiModal) {
            closeApiModal.addEventListener("click", () => {
                if (apiModal) apiModal.classList.add("hidden");
            });
        }

        if (apiForm) {
            apiForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const provider = document.getElementById("ai-provider").value;
                const apiKey = document.getElementById("api-key-input").value.trim();
                const model = document.getElementById("ai-model-input").value.trim();

                AIService.saveSettings(provider, apiKey, model);
                if (apiModal) apiModal.classList.add("hidden");
                alert("API Settings saved successfully!");
            });
        }

        // Add Custom Character Listeners
        const addCharBtn = document.getElementById("add-char-btn");
        const addCharModal = document.getElementById("add-char-modal");
        const closeAddBtn = document.getElementById("close-add-btn");
        const addCharForm = document.getElementById("add-char-form");

        if (addCharBtn) {
            addCharBtn.addEventListener("click", () => {
                if (addCharModal) addCharModal.classList.remove("hidden");
            });
        }

        if (closeAddBtn) {
            closeAddBtn.addEventListener("click", () => {
                if (addCharModal) addCharModal.classList.add("hidden");
            });
        }

        if (addCharForm) {
            addCharForm.addEventListener("submit", (e) => {
                e.preventDefault();
                
                const name = document.getElementById("new-char-name").value.trim();
                const personality = document.getElementById("new-char-personality").value.trim();
                const prompt = document.getElementById("new-char-prompt").value.trim();
                
                if (!name) return;

                const id = "custom_" + Date.now();
                const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

                const newChar = {
                    name: name,
                    avatar: avatarUrl,
                    status: "Online",
                    personality: personality,
                    prompt: prompt
                };

                StorageManager.saveCustomCharacter(id, newChar);
                
                addCharForm.reset();
                if (addCharModal) addCharModal.classList.add("hidden");
                
                AppManager.renderContacts();
                ChatManager.openChat(id);
            });
        }

        // Character Info Modal Listeners
        const infoBtn = document.getElementById("char-info-btn");
        const infoModal = document.getElementById("char-info-modal");
        const closeInfoBtn = document.getElementById("close-info-btn");

        if (infoBtn) {
            infoBtn.addEventListener("click", () => {
                if (!ChatManager.activeCharacterId) return;
                const char = (typeof characters !== 'undefined' && characters[ChatManager.activeCharacterId]) || 
                             (typeof StorageManager !== 'undefined' && StorageManager.getSavedCustomCharacters()[ChatManager.activeCharacterId]);
                
                if (!char) return;

                document.getElementById("modal-avatar-img").src = char.avatar;
                document.getElementById("modal-char-name").textContent = char.name;
                document.getElementById("modal-char-status").textContent = char.status || "Online";
                document.getElementById("modal-char-personality").textContent = char.personality || "No personality specified.";
                document.getElementById("modal-char-prompt").textContent = char.prompt || "No system prompt specified.";

                if (infoModal) infoModal.classList.remove("hidden");
            });
        }

        if (closeInfoBtn) {
            closeInfoBtn.addEventListener("click", () => {
                if (infoModal) infoModal.classList.add("hidden");
            });
        }

        // Clear Chat History Listener
        const clearChatBtn = document.getElementById("clear-chat-btn");
        if (clearChatBtn) {
            clearChatBtn.addEventListener("click", () => {
                ChatManager.clearHistory();
            });
        }
    },

    escapeHTML(str) {
        if (!str) return "";
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[tag] || tag)
        );
    }
};

document.addEventListener("DOMContentLoaded", () => {
    AppManager.init();
});
