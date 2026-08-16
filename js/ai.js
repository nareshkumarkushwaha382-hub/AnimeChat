const AIService = {
    getSettings() {
        return {
            provider: localStorage.getItem("anime_ai_provider") || "openrouter",
            apiKey: localStorage.getItem("anime_ai_key") || "",
            model: localStorage.getItem("anime_ai_model") || "openai/gpt-4o-mini"
        };
    },

    saveSettings(provider, apiKey, model) {
        localStorage.setItem("anime_ai_provider", provider);
        localStorage.setItem("anime_ai_key", apiKey);
        localStorage.setItem("anime_ai_model", model);
    },

    async generateReply(characterId, messagesList) {
        const char = (typeof characters !== 'undefined' && characters[characterId]) || 
                     (typeof StorageManager !== 'undefined' && StorageManager.getSavedCustomCharacters()[characterId]) || 
                     { name: "Character", personality: "Friendly", prompt: "You are a helpful assistant." };

        const settings = this.getSettings();

        // If no API key is saved, fall back to smart mock generator
        if (!settings.apiKey) {
            const lastMsg = messagesList.length > 0 ? messagesList[messagesList.length - 1].text : "";
            return this.getMockFallback(characterId, lastMsg, char);
        }

        // Build System Prompt
        let systemPrompt = char.prompt || `You are ${char.name}. Personality: ${char.personality}`;
        
        const rpState = (typeof RoleplayManager !== 'undefined') ? RoleplayManager.getState(characterId) : { active: false };
        if (rpState.active) {
            systemPrompt += `\n\nROLEPLAY MODE ACTIVE:\n- Scenario: ${rpState.scenario || 'General chat'}\n- Setting: ${rpState.setting || 'Not specified'}\n- Your Role: ${rpState.charRole || char.name}\n- User Role: ${rpState.userRole || 'Traveler'}\nStay strictly in character and adhere to this scene.`;
        }

        // Format messages for OpenAI / OpenRouter API
        const formattedMessages = [
            { role: "system", content: systemPrompt },
            ...messagesList.map(m => ({
                role: m.sender === "sent" ? "user" : "assistant",
                content: m.text
            }))
        ];

        try {
            let endpoint = "https://openrouter.ai/api/v1/chat/completions";
            let headers = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${settings.apiKey}`
            };

            if (settings.provider === "openai") {
                endpoint = "https://api.openai.com/v1/chat/completions";
            } else {
                headers["HTTP-Referer"] = window.location.origin;
                headers["X-Title"] = "AnimeChat App";
            }

            const response = await fetch(endpoint, {
                method: "POST",
                headers: headers,
                body: JSON.stringify({
                    model: settings.model || "openai/gpt-4o-mini",
                    messages: formattedMessages,
                    temperature: 0.8
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();

        } catch (error) {
            console.error("AI API Error:", error);
            return `[API Error]: ${error.message}. (Falling back to offline mode). Check your API Key in settings.`;
        }
    },

    getMockFallback(characterId, userMessage, char) {
        const msgLower = (userMessage || "").toLowerCase();
        const rpState = (typeof RoleplayManager !== 'undefined') ? RoleplayManager.getState(characterId) : { active: false };

        if (rpState.active) {
            return `[Roleplay Mode - ${char.name}]: *Responds to "${userMessage}" within the scene.* (Add your API key in settings for full LLM generation!)`;
        }

        if (characterId === "rem") {
            return `Subaru-kun... I heard you say: "${userMessage}". (Tip: Add your AI API key in Settings for real LLM chat!)`;
        }
        if (characterId === "gojo") {
            return `Yo! You said: "${userMessage}". Pretty fun, right? (Set up your API key in settings for live AI!).`;
        }
        return `[${char.name}]: I received: "${userMessage}". Add your AI API key in Settings for full generation!`;
    }
};
