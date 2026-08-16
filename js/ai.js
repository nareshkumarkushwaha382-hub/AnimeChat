const AIService = {
    generateReply(characterId, userMessage) {
        // Safely find the character from global objects or localStorage backup
        const char = (typeof characters !== 'undefined' && characters[characterId]) || 
                     (typeof StorageManager !== 'undefined' && StorageManager.getSavedCustomCharacters()[characterId]) || 
                     { name: "Character", personality: "Friendly" };

        const msgLower = (userMessage || "").toLowerCase();

        // Preset anime character personalities
        if (characterId === "rem") {
            if (msgLower.includes("hello") || msgLower.includes("hi")) {
                return "Subaru-kun... ah, welcome! How can Rem be of service to you today?";
            }
            if (msgLower.includes("help") || msgLower.includes("assist")) {
                return "Please leave everything to Rem! I will protect you no matter what happens.";
            }
            return `As Rem, I am listening closely to your words: "${userMessage}". Is there anything troubling you?`;
        }

        if (characterId === "gojo") {
            if (msgLower.includes("hello") || msgLower.includes("hi")) {
                return "Yo! What's up? Need the strongest on your side today?";
            }
            if (msgLower.includes("strong") || msgLower.includes("fight")) {
                return "Nah, I'd win. Don't sweat it!";
            }
            return `Haha, interesting! You said: "${userMessage}". Want to grab some Kikufuku sweets later?`;
        }

        if (characterId === "subaru") {
            if (msgLower.includes("hello") || msgLower.includes("hi")) {
                return "Hey there! Ready to take on whatever fate throws at us today!";
            }
            return `I hear you! "${userMessage}" — we've gotta stay positive and find a way forward!`;
        }

        if (characterId === "emilia") {
            if (msgLower.includes("hello") || msgLower.includes("hi")) {
                return "Hello there! It's so nice to speak with you today.";
            }
            return `Thank you for sharing that with me. I appreciate your kindness!`;
        }

        // Fallback for custom characters
        return `[${char.name}]: I received your message: "${userMessage}". My personality is: ${char.personality || 'Friendly and ready to chat.'}`;
    }
};
