diff --git a/script.js b/script.js
index 524e4fa2fd3603d4a0807e154c264bd9438c5924..82965413e8e95d6c07512aeee6675522be7a93d5 100644
--- a/script.js
+++ b/script.js
@@ -1,1107 +1,516 @@
 /*=====================================================
-  AnimeChat v2.0 Final
-  Part 3A
+  AnimeChat v1.0 Final
+  Clean JavaScript rewrite matching index.html
 =====================================================*/
 
 "use strict";
 
-/*=====================================================
-  APP STATE
-=====================================================*/
-
-const App = {
-    version: "2.0",
-    currentChat: "Gojo",
-    typing: false,
-    darkMode: true
-};
-
-/*=====================================================
-  CHARACTER DATABASE
-=====================================================*/
-
-const Characters = {
-
-    Gojo:{
-        avatar:"👑",
-        status:"Online",
-        reply:"You actually surprised me."
-    },
-
-    Rem:{
-        avatar:"💙",
-        status:"Online",
-        reply:"Rem is always beside you."
-    },
-
-    Subaru:{
-        avatar:"⚔️",
-        status:"Online",
-        reply:"Let's do our best!"
-    },
-
-    Friend:{
-        avatar:"👤",
-        status:"Online",
-        reply:"Hey!"
+(() => {
+    const STORAGE_KEYS = {
+        chats: "animechat_chats",
+        contacts: "animechat_contacts",
+        profile: "animechat_profile",
+        theme: "animechat_theme"
+    };
+
+    const DEFAULT_CHARACTERS = {
+        Gojo: {
+            avatar: "👑",
+            status: "Online",
+            reply: "You actually surprised me. Want to keep chatting?"
+        },
+        Rem: {
+            avatar: "💙",
+            status: "Online",
+            reply: "Rem is here to support you, always."
+        },
+        Subaru: {
+            avatar: "⚔️",
+            status: "Online",
+            reply: "Let's think carefully and do our best!"
+        },
+        Friend: {
+            avatar: "👤",
+            status: "Online",
+            reply: "Hey! What's up?"
+        }
+    };
+
+    const DEFAULT_CONTACTS = ["Gojo", "Rem", "Subaru", "Friend"];
+
+    const INITIAL_MESSAGES = {
+        Gojo: "Nice to meet you.",
+        Rem: "Rem is here to support you.",
+        Subaru: "Let's think carefully.",
+        Friend: "Hey! What's up?"
+    };
+
+    const state = {
+        currentChat: "Gojo",
+        characters: { ...DEFAULT_CHARACTERS },
+        contacts: [],
+        chats: {},
+        profile: {
+            name: "Your Name",
+            avatar: "👤",
+            status: "Available",
+            bio: ""
+        },
+        callSeconds: 0,
+        callTimerId: null,
+        botReplyTimerId: null,
+        notificationsEnabled: true
+    };
+
+    const $ = (id) => document.getElementById(id);
+
+    const dom = {};
+
+    function cacheDom() {
+        [
+            "loadingScreen", "contactList", "messages", "chatName", "chatAvatar", "chatStatus",
+            "messageInput", "sendButton", "search", "typingIndicator", "profileButton",
+            "settingsButton", "newChat", "emojiButton", "attachButton", "emojiPicker",
+            "attachmentMenu", "closeEmoji", "closeAttachment", "chatMenu", "chatOptions",
+            "closeChatMenu", "clearChat", "deleteChat", "exportChat", "pinChat",
+            "profilePage", "settingsPage", "addContactPage", "aiPage", "callPage",
+            "incomingCallPage", "profileAvatar", "profileName", "profileStatus", "usernameInput",
+            "bioInput", "statusInput", "saveProfile", "editProfile", "themeButton",
+            "notificationButton", "privacyButton", "backupButton", "aboutButton", "newContactName",
+            "newContactAvatar", "saveContact", "voiceCall", "videoCall", "endCall",
+            "muteCall", "speakerCall", "videoToggle", "callAvatar", "callName", "callStatus",
+            "callTimer", "incomingCaller", "acceptCall", "declineCall", "notification",
+            "notificationText", "modalBackdrop", "ringtone", "messageSound", "backButton",
+            "chatTab", "friendsTab", "aiTab"
+        ].forEach((id) => {
+            dom[id] = $(id);
+        });
     }
 
-};
-
-/*=====================================================
-  STORAGE
-=====================================================*/
-
-const STORAGE = {
-
-    chats:"animechat_chats",
-
-    contacts:"animechat_contacts",
-
-    profile:"animechat_profile"
-
-};
-
-/*=====================================================
-  DATA
-=====================================================*/
-
-let Chats = {};
-
-let Contacts = [];
-
-let Profile = {
-
-    name:"You",
-
-    avatar:"👤",
-
-    status:"Available"
-
-};
-
-/*=====================================================
-  DOM
-=====================================================*/
-
-const contactList = document.getElementById("contactList");
-
-const messages = document.getElementById("messages");
-
-const chatName = document.getElementById("chatName");
-
-const chatAvatar = document.getElementById("chatAvatar");
-
-const chatStatus = document.getElementById("chatStatus");
-
-const messageInput = document.getElementById("messageInput");
-
-const sendButton = document.getElementById("sendButton");
-
-const search = document.getElementById("search");
-
-const typingIndicator = document.getElementById("typingIndicator");
-
-/*=====================================================
-  SAFETY CHECK
-=====================================================*/
-
-const required = [
-
-contactList,
-
-messages,
-
-chatName,
-
-chatAvatar,
-
-chatStatus,
-
-messageInput,
-
-sendButton
-
-];
-
-if(required.includes(null)){
-
-alert("AnimeChat Error: HTML IDs do not match JavaScript.");
-
-throw new Error("Required HTML element missing.");
-
-}
-
-/*=====================================================
-  TIME
-=====================================================*/
-
-function getTime(){
-
-return new Date().toLocaleTimeString([],{
-
-hour:"2-digit",
-
-minute:"2-digit"
-
-});
-
-}
-
-/*=====================================================
-  SAVE
-=====================================================*/
-
-function saveData(){
-
-localStorage.setItem(
-
-STORAGE.chats,
-
-JSON.stringify(Chats)
-
-);
-
-localStorage.setItem(
-
-STORAGE.contacts,
-
-JSON.stringify(Contacts)
-
-);
-
-localStorage.setItem(
-
-STORAGE.profile,
-
-JSON.stringify(Profile)
-
-);
-
-}
-
-/*=====================================================
-  LOAD
-=====================================================*/
-
-function loadData(){
-
-Chats =
-
-JSON.parse(
-
-localStorage.getItem(STORAGE.chats)
-
-) || {};
-
-Contacts =
-
-JSON.parse(
-
-localStorage.getItem(STORAGE.contacts)
-
-) || [];
-
-Profile =
-
-JSON.parse(
-
-localStorage.getItem(STORAGE.profile)
-
-) || Profile;
-
-}
-
-/*=====================================================
-  FIRST START
-=====================================================*/
-
-function createDefaultData(){
-
-if(Contacts.length>0){
-
-return;
-
-}
-
-Contacts=[
-
-"Gojo",
-
-"Rem",
-
-"Subaru",
-
-"Friend"
-
-];
-
-Contacts.forEach(name=>{
-
-Chats[name]=[
-
-{
-
-sender:"bot",
-
-text:Characters[name].reply,
-
-time:getTime()
-
-}
-
-];
-
-});
-
-saveData();
-
-}
-
-/*=====================================================
-  STARTUP
-=====================================================*/
-
-function initialize(){
-
-loadData();
-
-createDefaultData();
-
-console.log("AnimeChat v2.0 Initialized");
-
-}
-
-window.addEventListener("load",initialize);
-/*=====================================================
-  PART 3B
-  CHAT ENGINE
-=====================================================*/
-
-/*=====================================================
-  CONTACT LIST
-=====================================================*/
-
-function renderContacts(){
-
-contactList.innerHTML="";
-
-Contacts.forEach(name=>{
-
-const character=Characters[name];
-
-const lastMessage=Chats[name][Chats[name].length-1];
-
-const contact=document.createElement("div");
-
-contact.className="contact";
-
-if(name===App.currentChat){
-
-contact.classList.add("active");
-
-}
-
-contact.dataset.name=name;
-
-contact.innerHTML=`
-
-<div class="avatar">${character.avatar}</div>
-
-<div class="contactInfo">
-
-<h3>${name}</h3>
-
-<p class="lastMessage">${lastMessage.text}</p>
-
-</div>
-
-<span class="contactTime">
-
-${lastMessage.time}
-
-</span>
-
-`;
-
-contact.addEventListener("click",()=>{
-
-openChat(name);
-
-});
-
-contactList.appendChild(contact);
-
-});
-
-}
-
-/*=====================================================
-  OPEN CHAT
-=====================================================*/
-
-function openChat(name){
-
-App.currentChat=name;
-
-chatName.textContent=name;
-
-chatAvatar.textContent=Characters[name].avatar;
-
-chatStatus.textContent=Characters[name].status;
-
-renderMessages();
-
-renderContacts();
-
-}
-
-/*=====================================================
-  RENDER MESSAGES
-=====================================================*/
-
-function renderMessages(){
-
-messages.innerHTML="";
-
-Chats[App.currentChat].forEach(message=>{
-
-addMessage(
-
-message.sender,
-
-message.text,
-
-message.time
-
-);
-
-});
-
-messages.scrollTop=
-
-messages.scrollHeight;
-
-}
-
-/*=====================================================
-  ADD MESSAGE
-=====================================================*/
-
-function addMessage(sender,text,time){
-
-const bubble=document.createElement("div");
-
-bubble.className=
-
-sender==="user"
-
-?
-
-"message user"
-
-:
-
-"message bot";
-
-bubble.innerHTML=`
-
-<div class="messageText">
-
-${text}
-
-</div>
-
-<div class="messageTime">
-
-${time}
-
-</div>
-
-`;
-
-messages.appendChild(bubble);
-
-}
-
-/*=====================================================
-  SEND MESSAGE
-=====================================================*/
-
-function sendMessage(){
-
-const text=
-
-messageInput.value.trim();
+    function requireElements() {
+        const requiredIds = [
+            "contactList", "messages", "chatName", "chatAvatar", "chatStatus",
+            "messageInput", "sendButton", "search", "typingIndicator"
+        ];
+        const missing = requiredIds.filter((id) => !dom[id]);
+        if (missing.length) {
+            throw new Error(`AnimeChat HTML mismatch. Missing: ${missing.join(", ")}`);
+        }
+    }
 
-if(text==="") return;
+    function getTime() {
+        return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
+    }
 
-const message={
+    function readStorage(key) {
+        try {
+            return window.localStorage.getItem(key);
+        } catch {
+            return null;
+        }
+    }
 
-sender:"user",
+    function writeStorage(key, value) {
+        try {
+            window.localStorage.setItem(key, value);
+        } catch {
+            // GitHub Pages and privacy-mode browsers should still run without persisted data.
+        }
+    }
 
-text:text,
+    function readJson(key, fallback) {
+        try {
+            const saved = readStorage(key);
+            return saved ? JSON.parse(saved) : fallback;
+        } catch {
+            return fallback;
+        }
+    }
 
-time:getTime()
+    function saveData() {
+        writeStorage(STORAGE_KEYS.chats, JSON.stringify(state.chats));
+        writeStorage(STORAGE_KEYS.contacts, JSON.stringify(state.contacts));
+        writeStorage(STORAGE_KEYS.profile, JSON.stringify(state.profile));
+    }
 
-};
+    function loadData() {
+        state.contacts = readJson(STORAGE_KEYS.contacts, []);
+        state.chats = readJson(STORAGE_KEYS.chats, {});
+        state.profile = { ...state.profile, ...readJson(STORAGE_KEYS.profile, {}) };
 
-Chats[App.currentChat].push(message);
+        state.contacts.forEach((name) => {
+            if (!state.characters[name]) {
+                state.characters[name] = { avatar: "👤", status: "Online", reply: "Hello!" };
+            }
+        });
+    }
 
-addMessage(
+    function seedData() {
+        if (!state.contacts.length) {
+            state.contacts = [...DEFAULT_CONTACTS];
+        }
+
+        state.contacts.forEach((name) => {
+            if (!state.characters[name]) {
+                state.characters[name] = { avatar: "👤", status: "Online", reply: "Hello!" };
+            }
+            if (!Array.isArray(state.chats[name])) {
+                state.chats[name] = [{ sender: "bot", text: INITIAL_MESSAGES[name] || "Hello!", time: getTime() }];
+            }
+        });
+
+        if (!state.contacts.includes(state.currentChat)) {
+            state.currentChat = state.contacts[0] || "Gojo";
+        }
+
+        saveData();
+    }
 
-message.sender,
+    function escapeHtml(value) {
+        return String(value).replace(/[&<>'"]/g, (char) => ({
+            "&": "&amp;",
+            "<": "&lt;",
+            ">": "&gt;",
+            "'": "&#39;",
+            '"': "&quot;"
+        }[char]));
+    }
 
-message.text,
+    function notify(text) {
+        if (!dom.notification || !dom.notificationText || !state.notificationsEnabled) return;
+        dom.notificationText.textContent = text;
+        dom.notification.classList.remove("hidden");
+        window.clearTimeout(dom.notification.hideTimer);
+        dom.notification.hideTimer = window.setTimeout(() => dom.notification.classList.add("hidden"), 2400);
+    }
 
-message.time
+    function playSound(audio) {
+        if (!audio) return;
+        audio.currentTime = 0;
+        audio.play().catch(() => undefined);
+    }
 
-);
+    function currentCharacter() {
+        return state.characters[state.currentChat] || { avatar: "👤", status: "Online", reply: "Hello!" };
+    }
 
-messageInput.value="";
+    function renderContacts(filter = dom.search?.value || "") {
+        const query = filter.trim().toLowerCase();
+        dom.contactList.innerHTML = "";
+
+        state.contacts
+            .filter((name) => name.toLowerCase().includes(query))
+            .forEach((name) => {
+                const character = state.characters[name] || { avatar: "👤" };
+                const chat = state.chats[name] || [];
+                const lastMessage = chat[chat.length - 1] || { text: "No messages yet", time: "" };
+                const contact = document.createElement("button");
+                contact.type = "button";
+                contact.className = `contact${name === state.currentChat ? " active" : ""}`;
+                contact.dataset.name = name;
+                contact.innerHTML = `
+                    <div class="avatar">${escapeHtml(character.avatar)}</div>
+                    <div class="contactInfo">
+                        <h3>${escapeHtml(name)}</h3>
+                        <p class="lastMessage">${escapeHtml(lastMessage.text)}</p>
+                    </div>
+                    <span class="contactTime">${escapeHtml(lastMessage.time)}</span>
+                `;
+                contact.addEventListener("click", () => openChat(name));
+                dom.contactList.appendChild(contact);
+            });
+    }
 
-saveData();
+    function addMessage(message) {
+        const bubble = document.createElement("div");
+        bubble.className = `message ${message.sender === "user" ? "user" : "bot"}`;
+        bubble.innerHTML = `
+            <div class="messageText">${escapeHtml(message.text)}</div>
+            <div class="msgTime">${escapeHtml(message.time)}</div>
+        `;
+        dom.messages.appendChild(bubble);
+    }
 
-messages.scrollTop=
+    function renderMessages() {
+        dom.messages.innerHTML = "";
+        (state.chats[state.currentChat] || []).forEach(addMessage);
+        dom.messages.scrollTop = dom.messages.scrollHeight;
+    }
 
-messages.scrollHeight;
+    function openChat(name) {
+        if (!state.contacts.includes(name)) return;
+        state.currentChat = name;
+        const character = currentCharacter();
+        dom.chatName.textContent = name;
+        dom.chatAvatar.textContent = character.avatar;
+        dom.chatStatus.textContent = character.status;
+        hideTyping();
+        renderMessages();
+        renderContacts();
+        closeAllPages();
+        closePopups();
+    }
 
-showTyping();
+    function hideTyping() {
+        dom.typingIndicator.classList.add("hidden");
+    }
 
-setTimeout(botReply,1000);
+    function showTyping() {
+        dom.typingIndicator.classList.remove("hidden");
+    }
 
-}
+    function sendMessage() {
+        const text = dom.messageInput.value.trim();
+        if (!text) return;
+
+        const message = { sender: "user", text, time: getTime() };
+        state.chats[state.currentChat].push(message);
+        dom.messageInput.value = "";
+        addMessage(message);
+        saveData();
+        renderContacts();
+        dom.messages.scrollTop = dom.messages.scrollHeight;
+        playSound(dom.messageSound);
+        queueBotReply();
+    }
 
-/*=====================================================
-  BOT REPLY
-=====================================================*/
+    function queueBotReply() {
+        window.clearTimeout(state.botReplyTimerId);
+        showTyping();
+        state.botReplyTimerId = window.setTimeout(() => {
+            hideTyping();
+            const reply = { sender: "bot", text: currentCharacter().reply, time: getTime() };
+            state.chats[state.currentChat].push(reply);
+            addMessage(reply);
+            saveData();
+            renderContacts();
+            dom.messages.scrollTop = dom.messages.scrollHeight;
+            playSound(dom.messageSound);
+        }, 900);
+    }
 
-function botReply(){
+    function closePopups() {
+        [dom.emojiPicker, dom.attachmentMenu, dom.chatOptions].forEach((popup) => popup?.classList.add("hidden"));
+        dom.modalBackdrop?.classList.add("hidden");
+    }
 
-hideTyping();
+    function togglePopup(popup) {
+        const willOpen = popup.classList.contains("hidden");
+        closePopups();
+        if (willOpen) {
+            popup.classList.remove("hidden");
+            dom.modalBackdrop?.classList.remove("hidden");
+        }
+    }
 
-const reply={
+    function openPage(page) {
+        closePopups();
+        document.querySelectorAll(".page").forEach((item) => item.classList.remove("active"));
+        page.classList.add("active");
+    }
 
-sender:"bot",
+    function closeAllPages() {
+        document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
+    }
 
-text:Characters[App.currentChat].reply,
+    function loadProfilePage() {
+        dom.profileAvatar.textContent = state.profile.avatar;
+        dom.profileName.textContent = state.profile.name;
+        dom.profileStatus.textContent = state.profile.status;
+        dom.usernameInput.value = state.profile.name;
+        dom.bioInput.value = state.profile.bio || "";
+        dom.statusInput.value = state.profile.status;
+    }
 
-time:getTime()
+    function saveProfile() {
+        state.profile.name = dom.usernameInput.value.trim() || "Your Name";
+        state.profile.status = dom.statusInput.value.trim() || "Available";
+        state.profile.bio = dom.bioInput.value.trim();
+        loadProfilePage();
+        saveData();
+        notify("Profile saved");
+    }
 
-};
+    function addContact() {
+        const name = dom.newContactName.value.trim();
+        const avatar = dom.newContactAvatar.value.trim() || "👤";
+        if (!name) {
+            notify("Enter a contact name");
+            return;
+        }
+        if (state.contacts.includes(name)) {
+            notify("Contact already exists");
+            return;
+        }
+        state.characters[name] = { avatar, status: "Online", reply: "Hello!" };
+        state.contacts.push(name);
+        state.chats[name] = [{ sender: "bot", text: "Hello!", time: getTime() }];
+        dom.newContactName.value = "";
+        dom.newContactAvatar.value = "";
+        saveData();
+        renderContacts();
+        openChat(name);
+        notify("Contact added");
+    }
 
-Chats[App.currentChat].push(reply);
+    function clearCurrentChat() {
+        state.chats[state.currentChat] = [];
+        saveData();
+        renderMessages();
+        renderContacts();
+        closePopups();
+        notify("Chat cleared");
+    }
 
-addMessage(
+    function deleteCurrentChat() {
+        if (DEFAULT_CONTACTS.includes(state.currentChat)) {
+            notify("Default contacts cannot be deleted");
+            return;
+        }
+        delete state.chats[state.currentChat];
+        state.contacts = state.contacts.filter((name) => name !== state.currentChat);
+        saveData();
+        renderContacts();
+        openChat(state.contacts[0] || "Gojo");
+        notify("Contact deleted");
+    }
 
-reply.sender,
+    function pinCurrentChat() {
+        state.contacts = state.contacts.filter((name) => name !== state.currentChat);
+        state.contacts.unshift(state.currentChat);
+        saveData();
+        renderContacts();
+        closePopups();
+        notify("Chat pinned");
+    }
 
-reply.text,
+    function exportCurrentChat() {
+        const content = (state.chats[state.currentChat] || [])
+            .map((message) => `[${message.time}] ${message.sender}: ${message.text}`)
+            .join("\n");
+        const blob = new Blob([content], { type: "text/plain" });
+        const url = URL.createObjectURL(blob);
+        const link = document.createElement("a");
+        link.href = url;
+        link.download = `${state.currentChat}.txt`;
+        link.click();
+        URL.revokeObjectURL(url);
+        closePopups();
+        notify("Chat exported");
+    }
 
-reply.time
+    function startCall(type) {
+        const character = currentCharacter();
+        dom.callAvatar.textContent = character.avatar;
+        dom.callName.textContent = state.currentChat;
+        dom.callStatus.textContent = type === "video" ? "Video Calling..." : "Voice Calling...";
+        openPage(dom.callPage);
+        startCallTimer();
+        dom.ringtone?.play().catch(() => undefined);
+    }
 
-);
+    function startCallTimer() {
+        window.clearInterval(state.callTimerId);
+        state.callSeconds = 0;
+        dom.callTimer.textContent = "00:00";
+        state.callTimerId = window.setInterval(() => {
+            state.callSeconds += 1;
+            const minutes = String(Math.floor(state.callSeconds / 60)).padStart(2, "0");
+            const seconds = String(state.callSeconds % 60).padStart(2, "0");
+            dom.callTimer.textContent = `${minutes}:${seconds}`;
+        }, 1000);
+    }
 
-saveData();
+    function endCall() {
+        window.clearInterval(state.callTimerId);
+        state.callTimerId = null;
+        dom.callTimer.textContent = "00:00";
+        dom.ringtone?.pause();
+        if (dom.ringtone) dom.ringtone.currentTime = 0;
+        closeAllPages();
+        notify("Call ended");
+    }
 
-renderContacts();
+    function setTheme(mode) {
+        document.body.classList.toggle("light", mode === "light");
+        writeStorage(STORAGE_KEYS.theme, mode);
+        if (dom.themeButton) {
+            dom.themeButton.textContent = mode === "light" ? "☀️ Light Mode" : "🌙 Dark Mode";
+        }
+    }
 
-messages.scrollTop=
+    function bindEvents() {
+        dom.sendButton.addEventListener("click", sendMessage);
+        dom.messageInput.addEventListener("keydown", (event) => {
+            if (event.key === "Enter") sendMessage();
+        });
+        dom.search.addEventListener("input", () => renderContacts());
+        dom.emojiButton?.addEventListener("click", () => togglePopup(dom.emojiPicker));
+        dom.attachButton?.addEventListener("click", () => togglePopup(dom.attachmentMenu));
+        dom.closeEmoji?.addEventListener("click", closePopups);
+        dom.closeAttachment?.addEventListener("click", closePopups);
+        dom.chatMenu?.addEventListener("click", () => togglePopup(dom.chatOptions));
+        dom.closeChatMenu?.addEventListener("click", closePopups);
+        dom.modalBackdrop?.addEventListener("click", closePopups);
+        document.querySelectorAll(".emojiGrid span").forEach((emoji) => {
+            emoji.addEventListener("click", () => {
+                dom.messageInput.value += emoji.textContent;
+                dom.messageInput.focus();
+            });
+        });
+        document.querySelectorAll(".attachmentItem").forEach((item) => {
+            item.addEventListener("click", () => {
+                notify(`${item.textContent.trim()} attachments are coming soon`);
+                closePopups();
+            });
+        });
+        dom.profileButton?.addEventListener("click", () => { loadProfilePage(); openPage(dom.profilePage); });
+        dom.settingsButton?.addEventListener("click", () => openPage(dom.settingsPage));
+        dom.newChat?.addEventListener("click", () => openPage(dom.addContactPage));
+        dom.aiTab?.addEventListener("click", () => openPage(dom.aiPage));
+        dom.chatTab?.addEventListener("click", closeAllPages);
+        dom.friendsTab?.addEventListener("click", () => notify("Friends view is coming soon"));
+        document.querySelectorAll(".closePage").forEach((button) => button.addEventListener("click", closeAllPages));
+        document.querySelectorAll(".selectAI").forEach((button) => button.addEventListener("click", () => openChat(button.dataset.character)));
+        dom.saveProfile?.addEventListener("click", saveProfile);
+        dom.editProfile?.addEventListener("click", () => dom.usernameInput?.focus());
+        dom.saveContact?.addEventListener("click", addContact);
+        dom.clearChat?.addEventListener("click", clearCurrentChat);
+        dom.deleteChat?.addEventListener("click", deleteCurrentChat);
+        dom.pinChat?.addEventListener("click", pinCurrentChat);
+        dom.exportChat?.addEventListener("click", exportCurrentChat);
+        dom.voiceCall?.addEventListener("click", () => startCall("voice"));
+        dom.videoCall?.addEventListener("click", () => startCall("video"));
+        dom.endCall?.addEventListener("click", endCall);
+        dom.muteCall?.addEventListener("click", () => notify("Mute toggled"));
+        dom.speakerCall?.addEventListener("click", () => notify("Speaker toggled"));
+        dom.videoToggle?.addEventListener("click", () => notify("Video toggled"));
+        dom.acceptCall?.addEventListener("click", () => startCall("voice"));
+        dom.declineCall?.addEventListener("click", () => { closeAllPages(); notify("Call declined"); });
+        dom.backButton?.addEventListener("click", () => document.querySelector(".sidebar")?.classList.remove("hide"));
+        dom.themeButton?.addEventListener("click", () => setTheme(document.body.classList.contains("light") ? "dark" : "light"));
+        dom.notificationButton?.addEventListener("click", () => {
+            state.notificationsEnabled = !state.notificationsEnabled;
+            notify(state.notificationsEnabled ? "Notifications enabled" : "Notifications disabled");
+        });
+        dom.privacyButton?.addEventListener("click", () => notify("Privacy settings are coming soon"));
+        dom.backupButton?.addEventListener("click", saveData);
+        dom.aboutButton?.addEventListener("click", () => notify("AnimeChat v1.0 Final"));
+    }
 
-messages.scrollHeight;
-
-}
-
-/*=====================================================
-  TYPING
-=====================================================*/
-
-function showTyping(){
-
-typingIndicator.classList.remove("hidden");
-
-}
-
-function hideTyping(){
-
-typingIndicator.classList.add("hidden");
-
-}
-
-/*=====================================================
-  SEARCH
-=====================================================*/
-
-search.addEventListener("input",()=>{
-
-const value=
-
-search.value.toLowerCase();
-
-document.querySelectorAll(".contact").forEach(contact=>{
-
-contact.style.display=
-
-contact.dataset.name
-
-.toLowerCase()
-
-.includes(value)
-
-?
-
-"flex"
-
-:
-
-"none";
-
-});
-
-});
-
-/*=====================================================
-  EVENTS
-=====================================================*/
-
-sendButton.addEventListener(
-
-"click",
-
-sendMessage
-
-);
-
-messageInput.addEventListener(
-
-"keydown",
-
-event=>{
-
-if(event.key==="Enter"){
-
-sendMessage();
-
-}
-
-});
-
-/*=====================================================
-  START CHAT
-=====================================================*/
-
-window.addEventListener("load",()=>{
-
-renderContacts();
-
-openChat(App.currentChat);
-
-});
-/*=====================================================
-  PART 3C
-  PROFILE • SETTINGS • ADD CONTACT
-=====================================================*/
-
-/*=====================================================
-  DOM
-=====================================================*/
-
-const profileButton=document.getElementById("profileButton");
-const profilePage=document.getElementById("profilePage");
-
-const settingsButton=document.getElementById("settingsButton");
-const settingsPage=document.getElementById("settingsPage");
-
-const addContactPage=document.getElementById("addContactPage");
-const newChatButton=document.getElementById("newChat");
-
-const saveContactButton=document.getElementById("saveContact");
-
-const usernameInput=document.getElementById("usernameInput");
-const bioInput=document.getElementById("bioInput");
-const statusInput=document.getElementById("statusInput");
-
-const profileName=document.getElementById("profileName");
-const profileAvatar=document.getElementById("profileAvatar");
-const profileStatus=document.getElementById("profileStatus");
-
-const saveProfileButton=document.getElementById("saveProfile");
-
-const themeButton=document.getElementById("themeButton");
-
-/*=====================================================
-  OPEN PAGES
-=====================================================*/
-
-profileButton.addEventListener("click",()=>{
-
-loadProfile();
-
-profilePage.classList.add("active");
-
-});
-
-settingsButton.addEventListener("click",()=>{
-
-settingsPage.classList.add("active");
-
-});
-
-newChatButton.addEventListener("click",()=>{
-
-addContactPage.classList.add("active");
-
-});
-
-/*=====================================================
-  CLOSE PAGES
-=====================================================*/
-
-document.querySelectorAll(".closePage").forEach(button=>{
-
-button.addEventListener("click",()=>{
-
-document.querySelectorAll(".page").forEach(page=>{
-
-page.classList.remove("active");
-
-});
-
-});
-
-});
-
-/*=====================================================
-  PROFILE
-=====================================================*/
-
-function loadProfile(){
-
-profileName.textContent=Profile.name;
-
-profileAvatar.textContent=Profile.avatar;
-
-profileStatus.textContent=Profile.status;
-
-usernameInput.value=Profile.name;
-
-bioInput.value=Profile.bio||"";
-
-statusInput.value=Profile.status;
-
-}
-
-saveProfileButton.addEventListener("click",()=>{
-
-Profile.name=usernameInput.value.trim()||"You";
-
-Profile.status=statusInput.value.trim()||"Available";
-
-Profile.bio=bioInput.value.trim();
-
-profileName.textContent=Profile.name;
-
-profileAvatar.textContent=Profile.avatar;
-
-profileStatus.textContent=Profile.status;
-
-saveData();
-
-alert("Profile Saved");
-
-});
-
-/*=====================================================
-  ADD CONTACT
-=====================================================*/
-
-saveContactButton.addEventListener("click",()=>{
-
-const name=document
-.getElementById("newContactName")
-.value.trim();
-
-const avatar=document
-.getElementById("newContactAvatar")
-.value.trim()||"👤";
-
-if(name===""){
-
-alert("Enter contact name");
-
-return;
-
-}
-
-if(Characters[name]){
-
-alert("Contact already exists");
-
-return;
-
-}
-
-Characters[name]={
-
-avatar:avatar,
-
-status:"Online",
-
-reply:"Hello!"
-
-};
-
-Contacts.push(name);
-
-Chats[name]=[
-
-{
-
-sender:"bot",
-
-text:"Hello!",
-
-time:getTime()
-
-}
-
-];
-
-saveData();
-
-renderContacts();
-
-document.getElementById("newContactName").value="";
-
-document.getElementById("newContactAvatar").value="";
-
-addContactPage.classList.remove("active");
-
-alert("Contact Added");
-
-});
-
-/*=====================================================
-  DARK MODE
-=====================================================*/
-
-themeButton.addEventListener("click",()=>{
-
-document.body.classList.toggle("light");
-
-App.darkMode=!App.darkMode;
-
-});
-
-/*=====================================================
-  AI PAGE
-=====================================================*/
-
-const aiTab=document.getElementById("aiTab");
-
-const aiPage=document.getElementById("aiPage");
-
-aiTab.addEventListener("click",()=>{
-
-aiPage.classList.add("active");
-
-});
-
-document.querySelectorAll(".selectAI").forEach(button=>{
-
-button.addEventListener("click",()=>{
-
-const character=button.dataset.character;
-
-if(Characters[character]){
-
-openChat(character);
-
-}
-
-aiPage.classList.remove("active");
-
-});
-
-});
-
-/*=====================================================
-  COMPLETE
-=====================================================*/
-
-console.log("Part 3C Loaded");
-/*=====================================================
-  PART 3D
-  CALLS • CHAT MENU • NOTIFICATIONS • UTILITIES
-=====================================================*/
-
-/*=====================================================
-  DOM
-=====================================================*/
-
-const callPage=document.getElementById("callPage");
-const callName=document.getElementById("callName");
-const callStatus=document.getElementById("callStatus");
-const callAvatar=document.getElementById("callAvatar");
-const callTimer=document.getElementById("callTimer");
-
-const voiceCall=document.getElementById("voiceCall");
-const videoCall=document.getElementById("videoCall");
-const endCall=document.getElementById("endCall");
-
-const incomingCallPage=document.getElementById("incomingCallPage");
-const incomingCaller=document.getElementById("incomingCaller");
-const acceptCall=document.getElementById("acceptCall");
-const declineCall=document.getElementById("declineCall");
-
-const notification=document.getElementById("notification");
-const notificationText=document.getElementById("notificationText");
-
-const clearChat=document.getElementById("clearChat");
-const deleteChat=document.getElementById("deleteChat");
-const exportChat=document.getElementById("exportChat");
-const pinChat=document.getElementById("pinChat");
-
-const chatMenu=document.getElementById("chatMenu");
-const chatOptions=document.getElementById("chatOptions");
-const closeChatMenu=document.getElementById("closeChatMenu");
-
-/*=====================================================
-  NOTIFICATION
-=====================================================*/
-
-function notify(text){
-
-notificationText.textContent=text;
-
-notification.classList.remove("hidden");
-
-setTimeout(()=>{
-
-notification.classList.add("hidden");
-
-},2500);
-
-}
-
-/*=====================================================
-  CHAT MENU
-=====================================================*/
-
-chatMenu.addEventListener("click",()=>{
-
-chatOptions.classList.toggle("hidden");
-
-});
-
-closeChatMenu.addEventListener("click",()=>{
-
-chatOptions.classList.add("hidden");
-
-});
-
-/*=====================================================
-  CHAT OPTIONS
-=====================================================*/
-
-clearChat.addEventListener("click",()=>{
-
-Chats[App.currentChat]=[];
-
-saveData();
-
-renderMessages();
-
-renderContacts();
-
-notify("Chat Cleared");
-
-});
-
-deleteChat.addEventListener("click",()=>{
-
-if(App.currentChat==="Gojo"){
-
-notify("Default contact cannot be deleted");
-
-return;
-
-}
-
-delete Chats[App.currentChat];
-
-Contacts=Contacts.filter(name=>name!==App.currentChat);
-
-saveData();
-
-renderContacts();
-
-openChat("Gojo");
-
-notify("Contact Deleted");
-
-});
-
-pinChat.addEventListener("click",()=>{
-
-Contacts=Contacts.filter(name=>name!==App.currentChat);
-
-Contacts.unshift(App.currentChat);
-
-saveData();
-
-renderContacts();
-
-notify("Pinned");
-
-});
-
-exportChat.addEventListener("click",()=>{
-
-const text=Chats[App.currentChat]
-
-.map(msg=>`[${msg.time}] ${msg.sender}: ${msg.text}`)
-
-.join("\n");
-
-const blob=new Blob([text],{type:"text/plain"});
-
-const url=URL.createObjectURL(blob);
-
-const link=document.createElement("a");
-
-link.href=url;
-
-link.download=App.currentChat+".txt";
-
-link.click();
-
-URL.revokeObjectURL(url);
-
-notify("Chat Exported");
-
-});
-
-/*=====================================================
-  CALL SYSTEM
-=====================================================*/
-
-let seconds=0;
-
-let timer=null;
-
-function startTimer(){
-
-clearInterval(timer);
-
-seconds=0;
-
-callTimer.textContent="00:00";
-
-timer=setInterval(()=>{
-
-seconds++;
-
-const m=String(Math.floor(seconds/60)).padStart(2,"0");
-
-const s=String(seconds%60).padStart(2,"0");
-
-callTimer.textContent=`${m}:${s}`;
-
-},1000);
-
-}
-
-function stopTimer(){
-
-clearInterval(timer);
-
-callTimer.textContent="00:00";
-
-}
-
-function startCall(type){
-
-callPage.classList.add("active");
-
-callAvatar.textContent=Characters[App.currentChat].avatar;
-
-callName.textContent=App.currentChat;
-
-callStatus.textContent=
-
-type==="video"
-
-?
-
-"Video Calling..."
-
-:
-
-"Voice Calling...";
-
-startTimer();
-
-}
-
-voiceCall.addEventListener("click",()=>{
-
-startCall("voice");
-
-});
-
-videoCall.addEventListener("click",()=>{
-
-startCall("video");
-
-});
-
-endCall.addEventListener("click",()=>{
-
-callPage.classList.remove("active");
-
-stopTimer();
-
-notify("Call Ended");
-
-});
-
-/*=====================================================
-  INCOMING CALL
-=====================================================*/
-
-function incomingCall(name){
-
-incomingCaller.textContent=name;
-
-incomingCallPage.classList.add("active");
-
-}
-
-acceptCall.addEventListener("click",()=>{
-
-incomingCallPage.classList.remove("active");
-
-startCall("voice");
-
-});
-
-declineCall.addEventListener("click",()=>{
-
-incomingCallPage.classList.remove("active");
-
-notify("Call Declined");
-
-});
-
-/*=====================================================
-  READY
-=====================================================*/
-
-window.addEventListener("load",()=>{
-
-notify("AnimeChat Ready");
-
-console.log("AnimeChat v2.0 Final Loaded");
+    function boot() {
+        cacheDom();
+        requireElements();
+        loadData();
+        seedData();
+        setTheme(readStorage(STORAGE_KEYS.theme) || "dark");
+        bindEvents();
+        renderContacts();
+        openChat(state.currentChat);
+        loadProfilePage();
+        dom.loadingScreen?.classList.add("hidden");
+        notify("AnimeChat ready");
+    }
 
-});
+    document.addEventListener("DOMContentLoaded", boot, { once: true });
+})();


