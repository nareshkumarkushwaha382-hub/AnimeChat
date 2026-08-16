const StorageManager = {
    STORAGE_KEY: "animeChats",
    CUSTOM_CHARS_KEY: "animeCustomCharacters",

    getConversations() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error("Error reading conversations", e);
            return {};
        }
    },

    saveConversations(conversations) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
        } catch (e) {
            console.error("Error saving conversations", e);
        }
    },

    getMessages(characterId) {
        const convs = this.getConversations();
        return convs[characterId] || this.getDefaultMessages(characterId);
    },

    saveMessages(characterId, messages) {
        const convs = this.getConversations();
        convs[characterId] = messages;
        this.saveConversations(convs);
    },

    getDefaultMessages(characterId) {
        const char = characters[characterId] || CustomCharacterManager.getCustomCharacters()[characterId];
        if (!char) return [];

        const defaultMsgs = [
            {
                sender: "received",
                text: char.lastMessage || "Hello!",
                time: char.lastTime || "Just now"
            }
        ];
        this.saveMessages(characterId, defaultMsgs);
        return defaultMsgs;
    },

    getSavedCustomCharacters() {
        try {
            const data = localStorage.getItem(this.CUSTOM_CHARS_KEY);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    saveCustomCharacter(charObj) {
        const customChars = this.getSavedCustomCharacters();
        customChars[charObj.id] = charObj;
        localStorage.setItem(this.CUSTOM_CHARS_KEY, JSON.stringify(customChars));
    }
};

const CustomCharacterManager = {
    initCustoms() {
        const saved = StorageManager.getSavedCustomCharacters();
        Object.assign(characters, saved);
    },

    createCharacter(name, personality, systemPrompt, avatarSeed) {
        const id = "custom_" + Date.now();
        const newChar = {
            id: id,
            name: name,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${avatarSeed || name}`,
            status: "Online",
            statusType: "online",
            lastMessage: `Hello, I am ${name}.`,
            lastTime: "Just now",
            unread: 0,
            personality: personality,
            systemPrompt: systemPrompt,
            isCustom: true
        };

        StorageManager.saveCustomCharacter(newChar);
        characters[id] = newChar;
        return id;
    }
};
