const RoleplayManager = {
    STORAGE_PREFIX: "anime_rp_",

    getState(characterId) {
        if (!characterId) return { active: false, scenario: "", setting: "", userRole: "", charRole: "" };
        try {
            const data = localStorage.getItem(this.STORAGE_PREFIX + characterId);
            return data ? JSON.parse(data) : { active: false, scenario: "", setting: "", userRole: "", charRole: "" };
        } catch (e) {
            return { active: false, scenario: "", setting: "", userRole: "", charRole: "" };
        }
    },

    saveState(characterId, state) {
        if (!characterId) return;
        localStorage.setItem(this.STORAGE_PREFIX + characterId, JSON.stringify(state));
    },

    toggleMode(characterId) {
        const state = this.getState(characterId);
        state.active = !state.active;
        this.saveState(characterId, state);
        this.updateUI(characterId);
        return state.active;
    },

    updateUI(characterId) {
        const header = document.querySelector(".chat-header");
        const rpBanner = document.getElementById("rp-active-banner");
        const rpBtn = document.getElementById("roleplay-toggle-btn");

        if (!characterId) {
            if (rpBanner) rpBanner.classList.add("hidden");
            return;
        }

        const state = this.getState(characterId);

        if (rpBtn) {
            if (state.active) {
                rpBtn.classList.add("rp-active-indicator");
                rpBtn.title = "Roleplay Mode Active (Click to configure)";
            } else {
                rpBtn.classList.remove("rp-active-indicator");
                rpBtn.title = "Roleplay Mode";
            }
        }

        if (rpBanner) {
            if (state.active) {
                rpBanner.classList.remove("hidden");
                const desc = document.getElementById("rp-banner-desc");
                if (desc) {
                    desc.textContent = state.scenario ? `Scenario: ${state.scenario}` : `Roleplay Mode Active (Click gear to set scenario)`;
                }
            } else {
                rpBanner.classList.add("hidden");
            }
        }
    }
};
