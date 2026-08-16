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
