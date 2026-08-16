const StorageManager = {
    // --- Chat Messages Storage ---
    getMessages(characterId) {
        if (!characterId) return [];
        const data = localStorage.getItem("anime_chat_" + characterId);
        return data ? JSON.parse(data) : [];
    },

    saveMessages(characterId, messages) {
        if (!characterId) return;
        localStorage.setItem("anime_chat_" + characterId, JSON.stringify(messages));
    },

    // --- Custom Characters Storage ---
    getSavedCustomCharacters() {
        try {
            const data = localStorage.getItem("anime_custom_chars");
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    saveCustomCharacter(id, charData) {
        const chars = this.getSavedCustomCharacters();
        chars[id] = charData;
        localStorage.setItem("anime_custom_chars", JSON.stringify(chars));
    }
};
