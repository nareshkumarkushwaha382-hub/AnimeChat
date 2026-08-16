const StorageManager = {
    STORAGE_KEY: "animeChats",

    // Get all conversations or initialize if empty
    getConversations() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error("Error reading from localStorage", e);
            return {};
        }
    },

    // Save full conversation state
    saveConversations(conversations) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
        } catch (e) {
            console.error("Error writing to localStorage", e);
        }
    },

    // Get messages for a specific character ID
    getMessages(characterId) {
        const convs = this.getConversations();
        return convs[characterId] || this.getDefaultMessages(characterId);
    },

    // Save messages for a specific character ID
    saveMessages(characterId, messages) {
        const convs = this.getConversations();
        convs[characterId] = messages;
        this.saveConversations(convs);
    },

    // Default starter messages if none exist yet
    getDefaultMessages(characterId) {
        const char = characters[characterId];
        if (!char) return [];

        const defaultMsgs = [
            {
                sender: "received",
                text: char.lastMessage,
                time: char.lastTime || "Just now"
            }
        ];
        this.saveMessages(characterId, defaultMsgs);
        return defaultMsgs;
    }
};
